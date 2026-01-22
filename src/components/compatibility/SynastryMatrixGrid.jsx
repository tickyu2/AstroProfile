/**
 * Synastry Matrix Grid
 * Visualizes the 5x5 pillar-to-pillar BaZi compatibility matrix
 *
 * Rows: Person A's pillars (Year, Month, Day, Hour, Day Master)
 * Cols: Person B's pillars (Year, Month, Day, Hour, Day Master)
 * Cells: Interaction type with score and color coding
 */

import React, { useState } from 'react';
import {
  getInteractionDisplay,
  getPillarMeaning,
  getElementDisplay
} from '../../services/baziCompatibilityService';

const PILLAR_LABELS = ['Year', 'Month', 'Day', 'Hour', 'DM'];
const PILLAR_LABELS_CN = ['年', '月', '日', '时', '主'];

export default function SynastryMatrixGrid({
  matrix,
  personAName = 'Person A',
  personBName = 'Person B',
  showChinese = true,
  onCellClick
}) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  if (!matrix || matrix.length === 0) {
    return (
      <div className="text-center text-white/60 py-8">
        No matrix data available
      </div>
    );
  }

  const handleCellClick = (rowIdx, colIdx, cell) => {
    setSelectedCell({ row: rowIdx, col: colIdx, cell });
    if (onCellClick) {
      onCellClick(rowIdx, colIdx, cell);
    }
  };

  return (
    <div className="space-y-4">
      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* Empty corner cell */}
              <th className="p-2 text-xs text-white/40">
                {personAName} \ {personBName}
              </th>
              {/* Column headers (Person B's pillars) */}
              {PILLAR_LABELS.map((label, idx) => (
                <th
                  key={`col-${idx}`}
                  className="p-2 text-center min-w-[60px]"
                >
                  <div className="text-sm font-bold text-pink-300">{label}</div>
                  {showChinese && (
                    <div className="text-xs text-pink-300/60">
                      {PILLAR_LABELS_CN[idx]}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIdx) => (
              <tr key={`row-${rowIdx}`}>
                {/* Row header (Person A's pillar) */}
                <th className="p-2 text-left">
                  <div className="text-sm font-bold text-blue-300">
                    {PILLAR_LABELS[rowIdx]}
                  </div>
                  {showChinese && (
                    <div className="text-xs text-blue-300/60">
                      {PILLAR_LABELS_CN[rowIdx]}
                    </div>
                  )}
                </th>
                {/* Matrix cells */}
                {row.map((cell, colIdx) => {
                  const display = getInteractionDisplay(cell.interaction);
                  const isHovered =
                    hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                  const isSelected =
                    selectedCell?.row === rowIdx && selectedCell?.col === colIdx;

                  return (
                    <td
                      key={`cell-${rowIdx}-${colIdx}`}
                      className={`p-1 text-center border border-white/10 cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-white/50' : ''
                      } ${isHovered ? 'bg-white/10' : ''}`}
                      onMouseEnter={() =>
                        setHoveredCell({ row: rowIdx, col: colIdx })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => handleCellClick(rowIdx, colIdx, cell)}
                    >
                      <MatrixCell cell={cell} display={display} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center py-2 border-t border-white/10">
        <LegendItem type="trine" />
        <LegendItem type="harmony" />
        <LegendItem type="neutral" />
        <LegendItem type="punishment" />
        <LegendItem type="harm" />
        <LegendItem type="clash" />
      </div>

      {/* Selected Cell Detail */}
      {selectedCell && (
        <CellDetail
          cell={selectedCell.cell}
          rowLabel={PILLAR_LABELS[selectedCell.row]}
          colLabel={PILLAR_LABELS[selectedCell.col]}
          personAName={personAName}
          personBName={personBName}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
}

/**
 * Matrix Cell Component
 */
function MatrixCell({ cell, display }) {
  const score = cell.score || 0;
  const scoreColor =
    score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-white/40';

  return (
    <div
      className={`${display.bgColor} rounded p-2 min-h-[50px] flex flex-col items-center justify-center`}
    >
      {/* Interaction indicator */}
      <div className={`text-xs font-bold ${display.textColor}`}>
        {display.labelCN}
      </div>
      {/* Score */}
      <div className={`text-sm font-bold ${scoreColor}`}>
        {score > 0 ? '+' : ''}
        {score}
      </div>
    </div>
  );
}

/**
 * Legend Item Component
 */
function LegendItem({ type }) {
  const display = getInteractionDisplay(type);
  return (
    <div className="flex items-center gap-1">
      <div className={`w-4 h-4 rounded ${display.bgColor}`} />
      <span className="text-xs text-white/60">
        {display.labelCN} {display.label}
      </span>
    </div>
  );
}

/**
 * Cell Detail Panel
 */
function CellDetail({
  cell,
  rowLabel,
  colLabel,
  personAName,
  personBName,
  onClose
}) {
  const display = getInteractionDisplay(cell.interaction);
  const rowMeaning = getPillarMeaning(rowLabel);
  const colMeaning = getPillarMeaning(colLabel);

  return (
    <div className="bg-slate-800/80 rounded-xl p-4 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-300 font-bold">{personAName}'s {rowLabel}</span>
          <span className="text-white/40">↔</span>
          <span className="text-pink-300 font-bold">{personBName}'s {colLabel}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors"
        >
          X
        </button>
      </div>

      {/* Interaction Type */}
      <div
        className={`${display.bgColor} rounded-lg p-4 mb-4 border`}
        style={{ borderColor: display.color }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-lg font-bold ${display.textColor}`}>
            {display.label} ({display.labelCN})
          </span>
          <span
            className={`text-xl font-bold ${
              cell.score > 0
                ? 'text-emerald-400'
                : cell.score < 0
                ? 'text-red-400'
                : 'text-white/40'
            }`}
          >
            {cell.score > 0 ? '+' : ''}
            {cell.score} pts
          </span>
        </div>
        <div className="text-sm text-white/70">{display.description}</div>
      </div>

      {/* Branch Info */}
      {cell.branch_a && cell.branch_b && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-white/60 mb-1">{personAName}'s Branch:</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-300">{cell.branch_a}</span>
              {cell.element_a && (
                <span
                  className="text-sm"
                  style={{ color: getElementDisplay(cell.element_a).color }}
                >
                  ({cell.element_a})
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">{personBName}'s Branch:</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-pink-300">{cell.branch_b}</span>
              {cell.element_b && (
                <span
                  className="text-sm"
                  style={{ color: getElementDisplay(cell.element_b).color }}
                >
                  ({cell.element_b})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      {cell.explanation && (
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-xs text-white/60 mb-1">Analysis:</div>
          <div className="text-sm text-white/80">{cell.explanation}</div>
        </div>
      )}

      {/* Pillar Meanings */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
        <div>
          <div className="text-xs text-white/40 mb-1">{rowLabel} Pillar:</div>
          <div className="text-xs text-white/60">{rowMeaning.meaning}</div>
          <div className="text-xs text-white/40">{rowMeaning.lifeArea}</div>
        </div>
        <div>
          <div className="text-xs text-white/40 mb-1">{colLabel} Pillar:</div>
          <div className="text-xs text-white/60">{colMeaning.meaning}</div>
          <div className="text-xs text-white/40">{colMeaning.lifeArea}</div>
        </div>
      </div>
    </div>
  );
}
