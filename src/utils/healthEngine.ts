import type { TenGodKey, TenGodProfile } from './tenGodsEngine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HealthSystem =
  | 'heart' | 'liver' | 'spleen' | 'lungs' | 'kidneys'
  | 'nervous' | 'metabolic' | 'immune' | 'mental' | 'muscular';

export interface HealthSystemRisk {
  system: HealthSystem;
  score: number;        // 0-100
  level: 'low' | 'mild' | 'elevated' | 'high';
  element: string;      // primary element association
  description: string;  // what this system governs
  advice: string;       // actionable guidance
}

export interface HealthRiskReport {
  systems: HealthSystemRisk[];
  dominantRisks: HealthSystem[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_HEALTH_SYSTEMS: HealthSystem[] = [
  'heart', 'liver', 'spleen', 'lungs', 'kidneys',
  'nervous', 'metabolic', 'immune', 'mental', 'muscular',
];

/**
 * Maps each Ten God to the health systems it stresses, with a 0-1 weight.
 * Based on BaZi medical theory: excess or imbalance in a God's Qi puts
 * proportional strain on the associated organ systems.
 */
export const TEN_GOD_HEALTH_WEIGHTS: Record<TenGodKey, Partial<Record<HealthSystem, number>>> = {
  friend:           { muscular: 1.0, nervous: 0.3 },
  robWealth:        { heart: 0.5, muscular: 0.8, nervous: 0.5 },
  eatingGod:        { spleen: 1.0, metabolic: 0.5 },
  hurtingOfficer:   { liver: 1.0, nervous: 0.8 },
  directWealth:     { metabolic: 1.0, spleen: 0.5 },
  indirectWealth:   { heart: 0.5, metabolic: 0.7 },
  directOfficer:    { heart: 1.0, nervous: 0.5 },
  sevenKillings:    { kidneys: 1.0, heart: 0.5, nervous: 0.7 },
  directResource:   { lungs: 1.0, immune: 0.8 },
  indirectResource: { mental: 1.0, nervous: 0.5 },
};

/**
 * TCM element association and brief description for each health system.
 */
export const HEALTH_SYSTEM_INFO: Record<HealthSystem, { element: string; description: string }> = {
  heart:     { element: 'Fire',       description: 'Cardiovascular, blood pressure, circulation' },
  liver:     { element: 'Wood',       description: 'Detoxification, emotional processing, tendons' },
  spleen:    { element: 'Earth',      description: 'Digestion, nutrient absorption, energy' },
  lungs:     { element: 'Metal',      description: 'Respiration, immunity, skin' },
  kidneys:   { element: 'Water',      description: 'Adrenals, bones, reproductive' },
  nervous:   { element: 'Fire/Water', description: 'Stress response, sleep, anxiety' },
  metabolic: { element: 'Earth',      description: 'Blood sugar, weight, hormone balance' },
  immune:    { element: 'Metal',      description: 'Defense, allergies, autoimmune' },
  mental:    { element: 'Water',      description: 'Mood, focus, psychological resilience' },
  muscular:  { element: 'Wood',       description: 'Tension, strain, physical endurance' },
};

// ---------------------------------------------------------------------------
// Advice per system per risk level
// ---------------------------------------------------------------------------

const ADVICE: Record<HealthSystem, Record<'low' | 'mild' | 'elevated' | 'high', string>> = {
  heart: {
    low:      'Heart health looks well-supported. Maintain regular cardio exercise.',
    mild:     'Minor cardiovascular stress possible. Stay active and manage sodium intake.',
    elevated: 'Monitor blood pressure regularly. Consider stress-reducing practices like meditation.',
    high:     'Significant cardiovascular strain indicated. Prioritize heart-healthy diet, regular check-ups, and stress management.',
  },
  liver: {
    low:      'Liver function appears balanced. Maintain moderate alcohol intake and a clean diet.',
    mild:     'Mild liver stress detected. Reduce processed foods and support detox with leafy greens.',
    elevated: 'Liver under notable strain. Avoid excess alcohol, prioritize sleep, and address suppressed emotions.',
    high:     'Significant liver burden indicated. Consider liver-supportive herbs, strict dietary discipline, and emotional release practices.',
  },
  spleen: {
    low:      'Digestive system appears well-balanced. Continue eating regular, warm meals.',
    mild:     'Mild digestive sensitivity. Avoid cold and raw foods in excess; eat at consistent times.',
    elevated: 'Digestive strain noticeable. Focus on cooked, easily digestible meals and reduce sugar.',
    high:     'Significant spleen-stomach imbalance. Prioritize warm, nourishing foods and address worry or overthinking patterns.',
  },
  lungs: {
    low:      'Respiratory health appears strong. Maintain good air quality and breathing practices.',
    mild:     'Mild respiratory sensitivity. Practice deep breathing exercises and stay hydrated.',
    elevated: 'Lung Qi under strain. Avoid dry or polluted environments; consider breathing exercises or Qi Gong.',
    high:     'Significant respiratory vulnerability. Prioritize lung-strengthening exercises, humidify air, and address unresolved grief.',
  },
  kidneys: {
    low:      'Kidney and adrenal function appears balanced. Stay well-hydrated.',
    mild:     'Mild adrenal fatigue possible. Ensure adequate rest and avoid chronic overwork.',
    elevated: 'Kidney Qi under notable strain. Reduce caffeine, prioritize sleep, and consider warming foods.',
    high:     'Significant kidney-adrenal depletion indicated. Address burnout, prioritize deep rest, and nourish with bone broth and dark foods.',
  },
  nervous: {
    low:      'Nervous system appears resilient. Maintain healthy sleep habits.',
    mild:     'Mild nervous tension possible. Incorporate daily relaxation routines.',
    elevated: 'Nervous system under significant strain. Prioritize sleep hygiene, reduce stimulants, and practice grounding.',
    high:     'Significant nervous system overload. Strongly consider professional stress management, adaptogenic herbs, and reduced screen time.',
  },
  metabolic: {
    low:      'Metabolic function looks balanced. Maintain regular meals and movement.',
    mild:     'Minor metabolic fluctuations possible. Monitor energy levels and eat balanced meals.',
    elevated: 'Metabolic imbalance emerging. Focus on blood sugar stability through protein-rich meals and regular exercise.',
    high:     'Significant metabolic disruption indicated. Prioritize hormonal health, consistent meal timing, and medical blood work.',
  },
  immune: {
    low:      'Immune function appears robust. Continue supporting with varied nutrition.',
    mild:     'Mild immune sensitivity. Ensure adequate vitamin C, zinc, and rest.',
    elevated: 'Immune system under strain. Address allergies proactively and support gut health with probiotics.',
    high:     'Significant immune vulnerability. Prioritize gut health, anti-inflammatory diet, and allergy management.',
  },
  mental: {
    low:      'Psychological resilience appears strong. Maintain social connections and creative outlets.',
    mild:     'Mild mood fluctuations possible. Ensure regular exercise and sufficient daylight exposure.',
    elevated: 'Mental-emotional strain noticeable. Consider journaling, therapy, or mindfulness practices.',
    high:     'Significant psychological burden indicated. Strongly consider professional support, reduce isolation, and prioritize self-care.',
  },
  muscular: {
    low:      'Musculoskeletal system appears well-supported. Maintain regular stretching and movement.',
    mild:     'Mild muscular tension possible. Incorporate stretching and ensure adequate magnesium.',
    elevated: 'Muscular strain and tension building. Prioritize regular massage, yoga, or targeted physical therapy.',
    high:     'Significant musculoskeletal stress indicated. Address posture, reduce physical overexertion, and pursue bodywork therapy.',
  },
};

// ---------------------------------------------------------------------------
// Core computation
// ---------------------------------------------------------------------------

function classifyLevel(score: number): 'low' | 'mild' | 'elevated' | 'high' {
  if (score < 25) return 'low';
  if (score < 50) return 'mild';
  if (score < 75) return 'elevated';
  return 'high';
}

/**
 * Computes a health risk report from a Ten God profile.
 *
 * For each health system the raw score is the weighted sum of each God's
 * `shareOfTotalQi` multiplied by its weight for that system, then scaled
 * to a 0-100 range (x200, capped at 100).
 */
export function computeHealthRisk(profile: TenGodProfile): HealthRiskReport {
  const systems: HealthSystemRisk[] = ALL_HEALTH_SYSTEMS.map((sys) => {
    let raw = 0;

    for (const godKey of Object.keys(TEN_GOD_HEALTH_WEIGHTS) as TenGodKey[]) {
      const weight = TEN_GOD_HEALTH_WEIGHTS[godKey][sys];
      if (weight == null) continue;
      raw += profile.gods[godKey].shareOfTotalQi * weight;
    }

    const score = Math.min(100, Math.round(raw * 200));
    const level = classifyLevel(score);
    const info = HEALTH_SYSTEM_INFO[sys];

    return {
      system: sys,
      score,
      level,
      element: info.element,
      description: info.description,
      advice: ADVICE[sys][level],
    };
  });

  const dominantRisks = systems
    .filter((s) => s.level === 'high' || s.level === 'elevated')
    .sort((a, b) => b.score - a.score)
    .map((s) => s.system);

  const summary = generateHealthNarrative({ systems, dominantRisks, summary: '' });

  return { systems, dominantRisks, summary };
}

// ---------------------------------------------------------------------------
// Narrative generation
// ---------------------------------------------------------------------------

const SYSTEM_LABELS: Record<HealthSystem, string> = {
  heart:     'cardiovascular',
  liver:     'liver and detox',
  spleen:    'digestive',
  lungs:     'respiratory',
  kidneys:   'kidney and adrenal',
  nervous:   'nervous system',
  metabolic: 'metabolic',
  immune:    'immune',
  mental:    'mental-emotional',
  muscular:  'musculoskeletal',
};

/**
 * Generates a 2-3 sentence narrative highlighting dominant risks and
 * overall resilience from a health risk report.
 */
export function generateHealthNarrative(report: HealthRiskReport): string {
  const high = report.systems.filter((s) => s.level === 'high');
  const elevated = report.systems.filter((s) => s.level === 'elevated');
  const low = report.systems.filter((s) => s.level === 'low');

  const parts: string[] = [];

  if (high.length > 0) {
    const names = high.map((s) => SYSTEM_LABELS[s.system]).join(', ');
    parts.push(
      `High-priority attention is recommended for the ${names} system${high.length > 1 ? 's' : ''}, where Qi imbalance is most pronounced.`,
    );
  }

  if (elevated.length > 0) {
    const names = elevated.map((s) => SYSTEM_LABELS[s.system]).join(', ');
    parts.push(
      `Elevated strain is also present in the ${names} area${elevated.length > 1 ? 's' : ''}, warranting mindful preventive care.`,
    );
  }

  if (high.length === 0 && elevated.length === 0) {
    parts.push('No significant health vulnerabilities are indicated by this chart — overall Qi distribution is well-balanced.');
  }

  if (low.length >= 5) {
    parts.push('The chart shows broad resilience across multiple organ systems, which is a strong constitutional foundation.');
  } else if (low.length > 0) {
    const names = low.map((s) => SYSTEM_LABELS[s.system]).join(', ');
    parts.push(`Natural resilience is strongest in the ${names} area${low.length > 1 ? 's' : ''}.`);
  }

  return parts.join(' ');
}
