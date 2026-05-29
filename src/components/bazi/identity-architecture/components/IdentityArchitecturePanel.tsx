/**
 * IdentityArchitecturePanel — top-level collapsible orchestrator
 *
 * Assembles engine + storybook + cathedral theme + all styles into one panel.
 * Drop this into any page with: <IdentityArchitecturePanel pillars={} alignments={} />
 */

import '../styles/tensionPulse.css';
import '../styles/diagrams.css';
import '../styles/codex.css';
import '../styles/cathedral.css';
import '../styles/destinyPulse.css';

import React, { useState, useMemo } from 'react';
import type { AlignmentData } from '../../../../utils/baziWheels';
import type { BaZiPillar } from '../engine/identityTypes';
import { buildIdentityArchitecture } from '../engine/identityEngine';
import { IdentityStorybook } from './storybook/IdentityStorybook';

interface Props {
  pillars: BaZiPillar[];
  alignments: AlignmentData[];
}

const IdentityArchitecturePanel: React.FC<Props> = ({ pillars, alignments }) => {
  const identity = useMemo(
    () => buildIdentityArchitecture(pillars, alignments),
    [pillars, alignments],
  );

  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setOpen(true)}
          className="cathedral-btn"
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '14px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '16px' }}>{'\u{1F3DB}\uFE0F'}</span>
          Heaven–Earth–Human Identity Architecture
          <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>
            Click to explore
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="cathedral-panel destiny-breath" style={{
      padding: '16px 20px',
      marginBottom: '16px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
      }}>
        <div>
          <div className="cathedral-heading" style={{ fontSize: '15px' }}>
            {'\u{1F3DB}\uFE0F'} Heaven–Earth–Human Identity Architecture
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
            A psychological reading of your BaZi chart's three selves and their tensions.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            background: 'none', border: 'none', color: '#64748b',
            fontSize: '18px', cursor: 'pointer', padding: '4px 8px',
          }}
        >
          {'\u2715'}
        </button>
      </div>

      <hr className="cathedral-divider" />

      <IdentityStorybook identity={identity} pillars={pillars} />
    </div>
  );
};

export default IdentityArchitecturePanel;
