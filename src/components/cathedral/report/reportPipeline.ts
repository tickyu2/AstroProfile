/**
 * Omniphonic Report Generator Pipeline
 *
 * Complete pipeline for generating Omniphonic Harmony Reports:
 * 1. Run harmonic detection on two profiles
 * 2. Build heatmap and compute scores
 * 3. Generate narrative via LLM (optional)
 * 4. Render HTML template
 * 5. Convert to PDF
 *
 * Usage:
 *   const pdf = await generateOmniphonicReportPdf({ profileA, profileB });
 */

import { HarmonicHeatmapCell, OmniphonicMetrics } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface ReportProfile {
  name: string;
  raw_traits?: Record<string, number>;
  [key: string]: unknown;
}

export interface ReportRequest {
  profileA: ReportProfile;
  profileB: ReportProfile;
  detectorResults?: HarmonicHeatmapCell[];
  options?: ReportOptions;
}

export interface ReportOptions {
  theme?: 'light' | 'dark';
  includeLLMSummary?: boolean;
  includeAppendix?: boolean;
  format?: 'A4' | 'Letter';
  outputFormat?: 'html' | 'pdf';
}

export interface ReportData {
  profileAName: string;
  profileBName: string;
  generatedAt: string;
  reportId: string;
  omniphonicScore: string;
  scoreArc: string;
  strengthLabel: string;
  summaryText: string;
  dominantCluster: string;
  signatureArchetype: string;
  activeChambers: number;
  activationRate: string;
  heatmap: HeatmapTemplateCell[];
  clusters: ClusterTemplateData[];
  narrative: string;
  omniphonicFieldSvg: string;
  detectors: DetectorTemplateData[];
}

export interface HeatmapTemplateCell {
  id: number;
  cluster: string;
  clusterClass: string;
  triggered: boolean;
  harmonyBoost: string;
  bonus: string;
}

export interface ClusterTemplateData {
  name: string;
  icon: string;
  description: string;
  active: number;
  total: number;
  percent: number;
  chambers: ChamberTemplateData[];
}

export interface ChamberTemplateData {
  id: number;
  name: string;
  triggered: boolean;
  harmonyBoost: string;
  bonus: string;
  intensity: number;
  shortText: string;
}

export interface DetectorTemplateData {
  id: number;
  name: string;
  cluster: string;
  boostRange: string;
  bonusRange: string;
}

// ============================================================================
// CLUSTER METADATA
// ============================================================================

const CLUSTER_ICONS: Record<string, string> = {
  Foundation: '🏛️',
  Flow: '🌊',
  Communication: '💬',
  Meaning: '📖',
  Regulation: '⚖️',
  Connection: '💞',
  Drive: '🔥',
  Repair: '🩹',
  Identity: '🪞',
  Transcendence: '✨'
};

const CLUSTER_DESCRIPTIONS: Record<string, string> = {
  Foundation: 'Core emotional safety, trust, and stability patterns',
  Flow: 'Rhythmic exchange, timing, and responsiveness patterns',
  Communication: 'Signal clarity, transparency, and symbolic understanding',
  Meaning: 'Shared interpretation, salience, and meaning-making',
  Regulation: 'Emotional balance, boundaries, and co-regulation',
  Connection: 'Intimacy, presence, vulnerability, and attunement',
  Drive: 'Motivation, initiative, desire, and commitment patterns',
  Repair: 'Healing rhythms, trust renewal, and resilience',
  Identity: 'Self-coherence, purpose, values, and life-path alignment',
  Transcendence: 'Higher meaning, archetype, ritual, and evolution'
};

const CLUSTER_TO_FAMILY: Record<string, string> = {
  Resonance: 'Foundation',
  Safety: 'Foundation',
  Stability: 'Foundation',
  Trust: 'Foundation',
  Reciprocity: 'Flow',
  Rhythm: 'Flow',
  Tempo: 'Flow',
  Timing: 'Flow',
  Responsiveness: 'Flow',
  Communication: 'Communication',
  Clarity: 'Communication',
  Transparency: 'Communication',
  'Symbolic-Language': 'Communication',
  Meaning: 'Meaning',
  Prediction: 'Meaning',
  Salience: 'Meaning',
  'Context-Flow': 'Meaning',
  'Meaning-Reinforcement': 'Meaning',
  Regulation: 'Regulation',
  'Co-Regulation': 'Regulation',
  Equilibrium: 'Regulation',
  Boundaries: 'Regulation',
  Intimacy: 'Connection',
  Vulnerability: 'Connection',
  Presence: 'Connection',
  Attunement: 'Connection',
  Motivation: 'Drive',
  Desire: 'Drive',
  Initiative: 'Drive',
  Commitment: 'Drive',
  'Initiative-Response': 'Drive',
  Priorities: 'Drive',
  Repair: 'Repair',
  'Repair-Rhythm': 'Repair',
  'Trust-Renewal': 'Repair',
  Resilience: 'Repair',
  Expectations: 'Repair',
  Identity: 'Identity',
  Purpose: 'Identity',
  Values: 'Identity',
  'Life-Path': 'Identity',
  Legacy: 'Transcendence',
  Mythos: 'Transcendence',
  Archetype: 'Transcendence',
  Ritual: 'Transcendence',
  Seasonal: 'Transcendence',
  Evolution: 'Transcendence',
  Destiny: 'Transcendence',
  Transcendence: 'Transcendence',
  Omniphonic: 'Transcendence'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get strength label from omniphonic score
 */
export function getStrengthLabel(score: number): string {
  if (score >= 80) return 'Exceptional Resonance';
  if (score >= 60) return 'Strong Harmony';
  if (score >= 40) return 'Moderate Coherence';
  if (score >= 20) return 'Emerging Alignment';
  return 'Developing Field';
}

/**
 * Get dominant cluster from heatmap
 */
export function getDominantCluster(heatmap: HarmonicHeatmapCell[]): string {
  const familyCounts: Record<string, number> = {};

  heatmap.forEach(cell => {
    const family = CLUSTER_TO_FAMILY[cell.cluster] || 'Foundation';
    if (!familyCounts[family]) familyCounts[family] = 0;
    if (cell.triggered) familyCounts[family]++;
  });

  const sorted = Object.entries(familyCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return sorted[0]?.[0] || 'Foundation';
}

/**
 * Get signature archetype from heatmap
 */
export function getSignatureArchetype(heatmap: HarmonicHeatmapCell[]): string {
  const archetypeCells = heatmap.filter(c =>
    ['Archetype', 'Mythos', 'Symbolic-Language'].includes(c.cluster)
  );
  const activeArchetypes = archetypeCells.filter(c => c.triggered);

  if (activeArchetypes.length >= 2) return 'Deep Archetypal Synergy';
  if (activeArchetypes.length === 1) return 'Emerging Symbolic Resonance';

  const transcendenceCells = heatmap.filter(c =>
    ['Transcendence', 'Destiny', 'Omniphonic'].includes(c.cluster)
  );
  if (transcendenceCells.some(c => c.triggered)) return 'Transcendent Elevation';

  const foundationCells = heatmap.filter(c =>
    ['Safety', 'Trust', 'Stability'].includes(c.cluster)
  );
  if (foundationCells.filter(c => c.triggered).length >= 2) return 'Grounded Security';

  return 'Emergent Harmonic Potential';
}

/**
 * Generate short text for a chamber
 */
function getChamberShortText(cell: HarmonicHeatmapCell): string {
  if (!cell.triggered) {
    return 'This chamber is currently dormant. Conscious attention to this dimension may help activate resonance over time.';
  }

  const intensity = Math.min((cell.harmonyBoost + cell.bonus) / 1.2, 1);

  if (intensity >= 0.7) {
    return `Strong resonance detected. This chamber contributes significantly to the emotional field with high harmony boost.`;
  }
  if (intensity >= 0.4) {
    return `Moderate resonance detected. This chamber provides meaningful support to the overall harmonic structure.`;
  }
  return `Resonance detected. This chamber is active and contributing to the emotional field.`;
}

/**
 * Build cluster view for template
 */
export function buildClusterView(heatmap: HarmonicHeatmapCell[]): ClusterTemplateData[] {
  const familyGroups: Record<string, HarmonicHeatmapCell[]> = {};

  heatmap.forEach(cell => {
    const family = CLUSTER_TO_FAMILY[cell.cluster] || 'Foundation';
    if (!familyGroups[family]) familyGroups[family] = [];
    familyGroups[family].push(cell);
  });

  return Object.entries(familyGroups).map(([family, cells]) => {
    const active = cells.filter(c => c.triggered).length;
    const total = cells.length;
    const percent = total > 0 ? Math.round((active / total) * 100) : 0;

    return {
      name: family,
      icon: CLUSTER_ICONS[family] || '⭐',
      description: CLUSTER_DESCRIPTIONS[family] || '',
      active,
      total,
      percent,
      chambers: cells.map(c => ({
        id: c.id,
        name: c.name,
        triggered: c.triggered,
        harmonyBoost: c.harmonyBoost.toFixed(2),
        bonus: c.bonus.toFixed(2),
        intensity: Math.round(Math.min((c.harmonyBoost + c.bonus) / 1.2, 1) * 100),
        shortText: getChamberShortText(c)
      }))
    };
  });
}

/**
 * Build detector reference for appendix
 */
export function buildDetectorReference(heatmap: HarmonicHeatmapCell[]): DetectorTemplateData[] {
  return heatmap.map(c => ({
    id: c.id,
    name: c.name,
    cluster: c.cluster,
    boostRange: c.id === 50 ? '0.40' : '0.18-0.38',
    bonusRange: c.id === 50 ? '0.85' : '0.36-0.80'
  }));
}

/**
 * Generate a simple unique report ID
 */
export function generateReportId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `OH-${timestamp}-${random}`.toUpperCase();
}

// ============================================================================
// LLM SUMMARY (Optional Integration)
// ============================================================================

export interface LLMClient {
  complete(prompt: string): Promise<string>;
}

/**
 * Generate LLM-assisted summary text
 */
export async function generateLLMSummary(
  omniphonicScore: number,
  dominantCluster: string,
  activeChambers: number,
  llmClient?: LLMClient
): Promise<string> {
  if (!llmClient) {
    // Fallback to deterministic summary
    return getDefaultSummary(omniphonicScore, dominantCluster, activeChambers);
  }

  const prompt = `You are summarizing an emotional harmony report.

Score: ${omniphonicScore.toFixed(1)} / 100
Dominant harmonic family: ${dominantCluster}
Active chambers: ${activeChambers} / 50

Write 2-3 concise sentences in neutral, descriptive language.
Do not give advice. Do not prescribe actions.
Focus on what the field shows, not what should be done.`.trim();

  try {
    return await llmClient.complete(prompt);
  } catch {
    return getDefaultSummary(omniphonicScore, dominantCluster, activeChambers);
  }
}

/**
 * Get default (non-LLM) summary
 */
function getDefaultSummary(score: number, dominantCluster: string, activeChambers: number): string {
  if (score >= 80) {
    return `This exceptional harmonic field shows strong resonance across ${activeChambers} chambers, with particular depth in ${dominantCluster} patterns. The emotional architecture supports profound connection and resilient co-becoming.`;
  }
  if (score >= 60) {
    return `This strong harmonic field demonstrates meaningful alignment across ${activeChambers} chambers, anchored by ${dominantCluster} themes. The foundation supports sustained emotional coherence and mutual understanding.`;
  }
  if (score >= 40) {
    return `This developing harmonic field shows resonance in ${activeChambers} chambers, with emphasis on ${dominantCluster} patterns. The active dimensions provide meaningful anchors for continued growth.`;
  }
  if (score >= 20) {
    return `This emerging harmonic field has ${activeChambers} active chambers, centered on ${dominantCluster} themes. These areas offer starting points for deeper resonance cultivation.`;
  }
  return `This harmonic field is in early formation with ${activeChambers} active chambers. The ${dominantCluster} patterns show initial resonance, with potential for growth through conscious attention.`;
}

// ============================================================================
// MAIN PIPELINE
// ============================================================================

/**
 * Build complete report data from heatmap and metrics
 */
export function buildReportData(
  profileA: ReportProfile,
  profileB: ReportProfile,
  heatmap: HarmonicHeatmapCell[],
  omniphonicScore: number,
  narrative: string,
  omniphonicFieldSvg: string,
  summaryText?: string
): ReportData {
  const activeChambers = heatmap.filter(c => c.triggered).length;
  const activationRate = ((activeChambers / 50) * 100).toFixed(1);
  const dominantCluster = getDominantCluster(heatmap);
  const signatureArchetype = getSignatureArchetype(heatmap);
  const strengthLabel = getStrengthLabel(omniphonicScore);

  // Score arc for SVG (stroke-dasharray value)
  const scoreArc = ((omniphonicScore / 100) * 340).toFixed(0);

  return {
    profileAName: profileA.name || 'Profile A',
    profileBName: profileB.name || 'Profile B',
    generatedAt: new Date().toISOString().slice(0, 10),
    reportId: generateReportId(),
    omniphonicScore: omniphonicScore.toFixed(2),
    scoreArc,
    strengthLabel,
    summaryText: summaryText || getDefaultSummary(omniphonicScore, dominantCluster, activeChambers),
    dominantCluster,
    signatureArchetype,
    activeChambers,
    activationRate,
    heatmap: heatmap.map(c => ({
      id: c.id,
      cluster: c.cluster,
      clusterClass: c.cluster.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      triggered: c.triggered,
      harmonyBoost: c.harmonyBoost.toFixed(2),
      bonus: c.bonus.toFixed(2)
    })),
    clusters: buildClusterView(heatmap),
    narrative,
    omniphonicFieldSvg,
    detectors: buildDetectorReference(heatmap)
  };
}

/**
 * Render HTML from report data and template
 */
export async function renderReportHtml(
  reportData: ReportData,
  templateEngine: { render: (template: string, data: ReportData) => string },
  templateHtml: string
): Promise<string> {
  return templateEngine.render(templateHtml, reportData);
}

/**
 * Full report generation pipeline (async)
 *
 * This function orchestrates the complete pipeline:
 * 1. Run harmonic detection (if not provided)
 * 2. Build visualization data
 * 3. Generate LLM summary (if client provided)
 * 4. Render HTML
 * 5. Convert to PDF (if pdfRenderer provided)
 */
export interface PipelineDependencies {
  // Harmonic detection functions (from your existing modules)
  buildHeatmapFromDetectorResults: (results: { detectors: Array<{ name: string; triggered: boolean; harmonyBoost: number; bonus: number; flag: string; details: string }> }) => HarmonicHeatmapCell[];
  computeOmniphonicScore: (heatmap: HarmonicHeatmapCell[]) => number;
  generateHarmonicNarrative: (heatmap: HarmonicHeatmapCell[], score: number) => string;
  HarmonicDetector: (profileA: ReportProfile, profileB: ReportProfile) => { detectors: Array<{ name: string; triggered: boolean; harmonyBoost: number; bonus: number; flag: string; details: string }> };

  // SVG generator
  buildOmniphonicFieldSvg: (heatmap: HarmonicHeatmapCell[], score: number, options?: { theme?: 'light' | 'dark' }) => string;

  // Template rendering
  templateEngine: { render: (template: string, data: ReportData) => string };
  templateHtml: string;

  // Optional: LLM client for enhanced summaries
  llmClient?: LLMClient;

  // Optional: PDF renderer
  pdfRenderer?: { render: (html: string, options?: { format?: string; printBackground?: boolean }) => Promise<Buffer> };
}

export async function generateOmniphonicReport(
  request: ReportRequest,
  deps: PipelineDependencies
): Promise<{ html: string; pdf?: Buffer; data: ReportData }> {
  const { profileA, profileB, options = {} } = request;
  const { theme = 'light', includeLLMSummary = false } = options;

  // 1. Run harmonic detection
  const detectorResults = deps.HarmonicDetector(profileA, profileB);

  // 2. Build heatmap and compute metrics
  const heatmap = deps.buildHeatmapFromDetectorResults(detectorResults);
  const omniphonicScore = deps.computeOmniphonicScore(heatmap);
  const narrative = deps.generateHarmonicNarrative(heatmap, omniphonicScore);

  // 3. Generate SVG diagram
  const omniphonicFieldSvg = deps.buildOmniphonicFieldSvg(heatmap, omniphonicScore, { theme });

  // 4. Generate LLM summary (optional)
  let summaryText: string | undefined;
  if (includeLLMSummary && deps.llmClient) {
    const activeChambers = heatmap.filter(c => c.triggered).length;
    const dominantCluster = getDominantCluster(heatmap);
    summaryText = await generateLLMSummary(omniphonicScore, dominantCluster, activeChambers, deps.llmClient);
  }

  // 5. Build report data
  const reportData = buildReportData(
    profileA,
    profileB,
    heatmap,
    omniphonicScore,
    narrative,
    omniphonicFieldSvg,
    summaryText
  );

  // 6. Render HTML
  const html = await renderReportHtml(reportData, deps.templateEngine, deps.templateHtml);

  // 7. Convert to PDF (optional)
  let pdf: Buffer | undefined;
  if (deps.pdfRenderer) {
    pdf = await deps.pdfRenderer.render(html, {
      format: options.format || 'A4',
      printBackground: true
    });
  }

  return { html, pdf, data: reportData };
}

export default generateOmniphonicReport;
