/**
 * zoneKnowledgeBuilder.js
 *
 * Builds formatted zone knowledge text for Luna's knowledge prompt.
 * Generates three sections:
 *   1. Zone system explanation (~80 tokens)
 *   2. User's Constitutional Trinity zones — Sun, Moon, Rising (~500 tokens)
 *   3. Condensed 72-zone reference table (~900 tokens)
 *
 * Total: ~1,500 tokens added to Luna's knowledge context.
 */

// Zone Data (static arrays of 6 zones each)
import { ariesZones } from '../data/ariesZones';
import { taurusZones } from '../data/taurusZones';
import { geminiZones } from '../data/geminiZones';
import { cancerZones } from '../data/cancerZones';
import { leoZones } from '../data/leoZones';
import { virgoZones } from '../data/virgoZones';
import { libraZones } from '../data/libraZones';
import { scorpioZones } from '../data/scorpioZones';
import { sagittariusZones } from '../data/sagittariusZones';
import { capricornZones } from '../data/capricornZones';
import { aquariusZones } from '../data/aquariusZones';
import { piscesZones } from '../data/piscesZones';

// Sign-to-zones lookup map
const SIGN_ZONES_MAP = {
  Aries: ariesZones,
  Taurus: taurusZones,
  Gemini: geminiZones,
  Cancer: cancerZones,
  Leo: leoZones,
  Virgo: virgoZones,
  Libra: libraZones,
  Scorpio: scorpioZones,
  Sagittarius: sagittariusZones,
  Capricorn: capricornZones,
  Aquarius: aquariusZones,
  Pisces: piscesZones
};

const SIGN_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_ABBREV = {
  Aries: 'Ari', Taurus: 'Tau', Gemini: 'Gem', Cancer: 'Can',
  Leo: 'Leo', Virgo: 'Vir', Libra: 'Lib', Scorpio: 'Sco',
  Sagittarius: 'Sag', Capricorn: 'Cap', Aquarius: 'Aqu', Pisces: 'Pis'
};

/**
 * Look up a zone for a given sign + degree within sign
 */
export function getZoneForPlacement(sign, degree) {
  if (!sign || degree == null) return null;
  const normalized = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  const zones = SIGN_ZONES_MAP[normalized];
  if (!zones) return null;
  return zones.find(z => degree >= z.degreeRange.start && degree <= z.degreeRange.end) || null;
}

/**
 * Format a single Constitutional Trinity placement with rich detail
 */
function formatDetailedZone(zone, sign, degree, label) {
  const lines = [];

  lines.push(`**${label} Zone: ${sign} Zone ${zone.id} — "${zone.name}" (${zone.degreeRange.start}°–${zone.degreeRange.end}° ${sign})**`);
  lines.push(`Archetype: ${zone.archetype}`);

  if (zone.dateRange) {
    lines.push(`Dates: ${zone.dateRange.start} – ${zone.dateRange.end}`);
  }

  // Influences (what makes this zone unique)
  if (zone.influences?.length > 0) {
    const influenceStr = zone.influences
      .map(inf => `${inf.source} ${inf.percentage}% (${inf.planet})`)
      .join(' + ');
    lines.push(`Influences: ${influenceStr}`);
  }

  // Top 3 quality dimensions by level
  if (zone.qualities) {
    const sorted = Object.entries(zone.qualities)
      .sort((a, b) => b[1].level - a[1].level)
      .slice(0, 3)
      .map(([key, val]) => `${key}: ${val.level}/100`)
      .join(', ');
    lines.push(`Top qualities: ${sorted}`);
  }

  // Strengths (first 3)
  if (zone.strengths?.length > 0) {
    lines.push(`Strengths: ${zone.strengths.slice(0, 3).join('; ')}`);
  }

  // Shadows (first 2)
  if (zone.shadows?.length > 0) {
    lines.push(`Shadows: ${zone.shadows.slice(0, 2).join('; ')}`);
  }

  // Relationship style (condensed)
  if (zone.relationshipStyle) {
    const rs = zone.relationshipStyle;
    const parts = [];
    if (rs.pursuit) parts.push(rs.pursuit);
    if (rs.conflict) parts.push(`Conflict: ${rs.conflict}`);
    if (parts.length > 0) {
      lines.push(`Relationship: ${parts.join(' | ')}`);
    }
  }

  return lines.join('\n');
}

// Module-level cache for the static reference table
let _cachedReferenceTable = null;

/**
 * Build the condensed 72-zone reference table (cached after first call)
 */
function buildCondensedReferenceTable() {
  if (_cachedReferenceTable) return _cachedReferenceTable;

  const lines = [];

  for (const sign of SIGN_ORDER) {
    const zones = SIGN_ZONES_MAP[sign];
    if (!zones) continue;

    const abbr = SIGN_ABBREV[sign] || sign.substring(0, 3);

    for (const z of zones) {
      // Build influence string (e.g., "Pis25%+Ari75%")
      const infStr = z.influences?.map(inf => {
        const srcAbbr = SIGN_ABBREV[inf.source] || inf.source.substring(0, 3);
        return `${srcAbbr}${inf.percentage}%`;
      }).join('+') || '';

      // Get planet(s)
      const planets = z.influences?.map(inf => inf.planet).join('/') || z.decan?.primaryRuler || '';

      lines.push(`${abbr} Z${z.id} ${z.degreeRange.start}-${z.degreeRange.end}° "${z.name}" ${infStr} ${planets}`);
    }
  }

  _cachedReferenceTable = lines.join('\n');
  return _cachedReferenceTable;
}

/**
 * Build complete zone knowledge text for Luna's knowledge prompt.
 *
 * @param {string} sunSign - e.g., "Cancer"
 * @param {number} sunDegree - degreeInSign (0-29.99)
 * @param {string} [moonSign]
 * @param {number} [moonDegree]
 * @param {string} [risingSign]
 * @param {number} [risingDegree]
 * @returns {string} formatted markdown for inclusion in knowledge prompt
 */
export function buildZoneKnowledgeForLuna(sunSign, sunDegree, moonSign, moonDegree, risingSign, risingDegree) {
  const sections = [];

  // Section 1: Zone System Explanation
  sections.push(`## Zodiac Zone System (Father Ticky's 72 Zones)
Each zodiac sign spans 30° divided into 6 zones of 5° each.
Zone 1 carries echoes of the previous sign (cusp bleed).
Zone 2 is the PUREST expression of the sign.
Zones 3-5 blend with decan rulers (same-element signs).
Zone 6 begins reaching toward the next sign.
This creates 72 distinct personality fingerprints across the zodiac.`);

  // Section 2: Constitutional Trinity Zones
  sections.push('### Your Constitutional Trinity Zones');

  // Sun (always present)
  const sunZone = getZoneForPlacement(sunSign, sunDegree);
  if (sunZone) {
    sections.push(formatDetailedZone(sunZone, sunSign, sunDegree, 'Sun'));
  }

  // Moon (if available)
  if (moonSign && moonDegree != null) {
    const moonZone = getZoneForPlacement(moonSign, moonDegree);
    if (moonZone) {
      sections.push(formatDetailedZone(moonZone, moonSign, moonDegree, 'Moon'));
    }
  }

  // Rising (if available)
  if (risingSign && risingDegree != null) {
    const risingZone = getZoneForPlacement(risingSign, risingDegree);
    if (risingZone) {
      sections.push(formatDetailedZone(risingZone, risingSign, risingDegree, 'Rising'));
    }
  }

  // Section 3: Condensed 72-Zone Reference
  sections.push(`### 72-Zone Reference (all signs)
*Use this to discuss any person's zone when their sign and degree are known:*
${buildCondensedReferenceTable()}`);

  return sections.join('\n\n');
}
