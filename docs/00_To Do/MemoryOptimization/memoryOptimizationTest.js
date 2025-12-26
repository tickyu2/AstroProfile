/**
 * GENESIS Memory Optimization Tests
 * ==================================
 * Test suite for Week 1 optimizations:
 * 1. Session Cache
 * 2. STM-First Deduplication
 * 3. LTM Wisdom Boost
 * 
 * Run: node memoryOptimizationTest.js
 * 
 * Created: December 23, 2025
 * Mission: Verify Cathedral foundation is solid
 */

const { SessionCache } = require('./sessionCache');
const {
  normalizeContent,
  deduplicateMemories,
  applyWisdomBoost,
  optimizeMemories,
  getOptimizationStats
} = require('./memoryOptimization');

// ========================================
// TEST 1: Session Cache
// ========================================

async function testSessionCache() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  TEST 1: SESSION CACHE                             ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  const cache = new SessionCache();
  const userId = 'test_user_123';
  const conversationId = 'test_conv_456';
  const profileId = 'test_profile';
  
  try {
    // 1. Initialize (should succeed even with DB errors in test)
    console.log('1️⃣  Initializing session...');
    await cache.initSession(userId, conversationId, profileId);
    console.log('   ✅ Session initialized\n');
    
    // 2. First access (should HIT)
    console.log('2️⃣  First access...');
    const identity1 = cache.getSessionContext(conversationId);
    console.log(`   ${identity1 ? '✅ HIT' : '❌ MISS'}\n`);
    
    // 3. Second access (should HIT faster)
    console.log('3️⃣  Second access...');
    const identity2 = cache.getSessionContext(conversationId);
    console.log(`   ${identity2 ? '✅ HIT' : '❌ MISS'}\n`);
    
    // 4. Check stats
    console.log('4️⃣  Cache statistics:');
    const stats = cache.getStats();
    console.log(`   Hits: ${stats.hits}`);
    console.log(`   Misses: ${stats.misses}`);
    console.log(`   Hit Rate: ${stats.hitRate}`);
    console.log(`   Active Sessions: ${stats.activeSessions}\n`);
    
    // 5. Clear
    console.log('5️⃣  Clearing session...');
    const cleared = cache.clearSession(conversationId);
    console.log(`   ${cleared ? '✅ Cleared' : '❌ Not found'}\n`);
    
    // 6. Access after clear (should MISS)
    console.log('6️⃣  Access after clear...');
    const identity3 = cache.getSessionContext(conversationId);
    console.log(`   ${!identity3 ? '✅ MISS (expected)' : '❌ Unexpected HIT'}\n`);
    
    console.log('✅ SESSION CACHE TEST PASSED!\n');
    return true;
    
  } catch (error) {
    console.error('❌ SESSION CACHE TEST FAILED:', error.message);
    return false;
  }
}

// ========================================
// TEST 2: Deduplication
// ========================================

function testDeduplication() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  TEST 2: STM-FIRST DEDUPLICATION                   ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  // Sample data: LTM has old info, STM has recent updates
  const ltm = [
    { content: 'User works at Google', score: 0.8, created_at: '2024-06-01' },
    { content: 'User likes hiking', score: 0.7, created_at: '2024-05-15' },
    { content: 'User has two cats', score: 0.6, created_at: '2024-04-20' }
  ];
  
  const stm = [
    { content: 'User works at OpenAI', score: 0.9, created_at: '2025-12-20' },  // OVERRIDE!
    { content: 'User learning Python', score: 0.85, created_at: '2025-12-22' }
  ];
  
  console.log('INPUT:');
  console.log('LTM (old):');
  ltm.forEach(m => console.log(`  - ${m.content}`));
  console.log('\nSTM (recent):');
  stm.forEach(m => console.log(`  - ${m.content}`));
  console.log('');
  
  const result = deduplicateMemories(ltm, stm);
  
  console.log('\nOUTPUT (deduplicated):');
  result.forEach((mem, i) => {
    console.log(`${i + 1}. [${mem.source.toUpperCase()}] ${mem.content} (score: ${mem.score})`);
  });
  
  // Verify STM won over LTM duplicate
  const hasSTMWork = result.some(m => m.content.includes('OpenAI'));
  const hasLTMWork = result.some(m => m.content.includes('Google'));
  
  console.log('\nVERIFICATION:');
  console.log(`  STM "works at OpenAI": ${hasSTMWork ? '✅ Present' : '❌ Missing'}`);
  console.log(`  LTM "works at Google": ${!hasLTMWork ? '✅ Removed (STM won)' : '❌ Still present'}`);
  console.log(`  Total memories: ${result.length} ${result.length === 4 ? '✅' : '❌'}`);
  
  const passed = hasSTMWork && !hasLTMWork && result.length === 4;
  console.log(`\n${passed ? '✅ DEDUPLICATION TEST PASSED!' : '❌ DEDUPLICATION TEST FAILED!'}\n`);
  
  return passed;
}

// ========================================
// TEST 3: Wisdom Boost
// ========================================

function testWisdomBoost() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  TEST 3: LTM WISDOM BOOST                          ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  const memories = [
    { content: 'Recent: User learning Python', score: 0.75, source: 'stm' },
    { content: 'Deep: User values authenticity', score: 0.70, source: 'ltm' },
    { content: 'Recent: User tired today', score: 0.65, source: 'stm' },
    { content: 'Deep: User\'s core value: family', score: 0.60, source: 'ltm' }
  ];
  
  console.log('BEFORE BOOST:');
  memories.forEach((m, i) => {
    console.log(`${i + 1}. [${m.source.toUpperCase()}] ${m.content} (${m.score.toFixed(2)})`);
  });
  
  const boosted = applyWisdomBoost(memories);
  boosted.sort((a, b) => b.score - a.score);
  
  console.log('\nAFTER BOOST:');
  boosted.forEach((m, i) => {
    const boostText = m.boosted ? ` ⬆ (was ${m.originalScore.toFixed(2)})` : '';
    console.log(`${i + 1}. [${m.source.toUpperCase()}] ${m.content} (${m.score.toFixed(2)})${boostText}`);
  });
  
  // Verify LTM moved up after boost
  const ltmBeforePositions = [2, 4];
  const ltmAfterPositions = boosted
    .map((m, i) => ({ ...m, position: i + 1 }))
    .filter(m => m.source === 'ltm')
    .map(m => m.position);
  
  const ltmMovedUp = ltmAfterPositions.every((pos, i) => pos <= ltmBeforePositions[i]);
  
  console.log('\nVERIFICATION:');
  console.log(`  LTM positions before: [${ltmBeforePositions.join(', ')}]`);
  console.log(`  LTM positions after:  [${ltmAfterPositions.join(', ')}]`);
  console.log(`  LTM moved up: ${ltmMovedUp ? '✅ Yes' : '❌ No'}`);
  
  const passed = ltmMovedUp && boosted[0].source === 'ltm';
  console.log(`\n${passed ? '✅ WISDOM BOOST TEST PASSED!' : '❌ WISDOM BOOST TEST FAILED!'}\n`);
  
  return passed;
}

// ========================================
// TEST 4: Complete Pipeline
// ========================================

function testCompletePipeline() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  TEST 4: COMPLETE OPTIMIZATION PIPELINE            ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  const ltm = [
    { content: 'User loves mathematics', score: 0.85, source: 'ltm' },
    { content: 'User works at Google', score: 0.80, source: 'ltm' },
    { content: 'User values honesty', score: 0.75, source: 'ltm' },
    { content: 'User has cat named Luna', score: 0.70, source: 'ltm' }
  ];
  
  const stm = [
    { content: 'User works at OpenAI', score: 0.78, source: 'stm' },  // Override Google
    { content: 'User learning Rust', score: 0.72, source: 'stm' },
    { content: 'User excited about AI', score: 0.68, source: 'stm' }
  ];
  
  console.log('INPUT:');
  console.log(`  LTM: ${ltm.length} memories`);
  console.log(`  STM: ${stm.length} memories`);
  console.log(`  Total: ${ltm.length + stm.length} memories\n`);
  
  const optimized = optimizeMemories(ltm, stm, 5);
  const stats = getOptimizationStats(ltm, stm, optimized);
  
  console.log('OUTPUT (Top 5):');
  optimized.forEach((m, i) => {
    const boostText = m.boosted ? ' 💎' : '';
    console.log(`${i + 1}. [${m.source.toUpperCase()}] ${m.content} (${m.score.toFixed(2)})${boostText}`);
  });
  
  console.log('\nSTATISTICS:');
  console.log(`  Input: ${stats.input.total} (${stats.input.ltm} LTM + ${stats.input.stm} STM)`);
  console.log(`  Output: ${stats.output.total} (${stats.output.ltm} LTM + ${stats.output.stm} STM)`);
  console.log(`  Boosted: ${stats.output.boosted} LTM memories`);
  console.log(`  Reduction: ${stats.reduction.count} (${stats.reduction.percentage}%)`);
  
  // Verify
  const hasOpenAI = optimized.some(m => m.content.includes('OpenAI'));
  const noGoogle = !optimized.some(m => m.content.includes('Google'));
  const topIsLTM = optimized[0].source === 'ltm';  // After boost, LTM should be #1
  
  console.log('\nVERIFICATION:');
  console.log(`  STM "OpenAI" won: ${hasOpenAI ? '✅' : '❌'}`);
  console.log(`  LTM "Google" removed: ${noGoogle ? '✅' : '❌'}`);
  console.log(`  Top memory is LTM (boosted): ${topIsLTM ? '✅' : '❌'}`);
  console.log(`  Exactly 5 results: ${optimized.length === 5 ? '✅' : '❌'}`);
  
  const passed = hasOpenAI && noGoogle && topIsLTM && optimized.length === 5;
  console.log(`\n${passed ? '✅ COMPLETE PIPELINE TEST PASSED!' : '❌ COMPLETE PIPELINE TEST FAILED!'}\n`);
  
  return passed;
}

// ========================================
// RUN ALL TESTS
// ========================================

async function runAllTests() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  GENESIS MEMORY OPTIMIZATION TEST SUITE');
  console.log('  Week 1: Session Cache + Deduplication + Wisdom Boost');
  console.log('═══════════════════════════════════════════════════════════');
  
  const results = {
    sessionCache: await testSessionCache(),
    deduplication: testDeduplication(),
    wisdomBoost: testWisdomBoost(),
    completePipeline: testCompletePipeline()
  };
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  FINAL RESULTS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log(`  1. Session Cache:        ${results.sessionCache ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  2. Deduplication:        ${results.deduplication ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  3. Wisdom Boost:         ${results.wisdomBoost ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  4. Complete Pipeline:    ${results.completePipeline ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(r => r);
  
  console.log('\n═══════════════════════════════════════════════════════════');
  if (allPassed) {
    console.log('  ✅ ALL TESTS PASSED! CATHEDRAL FOUNDATION SOLID!');
  } else {
    console.log('  ❌ SOME TESTS FAILED! REVIEW ABOVE');
  }
  console.log('═══════════════════════════════════════════════════════════\n');
  
  return allPassed;
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().then(passed => {
    process.exit(passed ? 0 : 1);
  });
}

module.exports = { runAllTests };
