// One-shot extractor: lifts lines 1441..2206 of ZodiacCuspsPage.jsx
// (the "Zodiac Anatomy — The Metaphysical Body" theory block through the
// 36-Row Cosmogram + System Transitions) into a new standalone page file.
// Then rewrites the source to replace the extracted block with a "View full
// theory page" link that navigates to /zodiac-anatomy.
//
// Idempotent: exits cleanly if already extracted. Rerunnable only if the
// original block is restored.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SRC = 'src/pages/ZodiacCuspsPage.jsx';
const OUT = 'src/pages/ZodiacAnatomyPage.jsx';

const ANCHOR_START = "{/* ── Zodiac Anatomy Comparison ── */}";
const ANCHOR_END_COMMENT = "{/* ── Tuning ── */}"; // first line AFTER the block we extract

const src = readFileSync(SRC, 'utf8');
const lines = src.split('\n');

let startIdx = -1, endIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (startIdx < 0 && lines[i].includes(ANCHOR_START)) startIdx = i;
  else if (startIdx >= 0 && lines[i].includes(ANCHOR_END_COMMENT)) { endIdx = i; break; }
}

if (startIdx < 0 || endIdx < 0) {
  console.error('Anchors not found. startIdx=%d endIdx=%d', startIdx, endIdx);
  console.error('The block may already be extracted. Aborting.');
  process.exit(1);
}

// endIdx points at the Tuning comment line; we want everything BEFORE that.
// Trim trailing blank line if present.
let extractedEnd = endIdx;
while (extractedEnd > startIdx && lines[extractedEnd - 1].trim() === '') extractedEnd--;

const extracted = lines.slice(startIdx, extractedEnd).join('\n');
console.log(`Extracting ${extractedEnd - startIdx} lines (${startIdx + 1}..${extractedEnd}).`);

const pageContent = `/**
 * ZodiacAnatomyPage.jsx
 * The Metaphysical Body — 36-organ Zodiac Atlas, chakra + meridian maps,
 * organ narrative panels, and the 36-row Cosmogram.
 *
 * Promoted out of the ZodiacCuspsPage matrix theory modal on 2026-04-15.
 * This page is the doorway to the Health Module.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MACRO_SYSTEMS, COSMOGRAM_ROWS } from '../data/organCosmogram';
import { COSMOGRAM_SYSTEM_UI } from '../data/cosmogramUI';

export default function ZodiacAnatomyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white/80">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <header className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Zodiac Anatomy — The Metaphysical Body</h1>
            <p className="text-sm text-white/50 mt-1">
              The living organism beneath the 36-cusp system. Feeds the Health Module.
            </p>
          </div>
          <Link
            to="/zodiac-cusps"
            className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90 transition-colors"
          >
            ← Back to Zodiac Cusps
          </Link>
        </header>

        <div className="text-[13px] leading-relaxed text-white/80 space-y-6">
${extracted}
        </div>
      </div>
    </div>
  );
}
`;

writeFileSync(OUT, pageContent, 'utf8');
console.log(`Wrote ${OUT} (${pageContent.length.toLocaleString()} bytes).`);

// Now rewrite the source: replace the extracted block with a small link-out section.
const linkSection = `          {/* ── Full Theory Page Link (extracted to /zodiac-anatomy) ── */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Zodiac Anatomy — The Metaphysical Body</h3>
            <p className="text-[12px] text-white/70">
              The complete Zodiac Body Atlas — 12 organ families, 36 sub-organs, chakra + meridian maps,
              all 1,296 narrative panels, and the 36-row Cosmogram — now lives on its own page so it can
              feed the Health Module.
            </p>
            <a
              href="/zodiac-anatomy"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[12px] font-semibold hover:bg-emerald-500/25 transition-colors"
            >
              View Full Theory Page →
            </a>
          </section>

`;

const before = lines.slice(0, startIdx).join('\n');
const after = lines.slice(endIdx).join('\n');
const newSrc = before + '\n' + linkSection + after;
writeFileSync(SRC, newSrc, 'utf8');
console.log(`Rewrote ${SRC}: removed ${extractedEnd - startIdx} lines, inserted link section.`);
