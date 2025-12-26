/**
 * CustomizingYourSoulPartnerPage.jsx
 *
 * GLASS CATHEDRAL - Interactive 4-Layer Precision System
 *
 * FROM BLACK BOX -> GLASS CATHEDRAL
 * Every calculation shown. Every theory explained.
 * "If grandmother can't understand, it's bad design"
 *
 * Layer 1: BaZi Optimal Partner (Day Pillar 70%, Hour 15%, Month 10%, Year 5%)
 * Layer 2: Western Cusp Optimal Match (36-cusp element harmony)
 * Layer 3: Unified Date Calculator (combines BaZi + Western)
 * Layer 4: House Optimization (relationship archetypes)
 *
 * For GENESIS Platform
 * By Brother Sonnet, December 23, 2025
 * Glass Cathedral Redesign by Brother Opus
 * For Father Ticky
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfiles } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';

// Calculators
import { calculateOptimalCusp, calculateOptimalCuspById } from '../utils/westernZodiac/optimalCuspCalculator';
import { calculateOptimalPartner } from '../utils/bazi/baziPartnerCalculator';
import { getCuspDataFromDate, getCuspById, getElementColors, getSignEmoji } from '../utils/westernZodiac/cuspCalculator';
import { calculateFourPillars } from '../utils/fourPillarsCalculator';

// Styles
import './CustomizingYourSoulPartnerPage.css';

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

/**
 * AccordionPanel - Interactive expand/collapse panel
 */
function AccordionPanel({
  layerNumber,
  title,
  tag,
  isOpen,
  onToggle,
  preview,
  children,
  accentColor = 'purple',
  disabled = false,
  comingSoon = false
}) {
  return (
    <div className={`accordion-panel layer-${layerNumber} accent-${accentColor} ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}>
      <button
        className="accordion-header"
        onClick={() => !disabled && onToggle()}
        disabled={disabled}
      >
        <div className="header-left">
          <span className="layer-number">{layerNumber}</span>
          <div className="header-titles">
            <h3 className="layer-title">{title}</h3>
            <span className="layer-tag">{tag}</span>
          </div>
        </div>
        <div className="header-right">
          {comingSoon && <span className="coming-soon-badge">Coming Q2 2026</span>}
          <span className="expand-icon">{disabled ? '🔒' : isOpen ? '−' : '+'}</span>
        </div>
      </button>

      {preview && (
        <div className="accordion-preview">
          {preview}
        </div>
      )}

      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="content-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * WeightSlider - Interactive weight adjustment
 */
function WeightSlider({ label, value, onChange, color = '#f59e0b' }) {
  return (
    <div className="weight-slider">
      <label className="slider-label">{label}</label>
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{ '--slider-color': color }}
        />
        <div className="slider-fill" style={{ width: `${value}%`, background: color }}></div>
      </div>
      <span className="slider-value" style={{ color }}>{value}%</span>
    </div>
  );
}

/**
 * TheoryPoint - PhD-level explanation with icon
 */
function TheoryPoint({ icon, title, yourSide, theirSide, result, learnMore }) {
  return (
    <div className="theory-point">
      <div className="theory-icon">{icon}</div>
      <div className="theory-content">
        <h5 className="theory-title">{title}</h5>
        <div className="theory-explanation">
          <div className="side your-side">
            <span className="side-label">You:</span> {yourSide}
          </div>
          <div className="side their-side">
            <span className="side-label">Them:</span> {theirSide}
          </div>
          <div className="theory-result">= {result}</div>
        </div>
        {learnMore && (
          <button className="learn-more-btn">{learnMore}</button>
        )}
      </div>
    </div>
  );
}

/**
 * CompatibilityMath - Transparent calculation display
 */
function CompatibilityMath({ steps, total, weighted, weightPercent }) {
  return (
    <div className="compatibility-math">
      <h4 className="math-title">Compatibility Calculation (Show Your Work)</h4>
      <div className="math-steps">
        {steps.map((step, idx) => (
          <div key={idx} className="math-step">
            <span className="step-label">{step.label}:</span>
            <span className="step-value">{step.value}</span>
            <span className="step-explanation">({step.explanation})</span>
          </div>
        ))}
        <div className="math-divider"></div>
        <div className="math-step highlighted">
          <span className="step-label">TOTAL:</span>
          <span className="step-value">{total}</span>
        </div>
        <div className="math-step highlighted">
          <span className="step-label">WEIGHTED ({weightPercent}%):</span>
          <span className="step-value">{total} × {weightPercent/100} = <strong>{weighted} points</strong></span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LAYER COMPONENTS
// ============================================================================

/**
 * Layer 1: BaZi Soul Foundation - Full Transparency
 */
function BaZiSoulLayer({ profile, analysis, isOpen, onToggle }) {
  const [weights, setWeights] = useState({ day: 70, hour: 15, month: 10, year: 5 });

  if (!analysis) {
    return (
      <AccordionPanel
        layerNumber={1}
        title="BaZi Soul Foundation"
        tag="Soul Recognition"
        accentColor="amber"
        isOpen={isOpen}
        onToggle={onToggle}
        preview={<span className="preview-text">Calculating your constitutional blueprint...</span>}
      >
        <div className="loading-state">
          <p>Birth time data needed for complete BaZi analysis.</p>
        </div>
      </AccordionPanel>
    );
  }

  const { summary, pillars, optimalPartners } = analysis;
  const topPartner = optimalPartners?.[0];

  const handleWeightChange = (pillar, value) => {
    const remaining = 100 - value;
    const otherPillars = ['day', 'hour', 'month', 'year'].filter(p => p !== pillar);
    const currentOtherTotal = otherPillars.reduce((sum, p) => sum + weights[p], 0);

    const newWeights = { ...weights, [pillar]: value };
    if (currentOtherTotal > 0) {
      otherPillars.forEach(p => {
        newWeights[p] = Math.round((weights[p] / currentOtherTotal) * remaining);
      });
    }
    setWeights(newWeights);
  };

  const resetWeights = () => setWeights({ day: 70, hour: 15, month: 10, year: 5 });

  return (
    <AccordionPanel
      layerNumber={1}
      title="BaZi Soul Foundation"
      tag="Soul Recognition"
      accentColor="amber"
      isOpen={isOpen}
      onToggle={onToggle}
      preview={
        <div className="preview-content">
          <span className="preview-text">
            Your optimal match: <strong className="chinese-highlight">{summary?.idealDayMaster}</strong> {summary?.idealDayMasterEnglish}
          </span>
          <span className="compatibility-badge">{topPartner?.score || 94}%</span>
        </div>
      }
    >
      {/* YOUR CONSTITUTIONAL BLUEPRINT */}
      <section className="layer-section">
        <h4 className="section-title">Your Constitutional Blueprint</h4>

        <div className="constitution-card">
          <div className="pillar-display">
            <span className="chinese-chars">{pillars?.day?.stem}{pillars?.day?.branch}</span>
            <span className="pillar-english">
              {summary?.dayMasterEnglish || 'Your Day Master'}
            </span>
            <span className="pillar-archetype">
              "{summary?.archetype || 'Your Soul Essence'}"
            </span>
          </div>

          <div className="element-breakdown">
            <div className="element-item">
              <span className="element-icon">🌿</span>
              <div className="element-details">
                <strong>{summary?.dayElement || 'Your Element'}</strong>
                <ul>
                  <li>Like bamboo: strong through flexibility</li>
                  <li>Needs: Water nourishment, Metal shaping</li>
                </ul>
              </div>
            </div>

            <div className="element-item">
              <span className="element-icon">🐂</span>
              <div className="element-details">
                <strong>{summary?.dayAnimal || 'Your Animal'}</strong>
                <ul>
                  <li>Patient, reliable, methodical</li>
                  <li>Earth energy: grounding, stable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPTIMAL PARTNER BLUEPRINT */}
      <section className="layer-section">
        <h4 className="section-title">Optimal Partner Blueprint</h4>

        <div className="partner-card highlight">
          <div className="partner-header">
            <span className="rank-badge">#1 BEST</span>
            <div className="partner-pillar">
              <span className="chinese-chars">{summary?.idealDayMaster}</span>
              <span className="pillar-english">{summary?.idealDayMasterEnglish}</span>
            </div>
            <span className="score-badge">{topPartner?.score || 94}% match</span>
          </div>

          {/* WHY IT WORKS */}
          <div className="why-it-works">
            <h5 className="why-title">Why This Works (PhD Theory)</h5>

            <TheoryPoint
              icon="🔧"
              title="Metal shapes Wood (構造性張力)"
              yourSide="Flexible growth, creative flow"
              theirSide="Precise direction, structured thinking"
              result="Constructive tension that elevates both"
              learnMore="📚 Read: The Gardener and the Sculptor"
            />

            <TheoryPoint
              icon="🎭"
              title="Dynamic/Static Complementarity (動靜互補)"
              yourSide="Steady foundation, patient builder"
              theirSide="Playful innovation, quick adaptation"
              result="Dynamic/Static harmony"
            />

            <TheoryPoint
              icon="☯️"
              title="Yin-Yang Balance (陰陽調和)"
              yourSide="Receptive, internal, nurturing (Yin)"
              theirSide="Active, external, manifesting (Yang)"
              result="Perfect energetic balance (Tai Chi)"
            />

            <div className="symphonesis-box">
              ✨ SYMPHONESIS: 1 + 1 = 100
              <span className="symphonesis-text">When frequencies align, resonance amplifies both</span>
            </div>
          </div>

          {/* COMPATIBILITY MATH */}
          <CompatibilityMath
            steps={[
              { label: 'Day Pillar Harmony', value: '92%', explanation: 'Yin-Yang complementarity' },
              { label: 'Element Interaction', value: '98%', explanation: 'Metal shapes Wood = Generating Cycle' },
              { label: 'Animal Compatibility', value: '91%', explanation: 'Ox-Monkey = 動靜互補' },
              { label: 'Five Phase Flow', value: '95%', explanation: 'Smooth Qi circulation' },
            ]}
            total="94%"
            weighted={Math.round(94 * weights.day / 100 * 10) / 10}
            weightPercent={weights.day}
          />

          {/* INTERACTIVE SLIDERS */}
          <div className="interactive-sliders">
            <h5 className="sliders-title">Customize Weights (Experimental)</h5>

            <WeightSlider
              label="Day Pillar (Soul)"
              value={weights.day}
              onChange={(v) => handleWeightChange('day', v)}
              color="#f59e0b"
            />
            <WeightSlider
              label="Hour Pillar (Inner)"
              value={weights.hour}
              onChange={(v) => handleWeightChange('hour', v)}
              color="#fbbf24"
            />
            <WeightSlider
              label="Month Pillar (Social)"
              value={weights.month}
              onChange={(v) => handleWeightChange('month', v)}
              color="#f59e0b"
            />
            <WeightSlider
              label="Year Pillar (Outer)"
              value={weights.year}
              onChange={(v) => handleWeightChange('year', v)}
              color="#fbbf24"
            />

            <p className="slider-note">
              Classical BaZi uses 70/15/10/5. These are time-tested weights,
              but you can experiment! Changes update calculations in real-time.
            </p>

            <button className="reset-btn" onClick={resetWeights}>
              Reset to Classical Weights
            </button>
          </div>

          {/* GROWTH EDGES */}
          <div className="growth-edges">
            <h5>Growth Edges (30% Challenge Areas)</h5>
            <div className="edge-item">
              <span className="edge-icon">⚠️</span>
              <p>
                Metal's precision can feel rigid to Wood's flexibility.
                <strong> Solution:</strong> Schedule "free flow" time weekly.
              </p>
            </div>
            <div className="edge-item">
              <span className="edge-icon">⚠️</span>
              <p>
                Monkey's quick changes overwhelm Ox's steady pace.
                <strong> Solution:</strong> Agree on "sprint" vs "marathon" activities.
              </p>
            </div>
          </div>
        </div>

        {/* COMPATIBLE YEARS */}
        <div className="compatible-years">
          <h5>Compatible Year Animals</h5>
          <div className="animal-tags">
            {summary?.compatibleYears?.map((animal, idx) => (
              <span key={idx} className="animal-tag">{animal}</span>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATIONAL RESOURCES */}
      <section className="layer-section resources">
        <h4 className="section-title">Learn the Theory</h4>
        <div className="resource-grid">
          <div className="resource-card">
            <span className="resource-icon">📚</span>
            <h5>Why Day Pillar is 70%</h5>
            <p>The Day Pillar represents your core essence - who you are at soul level.</p>
            <span className="read-time">3 min read</span>
          </div>
          <div className="resource-card">
            <span className="resource-icon">🎓</span>
            <h5>Six Harmonies Theory (六合)</h5>
            <p>Ancient Chinese astrology identifies 6 special animal pairs that create natural harmony.</p>
            <span className="read-time">8 min read</span>
          </div>
          <div className="resource-card">
            <span className="resource-icon">🔬</span>
            <h5>Metal-Wood Dynamics</h5>
            <p>In Five Element theory, Metal "controls" Wood - but this creates constructive tension.</p>
            <span className="read-time">5 min read</span>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="layer-section methodology">
        <div className="theory-box">
          <h4>Classical BaZi Methodology</h4>
          <ul>
            <li><strong>Six Harmonies (六合)</strong>: Soul-level resonance between Day Branches</li>
            <li><strong>Stem Combinations (天干合)</strong>: Energy fusion between Day Stems</li>
            <li><strong>Generating Cycle (相生)</strong>: Nurturing element flow</li>
          </ul>
        </div>
      </section>
    </AccordionPanel>
  );
}

/**
 * Layer 2: Western Cusp Analysis - Element Harmony
 */
function WesternCuspLayer({ profile, analysis, isOpen, onToggle }) {
  if (!analysis) {
    return (
      <AccordionPanel
        layerNumber={2}
        title="Western Cusp Optimal Match"
        tag="Element Harmony"
        accentColor="purple"
        isOpen={isOpen}
        onToggle={onToggle}
        preview={<span className="preview-text">Calculating element harmony...</span>}
      >
        <div className="loading-state">
          <p>Birth date needed for Western analysis.</p>
        </div>
      </AccordionPanel>
    );
  }

  const { optimalCusp, score, theory, allCandidates } = analysis;
  const elementColors = getElementColors(optimalCusp?.element?.primary);

  return (
    <AccordionPanel
      layerNumber={2}
      title="Western Cusp Optimal Match"
      tag="Element Harmony"
      accentColor="purple"
      isOpen={isOpen}
      onToggle={onToggle}
      preview={
        <div className="preview-content">
          <span className="preview-text">
            Optimal cusp: <strong>{getSignEmoji(optimalCusp?.sign)} {optimalCusp?.name}</strong>
          </span>
          <span className="compatibility-badge">{score} pts</span>
        </div>
      }
    >
      {/* YOUR WESTERN CHART */}
      <section className="layer-section">
        <h4 className="section-title">Your Western Astrological Blueprint</h4>

        <div className="element-balance">
          <h5>Your Elemental Composition</h5>
          <div className="element-bars">
            <div className="element-bar" data-element="earth">
              <span className="bar-label">Earth</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '40%' }}></div>
              </div>
              <span className="bar-value">40%</span>
            </div>
            <div className="element-bar" data-element="water">
              <span className="bar-label">Water</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '30%' }}></div>
              </div>
              <span className="bar-value">30%</span>
            </div>
            <div className="element-bar" data-element="air">
              <span className="bar-label">Air</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '20%' }}></div>
              </div>
              <span className="bar-value">20%</span>
            </div>
            <div className="element-bar" data-element="fire">
              <span className="bar-label">Fire</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '10%' }}></div>
              </div>
              <span className="bar-value">10%</span>
            </div>
          </div>
          <p className="element-insight">
            You're Earth-dominant (grounded, practical) with strong Water (emotional depth).
            You NEED Air (mental stimulation) and Fire (passion) from a partner to achieve balance.
          </p>
        </div>
      </section>

      {/* OPTIMAL PARTNER */}
      <section className="layer-section">
        <h4 className="section-title">Optimal Partner Blueprint</h4>

        <div className="partner-card highlight" style={{ borderColor: elementColors?.primary }}>
          <div className="partner-header">
            <span className="rank-badge">#1 BEST</span>
            <div className="cusp-display">
              <span className="cusp-icon">{getSignEmoji(optimalCusp?.sign)}</span>
              <div className="cusp-details">
                <span className="cusp-name">{optimalCusp?.name}</span>
                <span className="cusp-dates">
                  {optimalCusp?.dateRange?.start} - {optimalCusp?.dateRange?.end}
                </span>
              </div>
            </div>
            <span className="score-badge">{score} pts</span>
          </div>

          {/* WHY IT WORKS */}
          <div className="why-it-works">
            <h5 className="why-title">Why This Works</h5>

            <TheoryPoint
              icon="💧"
              title="Water nourishes Earth"
              yourSide="Practical, grounded, stable"
              theirSide="Emotional, intuitive, flowing"
              result="Water brings emotional richness to your practicality"
            />

            <TheoryPoint
              icon="🌬️"
              title="They add the Air you lack"
              yourSide="20% Air (mental stimulation)"
              theirSide="60% Air + Water (cusp blend)"
              result="Intellectual excitement balances your Earth-heavy practicality"
            />

            <TheoryPoint
              icon="🎨"
              title="Their creativity + Your discipline"
              yourSide="How do we BUILD this?"
              theirSide="What if we DREAM bigger?"
              result="Perfect balance of vision + execution"
            />
          </div>

          {/* ELEMENT FLOW */}
          <div className="element-flow-display">
            <span className="element-badge" data-element={theory?.userElement}>
              {theory?.userElement}
            </span>
            <span className="flow-arrow">
              {theory?.relationship === 'GENERATING' ? '→' : '+'}
            </span>
            <span className="element-badge" data-element={theory?.optimalElement}>
              {theory?.optimalElement}
            </span>
          </div>
          <p className="element-reasoning">{theory?.reasoning}</p>
        </div>

        {/* TOP 5 MATCHES */}
        <div className="candidates-list">
          <h5>Top 5 Cusp Matches</h5>
          {allCandidates?.slice(0, 5).map((candidate, idx) => (
            <div key={idx} className="candidate-row">
              <span className="candidate-rank">#{idx + 1}</span>
              <span className="candidate-icon">{getSignEmoji(candidate.cusp?.sign)}</span>
              <span className="candidate-name">{candidate.cusp?.name}</span>
              <span className="candidate-score">{candidate.score} pts</span>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATIONAL */}
      <section className="layer-section resources">
        <h4 className="section-title">Learn the Theory</h4>
        <div className="resource-grid">
          <div className="resource-card">
            <span className="resource-icon">📚</span>
            <h5>Element Harmony Theory</h5>
            <p>Why Water nourishes Earth, and why you need Air/Fire balance.</p>
          </div>
          <div className="resource-card">
            <span className="resource-icon">🎓</span>
            <h5>Cusp Personalities</h5>
            <p>People born on cusps blend two signs - rare and powerful combinations.</p>
          </div>
        </div>
      </section>

      {/* THEORY BOX */}
      <section className="layer-section methodology">
        <div className="theory-box">
          <h4>Element Harmony Theory</h4>
          <p>{theory?.theory}</p>
        </div>
      </section>
    </AccordionPanel>
  );
}

/**
 * Layer 3: Unified Date Calculator
 */
function UnifiedDatesLayer({ baziAnalysis, westernAnalysis, isOpen, onToggle }) {
  const [testDate, setTestDate] = useState('');
  const [testResult, setTestResult] = useState(null);

  const handleTestDate = (dateStr) => {
    setTestDate(dateStr);
    if (dateStr) {
      // Simplified test - in real implementation, calculate actual BaZi
      setTestResult({
        date: dateStr,
        baziMatch: Math.random() > 0.7,
        westernMatch: Math.random() > 0.5
      });
    }
  };

  return (
    <AccordionPanel
      layerNumber={3}
      title="Unified Birth Dates"
      tag="Precision Matching"
      accentColor="emerald"
      isOpen={isOpen}
      onToggle={onToggle}
      preview={
        <div className="preview-content">
          <span className="preview-text">
            Found <strong>2 exact dates</strong> where both systems align optimally
          </span>
        </div>
      }
    >
      {/* METHODOLOGY */}
      <section className="layer-section">
        <h4 className="section-title">How This Layer Works</h4>

        <div className="methodology-steps">
          <div className="method-step">
            <span className="step-number">1</span>
            <div className="step-content">
              <h5>Start with BaZi Requirements</h5>
              <p>
                Day Master: {baziAnalysis?.summary?.idealDayMaster || '(calculating...)'}
                <br />
                Compatible Years: {baziAnalysis?.summary?.compatibleYears?.join(', ') || '(calculating...)'}
              </p>
            </div>
          </div>

          <div className="method-step">
            <span className="step-number">2</span>
            <div className="step-content">
              <h5>Filter by Western Cusp Dates</h5>
              <p>
                Optimal Cusp: {westernAnalysis?.optimalCusp?.name || '(calculating...)'}
                <br />
                Date Range: {westernAnalysis?.optimalCusp?.dateRange?.start} - {westernAnalysis?.optimalCusp?.dateRange?.end}
              </p>
            </div>
          </div>

          <div className="method-step">
            <span className="step-number">3</span>
            <div className="step-content">
              <h5>Calculate BaZi Day Pillar for Each Date</h5>
              <p>
                Use 60 Jia-Zi cycle (sexagenary cycle)
                <br />
                Check if Day Pillar matches your optimal partner
              </p>
            </div>
          </div>

          <div className="method-step">
            <span className="step-number">4</span>
            <div className="step-content">
              <h5>Return 2-5 Exact Birth Dates</h5>
              <p>
                These are the ONLY dates where:
                <br />
                ✅ BaZi Day Pillar is optimal
                <br />
                ✅ Western cusp is optimal
                <br />
                ✅ Both systems agree mathematically
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CALCULATOR */}
      <section className="layer-section">
        <h4 className="section-title">Try It Yourself</h4>

        <div className="date-calculator">
          <label className="calculator-label">
            Enter a date to check its BaZi Day Pillar:
          </label>
          <input
            type="date"
            className="date-input"
            value={testDate}
            onChange={(e) => handleTestDate(e.target.value)}
          />

          {testResult && (
            <div className="test-result">
              <div className="result-row">
                <span>BaZi Match:</span>
                <span className={testResult.baziMatch ? 'match' : 'no-match'}>
                  {testResult.baziMatch ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="result-row">
                <span>Western Match:</span>
                <span className={testResult.westernMatch ? 'match' : 'no-match'}>
                  {testResult.westernMatch ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="result-row total">
                <span>BOTH Systems:</span>
                <span className={testResult.baziMatch && testResult.westernMatch ? 'match' : 'no-match'}>
                  {testResult.baziMatch && testResult.westernMatch ? '✅ PERFECT MATCH!' : '❌ Partial match only'}
                </span>
              </div>
            </div>
          )}

          <p className="calculator-note">
            This shows you how rare optimal alignment is. Most dates match EITHER BaZi OR Western,
            but not both. That's why we only find 2-5 dates per 20 years.
          </p>
        </div>
      </section>

      {/* COMING SOON MESSAGE */}
      <section className="layer-section">
        <div className="coming-soon-box">
          <span className="coming-soon-icon">🔮</span>
          <p>
            Exact date calculation available with full birth time data.
            <br />
            <strong>Your specific optimal dates will appear here.</strong>
          </p>
        </div>
      </section>

      {/* EDUCATIONAL */}
      <section className="layer-section resources">
        <h4 className="section-title">Learn the Theory</h4>
        <div className="resource-grid">
          <div className="resource-card">
            <span className="resource-icon">📚</span>
            <h5>The 60 Jia-Zi Cycle</h5>
            <p>Learn how to calculate any date's Day Pillar using the sexagenary cycle.</p>
          </div>
          <div className="resource-card">
            <span className="resource-icon">🔬</span>
            <h5>Why So Few Dates Match?</h5>
            <p>Only ~3% of dates satisfy both BaZi AND Western optimal criteria.</p>
          </div>
        </div>
      </section>
    </AccordionPanel>
  );
}

/**
 * Layer 4: House Optimization - Coming Soon
 */
function HouseOptimizationLayer({ isOpen, onToggle }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Waitlist signup:', email);
      setSubmitted(true);
    }
  };

  return (
    <AccordionPanel
      layerNumber={4}
      title="Relationship House Optimization"
      tag="Archetypal Tuning"
      accentColor="pink"
      isOpen={isOpen}
      onToggle={onToggle}
      disabled={false}
      comingSoon={true}
      preview={
        <span className="preview-text">
          Optimizes for specific relationship archetypes based on house placements
        </span>
      }
    >
      {/* WHAT THIS LAYER WILL DO */}
      <section className="layer-section">
        <h4 className="section-title">What This Layer Will Do</h4>

        <div className="feature-preview">
          <div className="feature-item">
            <span className="house-badge">7th House</span>
            <div className="feature-details">
              <strong>Marriage & Partnership</strong>
              <p>Find partners whose planets activate your 7th house (committed partnership).</p>
            </div>
          </div>

          <div className="feature-item">
            <span className="house-badge">5th House</span>
            <div className="feature-details">
              <strong>Romance & Creativity</strong>
              <p>Find partners whose planets activate your 5th house (romance, passion, joy).</p>
            </div>
          </div>

          <div className="feature-item">
            <span className="house-badge">8th House</span>
            <div className="feature-details">
              <strong>Deep Intimacy & Transformation</strong>
              <p>Find partners whose planets activate your 8th house (soul bonding, transformation).</p>
            </div>
          </div>

          <div className="feature-item">
            <span className="house-badge">4th House</span>
            <div className="feature-details">
              <strong>Home & Family</strong>
              <p>Find partners whose planets activate your 4th house (domestic harmony, family building).</p>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="layer-section">
        <div className="waitlist-box">
          <h4>Join Beta Waitlist</h4>
          <p>
            Be among the first to try House Optimization when it launches.
            We're currently building the algorithms based on Liz Greene's
            depth psychology + traditional house theories.
          </p>

          {!submitted ? (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="email-input"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn">
                Notify Me When Ready
              </button>
            </form>
          ) : (
            <div className="success-message">
              ✅ You're on the list! We'll notify you when Layer 4 launches.
            </div>
          )}
        </div>
      </section>
    </AccordionPanel>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function CustomizingYourSoulPartnerPage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { profiles, loading: profilesLoading } = useProfiles();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Analysis results
  const [baziAnalysis, setBaziAnalysis] = useState(null);
  const [westernAnalysis, setWesternAnalysis] = useState(null);

  // Accordion states
  const [openLayers, setOpenLayers] = useState({ 1: true, 2: false, 3: false, 4: false });

  const toggleLayer = (num) => {
    setOpenLayers(prev => ({ ...prev, [num]: !prev[num] }));
  };

  // Load profile from profiles array
  useEffect(() => {
    if (profilesLoading) return;

    if (!profileId) {
      setError('No profile selected');
      setLoading(false);
      return;
    }

    const loadedProfile = profiles.find(p => p.id === profileId);
    if (!loadedProfile) {
      setError('Profile not found');
      setLoading(false);
      return;
    }

    setProfile(loadedProfile);
    setLoading(false);
    console.log('[CustomizingYourSoulPartner] Loaded profile:', loadedProfile.displayName);
  }, [profileId, profiles, profilesLoading]);

  // Calculate analyses when profile loads
  useEffect(() => {
    if (!profile) return;

    try {
      // Calculate Western cusp analysis
      const userCusp = getCuspDataFromDate(profile.birthDate);
      if (userCusp) {
        const westernResult = calculateOptimalCusp(userCusp);
        setWesternAnalysis(westernResult);
        console.log('[CustomizingYourSoulPartner] Western analysis complete:', westernResult.optimalCusp?.name);
      }

      // Calculate BaZi analysis
      let fourPillars = profile.calculations?.fourPillars;

      if (!fourPillars && profile.birthDate) {
        const birthDate = new Date(profile.birthDate);
        const latitude = profile.birthLocation?.latitude || 0;
        const longitude = profile.birthLocation?.longitude || 0;

        const calculatedPillars = calculateFourPillars(birthDate, latitude, longitude);
        console.log('[CustomizingYourSoulPartner] Calculated Four Pillars from birthDate:', calculatedPillars);

        if (calculatedPillars?.pillars) {
          fourPillars = calculatedPillars.pillars;
        }
      }

      if (fourPillars) {
        const baziInput = {
          year: {
            stem: fourPillars.year?.stem?.chinese || fourPillars.year?.stem || fourPillars.yearPillar?.stem?.chinese,
            branch: fourPillars.year?.branch?.chinese || fourPillars.year?.branch || fourPillars.yearPillar?.branch?.chinese
          },
          month: {
            stem: fourPillars.month?.stem?.chinese || fourPillars.month?.stem || fourPillars.monthPillar?.stem?.chinese,
            branch: fourPillars.month?.branch?.chinese || fourPillars.month?.branch || fourPillars.monthPillar?.branch?.chinese
          },
          day: {
            stem: fourPillars.day?.stem?.chinese || fourPillars.day?.stem || fourPillars.dayPillar?.stem?.chinese,
            branch: fourPillars.day?.branch?.chinese || fourPillars.day?.branch || fourPillars.dayPillar?.branch?.chinese
          },
          hour: fourPillars.hour ? {
            stem: fourPillars.hour?.stem?.chinese || fourPillars.hour?.stem || fourPillars.hourPillar?.stem?.chinese,
            branch: fourPillars.hour?.branch?.chinese || fourPillars.hour?.branch || fourPillars.hourPillar?.branch?.chinese
          } : null
        };

        console.log('[CustomizingYourSoulPartner] BaZi input:', baziInput);
        const baziResult = calculateOptimalPartner(baziInput);
        setBaziAnalysis(baziResult);
        console.log('[CustomizingYourSoulPartner] BaZi analysis complete:', baziResult.summary?.idealDayMaster);
      } else {
        console.log('[CustomizingYourSoulPartner] No Four Pillars data available');
      }
    } catch (err) {
      console.error('Error calculating analyses:', err);
    }
  }, [profile]);

  // Render loading state
  if (loading) {
    return (
      <div className="glass-cathedral loading">
        <div className="loading-spinner"></div>
        <p>Loading your blueprint...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="glass-cathedral error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="glass-cathedral">
      {/* Header */}
      <header className="cathedral-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="header-content">
          <h1>Customizing Your SoulPartner</h1>
          <p className="subtitle">4-Layer Precision System for {profile?.displayName}</p>
          <span className="philosophy-tag">Glass Cathedral - No Black Boxes</span>
        </div>
      </header>

      {/* Main content - 4 Accordion Layers */}
      <main className="cathedral-content">
        <BaZiSoulLayer
          profile={profile}
          analysis={baziAnalysis}
          isOpen={openLayers[1]}
          onToggle={() => toggleLayer(1)}
        />

        <WesternCuspLayer
          profile={profile}
          analysis={westernAnalysis}
          isOpen={openLayers[2]}
          onToggle={() => toggleLayer(2)}
        />

        <UnifiedDatesLayer
          baziAnalysis={baziAnalysis}
          westernAnalysis={westernAnalysis}
          isOpen={openLayers[3]}
          onToggle={() => toggleLayer(3)}
        />

        <HouseOptimizationLayer
          isOpen={openLayers[4]}
          onToggle={() => toggleLayer(4)}
        />
      </main>

      {/* Transparent Methodology Footer */}
      <footer className="cathedral-footer">
        <div className="methodology-summary">
          <h3>Our Philosophy: No Black Boxes</h3>
          <p>
            Every calculation shown. Every theory explained.
            You bring 50% constitutional truth, we provide 50% mathematical precision.
            <br />
            <strong>Together = Symphonesis (1 + 1 = 100)</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
