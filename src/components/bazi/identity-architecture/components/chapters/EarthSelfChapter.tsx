import React from 'react';
import type { EarthPersonality } from '../../engine/identityTypes';
import { ELEMENT_GRADIENTS, ELEMENT_ICONS } from '../../utils/elementTheme';
import { ChapterShell, Field } from './ChapterShell';

export const EarthSelfChapter: React.FC<{ data: EarthPersonality }> = ({ data }) => (
  <ChapterShell
    title={`${ELEMENT_ICONS[data.dominant]} Earth Self — The Body Below`}
    subtitle="Your instincts, habits, and somatic intelligence."
    footer={'Your Earth Self is the animal within — the one who reacts before thought.'}
    gradient={ELEMENT_GRADIENTS[data.dominant]}
  >
    <Field label="Instinctive Pattern" value={data.instincts} />
    <Field label="Stress Behavior" value={data.stressBehaviors} />
    <Field label="Habit Loops" value={data.habits} />
    <Field label="Somatic Patterns" value={data.somaticPatterns} />
  </ChapterShell>
);
