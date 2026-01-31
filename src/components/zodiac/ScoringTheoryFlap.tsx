/**
 * ScoringTheoryFlap - Comprehensive Scoring Theory Explanation
 *
 * A detailed, 12th-grade level explanation of how compatibility scores
 * are calculated between zodiac positions. Shows all mathematical steps
 * with worked examples.
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface ScoringTheoryFlapProps {
  isOpen: boolean;
  onClose: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ScoringTheoryFlap: React.FC<ScoringTheoryFlapProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  if (!isOpen) return null;

  return (
    <div className="theory-overlay">
      <div className="theory-panel">
        {/* Header */}
        <div className="theory-header">
          <h2>Compatibility Scoring Theory</h2>
          <p className="theory-subtitle">
            Understanding How Relationship Effort Scores Are Calculated
          </p>
          <button type="button" className="theory-close" onClick={onClose}>×</button>
        </div>

        {/* Navigation */}
        <div className="theory-nav">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'angles', label: 'Step 1: Angles' },
            { id: 'elements', label: 'Step 2: Elements' },
            { id: 'modality', label: 'Step 3: Modality' },
            { id: 'calculation', label: 'Step 4: Calculate' },
            { id: 'examples', label: 'Examples' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`nav-btn ${activeSection === id ? 'active' : ''}`}
              onClick={() => setActiveSection(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="theory-content">
          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="section">
              <h3>What This Score Measures</h3>
              <p>
                The <strong>Effort Score</strong> measures how much conscious work is required
                to maintain harmony in a relationship between two zodiac placements.
              </p>

              <div className="key-concept">
                <div className="concept-icon">💡</div>
                <div>
                  <strong>Key Insight:</strong> A higher effort score doesn't mean a "bad" relationship.
                  It means more intentional communication and understanding is needed. Many strong
                  relationships thrive on this productive tension.
                </div>
              </div>

              <h4>The Five-Step Process</h4>
              <ol className="step-list">
                <li><strong>Start with Base Score:</strong> Every interaction begins at 5 points (neutral)</li>
                <li><strong>Apply Angle Adjustment:</strong> The geometric relationship between signs adds or subtracts points</li>
                <li><strong>Apply Element Adjustment:</strong> How the elements (Fire, Earth, Air, Water) interact</li>
                <li><strong>Apply Modality Adjustment:</strong> Special consideration for Fixed signs</li>
                <li><strong>Calculate Final Scores:</strong> Clamp the result to 1-10, then derive Harmony</li>
              </ol>

              <div className="formula-box">
                <h4>The Core Formulas</h4>
                <div className="formula">
                  <code>Effort = clamp(1, 10, Base + Angle + Element + Modality)</code>
                </div>
                <div className="formula">
                  <code>Harmony = 11 - Effort</code>
                </div>
              </div>

              <h4>Score Interpretation</h4>
              <table className="theory-table">
                <thead>
                  <tr>
                    <th>Effort Score</th>
                    <th>Harmony Score</th>
                    <th>Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row-excellent">
                    <td>1-2</td>
                    <td>9-10</td>
                    <td>Effortless connection - natural understanding</td>
                  </tr>
                  <tr className="row-good">
                    <td>3-4</td>
                    <td>7-8</td>
                    <td>Easy flow - minor adjustments needed</td>
                  </tr>
                  <tr className="row-moderate">
                    <td>5-6</td>
                    <td>5-6</td>
                    <td>Moderate effort - conscious communication helps</td>
                  </tr>
                  <tr className="row-challenging">
                    <td>7-8</td>
                    <td>3-4</td>
                    <td>Challenging - requires patience and work</td>
                  </tr>
                  <tr className="row-difficult">
                    <td>9-10</td>
                    <td>1-2</td>
                    <td>Significant effort - but high growth potential</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* STEP 1: ANGLES */}
          {activeSection === 'angles' && (
            <div className="section">
              <h3>Step 1: Angular Relationships Between Signs</h3>

              <p>
                In astrology, the <strong>aspect</strong> between two signs is determined by their
                angular separation around the 360° zodiac wheel. Each angle creates a different
                type of energetic relationship.
              </p>

              <div className="key-concept">
                <div className="concept-icon">📐</div>
                <div>
                  <strong>The Zodiac Wheel:</strong> The 12 signs are evenly spaced at 30° intervals.
                  The angle between any two signs determines their fundamental relationship dynamic.
                </div>
              </div>

              <h4>Complete Aspect Table</h4>
              <table className="theory-table wide">
                <thead>
                  <tr>
                    <th>Degrees</th>
                    <th>Aspect Name</th>
                    <th>Symbol</th>
                    <th>Adjustment</th>
                    <th>Why This Affects Relationships</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row-excellent">
                    <td>0°</td>
                    <td><strong>Conjunction</strong></td>
                    <td>☌</td>
                    <td className="adjust-neg">-1</td>
                    <td>
                      Same sign = same energy. You speak the same language instinctively.
                      Less translation needed, but watch for blind spots you both share.
                    </td>
                  </tr>
                  <tr className="row-moderate">
                    <td>30°</td>
                    <td><strong>Semi-sextile</strong></td>
                    <td>⚺</td>
                    <td className="adjust-neutral">0</td>
                    <td>
                      Adjacent signs share a border but differ in element AND modality.
                      Like neighbors with different lifestyles - requires small daily adjustments.
                    </td>
                  </tr>
                  <tr className="row-good">
                    <td>60°</td>
                    <td><strong>Sextile</strong></td>
                    <td>⚹</td>
                    <td className="adjust-neg">-1.5</td>
                    <td>
                      Compatible elements (Fire-Air or Earth-Water) create natural opportunity.
                      Like friends who complement each other - cooperation flows easily.
                    </td>
                  </tr>
                  <tr className="row-challenging">
                    <td>90°</td>
                    <td><strong>Square</strong></td>
                    <td>□</td>
                    <td className="adjust-pos">+2</td>
                    <td>
                      Signs share the same modality but clash in element. Both want to lead
                      in different directions. Creates friction - but friction builds strength.
                    </td>
                  </tr>
                  <tr className="row-excellent">
                    <td>120°</td>
                    <td><strong>Trine</strong></td>
                    <td>△</td>
                    <td className="adjust-neg">-2</td>
                    <td>
                      Same element creates deep understanding. Fire understands Fire,
                      Water understands Water. Natural harmony - like speaking your native tongue.
                    </td>
                  </tr>
                  <tr className="row-difficult">
                    <td>150°</td>
                    <td><strong>Quincunx</strong></td>
                    <td>⚻</td>
                    <td className="adjust-pos">+2.5</td>
                    <td>
                      Signs share NOTHING - different element, modality, and season.
                      Like puzzle pieces that almost fit but never quite click.
                      Requires constant adjustment without resolution.
                    </td>
                  </tr>
                  <tr className="row-challenging">
                    <td>180°</td>
                    <td><strong>Opposition</strong></td>
                    <td>☍</td>
                    <td className="adjust-pos">+1.5</td>
                    <td>
                      Opposite signs are polarities - they complete each other but approach
                      from opposite directions. Creates magnetic attraction AND tension.
                      Your partner mirrors what you lack.
                    </td>
                  </tr>
                </tbody>
              </table>

              <h4>Visual: The Zodiac Wheel Aspects</h4>
              <div className="wheel-diagram">
                <pre>{`
                        Aries (0°)
                           ↑
              Pisces ←     |     → Taurus
           (330°)          |          (30°)
                           |
        Aquarius ←─────────●─────────→ Gemini
           (300°)          |          (60°)
                           |
           Capricorn ←     |     → Cancer
              (270°)       |       (90°)
                           ↓
              Sagittarius ← → Leo
                 (240°)  Libra  (120°)
                        (180°)

    Example: Aries (0°) to Cancer (90°) = 90° = Square
    Example: Aries (0°) to Leo (120°) = 120° = Trine
                `}</pre>
              </div>
            </div>
          )}

          {/* STEP 2: ELEMENTS */}
          {activeSection === 'elements' && (
            <div className="section">
              <h3>Step 2: Element Interactions</h3>

              <p>
                Each zodiac sign belongs to one of four <strong>elements</strong>.
                How these elements interact adds another layer to relationship dynamics.
              </p>

              <h4>The Four Elements and Their Signs</h4>
              <div className="elements-grid">
                <div className="element-card fire">
                  <div className="element-emoji">🔥</div>
                  <h5>Fire Signs</h5>
                  <p>Aries, Leo, Sagittarius</p>
                  <p className="element-trait">Passionate, energetic, action-oriented</p>
                </div>
                <div className="element-card earth">
                  <div className="element-emoji">🌍</div>
                  <h5>Earth Signs</h5>
                  <p>Taurus, Virgo, Capricorn</p>
                  <p className="element-trait">Practical, grounded, security-focused</p>
                </div>
                <div className="element-card air">
                  <div className="element-emoji">💨</div>
                  <h5>Air Signs</h5>
                  <p>Gemini, Libra, Aquarius</p>
                  <p className="element-trait">Intellectual, communicative, idea-driven</p>
                </div>
                <div className="element-card water">
                  <div className="element-emoji">💧</div>
                  <h5>Water Signs</h5>
                  <p>Cancer, Scorpio, Pisces</p>
                  <p className="element-trait">Emotional, intuitive, feeling-based</p>
                </div>
              </div>

              <h4>Element Adjustment Rules</h4>
              <table className="theory-table">
                <thead>
                  <tr>
                    <th>Element Combination</th>
                    <th>Adjustment</th>
                    <th>Why</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row-excellent">
                    <td><strong>Same Element</strong><br/>(Fire-Fire, Earth-Earth, etc.)</td>
                    <td className="adjust-neg">-1</td>
                    <td>
                      Instinctive understanding. You process the world the same way.
                      Fire speaks to Fire without translation.
                    </td>
                  </tr>
                  <tr className="row-challenging">
                    <td><strong>Fire + Water</strong><br/>(e.g., Aries + Cancer)</td>
                    <td className="adjust-pos">+1</td>
                    <td>
                      Creates "steam" - passion meets sensitivity. Fire can evaporate
                      Water's emotions; Water can extinguish Fire's enthusiasm.
                      Requires careful handling.
                    </td>
                  </tr>
                  <tr className="row-moderate">
                    <td><strong>Earth + Air</strong><br/>(e.g., Taurus + Gemini)</td>
                    <td className="adjust-pos">+0.5</td>
                    <td>
                      Practical vs. theoretical clash. Earth wants concrete results;
                      Air wants to discuss possibilities. Minor friction but manageable.
                    </td>
                  </tr>
                  <tr className="row-good">
                    <td><strong>Fire + Air</strong><br/>(e.g., Aries + Gemini)</td>
                    <td className="adjust-neutral">0</td>
                    <td>
                      Naturally compatible! Air fans Fire's flames. Ideas fuel action.
                    </td>
                  </tr>
                  <tr className="row-good">
                    <td><strong>Earth + Water</strong><br/>(e.g., Taurus + Cancer)</td>
                    <td className="adjust-neutral">0</td>
                    <td>
                      Naturally compatible! Water nourishes Earth. Emotions meet stability.
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="key-concept">
                <div className="concept-icon">⚠️</div>
                <div>
                  <strong>Important:</strong> Element adjustments apply IN ADDITION to angle
                  adjustments. A Trine (120°) between Fire signs gets BOTH the Trine bonus (-2)
                  AND the Same Element bonus (-1).
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MODALITY */}
          {activeSection === 'modality' && (
            <div className="section">
              <h3>Step 3: Modality Adjustments</h3>

              <p>
                Each sign also has a <strong>modality</strong> (also called "quality") that
                describes HOW it expresses its energy. There are three modalities:
              </p>

              <h4>The Three Modalities</h4>
              <div className="modality-grid">
                <div className="modality-card cardinal">
                  <h5>Cardinal Signs</h5>
                  <p className="modality-signs">Aries, Cancer, Libra, Capricorn</p>
                  <p>Initiators - they START things. They mark the beginning of each season.</p>
                </div>
                <div className="modality-card fixed">
                  <h5>Fixed Signs</h5>
                  <p className="modality-signs">Taurus, Leo, Scorpio, Aquarius</p>
                  <p>Stabilizers - they MAINTAIN things. They represent the heart of each season.</p>
                </div>
                <div className="modality-card mutable">
                  <h5>Mutable Signs</h5>
                  <p className="modality-signs">Gemini, Virgo, Sagittarius, Pisces</p>
                  <p>Adapters - they CHANGE things. They mark the transition between seasons.</p>
                </div>
              </div>

              <h4>The Fixed Sign Penalty</h4>
              <table className="theory-table">
                <thead>
                  <tr>
                    <th>Modality Combination</th>
                    <th>Adjustment</th>
                    <th>Why</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row-challenging">
                    <td><strong>Both Fixed Signs</strong><br/>(e.g., Taurus + Aquarius)</td>
                    <td className="adjust-pos">+1</td>
                    <td>
                      Both partners are stubborn by nature. Fixed signs dig in their heels
                      and resist change. When two Fixed signs conflict, neither wants to
                      yield first, creating potential stalemates.
                    </td>
                  </tr>
                  <tr className="row-good">
                    <td><strong>All other combinations</strong></td>
                    <td className="adjust-neutral">0</td>
                    <td>
                      No additional adjustment. Cardinal-Cardinal, Mutable-Mutable, or
                      mixed combinations don't add extra friction.
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="key-concept">
                <div className="concept-icon">🔒</div>
                <div>
                  <strong>Why Only Fixed Signs?</strong> Fixed signs represent the most
                  concentrated, stubborn energy of their element. When two Fixed signs
                  interact, especially in a challenging aspect like Square, the immovable
                  meets the immovable. This creates the astrological equivalent of two
                  people refusing to budge in an argument.
                </div>
              </div>

              <h4>Fixed Sign Square: The Most Challenging Combination</h4>
              <p>
                A Square (90°) between two Fixed signs combines:
              </p>
              <ul>
                <li>Square tension (+2) - fundamental directional conflict</li>
                <li>Fixed stubbornness (+1) - neither will compromise easily</li>
              </ul>
              <p>
                Example: <strong>Taurus □ Leo</strong> = Fixed Earth vs Fixed Fire at 90°
              </p>
            </div>
          )}

          {/* STEP 4: CALCULATION */}
          {activeSection === 'calculation' && (
            <div className="section">
              <h3>Step 4: Final Calculation</h3>

              <h4>The Clamp Function</h4>
              <p>
                After adding all adjustments, we use a <strong>clamp function</strong> to
                ensure the final score stays within a usable range (1-10).
              </p>

              <div className="formula-box">
                <h4>Clamp Definition</h4>
                <div className="formula">
                  <code>clamp(min, max, value) =</code>
                </div>
                <ul className="clamp-rules">
                  <li>If value &lt; min → return min (the "floor")</li>
                  <li>If value &gt; max → return max (the "ceiling")</li>
                  <li>Otherwise → return value (unchanged)</li>
                </ul>
              </div>

              <h4>Why Clamp?</h4>
              <p>
                Without clamping, extreme combinations could produce scores like -3 or 15,
                which are meaningless on our 1-10 scale. The clamp ensures:
              </p>
              <ul>
                <li>Even the easiest combinations require SOME effort (minimum 1)</li>
                <li>Even the hardest combinations are manageable (maximum 10)</li>
              </ul>

              <h4>Clamp Examples</h4>
              <table className="theory-table">
                <thead>
                  <tr>
                    <th>Raw Score</th>
                    <th>After clamp(1, 10, x)</th>
                    <th>Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>-2</td>
                    <td>1</td>
                    <td>Below minimum, raised to floor</td>
                  </tr>
                  <tr>
                    <td>0</td>
                    <td>1</td>
                    <td>Below minimum, raised to floor</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>3</td>
                    <td>Within range, unchanged</td>
                  </tr>
                  <tr>
                    <td>7.5</td>
                    <td>8</td>
                    <td>Rounded to nearest integer</td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>10</td>
                    <td>Above maximum, lowered to ceiling</td>
                  </tr>
                </tbody>
              </table>

              <h4>Calculating Harmony from Effort</h4>
              <div className="formula-box">
                <div className="formula">
                  <code>Harmony = 11 - Effort</code>
                </div>
              </div>
              <p>
                Why 11? Because we want Harmony to also be on a 1-10 scale:
              </p>
              <ul>
                <li>If Effort = 1 (minimum) → Harmony = 11 - 1 = <strong>10</strong> (maximum)</li>
                <li>If Effort = 10 (maximum) → Harmony = 11 - 10 = <strong>1</strong> (minimum)</li>
              </ul>

              <h4>Complete Calculation Template</h4>
              <div className="calc-template">
                <div className="calc-row">Base Score:</div>
                <div className="calc-value">5</div>
                <div className="calc-row">+ Angle Adjustment:</div>
                <div className="calc-value">___</div>
                <div className="calc-row">+ Element Adjustment:</div>
                <div className="calc-value">___</div>
                <div className="calc-row">+ Modality Adjustment:</div>
                <div className="calc-value">___</div>
                <div className="calc-divider"></div>
                <div className="calc-row">Raw Total:</div>
                <div className="calc-value">___</div>
                <div className="calc-row">After clamp(1, 10):</div>
                <div className="calc-value final">Effort = ___</div>
                <div className="calc-row">Harmony = 11 - Effort:</div>
                <div className="calc-value final">Harmony = ___/10</div>
              </div>
            </div>
          )}

          {/* EXAMPLES */}
          {activeSection === 'examples' && (
            <div className="section">
              <h3>Worked Examples</h3>

              {/* Example 1 */}
              <div className="example-box">
                <h4>Example 1: Taurus ⚻ Libra (Quincunx - 150°)</h4>
                <div className="example-setup">
                  <div className="sign-info">
                    <strong>Taurus:</strong> Earth element, Fixed modality
                  </div>
                  <div className="sign-info">
                    <strong>Libra:</strong> Air element, Cardinal modality
                  </div>
                  <div className="sign-info">
                    <strong>Aspect:</strong> 150° = Quincunx
                  </div>
                </div>

                <div className="calculation-steps">
                  <div className="step">
                    <span className="step-label">Base Score:</span>
                    <span className="step-value">5</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Angle (Quincunx):</span>
                    <span className="step-value adjust-pos">+2.5</span>
                    <span className="step-note">150° = awkward fit, constant adjustment</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Element (Earth + Air):</span>
                    <span className="step-value adjust-pos">+0.5</span>
                    <span className="step-note">Practical vs theoretical</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Modality (Fixed + Cardinal):</span>
                    <span className="step-value adjust-neutral">0</span>
                    <span className="step-note">No penalty - not both Fixed</span>
                  </div>
                  <div className="step total">
                    <span className="step-label">Raw Total:</span>
                    <span className="step-value">5 + 2.5 + 0.5 + 0 = 8</span>
                  </div>
                  <div className="step">
                    <span className="step-label">After clamp(1, 10, 8):</span>
                    <span className="step-value">8</span>
                  </div>
                  <div className="step final">
                    <span className="step-label">Effort Score:</span>
                    <span className="step-value">8/10</span>
                  </div>
                  <div className="step final">
                    <span className="step-label">Harmony = 11 - 8:</span>
                    <span className="step-value harmony">3/10</span>
                  </div>
                </div>

                <div className="example-interpretation">
                  <strong>Interpretation:</strong> This combination requires significant effort.
                  The Quincunx creates persistent misalignment - Taurus wants stability and
                  concrete results, while Libra wants balance and intellectual harmony.
                  They approach problems from completely different angles with no natural overlap.
                </div>
              </div>

              {/* Example 2 */}
              <div className="example-box">
                <h4>Example 2: Taurus □ Aquarius (Square - 90°, Both Fixed)</h4>
                <div className="example-setup">
                  <div className="sign-info">
                    <strong>Taurus:</strong> Earth element, <span className="highlight-fixed">Fixed</span> modality
                  </div>
                  <div className="sign-info">
                    <strong>Aquarius:</strong> Air element, <span className="highlight-fixed">Fixed</span> modality
                  </div>
                  <div className="sign-info">
                    <strong>Aspect:</strong> 90° = Square
                  </div>
                </div>

                <div className="calculation-steps">
                  <div className="step">
                    <span className="step-label">Base Score:</span>
                    <span className="step-value">5</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Angle (Square):</span>
                    <span className="step-value adjust-pos">+2</span>
                    <span className="step-note">90° = tension, growth catalyst</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Element (Earth + Air):</span>
                    <span className="step-value adjust-pos">+0.5</span>
                    <span className="step-note">Practical vs theoretical</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Modality (Both Fixed):</span>
                    <span className="step-value adjust-pos">+1</span>
                    <span className="step-note">Stubborn standoffs possible!</span>
                  </div>
                  <div className="step total">
                    <span className="step-label">Raw Total:</span>
                    <span className="step-value">5 + 2 + 0.5 + 1 = 8.5</span>
                  </div>
                  <div className="step">
                    <span className="step-label">After clamp(1, 10, round(8.5)):</span>
                    <span className="step-value">9</span>
                  </div>
                  <div className="step final">
                    <span className="step-label">Effort Score:</span>
                    <span className="step-value">9/10</span>
                  </div>
                  <div className="step final">
                    <span className="step-label">Harmony = 11 - 9:</span>
                    <span className="step-value harmony-low">2/10</span>
                  </div>
                </div>

                <div className="example-interpretation">
                  <strong>Interpretation:</strong> One of the most challenging combinations.
                  Taurus (practical, security-focused) squares Aquarius (revolutionary, change-focused).
                  Both are Fixed signs, meaning neither wants to bend. Taurus wants to preserve;
                  Aquarius wants to innovate. This creates powerful friction - but also tremendous
                  growth potential if both partners commit to understanding.
                </div>
              </div>

              {/* Example 3 */}
              <div className="example-box best">
                <h4>Example 3: Aries △ Leo (Trine - 120°, Best Case)</h4>
                <div className="example-setup">
                  <div className="sign-info">
                    <strong>Aries:</strong> Fire element, Cardinal modality
                  </div>
                  <div className="sign-info">
                    <strong>Leo:</strong> Fire element, Fixed modality
                  </div>
                  <div className="sign-info">
                    <strong>Aspect:</strong> 120° = Trine
                  </div>
                </div>

                <div className="calculation-steps">
                  <div className="step">
                    <span className="step-label">Base Score:</span>
                    <span className="step-value">5</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Angle (Trine):</span>
                    <span className="step-value adjust-neg">-2</span>
                    <span className="step-note">120° = same element, natural flow</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Element (Fire + Fire):</span>
                    <span className="step-value adjust-neg">-1</span>
                    <span className="step-note">Same element = instinctive understanding</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Modality (Cardinal + Fixed):</span>
                    <span className="step-value adjust-neutral">0</span>
                    <span className="step-note">No penalty</span>
                  </div>
                  <div className="step total">
                    <span className="step-label">Raw Total:</span>
                    <span className="step-value">5 + (-2) + (-1) + 0 = 2</span>
                  </div>
                  <div className="step">
                    <span className="step-label">After clamp(1, 10, 2):</span>
                    <span className="step-value">2</span>
                  </div>
                  <div className="step final">
                    <span className="step-label">Effort Score:</span>
                    <span className="step-value">2/10</span>
                  </div>
                  <div className="step final">
                    <span className="step-label">Harmony = 11 - 2:</span>
                    <span className="step-value harmony-high">9/10</span>
                  </div>
                </div>

                <div className="example-interpretation">
                  <strong>Interpretation:</strong> Near-optimal compatibility! Two Fire signs
                  in a Trine aspect speak the same passionate language. Aries initiates, Leo
                  stabilizes - a natural division of labor. They understand each other's need
                  for excitement, recognition, and bold action without explanation.
                </div>
              </div>

              {/* Example 4 */}
              <div className="example-box worst">
                <h4>Example 4: Cancer □ Aries + Fire/Water (Worst Case)</h4>
                <div className="example-setup">
                  <div className="sign-info">
                    <strong>Cancer:</strong> Water element, Cardinal modality
                  </div>
                  <div className="sign-info">
                    <strong>Aries:</strong> Fire element, Cardinal modality
                  </div>
                  <div className="sign-info">
                    <strong>Aspect:</strong> 90° = Square
                  </div>
                </div>

                <div className="calculation-steps">
                  <div className="step">
                    <span className="step-label">Base Score:</span>
                    <span className="step-value">5</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Angle (Square):</span>
                    <span className="step-value adjust-pos">+2</span>
                    <span className="step-note">90° = tension</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Element (Fire + Water):</span>
                    <span className="step-value adjust-pos">+1</span>
                    <span className="step-note">Steam - passion meets sensitivity</span>
                  </div>
                  <div className="step">
                    <span className="step-label">Modality (Both Cardinal):</span>
                    <span className="step-value adjust-neutral">0</span>
                    <span className="step-note">No Fixed penalty</span>
                  </div>
                  <div className="step total">
                    <span className="step-label">Raw Total:</span>
                    <span className="step-value">5 + 2 + 1 + 0 = 8</span>
                  </div>
                  <div className="step">
                    <span className="step-label">After clamp(1, 10, 8):</span>
                    <span className="step-value">8</span>
                  </div>
                  <div className="step final">
                    <span className="step-label">Effort Score:</span>
                    <span className="step-value">8/10</span>
                  </div>
                  <div className="step final">
                    <span className="step-label">Harmony = 11 - 8:</span>
                    <span className="step-value harmony-low">3/10</span>
                  </div>
                </div>

                <div className="example-interpretation">
                  <strong>Interpretation:</strong> Fire and Water at 90° creates the classic
                  "steam" dynamic. Aries charges forward; Cancer needs emotional processing time.
                  Aries may seem insensitive to Cancer's feelings; Cancer may seem clingy to
                  Aries. However, if both partners learn each other's language, Aries can
                  protect Cancer, and Cancer can nurture Aries.
                </div>
              </div>

              {/* Theoretical Extremes */}
              <div className="extremes-box">
                <h4>Theoretical Score Extremes</h4>

                <div className="extreme best">
                  <h5>Minimum Effort (Best Harmony): Effort = 1, Harmony = 10</h5>
                  <p>
                    <strong>Achieved by:</strong> Conjunction (0°) of same element signs
                  </p>
                  <p>Example: Aries ☌ Aries (same sign)</p>
                  <div className="mini-calc">
                    5 (base) + (-1) (conjunction) + (-1) (same element) = 3 → clamp → 3<br/>
                    Wait - that's not 1! Can we get to 1?
                  </div>
                  <p>
                    Actually, the theoretical minimum with current rules is <strong>Effort = 2</strong>
                    (Harmony = 9), achieved by same-element Trines like Aries △ Leo.
                  </p>
                </div>

                <div className="extreme worst">
                  <h5>Maximum Effort (Lowest Harmony): Effort = 10, Harmony = 1</h5>
                  <p>
                    <strong>Achieved by:</strong> Quincunx (150°) + Fire/Water + Both Fixed
                  </p>
                  <p>Example: Leo ⚻ Pisces... but Pisces isn't Fixed.</p>
                  <p>
                    The actual maximum with Fixed penalty: <strong>Scorpio ⚻ Aries</strong><br/>
                    5 + 2.5 (quincunx) + 1 (Fire+Water) = 8.5 → 9<br/>
                    (Aries isn't Fixed, so no +1 modality)
                  </p>
                  <p>
                    Or: <strong>Taurus □ Aquarius</strong> (from Example 2) = Effort 9
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .theory-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: auto;
        }

        .theory-panel {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }

        .theory-header {
          padding: 24px 24px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .theory-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
        }

        .theory-subtitle {
          margin: 0;
          font-size: 14px;
          color: #9ca3af;
        }

        .theory-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #9ca3af;
          font-size: 24px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .theory-close:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .theory-nav {
          display: flex;
          gap: 4px;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.2);
          overflow-x: auto;
        }

        .nav-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #9ca3af;
          font-size: 13px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #e5e7eb;
        }

        .nav-btn.active {
          background: rgba(251, 191, 36, 0.2);
          border-color: rgba(251, 191, 36, 0.4);
          color: #fbbf24;
        }

        .theory-content {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .section h3 {
          font-size: 20px;
          font-weight: 700;
          color: #fbbf24;
          margin: 0 0 16px 0;
        }

        .section h4 {
          font-size: 16px;
          font-weight: 600;
          color: #e5e7eb;
          margin: 24px 0 12px 0;
        }

        .section p {
          font-size: 14px;
          line-height: 1.7;
          color: #d1d5db;
          margin: 0 0 16px 0;
        }

        .section ul, .section ol {
          margin: 0 0 16px 0;
          padding-left: 24px;
        }

        .section li {
          font-size: 14px;
          line-height: 1.7;
          color: #d1d5db;
          margin-bottom: 8px;
        }

        .key-concept {
          display: flex;
          gap: 16px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
        }

        .concept-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .key-concept strong {
          color: #60a5fa;
        }

        .step-list {
          counter-reset: step;
        }

        .step-list li {
          counter-increment: step;
          padding-left: 8px;
        }

        .step-list li::marker {
          content: "Step " counter(step) ": ";
          color: #fbbf24;
          font-weight: 600;
        }

        .formula-box {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin: 16px 0;
        }

        .formula-box h4 {
          margin-top: 0;
          color: #fbbf24;
        }

        .formula {
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 16px;
          color: #a5f3fc;
          margin: 12px 0;
        }

        .formula code {
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 16px;
          border-radius: 6px;
          display: inline-block;
        }

        .clamp-rules {
          list-style: none;
          padding-left: 0;
        }

        .clamp-rules li {
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 13px;
          color: #d1d5db;
          padding: 4px 0;
        }

        /* Tables */
        .theory-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 13px;
        }

        .theory-table.wide {
          font-size: 12px;
        }

        .theory-table th,
        .theory-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .theory-table th {
          background: rgba(255, 255, 255, 0.05);
          color: #fbbf24;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
        }

        .theory-table td {
          color: #e5e7eb;
        }

        .row-excellent {
          background: rgba(34, 197, 94, 0.1);
        }

        .row-good {
          background: rgba(132, 204, 22, 0.1);
        }

        .row-moderate {
          background: rgba(234, 179, 8, 0.1);
        }

        .row-challenging {
          background: rgba(249, 115, 22, 0.1);
        }

        .row-difficult {
          background: rgba(239, 68, 68, 0.1);
        }

        .adjust-neg {
          color: #22c55e !important;
          font-weight: 700;
        }

        .adjust-pos {
          color: #f97316 !important;
          font-weight: 700;
        }

        .adjust-neutral {
          color: #6b7280 !important;
        }

        /* Elements Grid */
        .elements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin: 16px 0;
        }

        .element-card {
          padding: 16px;
          border-radius: 12px;
          text-align: center;
        }

        .element-card.fire {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .element-card.earth {
          background: rgba(132, 204, 22, 0.15);
          border: 1px solid rgba(132, 204, 22, 0.3);
        }

        .element-card.air {
          background: rgba(147, 197, 253, 0.15);
          border: 1px solid rgba(147, 197, 253, 0.3);
        }

        .element-card.water {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .element-emoji {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .element-card h5 {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #fff;
        }

        .element-card p {
          margin: 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .element-trait {
          margin-top: 8px !important;
          font-style: italic;
        }

        /* Modality Grid */
        .modality-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin: 16px 0;
        }

        .modality-card {
          padding: 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modality-card h5 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #fbbf24;
        }

        .modality-signs {
          font-size: 12px;
          color: #a78bfa;
          margin-bottom: 8px !important;
        }

        .modality-card.fixed {
          background: rgba(251, 191, 36, 0.1);
          border-color: rgba(251, 191, 36, 0.3);
        }

        /* Wheel Diagram */
        .wheel-diagram {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 16px;
          overflow-x: auto;
        }

        .wheel-diagram pre {
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 11px;
          color: #9ca3af;
          margin: 0;
          line-height: 1.4;
        }

        /* Calculation Template */
        .calc-template {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px 16px;
          background: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 12px;
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 13px;
        }

        .calc-row {
          color: #9ca3af;
        }

        .calc-value {
          color: #e5e7eb;
          text-align: right;
        }

        .calc-value.final {
          color: #fbbf24;
          font-weight: 700;
        }

        .calc-divider {
          grid-column: 1 / -1;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
          margin: 8px 0;
        }

        /* Examples */
        .example-box {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }

        .example-box.best {
          border-color: rgba(34, 197, 94, 0.4);
          background: rgba(34, 197, 94, 0.05);
        }

        .example-box.worst {
          border-color: rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.05);
        }

        .example-box h4 {
          margin-top: 0;
          color: #a78bfa;
        }

        .example-setup {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .sign-info {
          font-size: 13px;
          color: #d1d5db;
        }

        .highlight-fixed {
          background: rgba(251, 191, 36, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          color: #fbbf24;
        }

        .calculation-steps {
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 13px;
        }

        .step {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .step-label {
          color: #9ca3af;
          min-width: 200px;
        }

        .step-value {
          color: #e5e7eb;
          font-weight: 600;
        }

        .step-note {
          color: #6b7280;
          font-size: 11px;
          font-style: italic;
        }

        .step.total {
          background: rgba(59, 130, 246, 0.1);
          padding: 12px;
          margin: 8px -12px;
          border-radius: 6px;
        }

        .step.final {
          background: rgba(251, 191, 36, 0.1);
          padding: 12px;
          margin: 4px -12px;
          border-radius: 6px;
          border: none;
        }

        .harmony-high {
          color: #22c55e !important;
        }

        .harmony-low {
          color: #ef4444 !important;
        }

        .example-interpretation {
          margin-top: 16px;
          padding: 12px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.7;
          color: #c7d2fe;
        }

        /* Extremes */
        .extremes-box {
          margin-top: 24px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
        }

        .extremes-box h4 {
          margin-top: 0;
        }

        .extreme {
          padding: 16px;
          border-radius: 8px;
          margin: 12px 0;
        }

        .extreme.best {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .extreme.worst {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .extreme h5 {
          margin: 0 0 8px 0;
          color: #fff;
        }

        .extreme p {
          margin: 4px 0;
          font-size: 13px;
        }

        .mini-calc {
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: 12px;
          color: #9ca3af;
          padding: 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          margin: 8px 0;
        }
      `}</style>
    </div>
  );
};

export default ScoringTheoryFlap;
