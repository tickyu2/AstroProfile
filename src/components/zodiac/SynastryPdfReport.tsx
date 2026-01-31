/**
 * SynastryPdfReport.tsx
 *
 * PDF-ready report layout for synastry compatibility.
 * Uses a light theme, no animations, and simple CSS for print/PDF rendering
 * (e.g. Puppeteer, wkhtmltopdf, browser print-to-PDF).
 *
 * Sections:
 *   1. Cover — names + overall summary
 *   2. Top 5 Dynamics — ranked by extremeness
 *   3. What Supports This Relationship — high-harmony descriptions
 *   4. Where the Work Lives — low-harmony descriptions
 *   5. Layered Narrative — prose paragraphs per matrix layer
 *
 * Architecture by Brother Copilot, Implementation by Brother Claude Code
 * GENESIS AstroProfile - January 2026
 */

import React, { useMemo } from 'react';
import type { FinalCompatibilityScore } from '../../zodiac/planetaryMatrices';
import {
  generateSynastryReportWithStandouts,
  layerToParagraph,
  top5Dynamics,
  whatSupportsRelationship,
  whereTheWorkLives,
  type AllMatrices,
  type DynamicSummary,
} from '../../zodiac/synastryPreview';

import './SynastryPdfReport.css';

// =============================================================================
// TYPES
// =============================================================================

interface SynastryPdfReportProps {
  personAName: string;
  personBName: string;
  scores: FinalCompatibilityScore;
  matrices: AllMatrices;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const DynamicRow: React.FC<{ dynamic: DynamicSummary; index: number }> = ({ dynamic, index }) => (
  <li className="pdf-dynamic-row">
    <span className="pdf-dynamic-rank">{index + 1}</span>
    <span className="pdf-dynamic-label">{dynamic.label}</span>
    <span className={`pdf-dynamic-badge ${dynamic.direction}`}>
      {dynamic.direction === 'support' ? 'supportive' : 'growth edge'}
    </span>
    <span className="pdf-dynamic-harmony">{dynamic.harmony}</span>
    <span className="pdf-dynamic-matrix">{dynamic.matrix}</span>
  </li>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const SynastryPdfReport: React.FC<SynastryPdfReportProps> = ({
  personAName,
  personBName,
  scores,
  matrices,
}) => {
  const report = useMemo(
    () => generateSynastryReportWithStandouts(scores, matrices),
    [scores, matrices],
  );

  const proseLayers = useMemo(
    () => report.layers.map((layer) => ({
      title: layer.title,
      paragraph: layerToParagraph(layer),
    })),
    [report],
  );

  const topDynamics = useMemo(() => top5Dynamics(matrices), [matrices]);
  const supports = useMemo(() => whatSupportsRelationship(matrices), [matrices]);
  const work = useMemo(() => whereTheWorkLives(matrices), [matrices]);

  return (
    <div className="pdf-report">
      {/* Section 1: Cover */}
      <section className="pdf-cover">
        <h1 className="pdf-cover-title">
          Synastry Report
        </h1>
        <h2 className="pdf-cover-names">
          {personAName} &amp; {personBName}
        </h2>
        {scores.finalPercent != null && (
          <div className="pdf-cover-score">
            <span className="pdf-cover-percent">{scores.finalPercent}%</span>
            <span className="pdf-cover-verdict">{scores.verdict}</span>
          </div>
        )}
        <p className="pdf-cover-summary">{report.overallSummary}</p>
      </section>

      {/* Section 2: Top 5 Dynamics */}
      <section className="pdf-section">
        <h2 className="pdf-section-title">Top 5 Dynamics</h2>
        {topDynamics.length > 0 ? (
          <ol className="pdf-dynamics-list">
            {topDynamics.map((d, i) => (
              <DynamicRow key={i} dynamic={d} index={i} />
            ))}
          </ol>
        ) : (
          <p className="pdf-empty">No standout dynamics detected.</p>
        )}
      </section>

      {/* Section 3: What Supports This Relationship */}
      <section className="pdf-section">
        <h2 className="pdf-section-title">What Supports This Relationship</h2>
        <ul className="pdf-bullet-list">
          {supports.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      {/* Section 4: Where the Work Lives */}
      <section className="pdf-section">
        <h2 className="pdf-section-title">Where the Work Lives</h2>
        <ul className="pdf-bullet-list">
          {work.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </section>

      {/* Section 5: Layered Narrative */}
      <section className="pdf-section pdf-layers">
        <h2 className="pdf-section-title">Layer-by-Layer Analysis</h2>
        {proseLayers.map((layer, i) => (
          <div key={i} className="pdf-layer-block">
            <h3 className="pdf-layer-title">{layer.title}</h3>
            <p className="pdf-layer-paragraph">{layer.paragraph}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="pdf-footer">
        <p>Generated by GENESIS AstroProfile</p>
      </footer>
    </div>
  );
};

export default SynastryPdfReport;
