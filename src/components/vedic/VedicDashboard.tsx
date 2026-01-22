/**
 * VedicDashboard.tsx
 *
 * Unified Vedic astrology dashboard combining:
 * - NakshatraWheel (Moon's lunar mansion)
 * - DashaTimeline (Vimshottari Mahadasha periods)
 * - GrahaDignityGrid (9 planetary dignities)
 *
 * Part of the Cathedral Relationship System
 */

import React from "react";
import NakshatraWheel from "./NakshatraWheel";
import DashaTimeline from "./DashaTimeline";
import GrahaDignityGrid from "./GrahaDignityGrid";
import "./VedicDashboard.css";

interface VedicProfile {
  lagna: {
    sign: string;
    degree: number;
    nakshatra: string;
    pada: number;
    lord: string;
  };
  moon: {
    sign: string;
    degree: number;
    nakshatra: string;
    pada: number;
    lord: string;
  };
  grahas: Array<{
    name: string;
    sign: string;
    degree: number;
    nakshatra: string;
    pada: number;
    house: number;
    dignity: string;
    retrograde?: boolean;
  }>;
  dashas: {
    current: {
      planet: string;
      start: string;
      end: string;
    };
    mahadashas: Array<{
      planet: string;
      start: string;
      end: string;
    }>;
    antardashas?: Array<{
      planet: string;
      start: string;
      end: string;
    }>;
  };
  interpretation?: {
    lagna: string;
    moon: string;
    nakshatra: string;
    dasha: string;
    grahas: Record<string, string>;
    overall: string;
  };
}

interface VedicDashboardProps {
  vedicProfile: VedicProfile;
  showInterpretations?: boolean;
}

const VedicDashboard: React.FC<VedicDashboardProps> = ({
  vedicProfile,
  showInterpretations = true,
}) => {
  const { lagna, moon, dashas, grahas, interpretation } = vedicProfile;

  // Calculate Moon's ecliptic degree for the wheel
  const moonEclipticDegree = calculateEclipticDegree(moon.sign, moon.degree);

  return (
    <div className="vedic-dashboard">
      {/* Header */}
      <div className="vedic-dashboard-header">
        <h1>Vedic Soul Map</h1>
        <div className="vedic-dashboard-summary">
          <span className="lagna-badge">Lagna: {lagna.sign}</span>
          <span className="moon-badge">Moon: {moon.sign} • {moon.nakshatra}</span>
          <span className="dasha-badge">Current Dasha: {dashas.current.planet}</span>
        </div>
      </div>

      {/* Nakshatra Wheel Panel */}
      <div id="vedic-nakshatra" className="vedic-panel">
        <h2>Moon Nakshatra Wheel</h2>
        <p className="panel-subtitle">
          Janma Nakshatra: <strong>{moon.nakshatra}</strong> (Pada {moon.pada})
          • Lord: <strong>{moon.lord}</strong>
        </p>
        <div className="wheel-container">
          <NakshatraWheel
            moonNakshatra={moon.nakshatra}
            moonDegree={moonEclipticDegree}
          />
        </div>
        {showInterpretations && interpretation?.nakshatra && (
          <div className="interpretation-box">
            <p>{interpretation.nakshatra}</p>
          </div>
        )}
      </div>

      {/* Dasha Timeline Panel */}
      <div id="vedic-dasha" className="vedic-panel">
        <h2>Vimshottari Mahadasha Timeline</h2>
        <p className="panel-subtitle">
          Current: <strong>{dashas.current.planet} Mahadasha</strong>
          ({dashas.current.start} – {dashas.current.end})
        </p>
        <DashaTimeline
          dashas={dashas.mahadashas}
          antardashas={dashas.antardashas}
          currentDate={new Date().toISOString().split('T')[0]}
        />
        {showInterpretations && interpretation?.dasha && (
          <div className="interpretation-box">
            <p>{interpretation.dasha}</p>
          </div>
        )}
      </div>

      {/* Graha Dignity Grid Panel */}
      <div id="vedic-grahas" className="vedic-panel">
        <h2>Graha Dignity Grid</h2>
        <p className="panel-subtitle">
          Planetary positions and strength states
        </p>
        <GrahaDignityGrid
          grahas={grahas.map((g) => ({
            name: g.name,
            sign: g.sign,
            degree: g.degree,
            dignity: g.dignity,
            nakshatra: g.nakshatra,
            pada: g.pada,
            house: g.house,
            retrograde: g.retrograde,
          }))}
          showNakshatra={true}
          showHouse={true}
        />
      </div>

      {/* Lagna Interpretation Panel */}
      {showInterpretations && interpretation?.lagna && (
        <div id="vedic-lagna" className="vedic-panel">
          <h2>Lagna (Ascendant) Analysis</h2>
          <p className="panel-subtitle">
            {lagna.sign} Lagna at {lagna.degree.toFixed(2)}° • {lagna.nakshatra} (Pada {lagna.pada})
          </p>
          <div className="interpretation-box">
            <p>{interpretation.lagna}</p>
          </div>
        </div>
      )}

      {/* Overall Synthesis */}
      {showInterpretations && interpretation?.overall && (
        <div id="vedic-synthesis" className="vedic-panel synthesis-panel">
          <h2>Chart Synthesis</h2>
          <div className="interpretation-box highlight">
            <p>{interpretation.overall}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Calculate ecliptic degree from sign and degree within sign
 */
function calculateEclipticDegree(sign: string, degreeInSign: number): number {
  const signOrder = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const signIndex = signOrder.indexOf(sign);
  if (signIndex === -1) return 0;
  return (signIndex * 30) + degreeInSign;
}

export default VedicDashboard;
