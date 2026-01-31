/**
 * ============================================================================
 * SOUL GARDEN PAGE
 * ============================================================================
 * What-If Analysis: Explore how house strengths change throughout the day.
 *
 * Features:
 * - 24-hour house strength timeline (96 time slices)
 * - Art Nouveau vine visualization
 * - Poetic narration of planetary activations
 * - Profile search from database
 * - Custom exact time input (not limited to 15-min increments)
 * - Manual date and location input
 *
 * Part of GENESIS OS - Soul Garden Playground
 * Built by: Brother Claude Code
 * December 25, 2024
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import { HouseStrengthPlayground } from '../components/playground';
import HouseTimeMatrix from '../components/playground/HouseTimeMatrix';
import LocationPicker from '../components/common/LocationPicker';
import { fetchHouseStrengthTimeline } from '../services/houseStrengthService';
import { getHistoricalTimezone } from '../services/timezoneService';
import SoulConfessional from '../components/soulGarden/SoulConfessional';
import TakeHomeGiftPanel from '../components/soulGarden/TakeHomeGiftPanel';
import { submitConfessional, buildConfessionalChart } from '../services/confessionalService';
import { buildTakeHomeToolkit } from '../utils/risingPartingGifts';

// Input mode options
const INPUT_MODES = {
  PROFILE: 'profile',
  MANUAL: 'manual'
};

export default function SoulGardenPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { profiles, selectedProfileId } = useProfiles();

  // Input mode state
  const [inputMode, setInputMode] = useState(INPUT_MODES.MANUAL);
  const [selectedProfileForSearch, setSelectedProfileForSearch] = useState('');

  // Manual input state
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState(''); // New: exact time input
  const [manualLocation, setManualLocation] = useState(null);
  const [manualTimezone, setManualTimezone] = useState(0);
  const [resolvedTimezone, setResolvedTimezone] = useState(null);
  const [timezoneLoading, setTimezoneLoading] = useState(false);

  // Playground state
  const [showPlayground, setShowPlayground] = useState(false);
  const [specificTime, setSpecificTime] = useState(null); // For exact time calculation

  // Matrix view state
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixTimeline, setMatrixTimeline] = useState([]);
  const [matrixLoading, setMatrixLoading] = useState(false);
  const [matrixSelectedIndex, setMatrixSelectedIndex] = useState(0);

  // Soul Confessional state
  const [confessionalLoading, setConfessionalLoading] = useState(false);
  const [confessionalResponse, setConfessionalResponse] = useState(null);

  // Historical timezone lookup for manual input mode
  useEffect(() => {
    async function lookupTimezone() {
      // Only lookup if we have date and location
      if (!manualDate || !manualLocation?.lat || !manualLocation?.lng) {
        setResolvedTimezone(null);
        return;
      }

      setTimezoneLoading(true);
      try {
        console.log('🌿 Soul Garden: Looking up historical timezone...', {
          date: manualDate,
          lat: manualLocation.lat,
          lng: manualLocation.lng
        });

        const result = await getHistoricalTimezone({
          latitude: manualLocation.lat,
          longitude: manualLocation.lng,
          birthDate: manualDate,
          birthTime: manualTime || '12:00'
        });

        if (result?.success && result.timezone) {
          console.log('🌿 Soul Garden: Timezone resolved:', result.timezone);
          setResolvedTimezone(result.timezone);
          // Auto-update the numeric offset to match resolved timezone
          setManualTimezone(result.timezone.gmtOffsetHours || 0);
        } else {
          console.warn('🌿 Soul Garden: Timezone lookup failed, using longitude estimate');
          setResolvedTimezone(null);
          // Fall back to longitude estimation
          const estimatedTz = Math.round(manualLocation.lng / 15);
          setManualTimezone(estimatedTz);
        }
      } catch (error) {
        console.error('🌿 Soul Garden: Timezone lookup error:', error);
        setResolvedTimezone(null);
      } finally {
        setTimezoneLoading(false);
      }
    }

    lookupTimezone();
  }, [manualDate, manualLocation, manualTime]);

  // Get list of profiles for search
  // Handle both old structure (birth.date) and new structure (birthDate at top level)
  const profileOptions = useMemo(() => {
    if (!profiles || profiles.length === 0) {
      console.log('🌱 Soul Garden: No profiles found or profiles empty');
      return [];
    }
    console.log('🌱 Soul Garden: Checking', profiles.length, 'profiles for valid birth data');

    return profiles.map(p => {
      // Get name - try multiple possible fields
      const name = p.displayName || p.name || p.firstName || p.fullName || 'Unknown';

      // Get birth date - try both structures
      let birthDateRaw = p.birth?.date || p.birthDate;
      let birthDate = null;
      if (birthDateRaw) {
        if (birthDateRaw.toDate) {
          // Firestore Timestamp
          const d = birthDateRaw.toDate();
          birthDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        } else if (typeof birthDateRaw === 'string') {
          birthDate = birthDateRaw;
        }
      }

      // Get location - try both structures
      const latitude = p.birth?.location?.latitude || p.birthLat || p.location?.coordinates?.lat;
      const longitude = p.birth?.location?.longitude || p.birthLng || p.location?.coordinates?.lng;

      // Get relationship
      const relationship = p.relationship || p.relationshipType || '';

      return {
        id: p.id,
        name,
        relationship,
        birthDate,
        latitude,
        longitude
      };
    }).filter(p => {
      const valid = p.birthDate && p.latitude != null && p.longitude != null;
      if (!valid) {
        console.log('🌱 Soul Garden: Profile excluded (missing data):', p.name, {
          hasBirthDate: !!p.birthDate,
          hasLat: p.latitude != null,
          hasLng: p.longitude != null
        });
      }
      return valid;
    });
  }, [profiles]);

  // Get selected profile data (from dropdown)
  // Handle both old structure (birth.date) and new structure (birthDate at top level)
  const selectedProfileData = useMemo(() => {
    if (!selectedProfileForSearch || !profiles) return null;

    const profile = profiles.find(p => p.id === selectedProfileForSearch);
    if (!profile) return null;

    // Get name - try multiple possible fields
    const name = profile.displayName || profile.name || profile.firstName || profile.fullName || 'Unknown';

    // Get birth date - try both structures
    let birthDateRaw = profile.birth?.date || profile.birthDate;
    let birthDate = null;
    if (birthDateRaw) {
      if (birthDateRaw.toDate) {
        const d = birthDateRaw.toDate();
        birthDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      } else if (typeof birthDateRaw === 'string') {
        birthDate = birthDateRaw;
      }
    }

    // Get location - try both structures
    const latitude = profile.birth?.location?.latitude || profile.birthLat || profile.location?.coordinates?.lat;
    const longitude = profile.birth?.location?.longitude || profile.birthLng || profile.location?.coordinates?.lng;

    // Get timezone - try multiple sources
    const timezone = profile.birth?.location?.timezone ||
                     profile.historicalTimezone?.gmtOffsetHours ||
                     profile.location?.timezone || 0;

    // Extract birth time if available - try both structures
    const birthTime = profile.birth?.time || profile.birthTime || null;

    return {
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone,
      name
    };
  }, [selectedProfileForSearch, profiles]);

  // Determine which birth data to use
  const activeBirthData = useMemo(() => {
    if (inputMode === INPUT_MODES.PROFILE && selectedProfileData) {
      return selectedProfileData;
    }
    return {
      birthDate: manualDate,
      birthTime: manualTime,
      latitude: manualLocation?.lat,
      longitude: manualLocation?.lng,
      timezone: manualTimezone,
      name: 'Manual Entry'
    };
  }, [inputMode, selectedProfileData, manualDate, manualTime, manualLocation, manualTimezone]);

  // Handle location change from picker
  // Note: Historical timezone lookup is triggered by useEffect when date + location are set
  const handleLocationChange = useCallback((location) => {
    setManualLocation(location);
    // Reset resolved timezone - will be looked up by useEffect
    setResolvedTimezone(null);
  }, []);

  // Handle profile selection
  const handleProfileSelect = useCallback((profileId) => {
    setSelectedProfileForSearch(profileId);
    if (profileId) {
      setInputMode(INPUT_MODES.PROFILE);
    }
  }, []);

  // Handle explore button click
  const handleExplore = useCallback(() => {
    if (activeBirthData?.birthDate && activeBirthData?.latitude != null) {
      // Set specific time if provided
      if (activeBirthData.birthTime) {
        setSpecificTime(activeBirthData.birthTime);
      } else {
        setSpecificTime(null);
      }
      setShowPlayground(true);
    }
  }, [activeBirthData]);

  // Handle View Matrix button click - loads timeline for matrix view
  const handleViewMatrix = useCallback(async () => {
    if (!activeBirthData?.birthDate || activeBirthData?.latitude == null) {
      return;
    }

    // Validate date range - Swiss Ephemeris supports ~5000 BC to ~5000 AD
    // We allow from year 1 (0001 AD) to 2100 for historical figure analysis
    const year = parseInt(activeBirthData.birthDate?.split('-')[0]);
    if (year < 1 || year > 2100) {
      alert('Please use a birth date between 0001 AD and 2100 AD for calculations.');
      return;
    }

    try {
      setMatrixLoading(true);
      console.log('📊 Soul Garden Matrix: Loading timeline...', activeBirthData);

      const data = await fetchHouseStrengthTimeline({
        birthDate: activeBirthData.birthDate,
        latitude: activeBirthData.latitude,
        longitude: activeBirthData.longitude,
        timezone: activeBirthData.timezone || 0
      });

      if (!data.success) {
        throw new Error(data.error || 'Failed to load timeline');
      }

      setMatrixTimeline(data.timeline || []);
      setShowMatrix(true);
      setMatrixSelectedIndex(0);

      console.log('📊 Soul Garden Matrix: Timeline loaded', {
        slices: (data.timeline || []).length
      });
    } catch (err) {
      console.error('📊 Soul Garden Matrix Error:', err);
      const errorMsg = err.message || err.details?.message || 'Unknown error';
      alert('Failed to load timeline: ' + errorMsg);
    } finally {
      setMatrixLoading(false);
    }
  }, [activeBirthData]);

  // Handle matrix time selection
  const handleMatrixTimeSelect = useCallback((index) => {
    setMatrixSelectedIndex(index);
  }, []);

  // Handle MD export of House Matrix (96 time slots)
  const handleExportMatrixMD = useCallback(() => {
    if (!matrixTimeline || matrixTimeline.length === 0) {
      alert('No timeline data to export. Please load the House Matrix first.');
      return;
    }

    // Build Markdown content
    const lines = [];
    const dateStr = activeBirthData?.birthDate || 'Unknown Date';
    const locationStr = manualLocation?.formatted ||
      (activeBirthData?.latitude != null
        ? `${activeBirthData.latitude.toFixed(4)}°N, ${activeBirthData.longitude.toFixed(4)}°E`
        : 'Unknown Location');
    const tzOffset = activeBirthData?.timezone || 0;
    const tzStr = `UTC${tzOffset >= 0 ? '+' : ''}${tzOffset}`;

    lines.push('# House Strength Timeline - 24-Hour Matrix');
    lines.push('');
    lines.push(`**Date:** ${dateStr}`);
    lines.push(`**Location:** ${locationStr}`);
    lines.push(`**Timezone:** ${tzStr}`);
    lines.push(`**Generated:** ${new Date().toISOString().split('T')[0]}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Summary section
    lines.push('## Summary');
    lines.push('');
    lines.push(`Total time slots: ${matrixTimeline.length} (every 15 minutes)`);
    lines.push('');

    // Find peak hours for each house
    const housePeaks = {};
    for (let h = 1; h <= 12; h++) {
      let maxStrength = 0;
      let peakTime = '';
      matrixTimeline.forEach(slot => {
        const strength = slot.houses?.[h]?.strength || slot.houses?.[h] || 0;
        if (strength > maxStrength) {
          maxStrength = strength;
          peakTime = slot.time;
        }
      });
      housePeaks[h] = { time: peakTime, strength: maxStrength };
    }

    lines.push('### Peak Activation Times');
    lines.push('');
    lines.push('| House | Peak Time | Strength |');
    lines.push('|-------|-----------|----------|');
    for (let h = 1; h <= 12; h++) {
      lines.push(`| House ${h} | ${housePeaks[h].time} | ${housePeaks[h].strength.toFixed(1)}% |`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');

    // Detailed timeline
    lines.push('## Detailed Timeline');
    lines.push('');

    matrixTimeline.forEach((slot, idx) => {
      const time = slot.time || `${String(Math.floor(idx / 4)).padStart(2, '0')}:${String((idx % 4) * 15).padStart(2, '0')}`;
      lines.push(`### ${time}`);
      lines.push('');

      // House strengths table
      lines.push('| House | Strength | Planets |');
      lines.push('|-------|----------|---------|');

      for (let h = 1; h <= 12; h++) {
        const houseData = slot.houses?.[h] || {};
        const strength = typeof houseData === 'number' ? houseData : (houseData.strength || 0);
        const planets = houseData.planets || [];
        const planetStr = planets.length > 0 ? planets.join(', ') : '-';
        const strengthBar = '█'.repeat(Math.round(strength / 10)) + '░'.repeat(10 - Math.round(strength / 10));
        lines.push(`| ${h} | ${strengthBar} ${strength.toFixed(1)}% | ${planetStr} |`);
      }
      lines.push('');

      // Rising sign if available
      if (slot.risingSign || slot.ascendant) {
        lines.push(`**Rising Sign:** ${slot.risingSign || slot.ascendant}`);
        lines.push('');
      }
    });

    // Footer
    lines.push('---');
    lines.push('');
    lines.push('*Generated by GENESIS Soul Garden - House Strength Timeline Analysis*');

    // Create and download file
    const markdown = lines.join('\n');
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeDateStr = dateStr.replace(/\//g, '-');
    a.download = `house-matrix-${safeDateStr}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('📄 Soul Garden: Exported House Matrix MD', {
      timeSlots: matrixTimeline.length,
      date: dateStr,
      location: locationStr
    });
  }, [matrixTimeline, activeBirthData, manualLocation]);

  // Handle Soul Confessional submission
  const handleConfessionalSubmit = useCallback(async (context) => {
    setConfessionalLoading(true);
    setConfessionalResponse(null);

    try {
      // Build chart data from selected profile or manual entry
      let chartData = null;
      if (inputMode === INPUT_MODES.PROFILE && selectedProfileForSearch) {
        const fullProfile = profiles?.find(p => p.id === selectedProfileForSearch);
        if (fullProfile) {
          chartData = buildConfessionalChart(fullProfile);
        }
      }

      // If no profile chart, build minimal chart from manual data
      if (!chartData && activeBirthData) {
        chartData = {
          birth: {
            date: activeBirthData.birthDate,
            time: activeBirthData.birthTime,
            location: {
              latitude: activeBirthData.latitude,
              longitude: activeBirthData.longitude
            }
          }
        };
      }

      const result = await submitConfessional({
        chart: chartData,
        context
      });

      setConfessionalResponse(result);
    } catch (error) {
      console.error('Confessional error:', error);
      setConfessionalResponse({
        soulReply: 'The Cathedral whispers softly... but the words were lost in the ether. Please try again, dear soul.',
        highlights: [],
        gentlePractices: ['Take a deep breath', 'Know that you are heard', 'Try again when ready']
      });
    } finally {
      setConfessionalLoading(false);
    }
  }, [inputMode, selectedProfileForSearch, profiles, activeBirthData]);

  // Clear confessional response
  const handleConfessionalClear = useCallback(() => {
    setConfessionalResponse(null);
  }, []);

  // Build Take-Home Toolkit based on selected profile
  const takeHomeToolkit = useMemo(() => {
    if (inputMode === INPUT_MODES.PROFILE && selectedProfileForSearch) {
      const fullProfile = profiles?.find(p => p.id === selectedProfileForSearch);
      if (fullProfile) {
        return buildTakeHomeToolkit(fullProfile);
      }
    }
    return null;
  }, [inputMode, selectedProfileForSearch, profiles]);

  // Check if we have valid data to explore
  const canExplore = activeBirthData?.birthDate &&
                     activeBirthData?.latitude != null &&
                     activeBirthData?.longitude != null;

  // Redirect if not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌱</div>
          <h2 className="text-xl text-white mb-2">Soul Garden</h2>
          <p className="text-white/60 mb-4">Sign in to explore your house timeline</p>
          <Link
            to="/login"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-white/50 hover:text-white transition-colors"
              >
                ← Dashboard
              </Link>
              <div className="h-4 w-px bg-white/20" />
              <div>
                <h1 className="text-lg font-medium text-white flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  Soul Garden
                </h1>
                <p className="text-xs text-white/50">What-If Birth Time Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Input Section */}
        {!showPlayground && (
          <div className="mb-8">
            {/* Mode Toggle */}
            <div className="mb-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setInputMode(INPUT_MODES.PROFILE)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  inputMode === INPUT_MODES.PROFILE
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-white/60 hover:text-white'
                }`}
              >
                <span>👤</span>
                Search Profile
              </button>
              <button
                onClick={() => setInputMode(INPUT_MODES.MANUAL)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  inputMode === INPUT_MODES.MANUAL
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-white/60 hover:text-white'
                }`}
              >
                <span>✏️</span>
                Enter Manually
              </button>
            </div>

            {/* Profile Search Mode */}
            {inputMode === INPUT_MODES.PROFILE && (
              <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6">
                <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <span>🔍</span>
                  Select a Profile
                </h2>

                {profileOptions.length > 0 ? (
                  <>
                    {/* Profile Dropdown */}
                    <div className="mb-4">
                      <label className="block text-sm text-white/70 mb-2">
                        Choose from your profiles
                      </label>
                      <select
                        value={selectedProfileForSearch}
                        onChange={(e) => handleProfileSelect(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">-- Select a profile --</option>
                        {profileOptions.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} {p.relationship ? `(${p.relationship})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selected Profile Preview */}
                    {selectedProfileData && (
                      <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-xl">
                            👤
                          </div>
                          <div>
                            <div className="text-white font-medium">{selectedProfileData.name}</div>
                            <div className="text-xs text-white/50">{selectedProfileData.birthDate}</div>
                          </div>
                        </div>
                        <div className="text-xs text-white/40">
                          {selectedProfileData.latitude?.toFixed(4)}°N, {selectedProfileData.longitude?.toFixed(4)}°E
                          {selectedProfileData.birthTime && (
                            <span className="ml-2 text-cyan-400">• Birth time: {selectedProfileData.birthTime}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Custom Time Override */}
                    {selectedProfileData && (
                      <div className="mt-4 p-4 bg-indigo-950/30 rounded-lg border border-cyan-500/20">
                        <label className="block text-sm text-cyan-400 mb-2 flex items-center gap-2">
                          <span>⏰</span>
                          Specific Time to Calculate (Optional)
                        </label>
                        <p className="text-xs text-white/50 mb-3">
                          Enter an exact time to focus on, or leave blank to explore the full 24-hour timeline
                        </p>
                        <input
                          type="time"
                          value={manualTime}
                          onChange={(e) => setManualTime(e.target.value)}
                          className="w-full md:w-48 px-4 py-2 bg-slate-900 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                          placeholder="HH:MM"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-3">📭</div>
                    <p className="text-white/60 mb-2">No profiles with birth data found</p>
                    <p className="text-xs text-white/40">Add profiles with birth dates and locations to use this feature</p>
                    <button
                      onClick={() => setInputMode(INPUT_MODES.MANUAL)}
                      className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Enter Manually Instead
                    </button>
                  </div>
                )}

                {/* Explore Buttons */}
                {selectedProfileData && (
                  <div className="mt-6 text-center flex flex-wrap justify-center gap-3">
                    <button
                      onClick={handleExplore}
                      className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                    >
                      🌿 Explore Soul Garden 🌿
                    </button>
                    <button
                      onClick={handleViewMatrix}
                      disabled={matrixLoading}
                      className="px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {matrixLoading ? '⏳ Loading...' : '📊 View House Matrix'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Manual Input Form */}
            {inputMode === INPUT_MODES.MANUAL && (
              <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6">
                <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <span>✏️</span>
                  Enter Birth Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Input */}
                  <div>
                    <label className="block text-sm text-white/70 mb-2">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Time Input - NEW */}
                  <div>
                    <label className="block text-sm text-white/70 mb-2 flex items-center gap-2">
                      <span>⏰</span>
                      Specific Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={manualTime}
                      onChange={(e) => setManualTime(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="HH:MM"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      Leave blank to explore full 24-hour timeline
                    </p>
                  </div>

                  {/* Timezone Input with Historical Lookup */}
                  <div>
                    <label className="block text-sm text-white/70 mb-2 flex items-center gap-2">
                      Timezone
                      {timezoneLoading && (
                        <span className="text-xs text-cyan-400 animate-pulse">Looking up...</span>
                      )}
                    </label>

                    {/* Resolved Timezone Display */}
                    {resolvedTimezone && (
                      <div className="mb-2 p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <span className="text-lg">🌐</span>
                          <span className="font-medium">
                            {resolvedTimezone.abbreviation || resolvedTimezone.zoneName}
                          </span>
                          <span className="text-emerald-300/70">
                            (UTC{resolvedTimezone.gmtOffsetHours >= 0 ? '+' : ''}{resolvedTimezone.gmtOffsetHours})
                          </span>
                          {resolvedTimezone.dst && (
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                              DST
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/50 mt-1">
                          {resolvedTimezone.zoneName} • Historical lookup for {manualDate}
                        </div>
                      </div>
                    )}

                    {/* Fallback/Override Dropdown */}
                    <select
                      value={manualTimezone}
                      onChange={(e) => {
                        setManualTimezone(Number(e.target.value));
                        // Clear resolved timezone if manually overriding
                        if (resolvedTimezone && Number(e.target.value) !== resolvedTimezone.gmtOffsetHours) {
                          setResolvedTimezone(null);
                        }
                      }}
                      className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white focus:border-purple-500 focus:outline-none ${
                        resolvedTimezone ? 'border-emerald-500/30' : 'border-white/20'
                      }`}
                    >
                      {Array.from({ length: 25 }, (_, i) => i - 12).map(tz => (
                        <option key={tz} value={tz}>
                          UTC{tz >= 0 ? '+' : ''}{tz}
                          {resolvedTimezone && tz === resolvedTimezone.gmtOffsetHours ? ' (detected)' : ''}
                        </option>
                      ))}
                    </select>
                    {!resolvedTimezone && manualDate && manualLocation && !timezoneLoading && (
                      <p className="text-xs text-amber-400/70 mt-1">
                        Could not auto-detect timezone. Please verify the offset.
                      </p>
                    )}
                  </div>

                  {/* Spacer for grid alignment */}
                  <div className="hidden md:block" />

                  {/* Location Picker - Full Width */}
                  <div className="md:col-span-2">
                    <LocationPicker
                      value={manualLocation}
                      onChange={handleLocationChange}
                      label="Birth Location"
                      placeholder="Start typing a city..."
                    />
                  </div>
                </div>

                {/* Location Preview */}
                {manualLocation && (
                  <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-xs text-white/50 mb-1">Selected Location</div>
                    <div className="text-sm text-white">{manualLocation.formatted}</div>
                    <div className="text-xs text-white/40 mt-1 flex items-center gap-2">
                      <span>📐 {manualLocation.lat?.toFixed(4)}°N, {manualLocation.lng?.toFixed(4)}°E</span>
                      {resolvedTimezone && (
                        <span className="text-emerald-400/70">
                          • 🌐 {resolvedTimezone.abbreviation} (UTC{resolvedTimezone.gmtOffsetHours >= 0 ? '+' : ''}{resolvedTimezone.gmtOffsetHours})
                          {resolvedTimezone.dst && ' DST'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Explore Buttons */}
                <div className="mt-6 text-center flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleExplore}
                    disabled={!canExplore}
                    className={`
                      px-8 py-4 rounded-xl font-bold text-lg transition-all transform
                      ${canExplore
                        ? 'bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white hover:scale-105 shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-700 text-white/40 cursor-not-allowed'
                      }
                    `}
                  >
                    🌿 Explore Soul Garden 🌿
                  </button>
                  <button
                    onClick={handleViewMatrix}
                    disabled={!canExplore || matrixLoading}
                    className={`
                      px-6 py-4 rounded-xl font-bold text-lg transition-all transform
                      ${canExplore
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:scale-105 shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-700 text-white/40 cursor-not-allowed'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {matrixLoading ? '⏳ Loading...' : '📊 View House Matrix'}
                  </button>
                </div>
                {!canExplore && (
                  <p className="text-xs text-white/40 mt-2 text-center">
                    Enter a birth date and location to continue
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Playground Section */}
        {showPlayground && (
          <>
            {/* Back to inputs button */}
            <div className="mb-4 flex items-center flex-wrap gap-2">
              <button
                onClick={() => setShowPlayground(false)}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                ← Change Birth Details
              </button>
              <span className="text-white/30">|</span>
              <span className="text-sm text-white/70">
                {activeBirthData?.name !== 'Manual Entry' && (
                  <span className="text-purple-400 mr-2">{activeBirthData?.name}</span>
                )}
                {activeBirthData?.birthDate}
                {specificTime && (
                  <span className="text-cyan-400 ml-2">@ {specificTime}</span>
                )}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-sm text-white/50">
                {activeBirthData?.latitude?.toFixed(2)}°N, {activeBirthData?.longitude?.toFixed(2)}°E
              </span>
            </div>

            <HouseStrengthPlayground
              birthDate={activeBirthData.birthDate}
              latitude={activeBirthData.latitude}
              longitude={activeBirthData.longitude}
              timezone={activeBirthData.timezone}
              specificTime={specificTime || manualTime}
            />
          </>
        )}

        {/* Matrix Section */}
        {showMatrix && (
          <>
            {/* Back to inputs button */}
            <div className="mb-4 flex items-center flex-wrap gap-2">
              <button
                onClick={() => setShowMatrix(false)}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                ← Back to Input
              </button>
              <span className="text-white/30">|</span>
              <span className="text-sm text-white/70">
                {activeBirthData?.name !== 'Manual Entry' && (
                  <span className="text-purple-400 mr-2">{activeBirthData?.name}</span>
                )}
                {activeBirthData?.birthDate}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-sm text-white/50">
                {activeBirthData?.latitude?.toFixed(2)}°N, {activeBirthData?.longitude?.toFixed(2)}°E
              </span>
              <span className="text-white/30">|</span>
              <button
                onClick={handleExplore}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                🌿 Switch to Garden View
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={handleExportMatrixMD}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                title="Export 24-hour House Matrix to Markdown"
              >
                📄 Export MD
              </button>
            </div>

            <HouseTimeMatrix
              timeline={matrixTimeline}
              birthDate={activeBirthData.birthDate}
              latitude={activeBirthData.latitude}
              longitude={activeBirthData.longitude}
              selectedIndex={matrixSelectedIndex}
              onTimeSelect={handleMatrixTimeSelect}
            />
          </>
        )}

        {/* Help section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-950/50 rounded-xl border border-cyan-500/20">
            <h4 className="text-sm font-medium text-cyan-400 mb-2">🌿 Vine Height</h4>
            <p className="text-xs text-white/50">
              Each bar represents a house's strength (0-100). Taller vines indicate stronger house activation based on planetary occupancy and angularity.
            </p>
          </div>
          <div className="p-4 bg-indigo-950/50 rounded-xl border border-cyan-500/20">
            <h4 className="text-sm font-medium text-emerald-400 mb-2">🌸 Planet Flowers</h4>
            <p className="text-xs text-white/50">
              Circular symbols above vines indicate planets present in that house. More planets = more activation energy.
            </p>
          </div>
          <div className="p-4 bg-indigo-950/50 rounded-xl border border-cyan-500/20">
            <h4 className="text-sm font-medium text-purple-400 mb-2">✨ Specific Time</h4>
            <p className="text-xs text-white/50">
              Enter an exact birth time to see house strengths at that precise moment, not limited to 15-minute increments.
            </p>
          </div>
        </div>

        {/* Soul Confessional Chamber */}
        <div className="mt-12">
          <div className="text-center mb-6">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-amber-900/30 via-purple-900/30 to-amber-900/30 rounded-full border border-amber-500/20">
              <span className="text-amber-300/80 text-sm tracking-widest uppercase">
                The Whisper Alcove
              </span>
            </div>
          </div>
          <SoulConfessional
            onSubmit={handleConfessionalSubmit}
            loading={confessionalLoading}
            response={confessionalResponse}
            onClear={handleConfessionalClear}
          />
        </div>

        {/* Take-Home Gift Section */}
        {takeHomeToolkit && (
          <div className="mt-12">
            <div className="text-center mb-6">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-amber-900/30 via-slate-900/30 to-amber-900/30 rounded-full border border-amber-400/20">
                <span className="text-amber-300/80 text-sm tracking-widest uppercase">
                  Parting Gifts
                </span>
              </div>
            </div>
            <TakeHomeGiftPanel toolkit={takeHomeToolkit} />
          </div>
        )}
      </main>
    </div>
  );
}
