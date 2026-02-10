/**
 * PlanetPanel.tsx
 *
 * Educational panel for traditional planetary rulers.
 * Displays rich astronomical + astrological content.
 * Supports Markdown import/export for iterative refinement.
 */

import './PlanetPanel.css';
import React, { useState, useRef } from 'react';

type PlanetName = 'Mars' | 'Venus' | 'Mercury' | 'Moon' | 'Sun' | 'Jupiter' | 'Saturn';

interface PlanetPanelProps {
  planet: PlanetName;
  onClose: () => void;
}

// ─── Planet Colors ───────────────────────────────────────────────────────────
const PLANET_PANEL_COLORS: Record<PlanetName, string> = {
  Mars:    '#ef4444',
  Venus:   '#ec4899',
  Mercury: '#06b6d4',
  Moon:    '#a78bfa',
  Sun:     '#f59e0b',
  Jupiter: '#8b5cf6',
  Saturn:  '#64748b',
};

const PLANET_GLYPHS: Record<PlanetName, string> = {
  Mars:    '\u2642',
  Venus:   '\u2640',
  Mercury: '\u263F',
  Moon:    '\u263D',
  Sun:     '\u2609',
  Jupiter: '\u2643',
  Saturn:  '\u2644',
};

// ─── Speed Table Data ────────────────────────────────────────────────────────
const SPEED_TABLE: { rank: number; planet: PlanetName; glyph: string; cycle: string; signs: string }[] = [
  { rank: 1, planet: 'Moon',    glyph: '\u263D', cycle: '~28 days',          signs: 'Cancer' },
  { rank: 2, planet: 'Mercury', glyph: '\u263F', cycle: '~88 days',          signs: 'Gemini, Virgo' },
  { rank: 3, planet: 'Venus',   glyph: '\u2640', cycle: '~225 days',         signs: 'Taurus, Libra' },
  { rank: 4, planet: 'Sun',     glyph: '\u2609', cycle: '~365 days (1 year)', signs: 'Leo' },
  { rank: 5, planet: 'Mars',    glyph: '\u2642', cycle: '~2 years',          signs: 'Aries, Scorpio' },
  { rank: 6, planet: 'Jupiter', glyph: '\u2643', cycle: '~12 years',         signs: 'Sagittarius, Pisces' },
  { rank: 7, planet: 'Saturn',  glyph: '\u2644', cycle: '~29 years',         signs: 'Capricorn, Aquarius' },
];

// ─── Planet Content ──────────────────────────────────────────────────────────

interface PlanetContent {
  title: string;
  subtitle: string;
  keywords: string[];
  astronomy: {
    description: string;
    stats: { label: string; value: string }[];
  };
  sections: { heading: string; body: string[] }[];
  rulerships: {
    sign: string;
    glyph: string;
    expression: string;
    element: string;
    modality: string;
    color: string;
    description: string;
  }[];
  callout: string;
}

const PLANET_CONTENT: Record<string, PlanetContent> = {
  Mars: {
    title: 'Mars',
    subtitle: 'The Warrior, The Drive, The Sacred Fire',
    keywords: ['Action', 'Desire', 'Courage', 'Survival', 'Passion', 'Will', 'Heat', 'Assertion'],
    astronomy: {
      description: 'Mars is the fourth planet from the Sun, a rust-colored world of ancient volcanoes and dust storms that has captivated human imagination since antiquity. Named after the Roman god of war, Mars glows red in the night sky \u2014 a beacon that our ancestors read as a signal of conflict, courage, and the primal drive to survive.',
      stats: [
        { label: 'Distance from Sun', value: '~228 million km' },
        { label: 'Orbital Period', value: '~687 days (1.88 years)' },
        { label: 'Zodiac Cycle', value: '~2 years' },
        { label: 'Retrograde', value: 'Every ~26 months' },
      ],
    },
    sections: [
      {
        heading: '\u2694\uFE0F The Principle of Mars',
        body: [
          'Mars is the principle of action, desire, heat, and survival. It is the raw force that drives you to fight for what you want, to assert your boundaries, to pursue what ignites your blood. Without Mars, nothing begins. Without Mars, there is no chase, no conquest, no thrill of being alive.',
          'Where the Sun is your identity and the Moon is your emotional core, Mars is your engine. It determines how you go after things \u2014 how you fight, how you love physically, how you express anger, and where you find the courage to take risks.',
        ],
      },
      {
        heading: '\uD83C\uDF0B Why Mars Rules Two Signs',
        body: [
          'Traditional astrology assigns Mars to both Aries and Scorpio. This is not a mistake \u2014 it is intentional, ancient, and deeply meaningful.',
          'Mars is the principle of action, desire, heat, and survival. But each sign channels that heat in a different mode and element. The sign modifies the planet\'s function.',
          'Think of Mars as a fire. Aries is that fire burning outward \u2014 visible, crackling, warming everyone around it. Scorpio is that fire burning inward \u2014 hidden coals beneath still water, generating immense pressure and transformative power.',
        ],
      },
      {
        heading: '\uD83D\uDCA5 Mars Through the Elements',
        body: [
          'In Fire signs, Mars blazes with its purest expression \u2014 direct, bold, immediate. In Aries, it is the spark of initiation.',
          'In Water signs, Mars gains emotional depth and strategic power. In Scorpio, it becomes the surgeon\'s scalpel \u2014 precise, penetrating, transformative.',
          'In Earth signs (Taurus, Virgo, Capricorn), Mars becomes patient and methodical. The warrior learns to build, to persist, to conquer through endurance.',
          'In Air signs (Gemini, Libra, Aquarius), Mars becomes intellectual and strategic. The fighter becomes the debater, the advocate, the revolutionary thinker.',
        ],
      },
      {
        heading: '\u2764\uFE0F Mars in Love and Desire',
        body: [
          'Mars governs physical attraction, sexual energy, and the way you pursue romantic partners. It is the chase, the spark, the initial magnetism.',
          'Your Mars sign reveals what excites you, what turns your blood to fire, and how you express desire. It shows whether you pursue openly or play the long game, whether your passion burns fast or smolders for years.',
        ],
      },
      {
        heading: '\uD83D\uDEE1\uFE0F Mars and Conflict',
        body: [
          'How you handle anger, confrontation, and adversity is written in your Mars placement. Some fight with fists, some with words, some with silence. Mars shows your battle style.',
          'A healthy Mars means healthy boundaries \u2014 the ability to say no, to stand your ground, to protect what matters. An unhealthy Mars can manifest as aggression, passive-aggression, or a paralysing inability to act.',
        ],
      },
    ],
    rulerships: [
      {
        sign: 'Aries',
        glyph: '\u2648',
        expression: 'Outward Expression',
        element: 'Fire',
        modality: 'Cardinal',
        color: '#ef4444',
        description: 'Mars in Aries is fire burning outward. Open confrontation, direct action, brave initiative. The warrior charges into battle face-first, fuelled by instinct and adrenaline. This is Mars at its most raw and unfiltered \u2014 the courage to begin, to fight openly, to live with full-body intensity.',
      },
      {
        sign: 'Scorpio',
        glyph: '\u264F',
        expression: 'Inward Expression',
        element: 'Water',
        modality: 'Fixed',
        color: '#6366f1',
        description: 'Mars in Scorpio is fire burning beneath still water. Hidden strategy, psychological power, emotional intensity that runs deeper than any ocean. The warrior works from the shadows \u2014 patient, calculating, absolutely relentless. This is Mars channelled into transformation, where raw desire becomes the power to remake yourself entirely.',
      },
    ],
    callout: 'Mars asks one fundamental question: What are you willing to fight for? Your answer to that question shapes your entire life.',
  },
};

// ─── MD Serialization ────────────────────────────────────────────────────────

function contentToMarkdown(planet: PlanetName, content: PlanetContent): string {
  const lines: string[] = [];
  lines.push(`# ${PLANET_GLYPHS[planet]} ${content.title}`);
  lines.push(`*${content.subtitle}*`);
  lines.push('');
  lines.push(`**Keywords:** ${content.keywords.join(', ')}`);
  lines.push('');

  // Astronomy
  lines.push('## Astronomy');
  lines.push(content.astronomy.description);
  lines.push('');
  content.astronomy.stats.forEach(s => {
    lines.push(`- **${s.label}:** ${s.value}`);
  });
  lines.push('');

  // Sections
  content.sections.forEach(sec => {
    lines.push(`## ${sec.heading}`);
    sec.body.forEach(p => {
      lines.push(p);
      lines.push('');
    });
  });

  // Rulerships
  lines.push('## Rulerships');
  content.rulerships.forEach(r => {
    lines.push(`### ${r.glyph} ${r.sign} \u2014 ${r.expression}`);
    lines.push(`*${r.element} / ${r.modality}*`);
    lines.push('');
    lines.push(r.description);
    lines.push('');
  });

  // Speed table
  lines.push('## Astrological Speed Order');
  lines.push('| Rank | Planet | Zodiac Cycle | Signs |');
  lines.push('|------|--------|-------------|-------|');
  SPEED_TABLE.forEach(row => {
    lines.push(`| ${row.rank} | ${row.glyph} ${row.planet} | ${row.cycle} | ${row.signs} |`);
  });
  lines.push('');

  // Callout
  lines.push('---');
  lines.push(`> ${content.callout}`);

  return lines.join('\n');
}

function markdownToContent(md: string, fallback: PlanetContent): PlanetContent {
  // Parse sections from markdown back into content structure
  const result = { ...fallback };

  // Extract title
  const titleMatch = md.match(/^#\s+.+?\s+(.+)$/m);
  if (titleMatch) result.title = titleMatch[1];

  // Extract subtitle
  const subMatch = md.match(/^\*(.+)\*$/m);
  if (subMatch) result.subtitle = subMatch[1];

  // Extract keywords
  const kwMatch = md.match(/\*\*Keywords:\*\*\s*(.+)$/m);
  if (kwMatch) result.keywords = kwMatch[1].split(',').map(k => k.trim());

  // Extract astronomy description
  const astroSection = md.match(/## Astronomy\n([\s\S]*?)(?=\n## )/);
  if (astroSection) {
    const astroLines = astroSection[1].trim().split('\n');
    const descLines: string[] = [];
    const stats: { label: string; value: string }[] = [];
    astroLines.forEach(line => {
      const statMatch = line.match(/^- \*\*(.+?):\*\*\s*(.+)$/);
      if (statMatch) {
        stats.push({ label: statMatch[1], value: statMatch[2] });
      } else if (line.trim()) {
        descLines.push(line);
      }
    });
    if (descLines.length) result.astronomy.description = descLines.join('\n');
    if (stats.length) result.astronomy.stats = stats;
  }

  // Extract main sections (## heading followed by paragraphs)
  const sectionRegex = /## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g;
  const skipSections = new Set(['Astronomy', 'Rulerships', 'Astrological Speed Order']);
  const sections: { heading: string; body: string[] }[] = [];
  let match;
  while ((match = sectionRegex.exec(md)) !== null) {
    const heading = match[1].trim();
    if (skipSections.has(heading)) continue;
    if (heading.startsWith('###')) continue;
    const body = match[2].trim().split('\n\n').filter(p => p.trim() && !p.startsWith('###') && !p.startsWith('|') && !p.startsWith('---') && !p.startsWith('>'));
    if (body.length) {
      sections.push({ heading, body });
    }
  }
  if (sections.length) result.sections = sections;

  // Extract callout
  const calloutMatch = md.match(/>\s*(.+)$/m);
  if (calloutMatch) result.callout = calloutMatch[1];

  return result;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const PlanetPanel: React.FC<PlanetPanelProps> = ({ planet, onClose }) => {
  const defaultContent = PLANET_CONTENT[planet];
  const [content, setContent] = useState<PlanetContent | null>(defaultContent || null);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [toolbarMsg, setToolbarMsg] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const color = PLANET_PANEL_COLORS[planet];
  const glyph = PLANET_GLYPHS[planet];

  if (!content) {
    return (
      <div className="seasons-panel planet-panel">
        <div className="planet-panel-header" style={{ borderColor: color }}>
          <span className="planet-panel-glyph" style={{ color }}>{glyph}</span>
          <div className="planet-panel-header-text">
            <h2 className="planet-panel-title">{planet}</h2>
            <div className="planet-panel-subtitle">Content coming soon</div>
          </div>
          <button className="planet-panel-close" onClick={onClose}>x</button>
        </div>
        <div className="planet-panel-content">
          <div className="planet-section">
            <p>Detailed content for {planet} is being developed. Use Import MD to load custom content.</p>
          </div>
        </div>
        <div className="planet-panel-toolbar">
          <button className="planet-panel-toolbar-btn" onClick={() => { setShowImport(true); setImportText(''); }}>
            Import MD
          </button>
        </div>
        {showImport && (
          <div className="planet-md-import-overlay" onClick={() => setShowImport(false)}>
            <div className="planet-md-import-modal" onClick={e => e.stopPropagation()}>
              <h3>Import Markdown \u2014 {planet}</h3>
              <textarea
                ref={textareaRef}
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder={`Paste your ${planet} markdown content here...`}
              />
              <div className="planet-md-import-actions">
                <button className="md-cancel" onClick={() => setShowImport(false)}>Cancel</button>
                <button className="md-apply" onClick={() => {
                  if (importText.trim()) {
                    const fallback = defaultContent || {
                      title: planet, subtitle: '', keywords: [],
                      astronomy: { description: '', stats: [] },
                      sections: [], rulerships: [], callout: '',
                    };
                    setContent(markdownToContent(importText, fallback));
                    setShowImport(false);
                    setToolbarMsg('Content imported');
                  }
                }}>Apply</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleExport = () => {
    const md = contentToMarkdown(planet, content);
    navigator.clipboard.writeText(md).then(() => {
      setToolbarMsg('Copied to clipboard');
      setTimeout(() => setToolbarMsg(null), 2500);
    }).catch(() => {
      // Fallback: open in import modal for manual copy
      setImportText(md);
      setShowImport(true);
    });
  };

  const handleImportOpen = () => {
    setImportText(contentToMarkdown(planet, content));
    setShowImport(true);
  };

  return (
    <div className="seasons-panel planet-panel">
      {/* Header */}
      <div className="planet-panel-header" style={{ borderColor: color }}>
        <span className="planet-panel-glyph" style={{ color }}>{glyph}</span>
        <div className="planet-panel-header-text">
          <h2 className="planet-panel-title">{content.title}</h2>
          <div className="planet-panel-subtitle" style={{ color }}>{content.subtitle}</div>
        </div>
        <button className="planet-panel-close" onClick={onClose}>x</button>
      </div>

      {/* Keywords */}
      <div className="planet-keywords">
        {content.keywords.map((kw, i) => (
          <span key={i} className="planet-keyword" style={{ borderColor: color, color }}>{kw}</span>
        ))}
      </div>

      {/* Toolbar: Import / Export MD */}
      <div className="planet-panel-toolbar">
        <button className="planet-panel-toolbar-btn" onClick={handleExport}>Export MD</button>
        <button className="planet-panel-toolbar-btn" onClick={handleImportOpen}>Import MD</button>
        {toolbarMsg && <span className="planet-panel-toolbar-msg">{toolbarMsg}</span>}
      </div>

      <div className="planet-panel-content">
        {/* Astronomy Box */}
        <div className="planet-astronomy-box">
          <h4>Astronomy</h4>
          <p>{content.astronomy.description}</p>
          <div className="planet-stat-grid">
            {content.astronomy.stats.map((stat, i) => (
              <div key={i} className="planet-stat">
                <span className="planet-stat-label">{stat.label}</span>
                <span className="planet-stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Sections */}
        {content.sections.map((sec, i) => (
          <div key={i} className="planet-section">
            <h4>{sec.heading}</h4>
            {sec.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        ))}

        {/* Rulership Cards */}
        {content.rulerships.length > 0 && (
          <div className="planet-section">
            <h4>Rulerships</h4>
            <div className="planet-rulership-cards">
              {content.rulerships.map((r, i) => (
                <div
                  key={i}
                  className="planet-rulership-card"
                  style={{
                    borderColor: r.color,
                    background: `${r.color}12`,
                  }}
                >
                  <div className="planet-rulership-card-glyph" style={{ color: r.color }}>{r.glyph}</div>
                  <div className="planet-rulership-card-sign">{r.sign}</div>
                  <div className="planet-rulership-card-label" style={{ color: r.color }}>{r.expression}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                    {r.element} \u00B7 {r.modality}
                  </div>
                  <div className="planet-rulership-card-desc">{r.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speed Table */}
        <div className="planet-section">
          <h4>Astrological Speed Order</h4>
          <p>In astrology, planets are ordered by speed \u2014 how fast they move through the zodiac. Faster planets shape personal traits; slower planets shape generational themes.</p>
          <table className="planet-speed-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th></th>
                <th>Planet</th>
                <th>Zodiac Cycle</th>
                <th>Signs</th>
              </tr>
            </thead>
            <tbody>
              {SPEED_TABLE.map(row => (
                <tr key={row.rank} className={row.planet === planet ? 'current-planet' : ''}>
                  <td className="speed-rank">{row.rank}</td>
                  <td className="speed-glyph">{row.glyph}</td>
                  <td>{row.planet}</td>
                  <td>{row.cycle}</td>
                  <td className="speed-signs">{row.signs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Callout */}
        <div className="planet-callout" style={{ borderColor: color }}>
          <p>{content.callout}</p>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="planet-md-import-overlay" onClick={() => setShowImport(false)}>
          <div className="planet-md-import-modal" onClick={e => e.stopPropagation()}>
            <h3>Import / Edit Markdown \u2014 {planet}</h3>
            <textarea
              ref={textareaRef}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder={`Paste or edit ${planet} markdown content here...`}
            />
            <div className="planet-md-import-actions">
              <button className="md-cancel" onClick={() => setShowImport(false)}>Cancel</button>
              <button className="md-apply" onClick={() => {
                if (importText.trim()) {
                  setContent(markdownToContent(importText, content));
                  setShowImport(false);
                  setToolbarMsg('Content updated');
                  setTimeout(() => setToolbarMsg(null), 2500);
                }
              }}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanetPanel;
