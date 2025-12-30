#!/usr/bin/env node

/**
 * GENESIS MCP Server - Local Test Script
 * Tests all three tools with your actual Firebase data
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get userId from command line
const userId = process.argv[2];

if (!userId) {
  console.error('Usage: node test-server.js <userId>');
  console.error('Example: node test-server.js user_ticky_123');
  process.exit(1);
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('🧪 GENESIS MCP Server - Local Test');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`Testing with userId: ${userId}`);
console.log('═══════════════════════════════════════════════════════════════\n');

// Initialize Firebase
const serviceAccountPath = join(__dirname, '../firebase-credentials.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = getFirestore();

// Test functions
async function testUserConstitution() {
  console.log('📊 Testing: get_user_constitution');
  console.log('─────────────────────────────────────────────────────────────\n');
  
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();

    const constitution = {
      userId,
      identity: {
        displayName: userData.identity?.displayName || 'Unknown',
        birthDate: userData.birth?.date,
        birthTime: userData.birth?.time,
        birthLocation: userData.birth?.location,
      },
      fourPillars: userData.calculations?.fourPillars || null,
      elementBalance: userData.calculations?.elements || null,
      yinYangRatio: userData.calculations?.yinYang || null,
      westernAstrology: userData.calculations?.western || null,
      numerology: userData.calculations?.numerology || null,
      personality: {
        mbti: userData.personality?.mbti || null,
        bigFive: userData.personality?.bigFive || null,
        enneagram: userData.personality?.enneagram || null,
      },
    };

    console.log('✅ SUCCESS!\n');
    console.log(JSON.stringify(constitution, null, 2));
    return true;
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    return false;
  }
}

async function testBirthChart() {
  console.log('\n\n📅 Testing: get_birth_chart');
  console.log('─────────────────────────────────────────────────────────────\n');
  
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();

    const birthChart = {
      birthData: {
        date: userData.birth?.date,
        time: userData.birth?.time,
        location: userData.birth?.location,
        timezone: userData.birth?.timezone,
      },
      chineseAstrology: {
        fourPillars: userData.calculations?.fourPillars,
        dayMaster: userData.calculations?.dayMaster,
        seasonalQi: userData.calculations?.seasonalQi,
        tenGods: userData.calculations?.tenGods,
      },
      westernAstrology: {
        sun: userData.calculations?.western?.sun,
        moon: userData.calculations?.western?.moon,
        rising: userData.calculations?.western?.rising,
        houses: userData.calculations?.western?.houses,
      },
    };

    console.log('✅ SUCCESS!\n');
    console.log(JSON.stringify(birthChart, null, 2));
    return true;
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    return false;
  }
}

async function testElementAnalysis() {
  console.log('\n\n🔥 Testing: get_element_analysis');
  console.log('─────────────────────────────────────────────────────────────\n');
  
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();
    const elements = userData.calculations?.elements || {};

    function getDominant(els) {
      const entries = Object.entries(els);
      if (entries.length === 0) return 'unknown';
      const sorted = entries.sort((a, b) => b[1] - a[1]);
      return sorted[0][0];
    }

    function getWeakest(els) {
      const entries = Object.entries(els);
      if (entries.length === 0) return 'unknown';
      const sorted = entries.sort((a, b) => a[1] - b[1]);
      return sorted[0][0];
    }

    const analysis = {
      elements: {
        wood: elements.wood || 0,
        fire: elements.fire || 0,
        earth: elements.earth || 0,
        metal: elements.metal || 0,
        water: elements.water || 0,
      },
      dominantElement: getDominant(elements),
      weakestElement: getWeakest(elements),
      interpretation: {
        dominant: `Strongest: ${getDominant(elements)} (${elements[getDominant(elements)]}%)`,
        weakest: `Weakest: ${getWeakest(elements)} (${elements[getWeakest(elements)]}%)`,
      }
    };

    console.log('✅ SUCCESS!\n');
    console.log(JSON.stringify(analysis, null, 2));
    return true;
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  const results = {
    constitution: await testUserConstitution(),
    birthChart: await testBirthChart(),
    elementAnalysis: await testElementAnalysis(),
  };

  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('📊 TEST RESULTS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Constitution:      ${results.constitution ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Birth Chart:       ${results.birthChart ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Element Analysis:  ${results.elementAnalysis ? '✅ PASS' : '❌ FAIL'}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Ready for deployment.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check errors above.\n');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
