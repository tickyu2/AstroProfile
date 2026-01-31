/**
 * Western Astrology AI Analysis Panel
 * 
 * Matches Numerology panel structure with 5 tabs:
 * 1. Overview - Synthesis of Sun/Moon/Rising
 * 2. Planets - Expandable panels for each planet
 * 3. Aspects - Planetary relationships
 * 4. Transits - Current cosmic weather (future)
 * 5. AI Insights - Constitutional synthesis
 * 
 * Built for GENESIS AstroProfile
 * January 4, 2026
 */

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Heart, MessageCircle, Zap } from 'lucide-react';
import { generateWesternAIAnalysis } from '../services/westernAstrologyAIService';

export default function WesternAstrologyPanel({ profile }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedPlanet, setExpandedPlanet] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Extract Western data from profile
  const western = profile?.calculations?.western || {};
  const sun = western.sun || {};
  const moon = western.moon || {};
  const rising = western.rising || {};
  const planets = western.planets || {};
  const aspects = western.aspects || {};
  const elementBalance = western.elementBalance || {};

  // Generate synthesis name (like "The Nurturer")
  const getSynthesisName = () => {
    const sunSign = sun.sign;
    const moonSign = moon.sign;
    const risingSign = rising.sign;
    
    // Simple logic - can be enhanced with AI
    const earthDominant = elementBalance.earth > 50;
    const waterLow = elementBalance.water < 10;
    
    if (earthDominant && waterLow) {
      return "The Grounded Builder";
    }
    // Add more patterns...
    return "The Earth Sage";
  };

  // Load AI analysis
  useEffect(() => {
    const loadAIAnalysis = async () => {
      if (western && !aiAnalysis) {
        setLoading(true);
        try {
          const analysis = await generateWesternAIAnalysis(profile);
          setAiAnalysis(analysis);
        } catch (error) {
          console.error('AI Analysis error:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadAIAnalysis();
  }, [profile]);

  return (
    <div className="western-astrology-panel">
      {/* Header - matches Numerology */}
      <div className="panel-header">
        <button onClick={() => window.history.back()} className="back-button">
          ← Back
        </button>
        <h1>Your Astrological Blueprint</h1>
        <p className="subtitle">{profile.displayName}</p>
      </div>

      {/* Quick badges - like Numerology's Life Path 6, etc. */}
      <div className="quick-badges">
        <span className="badge sun-badge">Sun {sun.sign}</span>
        <span className="badge moon-badge">Moon {moon.sign}</span>
        <span className="badge rising-badge">Rising {rising.sign}</span>
        <span className="badge element-badge">
          {elementBalance.earth > 50 ? 'Earth' : 
           elementBalance.fire > 50 ? 'Fire' :
           elementBalance.water > 50 ? 'Water' : 'Air'} Dominant
        </span>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          ⭐ Overview
        </button>
        <button 
          className={activeTab === 'planets' ? 'active' : ''}
          onClick={() => setActiveTab('planets')}
        >
          🪐 Planets
        </button>
        <button 
          className={activeTab === 'aspects' ? 'active' : ''}
          onClick={() => setActiveTab('aspects')}
        >
          ◊ Aspects
        </button>
        <button 
          className={activeTab === 'transits' ? 'active' : ''}
          onClick={() => setActiveTab('transits')}
        >
          🌙 Transits
        </button>
        <button 
          className={activeTab === 'ai-insights' ? 'active' : ''}
          onClick={() => setActiveTab('ai-insights')}
        >
          🧠 AI Insights
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <OverviewTab 
            sun={sun}
            moon={moon}
            rising={rising}
            elementBalance={elementBalance}
            synthesisName={getSynthesisName()}
            aiAnalysis={aiAnalysis}
          />
        )}

        {activeTab === 'planets' && (
          <PlanetsTab 
            sun={sun}
            moon={moon}
            rising={rising}
            planets={planets}
            expandedPlanet={expandedPlanet}
            setExpandedPlanet={setExpandedPlanet}
            aiAnalysis={aiAnalysis}
          />
        )}

        {activeTab === 'aspects' && (
          <AspectsTab 
            aspects={aspects}
            aiAnalysis={aiAnalysis}
          />
        )}

        {activeTab === 'transits' && (
          <TransitsTab profile={profile} />
        )}

        {activeTab === 'ai-insights' && (
          <AIInsightsTab 
            profile={profile}
            aiAnalysis={aiAnalysis}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// OVERVIEW TAB
// ============================================
function OverviewTab({ sun, moon, rising, elementBalance, synthesisName, aiAnalysis }) {
  return (
    <div className="overview-tab">
      {/* Synthesis Header - like "The Nurturer" */}
      <div className="synthesis-header">
        <h2>{synthesisName}</h2>
        <p className="synthesis-subtitle">
          Sun {sun.sign} • Moon {moon.sign} • Rising {rising.sign}
        </p>
      </div>

      {/* Trinity Cards */}
      <div className="trinity-grid">
        <div className="trinity-card sun-card">
          <div className="card-icon">☀️</div>
          <h3>SUN</h3>
          <p className="card-sign">{sun.sign}</p>
          <p className="card-subtitle">Your Core Self</p>
        </div>

        <div className="trinity-card moon-card">
          <div className="card-icon">🌙</div>
          <h3>MOON</h3>
          <p className="card-sign">{moon.sign}</p>
          <p className="card-subtitle">Your Inner World</p>
        </div>

        <div className="trinity-card rising-card">
          <div className="card-icon">⬆️</div>
          <h3>RISING</h3>
          <p className="card-sign">{rising.sign}</p>
          <p className="card-subtitle">Your Outer Self</p>
        </div>
      </div>

      {/* Key Themes - like Numerology panel */}
      <div className="key-themes">
        <h3>🎯 Key Themes in Your Chart</h3>
        <div className="themes-grid">
          <div className="theme-item">
            <h4>Your Core Identity (Sun {sun.sign})</h4>
            <p>{aiAnalysis?.coreIdentity?.essence || 'Loading AI analysis...'}</p>
          </div>
          <div className="theme-item">
            <h4>Your Emotional Nature (Moon {moon.sign})</h4>
            <p>{aiAnalysis?.emotionalNature?.summary || 'Loading AI analysis...'}</p>
          </div>
        </div>
      </div>

      {/* Elemental Dominance */}
      <div className="elemental-dominance">
        <h3>🌍 Elemental Dominance</h3>
        <div className="element-bars">
          {Object.entries(elementBalance).map(([element, percentage]) => (
            <div key={element} className="element-bar">
              <span className="element-label">{element}</span>
              <div className="bar-container">
                <div 
                  className={`bar bar-${element.toLowerCase()}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="element-value">{percentage}%</span>
            </div>
          ))}
        </div>
        <p className="element-interpretation">
          {aiAnalysis?.elementalInterpretation || 
           `With ${Math.max(...Object.values(elementBalance))}% ${
             Object.keys(elementBalance).find(k => elementBalance[k] === Math.max(...Object.values(elementBalance)))
           } dominance, you are profoundly grounded in tangible reality.`}
        </p>
      </div>
    </div>
  );
}

// ============================================
// PLANETS TAB
// ============================================
function PlanetsTab({ sun, moon, rising, planets, expandedPlanet, setExpandedPlanet, aiAnalysis }) {
  const planetData = {
    sun: {
      name: 'Sun',
      sign: sun.sign,
      icon: '☀️',
      title: 'Your Core Self',
      color: 'sun',
      ...aiAnalysis?.planets?.sun
    },
    moon: {
      name: 'Moon',
      sign: moon.sign,
      icon: '🌙',
      title: 'Your Emotional Nature',
      color: 'moon',
      ...aiAnalysis?.planets?.moon
    },
    rising: {
      name: 'Rising',
      sign: rising.sign,
      icon: '⬆️',
      title: 'Your Outer Personality',
      color: 'rising',
      ...aiAnalysis?.planets?.rising
    },
    mercury: {
      name: 'Mercury',
      sign: planets.mercury?.sign,
      icon: '💬',
      title: 'Your Communication Style',
      color: 'mercury',
      ...aiAnalysis?.planets?.mercury
    },
    venus: {
      name: 'Venus',
      sign: planets.venus?.sign,
      icon: '❤️',
      title: 'Your Love Style',
      color: 'venus',
      ...aiAnalysis?.planets?.venus
    },
    mars: {
      name: 'Mars',
      sign: planets.mars?.sign,
      icon: '⚔️',
      title: 'Your Drive & Passion',
      color: 'mars',
      ...aiAnalysis?.planets?.mars
    },
    jupiter: {
      name: 'Jupiter',
      sign: planets.jupiter?.sign,
      icon: '🎯',
      title: 'Your Growth & Expansion',
      color: 'jupiter',
      ...aiAnalysis?.planets?.jupiter
    },
    saturn: {
      name: 'Saturn',
      sign: planets.saturn?.sign,
      icon: '⏳',
      title: 'Your Structure & Discipline',
      color: 'saturn',
      ...aiAnalysis?.planets?.saturn
    }
  };

  return (
    <div className="planets-tab">
      <p className="tab-instruction">Click each panel to expand and explore the full interpretation</p>

      {Object.entries(planetData).map(([key, planet]) => (
        <PlanetPanel
          key={key}
          planetKey={key}
          planet={planet}
          expanded={expandedPlanet === key}
          onToggle={() => setExpandedPlanet(expandedPlanet === key ? null : key)}
        />
      ))}
    </div>
  );
}

function PlanetPanel({ planetKey, planet, expanded, onToggle }) {
  return (
    <div className={`planet-panel planet-${planet.color} ${expanded ? 'expanded' : ''}`}>
      <div className="planet-header" onClick={onToggle}>
        <div className="planet-title">
          <span className="planet-icon">{planet.icon}</span>
          <div>
            <h3>{planet.name} in {planet.sign}</h3>
            <p>{planet.title}</p>
          </div>
        </div>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {expanded && (
        <div className="planet-content">
          {/* Core Essence */}
          <div className="content-section">
            <h4>🌟 Core Essence</h4>
            <p>{planet.coreEssence || 'AI analysis loading...'}</p>
          </div>

          {/* Mission/Purpose */}
          {planet.mission && (
            <div className="content-section">
              <h4>🎯 {planet.name === 'Sun' ? 'Life Mission' : 
                       planet.name === 'Moon' ? 'Emotional Needs' :
                       planet.name === 'Venus' ? 'Love Mission' : 'Purpose'}</h4>
              <p>{planet.mission}</p>
            </div>
          )}

          {/* Strengths & Challenges */}
          <div className="strengths-challenges">
            <div className="strengths">
              <h4>💪 Strengths</h4>
              <ul>
                {(planet.strengths || []).map((strength, i) => (
                  <li key={i}>✓ {strength}</li>
                ))}
              </ul>
            </div>
            <div className="challenges">
              <h4>⚡ Challenges</h4>
              <ul>
                {(planet.challenges || []).map((challenge, i) => (
                  <li key={i}>! {challenge}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Specific sections based on planet */}
          {planet.name === 'Venus' && (
            <div className="content-section">
              <h4>❤️ Relationship Style</h4>
              <p>{planet.relationshipStyle}</p>
            </div>
          )}

          {planet.name === 'Mercury' && (
            <div className="content-section">
              <h4>💬 Communication Preferences</h4>
              <p>{planet.communicationStyle}</p>
            </div>
          )}

          {planet.name === 'Mars' && (
            <div className="content-section">
              <h4>⚔️ Conflict Resolution</h4>
              <p>{planet.conflictStyle}</p>
            </div>
          )}

          {/* Shadow Side */}
          {planet.shadowSide && (
            <div className="content-section shadow">
              <h4>🌑 Shadow Side</h4>
              <p>{planet.shadowSide}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// ASPECTS TAB
// ============================================
function AspectsTab({ aspects, aiAnalysis }) {
  const aspectTypes = {
    harmonious: aspects.filter(a => a.type === 'Harmonious'),
    challenging: aspects.filter(a => a.type === 'Challenging'),
    neutral: aspects.filter(a => a.type === 'Neutral')
  };

  return (
    <div className="aspects-tab">
      <div className="aspects-intro">
        <h2>Planetary Connections</h2>
        <p>How the planets in your chart work together</p>
      </div>

      {/* Number of aspects */}
      <div className="aspects-summary">
        <div className="aspect-count harmonious">
          <span className="count">{aspectTypes.harmonious.length}</span>
          <span className="label">Harmonious</span>
        </div>
        <div className="aspect-count challenging">
          <span className="count">{aspectTypes.challenging.length}</span>
          <span className="label">Challenging</span>
        </div>
        <div className="aspect-count neutral">
          <span className="count">{aspectTypes.neutral.length}</span>
          <span className="label">Neutral</span>
        </div>
      </div>

      {/* Harmonious Aspects */}
      <div className="aspect-section">
        <h3 className="section-title harmonious">✨ Harmonious Aspects (Gifts & Talents)</h3>
        {aspectTypes.harmonious.map((aspect, i) => (
          <AspectCard key={i} aspect={aspect} aiAnalysis={aiAnalysis} />
        ))}
      </div>

      {/* Challenging Aspects */}
      <div className="aspect-section">
        <h3 className="section-title challenging">⚡ Challenging Aspects (Growth Areas)</h3>
        {aspectTypes.challenging.map((aspect, i) => (
          <AspectCard key={i} aspect={aspect} aiAnalysis={aiAnalysis} />
        ))}
      </div>

      {/* Neutral Aspects */}
      {aspectTypes.neutral.length > 0 && (
        <div className="aspect-section">
          <h3 className="section-title neutral">◊ Neutral Aspects</h3>
          {aspectTypes.neutral.map((aspect, i) => (
            <AspectCard key={i} aspect={aspect} aiAnalysis={aiAnalysis} />
          ))}
        </div>
      )}
    </div>
  );
}

function AspectCard({ aspect, aiAnalysis }) {
  const [expanded, setExpanded] = useState(false);
  const [planet1, planet2] = aspect.planets;

  return (
    <div className={`aspect-card aspect-${aspect.type.toLowerCase()}`}>
      <div className="aspect-header" onClick={() => setExpanded(!expanded)}>
        <div className="aspect-title">
          <span className="planets">{planet1} {aspect.aspect} {planet2}</span>
          <span className="orb">{aspect.orb}</span>
        </div>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {expanded && (
        <div className="aspect-content">
          <p className="aspect-interpretation">
            {aiAnalysis?.aspects?.[`${planet1}-${planet2}`] || 
             `${planet1} and ${planet2} form a ${aspect.aspect}, creating ${
               aspect.type === 'Harmonious' ? 'harmony' : 
               aspect.type === 'Challenging' ? 'dynamic tension' : 'neutral energy'
             } in your chart.`}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// TRANSITS TAB
// ============================================
function TransitsTab({ profile }) {
  return (
    <div className="transits-tab">
      <div className="coming-soon">
        <h2>🌙 Current Cosmic Weather</h2>
        <p>Transit tracking coming soon!</p>
        <p className="note">This will show how current planetary movements affect your chart.</p>
      </div>
    </div>
  );
}

// ============================================
// AI INSIGHTS TAB
// ============================================
function AIInsightsTab({ profile, aiAnalysis, loading }) {
  if (loading) {
    return (
      <div className="ai-insights-tab loading">
        <Sparkles className="loading-icon" />
        <p>Generating constitutional synthesis...</p>
      </div>
    );
  }

  return (
    <div className="ai-insights-tab">
      {/* Header */}
      <div className="insights-header">
        <h2>Constitutional Synthesis</h2>
        <p>Where All Systems Point to the Same Truth</p>
      </div>

      <p className="insights-intro">
        When astrology and other systems independently reveal the same patterns, 
        you're seeing constitutional truths - the deep architecture of your soul.
      </p>

      {/* Pattern Convergence - like Numerology */}
      <div className="pattern-convergence">
        <h3>🎯 Pattern Convergence</h3>
        <div className="convergence-stats">
          <div className="stat">
            <span className="number">{aiAnalysis?.convergence?.systemsCount || 2}</span>
            <span className="label">Systems Available</span>
          </div>
          <div className="stat">
            <span className="number">{aiAnalysis?.convergence?.pointsCount || 3}</span>
            <span className="label">Convergence Points</span>
          </div>
          <div className="stat">
            <span className="number">{aiAnalysis?.convergence?.clarity || '75%'}</span>
            <span className="label">Constitutional Clarity</span>
          </div>
        </div>
        <p className="convergence-note">
          Higher convergence indicates stronger constitutional patterns across different systems
        </p>
      </div>

      {/* Cross-System Synthesis */}
      {profile.mbti && (
        <div className="cross-system">
          <h3>🧬 Astrology + MBTI</h3>
          <p className="system-connection">
            Your {profile.mbti} type interacts uniquely with your astrological signature, 
            creating your personal style of engagement with the world.
          </p>
          <div className="mbti-astrology-grid">
            <div className="grid-item">
              <h4>Extroversion</h4>
              <div className="bar">
                <div className="fill" style={{ width: '60%' }} />
              </div>
              <span>Moderate</span>
            </div>
            {/* Add more MBTI dimensions */}
          </div>
        </div>
      )}

      {/* Constitutional Themes */}
      <div className="constitutional-themes">
        <h3>📖 Your Constitutional Themes</h3>
        <div className="theme-card">
          <div className="theme-icon">💙</div>
          <div className="theme-content">
            <h4>{aiAnalysis?.themes?.primary?.title || 'Deep Sensitivity & Empathy'}</h4>
            <p>{aiAnalysis?.themes?.primary?.description || 
                'Your chart reveals a deeply sensitive inner nature. You feel deeply and have strong intuitive gifts.'}</p>
          </div>
          <span className="systems-badge">2 systems</span>
        </div>
      </div>

      {/* AI Constitutional Reading - THE BIG ONE */}
      <div className="ai-reading">
        <h3>✨ AI Constitutional Reading</h3>
        <div className="reading-content">
          <p>
            {aiAnalysis?.constitutionalReading || 
             `At your core, you are The Earth Builder - a soul designed to create lasting 
              structures with patient wisdom. Your Taurus Sun and Rising, combined with 
              Capricorn Moon, reveals someone who grounds higher wisdom into tangible form. 
              The 75% Earth dominance means you're profoundly oriented toward manifest 
              reality, valuing what can be touched, built, and left as legacy. This is 
              your constitutional truth - the deep architecture of your soul that remains 
              constant across systems of understanding.`}
          </p>
        </div>
        <p className="reading-note">
          <em>This synthesis draws patterns from astrology and MBTI to reveal your constitutional 
          truth. When multiple systems agree, you're seeing the deep architecture of who you are.</em>
        </p>
      </div>

      {/* Missing Systems Notice */}
      {(!profile.calculations?.fourPillars || !profile.big5) && (
        <div className="missing-systems">
          <p>
            Add more profile data to unlock deeper cross-system insights. Missing:{' '}
            {!profile.calculations?.fourPillars && 'BaZi/Four Pillars. '}
            {!profile.big5 && 'Big Five Personality.'}
          </p>
        </div>
      )}
    </div>
  );
}
