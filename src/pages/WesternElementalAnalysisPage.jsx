// ============================================================================
// WESTERN ZODIAC ELEMENTAL ANALYSIS PAGE
// ============================================================================
// GOLD STANDARD - Cathedral Quality Implementation
// Features: 0% element psychology, famous examples, cultivation activities
// ============================================================================

import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import WesternElementalPanel from '../components/WesternElementalPanel';

// ============================================================================
// DATA TRANSFORMATION
// ============================================================================

/**
 * Transform profile's sovereignCalculation into birthChart format
 * Expected by WesternElementalPanel: { planets: { sun: { sign, degree }, ... } }
 */
function transformToBirthChart(westernZodiac) {
  if (!westernZodiac) return null;

  const sovereign = westernZodiac.sovereignCalculation || {};

  const planets = {};

  // Sun
  if (sovereign.sun?.sign || westernZodiac.sign) {
    planets.sun = {
      sign: sovereign.sun?.sign || westernZodiac.sign,
      degree: sovereign.sun?.degree || 0
    };
  }

  // Moon
  if (sovereign.moon?.sign) {
    planets.moon = {
      sign: sovereign.moon.sign,
      degree: sovereign.moon.degree || 0
    };
  }

  // Ascendant (rising)
  if (sovereign.rising?.sign) {
    planets.ascendant = {
      sign: sovereign.rising.sign,
      degree: sovereign.rising.degree || 0
    };
  }

  // Mercury
  if (sovereign.mercury?.sign) {
    planets.mercury = {
      sign: sovereign.mercury.sign,
      degree: sovereign.mercury.degree || 0
    };
  }

  // Venus
  if (sovereign.venus?.sign) {
    planets.venus = {
      sign: sovereign.venus.sign,
      degree: sovereign.venus.degree || 0
    };
  }

  // Mars
  if (sovereign.mars?.sign) {
    planets.mars = {
      sign: sovereign.mars.sign,
      degree: sovereign.mars.degree || 0
    };
  }

  // Jupiter
  if (sovereign.jupiter?.sign) {
    planets.jupiter = {
      sign: sovereign.jupiter.sign,
      degree: sovereign.jupiter.degree || 0
    };
  }

  // Saturn
  if (sovereign.saturn?.sign) {
    planets.saturn = {
      sign: sovereign.saturn.sign,
      degree: sovereign.saturn.degree || 0
    };
  }

  // Uranus
  if (sovereign.uranus?.sign) {
    planets.uranus = {
      sign: sovereign.uranus.sign,
      degree: sovereign.uranus.degree || 0
    };
  }

  // Neptune
  if (sovereign.neptune?.sign) {
    planets.neptune = {
      sign: sovereign.neptune.sign,
      degree: sovereign.neptune.degree || 0
    };
  }

  // Pluto
  if (sovereign.pluto?.sign) {
    planets.pluto = {
      sign: sovereign.pluto.sign,
      degree: sovereign.pluto.degree || 0
    };
  }

  // Only return if we have at least the sun
  if (Object.keys(planets).length === 0) return null;

  return { planets };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WesternElementalAnalysisPage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { profiles } = useProfiles();

  const profile = useMemo(() =>
    profiles.find(p => p.id === profileId),
    [profiles, profileId]
  );

  const westernZodiac = profile?.calculations?.western || null;

  // Transform to birthChart format expected by WesternElementalPanel
  const birthChart = useMemo(() => {
    if (!westernZodiac) return null;
    return transformToBirthChart(westernZodiac);
  }, [westernZodiac]);

  // Navigate back to Western tab
  const goBackToWestern = () => {
    navigate(`/results/${profileId}`, { state: { activeTab: 'western' } });
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!birthChart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
        <button
          onClick={goBackToWestern}
          className="mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2"
        >
          <span>Back to Western Zodiac</span>
        </button>
        <div className="text-white text-xl text-center">
          Western zodiac data not available for this profile.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBackToWestern}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>Back to Western Zodiac</span>
            </button>
            <h1 className="text-xl font-bold text-white">Western Elemental Analysis</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Profile Info */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-gray-400">
            Born: {new Date(profile.birthDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {profile.birthTime && `, ${profile.birthTime}`}
          </p>
        </div>

        {/* GOLD STANDARD WesternElementalPanel */}
        <WesternElementalPanel birthChart={birthChart} />

        {/* Back Button */}
        <div className="text-center pt-4">
          <button
            onClick={goBackToWestern}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
          >
            Back to Western Zodiac
          </button>
        </div>
      </div>
    </div>
  );
}
