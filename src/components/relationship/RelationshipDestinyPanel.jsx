/**
 * Relationship Destiny Panel
 * ==========================
 *
 * The Cathedral Scroll of the Relationship OS
 * Multi-chapter interface for Soul Map, Timeline, Evolution, and Healing
 *
 * Features:
 * - Mythic headers with ritualized animations
 * - Tab-based chapter navigation
 * - Fade + slide transitions between chapters
 * - Luna wisdom integration
 * - Quick access sidebar
 */

import React, { useState, useEffect } from 'react';
import './RelationshipDestinyPanel.css';

// Chapter Icons (can be replaced with custom SVGs)
const CHAPTER_ICONS = {
  soul: '\u2726',      // ✦
  timeline: '\u29D6',  // ⧖
  evolution: '\u221E', // ∞
  healing: '\u2661'    // ♡
};

// Chapter metadata
const CHAPTER_META = {
  soul: {
    title: 'Soul Map',
    subtitle: 'The Unified Terrain of Your Bond',
    color: 'var(--soul-color, #9b59b6)'
  },
  timeline: {
    title: 'Timeline',
    subtitle: 'Seasons, Transits & Fate Windows',
    color: 'var(--timeline-color, #3498db)'
  },
  evolution: {
    title: 'Evolution',
    subtitle: 'Archetype Metamorphosis Across Saturn Cycles',
    color: 'var(--evolution-color, #e67e22)'
  },
  healing: {
    title: 'Healing',
    subtitle: 'Luna-Guided Repair & Restoration',
    color: 'var(--healing-color, #27ae60)'
  }
};

/**
 * Soul Map Chapter Content
 */
function SoulMapChapter({ soulMap, identity, shadow, contract, fateThreads }) {
  return (
    <div className="chapter-content soul-chapter">
      {/* Identity Section */}
      <section className="chapter-section">
        <h3 className="section-header">
          <span className="section-icon">\u2609</span>
          Relationship Identity
        </h3>
        {identity && (
          <div className="identity-grid">
            <div className="identity-card">
              <span className="card-label">Composite Sun</span>
              <span className="card-value">{identity.compositeSun?.sign}</span>
              <p className="card-meaning">{identity.compositeSun?.meaning}</p>
            </div>
            <div className="identity-card">
              <span className="card-label">Composite Moon</span>
              <span className="card-value">{identity.compositeMoon?.sign}</span>
              <p className="card-meaning">{identity.compositeMoon?.meaning}</p>
            </div>
            {identity.elementalBalance && (
              <div className="identity-card elemental">
                <span className="card-label">Elemental Balance</span>
                <div className="element-bars">
                  {Object.entries(identity.elementalBalance).map(([element, value]) => (
                    <div key={element} className={`element-bar ${element.toLowerCase()}`}>
                      <span className="element-name">{element}</span>
                      <div className="bar-fill" style={{ width: `${value}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Shadow Section */}
      {shadow && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u263D</span>
            Relationship Shadow
          </h3>
          <div className="shadow-content">
            {shadow.collectiveShadow && (
              <div className="shadow-card">
                <span className="shadow-label">Collective Shadow</span>
                <p className="shadow-description">{shadow.collectiveShadow.description}</p>
              </div>
            )}
            {shadow.integrationPath && (
              <div className="integration-path">
                <span className="path-label">Integration Path</span>
                <ol className="path-steps">
                  {Object.values(shadow.integrationPath).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contract Section */}
      {contract && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u2696</span>
            Soul Contract
          </h3>
          <div className="contract-grid">
            {contract.soulLessons && (
              <div className="contract-card">
                <span className="contract-label">Soul Lessons</span>
                <ul className="contract-list">
                  {contract.soulLessons.map((lesson, i) => (
                    <li key={i}>{lesson}</li>
                  ))}
                </ul>
              </div>
            )}
            {contract.sharedStrengths && (
              <div className="contract-card strengths">
                <span className="contract-label">Shared Strengths</span>
                <ul className="contract-list">
                  {contract.sharedStrengths.map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Fate Threads Section */}
      {fateThreads && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u2605</span>
            Fate Threads
          </h3>
          <div className="fate-content">
            {fateThreads.compositeFate && (
              <div className="fate-card">
                <span className="fate-label">Destiny Direction</span>
                <p>{fateThreads.compositeFate.destiny || fateThreads.compositeFate.description}</p>
              </div>
            )}
            <div className="fate-intensity">
              <span className="intensity-label">Fate Intensity</span>
              <span className={`intensity-value ${(fateThreads.fateIntensity || '').toLowerCase().replace(' ', '-')}`}>
                {fateThreads.fateIntensity || 'Significant'}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Timeline Chapter Content
 */
function TimelineChapter({ timeline, currentSeason, fateWindows, transits }) {
  return (
    <div className="chapter-content timeline-chapter">
      {/* Current Season */}
      {currentSeason && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u2600</span>
            Current Season
          </h3>
          <div className="season-card">
            <div className="season-header">
              <span className="season-type">{currentSeason.type} Season</span>
              <span className="season-planet">{currentSeason.planet}</span>
            </div>
            <p className="season-theme">{currentSeason.theme}</p>
            <p className="season-meaning">{currentSeason.meaning}</p>
            {currentSeason.lunaGuidance && (
              <div className="luna-guidance">
                <span className="luna-icon">\u263D</span>
                <p>{currentSeason.lunaGuidance}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Active Fate Windows */}
      {fateWindows && fateWindows.length > 0 && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u2736</span>
            Active Fate Windows
          </h3>
          <div className="fate-windows-list">
            {fateWindows.map((window, i) => (
              <div key={i} className="fate-window-card">
                <span className="window-name">{window.name}</span>
                <p className="window-meaning">{window.meaning}</p>
                {window.opportunity && (
                  <p className="window-opportunity">
                    <strong>Opportunity:</strong> {window.opportunity}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Current Transits */}
      {transits && transits.length > 0 && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u2192</span>
            Current Transits
          </h3>
          <div className="transits-list">
            {transits.map((transit, i) => (
              <div key={i} className="transit-card">
                <div className="transit-header">
                  <span className="transit-aspect">{transit.transitPlanet} {transit.aspectType} {transit.natalPoint}</span>
                </div>
                <p className="transit-meaning">{transit.meaning}</p>
                {transit.duration && (
                  <span className="transit-duration">{transit.duration}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Evolution Chapter Content
 */
function EvolutionChapter({ evolution, currentStage, mythicArc, evolutionTimeline }) {
  return (
    <div className="chapter-content evolution-chapter">
      {/* Current Stage */}
      {currentStage && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u2726</span>
            Current Evolution Stage
          </h3>
          <div className="stage-card current">
            <div className="stage-header">
              <span className="stage-title">{currentStage.title}</span>
              <span className="stage-archetype">{currentStage.archetype}</span>
            </div>
            <div className="stage-meta">
              <span className="stage-myth">{currentStage.myth}</span>
              <span className="stage-phase">{currentStage.saturnPhase}</span>
            </div>
            <div className="stage-content">
              <div className="stage-task">
                <strong>Psychological Task:</strong>
                <p>{currentStage.psychologicalTask}</p>
              </div>
              <div className="stage-themes">
                <div className="growth-theme">
                  <span className="theme-label">Growth Theme</span>
                  <p>{currentStage.growthTheme}</p>
                </div>
                <div className="shadow-theme">
                  <span className="theme-label">Shadow Theme</span>
                  <p>{currentStage.shadowTheme}</p>
                </div>
              </div>
            </div>
            {currentStage.yearsInStage !== undefined && (
              <div className="stage-progress">
                <span>Year {Math.floor(currentStage.yearsInStage)} of this stage</span>
                {currentStage.yearsUntilNextStage && (
                  <span>{currentStage.yearsUntilNextStage} years until next stage</span>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Mythic Arc */}
      {mythicArc && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u221E</span>
            Mythic Arc
          </h3>
          <div className="mythic-arc-card">
            <span className="arc-name">{mythicArc.name}</span>
            <p className="arc-description">{mythicArc.description}</p>
            {mythicArc.currentPhase && (
              <div className="arc-phase">
                <strong>Current Phase:</strong> {mythicArc.currentPhase}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Evolution Timeline */}
      {evolutionTimeline && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u2301</span>
            Evolution Journey
          </h3>
          <div className="evolution-timeline">
            {evolutionTimeline.map((stage, i) => (
              <div
                key={i}
                className={`timeline-stage ${stage.isCurrent ? 'current' : ''} ${stage.isPast ? 'past' : ''} ${stage.isFuture ? 'future' : ''}`}
              >
                <div className="stage-marker" />
                <div className="stage-info">
                  <span className="stage-name">{stage.title}</span>
                  <span className="stage-years">Years {stage.yearRange?.[0]}-{stage.yearRange?.[1]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Crisis Opportunity */}
      {evolution?.crisisOpportunity?.isActive && (
        <section className="chapter-section crisis-section">
          <h3 className="section-header">
            <span className="section-icon">\u26A0</span>
            Active Crisis Point
          </h3>
          <div className="crisis-card">
            <span className="crisis-name">{evolution.crisisOpportunity.crisis}</span>
            <p className="crisis-description">{evolution.crisisOpportunity.description}</p>
            <div className="crisis-opportunity">
              <strong>Opportunity:</strong>
              <p>{evolution.crisisOpportunity.opportunity}</p>
            </div>
            {evolution.crisisOpportunity.lunaGuidance && (
              <div className="luna-guidance">
                <span className="luna-icon">\u263D</span>
                <p>{evolution.crisisOpportunity.lunaGuidance}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Healing Chapter Content
 */
function HealingChapter({ healing, wounds, rituals, frameworks, emergencyToolkit, lunaDialogue }) {
  const [activeRitual, setActiveRitual] = useState(null);

  return (
    <div className="chapter-content healing-chapter">
      {/* Wound Analysis */}
      {wounds && wounds.primaryWounds && wounds.primaryWounds.length > 0 && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u2764</span>
            Wound Patterns
          </h3>
          <div className="wounds-list">
            {wounds.primaryWounds.map((wound, i) => (
              <div key={i} className="wound-card">
                <span className="wound-name">{wound.wound}</span>
                <p className="wound-description">{wound.description}</p>
                {wound.symptoms && (
                  <ul className="wound-symptoms">
                    {wound.symptoms.slice(0, 3).map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                )}
                {wound.lunaHealing && (
                  <div className="luna-guidance wound-healing">
                    <span className="luna-icon">\u263D</span>
                    <p>{wound.lunaHealing}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Repair Rituals */}
      {rituals && rituals.length > 0 && (
        <section className="chapter-section">
          <h3 className="section-header">
            <span className="section-icon">\u2728</span>
            Repair Rituals
          </h3>
          <div className="rituals-list">
            {rituals.map((ritual, i) => (
              <div key={i} className="ritual-card">
                <button
                  className={`ritual-header ${activeRitual === i ? 'expanded' : ''}`}
                  onClick={() => setActiveRitual(activeRitual === i ? null : i)}
                >
                  <span className="ritual-name">{ritual.name}</span>
                  <span className="ritual-toggle">{activeRitual === i ? '\u25B2' : '\u25BC'}</span>
                </button>
                {activeRitual === i && (
                  <div className="ritual-content">
                    <p className="ritual-description">{ritual.description}</p>
                    <span className="ritual-when"><strong>When:</strong> {ritual.when}</span>
                    {ritual.steps && (
                      <ol className="ritual-steps">
                        {ritual.steps.map((step, j) => (
                          <li key={j}>
                            <strong>{step.name}</strong>
                            {step.duration && <span className="step-duration">({step.duration})</span>}
                            <p>{step.instruction}</p>
                          </li>
                        ))}
                      </ol>
                    )}
                    {ritual.lunaGuidance && (
                      <div className="luna-guidance">
                        <span className="luna-icon">\u263D</span>
                        <p>{ritual.lunaGuidance}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Emergency Toolkit */}
      {emergencyToolkit && (
        <section className="chapter-section emergency-section">
          <h3 className="section-header">
            <span className="section-icon">\u26A1</span>
            Emergency Toolkit
          </h3>
          <div className="emergency-grid">
            {emergencyToolkit.inConflict && (
              <div className="emergency-card">
                <span className="emergency-label">In Conflict</span>
                <ul>
                  {emergencyToolkit.inConflict.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            {emergencyToolkit.feelingFlooded && (
              <div className="emergency-card">
                <span className="emergency-label">Feeling Flooded</span>
                <ul>
                  {emergencyToolkit.feelingFlooded.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Luna Dialogue */}
      {lunaDialogue && (
        <section className="chapter-section luna-section">
          <h3 className="section-header">
            <span className="section-icon">\u263D</span>
            Luna's Guidance
          </h3>
          <div className="luna-dialogue-card">
            <span className="dialogue-context">{lunaDialogue.context}</span>
            <div className="dialogue-content">
              {lunaDialogue.dialogue.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Main Panel Component
 */
export function RelationshipDestinyPanel({ report }) {
  const [activeChapter, setActiveChapter] = useState('soul');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle chapter change with transition
  const handleChapterChange = (chapter) => {
    if (chapter === activeChapter) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveChapter(chapter);
      setIsTransitioning(false);
    }, 300);
  };

  // Extract data from report
  const {
    executiveSummary,
    sections,
    rawAnalysis,
    quickAccess,
    lunaWisdom
  } = report || {};

  const soulMapData = rawAnalysis?.soulMap || sections?.identity;
  const timelineData = rawAnalysis?.timeline || sections?.timeline;
  const evolutionData = rawAnalysis?.evolution || sections?.timeline;
  const healingData = rawAnalysis?.healing || sections?.healing;

  return (
    <div className="relationship-destiny-panel">
      {/* HEADER */}
      <header className="destiny-header mythic-header">
        <h1 className="destiny-title">
          {executiveSummary?.title || 'Relationship Destiny'}
        </h1>
        <p className="destiny-subtitle">
          {executiveSummary?.essence || 'The Cathedral Scroll of Your Bond'}
        </p>
        {executiveSummary?.coreIdentity && (
          <div className="destiny-meta">
            <span className="meta-archetype">{executiveSummary.coreIdentity.archetype}</span>
            <span className="meta-myth">{executiveSummary.coreIdentity.myth}</span>
          </div>
        )}
      </header>

      {/* CHAPTER TABS */}
      <nav className="destiny-tabs">
        {Object.entries(CHAPTER_META).map(([key, meta]) => (
          <button
            key={key}
            className={`destiny-tab ${activeChapter === key ? 'active' : ''}`}
            onClick={() => handleChapterChange(key)}
            style={{ '--tab-color': meta.color }}
          >
            <span className="tab-icon">{CHAPTER_ICONS[key]}</span>
            <span className="tab-label">{meta.title}</span>
          </button>
        ))}
      </nav>

      {/* CHAPTER CONTENT */}
      <section className={`destiny-content ${isTransitioning ? 'transitioning' : ''}`}>
        {/* Soul Map Chapter */}
        <div className={`destiny-chapter ${activeChapter === 'soul' ? 'chapter-visible' : 'chapter-hidden'}`}>
          <div className="chapter-header">
            <h2>{CHAPTER_META.soul.title}</h2>
            <p>{CHAPTER_META.soul.subtitle}</p>
          </div>
          <div className="chapter-scroll animated-scroll">
            <SoulMapChapter
              soulMap={soulMapData}
              identity={sections?.identity || soulMapData?.identity}
              shadow={soulMapData?.shadow}
              contract={soulMapData?.contract}
              fateThreads={soulMapData?.fateThreads}
            />
          </div>
        </div>

        {/* Timeline Chapter */}
        <div className={`destiny-chapter ${activeChapter === 'timeline' ? 'chapter-visible' : 'chapter-hidden'}`}>
          <div className="chapter-header">
            <h2>{CHAPTER_META.timeline.title}</h2>
            <p>{CHAPTER_META.timeline.subtitle}</p>
          </div>
          <div className="chapter-scroll animated-scroll">
            <TimelineChapter
              timeline={timelineData}
              currentSeason={timelineData?.currentSeason}
              fateWindows={timelineData?.activeFateWindows}
              transits={timelineData?.currentTransits}
            />
          </div>
        </div>

        {/* Evolution Chapter */}
        <div className={`destiny-chapter ${activeChapter === 'evolution' ? 'chapter-visible' : 'chapter-hidden'}`}>
          <div className="chapter-header">
            <h2>{CHAPTER_META.evolution.title}</h2>
            <p>{CHAPTER_META.evolution.subtitle}</p>
          </div>
          <div className="chapter-scroll animated-scroll">
            <EvolutionChapter
              evolution={evolutionData}
              currentStage={evolutionData?.currentStage}
              mythicArc={evolutionData?.mythicArc}
              evolutionTimeline={evolutionData?.evolutionTimeline}
            />
          </div>
        </div>

        {/* Healing Chapter */}
        <div className={`destiny-chapter ${activeChapter === 'healing' ? 'chapter-visible' : 'chapter-hidden'}`}>
          <div className="chapter-header">
            <h2>{CHAPTER_META.healing.title}</h2>
            <p>{CHAPTER_META.healing.subtitle}</p>
          </div>
          <div className="chapter-scroll animated-scroll">
            <HealingChapter
              healing={healingData}
              wounds={healingData?.woundAnalysis}
              rituals={healingData?.healingPrescription?.rituals}
              frameworks={healingData?.healingPrescription?.communicationFrameworks}
              emergencyToolkit={healingData?.emergencyToolkit}
              lunaDialogue={healingData?.lunaGuidance?.currentSituation}
            />
          </div>
        </div>
      </section>

      {/* QUICK ACCESS SIDEBAR */}
      {quickAccess && (
        <aside className="destiny-sidebar">
          <div className="sidebar-section">
            <h4>Today's Focus</h4>
            {quickAccess.todaysFocus && (
              <>
                <p className="focus-task">{quickAccess.todaysFocus.evolutionTask}</p>
                <p className="focus-practice">{quickAccess.todaysFocus.healingPractice}</p>
                <p className="focus-reminder">{quickAccess.todaysFocus.lunaReminder}</p>
              </>
            )}
          </div>
          {lunaWisdom?.closingBlessing && (
            <div className="sidebar-blessing">
              <span className="blessing-icon">\u2726</span>
              <p>{lunaWisdom.closingBlessing}</p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

export default RelationshipDestinyPanel;
