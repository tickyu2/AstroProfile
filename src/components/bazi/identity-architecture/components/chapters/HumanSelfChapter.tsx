import React from 'react';
import type { HumanPersonality } from '../../engine/identityTypes';
import { ELEMENT_GRADIENTS, ELEMENT_ICONS } from '../../utils/elementTheme';
import { ChapterShell, Field } from './ChapterShell';

export const HumanSelfChapter: React.FC<{ data: HumanPersonality }> = ({ data }) => (
  <ChapterShell
    title={`${ELEMENT_ICONS[data.dominant]} Human Self — The Heart Within`}
    subtitle="Your emotional needs, motivations, and shadow desires."
    footer={'Your Human Self is the quiet voice inside — the one that remembers your true longing.'}
    gradient={ELEMENT_GRADIENTS[data.dominant]}
  >
    <Field label="Emotional Needs" value={data.emotionalNeeds} />
    <Field label="Motivational Drivers" value={data.motivations} />
    <Field label="Shadow Desires" value={data.shadowDesires} />
    <Field label="Subconscious Fears" value={data.subconsciousFears} />
  </ChapterShell>
);
