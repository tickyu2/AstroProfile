/**
 * UnifiedCompatibilityPage.jsx
 *
 * GENESIS Unified Metaphysics Compatibility Analysis
 *
 * Features:
 * - Profile selection dropdowns (user profiles + historical/modern)
 * - 90-dimensional unified compatibility scoring
 * - Third Chart (relationship being) visualization
 * - Stress Chamber analysis
 * - Lifecycle stage prediction
 * - Deep narrative interpretation
 * - Interactive charts and tables
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useProfiles } from '../contexts/ProfileContext';
import { profileRegistry } from '../profiles/index.js';
import {
  computeUnifiedCompatibility,
  SIGN_ARCHETYPE_VECTORS,
  ARCHETYPE_AXES,
  scoreToGrade,
  applyBaziModifiersToArchetype
} from '../services/unifiedCompatibilityService';
import { getConstitution, populateConstitution } from '../services/constitutionService';

// Nivo charts
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveRadar } from '@nivo/radar';
import { ResponsiveLine } from '@nivo/line';

// ============================================================================
// CONSTANTS
// ============================================================================

const ELEMENT_COLORS = {
  Wood: { bg: 'bg-green-900/50', text: 'text-green-400', hex: '#22c55e' },
  Fire: { bg: 'bg-red-900/50', text: 'text-red-400', hex: '#ef4444' },
  Earth: { bg: 'bg-yellow-900/50', text: 'text-yellow-400', hex: '#eab308' },
  Metal: { bg: 'bg-gray-700/50', text: 'text-gray-300', hex: '#9ca3af' },
  Water: { bg: 'bg-blue-900/50', text: 'text-blue-400', hex: '#3b82f6' }
};

const WESTERN_ELEMENT_COLORS = {
  Fire: '#ef4444',
  Earth: '#a3a329',
  Air: '#60a5fa',
  Water: '#22d3ee'
};

const GRADE_COLORS = {
  'A+': 'text-emerald-400', 'A': 'text-emerald-400', 'A-': 'text-emerald-500',
  'B+': 'text-green-400', 'B': 'text-green-500', 'B-': 'text-lime-500',
  'C+': 'text-yellow-400', 'C': 'text-yellow-500', 'C-': 'text-orange-400',
  'D': 'text-orange-500', 'F': 'text-red-500'
};

// Helper for Markdown section names (module level for use in callbacks)
const formatSectionNameForMd = (name) => {
  return name
    .replace(/_/g, ' ')
    .replace(/bazi/i, 'BaZi')
    .replace(/western/i, 'Western')
    .replace(/dm/i, 'Day Master')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const STRESS_PATTERN_COLORS = {
  coherent_under_load: '#22c55e',
  emotionally_available: '#ec4899',
  purpose_sharpening: '#f59e0b',
  adaptive_flexibility: '#8b5cf6',
  boundary_protection: '#6366f1',
  creative_release: '#14b8a6'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getAllSelectableProfiles(userProfiles) {
  // Get historical/modern profiles from registry
  const registryProfiles = Object.entries(profileRegistry)
    .filter(([_, entry]) => entry.status === 'active' && entry.user_accessible)
    .filter(([_, entry]) => entry.profile.profile_type !== 'couple') // Exclude couple profiles
    .map(([id, entry]) => ({
      id,
      name: entry.profile.profile_name,
      type: entry.profile.profile_type,
      category: 'curated',
      constitutional: entry.profile.constitutional,
      bazi: entry.profile.constitutional?.bazi,
      personality: entry.profile.personality,
      birthData: extractBirthData(entry.profile)
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Map user profiles - Python-First Architecture (Phase 2B)
  // Now profiles have canonical paths: profile.bazi, profile.western, profile.vedic, profile.unified
  const mappedUserProfiles = (userProfiles || []).map(p => ({
    id: p.id,
    name: p.fullName || p.displayName || 'Unnamed',
    type: 'user',
    category: 'user',
    // Canonical data (Python-First)
    bazi: p.bazi,                       // Direct from profile.bazi (canonical)
    western: p.western || {             // Direct from profile.western (canonical)
      sign: p.calculations?.western?.sign || deriveWesternSign(p.birthDate),
      elements: p.western?.elements,
      modalities: p.western?.modalities
    },
    vedic: p.vedic,                     // Direct from profile.vedic (canonical)
    unified: p.unified,                 // Direct from profile.unified (canonical)
    // Legacy data (backward compatibility)
    constitutional: p.constitutional,
    personality: p.personality,
    calculations: p.calculations,
    birthData: {
      datetime: p.birthDate ? `${p.birthDate}T${p.birthTime || '12:00'}` : null,
      gender: p.gender || 'unknown',
      location: p.birthLocation
    }
  }));

  return {
    curated: registryProfiles,
    user: mappedUserProfiles
  };
}

function extractBirthData(profile) {
  const bd = profile.constitutional?.birth_data;
  if (!bd) return null;

  return {
    datetime: bd.datetime || `${bd.date}T${bd.time || '12:00'}`,
    gender: bd.gender || profile.constitutional?.bazi?.gender || 'unknown',
    location: bd.location,
    dayMaster: profile.constitutional?.bazi?.day_master,
    elements: profile.constitutional?.bazi?.element_distribution,
    dmStrength: profile.constitutional?.bazi?.dm_strength?.score
  };
}

function deriveWesternSign(dateStr) {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const signs = [
    { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', start: [11, 22], end: [12, 21] }
  ];

  for (const { sign, start, end } of signs) {
    if (sign === 'Capricorn') {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return sign;
    } else {
      if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) return sign;
    }
  }
  return 'Unknown';
}

// =============================================================================
// BUILD PROFILE FOR COMPATIBILITY - Python-First Architecture (Phase 2B)
// =============================================================================
function buildProfileForCompatibility(selectedProfile) {
  if (!selectedProfile) return null;

  // =========================================================================
  // Extract Western sign - prioritize canonical path
  // =========================================================================
  const sign = selectedProfile.western?.sun?.sign ||           // Canonical: profile.western.sun.sign
               selectedProfile.western?.sign ||                 // Simple western object
               selectedProfile.constitutional?.western?.sun?.sign ||  // Legacy
               deriveWesternSign(selectedProfile.birthData?.datetime);

  // =========================================================================
  // Extract Day Master - prioritize canonical path
  // =========================================================================
  const dayMaster = selectedProfile.bazi?.dayMaster?.stem ||   // Canonical: profile.bazi.dayMaster.stem
                    selectedProfile.constitutional?.bazi?.day_master?.stem ||  // Legacy
                    selectedProfile.birthData?.dayMaster?.stem ||
                    'Unknown';

  // =========================================================================
  // Extract DM Strength - prioritize canonical path
  // =========================================================================
  const dmStrength = selectedProfile.bazi?.dayMaster?.strengthScore ||  // Canonical
                     selectedProfile.constitutional?.bazi?.dm_strength?.score ||
                     selectedProfile.birthData?.dmStrength ||
                     0.5;

  // =========================================================================
  // Extract Western elements - prioritize canonical path
  // =========================================================================
  const westernElements = selectedProfile.western?.elements ?
    {
      Fire: selectedProfile.western.elements.fire || 0.25,
      Earth: selectedProfile.western.elements.earth || 0.25,
      Air: selectedProfile.western.elements.air || 0.25,
      Water: selectedProfile.western.elements.water || 0.25
    } :
    selectedProfile.constitutional?.western?.elements ||
    { Fire: 0.25, Earth: 0.25, Air: 0.25, Water: 0.25 };

  // =========================================================================
  // Extract Western modalities - prioritize canonical path
  // =========================================================================
  const westernModalities = selectedProfile.western?.modalities ?
    {
      Cardinal: selectedProfile.western.modalities.cardinal || 0.33,
      Fixed: selectedProfile.western.modalities.fixed || 0.33,
      Mutable: selectedProfile.western.modalities.mutable || 0.34
    } :
    selectedProfile.constitutional?.western?.modalities ||
    { Cardinal: 0.33, Fixed: 0.33, Mutable: 0.34 };

  // =========================================================================
  // Get BaZi elements FIRST (needed for archetype adjustment)
  // =========================================================================
  const baziElements = getElementsWithFallback(selectedProfile);

  // =========================================================================
  // Build archetype from sign, then ADJUST with BaZi elements
  // This prevents unrealistic Third Charts (e.g., Trump × Musk as "Harmony Weave")
  // =========================================================================
  let archetype = SIGN_ARCHETYPE_VECTORS[sign] || Array(16).fill(0.5);

  // Apply BaZi element modifiers to create personality-adjusted archetype
  console.warn('🎯 [buildProfileForCompatibility] BaZi elements check:', {
    name: selectedProfile.name,
    sign,
    baziElements,
    hasElements: !!baziElements,
    elementCount: baziElements ? Object.keys(baziElements).length : 0
  });

  if (baziElements && Object.keys(baziElements).length > 0) {
    const total = Object.values(baziElements).reduce((s, v) => s + v, 0);
    console.warn('🎯 [buildProfileForCompatibility] BaZi total:', total);
    if (total > 0.5) { // Only apply if we have meaningful BaZi data
      const beforeWarm = archetype[11];
      archetype = applyBaziModifiersToArchetype(archetype, baziElements);
      console.warn(`✅ [buildProfileForCompatibility] Applied BaZi modifiers for ${selectedProfile.name}:`, {
        sign,
        baziElements,
        warmBefore: beforeWarm?.toFixed(2),
        warmAfter: archetype[11]?.toFixed(2),
        relationalAfter: archetype[2]?.toFixed(2)
      });
    } else {
      console.warn(`⚠️ [buildProfileForCompatibility] BaZi total too low (${total}), not applying modifiers`);
    }
  } else {
    console.warn(`❌ [buildProfileForCompatibility] No BaZi elements for ${selectedProfile.name}`);
  }

  return {
    name: selectedProfile.name,
    fullName: selectedProfile.name,
    unified_expression: {
      western: {
        archetype,
        patterns: selectedProfile.constitutional?.western?.patterns || { grand_trine: 0.4, t_square: 0.3, stellium: 0.35 },
        elements: westernElements,
        modalities: westernModalities
      },
      bazi: {
        elements: baziElements,
        dm_strength: dmStrength
      },
      metadata: {
        sign,
        day_master: dayMaster,
        dimension: 90
      }
    },
    western: { sign },
    bazi: selectedProfile.bazi
  };
}

function normalizeElements(elements) {
  if (!elements) return { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 };

  const total = Object.values(elements).reduce((a, b) => a + b, 0);
  if (total === 0) return { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 };

  const normalized = {};
  for (const [k, v] of Object.entries(elements)) {
    normalized[k] = v / total;
  }
  return normalized;
}

/**
 * Normalize elemental_percentages from historical profiles.
 * These use lowercase keys (fire, earth) and integer percentages (47, 46).
 * Returns { Wood, Fire, Earth, Metal, Water } in 0-1 scale.
 */
function normalizeElementalPercentages(rawPercentages) {
  if (!rawPercentages) return null;

  const result = {};
  const keyMap = { wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water' };

  for (const [key, value] of Object.entries(rawPercentages)) {
    const normalizedKey = keyMap[key.toLowerCase()] || key;
    // Convert from percentage (0-100) to decimal (0-1)
    result[normalizedKey] = value > 1 ? value / 100 : value;
  }

  // Ensure all 5 elements exist
  for (const el of ['Wood', 'Fire', 'Earth', 'Metal', 'Water']) {
    if (result[el] === undefined) result[el] = 0;
  }

  return result;
}

// Parse ganZhi (干支) string to extract elements
// Heavenly Stems (天干): 甲乙=Wood, 丙丁=Fire, 戊己=Earth, 庚辛=Metal, 壬癸=Water
// Earthly Branches (地支): 寅卯=Wood, 巳午=Fire, 辰戌丑未=Earth, 申酉=Metal, 亥子=Water
function parseGanZhiElement(ganZhi) {
  if (!ganZhi || typeof ganZhi !== 'string') return null;

  const STEM_ELEMENTS = {
    '甲': 'Wood', '乙': 'Wood',
    '丙': 'Fire', '丁': 'Fire',
    '戊': 'Earth', '己': 'Earth',
    '庚': 'Metal', '辛': 'Metal',
    '壬': 'Water', '癸': 'Water'
  };

  const BRANCH_ELEMENTS = {
    '寅': 'Wood', '卯': 'Wood',
    '巳': 'Fire', '午': 'Fire',
    '辰': 'Earth', '戌': 'Earth', '丑': 'Earth', '未': 'Earth',
    '申': 'Metal', '酉': 'Metal',
    '亥': 'Water', '子': 'Water'
  };

  const elements = [];

  // GanZhi is typically 2 characters: stem + branch
  for (const char of ganZhi) {
    if (STEM_ELEMENTS[char]) {
      elements.push(STEM_ELEMENTS[char]);
    } else if (BRANCH_ELEMENTS[char]) {
      elements.push(BRANCH_ELEMENTS[char]);
    }
  }

  return elements.length > 0 ? elements : null;
}

// Extract element distribution from BaZi pillars when element_distribution not available
function extractElementsFromBaZi(bazi) {
  if (!bazi) return null;

  const elementCounts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  // Try multiple pillar key formats
  const pillarKeySets = [
    ['year_pillar', 'month_pillar', 'day_pillar', 'hour_pillar'], // Registry format
    ['year', 'month', 'day', 'hour'] // Constitution format
  ];

  for (const pillarKeys of pillarKeySets) {
    let foundPillars = false;
    for (const pillar of pillarKeys) {
      const pillarData = bazi[pillar];
      if (pillarData) {
        foundPillars = true;

        // Try to get element from explicit properties first
        let element = pillarData.element ||
                      pillarData.stem?.element ||
                      pillarData.branch?.element;

        if (element) {
          // Handle compound elements like "Fire-Fire" or "Metal-Water" or "Wood/Earth"
          const elements = String(element).split(/[-\/]/);
          for (const el of elements) {
            const cleanEl = el.trim();
            if (Object.prototype.hasOwnProperty.call(elementCounts, cleanEl)) {
              elementCounts[cleanEl] += 1;
            }
          }
        }

        // If no explicit element, try to parse from ganZhi string
        const ganZhi = pillarData.ganZhi || pillarData.ganzhi || pillarData;
        if (typeof ganZhi === 'string' && ganZhi.length >= 2) {
          const parsedElements = parseGanZhiElement(ganZhi);
          if (parsedElements) {
            for (const el of parsedElements) {
              if (Object.prototype.hasOwnProperty.call(elementCounts, el)) {
                elementCounts[el] += 1;
              }
            }
          }
        }

        // Also count branch element if available separately
        if (pillarData.branch?.element && pillarData.branch.element !== pillarData.stem?.element) {
          const branchEl = pillarData.branch.element.trim();
          if (Object.prototype.hasOwnProperty.call(elementCounts, branchEl)) {
            elementCounts[branchEl] += 1;
          }
        }
      }
    }
    if (foundPillars) break; // Use first matching format
  }

  // Also count day master element (weighted more heavily)
  const dayMasterElement = bazi.day_master?.element ||
                          bazi.dayMaster?.element ||
                          bazi.day?.stem?.element;
  if (dayMasterElement) {
    const dmElement = dayMasterElement.trim();
    if (Object.prototype.hasOwnProperty.call(elementCounts, dmElement)) {
      elementCounts[dmElement] += 2;
    }
  }

  // Try to parse day master from ganZhi if element not explicit
  const dayMasterGanZhi = bazi.dayMaster?.ganZhi || bazi.day?.ganZhi || bazi.dayMaster;
  if (!dayMasterElement && typeof dayMasterGanZhi === 'string') {
    const parsedDm = parseGanZhiElement(dayMasterGanZhi);
    if (parsedDm && parsedDm[0]) {
      // First character is stem (day master)
      if (Object.prototype.hasOwnProperty.call(elementCounts, parsedDm[0])) {
        elementCounts[parsedDm[0]] += 2;
      }
    }
  }

  const total = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  // Convert to percentages
  const result = {};
  for (const [el, count] of Object.entries(elementCounts)) {
    result[el] = count / total;
  }

  console.log('[extractElementsFromBaZi] Extracted elements from pillars:', result);
  return result;
}

// =============================================================================
// GET BAZI ELEMENTS - Python-First Architecture (Phase 2B)
// =============================================================================
// Priority order:
// 1. profile.bazi.elements (NEW canonical path from Python)
// 2. Legacy paths for backward compatibility
// =============================================================================
function getElementsWithFallback(profile) {
  // DEBUG: Log FULL profile structure to see what Firebase actually has
  console.warn('🔍 [getElementsWithFallback] FULL PROFILE KEYS:', Object.keys(profile || {}));
  console.warn('🔍 [getElementsWithFallback] profile.bazi:', profile?.bazi);
  console.warn('🔍 [getElementsWithFallback] profile.calculations:', profile?.calculations ? Object.keys(profile.calculations) : 'undefined');
  console.warn('🔍 [getElementsWithFallback] profile.constitutional:', profile?.constitutional ? Object.keys(profile.constitutional) : 'undefined');

  // =========================================================================
  // CANONICAL PATH (Python-First) - Check this FIRST
  // =========================================================================
  if (profile?.bazi?.elements) {
    const elements = profile.bazi.elements;
    // Python returns { Wood: 0.25, Fire: 0.15, ... } with dominant/weakest fields
    const result = {
      Wood: elements.Wood || 0,
      Fire: elements.Fire || 0,
      Earth: elements.Earth || 0,
      Metal: elements.Metal || 0,
      Water: elements.Water || 0
    };
    const total = Object.values(result).reduce((a, b) => a + b, 0);
    if (total > 0) {
      console.log('[getElementsWithFallback] ✅ Using canonical path profile.bazi.elements:', result);
      return total > 5 ? normalizeElements(result) : result;
    }
  }

  // =========================================================================
  // LEGACY PATHS (backward compatibility for profiles not yet migrated)
  // =========================================================================
  console.log('[getElementsWithFallback] ⚠️ Canonical path not found, checking legacy paths for:', profile?.name);

  // Debug: Check elemental_percentages directly
  const rawElemPercent = profile?.constitutional?.bazi?.elemental_percentages;
  const normalizedElemPercent = normalizeElementalPercentages(rawElemPercent);
  console.warn('[DEBUG] elemental_percentages raw:', rawElemPercent);
  console.warn('[DEBUG] elemental_percentages normalized:', normalizedElemPercent);

  // Also check direct bazi path (mapped profiles have bazi = constitutional.bazi)
  const rawBaziElemPercent = profile?.bazi?.elemental_percentages;
  const normalizedBaziElemPercent = normalizeElementalPercentages(rawBaziElemPercent);
  console.warn('[DEBUG] bazi.elemental_percentages raw:', rawBaziElemPercent);
  console.warn('[DEBUG] bazi.elemental_percentages normalized:', normalizedBaziElemPercent);

  const legacyPaths = [
    // PRIORITY: Direct bazi elemental_percentages (mapped profiles have bazi = constitutional.bazi)
    { path: 'bazi.elemental_percentages', data: normalizedBaziElemPercent },
    // Constitution paths (Brain 1A subcollection)
    { path: 'constitutional.bazi.elementBalance', data: profile?.constitutional?.bazi?.elementBalance },
    { path: 'constitutional.bazi.element_distribution', data: profile?.constitutional?.bazi?.element_distribution },
    // Historical profiles use elemental_percentages with lowercase keys (fire, earth, etc.)
    { path: 'constitutional.bazi.elemental_percentages', data: normalizedElemPercent },
    // Direct from fourPillars (legacy recalculateSovereignData)
    { path: 'calculations.fourPillars.elementBalance', data: profile?.calculations?.fourPillars?.elementBalance },
    // Direct paths
    { path: 'birthData.elements', data: profile?.birthData?.elements },
    { path: 'bazi.element_distribution', data: profile?.bazi?.element_distribution },
    { path: 'baziChart.elements', data: profile?.baziChart?.elements },
  ];

  for (const { path, data } of legacyPaths) {
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      const total = Object.values(data).reduce((a, b) => a + b, 0);
      if (total > 0) {
        console.log(`[getElementsWithFallback] Found via legacy path ${path}:`, data);
        return total > 5 ? normalizeElements(data) : data;
      }
    }
  }

  // Extract from pillar data (for curated profiles in registry)
  const baziSources = [
    { path: 'constitutional.bazi', data: profile?.constitutional?.bazi },
    { path: 'bazi', data: profile?.bazi },
  ];

  for (const { path, data: baziData } of baziSources) {
    const extracted = extractElementsFromBaZi(baziData);
    if (extracted) {
      console.log(`[getElementsWithFallback] Extracted from ${path}:`, extracted);
      return extracted;
    }
  }

  // Registry lookup (for curated historical profiles)
  if (profile?.id && profileRegistry[profile.id]?.profile?.constitutional?.bazi) {
    const extracted = extractElementsFromBaZi(profileRegistry[profile.id].profile.constitutional.bazi);
    if (extracted) {
      console.log('[getElementsWithFallback] Found via registry ID:', extracted);
      return extracted;
    }
  }

  console.log('[getElementsWithFallback] ❌ Using default 20% fallback for:', profile?.name);
  return { Wood: 0.2, Fire: 0.2, Earth: 0.2, Metal: 0.2, Water: 0.2 };
}

// ============================================================================
// CHART COMPONENTS
// ============================================================================

function CompatibilityGauge({ score, grade, level }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={score >= 0.85 ? '#22c55e' : score >= 0.70 ? '#84cc16' : score >= 0.55 ? '#eab308' : '#ef4444'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${GRADE_COLORS[grade]}`}>{grade}</span>
          <span className="text-sm text-gray-400">{(score * 100).toFixed(1)}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-gray-400 capitalize">{level}</span>
    </div>
  );
}

function SectionsTable({ sections }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-2 px-3 text-gray-400">Section</th>
            <th className="text-right py-2 px-3 text-gray-400">Score</th>
            <th className="text-right py-2 px-3 text-gray-400">Weight</th>
            <th className="text-right py-2 px-3 text-gray-400">Contribution</th>
            <th className="text-left py-2 px-3 text-gray-400">Interpretation</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section, i) => (
            <tr key={section.name} className={i % 2 === 0 ? 'bg-gray-800/30' : ''}>
              <td className="py-2 px-3 font-medium text-gray-200">
                {formatSectionName(section.name)}
              </td>
              <td className="py-2 px-3 text-right">
                <span className={getScoreColor(section.score)}>
                  {(section.score * 100).toFixed(1)}%
                </span>
              </td>
              <td className="py-2 px-3 text-right text-gray-500">
                {(section.weight * 100).toFixed(0)}%
              </td>
              <td className="py-2 px-3 text-right text-gray-400">
                {((section.score * section.weight) * 100).toFixed(1)}%
              </td>
              <td className="py-2 px-3 text-gray-400 text-xs">
                {section.interpretation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatSectionName(name) {
  return name
    .replace(/_/g, ' ')
    .replace(/bazi/gi, 'BaZi')
    .replace(/western/gi, 'Western')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getScoreColor(score) {
  if (score >= 0.85) return 'text-emerald-400';
  if (score >= 0.70) return 'text-green-400';
  if (score >= 0.55) return 'text-yellow-400';
  return 'text-orange-400';
}

function ArchetypeRadarChart({ profileA, profileB, thirdChart }) {
  // Prepare data for radar chart
  const radarData = ARCHETYPE_AXES.slice(0, 8).map((axis, i) => ({
    axis,
    [profileA?.name || 'Profile A']: (profileA?.unified_expression?.western?.archetype?.[i] || 0.5) * 100,
    [profileB?.name || 'Profile B']: (profileB?.unified_expression?.western?.archetype?.[i] || 0.5) * 100,
    'Third Chart': (thirdChart?.archetype_vector_16?.[i] || 0.5) * 100
  }));

  return (
    <div className="h-80">
      <ResponsiveRadar
        data={radarData}
        keys={[profileA?.name || 'Profile A', profileB?.name || 'Profile B', 'Third Chart']}
        indexBy="axis"
        maxValue={100}
        margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={16}
        enableDots={true}
        dotSize={8}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        colors={['#60a5fa', '#f472b6', '#4ade80']}
        fillOpacity={0.35}
        blendMode="normal"
        animate={true}
        theme={{
          background: 'transparent',
          textColor: '#ffffff',
          text: {
            fontSize: 12,
            fontWeight: 600,
            fill: '#ffffff'
          },
          grid: { line: { stroke: '#4b5563' } },
          tooltip: {
            container: {
              background: '#1f2937',
              color: '#ffffff',
              fontSize: 12,
              borderRadius: 6,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }
          }
        }}
        legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: '#ffffff',
            symbolSize: 12,
            symbolShape: 'circle'
          }
        ]}
      />
    </div>
  );
}

// Element icons for BaZi five elements
const ELEMENT_ICONS = {
  Wood: '🌳',
  Fire: '🔥',
  Earth: '🌍',
  Metal: '⚙️',
  Water: '💧'
};

function ElementComparisonChart({ profileA, profileB }) {
  const elementsA = profileA?.unified_expression?.bazi?.elements || {};
  const elementsB = profileB?.unified_expression?.bazi?.elements || {};

  const nameA = profileA?.name || 'Profile A';
  const nameB = profileB?.name || 'Profile B';

  const chartData = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(element => ({
    element,
    elementWithIcon: `${element}\n${ELEMENT_ICONS[element]}`,
    [nameA]: Math.round((elementsA[element] || 0) * 100),
    [nameB]: Math.round((elementsB[element] || 0) * 100)
  }));

  return (
    <div className="h-72">
      <ResponsiveBar
        data={chartData}
        keys={[nameA, nameB]}
        indexBy="element"
        margin={{ top: 20, right: 130, bottom: 70, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        colors={['#60a5fa', '#f472b6']}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          renderTick: ({ x, y, value }) => (
            <g transform={`translate(${x},${y})`}>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                y={12}
                style={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }}
              >
                {value}
              </text>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                y={32}
                style={{ fontSize: 18 }}
              >
                {ELEMENT_ICONS[value]}
              </text>
            </g>
          )
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Percentage',
          legendPosition: 'middle',
          legendOffset: -45,
          format: v => `${v}%`
        }}
        valueFormat={v => `${v}%`}
        label={d => `${d.value}%`}
        labelSkipWidth={20}
        labelSkipHeight={14}
        labelTextColor="#ffffff"
        theme={{
          background: 'transparent',
          textColor: '#e5e7eb',
          axis: {
            ticks: { text: { fill: '#e5e7eb', fontSize: 12 } },
            legend: { text: { fill: '#9ca3af', fontSize: 12 } }
          },
          grid: { line: { stroke: '#374151' } },
          labels: { text: { fill: '#ffffff', fontSize: 11, fontWeight: 600 } },
          tooltip: {
            container: {
              background: '#1f2937',
              color: '#e5e7eb',
              fontSize: 12,
              borderRadius: 6,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }
          }
        }}
        tooltip={({ id, value, indexValue, color }) => (
          <div className="bg-gray-800 px-3 py-2 rounded shadow-lg border border-gray-700">
            <div className="font-medium text-gray-200">{ELEMENT_ICONS[indexValue]} {indexValue}</div>
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color }}>{id}:</span>
              <span className="text-white font-bold">{value}%</span>
            </div>
          </div>
        )}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 120,
            itemWidth: 100,
            itemHeight: 20,
            itemTextColor: '#9ca3af'
          }
        ]}
      />
    </div>
  );
}

function LifecycleChart({ stages }) {
  if (!stages?.length) return null;

  const lineData = [{
    id: 'Energy',
    data: stages.map(s => ({
      x: s.stage,
      y: s.energy * 100
    }))
  }];

  return (
    <div className="h-64">
      <ResponsiveLine
        data={lineData}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 100 }}
        curve="cardinal"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -20
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'Energy %',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        enablePoints={true}
        pointSize={12}
        pointColor="#22c55e"
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableArea={true}
        areaOpacity={0.15}
        colors={['#22c55e']}
        theme={{
          background: 'transparent',
          textColor: '#9ca3af',
          grid: { line: { stroke: '#374151' } }
        }}
        useMesh={true}
      />
    </div>
  );
}

function StressPatternsDisplay({ patterns, classification }) {
  if (!patterns?.length) {
    return (
      <div className="text-gray-500 text-center py-4">
        No stress patterns detected
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400">Classification:</span>
        <span className={`font-bold ${
          classification === 'Highly Resilient' ? 'text-emerald-400' :
          classification === 'Coherent Under Load' ? 'text-green-400' :
          classification === 'Moderately Stable' ? 'text-yellow-400' : 'text-orange-400'
        }`}>
          {classification}
        </span>
      </div>

      {patterns.map((pattern, i) => (
        <div key={pattern.pattern} className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-200 capitalize">
              {pattern.pattern.replace(/_/g, ' ')}
            </span>
            <span className="text-sm" style={{ color: STRESS_PATTERN_COLORS[pattern.pattern] || '#9ca3af' }}>
              {(pattern.strength * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-gray-400">{pattern.description}</p>
          <div className="mt-2 flex gap-1 flex-wrap">
            {pattern.axes?.map(axis => (
              <span key={axis} className="text-xs bg-gray-700 px-2 py-0.5 rounded">
                {axis}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ThirdChartCard({ thirdChart }) {
  if (!thirdChart) return null;

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center text-2xl">
          💫
        </div>
        <div>
          <h3 className="text-xl font-bold text-purple-300">{thirdChart.archetype_name}</h3>
          <p className="text-sm text-gray-400">The Relationship Being</p>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{thirdChart.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-xs text-gray-500">Partners</span>
          <p className="text-sm text-gray-300">
            {thirdChart.partners?.join(' & ')}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Day Masters</span>
          <p className="text-sm text-gray-300">
            {thirdChart.day_masters?.join(' & ')}
          </p>
        </div>
      </div>

      {/* Dominant Archetype Scores */}
      <div className="space-y-2 mt-4">
        <span className="text-xs text-gray-500">Dominant Traits</span>
        {Object.entries(thirdChart.archetype_scores || {})
          .filter(([_, v]) => v >= 0.7)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([axis, value]) => (
            <div key={axis} className="flex items-center gap-2">
              <span className="text-sm text-gray-300 w-28">{axis}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${value * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-12 text-right">
                {(value * 100).toFixed(0)}%
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function NarrativeSection({ narrative, title }) {
  if (!narrative) return null;

  // Parse markdown-like formatting
  const formattedNarrative = narrative
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, '<br/>');

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-200 mb-3">{title}</h3>
      <div
        className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: `<p>${formattedNarrative}</p>` }}
      />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function UnifiedCompatibilityPage() {
  const { profiles: userProfiles, recalculateSovereignData } = useProfiles();
  const [selectedProfileAId, setSelectedProfileAId] = useState('');
  const [selectedProfileBId, setSelectedProfileBId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  // Constitution data cache for user profiles (keyed by profile ID)
  const [constitutionCache, setConstitutionCache] = useState({});
  // Track which profiles are being recalculated
  const [recalculating, setRecalculating] = useState({});

  // Get all selectable profiles
  const allProfiles = useMemo(() =>
    getAllSelectableProfiles(userProfiles),
    [userProfiles]
  );

  // Fetch constitution data for user profiles when selected
  useEffect(() => {
    const fetchConstitutions = async () => {
      const idsToFetch = [selectedProfileAId, selectedProfileBId]
        .filter(id => id && !constitutionCache[id]);

      // Only fetch for user profiles (not curated)
      const userProfileIds = idsToFetch.filter(id =>
        allProfiles.user.some(p => p.id === id)
      );

      if (userProfileIds.length === 0) return;

      console.log('[Constitution] Fetching for user profiles:', userProfileIds);

      const results = await Promise.all(
        userProfileIds.map(async (id) => {
          try {
            const constitution = await getConstitution(id);
            console.log(`[Constitution] Fetched for ${id}:`, constitution?.bazi ? 'has BaZi' : 'no BaZi');
            return { id, constitution };
          } catch (err) {
            console.error(`[Constitution] Error fetching ${id}:`, err);
            return { id, constitution: null };
          }
        })
      );

      const newCache = { ...constitutionCache };
      results.forEach(({ id, constitution }) => {
        newCache[id] = constitution;
      });
      setConstitutionCache(newCache);
    };

    fetchConstitutions();
  }, [selectedProfileAId, selectedProfileBId, allProfiles.user]);

  // Find selected profiles (with constitution data attached for user profiles)
  const profileA = useMemo(() => {
    if (!selectedProfileAId) return null;
    const profile = [...allProfiles.curated, ...allProfiles.user].find(p => p.id === selectedProfileAId);
    if (!profile) return null;
    // Attach constitution data if available (for user profiles)
    const constitution = constitutionCache[selectedProfileAId];
    if (constitution) {
      return { ...profile, constitutional: constitution };
    }
    return profile;
  }, [selectedProfileAId, allProfiles, constitutionCache]);

  const profileB = useMemo(() => {
    if (!selectedProfileBId) return null;
    const profile = [...allProfiles.curated, ...allProfiles.user].find(p => p.id === selectedProfileBId);
    if (!profile) return null;
    // Attach constitution data if available (for user profiles)
    const constitution = constitutionCache[selectedProfileBId];
    if (constitution) {
      return { ...profile, constitutional: constitution };
    }
    return profile;
  }, [selectedProfileBId, allProfiles, constitutionCache]);

  // Check if a user profile needs BaZi recalculation
  const profileNeedsBaZi = useCallback((profile) => {
    if (!profile) return false;
    // Only applies to user profiles, not curated
    if (profile.category !== 'user') return false;

    // Check if we have BaZi data from various sources
    const elements = getElementsWithFallback(profile);

    // Check for default 20% fallback
    const isDefault20 = elements && (
      elements.Wood === 0.2 &&
      elements.Fire === 0.2 &&
      elements.Earth === 0.2 &&
      elements.Metal === 0.2 &&
      elements.Water === 0.2
    );

    // Check for OLD hardcoded pattern (Wood: 15%, Fire: 20%, Earth: 25%, Metal: 25%, Water: 15%)
    // This was a bug in calculateElementBalance that always returned these values
    const isOldHardcoded = elements && (
      (Math.abs(elements.Wood - 0.15) < 0.01) &&
      (Math.abs(elements.Fire - 0.20) < 0.01) &&
      (Math.abs(elements.Earth - 0.25) < 0.01) &&
      (Math.abs(elements.Metal - 0.25) < 0.01) &&
      (Math.abs(elements.Water - 0.15) < 0.01)
    );

    // Need recalculation if we hit either fallback
    return isDefault20 || isOldHardcoded;
  }, []);

  // Track recalculation errors to show user feedback
  const [recalcError, setRecalcError] = useState(null);

  // Handle BaZi recalculation for a user profile
  const handleRecalculateBaZi = useCallback(async (profileId, profileName) => {
    if (!profileId || !recalculateSovereignData) {
      console.warn('[Recalculate] Missing profileId or recalculateSovereignData');
      return;
    }

    console.log(`[Recalculate] Starting BaZi recalculation for ${profileName} (${profileId})`);
    setRecalculating(prev => ({ ...prev, [profileId]: true }));
    setRecalcError(null);

    try {
      const result = await recalculateSovereignData(profileId);
      console.log(`[Recalculate] Completed for ${profileName}:`, result);

      // Clear constitution cache to force re-fetch
      setConstitutionCache(prev => {
        const newCache = { ...prev };
        delete newCache[profileId];
        return newCache;
      });

      // Wait then re-fetch constitution and verify it worked
      setTimeout(async () => {
        try {
          const constitution = await getConstitution(profileId);
          console.log(`[Recalculate] Re-fetched constitution for ${profileId}:`, {
            hasBazi: !!constitution?.bazi,
            elementBalance: constitution?.bazi?.elementBalance
          });
          setConstitutionCache(prev => ({ ...prev, [profileId]: constitution }));

          // Check if the recalculation actually fixed the data
          const elements = constitution?.bazi?.elementBalance;
          const stillHasOldHardcoded = elements && (
            (Math.abs((elements.Wood || 0) - 15) < 1) &&
            (Math.abs((elements.Fire || 0) - 20) < 1) &&
            (Math.abs((elements.Earth || 0) - 25) < 1) &&
            (Math.abs((elements.Metal || 0) - 25) < 1) &&
            (Math.abs((elements.Water || 0) - 15) < 1)
          );

          if (stillHasOldHardcoded || !elements) {
            setRecalcError('BaZi recalculation failed - Python backend may not be running on port 5001.');
          }
        } catch (err) {
          console.error(`[Recalculate] Error re-fetching constitution:`, err);
        }
      }, 1500);

    } catch (error) {
      console.error(`[Recalculate] Error for ${profileName}:`, error);
      // Check if it's a connection error (Python backend not running)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        setRecalcError('Python backend not running. Start the backend server on port 5001.');
      } else {
        setRecalcError(`Error: ${error.message}`);
      }
    } finally {
      setRecalculating(prev => ({ ...prev, [profileId]: false }));
    }
  }, [recalculateSovereignData]);

  // Regenerate constitution from existing profile data (doesn't require Python backend)
  const handleRegenerateConstitution = useCallback(async (profileId, profileName) => {
    if (!profileId) return;

    console.log(`[Regenerate] Starting constitution regeneration for ${profileName} (${profileId})`);
    setRecalculating(prev => ({ ...prev, [profileId]: true }));
    setRecalcError(null);

    try {
      // Find the profile in user profiles
      const profile = userProfiles.find(p => p.id === profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Build a profile object with existing fourPillars data
      const profileForConstitution = {
        ...profile,
        id: profileId,
        calculations: profile.calculations || {}
      };

      console.log('[Regenerate] Profile data:', {
        hasFourPillars: !!profile.calculations?.fourPillars,
        fourPillarsKeys: profile.calculations?.fourPillars ? Object.keys(profile.calculations.fourPillars) : []
      });

      // Regenerate the constitution
      await populateConstitution(profileForConstitution);

      // Clear cache and re-fetch
      setConstitutionCache(prev => {
        const newCache = { ...prev };
        delete newCache[profileId];
        return newCache;
      });

      // Re-fetch constitution
      setTimeout(async () => {
        try {
          const constitution = await getConstitution(profileId);
          console.log(`[Regenerate] Re-fetched constitution:`, {
            hasBazi: !!constitution?.bazi,
            elementBalance: constitution?.bazi?.elementBalance
          });
          setConstitutionCache(prev => ({ ...prev, [profileId]: constitution }));

          // Verify it worked
          const elements = constitution?.bazi?.elementBalance;
          if (!elements || Object.keys(elements).length === 0) {
            setRecalcError('Regeneration failed - profile may not have fourPillars data stored.');
          }
        } catch (err) {
          console.error(`[Regenerate] Error re-fetching constitution:`, err);
        }
      }, 1000);

    } catch (error) {
      console.error(`[Regenerate] Error for ${profileName}:`, error);
      setRecalcError(`Regeneration error: ${error.message}`);
    } finally {
      setRecalculating(prev => ({ ...prev, [profileId]: false }));
    }
  }, [userProfiles]);

  // Calculate compatibility
  const handleCalculate = useCallback(async () => {
    if (!profileA || !profileB) return;

    setLoading(true);
    try {
      const builtA = buildProfileForCompatibility(profileA);
      const builtB = buildProfileForCompatibility(profileB);

      const compatResult = await computeUnifiedCompatibility(builtA, builtB);
      setResult(compatResult);
    } catch (error) {
      console.error('Error computing compatibility:', error);
    } finally {
      setLoading(false);
    }
  }, [profileA, profileB]);

  // ==========================================================================
  // EXPORT FUNCTIONS - For debugging and troubleshooting
  // ==========================================================================

  /**
   * Extract raw profile data (BEFORE adjustment) for debugging
   */
  const extractRawProfileData = useCallback((profile) => {
    if (!profile) return null;

    const builtProfile = buildProfileForCompatibility(profile);
    const expr = builtProfile.unified_expression || {};

    return {
      name: profile.name || profile.displayName || 'Unknown',
      archetype_vector: expr.western?.archetype || [],
      element_profile: {
        bazi_elements: expr.bazi?.elements || {},
        western_elements: expr.western?.elements || {},
        dominant_bazi: Object.entries(expr.bazi?.elements || {})
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown',
        dominant_western: Object.entries(expr.western?.elements || {})
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'
      },
      stress_profile: {
        dm_strength: expr.bazi?.dm_strength || 0.5,
        boundary_stability: expr.western?.modalities?.Fixed || 0.33
      },
      raw_traits: ARCHETYPE_AXES.reduce((acc, axis, i) => {
        acc[axis] = (expr.western?.archetype?.[i] || 0.5).toFixed(2);
        return acc;
      }, {}),
      metadata: {
        day_master: expr.metadata?.day_master || profile.bazi?.dayMaster?.stem || 'Unknown',
        western_sign: expr.metadata?.sign || profile.western?.sun?.sign || 'Unknown',
        source: profile.category || 'user'
      },
      // Raw source data for inspection
      _raw: {
        profile_id: profile.id,
        has_constitutional: !!profile.constitutional,
        has_bazi: !!profile.bazi,
        has_western: !!profile.western,
        unified_expression_keys: Object.keys(expr)
      }
    };
  }, []);

  /**
   * Extract adjusted data (AFTER compatibility calculation) for debugging
   */
  const extractAdjustedData = useCallback((profile, compatResult, isProfileA = true) => {
    if (!profile || !compatResult) return null;

    const sections = compatResult.compatibility?.sections || [];
    const thirdChart = compatResult.third_chart || {};

    return {
      name: profile.name || profile.displayName || 'Unknown',
      adjusted: {
        archetype_similarity: sections.find(s => s.name === 'western_archetype')?.score?.toFixed(3) || 'N/A',
        bazi_element_similarity: sections.find(s => s.name === 'bazi_elements')?.score?.toFixed(3) || 'N/A',
        western_element_similarity: sections.find(s => s.name === 'western_elements')?.score?.toFixed(3) || 'N/A',
        stress_compatibility: compatResult.risk_assessment?.stress_resilience?.value || 'N/A',
        third_chart_coherence: compatResult.risk_assessment?.third_chart_coherence?.value || 'N/A',
        penalty_total: (compatResult.compatibility?.penalties?.total || 0) + '%',
        penalty_breakdown: compatResult.compatibility?.penalties || {},
        final_score: compatResult.compatibility?.overall?.score?.toFixed(3) || 'N/A',
        raw_score: compatResult.compatibility?.overall?.rawScore?.toFixed(3) || 'N/A',
        grade: compatResult.compatibility?.overall?.grade || 'N/A',
        risk_index: compatResult.risk_assessment?.risk_index?.value || 'N/A',
        risk_classification: compatResult.risk_assessment?.risk_index?.classification || 'N/A',
        red_flags: compatResult.risk_assessment?.red_flags?.flags || [],
        interpretation_key: compatResult.compatibility?.overall?.interpretationKey || 'N/A'
      },
      third_chart: {
        archetype_vector: thirdChart.archetype_vector_16 || [],
        relationship_archetype: thirdChart.relationship_archetype?.name || 'N/A',
        stress_patterns: thirdChart.stress_patterns || [],
        lifecycle_stages: thirdChart.lifecycle_stages?.slice(0, 3) || [],
        coherence: thirdChart.coherence || 'N/A'
      },
      sections_breakdown: sections.map(s => ({
        name: s.name,
        score: s.score?.toFixed(3),
        weight: s.weight,
        contribution: (s.score * s.weight).toFixed(3),
        interpretation: s.interpretation
      }))
    };
  }, []);

  /**
   * Export profile data as JSON file download
   */
  const handleExportProfile = useCallback((profile, isAdjusted = false) => {
    if (!profile) return;

    const data = isAdjusted && result
      ? extractAdjustedData(profile, result, profile.id === profileA?.id)
      : extractRawProfileData(profile);

    const filename = `${profile.name || 'profile'}_${isAdjusted ? 'ADJUSTED' : 'RAW'}_${new Date().toISOString().slice(0, 10)}.json`;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`[Export] Downloaded ${filename}`);
  }, [extractRawProfileData, extractAdjustedData, result, profileA]);

  /**
   * Export full compatibility report as Markdown
   * RT-Engine v1 Realism-Mode Diagnostic Report
   */
  const handleExportMarkdownReport = useCallback(() => {
    if (!profileA || !profileB || !result) return;

    const nameA = profileA.name || profileA.displayName || 'Profile A';
    const nameB = profileB.name || profileB.displayName || 'Profile B';
    const adjusted = result.compatibility?.overall || {};
    const penalties = result.compatibility?.penalties || {};
    const riskAssessment = result.risk_assessment || {};
    const thirdChart = result.third_chart || {};
    const coreSignals = result.compatibility?.core_signals || {};
    const engine = result.engine || 'RT-Engine v1';

    // Build Markdown report - RT-Engine v1 Template
    const markdown = `# Compatibility Report: ${nameA} × ${nameB}

**Generated:** ${new Date().toISOString().slice(0, 19).replace('T', ' ')}
**Engine:** ${engine} (Realism Mode)

---

## Final Score

| Metric | Value |
|--------|-------|
| **Grade** | ${adjusted.grade || 'N/A'} |
| **Final Score** | ${((adjusted.score || 0) * 100).toFixed(1)}% |
| **Risk Index** | ${((riskAssessment.risk_index?.value || 0) * 100).toFixed(0)}% (${riskAssessment.risk_index?.label || 'N/A'}) |
| **Interpretation** | ${adjusted.interpretationKey || 'N/A'} |

---

## Red Flags

${riskAssessment.red_flags?.flags?.length > 0
  ? riskAssessment.red_flags.flags.map(flag => `- ⚠️ ${flag}`).join('\n')
  : '- ✅ None detected'}

---

## Core Diagnostics (RT-Engine v1)

| Signal | Value |
|--------|-------|
| **Archetype Similarity** | ${((coreSignals.archetype_similarity || adjusted.rawScore || 0) * 100).toFixed(1)}% |
| **Stress Compatibility** | ${((coreSignals.stress_compatibility || riskAssessment.stress_resilience?.value || 0) * 100).toFixed(1)}% |
| **Third Chart Coherence** | ${((coreSignals.third_chart_coherence || thirdChart.coherence || 0) * 100).toFixed(1)}% |
| **Penalty Total** | ${((coreSignals.penalty_total || (penalties.total || 0) / 100) * 100).toFixed(1)}% |

---

## Third Chart Analysis

### Coherence
- **Coherence Score:** ${((thirdChart.coherence || 0) * 100).toFixed(0)}%

### Stress Patterns
${thirdChart.stress_patterns?.length > 0
  ? thirdChart.stress_patterns.map(p => `
#### ${p.pattern}
- **Strength:** ${((p.strength || 0) * 100).toFixed(0)}%
- **Description:** ${p.description}
- **Axes:** ${p.axes?.join(', ') || 'N/A'}
`).join('\n')
  : '_No stress patterns detected_'}

### Lifecycle Stages
${thirdChart.lifecycle_stages?.slice(0, 4).map(stage => `
#### ${stage.stage} (${stage.period})
- **Energy:** ${((stage.energy || 0) * 100).toFixed(0)}%
- **Description:** ${stage.description}
- **Key Axes:** ${stage.key_axes?.join(', ') || 'N/A'}
`).join('\n') || '_No lifecycle stages available_'}

---

## Third Chart Archetype Vector (16-dim)

\`\`\`json
${JSON.stringify(thirdChart.archetype_vector_16 || [], null, 2)}
\`\`\`

---

## Summary

> ${adjusted.interpretation || result.compatibility?.narrative || 'No interpretation available.'}

---

## Strengths
${result.compatibility?.strengths?.length > 0
  ? result.compatibility.strengths.map(s => `- ✅ ${s}`).join('\n')
  : '- _No significant strengths identified_'}

## Challenges
${result.compatibility?.challenges?.length > 0
  ? result.compatibility.challenges.map(c => `- ⚠️ ${c}`).join('\n')
  : '- _No significant challenges identified_'}

---

_Report generated by GENESIS Cathedral — RT-Engine v1_
`;

    // Download as .md file
    const filename = `Compatibility_${nameA}_x_${nameB}_${new Date().toISOString().slice(0, 10)}.md`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`[Export] Downloaded Markdown report: ${filename}`);
  }, [profileA, profileB, result]);

  // Profile dropdown component
  const ProfileDropdown = ({ value, onChange, label, excludeId }) => (
    <div className="flex-1">
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select a profile...</option>

        {allProfiles.user.length > 0 && (
          <optgroup label="Your Profiles">
            {allProfiles.user
              .filter(p => p.id !== excludeId)
              .map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            }
          </optgroup>
        )}

        <optgroup label="Historical Figures">
          {allProfiles.curated
            .filter(p => p.type === 'historical' || p.type === 'historical_president')
            .filter(p => p.id !== excludeId)
            .map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))
          }
        </optgroup>

        <optgroup label="Modern Figures">
          {allProfiles.curated
            .filter(p => p.type === 'modern')
            .filter(p => p.id !== excludeId)
            .map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))
          }
        </optgroup>

        <optgroup label="World Leaders">
          {allProfiles.curated
            .filter(p => p.type === 'guest')
            .filter(p => p.id !== excludeId)
            .map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))
          }
        </optgroup>
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            GENESIS Unified Compatibility
          </h1>
          <p className="text-gray-400 mt-1">
            90-Dimensional Metaphysical Analysis
          </p>
        </div>

        {/* Profile Selection */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <div className="flex gap-4 items-end">
            <ProfileDropdown
              value={selectedProfileAId}
              onChange={setSelectedProfileAId}
              label="Profile A"
              excludeId={selectedProfileBId}
            />

            <div className="flex items-center justify-center w-12 h-10">
              <span className="text-2xl">💫</span>
            </div>

            <ProfileDropdown
              value={selectedProfileBId}
              onChange={setSelectedProfileBId}
              label="Profile B"
              excludeId={selectedProfileAId}
            />

            <button
              onClick={handleCalculate}
              disabled={!profileA || !profileB || loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500
                         transition-all duration-200"
            >
              {loading ? 'Analyzing...' : 'Analyze Compatibility'}
            </button>

            {/* Markdown Report Export Button - only shows after calculation */}
            {result && (
              <button
                onClick={handleExportMarkdownReport}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium
                           hover:from-emerald-500 hover:to-teal-500 transition-all duration-200
                           flex items-center gap-2"
                title="Export full compatibility report as Markdown"
              >
                <span>📝</span>
                <span>Export Report</span>
              </button>
            )}
          </div>

          {/* Quick profile info */}
          {(profileA || profileB) && (
            <div className="flex gap-8 mt-4 pt-4 border-t border-gray-700">
              {profileA && (
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Profile A</span>
                    {/* Export buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleExportProfile(profileA, false)}
                        className="text-xs px-2 py-0.5 bg-gray-700/50 border border-gray-600 rounded
                                   hover:bg-gray-600/50 text-gray-400 hover:text-gray-200"
                        title="Export RAW data (before adjustment)"
                      >
                        RAW
                      </button>
                      {result && (
                        <button
                          onClick={() => handleExportProfile(profileA, true)}
                          className="text-xs px-2 py-0.5 bg-blue-700/50 border border-blue-600 rounded
                                     hover:bg-blue-600/50 text-blue-400 hover:text-blue-200"
                          title="Export ADJUSTED data (after calculation)"
                        >
                          ADJ
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    <strong>{profileA.name}</strong>
                    {profileA.constitutional?.western?.sun?.sign && (
                      <span className="ml-2 text-gray-500">
                        ({profileA.constitutional.western.sun.sign})
                      </span>
                    )}
                  </p>
                  {/* BaZi missing warning and recalculate button */}
                  {profileNeedsBaZi(profileA) && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-orange-400">⚠️ BaZi needs recalculation</span>
                      <button
                        onClick={() => handleRecalculateBaZi(profileA.id, profileA.name)}
                        disabled={recalculating[profileA.id]}
                        className="text-xs px-2 py-1 bg-orange-600/30 border border-orange-500/50 rounded
                                   hover:bg-orange-600/50 disabled:opacity-50 text-orange-300"
                      >
                        {recalculating[profileA.id] ? '🔄 Recalculating...' : '🔄 Recalculate BaZi'}
                      </button>
                    </div>
                  )}
                </div>
              )}
              {profileB && (
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Profile B</span>
                    {/* Export buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleExportProfile(profileB, false)}
                        className="text-xs px-2 py-0.5 bg-gray-700/50 border border-gray-600 rounded
                                   hover:bg-gray-600/50 text-gray-400 hover:text-gray-200"
                        title="Export RAW data (before adjustment)"
                      >
                        RAW
                      </button>
                      {result && (
                        <button
                          onClick={() => handleExportProfile(profileB, true)}
                          className="text-xs px-2 py-0.5 bg-blue-700/50 border border-blue-600 rounded
                                     hover:bg-blue-600/50 text-blue-400 hover:text-blue-200"
                          title="Export ADJUSTED data (after calculation)"
                        >
                          ADJ
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    <strong>{profileB.name}</strong>
                    {profileB.constitutional?.western?.sun?.sign && (
                      <span className="ml-2 text-gray-500">
                        ({profileB.constitutional.western.sun.sign})
                      </span>
                    )}
                  </p>
                  {/* BaZi missing warning and recalculate button */}
                  {profileNeedsBaZi(profileB) && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-orange-400">⚠️ BaZi needs recalculation</span>
                      <button
                        onClick={() => handleRecalculateBaZi(profileB.id, profileB.name)}
                        disabled={recalculating[profileB.id]}
                        className="text-xs px-2 py-1 bg-orange-600/30 border border-orange-500/50 rounded
                                   hover:bg-orange-600/50 disabled:opacity-50 text-orange-300"
                      >
                        {recalculating[profileB.id] ? '🔄 Recalculating...' : '🔄 Recalculate BaZi'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Recalculation error message */}
          {recalcError && (
            <div className="mt-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-300">❌ {recalcError}</p>
              <p className="text-xs text-red-400 mt-2">
                Option 1: Start Python backend - <code className="bg-red-900/50 px-1 rounded">cd functions-python && python -m flask run --port=5001</code>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Option 2: Try regenerating from existing profile data (no backend needed):
              </p>
              <div className="mt-2 flex gap-2">
                {profileA && profileA.category === 'user' && (
                  <button
                    onClick={() => handleRegenerateConstitution(profileA.id, profileA.name)}
                    disabled={recalculating[profileA.id]}
                    className="text-xs px-2 py-1 bg-blue-600/30 border border-blue-500/50 rounded
                               hover:bg-blue-600/50 disabled:opacity-50 text-blue-300"
                  >
                    {recalculating[profileA.id] ? '🔄...' : `🔄 Regenerate ${profileA.name}`}
                  </button>
                )}
                {profileB && profileB.category === 'user' && (
                  <button
                    onClick={() => handleRegenerateConstitution(profileB.id, profileB.name)}
                    disabled={recalculating[profileB.id]}
                    className="text-xs px-2 py-1 bg-blue-600/30 border border-blue-500/50 rounded
                               hover:bg-blue-600/50 disabled:opacity-50 text-blue-300"
                  >
                    {recalculating[profileB.id] ? '🔄...' : `🔄 Regenerate ${profileB.name}`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {['overview', 'breakdown', 'third-chart', 'charts', 'narrative'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tab === 'overview' && '📊 Overview'}
                  {tab === 'breakdown' && '📋 Breakdown'}
                  {tab === 'third-chart' && '💫 Third Chart'}
                  {tab === 'charts' && '📈 Charts'}
                  {tab === 'narrative' && '📖 Narrative'}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Score */}
                <div className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center">
                  <CompatibilityGauge
                    score={result.compatibility.overall.score}
                    grade={result.compatibility.overall.grade}
                    level={result.compatibility.overall.level}
                  />
                  <p className="text-center text-gray-400 mt-4 text-sm">
                    {result.compatibility.overall.interpretation}
                  </p>
                </div>

                {/* Core Signals (RT-Engine v1) or System Scores (Legacy) */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    {result.engine === 'RT-Engine v1' ? 'Core Diagnostic Signals' : 'System Scores'}
                  </h3>

                  {/* RT-Engine v1 Core Signals */}
                  {result.compatibility.core_signals && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Archetype Similarity</span>
                          <span className="text-cyan-400">
                            {((result.compatibility.core_signals.archetype_similarity || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-cyan-500 h-2 rounded-full"
                            style={{ width: `${(result.compatibility.core_signals.archetype_similarity || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Stress Compatibility</span>
                          <span className="text-amber-400">
                            {((result.compatibility.core_signals.stress_compatibility || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${(result.compatibility.core_signals.stress_compatibility || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Third Chart Coherence</span>
                          <span className="text-purple-400">
                            {((result.compatibility.core_signals.third_chart_coherence || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(result.compatibility.core_signals.third_chart_coherence || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                      {result.compatibility.core_signals.penalty_total > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Penalty Deduction</span>
                            <span className="text-red-400">
                              -{(result.compatibility.core_signals.penalty_total * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${result.compatibility.core_signals.penalty_total * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Legacy System Scores */}
                  {result.compatibility.system_scores && !result.compatibility.core_signals && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Western Astrology</span>
                          <span className="text-blue-400">
                            {((result.compatibility.system_scores.western || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(result.compatibility.system_scores.western || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">BaZi (Chinese)</span>
                          <span className="text-pink-400">
                            {((result.compatibility.system_scores.bazi || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full"
                            style={{ width: `${(result.compatibility.system_scores.bazi || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {result.compatibility.strengths?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Key Strengths</h4>
                      <ul className="space-y-1">
                        {result.compatibility.strengths.slice(0, 3).map((s, i) => (
                          <li key={i} className="text-sm text-green-400 flex items-center gap-2">
                            <span>✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Third Chart Preview */}
                <ThirdChartCard thirdChart={result.third_chart} />
              </div>
            )}

            {/* Breakdown Tab */}
            {activeTab === 'breakdown' && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Section-by-Section Breakdown
                </h3>
                <SectionsTable sections={result.compatibility.sections} />
              </div>
            )}

            {/* Third Chart Tab */}
            {activeTab === 'third-chart' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ThirdChartCard thirdChart={result.third_chart} />

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Stress Chamber Analysis
                  </h3>
                  <StressPatternsDisplay
                    patterns={result.third_chart?.stress_patterns}
                    classification={result.third_chart?.stress_classification}
                  />
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Relationship Lifecycle Forecast
                  </h3>
                  <LifecycleChart stages={result.third_chart?.lifecycle_stages} />

                  {/* Stage details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {result.third_chart?.lifecycle_stages?.map(stage => (
                      <div key={stage.stage} className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-200">{stage.stage}</div>
                        <div className="text-xs text-gray-500">{stage.period}</div>
                        <div className="text-lg font-bold text-green-400 mt-1">
                          {(stage.energy * 100).toFixed(0)}%
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{stage.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Charts Tab */}
            {activeTab === 'charts' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Archetype Comparison (Radar)
                  </h3>
                  <ArchetypeRadarChart
                    profileA={buildProfileForCompatibility(profileA)}
                    profileB={buildProfileForCompatibility(profileB)}
                    thirdChart={result.third_chart}
                  />
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    BaZi Element Distribution
                  </h3>
                  <ElementComparisonChart
                    profileA={buildProfileForCompatibility(profileA)}
                    profileB={buildProfileForCompatibility(profileB)}
                  />
                </div>

                {/* Section Scores Bar Chart */}
                <div className="bg-gray-800/50 rounded-xl p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Section Score Distribution
                  </h3>
                  <div className="h-80">
                    <ResponsiveBar
                      data={result.compatibility.sections.map(s => ({
                        section: formatSectionName(s.name).replace('BaZi ', '').replace('Western ', ''),
                        score: Math.round(s.score * 100),
                        contribution: Math.round((s.score * s.weight) * 1000) / 10
                      }))}
                      keys={['score']}
                      indexBy="section"
                      margin={{ top: 30, right: 20, bottom: 100, left: 60 }}
                      padding={0.3}
                      colors={({ data }) => data.score >= 85 ? '#22c55e' : data.score >= 70 ? '#84cc16' : data.score >= 55 ? '#eab308' : '#f97316'}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legendOffset: 70
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        legend: 'Score %',
                        legendPosition: 'middle',
                        legendOffset: -45,
                        format: v => `${v}%`
                      }}
                      valueFormat={v => `${v}%`}
                      label={d => `${d.value}%`}
                      labelSkipWidth={20}
                      labelSkipHeight={16}
                      labelTextColor="#ffffff"
                      theme={{
                        background: 'transparent',
                        textColor: '#e5e7eb',
                        grid: { line: { stroke: '#374151' } },
                        labels: { text: { fontSize: 11, fontWeight: 600 } },
                        axis: {
                          ticks: { text: { fill: '#e5e7eb' } },
                          legend: { text: { fill: '#e5e7eb' } }
                        }
                      }}
                      tooltip={({ data }) => (
                        <div className="bg-gray-800 px-3 py-2 rounded shadow-lg border border-gray-700">
                          <div className="font-medium text-gray-200">{data.section}</div>
                          <div className="text-sm text-gray-400">Score: <span className="text-green-400">{data.score}%</span></div>
                          <div className="text-sm text-gray-400">Contribution: <span className="text-blue-400">{data.contribution}%</span></div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Narrative Tab */}
            {activeTab === 'narrative' && (
              <div className="space-y-6">
                <NarrativeSection
                  title="Compatibility Analysis"
                  narrative={result.compatibility.narrative}
                />

                {result.third_chart?.narrative && (
                  <NarrativeSection
                    title="The Third Chart - Your Relationship Being"
                    narrative={result.third_chart.narrative}
                  />
                )}

                {/* Deep Interpretation */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    Day Master Interaction
                  </h3>
                  <div className="text-gray-300 leading-relaxed">
                    <p>
                      <strong className="text-white">{result.compatibility.profiles?.a?.day_master || 'Unknown'}</strong> Day Master
                      meets <strong className="text-white">{result.compatibility.profiles?.b?.day_master || 'Unknown'}</strong> Day Master.
                    </p>
                    <p className="mt-3">
                      {getDayMasterInteraction(
                        result.compatibility.profiles?.a?.day_master,
                        result.compatibility.profiles?.b?.day_master
                      )}
                    </p>
                  </div>
                </div>

                {/* Western Sign Interaction */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    Western Sign Dynamics
                  </h3>
                  <div className="text-gray-300 leading-relaxed">
                    <p>
                      <strong className="text-white">{result.compatibility.profiles?.a?.sign || 'Unknown'}</strong>
                      {' '}and{' '}
                      <strong className="text-white">{result.compatibility.profiles?.b?.sign || 'Unknown'}</strong>
                      {' '}combine their energies.
                    </p>
                    <p className="mt-3">
                      {getSignInteraction(
                        result.compatibility.profiles?.a?.sign,
                        result.compatibility.profiles?.b?.sign
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="bg-gray-800/30 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🔮</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Select Two Profiles to Begin
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Choose from your personal profiles or explore compatibility between
              historical and modern figures using the GENESIS 90-dimensional unified engine.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// INTERPRETATION HELPERS
// ============================================================================

function getDayMasterInteraction(dmA, dmB) {
  const DAY_MASTER_ELEMENTS = {
    Jia: 'Wood', Yi: 'Wood',
    Bing: 'Fire', Ding: 'Fire',
    Wu: 'Earth', Ji: 'Earth',
    Geng: 'Metal', Xin: 'Metal',
    Ren: 'Water', Gui: 'Water'
  };

  const elemA = DAY_MASTER_ELEMENTS[dmA];
  const elemB = DAY_MASTER_ELEMENTS[dmB];

  if (!elemA || !elemB) return 'Day Master elements create unique dynamics in this relationship.';

  const PRODUCES = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
  const CONTROLS = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };

  if (PRODUCES[elemA] === elemB) {
    return `${dmA} (${elemA}) nourishes ${dmB} (${elemB}) in a generative relationship. ${elemA} produces ${elemB}, creating supportive energy flow. The ${elemA} person feeds the ${elemB} person's vitality.`;
  }
  if (PRODUCES[elemB] === elemA) {
    return `${dmB} (${elemB}) nourishes ${dmA} (${elemA}) in a generative relationship. ${elemB} produces ${elemA}, creating supportive energy flow. The ${elemB} person feeds the ${elemA} person's vitality.`;
  }
  if (CONTROLS[elemA] === elemB) {
    return `${dmA} (${elemA}) has a controlling influence over ${dmB} (${elemB}). This can provide structure but may require balance to avoid dominance.`;
  }
  if (CONTROLS[elemB] === elemA) {
    return `${dmB} (${elemB}) has a controlling influence over ${dmA} (${elemA}). This can provide structure but may require balance to avoid dominance.`;
  }
  if (elemA === elemB) {
    return `Both share ${elemA} energy, creating strong resonance and mutual understanding. This same-element pairing brings harmony but may need variety.`;
  }

  return `${elemA} and ${elemB} create a complementary dynamic with indirect support patterns.`;
}

function getSignInteraction(signA, signB) {
  const SIGN_ELEMENTS = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
  };

  const elemA = SIGN_ELEMENTS[signA];
  const elemB = SIGN_ELEMENTS[signB];

  if (!elemA || !elemB) return 'These signs create unique Western astrological dynamics.';

  const HARMONIOUS = {
    Fire: ['Fire', 'Air'],
    Earth: ['Earth', 'Water'],
    Air: ['Air', 'Fire'],
    Water: ['Water', 'Earth']
  };

  if (HARMONIOUS[elemA]?.includes(elemB)) {
    return `${signA} (${elemA}) and ${signB} (${elemB}) share natural harmony. These elements support and energize each other, creating ease in communication and shared values.`;
  }

  if (elemA === elemB) {
    return `Both signs share ${elemA} element energy, creating deep understanding and similar approaches to life. This resonance builds strong intuitive connection.`;
  }

  return `${signA} (${elemA}) and ${signB} (${elemB}) represent different elemental approaches. This contrast can bring growth through complementary perspectives, though it may require conscious understanding.`;
}
