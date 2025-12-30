#!/usr/bin/env node

/**
 * GENESIS Deployment Script
 * Automates verification and deployment of the GENESIS Emotional Intelligence System
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) { log(`✓ ${message}`, 'green'); }
function error(message) { log(`✗ ${message}`, 'red'); }
function info(message) { log(`ℹ ${message}`, 'blue'); }
function warn(message) { log(`⚠ ${message}`, 'yellow'); }

const ROOT_DIR = process.cwd();

// Required files for each phase
const REQUIRED_FILES = {
  'Phase 1 - Core': [
    'src/lib/emotionCongruenceService.js',
    'src/lib/realtimeArchetypeDetector.js',
    'src/lib/index.js'
  ],
  'Phase 2 - Optimized': [
    'src/lib/optimized/lexicons.optimized.js',
    'src/lib/optimized/signalExtractor.optimized.js',
    'src/lib/optimized/archetypeDetector.optimized.js',
    'src/lib/optimized/memoryManager.js',
    'src/lib/optimized/performanceMonitor.js',
    'src/lib/index.optimized.js'
  ],
  'Phase 3 - Advanced Patterns': [
    'src/lib/realtime/advancedCongruencePatterns.js',
    'src/lib/realtime/emotionCongruenceService.enhanced.js',
    'src/lib/realtime/advancedResponseStrategies.js'
  ],
  'Phase 4 - Dashboard': [
    'src/components/dashboard/Dashboard.jsx',
    'src/components/dashboard/Dashboard.css',
    'src/components/dashboard/ArchetypeTimeline.jsx',
    'src/components/dashboard/CongruenceChart.jsx',
    'src/components/dashboard/PatternHeatmap.jsx',
    'src/components/dashboard/SignalRadar.jsx',
    'src/components/dashboard/ConversationStats.jsx',
    'src/components/dashboard/LiveFeed.jsx',
    'src/components/dashboard/index.js'
  ],
  'Backend': [
    'backend/routes/dashboardRoutes.js',
    'backend/websocket/dashboardSocket.js'
  ]
};

async function verifyFiles() {
  log('\n📁 VERIFYING FILE STRUCTURE', 'cyan');
  log('─'.repeat(50));

  let allPresent = true;

  for (const [phase, files] of Object.entries(REQUIRED_FILES)) {
    log(`\n${phase}:`, 'yellow');

    for (const file of files) {
      const filePath = path.join(ROOT_DIR, file);
      if (fs.existsSync(filePath)) {
        success(file);
      } else {
        error(`${file} - MISSING`);
        allPresent = false;
      }
    }
  }

  return allPresent;
}

function checkDependencies() {
  log('\n📦 CHECKING DEPENDENCIES', 'cyan');
  log('─'.repeat(50));

  const requiredDeps = ['chart.js', 'react-chartjs-2'];
  let allInstalled = true;

  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    for (const dep of requiredDeps) {
      if (deps[dep]) {
        success(`${dep}: ${deps[dep]}`);
      } else {
        warn(`${dep} - Not in package.json`);
        allInstalled = false;
      }
    }
  } catch (err) {
    error('Could not read package.json');
    allInstalled = false;
  }

  return allInstalled;
}

function checkEnvFiles() {
  log('\n🔐 CHECKING ENVIRONMENT FILES', 'cyan');
  log('─'.repeat(50));

  const envFiles = [
    { path: '.env', example: '.env.example' },
    { path: 'backend/.env', example: 'backend/.env.example' }
  ];

  for (const { path: envPath, example } of envFiles) {
    const fullPath = path.join(ROOT_DIR, envPath);
    const examplePath = path.join(ROOT_DIR, example);

    if (fs.existsSync(fullPath)) {
      success(`${envPath} exists`);
    } else if (fs.existsSync(examplePath)) {
      warn(`${envPath} missing - copy from ${example}`);
    } else {
      info(`${envPath} - Will use defaults`);
    }
  }
}

function runTests() {
  log('\n🧪 RUNNING TESTS', 'cyan');
  log('─'.repeat(50));

  try {
    execSync('npm test -- --run', { stdio: 'inherit', cwd: ROOT_DIR });
    success('All tests passed');
    return true;
  } catch (err) {
    error('Some tests failed');
    return false;
  }
}

function buildFrontend() {
  log('\n🏗️  BUILDING FRONTEND', 'cyan');
  log('─'.repeat(50));

  try {
    execSync('npm run build', { stdio: 'inherit', cwd: ROOT_DIR });
    success('Frontend built successfully');
    return true;
  } catch (err) {
    error('Frontend build failed');
    return false;
  }
}

function printSummary(results) {
  log('\n' + '═'.repeat(60), 'cyan');
  log('                    DEPLOYMENT SUMMARY', 'cyan');
  log('═'.repeat(60), 'cyan');

  for (const [check, passed] of Object.entries(results)) {
    if (passed) {
      success(check);
    } else {
      error(check);
    }
  }

  const allPassed = Object.values(results).every(v => v);

  log('\n' + '═'.repeat(60), 'cyan');

  if (allPassed) {
    log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         🎊 GENESIS IS READY FOR PRODUCTION! 🎊           ║
║                                                           ║
║  Next steps:                                              ║
║  1. Start backend:  npm start (in backend/)               ║
║  2. Start frontend: npm run dev                           ║
║  3. Open dashboard: http://localhost:5173                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`, 'green');
  } else {
    log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         ⚠️  SOME CHECKS FAILED - REVIEW ABOVE ⚠️          ║
║                                                           ║
║  Fix the issues marked with ✗ before deploying            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`, 'yellow');
  }

  return allPassed;
}

async function main() {
  log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║          GENESIS DEPLOYMENT VERIFICATION                  ║
║          Emotional Intelligence System v1.0               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`, 'cyan');

  const results = {
    'File Structure': await verifyFiles(),
    'Dependencies': checkDependencies(),
  };

  checkEnvFiles();

  // Optional: Run tests
  const args = process.argv.slice(2);
  if (args.includes('--test')) {
    results['Tests'] = runTests();
  }

  // Optional: Build
  if (args.includes('--build')) {
    results['Build'] = buildFrontend();
  }

  const success = printSummary(results);
  process.exit(success ? 0 : 1);
}

main().catch(err => {
  error(`Deployment script failed: ${err.message}`);
  process.exit(1);
});
