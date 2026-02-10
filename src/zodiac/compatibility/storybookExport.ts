/**
 * storybookExport.ts
 *
 * Exports the Destiny Storybook as a formatted PDF using jsPDF.
 * Produces a mythic, readable document with:
 *   - Title page
 *   - Prologue
 *   - All chapters
 *   - Epilogue
 *   - Rituals appendix
 *
 * GENESIS AstroProfile - February 2026
 */

import jsPDF from 'jspdf';
import type { DestinyStorybook } from './destinyStorybook';
import type { RelationshipRitual } from './relationshipRituals';

// =============================================================================
// CONSTANTS
// =============================================================================

const PAGE_W = 210;  // A4 width mm
const PAGE_H = 297;  // A4 height mm
const MARGIN_L = 25;
const MARGIN_R = 25;
const MARGIN_T = 30;
const MARGIN_B = 25;
const TEXT_W = PAGE_W - MARGIN_L - MARGIN_R;
const LINE_H = 6;

// Colors (dark theme on paper — inverted for print readability)
const COLOR_TITLE  = [90, 50, 160];     // deep violet
const COLOR_ACCENT = [167, 139, 250];   // lavender
const COLOR_BODY   = [40, 40, 50];      // near-black
const COLOR_MUTED  = [120, 120, 140];   // gray

// =============================================================================
// HELPERS
// =============================================================================

function setColor(doc: jsPDF, rgb: number[]): void {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

/**
 * Write wrapped text, returning the new Y position.
 * Adds a new page if text would overflow.
 */
function writeWrapped(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  for (const line of lines) {
    if (y > PAGE_H - MARGIN_B) {
      doc.addPage();
      y = MARGIN_T;
    }
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

// =============================================================================
// EXPORT FUNCTION
// =============================================================================

export interface StorybookExportInput {
  storybook: DestinyStorybook;
  rituals: RelationshipRitual[];
  nameA: string;
  nameB: string;
  overall: number;
  compositeArchetype: string;
  destinyArchetype: string;
  mythicPath: string;
}

/**
 * Generate and download a Destiny Storybook PDF.
 */
export function exportStorybookPDF(input: StorybookExportInput): void {
  const { storybook, rituals, nameA, nameB, overall, compositeArchetype, destinyArchetype, mythicPath } = input;
  const doc = new jsPDF('p', 'mm', 'a4');

  // ===== TITLE PAGE =====
  let y = 80;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  setColor(doc, COLOR_MUTED);
  doc.text('GENESIS AstroProfile', PAGE_W / 2, y, { align: 'center' });
  y += 12;

  doc.setFontSize(9);
  doc.text('Destiny Storybook', PAGE_W / 2, y, { align: 'center' });
  y += 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  setColor(doc, COLOR_TITLE);
  const titleLines = doc.splitTextToSize(storybook.title, TEXT_W) as string[];
  for (const line of titleLines) {
    doc.text(line, PAGE_W / 2, y, { align: 'center' });
    y += 10;
  }
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  setColor(doc, COLOR_BODY);
  doc.text(`${nameA}  &  ${nameB}`, PAGE_W / 2, y, { align: 'center' });
  y += 16;

  // Meta info
  doc.setFontSize(9);
  setColor(doc, COLOR_MUTED);
  doc.text(`Overall Compatibility: ${overall}%`, PAGE_W / 2, y, { align: 'center' });
  y += 6;
  doc.text(`Composite Archetype: ${compositeArchetype}`, PAGE_W / 2, y, { align: 'center' });
  y += 6;
  doc.text(`Destiny Archetype: ${destinyArchetype}`, PAGE_W / 2, y, { align: 'center' });
  y += 6;
  doc.text(`Mythic Path: ${mythicPath}`, PAGE_W / 2, y, { align: 'center' });

  // ===== PROLOGUE =====
  doc.addPage();
  y = MARGIN_T;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  setColor(doc, COLOR_ACCENT);
  doc.text('Prologue', MARGIN_L, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setColor(doc, COLOR_BODY);
  y = writeWrapped(doc, storybook.prologue, MARGIN_L, y, TEXT_W, LINE_H);
  y += 8;

  // ===== CHAPTERS =====
  for (const chapter of storybook.chapters) {
    // Check if enough room for heading + some text
    if (y > PAGE_H - MARGIN_B - 30) {
      doc.addPage();
      y = MARGIN_T;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    setColor(doc, COLOR_TITLE);
    y = writeWrapped(doc, chapter.title, MARGIN_L, y, TEXT_W, 7);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    setColor(doc, COLOR_BODY);
    y = writeWrapped(doc, chapter.body, MARGIN_L, y, TEXT_W, LINE_H);
    y += 10;
  }

  // ===== EPILOGUE =====
  if (y > PAGE_H - MARGIN_B - 30) {
    doc.addPage();
    y = MARGIN_T;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  setColor(doc, COLOR_ACCENT);
  doc.text('Epilogue', MARGIN_L, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setColor(doc, COLOR_BODY);
  y = writeWrapped(doc, storybook.epilogue, MARGIN_L, y, TEXT_W, LINE_H);
  y += 10;

  // ===== RITUALS APPENDIX =====
  if (rituals.length > 0) {
    doc.addPage();
    y = MARGIN_T;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    setColor(doc, COLOR_ACCENT);
    doc.text('Chamber Rituals', MARGIN_L, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(doc, COLOR_MUTED);
    doc.text('Practices aligned with each chamber of your relationship', MARGIN_L, y);
    y += 10;

    for (const ritual of rituals) {
      if (y > PAGE_H - MARGIN_B - 40) {
        doc.addPage();
        y = MARGIN_T;
      }

      // Chamber + Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      setColor(doc, COLOR_TITLE);
      doc.text(`${ritual.chamber}: ${ritual.title}`, MARGIN_L, y);
      y += 6;

      // Intent
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      setColor(doc, COLOR_MUTED);
      y = writeWrapped(doc, ritual.intent, MARGIN_L, y, TEXT_W, 5);
      y += 3;

      // Instructions
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      setColor(doc, COLOR_BODY);
      for (let j = 0; j < ritual.instructions.length; j++) {
        const step = `${j + 1}. ${ritual.instructions[j]}`;
        y = writeWrapped(doc, step, MARGIN_L + 4, y, TEXT_W - 4, 5);
        y += 1;
      }
      y += 8;
    }
  }

  // ===== FOOTER ON LAST PAGE =====
  doc.setFontSize(8);
  setColor(doc, COLOR_MUTED);
  doc.text(
    'Generated by GENESIS AstroProfile \u2014 The myth is not finished; it is being lived.',
    PAGE_W / 2,
    PAGE_H - 12,
    { align: 'center' },
  );

  // ===== SAVE =====
  const filename = `destiny-storybook-${nameA.toLowerCase().replace(/\s+/g, '-')}-${nameB.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  doc.save(filename);
}
