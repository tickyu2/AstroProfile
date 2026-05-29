import React from 'react';
import type { HeavenPersonality } from '../../engine/identityTypes';
import { ELEMENT_GRADIENTS, ELEMENT_ICONS } from '../../utils/elementTheme';
import { ChapterShell, Field, BulletList } from './ChapterShell';

export const HeavenSelfChapter: React.FC<{ data: HeavenPersonality }> = ({ data }) => (
  <ChapterShell
    title={`${ELEMENT_ICONS[data.dominant]} Heaven Self — The Mind Above`}
    subtitle="Your worldview, cognition, and conscious identity."
    footer="Your Heaven Self is the strategist who stands on the mountain, reading the winds."
    gradient={ELEMENT_GRADIENTS[data.dominant]}
  >
    <Field label="Cognitive Style" value={data.cognitiveStyle} />
    <Field label="Worldview Lens" value={data.worldview} />
    <Field label="Decision Logic" value={data.decisionLogic} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <BulletList label="Strengths" items={data.strengths} />
      <BulletList label="Blind Spots" items={data.blindSpots} />
    </div>
  </ChapterShell>
);
