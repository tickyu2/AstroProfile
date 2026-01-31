/**
 * ProfileSummaryBox - Spreadsheet-style Profile Summary
 *
 * Displays profile data in a tabular format for quick comparison:
 * Name | Day | Birth Date | Age | Moon Phase | Element | Season | Sun | Moon | Rising
 *
 * GENESIS AstroProfile - January 2026
 */

import React from 'react';
import { SIGN_LESSONS, type SignKey } from '../../zodiac/tropicalMap';

// =============================================================================
// TYPES
// =============================================================================

export interface ProfileSummaryData {
  name: string;
  birthDate: string | null;  // ISO date string YYYY-MM-DD
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
}

interface ProfileSummaryBoxProps {
  profileA: ProfileSummaryData;
  profileB?: ProfileSummaryData;  // Optional for self mode
  mode: 'self' | 'compare';
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Get day of week from date
function getDayOfWeek(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr + 'T12:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  } catch {
    return '—';
  }
}

// Calculate age from birth date
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

// Calculate moon phase at birth (simplified lunar cycle calculation)
function getMoonPhase(dateStr: string | null): { phase: string; emoji: string } {
  if (!dateStr) return { phase: '—', emoji: '' };
  try {
    const date = new Date(dateStr + 'T12:00:00');
    // Known new moon: Jan 6, 2000
    const knownNewMoon = new Date('2000-01-06T12:00:00');
    const lunarCycle = 29.53059; // days
    const daysSince = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const lunarAge = ((daysSince % lunarCycle) + lunarCycle) % lunarCycle;

    // 8 phases
    if (lunarAge < 1.85) return { phase: 'New', emoji: '🌑' };
    if (lunarAge < 7.38) return { phase: 'Waxing Cr', emoji: '🌒' };
    if (lunarAge < 11.07) return { phase: '1st Qtr', emoji: '🌓' };
    if (lunarAge < 14.76) return { phase: 'Waxing Gi', emoji: '🌔' };
    if (lunarAge < 18.45) return { phase: 'Full', emoji: '🌕' };
    if (lunarAge < 22.14) return { phase: 'Waning Gi', emoji: '🌖' };
    if (lunarAge < 25.83) return { phase: '3rd Qtr', emoji: '🌗' };
    return { phase: 'Waning Cr', emoji: '🌘' };
  } catch {
    return { phase: '—', emoji: '' };
  }
}

// Get dominant element from Sun/Moon/Rising
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

// Get season position based on modality (Cardinal=Begin, Fixed=Core, Mutable=End)
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

// Format date for display
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Get sign abbreviation
function getSignAbbr(sign: string | null): string {
  if (!sign) return '—';
  const abbrs: Record<string, string> = {
    Aries: 'Ari', Taurus: 'Tau', Gemini: 'Gem', Cancer: 'Can',
    Leo: 'Leo', Virgo: 'Vir', Libra: 'Lib', Scorpio: 'Sco',
    Sagittarius: 'Sag', Capricorn: 'Cap', Aquarius: 'Aqu', Pisces: 'Pis'
  };
  return abbrs[sign] || sign.slice(0, 3);
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ProfileSummaryBox: React.FC<ProfileSummaryBoxProps> = ({
  profileA,
  profileB,
  mode,
}) => {
  const moonA = getMoonPhase(profileA.birthDate);
  const elementA = getDominantElement(profileA.sunSign, profileA.moonSign, profileA.risingSign);
  const seasonA = getSeasonPosition(profileA.sunSign);

  const moonB = profileB ? getMoonPhase(profileB.birthDate) : null;
  const elementB = profileB ? getDominantElement(profileB.sunSign, profileB.moonSign, profileB.risingSign) : null;
  const seasonB = profileB ? getSeasonPosition(profileB.sunSign) : null;

  return (
    <div className="profile-summary-box">
      <table className="summary-table">
        <thead>
          <tr>
            <th className="col-name">Name</th>
            <th className="col-day">Day</th>
            <th className="col-date">Birth Date</th>
            <th className="col-age">Age</th>
            <th className="col-moon">Moon Phase</th>
            <th className="col-element">Element</th>
            <th className="col-season">Season</th>
            <th className="col-sign">☉ Sun</th>
            <th className="col-sign">☽ Moon</th>
            <th className="col-sign">↑ Rising</th>
          </tr>
        </thead>
        <tbody>
          {/* Profile A */}
          <tr className="profile-row profile-a">
            <td className="col-name">{profileA.name}</td>
            <td className="col-day">{getDayOfWeek(profileA.birthDate)}</td>
            <td className="col-date">{formatDate(profileA.birthDate)}</td>
            <td className="col-age">{calculateAge(profileA.birthDate)}</td>
            <td className="col-moon">
              <span className="moon-emoji">{moonA.emoji}</span>
              <span className="moon-phase">{moonA.phase}</span>
            </td>
            <td className="col-element">
              <span className="element-emoji">{elementA.emoji}</span>
              <span className="element-name">{elementA.element}</span>
            </td>
            <td className="col-season">{seasonA}</td>
            <td className="col-sign sun">{getSignAbbr(profileA.sunSign)}</td>
            <td className="col-sign moon">{getSignAbbr(profileA.moonSign)}</td>
            <td className="col-sign rising">{getSignAbbr(profileA.risingSign)}</td>
          </tr>

          {/* Profile B (if compare mode) */}
          {mode === 'compare' && profileB && (
            <tr className="profile-row profile-b">
              <td className="col-name">{profileB.name}</td>
              <td className="col-day">{getDayOfWeek(profileB.birthDate)}</td>
              <td className="col-date">{formatDate(profileB.birthDate)}</td>
              <td className="col-age">{calculateAge(profileB.birthDate)}</td>
              <td className="col-moon">
                <span className="moon-emoji">{moonB?.emoji}</span>
                <span className="moon-phase">{moonB?.phase}</span>
              </td>
              <td className="col-element">
                <span className="element-emoji">{elementB?.emoji}</span>
                <span className="element-name">{elementB?.element}</span>
              </td>
              <td className="col-season">{seasonB}</td>
              <td className="col-sign sun">{getSignAbbr(profileB.sunSign)}</td>
              <td className="col-sign moon">{getSignAbbr(profileB.moonSign)}</td>
              <td className="col-sign rising">{getSignAbbr(profileB.risingSign)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <style>{`
        .profile-summary-box {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 16px;
          overflow-x: auto;
        }

        .summary-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          white-space: nowrap;
        }

        .summary-table th {
          padding: 6px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 10px;
          text-transform: uppercase;
          color: #9ca3af;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
        }

        .summary-table td {
          padding: 8px;
          color: #e5e7eb;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .profile-row.profile-a {
          background: rgba(251, 191, 36, 0.05);
        }

        .profile-row.profile-b {
          background: rgba(168, 85, 247, 0.05);
        }

        .col-name {
          font-weight: 600;
          color: #fff;
          min-width: 80px;
        }

        .col-day {
          color: #9ca3af;
          min-width: 40px;
        }

        .col-date {
          color: #d1d5db;
          min-width: 100px;
        }

        .col-age {
          text-align: center;
          color: #60a5fa;
          font-weight: 600;
          min-width: 40px;
        }

        .col-moon {
          min-width: 90px;
        }

        .moon-emoji {
          margin-right: 4px;
        }

        .moon-phase {
          color: #c4b5fd;
          font-size: 11px;
        }

        .col-element {
          min-width: 70px;
        }

        .element-emoji {
          margin-right: 4px;
        }

        .element-name {
          font-weight: 500;
        }

        .col-season {
          min-width: 50px;
          font-size: 11px;
          color: #86efac;
        }

        .col-sign {
          text-align: center;
          font-weight: 600;
          min-width: 50px;
        }

        .col-sign.sun { color: #fbbf24; }
        .col-sign.moon { color: #c4b5fd; }
        .col-sign.rising { color: #60a5fa; }

        /* Responsive - stack on small screens */
        @media (max-width: 768px) {
          .summary-table {
            font-size: 11px;
          }
          .summary-table th,
          .summary-table td {
            padding: 4px 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileSummaryBox;
