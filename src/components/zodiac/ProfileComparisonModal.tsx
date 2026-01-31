/**
 * ProfileComparisonModal - Draggable Floating Comparison Panel
 *
 * Opens as a floating overlay that can be dragged around:
 * Row labels | Name A | Name B
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SIGN_LESSONS, type SignKey } from '../../zodiac/tropicalMap';

// =============================================================================
// TYPES
// =============================================================================

export interface ProfileComparisonData {
  name: string;
  birthDate: string | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
}

interface ProfileComparisonModalProps {
  profileA: ProfileComparisonData;
  profileB?: ProfileComparisonData;
  isOpen: boolean;
  onClose: () => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getDayOfWeek(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr + 'T12:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  } catch {
    return '—';
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function calculateAge(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const birth = new Date(dateStr + 'T12:00:00');
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  } catch {
    return '—';
  }
}

function getMoonPhase(dateStr: string | null): { phase: string; emoji: string } {
  if (!dateStr) return { phase: '—', emoji: '' };
  try {
    const date = new Date(dateStr + 'T12:00:00');
    const knownNewMoon = new Date('2000-01-06T12:00:00');
    const lunarCycle = 29.53059;
    const daysSince = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const lunarAge = ((daysSince % lunarCycle) + lunarCycle) % lunarCycle;

    if (lunarAge < 1.85) return { phase: 'New Moon', emoji: '🌑' };
    if (lunarAge < 7.38) return { phase: 'Waxing Crescent', emoji: '🌒' };
    if (lunarAge < 11.07) return { phase: 'First Quarter', emoji: '🌓' };
    if (lunarAge < 14.76) return { phase: 'Waxing Gibbous', emoji: '🌔' };
    if (lunarAge < 18.45) return { phase: 'Full Moon', emoji: '🌕' };
    if (lunarAge < 22.14) return { phase: 'Waning Gibbous', emoji: '🌖' };
    if (lunarAge < 25.83) return { phase: 'Third Quarter', emoji: '🌗' };
    return { phase: 'Waning Crescent', emoji: '🌘' };
  } catch {
    return { phase: '—', emoji: '' };
  }
}

function getDominantElement(sun: string | null, moon: string | null, rising: string | null): { element: string; emoji: string } {
  const elements: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };

  [sun, moon, rising].forEach(sign => {
    if (sign && SIGN_LESSONS[sign as SignKey]) {
      const el = SIGN_LESSONS[sign as SignKey].element;
      elements[el] = (elements[el] || 0) + 1;
    }
  });

  const dominant = Object.entries(elements).sort((a, b) => b[1] - a[1])[0];
  const emojis: Record<string, string> = { Fire: '🔥', Earth: '🌍', Air: '💨', Water: '💧' };

  return { element: dominant[0], emoji: emojis[dominant[0]] || '' };
}

function getSeason(sign: string | null): string {
  if (!sign || !SIGN_LESSONS[sign as SignKey]) return '—';
  return SIGN_LESSONS[sign as SignKey].season;
}

function getSeasonPosition(sign: string | null): string {
  if (!sign || !SIGN_LESSONS[sign as SignKey]) return '—';
  const modality = SIGN_LESSONS[sign as SignKey].modality;
  switch (modality) {
    case 'Cardinal': return 'Begin';
    case 'Fixed': return 'Core';
    case 'Mutable': return 'End';
    default: return '—';
  }
}

function getSeasonEmoji(season: string): string {
  const emojis: Record<string, string> = {
    Spring: '🌸',
    Summer: '☀️',
    Autumn: '🍂',
    Winter: '❄️',
  };
  return emojis[season] || '';
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ProfileComparisonModal: React.FC<ProfileComparisonModalProps> = ({
  profileA,
  profileB,
  isOpen,
  onClose,
}) => {
  // Drag state
  const [position, setPosition] = useState({ x: 80, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on header to start drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (modalRef.current) {
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  }, [position]);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        // Keep within viewport bounds
        const maxX = window.innerWidth - 400;
        const maxY = window.innerHeight - 100;
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  const moonA = getMoonPhase(profileA.birthDate);
  const elementA = getDominantElement(profileA.sunSign, profileA.moonSign, profileA.risingSign);
  const seasonA = getSeason(profileA.sunSign);
  const positionA = getSeasonPosition(profileA.sunSign);

  const moonB = profileB ? getMoonPhase(profileB.birthDate) : null;
  const elementB = profileB ? getDominantElement(profileB.sunSign, profileB.moonSign, profileB.risingSign) : null;
  const seasonB = profileB ? getSeason(profileB.sunSign) : null;
  const positionB = profileB ? getSeasonPosition(profileB.sunSign) : null;

  const rows = [
    { label: 'Birth Date', a: formatDate(profileA.birthDate), b: profileB ? formatDate(profileB.birthDate) : null },
    { label: 'Day of Week', a: getDayOfWeek(profileA.birthDate), b: profileB ? getDayOfWeek(profileB.birthDate) : null },
    { label: 'Age', a: calculateAge(profileA.birthDate), b: profileB ? calculateAge(profileB.birthDate) : null },
    { label: 'Moon Phase', a: `${moonA.emoji} ${moonA.phase}`, b: moonB ? `${moonB.emoji} ${moonB.phase}` : null },
    { label: 'Dominant Element', a: `${elementA.emoji} ${elementA.element}`, b: elementB ? `${elementB.emoji} ${elementB.element}` : null },
    { label: 'Season', a: `${getSeasonEmoji(seasonA)} ${seasonA}`, b: seasonB ? `${getSeasonEmoji(seasonB)} ${seasonB}` : null },
    { label: 'Season Position', a: positionA, b: positionB },
    { label: '☉ Sun Sign', a: profileA.sunSign || '—', b: profileB?.sunSign || null, highlight: 'sun' },
    { label: '☽ Moon Sign', a: profileA.moonSign || '—', b: profileB?.moonSign || null, highlight: 'moon' },
    { label: '↑ Rising Sign', a: profileA.risingSign || '—', b: profileB?.risingSign || null, highlight: 'rising' },
  ];

  return (
    <>
      <div
        ref={modalRef}
        className="comparison-floating-panel"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div
          className="panel-drag-header"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="drag-indicator">⋮⋮</div>
          <h2>📊 Profile Comparison</h2>
          <button type="button" className="panel-close" onClick={onClose}>×</button>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="label-col"></th>
                <th className="profile-col profile-a">{profileA.name}</th>
                {profileB && <th className="profile-col profile-b">{profileB.name}</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.highlight ? `highlight-${row.highlight}` : ''}>
                  <td className="label-col">{row.label}</td>
                  <td className="profile-col profile-a">{row.a}</td>
                  {profileB && <td className="profile-col profile-b">{row.b}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .comparison-floating-panel {
          position: fixed;
          z-index: 500;
          background: rgba(15, 23, 42, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1);
          max-width: 420px;
          width: calc(100vw - 40px);
          max-height: 70vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(8px);
          user-select: none;
        }

        .panel-drag-header {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          gap: 8px;
        }

        .drag-indicator {
          color: #6b7280;
          font-size: 14px;
          letter-spacing: 2px;
          padding: 0 4px;
        }

        .panel-drag-header h2 {
          flex: 1;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .panel-close {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #9ca3af;
          font-size: 18px;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .panel-close:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .comparison-table-wrapper {
          overflow-y: auto;
          padding: 12px;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 8px 10px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .comparison-table th {
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .comparison-table th.profile-a {
          color: #fbbf24;
        }

        .comparison-table th.profile-b {
          color: #a855f7;
        }

        .label-col {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          width: 100px;
        }

        .profile-col {
          font-size: 13px;
          color: #e5e7eb;
        }

        .profile-col.profile-a {
          background: rgba(251, 191, 36, 0.03);
        }

        .profile-col.profile-b {
          background: rgba(168, 85, 247, 0.03);
        }

        tr.highlight-sun td.profile-col {
          color: #fbbf24;
          font-weight: 600;
        }

        tr.highlight-moon td.profile-col {
          color: #c4b5fd;
          font-weight: 600;
        }

        tr.highlight-rising td.profile-col {
          color: #60a5fa;
          font-weight: 600;
        }

        .comparison-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </>
  );
};

export default ProfileComparisonModal;
