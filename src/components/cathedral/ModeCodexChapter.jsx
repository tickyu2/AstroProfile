/**
 * ModeCodexChapter.jsx
 *
 * Codex Volume II, Chapter XIV - The Four Modes of Perception
 * Complete documentation of the Cathedral Mode System.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMode, CATHEDRAL_MODES, MODE_MATRIX } from './modeSystem';

// ============================================================================
// CODEX CHAPTER CONTENT
// ============================================================================

const CODEX_CHAPTER = {
  volume: 'II',
  chapter: 'XIV',
  title: 'The Four Modes of Perception',
  subtitle: 'How the Cathedral Reveals Itself',

  sections: [
    {
      id: 'overview',
      title: 'I. Overview',
      content: `The Cathedral reveals itself differently depending on the path the Pilgrim walks.
        These paths—Pilgrim, Scholar, Architect, Sovereign—are not ranks but lenses.
        Each mode alters the Cathedral's voice, motion, color, sound, and structure.

        A Pilgrim seeking comfort will find warmth and narrative.
        A Scholar seeking understanding will find annotation and reference.
        An Architect seeking structure will find systems and rules.
        A Sovereign seeking direction will find strategy and command.

        No mode is superior. Each serves a purpose. The Cathedral adapts to serve you.`,
    },
    {
      id: 'modes',
      title: 'II. The Four Modes',
      subsections: [
        {
          id: 'pilgrim',
          title: '1. Pilgrim Mode — The Lantern Path',
          icon: '🌙',
          theme: 'Warm Gold',
          description: 'A gentle, narrative-first experience.',
          attributes: [
            'Soft gold aura',
            'Lantern chime timeline cues',
            'Guided onboarding ("The Lantern Walk")',
            'Storybook Codex layout',
            'Ritual Mode enabled',
            'Basic Chart Lens',
            'Emotional, mythic emphasis',
          ],
          persona: 'Mentor',
          ritual: 'Witness → Compassion → Integration',
          chart: 'Lantern & Mist',
          timeline: 'Seasons of the Soul',
        },
        {
          id: 'scholar',
          title: '2. Scholar Mode — The Illuminated Manuscript',
          icon: '📚',
          theme: 'Parchment',
          description: 'An analytical, annotated experience.',
          attributes: [
            'Parchment aura',
            'Ink tick timeline cues',
            'Annotated onboarding',
            'Manuscript Codex layout',
            'Codex Lens enabled',
            'Footnotes, definitions, diagrams',
            'Intellectual, structural emphasis',
          ],
          persona: 'Mirror',
          ritual: 'Observe → Analyze → Interpret → Synthesize',
          chart: 'Ink Diagram',
          timeline: 'Annotated Chronology',
        },
        {
          id: 'architect',
          title: '3. Architect Mode — The Blueprint Engine',
          icon: '🏛️',
          theme: 'Blueprint',
          description: 'A system-level, structural experience.',
          attributes: [
            'Blueprint aura',
            'Digital blueprint pulse timeline cues',
            'System onboarding',
            'Blueprint Codex layout',
            'DevTools enabled',
            'Rule-level overlays',
            'Structural, generative emphasis',
          ],
          persona: 'Oracle',
          ritual: 'Map → Diagnose → Redesign → Implement',
          chart: 'Blueprint Grid',
          timeline: 'System Oscillation Graph',
        },
        {
          id: 'sovereign',
          title: '4. Sovereign Mode — The Obsidian Throne',
          icon: '👑',
          theme: 'Obsidian Gold',
          description: 'A strategic, decisive experience.',
          attributes: [
            'Obsidian aura',
            'Gold strike timeline cues',
            'Command onboarding',
            'Executive Codex layout',
            'Strategic Chart Lens',
            'Leadership + Destiny emphasis',
            'Agency, clarity, command',
          ],
          persona: 'Commander',
          ritual: 'Claim → Discern → Command → Enact',
          chart: 'Obsidian Crown',
          timeline: 'Strategic Windows',
        },
      ],
    },
    {
      id: 'elements',
      title: 'III. Mode-Specific Elements',
      subsections: [
        {
          id: 'persona_bundles',
          title: 'A. Persona Bundles',
          content: `Each mode speaks with a different voice:`,
          list: [
            { mode: 'Pilgrim', persona: 'Mentor', voice: 'Gentle, encouraging, supportive' },
            { mode: 'Scholar', persona: 'Mirror', voice: 'Analytical, curious, precise' },
            { mode: 'Architect', persona: 'Oracle', voice: 'Technical, systematic, revealing' },
            { mode: 'Sovereign', persona: 'Commander', voice: 'Direct, strategic, authoritative' },
          ],
        },
        {
          id: 'ritual_scripts',
          title: 'B. Ritual Scripts',
          content: `Each mode guides transformation differently:`,
          list: [
            { mode: 'Pilgrim', path: 'Witness → Compassion → Integration' },
            { mode: 'Scholar', path: 'Observe → Analyze → Interpret → Synthesize' },
            { mode: 'Architect', path: 'Map → Diagnose → Redesign → Implement' },
            { mode: 'Sovereign', path: 'Claim → Discern → Command → Enact' },
          ],
        },
        {
          id: 'chart_themes',
          title: 'C. Chart Themes',
          content: `Each mode reshapes the chart visualization:`,
          list: [
            { mode: 'Pilgrim', theme: 'Lantern & Mist — Soft, glowing, mythic atmosphere' },
            { mode: 'Scholar', theme: 'Ink Diagram — Clean, annotated, educational' },
            { mode: 'Architect', theme: 'Blueprint Grid — Technical grid overlay, data readouts' },
            { mode: 'Sovereign', theme: 'Obsidian Crown — Minimalist, strategic highlights' },
          ],
        },
        {
          id: 'timeline_views',
          title: 'D. Timeline Visualization',
          content: `Each mode sees time differently:`,
          list: [
            { mode: 'Pilgrim', view: 'Seasons of the Soul — Mythic journey with milestones' },
            { mode: 'Scholar', view: 'Annotated Chronology — References and citations' },
            { mode: 'Architect', view: 'System Oscillation Graph — Data points and metrics' },
            { mode: 'Sovereign', view: 'Strategic Windows — Decision points and timing' },
          ],
        },
      ],
    },
    {
      id: 'memory',
      title: 'IV. Mode Memory',
      content: `The Cathedral remembers the Pilgrim's chosen mode across sessions,
        restoring the appropriate aura, voice, and structure upon return.

        Mode preferences are stored locally and can be changed at any time.
        The Cathedral will gently transition between modes, honoring both
        the departure and the arrival.`,
    },
    {
      id: 'purpose',
      title: 'V. Purpose',
      content: `Modes are not hierarchies. They are perspectives.

        The Cathedral invites the Pilgrim to shift modes as needed:
        • Gentle when healing
        • Analytical when learning
        • Structural when building
        • Decisive when leading

        There is no "best" mode. There is only the mode that serves you now.
        The Cathedral will always meet you where you are.`,
    },
  ],
};

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

const CodexSection = ({ section, mode }) => {
  const sectionStyles = {
    container: {
      marginBottom: '40px',
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'var(--aura-text-highlight, #fff)',
      marginBottom: '16px',
      borderBottom: '1px solid var(--aura-border-subtle, rgba(255, 255, 255, 0.1))',
      paddingBottom: '8px',
    },
    content: {
      fontSize: '15px',
      lineHeight: '1.8',
      color: '#cbd5e1',
      whiteSpace: 'pre-line',
    },
  };

  return (
    <section style={sectionStyles.container}>
      <h2 style={sectionStyles.title}>{section.title}</h2>
      {section.content && <p style={sectionStyles.content}>{section.content}</p>}
      {section.subsections && section.subsections.map((sub) => (
        <ModeSubsection key={sub.id} subsection={sub} mode={mode} />
      ))}
    </section>
  );
};

const ModeSubsection = ({ subsection, mode }) => {
  const subStyles = {
    container: {
      marginTop: '24px',
      marginLeft: '20px',
    },
    title: {
      fontSize: '17px',
      fontWeight: '600',
      color: 'var(--aura-primary, #a855f7)',
      marginBottom: '12px',
    },
    description: {
      fontSize: '14px',
      color: '#94a3b8',
      marginBottom: '12px',
    },
    attributes: {
      listStyle: 'none',
      padding: 0,
      margin: '12px 0',
    },
    attribute: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#cbd5e1',
      padding: '4px 0',
    },
    bullet: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: 'var(--aura-primary, #a855f7)',
    },
    metaGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginTop: '16px',
    },
    metaItem: {
      background: 'var(--aura-surface-1, rgba(0, 0, 0, 0.2))',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid var(--aura-border-subtle, rgba(255, 255, 255, 0.1))',
    },
    metaLabel: {
      fontSize: '11px',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '4px',
    },
    metaValue: {
      fontSize: '14px',
      color: 'var(--aura-text-accent, #fff)',
      fontWeight: '500',
    },
    list: {
      marginTop: '12px',
    },
    listItem: {
      display: 'flex',
      gap: '12px',
      padding: '8px 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    listMode: {
      fontWeight: '600',
      color: 'var(--aura-primary, #a855f7)',
      minWidth: '80px',
    },
    listValue: {
      color: '#cbd5e1',
    },
  };

  // Mode card subsection
  if (subsection.icon) {
    return (
      <div style={subStyles.container}>
        <h3 style={subStyles.title}>
          <span style={{ marginRight: '8px' }}>{subsection.icon}</span>
          {subsection.title}
        </h3>
        <p style={subStyles.description}>{subsection.description}</p>

        {subsection.attributes && (
          <ul style={subStyles.attributes}>
            {subsection.attributes.map((attr, i) => (
              <li key={i} style={subStyles.attribute}>
                <span style={subStyles.bullet} />
                {attr}
              </li>
            ))}
          </ul>
        )}

        <div style={subStyles.metaGrid}>
          <div style={subStyles.metaItem}>
            <div style={subStyles.metaLabel}>Persona</div>
            <div style={subStyles.metaValue}>{subsection.persona}</div>
          </div>
          <div style={subStyles.metaItem}>
            <div style={subStyles.metaLabel}>Ritual Path</div>
            <div style={subStyles.metaValue}>{subsection.ritual}</div>
          </div>
          <div style={subStyles.metaItem}>
            <div style={subStyles.metaLabel}>Chart Theme</div>
            <div style={subStyles.metaValue}>{subsection.chart}</div>
          </div>
          <div style={subStyles.metaItem}>
            <div style={subStyles.metaLabel}>Timeline</div>
            <div style={subStyles.metaValue}>{subsection.timeline}</div>
          </div>
        </div>
      </div>
    );
  }

  // List subsection
  if (subsection.list) {
    return (
      <div style={subStyles.container}>
        <h3 style={subStyles.title}>{subsection.title}</h3>
        {subsection.content && <p style={subStyles.description}>{subsection.content}</p>}
        <div style={subStyles.list}>
          {subsection.list.map((item, i) => (
            <div key={i} style={subStyles.listItem}>
              <span style={subStyles.listMode}>{item.mode}</span>
              <span style={subStyles.listValue}>
                {item.persona && `${item.persona} — ${item.voice}`}
                {item.path && item.path}
                {item.theme && item.theme}
                {item.view && item.view}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

// ============================================================================
// TABLE OF CONTENTS
// ============================================================================

const TableOfContents = ({ sections, activeSection, onNavigate }) => {
  const tocStyles = {
    container: {
      position: 'sticky',
      top: '20px',
      padding: '20px',
      background: 'var(--aura-surface-1, rgba(0, 0, 0, 0.2))',
      borderRadius: '12px',
      border: '1px solid var(--aura-border-subtle, rgba(255, 255, 255, 0.1))',
    },
    title: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '12px',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    item: (isActive) => ({
      fontSize: '14px',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      color: isActive ? 'var(--aura-text-highlight, #fff)' : '#94a3b8',
      background: isActive ? 'var(--aura-surface-2, rgba(168, 85, 247, 0.1))' : 'transparent',
      transition: 'all 0.2s ease',
      marginBottom: '4px',
    }),
  };

  return (
    <nav style={tocStyles.container}>
      <div style={tocStyles.title}>Contents</div>
      <ul style={tocStyles.list}>
        {sections.map((section) => (
          <li
            key={section.id}
            style={tocStyles.item(activeSection === section.id)}
            onClick={() => onNavigate(section.id)}
          >
            {section.title}
          </li>
        ))}
      </ul>
    </nav>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ModeCodexChapter = ({ onClose }) => {
  const { mode } = useMode();
  const [activeSection, setActiveSection] = useState('overview');

  const containerStyles = {
    container: {
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: '40px',
      padding: '40px',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      borderRadius: '20px',
      maxHeight: '80vh',
      overflow: 'hidden',
    },
    header: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      marginBottom: '20px',
    },
    volume: {
      fontSize: '12px',
      color: 'var(--aura-primary, #a855f7)',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '8px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#94a3b8',
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#94a3b8',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    content: {
      overflowY: 'auto',
      paddingRight: '20px',
    },
    footer: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '20px 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '20px',
    },
    footerText: {
      fontSize: '12px',
      color: '#64748b',
    },
  };

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`codex-section-${sectionId}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative' }}>
      {onClose && (
        <button style={containerStyles.closeButton} onClick={onClose}>
          Close
        </button>
      )}

      <div style={containerStyles.container}>
        <header style={containerStyles.header}>
          <div style={containerStyles.volume}>
            Codex Volume {CODEX_CHAPTER.volume} — Chapter {CODEX_CHAPTER.chapter}
          </div>
          <h1 style={containerStyles.title}>{CODEX_CHAPTER.title}</h1>
          <p style={containerStyles.subtitle}>{CODEX_CHAPTER.subtitle}</p>
        </header>

        <TableOfContents
          sections={CODEX_CHAPTER.sections}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        <main style={containerStyles.content}>
          {CODEX_CHAPTER.sections.map((section) => (
            <div key={section.id} id={`codex-section-${section.id}`}>
              <CodexSection section={section} mode={mode} />
            </div>
          ))}
        </main>

        <footer style={containerStyles.footer}>
          <p style={containerStyles.footerText}>
            End of Chapter {CODEX_CHAPTER.chapter} — The Living Cathedral
          </p>
        </footer>
      </div>
    </div>
  );
};

ModeCodexChapter.propTypes = {
  onClose: PropTypes.func,
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ModeCodexChapter;

export {
  CODEX_CHAPTER,
  CodexSection,
  ModeSubsection,
  TableOfContents,
};
