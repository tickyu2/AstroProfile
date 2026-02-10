/**
 * Highlight Explanation Component
 * Shows contextual information about the selected sign/degree
 */

import React from 'react';
import './HighlightExplanation.css';

interface HighlightExplanationProps {
  sign: string;
  degree: number;
  season: string;
  modality: string;
  element: string;
}

export const HighlightExplanation: React.FC<HighlightExplanationProps> = ({
  sign, degree, season, modality, element
}) => {
  const position = degree < 10 ? 'early' : degree < 20 ? 'middle' : 'late';

  return (
    <div className="highlight-explanation">
      <h3 className="highlight-degree">{degree.toFixed(2)}° {sign}</h3>
      <p className="highlight-position">Viewing {position} {sign}</p>
      <div className="highlight-attributes">
        <div className="highlight-attr">
          <span className="attr-label">Season:</span>
          <span className="attr-value season">{season}</span>
        </div>
        <div className="highlight-attr">
          <span className="attr-label">Modality:</span>
          <span className="attr-value modality">{modality}</span>
        </div>
        <div className="highlight-attr">
          <span className="attr-label">Element:</span>
          <span className="attr-value element">{element}</span>
        </div>
      </div>
    </div>
  );
};

export default HighlightExplanation;
