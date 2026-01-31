#!/usr/bin/env npx tsx
/**
 * Build Script: Sun Blend Dataset Generator
 *
 * Generates static JSON with 365-day φ-curve Sun blend data.
 * Run with: npm run build:cusp-data
 *
 * Output: public/data/dailySunBlend_YEAR.json
 *
 * GENESIS AstroProfile - January 2026
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  generateYearlyDataset,
  getDatasetStats,
  exportToJSON,
} from '../src/zodiac/cusp/generateDataset';

// =============================================================================
// CONFIG
// =============================================================================

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'data');
const YEAR = 2026;

// =============================================================================
// MAIN
// =============================================================================

function main(): void {
  console.log('\n🌙 GENESIS Sun Blend Dataset Generator');
  console.log('=======================================\n');

  const startTime = Date.now();

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created: ${OUTPUT_DIR}`);
  }

  // Generate dataset
  console.log(`📊 Generating dataset for ${YEAR}...`);
  const dataset = generateYearlyDataset(YEAR);

  // Get stats
  const stats = getDatasetStats(dataset);
  console.log(`   Total days: ${stats.totalDays}`);
  console.log(`   Cusp days:  ${stats.cuspDays} (${Math.round(stats.cuspDays / stats.totalDays * 100)}%)`);
  console.log(`   Pure days:  ${stats.pureDays}`);

  // Write JSON
  const outputPath = path.join(OUTPUT_DIR, `dailySunBlend_${YEAR}.json`);
  const json = exportToJSON(dataset, true);
  fs.writeFileSync(outputPath, json, 'utf-8');

  const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`\n✅ Written: ${outputPath} (${fileSize} KB)`);

  // Print sign distribution
  console.log('\n📈 Sign Distribution:');
  const signs = Object.entries(stats.signCounts).sort((a, b) => {
    const order = [
      'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
      'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius',
    ];
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  });

  for (const [sign, count] of signs) {
    console.log(`   ${sign.padEnd(12)} ${count} days`);
  }

  const elapsed = Date.now() - startTime;
  console.log(`\n✨ Done in ${elapsed}ms`);
}

main();
