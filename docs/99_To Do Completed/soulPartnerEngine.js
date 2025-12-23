/**
 * GENESIS SoulPartner Design Engine
 * 
 * Iterative systems-based matching algorithm
 * Builds partner's four pillars one at a time, evaluating holistic system harmony
 * 
 * @version 1.0
 * @date December 23, 2025
 * @author Brother Sonnet with Father Ticky
 */

const {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  getElement,
  getPolarity,
  getAnimal,
  getHarmonyTrinity,
  isSameTrinity,
  getElementCompatibility,
  getElementRelationship,
  getAnimalCompatibility,
  getPolarityCompatibility,
  calculatePillarCompatibility
} = require('./baziConstants');

// ============================================================================
// MAIN SOULPARTNER DESIGN FUNCTION
// ============================================================================

/**
 * Design optimal SoulPartner based on user's BaZi profile
 * 
 * @param {Object} userProfile - User's four pillars
 * @param {Object} userProfile.year - Year pillar {stem, branch}
 * @param {Object} userProfile.month - Month pillar {stem, branch}
 * @param {Object} userProfile.day - Day pillar {stem, branch}
 * @param {Object} userProfile.hour - Hour pillar {stem, branch}
 * @returns {Object} Optimal partner profile with compatibility analysis
 */
function designSoulPartner(userProfile) {
  console.log('\n' + '='.repeat(70));
  console.log('GENESIS SOULPARTNER DESIGN ENGINE');
  console.log('='.repeat(70));
  console.log('\n📊 User Profile:');
  console.log(formatProfile(userProfile));
  
  // Initialize partner profile
  const partner = {
    year: null,
    month: null,
    day: null,
    hour: null
  };
  
  const analysisLog = [];
  
  // STEP 1: Determine Day Pillar (70% weight)
  console.log('\n' + '-'.repeat(70));
  console.log('STEP 1: DETERMINING DAY PILLAR (70% WEIGHT)');
  console.log('-'.repeat(70));
  
  const dayAnalysis = selectDayPillar(userProfile);
  partner.day = dayAnalysis.selected;
  analysisLog.push(dayAnalysis);
  
  console.log(`\n✓ Selected Day Pillar: ${partner.day.stem}${partner.day.branch}`);
  console.log(`  Score: ${(dayAnalysis.score * 100).toFixed(1)}%`);
  console.log(`  Reason: ${dayAnalysis.reason}`);
  
  // STEP 2: Determine Hour Pillar (15% weight)
  console.log('\n' + '-'.repeat(70));
  console.log('STEP 2: DETERMINING HOUR PILLAR (15% WEIGHT)');
  console.log('Evaluating Day+Hour system synergy...');
  console.log('-'.repeat(70));
  
  const hourAnalysis = selectHourPillar(userProfile, partner.day);
  partner.hour = hourAnalysis.selected;
  analysisLog.push(hourAnalysis);
  
  console.log(`\n✓ Selected Hour Pillar: ${partner.hour.stem}${partner.hour.branch}`);
  console.log(`  Score: ${(hourAnalysis.score * 100).toFixed(1)}%`);
  console.log(`  Reason: ${hourAnalysis.reason}`);
  
  if (hourAnalysis.mirrorSoul) {
    console.log(`  🌟 MIRROR SOUL CONFIGURATION DETECTED!`);
  }
  
  // STEP 3: Determine Month Pillar (10% weight)
  console.log('\n' + '-'.repeat(70));
  console.log('STEP 3: DETERMINING MONTH PILLAR (10% WEIGHT)');
  console.log('Evaluating Day+Hour+Month system harmony...');
  console.log('-'.repeat(70));
  
  const monthAnalysis = selectMonthPillar(userProfile, partner.day, partner.hour);
  partner.month = monthAnalysis.selected;
  analysisLog.push(monthAnalysis);
  
  console.log(`\n✓ Selected Month Pillar: ${partner.month.stem}${partner.month.branch}`);
  console.log(`  Score: ${(monthAnalysis.score * 100).toFixed(1)}%`);
  console.log(`  Reason: ${monthAnalysis.reason}`);
  
  // STEP 4: Determine Year Pillar (5% weight)
  console.log('\n' + '-'.repeat(70));
  console.log('STEP 4: DETERMINING YEAR PILLAR (5% WEIGHT)');
  console.log('Completing constitutional system...');
  console.log('-'.repeat(70));
  
  const yearAnalysis = selectYearPillar(userProfile, partner.day, partner.hour, partner.month);
  partner.year = yearAnalysis.selected;
  analysisLog.push(yearAnalysis);
  
  console.log(`\n✓ Selected Year Pillar: ${partner.year.stem}${partner.year.branch}`);
  console.log(`  Score: ${(yearAnalysis.score * 100).toFixed(1)}%`);
  console.log(`  Reason: ${yearAnalysis.reason}`);
  
  // Calculate final compatibility
  const finalCompatibility = calculateFinalCompatibility(userProfile, partner, analysisLog);
  
  // Generate complete analysis
  const result = {
    partner: partner,
    compatibility: finalCompatibility,
    analysisLog: analysisLog,
    summary: generateSummary(userProfile, partner, finalCompatibility)
  };
  
  // Print final results
  printFinalResults(userProfile, result);
  
  return result;
}

// ============================================================================
// STEP 1: DAY PILLAR SELECTION (70%)
// ============================================================================

function selectDayPillar(userProfile) {
  const userDayElement = getElement(userProfile.day.stem);
  const userDayAnimal = getAnimal(userProfile.day.branch);
  const userDayPolarity = getPolarity(userProfile.day.stem);
  
  console.log(`\n🌱 User Day Master: ${userProfile.day.stem} (${userDayPolarity} ${userDayElement})`);
  console.log(`🐾 User Day Animal: ${userProfile.day.branch} (${userDayAnimal})`);
  
  // Find complementary element
  console.log(`\n🔍 Finding complementary element for ${userDayElement}...`);
  
  const elementCandidates = [];
  
  for (const [stem, stemData] of Object.entries(HEAVENLY_STEMS)) {
    if (stemData.polarity === userDayPolarity) { // Prefer same polarity (Yin-Yin or Yang-Yang)
      const relationship = getElementRelationship(userDayElement, stemData.element);
      if (relationship.type === 'GENERATIVE' || relationship.type === 'GENERATIVE_REVERSE') {
        elementCandidates.push({
          stem: stem,
          element: stemData.element,
          score: relationship.score,
          description: relationship.description
        });
      }
    }
  }
  
  // Sort by score
  elementCandidates.sort((a, b) => b.score - a.score);
  
  console.log(`\nTop element matches:`);
  elementCandidates.slice(0, 3).forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.stem} (${c.element}) - Score: ${(c.score * 100).toFixed(0)}%`);
    console.log(`     ${c.description}`);
  });
  
  const selectedElement = elementCandidates[0];
  
  // Find compatible animal within selected element
  console.log(`\n🔍 Finding compatible animal for ${userDayAnimal}...`);
  console.log(`   Looking within ${selectedElement.element} element...`);
  
  const userTrinity = getHarmonyTrinity(userDayAnimal);
  console.log(`   User's Harmony Trinity: ${userTrinity.name} (${userTrinity.animals.join(', ')})`);
  
  const animalCandidates = [];
  
  for (const [branch, branchData] of Object.entries(EARTHLY_BRANCHES)) {
    const animalScore = getAnimalCompatibility(userDayAnimal, branchData.animal);
    const sameTrinity = isSameTrinity(userDayAnimal, branchData.animal);
    
    animalCandidates.push({
      branch: branch,
      animal: branchData.animal,
      score: animalScore,
      sameTrinity: sameTrinity,
      combinedStem: selectedElement.stem
    });
  }
  
  // Sort by score
  animalCandidates.sort((a, b) => b.score - a.score);
  
  console.log(`\nTop animal matches:`);
  animalCandidates.slice(0, 5).forEach((c, i) => {
    const trinityMark = c.sameTrinity ? ' ✨ SAME TRINITY' : '';
    console.log(`  ${i + 1}. ${c.animal} (${c.branch}) - Score: ${(c.score * 100).toFixed(0)}%${trinityMark}`);
  });
  
  const selectedAnimal = animalCandidates[0];
  
  // Calculate combined score
  const dayCompatibility = calculatePillarCompatibility(
    userProfile.day,
    { stem: selectedElement.stem, branch: selectedAnimal.branch }
  );
  
  return {
    selected: {
      stem: selectedElement.stem,
      branch: selectedAnimal.branch
    },
    score: dayCompatibility.score,
    reason: `${selectedElement.element} ${selectedAnimal.animal}: Element harmony (${selectedElement.description}) + Animal compatibility (${selectedAnimal.sameTrinity ? 'Same Harmony Trinity' : 'Good match'})`,
    candidates: {
      elements: elementCandidates.slice(0, 3),
      animals: animalCandidates.slice(0, 5)
    },
    breakdown: dayCompatibility.breakdown
  };
}

// ============================================================================
// STEP 2: HOUR PILLAR SELECTION (15%)
// ============================================================================

function selectHourPillar(userProfile, partnerDay) {
  console.log(`\n🔍 Analyzing Day+Hour system synergy...`);
  console.log(`\nUser's System:`);
  console.log(`  Day:  ${userProfile.day.stem}${userProfile.day.branch}`);
  console.log(`  Hour: ${userProfile.hour.stem}${userProfile.hour.branch}`);
  console.log(`\nPartner's System (so far):`);
  console.log(`  Day:  ${partnerDay.stem}${partnerDay.branch}`);
  console.log(`  Hour: ???`);
  
  // Check for mirror soul configuration
  const userDayMatches = (userProfile.day.stem === partnerDay.stem && 
                          userProfile.day.branch === partnerDay.branch);
  const userHourMatches = false; // To be tested
  
  console.log(`\n🌟 Checking for Mirror Soul configuration...`);
  console.log(`   User's Hour (${userProfile.hour.stem}${userProfile.hour.branch}) = Partner's Day (${partnerDay.stem}${partnerDay.branch})? ${userProfile.hour.stem === partnerDay.stem && userProfile.hour.branch === partnerDay.branch ? 'YES! ✓' : 'No'}`);
  
  // Test mirror configuration first
  const mirrorCandidate = {
    stem: userProfile.day.stem,
    branch: userProfile.day.branch
  };
  
  const mirrorScore = evaluateHourPillarSystem(userProfile, partnerDay, mirrorCandidate);
  
  // Test other candidates
  const candidates = [];
  
  // Generate alternative hour pillars
  const partnerDayElement = getElement(partnerDay.stem);
  const partnerDayAnimal = getAnimal(partnerDay.branch);
  
  // Same animal as Day (consistency)
  const sameAnimalBranch = partnerDay.branch;
  
  // Water element (nourishment)
  const waterStems = Object.entries(HEAVENLY_STEMS)
    .filter(([stem, data]) => data.element === 'Water' && data.polarity === 'Yin')
    .map(([stem]) => stem);
  
  // Wood element (resonance with user if user is Wood)
  const woodStems = Object.entries(HEAVENLY_STEMS)
    .filter(([stem, data]) => data.element === 'Wood' && data.polarity === 'Yin')
    .map(([stem]) => stem);
  
  // Test alternatives
  if (waterStems.length > 0) {
    candidates.push({
      stem: waterStems[0],
      branch: sameAnimalBranch,
      type: 'Water nourishment',
      score: evaluateHourPillarSystem(userProfile, partnerDay, { stem: waterStems[0], branch: sameAnimalBranch })
    });
  }
  
  if (woodStems.length > 0 && woodStems[0] !== mirrorCandidate.stem) {
    candidates.push({
      stem: woodStems[0],
      branch: sameAnimalBranch,
      type: 'Wood resonance',
      score: evaluateHourPillarSystem(userProfile, partnerDay, { stem: woodStems[0], branch: sameAnimalBranch })
    });
  }
  
  // Add mirror candidate
  candidates.push({
    stem: mirrorCandidate.stem,
    branch: mirrorCandidate.branch,
    type: 'Mirror Soul',
    score: mirrorScore,
    isMirror: true
  });
  
  // Sort by score
  candidates.sort((a, b) => b.score - a.score);
  
  console.log(`\n📊 Hour Pillar Candidates:`);
  candidates.forEach((c, i) => {
    const mirrorMark = c.isMirror ? ' 🌟 MIRROR' : '';
    console.log(`  ${i + 1}. ${c.stem}${c.branch} (${c.type}) - System Score: ${(c.score * 100).toFixed(1)}%${mirrorMark}`);
  });
  
  const selected = candidates[0];
  
  return {
    selected: {
      stem: selected.stem,
      branch: selected.branch
    },
    score: selected.score,
    reason: `${selected.type}: Creates ${selected.isMirror ? 'perfect mirror configuration with 85% constitutional overlap' : 'strong bidirectional energy flow'}`,
    mirrorSoul: selected.isMirror,
    candidates: candidates
  };
}

/**
 * Evaluate Hour Pillar in context of Day+Hour system
 */
function evaluateHourPillarSystem(userProfile, partnerDay, candidateHour) {
  // Check bidirectional flows
  const userDayElement = getElement(userProfile.day.stem);
  const userHourElement = getElement(userProfile.hour.stem);
  const partnerDayElement = getElement(partnerDay.stem);
  const candidateHourElement = getElement(candidateHour.stem);
  
  // Flow 1: User Day → Partner Day
  const flow1 = getElementCompatibility(userDayElement, partnerDayElement);
  
  // Flow 2: Partner Day → User Day
  const flow2 = getElementCompatibility(partnerDayElement, userDayElement);
  
  // Flow 3: User Hour → Candidate Hour
  const flow3 = getElementCompatibility(userHourElement, candidateHourElement);
  
  // Flow 4: Candidate Hour → User Day (nourishment to user's core)
  const flow4 = getElementCompatibility(candidateHourElement, userDayElement);
  
  // Check for mirror configuration
  const isMirror = (userProfile.day.stem === candidateHour.stem && 
                    userProfile.day.branch === candidateHour.branch &&
                    userProfile.hour.stem === partnerDay.stem &&
                    userProfile.hour.branch === partnerDay.branch);
  
  // Calculate system score
  let systemScore = (flow1 + flow2 + flow3 + flow4) / 4;
  
  // Bonus for bidirectional flows
  if (flow1 > 0.8 && flow2 > 0.8) systemScore += 0.1; // Day-to-Day bidirectional
  if (flow4 > 0.8) systemScore += 0.05; // Hour nourishes User Day
  
  // Huge bonus for mirror configuration
  if (isMirror) systemScore += 0.3;
  
  // Cap at 1.0
  systemScore = Math.min(systemScore, 1.0);
  
  return systemScore;
}

// ============================================================================
// STEP 3: MONTH PILLAR SELECTION (10%)
// ============================================================================

function selectMonthPillar(userProfile, partnerDay, partnerHour) {
  console.log(`\n🔍 Evaluating Day+Hour+Month system harmony...`);
  console.log(`\nPartner's system so far:`);
  console.log(`  Day:  ${partnerDay.stem}${partnerDay.branch}`);
  console.log(`  Hour: ${partnerHour.stem}${partnerHour.branch}`);
  
  const candidates = [];
  
  // Get partner's Day animal for trinity matching
  const partnerDayAnimal = getAnimal(partnerDay.branch);
  const partnerTrinity = getHarmonyTrinity(partnerDayAnimal);
  
  console.log(`\n🎯 Looking for Month Pillar that completes elemental cycle...`);
  console.log(`   Partner's Trinity: ${partnerTrinity.name} (${partnerTrinity.animals.join(', ')})`);
  
  // Test different element options
  const testElements = ['Wood', 'Fire', 'Water', 'Earth', 'Metal'];
  
  for (const element of testElements) {
    // Get Yin stem for this element
    const stem = Object.entries(HEAVENLY_STEMS)
      .find(([s, data]) => data.element === element && data.polarity === 'Yin')?.[0];
    
    if (!stem) continue;
    
    // Test with trinity animals
    for (const trinityAnimal of partnerTrinity.animals) {
      const branch = Object.entries(EARTHLY_BRANCHES)
        .find(([b, data]) => data.animal === trinityAnimal)?.[0];
      
      if (!branch) continue;
      
      const monthPillar = { stem, branch };
      const score = evaluateMonthPillarSystem(userProfile, partnerDay, partnerHour, monthPillar);
      
      candidates.push({
        stem,
        branch,
        element,
        animal: trinityAnimal,
        score: score,
        inTrinity: true
      });
    }
  }
  
  // Sort by score
  candidates.sort((a, b) => b.score - a.score);
  
  console.log(`\n📊 Month Pillar Candidates (Top 5):`);
  candidates.slice(0, 5).forEach((c, i) => {
    const trinityMark = c.inTrinity ? ' ✨ TRINITY' : '';
    console.log(`  ${i + 1}. ${c.stem}${c.branch} (${c.element} ${c.animal}) - Score: ${(c.score * 100).toFixed(1)}%${trinityMark}`);
  });
  
  const selected = candidates[0];
  
  return {
    selected: {
      stem: selected.stem,
      branch: selected.branch
    },
    score: selected.score,
    reason: `${selected.element} ${selected.animal}: Completes generative cycle and maintains ${partnerTrinity.name} trinity harmony`,
    candidates: candidates.slice(0, 5)
  };
}

/**
 * Evaluate Month Pillar in context of Day+Hour+Month system
 */
function evaluateMonthPillarSystem(userProfile, partnerDay, partnerHour, candidateMonth) {
  const dayElement = getElement(partnerDay.stem);
  const hourElement = getElement(partnerHour.stem);
  const monthElement = getElement(candidateMonth.stem);
  
  // Check elemental flow: Month → Day
  const monthToDay = getElementCompatibility(monthElement, dayElement);
  
  // Check elemental flow: Hour → Month (if applicable)
  const hourToMonth = getElementCompatibility(hourElement, monthElement);
  
  // Check if creates generative cycle
  const isGenerativeCycle = (
    (monthElement === 'Wood' && dayElement === 'Fire') ||
    (monthElement === 'Water' && dayElement === 'Wood') ||
    (hourElement === 'Water' && monthElement === 'Wood' && dayElement === 'Fire')
  );
  
  // Check animal trinity
  const monthAnimal = getAnimal(candidateMonth.branch);
  const dayAnimal = getAnimal(partnerDay.branch);
  const hourAnimal = getAnimal(partnerHour.branch);
  
  const trinityCount = [monthAnimal, dayAnimal, hourAnimal]
    .filter((animal, index, arr) => {
      const trinity = getHarmonyTrinity(animal);
      return trinity && trinity.animals.includes(monthAnimal);
    }).length;
  
  // Calculate system score
  let systemScore = (monthToDay * 0.5) + (hourToMonth * 0.3);
  
  // Bonus for generative cycle
  if (isGenerativeCycle) systemScore += 0.2;
  
  // Bonus for trinity harmony
  if (trinityCount >= 2) systemScore += 0.15;
  if (trinityCount === 3) systemScore += 0.1; // All three in same trinity
  
  return Math.min(systemScore, 1.0);
}

// ============================================================================
// STEP 4: YEAR PILLAR SELECTION (5%)
// ============================================================================

function selectYearPillar(userProfile, partnerDay, partnerHour, partnerMonth) {
  console.log(`\n🔍 Completing constitutional system...`);
  console.log(`\nPartner's system so far:`);
  console.log(`  Month: ${partnerMonth.stem}${partnerMonth.branch}`);
  console.log(`  Day:   ${partnerDay.stem}${partnerDay.branch}`);
  console.log(`  Hour:  ${partnerHour.stem}${partnerHour.branch}`);
  
  const candidates = [];
  
  // Get current elements
  const monthElement = getElement(partnerMonth.stem);
  const dayElement = getElement(partnerDay.stem);
  const hourElement = getElement(partnerHour.stem);
  
  console.log(`\n🎯 Current elemental composition:`);
  console.log(`   Month: ${monthElement}`);
  console.log(`   Day:   ${dayElement}`);
  console.log(`   Hour:  ${hourElement}`);
  
  // Find element that completes the cycle
  const testElements = ['Wood', 'Fire', 'Water', 'Earth', 'Metal'];
  
  for (const element of testElements) {
    const stem = Object.entries(HEAVENLY_STEMS)
      .find(([s, data]) => data.element === element && data.polarity === 'Yin')?.[0];
    
    if (!stem) continue;
    
    // Test with same animal as Day (ancestral consistency) or trinity animals
    const dayAnimal = getAnimal(partnerDay.branch);
    const dayBranch = partnerDay.branch;
    
    const yearPillar = { stem, branch: dayBranch };
    const score = evaluateYearPillarSystem(userProfile, partnerDay, partnerHour, partnerMonth, yearPillar);
    
    candidates.push({
      stem,
      branch: dayBranch,
      element,
      animal: dayAnimal,
      score: score
    });
  }
  
  // Sort by score
  candidates.sort((a, b) => b.score - a.score);
  
  console.log(`\n📊 Year Pillar Candidates (Top 5):`);
  candidates.slice(0, 5).forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.stem}${c.branch} (${c.element} ${c.animal}) - Score: ${(c.score * 100).toFixed(1)}%`);
  });
  
  const selected = candidates[0];
  
  return {
    selected: {
      stem: selected.stem,
      branch: selected.branch
    },
    score: selected.score,
    reason: `${selected.element} ${selected.animal}: Provides ancestral foundation and completes full elemental cycle`,
    candidates: candidates.slice(0, 5)
  };
}

/**
 * Evaluate Year Pillar in context of complete four-pillar system
 */
function evaluateYearPillarSystem(userProfile, partnerDay, partnerHour, partnerMonth, candidateYear) {
  const yearElement = getElement(candidateYear.stem);
  const monthElement = getElement(partnerMonth.stem);
  const dayElement = getElement(partnerDay.stem);
  const hourElement = getElement(partnerHour.stem);
  
  // Check Year → Month flow
  const yearToMonth = getElementCompatibility(yearElement, monthElement);
  
  // Check if completes Water → Wood → Fire cycle
  const completesFullCycle = (
    yearElement === 'Water' && monthElement === 'Wood' && dayElement === 'Fire'
  );
  
  // Check elemental diversity
  const elements = [yearElement, monthElement, dayElement, hourElement];
  const uniqueElements = [...new Set(elements)];
  const diversity = uniqueElements.length / 5; // Max 5 elements
  
  // Calculate system score
  let systemScore = yearToMonth * 0.4;
  
  // Bonus for completing cycle
  if (completesFullCycle) systemScore += 0.4;
  
  // Bonus for elemental diversity
  systemScore += diversity * 0.2;
  
  return Math.min(systemScore, 1.0);
}

// ============================================================================
// FINAL COMPATIBILITY CALCULATION
// ============================================================================

function calculateFinalCompatibility(userProfile, partner, analysisLog) {
  // Base compatibility (weighted sum)
  const dayComp = calculatePillarCompatibility(userProfile.day, partner.day);
  const hourComp = calculatePillarCompatibility(userProfile.hour, partner.hour);
  const monthComp = calculatePillarCompatibility(userProfile.month, partner.month);
  const yearComp = calculatePillarCompatibility(userProfile.year, partner.year);
  
  const baseScore = 
    (dayComp.score * 0.70) +
    (hourComp.score * 0.15) +
    (monthComp.score * 0.10) +
    (yearComp.score * 0.05);
  
  // Bidirectional flow bonus
  const userDayElement = getElement(userProfile.day.stem);
  const partnerDayElement = getElement(partner.day.stem);
  const userHourElement = getElement(userProfile.hour.stem);
  const partnerHourElement = getElement(partner.hour.stem);
  
  let flowBonus = 0;
  if (getElementCompatibility(userDayElement, partnerDayElement) > 0.8) flowBonus += 0.05;
  if (getElementCompatibility(partnerDayElement, userDayElement) > 0.8) flowBonus += 0.05;
  if (getElementCompatibility(userHourElement, partnerHourElement) > 0.8) flowBonus += 0.03;
  if (getElementCompatibility(partnerHourElement, userDayElement) > 0.8) flowBonus += 0.03;
  
  // Mirror soul bonus
  let mirrorBonus = 0;
  const isMirror = (
    userProfile.day.stem === partner.hour.stem &&
    userProfile.day.branch === partner.hour.branch &&
    userProfile.hour.stem === partner.day.stem &&
    userProfile.hour.branch === partner.day.branch
  );
  
  if (isMirror) mirrorBonus = 0.15;
  
  const totalScore = Math.min(baseScore + flowBonus + mirrorBonus, 1.0);
  
  return {
    total: totalScore,
    base: baseScore,
    flowBonus: flowBonus,
    mirrorBonus: mirrorBonus,
    isMirrorSoul: isMirror,
    breakdown: {
      day: dayComp.score,
      hour: hourComp.score,
      month: monthComp.score,
      year: yearComp.score
    }
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatProfile(profile) {
  return `  Year:  ${profile.year.stem}${profile.year.branch} (${getElement(profile.year.stem)} ${getAnimal(profile.year.branch)})\n` +
         `  Month: ${profile.month.stem}${profile.month.branch} (${getElement(profile.month.stem)} ${getAnimal(profile.month.branch)})\n` +
         `  Day:   ${profile.day.stem}${profile.day.branch} (${getElement(profile.day.stem)} ${getAnimal(profile.day.branch)})\n` +
         `  Hour:  ${profile.hour.stem}${profile.hour.branch} (${getElement(profile.hour.stem)} ${getAnimal(profile.hour.branch)})`;
}

function generateSummary(userProfile, partner, compatibility) {
  const partnerElements = {
    year: getElement(partner.year.stem),
    month: getElement(partner.month.stem),
    day: getElement(partner.day.stem),
    hour: getElement(partner.hour.stem)
  };
  
  const partnerAnimals = {
    year: getAnimal(partner.year.branch),
    month: getAnimal(partner.month.branch),
    day: getAnimal(partner.day.branch),
    hour: getAnimal(partner.hour.branch)
  };
  
  // Check for trinity
  const trinityAnimals = Object.values(partnerAnimals);
  const trinitySet = new Set();
  trinityAnimals.forEach(animal => {
    const trinity = getHarmonyTrinity(animal);
    if (trinity) trinitySet.add(trinity.name);
  });
  
  return {
    profile: partner,
    elements: partnerElements,
    animals: partnerAnimals,
    compatibility: compatibility,
    isMirrorSoul: compatibility.isMirrorSoul,
    harmonyTrinities: [...trinitySet],
    personalityArchetype: generateArchetype(partnerElements, partnerAnimals)
  };
}

function generateArchetype(elements, animals) {
  // Simple archetype generation based on element distribution
  const elementCounts = {};
  Object.values(elements).forEach(e => {
    elementCounts[e] = (elementCounts[e] || 0) + 1;
  });
  
  const dominant = Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  const archetypes = {
    'Water': 'The Wise Sage',
    'Wood': 'The Gentle Artist',
    'Fire': 'The Passionate Creator',
    'Earth': 'The Grounding Nurturer',
    'Metal': 'The Precise Refiner'
  };
  
  return archetypes[dominant] || 'The Balanced Soul';
}

function printFinalResults(userProfile, result) {
  console.log('\n' + '='.repeat(70));
  console.log('FINAL RESULTS');
  console.log('='.repeat(70));
  
  console.log('\n🎯 OPTIMAL SOULPARTNER PROFILE:');
  console.log(formatProfile(result.partner));
  
  console.log(`\n💎 COMPATIBILITY ANALYSIS:`);
  console.log(`  Total Score: ${(result.compatibility.total * 100).toFixed(1)}%`);
  console.log(`  Base Score:  ${(result.compatibility.base * 100).toFixed(1)}%`);
  if (result.compatibility.flowBonus > 0) {
    console.log(`  Flow Bonus:  +${(result.compatibility.flowBonus * 100).toFixed(1)}%`);
  }
  if (result.compatibility.mirrorBonus > 0) {
    console.log(`  Mirror Bonus: +${(result.compatibility.mirrorBonus * 100).toFixed(1)}% 🌟`);
  }
  
  if (result.compatibility.isMirrorSoul) {
    console.log(`\n🌟 MIRROR SOUL CONFIGURATION ACHIEVED!`);
    console.log(`   Your Day  = Their Hour (${userProfile.day.stem}${userProfile.day.branch})`);
    console.log(`   Your Hour = Their Day  (${userProfile.hour.stem}${userProfile.hour.branch})`);
    console.log(`   Constitutional Overlap: 85%`);
  }
  
  console.log(`\n🎭 PERSONALITY ARCHETYPE: ${result.summary.personalityArchetype}`);
  
  console.log(`\n🌟 HARMONY TRINITIES: ${result.summary.harmonyTrinities.join(', ')}`);
  
  console.log('\n' + '='.repeat(70));
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  designSoulPartner,
  calculateFinalCompatibility
};
