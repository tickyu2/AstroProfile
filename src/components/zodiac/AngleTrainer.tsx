/**
 * AngleTrainer.tsx
 *
 * Khan Academy-style angle relationship trainer.
 * Teaches users about zodiac aspects through interactive navigation.
 *
 * Extracted from TropicalSeasonsPage.tsx for better modularity.
 */

import './AngleTrainer.css';
import React, { useState, useMemo, useCallback } from 'react';
import {
  ANGLE_LESSONS,
  getAngleTargets,
  type AngleLesson,
} from '../../zodiac/angles';
import {
  SIGN_LESSONS,
  ELEMENT_EMOJI,
  type SignKey,
} from '../../zodiac/tropicalMap';

interface AngleTrainerProps {
  fromSign: SignKey;
}

export const AngleTrainer: React.FC<AngleTrainerProps> = ({ fromSign }) => {
  const [angleIndex, setAngleIndex] = useState(0);
  const lesson = ANGLE_LESSONS[angleIndex];

  const targets = useMemo(() => getAngleTargets(fromSign, lesson.steps), [fromSign, lesson.steps]);
  const fromLesson = SIGN_LESSONS[fromSign];
  const cwLesson = SIGN_LESSONS[targets.clockwise];
  const ccwLesson = SIGN_LESSONS[targets.counterClockwise];

  const handlePrevious = useCallback(() => {
    setAngleIndex(i => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setAngleIndex(i => Math.min(ANGLE_LESSONS.length - 1, i + 1));
  }, []);

  return (
    <div className="angle-trainer">
      <div className="angle-trainer-header">
        <h3>Relationships by Angle</h3>
        <p className="angle-trainer-subtitle">
          Source: <strong>{fromLesson.symbol} {fromLesson.sign}</strong>
        </p>
      </div>

      {/* Angle Navigation */}
      <div className="angle-nav">
        <button
          type="button"
          className="angle-nav-btn"
          onClick={handlePrevious}
          disabled={angleIndex === 0}
        >
          ← Previous
        </button>

        <div className="angle-current">
          <div className="angle-symbol" style={{ color: lesson.color }}>
            {lesson.symbol}
          </div>
          <div className="angle-name">{lesson.name}</div>
          <div className="angle-degrees">{lesson.degrees}°</div>
          <div className="angle-vibe">{lesson.vibe}</div>
        </div>

        <button
          type="button"
          className="angle-nav-btn"
          onClick={handleNext}
          disabled={angleIndex === ANGLE_LESSONS.length - 1}
        >
          Next →
        </button>
      </div>

      {/* Progress indicator */}
      <div className="angle-progress">
        {ANGLE_LESSONS.map((_, i) => (
          <div
            key={i}
            className={`angle-progress-dot ${i === angleIndex ? 'active' : ''} ${i < angleIndex ? 'completed' : ''}`}
            style={{ background: i === angleIndex ? lesson.color : undefined }}
          />
        ))}
      </div>

      {/* Angle Explanation */}
      <div className="angle-explanation" style={{ borderLeftColor: lesson.color }}>
        <p className="angle-meaning">{lesson.academyMeaning}</p>
      </div>

      {/* Target Signs */}
      <div className="angle-targets">
        {lesson.steps === 0 ? (
          // Conjunction - same sign
          <div className="angle-target single">
            <div className="target-label">Same Sign</div>
            <div className="target-sign">
              <span className="target-symbol">{fromLesson.symbol}</span>
              <span className="target-name">{fromLesson.sign}</span>
            </div>
            <div className="target-meta">
              {ELEMENT_EMOJI[fromLesson.element]} {fromLesson.element} • {fromLesson.modality}
            </div>
          </div>
        ) : lesson.steps === 6 ? (
          // Opposition - single opposite
          <div className="angle-target single">
            <div className="target-label">Opposite Sign</div>
            <div className="target-sign">
              <span className="target-symbol">{cwLesson.symbol}</span>
              <span className="target-name">{cwLesson.sign}</span>
            </div>
            <div className="target-meta">
              {ELEMENT_EMOJI[cwLesson.element]} {cwLesson.element} • {cwLesson.modality}
            </div>
          </div>
        ) : (
          // Two targets (clockwise and counter-clockwise)
          <>
            <div className="angle-target">
              <div className="target-label">Clockwise →</div>
              <div className="target-sign">
                <span className="target-symbol">{cwLesson.symbol}</span>
                <span className="target-name">{cwLesson.sign}</span>
              </div>
              <div className="target-meta">
                {ELEMENT_EMOJI[cwLesson.element]} {cwLesson.element} • {cwLesson.modality}
              </div>
            </div>
            <div className="angle-target">
              <div className="target-label">← Counter-clockwise</div>
              <div className="target-sign">
                <span className="target-symbol">{ccwLesson.symbol}</span>
                <span className="target-name">{ccwLesson.sign}</span>
              </div>
              <div className="target-meta">
                {ELEMENT_EMOJI[ccwLesson.element]} {ccwLesson.element} • {ccwLesson.modality}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Relationship & Growth */}
      <div className="angle-insights">
        <div className="angle-insight">
          <h4>💫 In Relationships</h4>
          <p>{lesson.relationshipHint}</p>
        </div>
        <div className="angle-insight">
          <h4>🌱 Growth Opportunity</h4>
          <p>{lesson.growthOpportunity}</p>
        </div>
      </div>

      {/* Practice prompt */}
      <div className="angle-practice">
        <span className="practice-label">Practice</span>
        <p>
          In one sentence, describe how {fromLesson.sign} experiences {cwLesson.sign} at {lesson.degrees}°.
        </p>
      </div>
    </div>
  );
};

export default AngleTrainer;
