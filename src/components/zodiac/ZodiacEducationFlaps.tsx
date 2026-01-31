/**
 * ZodiacEducationFlaps.tsx
 * ========================
 *
 * Collapsible educational panels explaining the zodiac system.
 * Khan Academy style - clear, novice-friendly explanations.
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface FlapProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// =============================================================================
// FLAP COMPONENT
// =============================================================================

const Flap: React.FC<FlapProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        marginBottom: '8px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(13, 13, 26, 0.8)',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 14px',
          background: isOpen ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.2s',
        }}
      >
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span
          style={{
            flex: 1,
            fontSize: '13px',
            fontWeight: 600,
            color: isOpen ? '#60a5fa' : '#e5e7eb',
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: '#6b7280',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div
          style={{
            padding: '14px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            fontSize: '12px',
            lineHeight: '1.7',
            color: '#d1d5db',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// TABLE STYLES
// =============================================================================

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '11px',
  marginTop: '12px',
};

const thStyle: React.CSSProperties = {
  padding: '8px 6px',
  background: 'rgba(59, 130, 246, 0.2)',
  color: '#93c5fd',
  fontWeight: 600,
  textAlign: 'left',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
};

const tdStyle: React.CSSProperties = {
  padding: '6px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  color: '#e5e7eb',
};

const highlightStyle: React.CSSProperties = {
  background: 'rgba(251, 191, 36, 0.15)',
  color: '#fbbf24',
  padding: '2px 6px',
  borderRadius: '4px',
  fontWeight: 600,
};

// =============================================================================
// DATA
// =============================================================================

const ZODIAC_DATES = [
  { sign: 'Aries', symbol: '♈', dates: 'March 21 – April 19', element: 'Fire' },
  { sign: 'Taurus', symbol: '♉', dates: 'April 20 – May 20', element: 'Earth' },
  { sign: 'Gemini', symbol: '♊', dates: 'May 21 – June 20', element: 'Air' },
  { sign: 'Cancer', symbol: '♋', dates: 'June 21 – July 22', element: 'Water' },
  { sign: 'Leo', symbol: '♌', dates: 'July 23 – August 22', element: 'Fire' },
  { sign: 'Virgo', symbol: '♍', dates: 'August 23 – September 22', element: 'Earth' },
  { sign: 'Libra', symbol: '♎', dates: 'September 23 – October 22', element: 'Air' },
  { sign: 'Scorpio', symbol: '♏', dates: 'October 23 – November 21', element: 'Water' },
  { sign: 'Sagittarius', symbol: '♐', dates: 'November 22 – December 21', element: 'Fire' },
  { sign: 'Capricorn', symbol: '♑', dates: 'December 22 – January 19', element: 'Earth' },
  { sign: 'Aquarius', symbol: '♒', dates: 'January 20 – February 18', element: 'Air' },
  { sign: 'Pisces', symbol: '♓', dates: 'February 19 – March 20', element: 'Water' },
];

const CUSP_WINDOWS = [
  { sign: 'Aries', core: 'Mar 27 – Apr 13', backward: 'Mar 21–26 (Pisces→Aries)', forward: 'Apr 14–19 (Aries→Taurus)' },
  { sign: 'Taurus', core: 'Apr 27 – May 13', backward: 'Apr 20–26 (Aries→Taurus)', forward: 'May 14–20 (Taurus→Gemini)' },
  { sign: 'Gemini', core: 'May 27 – Jun 13', backward: 'May 21–26 (Taurus→Gemini)', forward: 'Jun 14–20 (Gemini→Cancer)' },
  { sign: 'Cancer', core: 'Jun 27 – Jul 16', backward: 'Jun 21–26 (Gemini→Cancer)', forward: 'Jul 17–22 (Cancer→Leo)' },
  { sign: 'Leo', core: 'Jul 29 – Aug 16', backward: 'Jul 23–28 (Cancer→Leo)', forward: 'Aug 17–22 (Leo→Virgo)' },
  { sign: 'Virgo', core: 'Aug 29 – Sep 16', backward: 'Aug 23–28 (Leo→Virgo)', forward: 'Sep 17–22 (Virgo→Libra)' },
  { sign: 'Libra', core: 'Sep 29 – Oct 16', backward: 'Sep 23–28 (Virgo→Libra)', forward: 'Oct 17–22 (Libra→Scorpio)' },
  { sign: 'Scorpio', core: 'Oct 29 – Nov 15', backward: 'Oct 23–28 (Libra→Scorpio)', forward: 'Nov 16–21 (Scorpio→Sag)' },
  { sign: 'Sagittarius', core: 'Nov 28 – Dec 15', backward: 'Nov 22–27 (Scorpio→Sag)', forward: 'Dec 16–21 (Sag→Cap)' },
  { sign: 'Capricorn', core: 'Dec 28 – Jan 13', backward: 'Dec 22–27 (Sag→Cap)', forward: 'Jan 14–19 (Cap→Aqua)' },
  { sign: 'Aquarius', core: 'Jan 26 – Feb 12', backward: 'Jan 20–25 (Cap→Aqua)', forward: 'Feb 13–18 (Aqua→Pisces)' },
  { sign: 'Pisces', core: 'Feb 25 – Mar 14', backward: 'Feb 19–24 (Aqua→Pisces)', forward: 'Mar 15–20 (Pisces→Aries)' },
];

// Golden ratio curve percentages (φ-curve)
const GOLDEN_RATIO_CURVE = [
  { day: 1, blend: 13, primary: 87 },
  { day: 2, blend: 37, primary: 63 },
  { day: 3, blend: 58, primary: 42 },
  { day: 4, blend: 75, primary: 25 },
  { day: 5, blend: 89, primary: 11 },
  { day: 6, blend: 98, primary: 2 },
];

// Taurus example (backward blend from Aries)
const TAURUS_BACKWARD_EXAMPLE = [
  { date: 'Apr 20', primary: 'Taurus', taurus: 13, aries: 87 },
  { date: 'Apr 21', primary: 'Taurus', taurus: 37, aries: 63 },
  { date: 'Apr 22', primary: 'Taurus', taurus: 58, aries: 42 },
  { date: 'Apr 23', primary: 'Taurus', taurus: 75, aries: 25 },
  { date: 'Apr 24', primary: 'Taurus', taurus: 89, aries: 11 },
  { date: 'Apr 25', primary: 'Taurus', taurus: 98, aries: 2 },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ZodiacEducationFlaps: React.FC = () => {
  return (
    <div style={{ width: '320px' }}>
      {/* Flap 1: Western Zodiac Sign Dates */}
      <Flap title="Western Zodiac Sign Dates" icon="📅">
        <p style={{ margin: '0 0 10px 0' }}>
          Western astrology divides the year into <strong>12 zodiac signs</strong>,
          each spanning roughly one month. These are the standard date ranges:
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Sign</th>
              <th style={thStyle}>Dates</th>
              <th style={thStyle}>Element</th>
            </tr>
          </thead>
          <tbody>
            {ZODIAC_DATES.map((z) => (
              <tr key={z.sign}>
                <td style={tdStyle}>
                  <span style={{ marginRight: '4px' }}>{z.symbol}</span>
                  {z.sign}
                </td>
                <td style={tdStyle}>{z.dates}</td>
                <td style={tdStyle}>{z.element}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Flap>

      {/* Flap 2: 6-Day Cusp Model */}
      <Flap title="6-Day Cusp Model" icon="🌓">
        <p style={{ margin: '0 0 12px 0' }}>
          <strong>The Problem:</strong> Traditional astrology says you're 100% one sign
          or another. But people born near sign boundaries often feel like "both."
        </p>
        <p style={{ margin: '0 0 12px 0' }}>
          <strong>Our Solution:</strong> We use a <span style={highlightStyle}>6-day transition window</span> at
          each sign boundary where energies gradually blend.
        </p>

        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '12px'
        }}>
          <div style={{ fontWeight: 600, color: '#4ade80', marginBottom: '6px' }}>
            🎯 Key Concept
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            <li><strong>First 6 days</strong> of a sign → Blending with previous sign</li>
            <li><strong>Middle days</strong> → Pure sign energy (100%)</li>
            <li><strong>Last 6 days</strong> of a sign → Blending with next sign</li>
          </ul>
        </div>

        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
          Example: Aries (March 21 – April 19)
        </p>
        <ul style={{ margin: '0 0 0 0', paddingLeft: '16px' }}>
          <li><strong>Mar 21–26:</strong> Pisces energy fading into Aries</li>
          <li><strong>Mar 27–Apr 13:</strong> Pure Aries (100%)</li>
          <li><strong>Apr 14–19:</strong> Aries blending into Taurus</li>
        </ul>
      </Flap>

      {/* Flap 3: Full Zodiac with Cusp Windows */}
      <Flap title="Full Zodiac with Cusp Windows" icon="🗓️">
        <p style={{ margin: '0 0 10px 0' }}>
          Here's how the 6-day cusp model applies to all 12 signs:
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Sign</th>
              <th style={thStyle}>Pure Core</th>
              <th style={thStyle}>Backward Blend</th>
              <th style={thStyle}>Forward Blend</th>
            </tr>
          </thead>
          <tbody>
            {CUSP_WINDOWS.map((c) => (
              <tr key={c.sign}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{c.sign}</td>
                <td style={{ ...tdStyle, color: '#4ade80' }}>{c.core}</td>
                <td style={{ ...tdStyle, fontSize: '10px', color: '#a78bfa' }}>{c.backward}</td>
                <td style={{ ...tdStyle, fontSize: '10px', color: '#f472b6' }}>{c.forward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Flap>

      {/* Flap 4: Cusp Blend Assumptions - Why φ? */}
      <Flap title="Why Golden Ratio? (φ = 1.6)" icon="🌀">
        {/* The Problem */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '12px'
        }}>
          <div style={{ fontWeight: 600, color: '#f87171', marginBottom: '6px' }}>
            ⚠️ The Hard Edge Problem
          </div>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px' }}>
            Traditional astrology treats sign boundaries as <strong>instant jumps</strong>:
          </p>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px' }}>
            <li>Born March 20 at 11:59 PM → "You're Pisces"</li>
            <li>Born March 21 at 12:01 AM → "You're Aries"</li>
          </ul>
          <p style={{ margin: '8px 0 0 0', fontSize: '11px', fontStyle: 'italic', color: '#fca5a5' }}>
            But their lived experience is nearly identical! This binary cutoff breaks realism.
          </p>
        </div>

        {/* Our Solution */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '12px'
        }}>
          <div style={{ fontWeight: 600, color: '#4ade80', marginBottom: '6px' }}>
            ✅ Our Solution: Smooth Transition Curve
          </div>
          <p style={{ margin: '0', fontSize: '11px' }}>
            Instead of a sudden switch, we use a <strong>continuous function</strong> that
            gradually blends energies over 6 days.
          </p>
        </div>

        {/* Why Not Linear? */}
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
          Why not use a simple linear blend?
        </p>
        <p style={{ margin: '0 0 12px 0', fontSize: '11px' }}>
          A straight line (16.6% per day) feels mechanical and artificial.
          Human personality transitions feel <strong>curved, asymmetrical, and organic</strong>.
        </p>

        {/* The Formula */}
        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '12px'
        }}>
          <div style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '6px' }}>
            📐 The Blend Formula
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#fde68a',
            background: 'rgba(0,0,0,0.3)',
            padding: '8px 10px',
            borderRadius: '4px',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            blend% = (day / 6)<sup style={{ fontSize: '10px' }}>p</sup> × 100
          </div>
          <p style={{ margin: '0', fontSize: '11px' }}>
            Where <strong>p = 1.6</strong> (inspired by the golden ratio φ ≈ 1.618)
          </p>
        </div>

        {/* Why 1.6? */}
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
          Why p = 1.6 specifically?
        </p>
        <ul style={{ margin: '0 0 12px 0', paddingLeft: '16px', fontSize: '11px' }}>
          <li>It's close to φ (golden ratio) — nature's growth constant</li>
          <li>Creates a gentle <strong>ease-in</strong> at the start</li>
          <li>Creates a gentle <strong>ease-out</strong> at the end</li>
          <li>Feels like a natural spiral transition, not mechanical interpolation</li>
        </ul>

        {/* Comparison Table */}
        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
          Linear vs φ-Curve Comparison:
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Day</th>
              <th style={thStyle}>Linear (p=1)</th>
              <th style={{ ...thStyle, color: '#fbbf24' }}>φ-Curve (p=1.6)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Day 1</td>
              <td style={{ ...tdStyle, color: '#9ca3af' }}>17%</td>
              <td style={{ ...tdStyle, color: '#fbbf24' }}>13%</td>
            </tr>
            <tr>
              <td style={tdStyle}>Day 2</td>
              <td style={{ ...tdStyle, color: '#9ca3af' }}>33%</td>
              <td style={{ ...tdStyle, color: '#fbbf24' }}>37%</td>
            </tr>
            <tr>
              <td style={tdStyle}>Day 3</td>
              <td style={{ ...tdStyle, color: '#9ca3af' }}>50%</td>
              <td style={{ ...tdStyle, color: '#fbbf24' }}>58%</td>
            </tr>
            <tr>
              <td style={tdStyle}>Day 4</td>
              <td style={{ ...tdStyle, color: '#9ca3af' }}>67%</td>
              <td style={{ ...tdStyle, color: '#fbbf24' }}>75%</td>
            </tr>
            <tr>
              <td style={tdStyle}>Day 5</td>
              <td style={{ ...tdStyle, color: '#9ca3af' }}>83%</td>
              <td style={{ ...tdStyle, color: '#fbbf24' }}>89%</td>
            </tr>
            <tr>
              <td style={tdStyle}>Day 6</td>
              <td style={{ ...tdStyle, color: '#9ca3af' }}>100%</td>
              <td style={{ ...tdStyle, color: '#fbbf24' }}>98%</td>
            </tr>
          </tbody>
        </table>

        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '6px',
          fontSize: '11px',
        }}>
          <strong style={{ color: '#c084fc' }}>🌟 Key Insight:</strong>
          <p style={{ margin: '6px 0 0 0' }}>
            The φ-curve starts slower and ends faster than linear. This mirrors how
            astrological energies actually feel — the <em>previous</em> sign lingers longer
            at the start, then the <em>new</em> sign accelerates into dominance.
          </p>
        </div>
      </Flap>

      {/* Flap 5: Elemental Compatibility Philosophy */}
      <Flap title="Elemental Compatibility" icon="🔥">
        <p style={{ margin: '0 0 12px 0' }}>
          The four elements have <strong>natural relationships</strong> based on ancient philosophy.
          Understanding these reveals why some pairings feel effortless while others require work.
        </p>

        {/* Grade A Pairs */}
        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '12px'
        }}>
          <div style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>
            ⭐ Grade A — Natural Harmony
          </div>

          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', color: '#fde68a', fontWeight: 600, marginBottom: '4px' }}>
              🔥 Fire + 💨 Air = Inspiration
            </div>
            <p style={{ margin: 0, fontSize: '11px' }}>
              Fire needs Air to burn brighter. Air fans Fire's passion into action.
              Both are <strong>active, expansive, outward-moving</strong> energies.
            </p>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
              Aries-Gemini • Leo-Libra • Sagittarius-Aquarius
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#fde68a', fontWeight: 600, marginBottom: '4px' }}>
              🌍 Earth + 💧 Water = Nurturing
            </div>
            <p style={{ margin: 0, fontSize: '11px' }}>
              Earth gives Water a container to rest in. Water makes Earth fertile.
              Both are <strong>receptive, inward, nurturing</strong> energies.
            </p>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
              Taurus-Cancer • Virgo-Scorpio • Capricorn-Pisces
            </div>
          </div>
        </div>

        {/* Grade B Pairs */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '12px'
        }}>
          <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '8px' }}>
            🌱 Grade B — Growth Through Tension
          </div>

          <div style={{ display: 'grid', gap: '8px', fontSize: '11px' }}>
            <div>
              <span style={{ color: '#7dd3fc' }}>🔥 Fire + 🌍 Earth:</span>{' '}
              Fire's speed vs Earth's patience — learn to balance action with stability.
            </div>
            <div>
              <span style={{ color: '#7dd3fc' }}>🔥 Fire + 💧 Water:</span>{' '}
              Fire's directness vs Water's depth — learn emotional intelligence.
            </div>
            <div>
              <span style={{ color: '#7dd3fc' }}>💨 Air + 🌍 Earth:</span>{' '}
              Air's ideas vs Earth's practicality — learn to ground visions.
            </div>
            <div>
              <span style={{ color: '#7dd3fc' }}>💨 Air + 💧 Water:</span>{' '}
              Air's logic vs Water's intuition — learn both head and heart.
            </div>
          </div>
        </div>

        {/* Neutral (Same Element) */}
        <div style={{
          background: 'rgba(148, 163, 184, 0.1)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '12px'
        }}>
          <div style={{ fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
            🪞 Neutral — Same Element Mirror
          </div>
          <p style={{ margin: 0, fontSize: '11px' }}>
            Same-element pairs (Fire+Fire, Earth+Earth, etc.) understand each other deeply
            but may <strong>amplify both strengths and weaknesses</strong>. Great for validation,
            challenging for growth.
          </p>
        </div>

        {/* The Philosophy */}
        <div style={{
          padding: '10px',
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '6px',
          fontSize: '11px',
        }}>
          <strong style={{ color: '#c084fc' }}>🏛️ Ancient Wisdom:</strong>
          <p style={{ margin: '6px 0 0 0' }}>
            This system traces back to Empedocles (490 BC) who saw the cosmos as
            four eternal roots. Aristotle added the <em>hot/cold</em> and <em>wet/dry</em> qualities
            that explain why Fire-Air and Earth-Water naturally harmonize.
          </p>
        </div>
      </Flap>

      {/* Flap 6: Taurus Blend Example */}
      <Flap title="Taurus Blend Example" icon="♉">
        <p style={{ margin: '0 0 12px 0' }}>
          Let's see the φ-curve in action with a real example:{' '}
          <span style={highlightStyle}>Taurus (April 20–25)</span> — the first 6 days
          when Aries energy is still fading.
        </p>

        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '12px'
        }}>
          <div style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '6px' }}>
            🔢 The φ-Curve Values
          </div>
          <p style={{ margin: '0 0 6px 0', fontSize: '11px' }}>
            Each cusp day uses this curve to determine blend percentages:
          </p>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#fde68a',
            background: 'rgba(0,0,0,0.3)',
            padding: '6px 8px',
            borderRadius: '4px',
          }}>
            Day 1: 13% → Day 2: 37% → Day 3: 58%<br/>
            Day 4: 75% → Day 5: 89% → Day 6: 98%
          </div>
        </div>

        <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
          Taurus Backward Blend (Apr 20–25):
        </p>
        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#9ca3af' }}>
          These are the first 6 days of Taurus, still carrying Aries energy:
        </p>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Primary</th>
              <th style={{ ...thStyle, color: '#4ade80' }}>Taurus %</th>
              <th style={{ ...thStyle, color: '#f87171' }}>Aries %</th>
            </tr>
          </thead>
          <tbody>
            {TAURUS_BACKWARD_EXAMPLE.map((row, i) => (
              <tr key={row.date} style={row.date === 'Apr 23' ? { background: 'rgba(251, 191, 36, 0.1)' } : {}}>
                <td style={tdStyle}>{row.date}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{row.primary}</td>
                <td style={{ ...tdStyle, color: '#4ade80' }}>{row.taurus}%</td>
                <td style={{ ...tdStyle, color: '#f87171' }}>{row.aries}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: 'rgba(96, 165, 250, 0.1)',
          border: '1px solid rgba(96, 165, 250, 0.3)',
          borderRadius: '6px',
          fontSize: '11px',
        }}>
          <strong style={{ color: '#60a5fa' }}>💡 Reading the table:</strong>
          <p style={{ margin: '6px 0 0 0' }}>
            Someone born on <strong>April 23</strong> is primarily Taurus (75%) but still
            carries 25% Aries energy. This explains why early Taurus people often feel
            more assertive and pioneering than "typical" Taurus descriptions.
          </p>
        </div>
      </Flap>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ZodiacEducationFlaps;
