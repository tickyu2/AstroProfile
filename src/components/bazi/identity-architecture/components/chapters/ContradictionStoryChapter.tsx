import React from 'react';
import { ChapterShell } from './ChapterShell';

export const ContradictionStoryChapter: React.FC<{ narrative: string }> = ({ narrative }) => (
  <ChapterShell
    title={'🌀 Contradiction Story — The Myth of Your Inner World'}
    subtitle="A narrative that weaves all tensions into a coherent arc."
    footer={'Your contradictions are not flaws — they are the architecture of your becoming.'}
    gradient="linear-gradient(135deg, rgba(30,41,59,0.5) 0%, rgba(51,65,85,0.3) 100%)"
  >
    <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#cbd5e1', whiteSpace: 'pre-line' }}>
      {narrative}
    </div>
  </ChapterShell>
);
