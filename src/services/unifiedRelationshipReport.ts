/**
 * unifiedRelationshipReport.ts
 *
 * Unified Relationship Report Generator
 * Produces HTML report combining Western polarity and Vedic profile data.
 * Can be piped to PDF service (Puppeteer, wkhtmltopdf, etc.)
 */

interface RelationshipSummary {
  personA: { name: string };
  personB: { name: string };
  polarityScore: number;
  archetype: {
    name: string;
    description: string;
  };
  evolutionTimeline: Array<{
    start: string;
    end: string;
    archetype: string;
    summary: string;
  }>;
  forecastTimeline: Array<{
    start: string;
    end: string;
    archetype: string;
    themes: string[];
  }>;
  support: string[];
  challenges: string[];
  yinYangPolarity?: {
    personA: Array<{ planet: string; polarity: string }>;
    personB: Array<{ planet: string; polarity: string }>;
  };
}

interface VedicProfile {
  lagna: {
    sign: string;
    nakshatra: string;
    pada: number;
  };
  moon: {
    sign: string;
    nakshatra: string;
    pada: number;
    lord: string;
  };
  grahas: Array<{
    name: string;
    sign: string;
    dignity: string;
  }>;
  dashas: {
    current: {
      planet: string;
      start: string;
      end: string;
    };
  };
  interpretation?: {
    overall: string;
  };
}

/**
 * Build unified HTML report for relationship + Vedic profile
 */
export function buildUnifiedRelationshipReportHTML(
  relationshipA: RelationshipSummary,
  vedicProfile: VedicProfile,
  relationshipB?: RelationshipSummary
): string {
  const timestamp = new Date().toISOString().split('T')[0];

  const diffSection = relationshipB
    ? `
    <div class="section diff-section">
      <h2>Polarity Archetype Comparison</h2>
      <div class="comparison-grid">
        <div class="comparison-item">
          <h3>Relationship A</h3>
          <p class="archetype-name">${relationshipA.archetype.name}</p>
          <p class="score">Score: ${relationshipA.polarityScore}</p>
        </div>
        <div class="comparison-item">
          <h3>Relationship B</h3>
          <p class="archetype-name">${relationshipB.archetype.name}</p>
          <p class="score">Score: ${relationshipB.polarityScore}</p>
        </div>
      </div>
      <p class="diff-insight">
        ${relationshipA.archetype.name === relationshipB.archetype.name
          ? `Both relationships share the "${relationshipA.archetype.name}" archetype.`
          : `Different archetypes suggest different relational lessons.`}
      </p>
    </div>
    `
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unified Relationship Report - ${relationshipA.personA.name} & ${relationshipA.personB.name}</title>
  <style>
    :root {
      --cathedral-bg: #f7f5f2;
      --cathedral-panel: #ffffff;
      --cathedral-border: #e2ddd6;
      --cathedral-accent: #8a744f;
      --cathedral-accent-dark: #6d5a3e;
      --cathedral-gold: #d4a574;
      --cathedral-text: #333333;
      --cathedral-muted: #666666;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: var(--cathedral-bg);
      color: var(--cathedral-text);
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
      line-height: 1.7;
    }

    h1 {
      color: var(--cathedral-accent);
      font-size: 2rem;
      text-align: center;
      margin-bottom: 8px;
      font-weight: 400;
    }

    .report-subtitle {
      text-align: center;
      color: var(--cathedral-muted);
      font-style: italic;
      margin-bottom: 40px;
    }

    h2 {
      color: var(--cathedral-accent);
      font-size: 1.3rem;
      border-bottom: 2px solid var(--cathedral-border);
      padding-bottom: 8px;
      margin-top: 0;
    }

    .section {
      background: var(--cathedral-panel);
      border: 1px solid var(--cathedral-border);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .archetype-box {
      background: linear-gradient(135deg, #f8f6f3 0%, #efe9e0 100%);
      border-left: 4px solid var(--cathedral-gold);
      padding: 20px;
      margin: 16px 0;
    }

    .archetype-name {
      font-size: 1.4rem;
      color: var(--cathedral-accent);
      margin: 0 0 8px 0;
    }

    .score {
      font-size: 1.1rem;
      color: var(--cathedral-muted);
    }

    .evolution-item, .forecast-item {
      padding: 12px 0;
      border-bottom: 1px dashed var(--cathedral-border);
    }

    .evolution-item:last-child, .forecast-item:last-child {
      border-bottom: none;
    }

    .period {
      font-weight: bold;
      color: var(--cathedral-accent);
    }

    .vedic-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .vedic-item {
      background: #f8f6f3;
      padding: 12px;
      border-radius: 6px;
      text-align: center;
    }

    .vedic-item .planet {
      font-weight: bold;
      color: var(--cathedral-accent);
    }

    .vedic-item .dignity {
      font-size: 0.85rem;
      color: var(--cathedral-muted);
    }

    .dignity-exalted { color: #2e7d32; }
    .dignity-own { color: #1565c0; }
    .dignity-debilitated { color: #c62828; }

    ul {
      padding-left: 20px;
    }

    li {
      margin-bottom: 8px;
    }

    .support-list li::marker { color: #2e7d32; }
    .challenges-list li::marker { color: #c62828; }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 16px 0;
    }

    .comparison-item {
      background: #f8f6f3;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .diff-insight {
      font-style: italic;
      text-align: center;
      color: var(--cathedral-muted);
    }

    .footer {
      text-align: center;
      color: var(--cathedral-muted);
      font-size: 0.85rem;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--cathedral-border);
    }

    @media print {
      body { padding: 20px; }
      .section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>Unified Relationship Report</h1>
  <p class="report-subtitle">
    ${relationshipA.personA.name} & ${relationshipA.personB.name}
    <br />Generated: ${timestamp}
  </p>

  <!-- Polarity Overview -->
  <div class="section">
    <h2>Polarity Overview</h2>
    <div class="archetype-box">
      <p class="archetype-name">${relationshipA.archetype.name}</p>
      <p>${relationshipA.archetype.description}</p>
      <p class="score">Polarity Score: <strong>${relationshipA.polarityScore}</strong> / 100</p>
    </div>
  </div>

  ${diffSection}

  <!-- Evolution Timeline -->
  <div class="section">
    <h2>Evolution Timeline</h2>
    ${relationshipA.evolutionTimeline.map(t => `
      <div class="evolution-item">
        <span class="period">${t.start} – ${t.end}:</span>
        <strong>${t.archetype}</strong>
        <p>${t.summary}</p>
      </div>
    `).join('')}
  </div>

  <!-- Forecast Timeline -->
  ${relationshipA.forecastTimeline.length > 0 ? `
  <div class="section">
    <h2>Forecast Timeline</h2>
    ${relationshipA.forecastTimeline.map(t => `
      <div class="forecast-item">
        <span class="period">${t.start} – ${t.end}:</span>
        <strong>${t.archetype}</strong>
        <p>Themes: ${t.themes.join(', ')}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Vedic Profile -->
  <div class="section">
    <h2>Vedic Soul Map</h2>
    <p>
      <strong>Lagna:</strong> ${vedicProfile.lagna.sign} • ${vedicProfile.lagna.nakshatra}
    </p>
    <p>
      <strong>Moon (Janma Nakshatra):</strong> ${vedicProfile.moon.nakshatra} in ${vedicProfile.moon.sign}
      (Pada ${vedicProfile.moon.pada}) • Lord: ${vedicProfile.moon.lord}
    </p>
    <p>
      <strong>Current Dasha:</strong> ${vedicProfile.dashas.current.planet} Mahadasha
      (${vedicProfile.dashas.current.start} – ${vedicProfile.dashas.current.end})
    </p>

    <h3>Graha Dignities</h3>
    <div class="vedic-grid">
      ${vedicProfile.grahas.map(g => `
        <div class="vedic-item">
          <div class="planet">${g.name}</div>
          <div>${g.sign}</div>
          <div class="dignity dignity-${g.dignity}">${g.dignity}</div>
        </div>
      `).join('')}
    </div>

    ${vedicProfile.interpretation?.overall ? `
      <p style="margin-top: 20px; font-style: italic;">
        ${vedicProfile.interpretation.overall}
      </p>
    ` : ''}
  </div>

  <!-- Support & Challenges -->
  <div class="section">
    <h2>Support & Challenges</h2>

    <h3>What Supports This Relationship</h3>
    <ul class="support-list">
      ${relationshipA.support.map(s => `<li>${s}</li>`).join('')}
    </ul>

    <h3>What Challenges This Relationship</h3>
    <ul class="challenges-list">
      ${relationshipA.challenges.map(c => `<li>${c}</li>`).join('')}
    </ul>
  </div>

  <div class="footer">
    <p>Generated by the Cathedral Relationship System</p>
    <p>AstroProfile &copy; ${new Date().getFullYear()}</p>
  </div>
</body>
</html>
  `;
}

/**
 * Export report as downloadable HTML file (browser)
 */
export function downloadReportAsHTML(html: string, filename: string = 'relationship-report.html'): void {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default buildUnifiedRelationshipReportHTML;
