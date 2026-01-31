/**
 * Build Synastry Matrix
 *
 * Constructs the full 9-cell synastry matrix between two people.
 * This is the core data structure for compatibility analysis.
 *
 * The 9 cells represent all combinations of Sun/Moon/Rising:
 *
 *           Person B →
 *           Sun    Moon   Rising
 * Person A
 * ↓ Sun     [1]    [2]    [3]
 *   Moon    [4]    [5]    [6]
 *   Rising  [7]    [8]    [9]
 *
 * GENESIS AstroProfile - January 2025
 */

import type {
  PersonTriad,
  RelationshipLens,
  SynastryMatrix,
  SynastryCellKey,
  TriadKey,
} from './types';
import { buildSynastryCell } from './buildCell';

// =============================================================================
// CELL DEFINITIONS
// =============================================================================

/**
 * Definition of all 9 cells in the synastry matrix
 */
interface CellDefinition {
  key: SynastryCellKey;
  a: TriadKey;  // Person A's point
  b: TriadKey;  // Person B's point
}

const CELL_DEFINITIONS: CellDefinition[] = [
  // Row 1: Person A's Sun compared to Person B's points
  { key: 'Sun-Sun', a: 'Sun', b: 'Sun' },
  { key: 'Sun-Moon', a: 'Sun', b: 'Moon' },
  { key: 'Sun-Rising', a: 'Sun', b: 'Rising' },

  // Row 2: Person A's Moon compared to Person B's points
  { key: 'Moon-Sun', a: 'Moon', b: 'Sun' },
  { key: 'Moon-Moon', a: 'Moon', b: 'Moon' },
  { key: 'Moon-Rising', a: 'Moon', b: 'Rising' },

  // Row 3: Person A's Rising compared to Person B's points
  { key: 'Rising-Sun', a: 'Rising', b: 'Sun' },
  { key: 'Rising-Moon', a: 'Rising', b: 'Moon' },
  { key: 'Rising-Rising', a: 'Rising', b: 'Rising' },
];

// =============================================================================
// BUILD SYNASTRY MATRIX
// =============================================================================

/**
 * Build the full 9-cell synastry matrix
 *
 * @param a - Person A's Sun/Moon/Rising signs
 * @param b - Person B's Sun/Moon/Rising signs
 * @param lens - Relationship lens (romantic, best_friend, friend, coworker)
 * @returns Complete synastry matrix with scores for each cell
 */
export function buildSynastryMatrix(
  a: PersonTriad,
  b: PersonTriad,
  lens: RelationshipLens
): SynastryMatrix {
  const matrix = {} as SynastryMatrix;

  for (const def of CELL_DEFINITIONS) {
    matrix[def.key] = buildSynastryCell({
      key: def.key,
      aPoint: def.a,
      aSign: a[def.a],
      bPoint: def.b,
      bSign: b[def.b],
      lens,
    });
  }

  return matrix;
}

// =============================================================================
// MATRIX ACCESSORS
// =============================================================================

/**
 * Get all cell keys in the matrix
 */
export function getAllCellKeys(): SynastryCellKey[] {
  return CELL_DEFINITIONS.map(d => d.key);
}

/**
 * Get cells for a specific row (Person A's point)
 */
export function getRowCells(matrix: SynastryMatrix, aPoint: TriadKey): SynastryCellKey[] {
  return CELL_DEFINITIONS
    .filter(d => d.a === aPoint)
    .map(d => d.key);
}

/**
 * Get cells for a specific column (Person B's point)
 */
export function getColumnCells(matrix: SynastryMatrix, bPoint: TriadKey): SynastryCellKey[] {
  return CELL_DEFINITIONS
    .filter(d => d.b === bPoint)
    .map(d => d.key);
}

/**
 * Get the diagonal cells (Sun-Sun, Moon-Moon, Rising-Rising)
 * These represent "same point" comparisons
 */
export function getDiagonalCells(): SynastryCellKey[] {
  return ['Sun-Sun', 'Moon-Moon', 'Rising-Rising'];
}

/**
 * Get cross cells (non-diagonal)
 * These represent how one person's inner world interacts with another's expression
 */
export function getCrossCells(): SynastryCellKey[] {
  return CELL_DEFINITIONS
    .filter(d => d.a !== d.b)
    .map(d => d.key);
}

// =============================================================================
// MATRIX ANALYSIS
// =============================================================================

/**
 * Get the average score across all cells
 */
export function getMatrixAverageScore(matrix: SynastryMatrix): number {
  const cells = Object.values(matrix);
  const sum = cells.reduce((acc, cell) => acc + cell.score10, 0);
  return sum / cells.length;
}

/**
 * Get the highest scoring cell
 */
export function getStrongestCell(matrix: SynastryMatrix): SynastryCellKey {
  let best: SynastryCellKey = 'Sun-Sun';
  let bestScore = 0;

  for (const [key, cell] of Object.entries(matrix)) {
    if (cell.score10 > bestScore) {
      bestScore = cell.score10;
      best = key as SynastryCellKey;
    }
  }

  return best;
}

/**
 * Get the lowest scoring cell
 */
export function getWeakestCell(matrix: SynastryMatrix): SynastryCellKey {
  let worst: SynastryCellKey = 'Sun-Sun';
  let worstScore = 10;

  for (const [key, cell] of Object.entries(matrix)) {
    if (cell.score10 < worstScore) {
      worstScore = cell.score10;
      worst = key as SynastryCellKey;
    }
  }

  return worst;
}

/**
 * Get cells sorted by score (highest first)
 */
export function getCellsSortedByScore(matrix: SynastryMatrix): SynastryCellKey[] {
  return Object.entries(matrix)
    .sort((a, b) => b[1].score10 - a[1].score10)
    .map(([key]) => key as SynastryCellKey);
}

/**
 * Count cells by score range
 */
export function countCellsByScoreRange(matrix: SynastryMatrix): {
  excellent: number;  // 8-10
  good: number;       // 6-7.9
  moderate: number;   // 4-5.9
  challenging: number; // 0-3.9
} {
  let excellent = 0;
  let good = 0;
  let moderate = 0;
  let challenging = 0;

  for (const cell of Object.values(matrix)) {
    if (cell.score10 >= 8) excellent++;
    else if (cell.score10 >= 6) good++;
    else if (cell.score10 >= 4) moderate++;
    else challenging++;
  }

  return { excellent, good, moderate, challenging };
}

/**
 * Get cells with a specific aspect type
 */
export function getCellsByAspect(
  matrix: SynastryMatrix,
  aspectType: string
): SynastryCellKey[] {
  return Object.entries(matrix)
    .filter(([, cell]) => cell.aspect.type === aspectType)
    .map(([key]) => key as SynastryCellKey);
}

/**
 * Get cells with same element
 */
export function getCellsWithSameElement(matrix: SynastryMatrix): SynastryCellKey[] {
  return Object.entries(matrix)
    .filter(([, cell]) => cell.element.a === cell.element.b)
    .map(([key]) => key as SynastryCellKey);
}

/**
 * Get cells with opposition aspect (these are "cathedral pairs")
 */
export function getOppositionCells(matrix: SynastryMatrix): SynastryCellKey[] {
  return getCellsByAspect(matrix, 'opposition');
}
