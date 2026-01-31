/**
 * InDepthGuidance - Susan Miller-style Deep Relationship Guidance
 *
 * Expandable sections showing actionable advice:
 * - What works naturally
 * - Common pitfalls
 * - Daily/Weekly/Monthly actions
 * - 9-Step Conflict Repair Plan
 * - Growth opportunities
 * - Perspectives & needs
 *
 * "Here's how to LIVE this relationship"
 *
 * GENESIS AstroProfile - January 2026
 */

import React, { useState, useMemo } from 'react';
import type { SignKey } from '../../zodiac/tropicalMap';
import { buildPairGuidance, type GuidanceContext, type PairGuidance } from '../../zodiac/guidanceEngine';
import { MOON_REPAIR, type MoonRepairScript } from '../../zodiac/moonRepairScripts';
import { RISING_FRICTION, type RisingFriction } from '../../zodiac/risingFriction';
import { DIALOGUE_SNIPPETS, getPairDialogue, type DialogueGuidance } from '../../zodiac/dialogueSnippets';

// =============================================================================
// TYPES
// =============================================================================

interface InDepthGuidanceProps {
  signA: SignKey;
  signB: SignKey;
  moonA?: SignKey;
  moonB?: SignKey;
  risingA?: SignKey;
  risingB?: SignKey;
  nameA?: string;
  nameB?: string;
  context?: GuidanceContext;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const InDepthGuidance: React.FC<InDepthGuidanceProps> = ({
  signA,
  signB,
  moonA,
  moonB,
  risingA,
  risingB,
  nameA,
  nameB,
  context = 'romance',
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['whatWorks']));

  const guidance = useMemo(() => {
    return buildPairGuidance(signA, signB, context, nameA, nameB);
  }, [signA, signB, context, nameA, nameB]);

  // Moon repair scripts (if Moon signs provided)
  const moonRepairA = useMemo(() => moonA ? MOON_REPAIR[moonA] : null, [moonA]);
  const moonRepairB = useMemo(() => moonB ? MOON_REPAIR[moonB] : null, [moonB]);

  // Rising friction patterns (if Rising signs provided)
  const risingFrictionA = useMemo(() => risingA ? RISING_FRICTION[risingA] : null, [risingA]);
  const risingFrictionB = useMemo(() => risingB ? RISING_FRICTION[risingB] : null, [risingB]);

  // Dialogue snippets (always show for Sun signs)
  const dialogueA = useMemo(() => DIALOGUE_SNIPPETS[signA], [signA]);
  const dialogueB = useMemo(() => DIALOGUE_SNIPPETS[signB], [signB]);
  const pairDialogue = useMemo(() => getPairDialogue(signA, signB), [signA, signB]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set([
      'whatWorks', 'pitfalls', 'actions', 'repair', 'growth',
      'howASeesB', 'howBSeesA', 'needsA', 'needsB', 'ritual',
      'moonRepair', 'risingDynamics', 'dialogue'
    ]));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const displayA = nameA || signA;
  const displayB = nameB || signB;

  return (
    <div className="in-depth-guidance">
      {/* Header */}
      <div className="guidance-header">
        <h3>In-Depth Guidance</h3>
        <p className="guidance-subtitle">Actionable advice for {displayA} & {displayB}</p>
        <div className="expand-controls">
          <button type="button" onClick={expandAll} className="expand-btn">Expand All</button>
          <button type="button" onClick={collapseAll} className="expand-btn">Collapse All</button>
        </div>
      </div>

      {/* Dynamic Overview */}
      <div className="dynamic-overview">
        <div className="dynamic-chip element">{guidance.elementDynamic}</div>
        <div className="dynamic-chip modality">{guidance.modalityDynamic}</div>
        {guidance.angleRelationship && (
          <div className="dynamic-chip angle">
            {guidance.angleRelationship.symbol} {guidance.angleRelationship.name} ({guidance.angleRelationship.degrees}°)
          </div>
        )}
      </div>

      {/* WHAT WORKS NATURALLY */}
      <GuidanceSection
        title="What Works Naturally"
        icon="✨"
        sectionKey="whatWorks"
        isExpanded={expandedSections.has('whatWorks')}
        onToggle={() => toggleSection('whatWorks')}
        type="positive"
      >
        <ul className="guidance-list">
          {guidance.whatWorksNaturally.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </GuidanceSection>

      {/* COMMON PITFALLS */}
      <GuidanceSection
        title="Common Pitfalls"
        icon="⚠️"
        sectionKey="pitfalls"
        isExpanded={expandedSections.has('pitfalls')}
        onToggle={() => toggleSection('pitfalls')}
        type="warning"
      >
        <ul className="guidance-list warning">
          {guidance.commonPitfalls.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </GuidanceSection>

      {/* PRACTICAL ACTIONS */}
      <GuidanceSection
        title="Practical Actions"
        icon="🎯"
        sectionKey="actions"
        isExpanded={expandedSections.has('actions')}
        onToggle={() => toggleSection('actions')}
        type="action"
      >
        <div className="actions-grid">
          {['daily', 'weekly', 'monthly', 'as-needed'].map(freq => {
            const actions = guidance.practicalActions.filter(a => a.frequency === freq);
            if (actions.length === 0) return null;
            return (
              <div key={freq} className={`action-group ${freq}`}>
                <h5 className="action-frequency">
                  {freq === 'daily' && '📅 Daily'}
                  {freq === 'weekly' && '📆 Weekly'}
                  {freq === 'monthly' && '🗓️ Monthly'}
                  {freq === 'as-needed' && '🔧 As Needed'}
                </h5>
                {actions.map((action, i) => (
                  <div key={i} className="action-item">
                    <p className="action-text">{action.action}</p>
                    <p className="action-why">{action.why}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </GuidanceSection>

      {/* 9-STEP CONFLICT REPAIR PLAN */}
      <GuidanceSection
        title="9-Step Conflict Repair Plan"
        icon="🔧"
        sectionKey="repair"
        isExpanded={expandedSections.has('repair')}
        onToggle={() => toggleSection('repair')}
        type="repair"
      >
        <ol className="repair-steps">
          {guidance.conflictRepairPlan.map((step) => (
            <li key={step.step} className={`repair-step for-${step.forWhom.toLowerCase()}`}>
              <span className="step-badge">
                {step.forWhom === 'A' && displayA}
                {step.forWhom === 'B' && displayB}
                {step.forWhom === 'both' && 'Both'}
              </span>
              <span className="step-action">{step.action}</span>
            </li>
          ))}
        </ol>
      </GuidanceSection>

      {/* GROWTH OPPORTUNITIES */}
      <GuidanceSection
        title="Growth Opportunities"
        icon="🌱"
        sectionKey="growth"
        isExpanded={expandedSections.has('growth')}
        onToggle={() => toggleSection('growth')}
        type="growth"
      >
        <ul className="guidance-list growth">
          {guidance.growthOpportunities.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </GuidanceSection>

      {/* PERSPECTIVES */}
      <div className="perspectives-row">
        <GuidanceSection
          title={`How ${displayA} Sees ${displayB}`}
          icon="👁️"
          sectionKey="howASeesB"
          isExpanded={expandedSections.has('howASeesB')}
          onToggle={() => toggleSection('howASeesB')}
          type="perspective"
          compact
        >
          <ul className="guidance-list compact">
            {guidance.howASeesB.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </GuidanceSection>

        <GuidanceSection
          title={`How ${displayB} Sees ${displayA}`}
          icon="👁️"
          sectionKey="howBSeesA"
          isExpanded={expandedSections.has('howBSeesA')}
          onToggle={() => toggleSection('howBSeesA')}
          type="perspective"
          compact
        >
          <ul className="guidance-list compact">
            {guidance.howBSeesA.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </GuidanceSection>
      </div>

      {/* NEEDS */}
      <div className="needs-row">
        <GuidanceSection
          title={`What ${displayA} Needs`}
          icon="💜"
          sectionKey="needsA"
          isExpanded={expandedSections.has('needsA')}
          onToggle={() => toggleSection('needsA')}
          type="needs"
          compact
        >
          <ul className="guidance-list compact needs">
            {guidance.whatANeedsFromB.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </GuidanceSection>

        <GuidanceSection
          title={`What ${displayB} Needs`}
          icon="💜"
          sectionKey="needsB"
          isExpanded={expandedSections.has('needsB')}
          onToggle={() => toggleSection('needsB')}
          type="needs"
          compact
        >
          <ul className="guidance-list compact needs">
            {guidance.whatBNeedsFromA.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </GuidanceSection>
      </div>

      {/* WEEKLY RITUAL */}
      <GuidanceSection
        title="Your Weekly Ritual"
        icon="📅"
        sectionKey="ritual"
        isExpanded={expandedSections.has('ritual')}
        onToggle={() => toggleSection('ritual')}
        type="ritual"
      >
        <div className="ritual-box">
          <p>{guidance.weeklyRitual}</p>
        </div>
      </GuidanceSection>

      {/* MOON EMOTIONAL REPAIR (if Moon signs provided) */}
      {(moonRepairA || moonRepairB) && (
        <GuidanceSection
          title="Emotional Repair Scripts"
          icon="🌙"
          sectionKey="moonRepair"
          isExpanded={expandedSections.has('moonRepair')}
          onToggle={() => toggleSection('moonRepair')}
          type="moon"
        >
          <div className="moon-repair-grid">
            {moonRepairA && moonA && (
              <div className="moon-repair-card">
                <h5 className="moon-repair-title">{displayA}'s Moon in {moonA}</h5>
                <div className="moon-repair-section">
                  <strong>When Hurt:</strong>
                  <ul>
                    {moonRepairA.whenHurt.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="moon-repair-section">
                  <strong>How to Repair:</strong>
                  <ul>
                    {moonRepairA.repairApproach.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="moon-repair-section">
                  <strong>Soothing Actions:</strong>
                  <ul>
                    {moonRepairA.soothingActions.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="moon-recovery-badge">
                  Recovery: {moonRepairA.recoveryTime}
                </div>
              </div>
            )}
            {moonRepairB && moonB && (
              <div className="moon-repair-card">
                <h5 className="moon-repair-title">{displayB}'s Moon in {moonB}</h5>
                <div className="moon-repair-section">
                  <strong>When Hurt:</strong>
                  <ul>
                    {moonRepairB.whenHurt.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="moon-repair-section">
                  <strong>How to Repair:</strong>
                  <ul>
                    {moonRepairB.repairApproach.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="moon-repair-section">
                  <strong>Soothing Actions:</strong>
                  <ul>
                    {moonRepairB.soothingActions.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="moon-recovery-badge">
                  Recovery: {moonRepairB.recoveryTime}
                </div>
              </div>
            )}
          </div>
        </GuidanceSection>
      )}

      {/* RISING SIGN SOCIAL DYNAMICS (if Rising signs provided) */}
      {(risingFrictionA || risingFrictionB) && (
        <GuidanceSection
          title="Social Dynamics & First Impressions"
          icon="↑"
          sectionKey="risingDynamics"
          isExpanded={expandedSections.has('risingDynamics')}
          onToggle={() => toggleSection('risingDynamics')}
          type="rising"
        >
          <div className="rising-grid">
            {risingFrictionA && risingA && (
              <div className="rising-card">
                <h5 className="rising-title">{displayA}'s Rising in {risingA}</h5>
                <div className="rising-section">
                  <strong>Appears As:</strong>
                  <ul>
                    {risingFrictionA.appearsAs.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="rising-section warning">
                  <strong>Often Misread As:</strong>
                  <ul>
                    {risingFrictionA.commonMisread.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="rising-section">
                  <strong>Actually Needs:</strong>
                  <ul>
                    {risingFrictionA.actuallyNeeds.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="rising-section positive">
                  <strong>Social Strengths:</strong>
                  <ul>
                    {risingFrictionA.socialStrengths.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            )}
            {risingFrictionB && risingB && (
              <div className="rising-card">
                <h5 className="rising-title">{displayB}'s Rising in {risingB}</h5>
                <div className="rising-section">
                  <strong>Appears As:</strong>
                  <ul>
                    {risingFrictionB.appearsAs.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="rising-section warning">
                  <strong>Often Misread As:</strong>
                  <ul>
                    {risingFrictionB.commonMisread.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="rising-section">
                  <strong>Actually Needs:</strong>
                  <ul>
                    {risingFrictionB.actuallyNeeds.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="rising-section positive">
                  <strong>Social Strengths:</strong>
                  <ul>
                    {risingFrictionB.socialStrengths.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </GuidanceSection>
      )}

      {/* DIALOGUE SNIPPETS - What to Say / What Not to Say */}
      <GuidanceSection
        title="What to Say & What to Avoid"
        icon="💬"
        sectionKey="dialogue"
        isExpanded={expandedSections.has('dialogue')}
        onToggle={() => toggleSection('dialogue')}
        type="dialogue"
      >
        <div className="dialogue-grid">
          <div className="dialogue-card">
            <h5 className="dialogue-title">Speaking to {displayA} ({signA})</h5>
            <div className="dialogue-section say">
              <strong>Say This:</strong>
              <ul>
                {pairDialogue.bToA.say.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="dialogue-section avoid">
              <strong>Avoid:</strong>
              <ul>
                {pairDialogue.bToA.avoid.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="dialogue-magic">
              <span className="magic-label">Magic Phrase:</span>
              <span className="magic-phrase">{dialogueA.magic}</span>
            </div>
            <div className="dialogue-danger">
              <span className="danger-label">Never Say:</span>
              <span className="danger-phrase">{dialogueA.danger}</span>
            </div>
          </div>
          <div className="dialogue-card">
            <h5 className="dialogue-title">Speaking to {displayB} ({signB})</h5>
            <div className="dialogue-section say">
              <strong>Say This:</strong>
              <ul>
                {pairDialogue.aToB.say.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="dialogue-section avoid">
              <strong>Avoid:</strong>
              <ul>
                {pairDialogue.aToB.avoid.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="dialogue-magic">
              <span className="magic-label">Magic Phrase:</span>
              <span className="magic-phrase">{dialogueB.magic}</span>
            </div>
            <div className="dialogue-danger">
              <span className="danger-label">Never Say:</span>
              <span className="danger-phrase">{dialogueB.danger}</span>
            </div>
          </div>
        </div>
      </GuidanceSection>

      <style>{`
        .in-depth-guidance {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 16px;
          padding: 20px;
          color: #e5e7eb;
          margin-top: 16px;
        }

        .guidance-header {
          margin-bottom: 16px;
        }

        .guidance-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #fbbf24;
          margin: 0 0 4px 0;
        }

        .guidance-subtitle {
          font-size: 13px;
          color: #9ca3af;
          margin: 0 0 12px 0;
        }

        .expand-controls {
          display: flex;
          gap: 8px;
        }

        .expand-btn {
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #9ca3af;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .expand-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
        }

        /* Dynamic Overview */
        .dynamic-overview {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .dynamic-chip {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
        }

        .dynamic-chip.element {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
        }

        .dynamic-chip.modality {
          background: rgba(251, 191, 36, 0.15);
          color: #fde68a;
        }

        .dynamic-chip.angle {
          background: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
        }

        /* Section Styles */
        .guidance-section {
          margin-bottom: 12px;
          border-radius: 12px;
          overflow: hidden;
        }

        .guidance-section.compact {
          flex: 1;
          min-width: 200px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .section-header:hover {
          filter: brightness(1.1);
        }

        .section-icon {
          font-size: 18px;
        }

        .section-title {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          margin: 0;
        }

        .section-toggle {
          font-size: 12px;
          color: #6b7280;
          transition: transform 0.2s;
        }

        .section-toggle.expanded {
          transform: rotate(180deg);
        }

        .section-content {
          padding: 0 16px 16px 16px;
        }

        /* Section Type Styles */
        .guidance-section.positive { background: rgba(34, 197, 94, 0.08); }
        .guidance-section.positive .section-header { background: rgba(34, 197, 94, 0.15); }
        .guidance-section.positive .section-title { color: #4ade80; }

        .guidance-section.warning { background: rgba(251, 191, 36, 0.08); }
        .guidance-section.warning .section-header { background: rgba(251, 191, 36, 0.15); }
        .guidance-section.warning .section-title { color: #fbbf24; }

        .guidance-section.action { background: rgba(59, 130, 246, 0.08); }
        .guidance-section.action .section-header { background: rgba(59, 130, 246, 0.15); }
        .guidance-section.action .section-title { color: #60a5fa; }

        .guidance-section.repair { background: rgba(168, 85, 247, 0.08); }
        .guidance-section.repair .section-header { background: rgba(168, 85, 247, 0.15); }
        .guidance-section.repair .section-title { color: #a78bfa; }

        .guidance-section.growth { background: rgba(34, 197, 94, 0.08); }
        .guidance-section.growth .section-header { background: rgba(34, 197, 94, 0.15); }
        .guidance-section.growth .section-title { color: #4ade80; }

        .guidance-section.perspective { background: rgba(99, 102, 241, 0.08); }
        .guidance-section.perspective .section-header { background: rgba(99, 102, 241, 0.15); }
        .guidance-section.perspective .section-title { color: #818cf8; }

        .guidance-section.needs { background: rgba(236, 72, 153, 0.08); }
        .guidance-section.needs .section-header { background: rgba(236, 72, 153, 0.15); }
        .guidance-section.needs .section-title { color: #f472b6; }

        .guidance-section.ritual { background: rgba(20, 184, 166, 0.08); }
        .guidance-section.ritual .section-header { background: rgba(20, 184, 166, 0.15); }
        .guidance-section.ritual .section-title { color: #2dd4bf; }

        .guidance-section.moon { background: rgba(147, 197, 253, 0.08); }
        .guidance-section.moon .section-header { background: rgba(147, 197, 253, 0.15); }
        .guidance-section.moon .section-title { color: #93c5fd; }

        .guidance-section.rising { background: rgba(251, 146, 60, 0.08); }
        .guidance-section.rising .section-header { background: rgba(251, 146, 60, 0.15); }
        .guidance-section.rising .section-title { color: #fb923c; }

        .guidance-section.dialogue { background: rgba(34, 211, 238, 0.08); }
        .guidance-section.dialogue .section-header { background: rgba(34, 211, 238, 0.15); }
        .guidance-section.dialogue .section-title { color: #22d3ee; }

        /* Lists */
        .guidance-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .guidance-list li {
          padding: 8px 0;
          padding-left: 20px;
          position: relative;
          font-size: 13px;
          line-height: 1.5;
          color: #d1d5db;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .guidance-list li:last-child {
          border-bottom: none;
        }

        .guidance-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #4ade80;
        }

        .guidance-list.warning li::before {
          color: #fbbf24;
        }

        .guidance-list.growth li::before {
          color: #4ade80;
        }

        .guidance-list.needs li::before {
          color: #f472b6;
        }

        .guidance-list.compact li {
          padding: 6px 0;
          padding-left: 16px;
          font-size: 12px;
        }

        /* Actions Grid */
        .actions-grid {
          display: grid;
          gap: 16px;
        }

        .action-group {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 12px;
        }

        .action-frequency {
          font-size: 12px;
          font-weight: 600;
          color: #60a5fa;
          margin: 0 0 8px 0;
        }

        .action-group.daily .action-frequency { color: #4ade80; }
        .action-group.weekly .action-frequency { color: #60a5fa; }
        .action-group.monthly .action-frequency { color: #a78bfa; }
        .action-group.as-needed .action-frequency { color: #fbbf24; }

        .action-item {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .action-item:last-child {
          border-bottom: none;
        }

        .action-text {
          font-size: 13px;
          color: #e5e7eb;
          margin: 0 0 4px 0;
        }

        .action-why {
          font-size: 11px;
          color: #6b7280;
          margin: 0;
          font-style: italic;
        }

        /* Repair Steps */
        .repair-steps {
          list-style: none;
          padding: 0;
          margin: 0;
          counter-reset: step;
        }

        .repair-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .repair-step:last-child {
          border-bottom: none;
        }

        .step-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .repair-step.for-a .step-badge {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }

        .repair-step.for-b .step-badge {
          background: rgba(236, 72, 153, 0.2);
          color: #f9a8d4;
        }

        .repair-step.for-both .step-badge {
          background: rgba(168, 85, 247, 0.2);
          color: #c4b5fd;
        }

        .step-action {
          font-size: 13px;
          color: #d1d5db;
          line-height: 1.5;
        }

        /* Ritual Box */
        .ritual-box {
          background: rgba(20, 184, 166, 0.1);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 8px;
          padding: 16px;
        }

        .ritual-box p {
          font-size: 14px;
          line-height: 1.7;
          color: #e5e7eb;
          margin: 0;
        }

        /* Row Layouts */
        .perspectives-row,
        .needs-row {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        @media (max-width: 600px) {
          .perspectives-row,
          .needs-row {
            flex-direction: column;
          }
        }

        /* Moon Repair Styles */
        .moon-repair-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .moon-repair-card {
          background: rgba(147, 197, 253, 0.05);
          border: 1px solid rgba(147, 197, 253, 0.1);
          border-radius: 10px;
          padding: 16px;
        }

        .moon-repair-title {
          font-size: 14px;
          font-weight: 600;
          color: #93c5fd;
          margin: 0 0 12px 0;
        }

        .moon-repair-section {
          margin-bottom: 12px;
        }

        .moon-repair-section strong {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .moon-repair-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .moon-repair-section li {
          font-size: 12px;
          color: #d1d5db;
          padding: 4px 0;
          padding-left: 16px;
          position: relative;
        }

        .moon-repair-section li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #93c5fd;
        }

        .moon-recovery-badge {
          display: inline-block;
          padding: 4px 10px;
          background: rgba(147, 197, 253, 0.15);
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          color: #93c5fd;
          text-transform: capitalize;
        }

        /* Rising Sign Styles */
        .rising-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .rising-card {
          background: rgba(251, 146, 60, 0.05);
          border: 1px solid rgba(251, 146, 60, 0.1);
          border-radius: 10px;
          padding: 16px;
        }

        .rising-title {
          font-size: 14px;
          font-weight: 600;
          color: #fb923c;
          margin: 0 0 12px 0;
        }

        .rising-section {
          margin-bottom: 12px;
        }

        .rising-section strong {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .rising-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .rising-section li {
          font-size: 12px;
          color: #d1d5db;
          padding: 4px 0;
          padding-left: 16px;
          position: relative;
        }

        .rising-section li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #fb923c;
        }

        .rising-section.warning li::before {
          color: #fbbf24;
        }

        .rising-section.positive li::before {
          color: #4ade80;
        }

        /* Dialogue Styles */
        .dialogue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .dialogue-card {
          background: rgba(34, 211, 238, 0.05);
          border: 1px solid rgba(34, 211, 238, 0.1);
          border-radius: 10px;
          padding: 16px;
        }

        .dialogue-title {
          font-size: 14px;
          font-weight: 600;
          color: #22d3ee;
          margin: 0 0 12px 0;
        }

        .dialogue-section {
          margin-bottom: 12px;
        }

        .dialogue-section strong {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .dialogue-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .dialogue-section li {
          font-size: 12px;
          color: #d1d5db;
          padding: 4px 0;
          padding-left: 16px;
          position: relative;
        }

        .dialogue-section.say li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4ade80;
        }

        .dialogue-section.avoid li::before {
          content: '✗';
          position: absolute;
          left: 0;
          color: #f87171;
        }

        .dialogue-magic {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 8px;
        }

        .magic-label {
          font-size: 10px;
          font-weight: 600;
          color: #4ade80;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .magic-phrase {
          font-size: 13px;
          color: #e5e7eb;
          font-style: italic;
        }

        .dialogue-danger {
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 8px;
          padding: 10px 12px;
        }

        .danger-label {
          font-size: 10px;
          font-weight: 600;
          color: #f87171;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .danger-phrase {
          font-size: 13px;
          color: #fca5a5;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// GUIDANCE SECTION COMPONENT
// =============================================================================

interface GuidanceSectionProps {
  title: string;
  icon: string;
  sectionKey: string;
  isExpanded: boolean;
  onToggle: () => void;
  type: 'positive' | 'warning' | 'action' | 'repair' | 'growth' | 'perspective' | 'needs' | 'ritual' | 'moon' | 'rising' | 'dialogue';
  compact?: boolean;
  children: React.ReactNode;
}

const GuidanceSection: React.FC<GuidanceSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  type,
  compact = false,
  children,
}) => {
  return (
    <div className={`guidance-section ${type} ${compact ? 'compact' : ''}`}>
      <div className="section-header" onClick={onToggle}>
        <span className="section-icon">{icon}</span>
        <h4 className="section-title">{title}</h4>
        <span className={`section-toggle ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      {isExpanded && (
        <div className="section-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default InDepthGuidance;
