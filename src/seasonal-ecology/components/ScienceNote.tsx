/**
 * Science Note Component
 * Collapsible educational content explaining scientific basis
 */

import React, { useState } from 'react';
import './ScienceNote.css';

interface ScienceNoteProps {
  title?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ScienceNote: React.FC<ScienceNoteProps> = ({
  title = "Science Notes",
  children,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="science-note">
      <div
        className="science-note-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <span className="science-icon">📊</span>
        <span className="science-title">{title}</span>
        <span className="science-toggle">
          {isExpanded ? '▲' : '▼'}
        </span>
      </div>

      {isExpanded && (
        <div className="science-note-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default ScienceNote;
