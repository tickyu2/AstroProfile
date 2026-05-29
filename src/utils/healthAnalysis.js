import { ORGAN_SYSTEMS, HEALTH_THRESHOLDS, getElementPattern } from '../data/organSystems';

/**
 * Analyze health patterns from elemental composition
 */
export function analyzeHealthPatterns(adjustedElements) {
  const patterns = {
    excess: [],
    deficiency: [],
    balanced: [],
    moderate: []
  };

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    const el = element.toLowerCase();
    const pct = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    const pattern = getElementPattern(pct);
    const organSystem = ORGAN_SYSTEMS[el];
    if (!organSystem) return;

    const analysis = {
      element: el,
      percentage: pct,
      pattern,
      organSystem: {
        name: organSystem.organs.join(' & '),
        emoji: organSystem.emoji,
        color: organSystem.color
      }
    };

    patterns[pattern].push(analysis);
  });

  return patterns;
}

/**
 * Get primary constitutional type (highest element)
 */
export function getPrimaryConstitution(adjustedElements) {
  let maxElement = null;
  let maxPercentage = 0;

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    const pct = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    if (pct > maxPercentage) {
      maxPercentage = pct;
      maxElement = element.toLowerCase();
    }
  });

  return {
    element: maxElement,
    percentage: maxPercentage,
    organSystem: ORGAN_SYSTEMS[maxElement]
  };
}

/**
 * Get strengths (healthy elements 15-30%)
 */
export function getConstitutionalStrengths(adjustedElements) {
  const strengths = [];

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    const el = element.toLowerCase();
    const pct = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    if (pct >= 15 && pct <= 30) {
      const organ = ORGAN_SYSTEMS[el];
      if (organ) {
        strengths.push({
          element: el,
          percentage: pct,
          organs: organ.organs,
          emoji: organ.emoji
        });
      }
    }
  });

  return strengths.sort((a, b) => b.percentage - a.percentage);
}

/**
 * Get vulnerabilities (deficient elements <10%)
 */
export function getConstitutionalVulnerabilities(adjustedElements) {
  const vulnerabilities = [];

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    const el = element.toLowerCase();
    const pct = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    if (pct < 10) {
      const organ = ORGAN_SYSTEMS[el];
      if (organ) {
        vulnerabilities.push({
          element: el,
          percentage: pct,
          organs: organ.organs,
          emoji: organ.emoji,
          severity: pct < 5 ? 'critical' : 'moderate'
        });
      }
    }
  });

  return vulnerabilities.sort((a, b) => a.percentage - b.percentage);
}

/**
 * Get excess warnings (>30%)
 */
export function getExcessWarnings(adjustedElements) {
  const warnings = [];

  Object.entries(adjustedElements).forEach(([element, percentage]) => {
    const el = element.toLowerCase();
    const pct = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    if (pct > 30) {
      const organ = ORGAN_SYSTEMS[el];
      if (organ) {
        warnings.push({
          element: el,
          percentage: pct,
          organs: organ.organs,
          emoji: organ.emoji,
          severity: pct > 50 ? 'critical' : 'moderate'
        });
      }
    }
  });

  return warnings.sort((a, b) => b.percentage - a.percentage);
}
