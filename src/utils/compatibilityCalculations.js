// ═══════════════════════════════════════════════════════
// COMPATIBILITY CALCULATIONS - CONSTITUTIONAL SOULPARTNER ANALYSIS
// ═══════════════════════════════════════════════════════
// Created: Claude's 125th Birthday (Dec 3, 2025)
// Method: Pure Gold (35-minute execution)
// Purpose: Compare two profiles and calculate compatibility

import { calculateSeasonalStrength, getSeasonFromMonth } from './seasonalCalculations'

// ═══════════════════════════════════════════════════════
// MAIN COMPATIBILITY FUNCTION
// ═══════════════════════════════════════════════════════

export function calculateCompatibility(profileA, profileB) {
  // Get seasonal strength for both profiles
  const seasonA = getSeasonFromMonth(profileA.month.branch || profileA.month.earthlyBranch)
  const seasonB = getSeasonFromMonth(profileB.month.branch || profileB.month.earthlyBranch)
  
  const strengthA = calculateSeasonalStrength(profileA, seasonA)
  const strengthB = calculateSeasonalStrength(profileB, seasonB)
  
  // Calculate all compatibility dimensions
  const elementBalance = calculateElementBalance(strengthA, strengthB)
  const seasonalHarmony = calculateSeasonalHarmony(seasonA, seasonB)
  const qiStateSynergy = calculateQiStateSynergy(strengthA, strengthB)
  const yinYangBalance = calculateYinYangBalance(profileA, profileB)
  
  // Overall score (weighted)
  const overallScore = Math.round(
    elementBalance.score * 0.40 +
    seasonalHarmony.score * 0.30 +
    qiStateSynergy.score * 0.20 +
    yinYangBalance.score * 0.10
  )
  
  return {
    overallScore,
    rating: getRating(overallScore),
    elementBalance,
    seasonalHarmony,
    qiStateSynergy,
    yinYangBalance,
    profileA: {
      season: seasonA,
      strength: strengthA,
      name: profileA.name || 'Person A'
    },
    profileB: {
      season: seasonB,
      strength: strengthB,
      name: profileB.name || 'Person B'
    },
    insights: generateInsights(overallScore, elementBalance, seasonalHarmony, seasonA, seasonB)
  }
}

// ═══════════════════════════════════════════════════════
// ELEMENT BALANCE CALCULATION (40% weight)
// ═══════════════════════════════════════════════════════

function calculateElementBalance(strengthA, strengthB) {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  const complementarityPairs = []
  let totalComplementarity = 0
  
  elements.forEach(element => {
    const pctA = strengthA.percentages[element]
    const pctB = strengthB.percentages[element]
    
    // Complementarity = when one is strong and other is weak
    // Strong = >40%, Weak = <20%
    const isAStrong = pctA > 40
    const isBStrong = pctB > 40
    const isAWeak = pctA < 20
    const isBWeak = pctB < 20
    
    if ((isAStrong && isBWeak) || (isBStrong && isAWeak)) {
      const complementarityScore = Math.abs(pctA - pctB)
      complementarityPairs.push({
        element,
        personAPercent: pctA,
        personBPercent: pctB,
        score: complementarityScore,
        description: isAStrong 
          ? `Person A's ${element} (${Math.round(pctA)}%) fills Person B's gap (${Math.round(pctB)}%)`
          : `Person B's ${element} (${Math.round(pctB)}%) fills Person A's gap (${Math.round(pctA)}%)`
      })
      totalComplementarity += complementarityScore
    }
  })
  
  // Check for shared weaknesses (both weak in same element)
  const sharedWeaknesses = []
  elements.forEach(element => {
    const pctA = strengthA.percentages[element]
    const pctB = strengthB.percentages[element]
    if (pctA < 20 && pctB < 20) {
      sharedWeaknesses.push({
        element,
        personAPercent: pctA,
        personBPercent: pctB,
        warning: `Both weak in ${element} (A: ${Math.round(pctA)}%, B: ${Math.round(pctB)}%) - seek external support`
      })
    }
  })
  
  // Score based on complementarity (max 100)
  const score = Math.min(100, totalComplementarity * 0.8)
  
  return {
    score,
    complementarityPairs,
    sharedWeaknesses,
    points: Math.round(score * 0.4) // Out of 40
  }
}

// ═══════════════════════════════════════════════════════
// SEASONAL HARMONY CALCULATION (30% weight)
// ═══════════════════════════════════════════════════════

function calculateSeasonalHarmony(seasonA, seasonB) {
  const seasonOrder = ['Spring', 'Summer', 'Autumn', 'Winter']
  
  // Handle Earth Season (Transition)
  const normalizedA = seasonA.name.includes('Earth') ? 'Earth Season' : seasonA.name
  const normalizedB = seasonB.name.includes('Earth') ? 'Earth Season' : seasonB.name
  
  // Same season = shared strengths AND weaknesses
  if (normalizedA === normalizedB) {
    return {
      score: 60, // Moderate score
      type: 'Same Season',
      description: 'You share both strengths and weaknesses. Seek complementary friends!',
      warning: '⚠️ Same season = need external balance',
      points: 18 // Out of 30
    }
  }
  
  // Earth Season is compatible with all (transition energy)
  if (normalizedA === 'Earth Season' || normalizedB === 'Earth Season') {
    return {
      score: 90,
      type: 'Transition Harmony',
      description: 'Earth Season brings grounding and smooth transitions',
      points: 27
    }
  }
  
  // Adjacent seasons (e.g., Winter → Spring)
  const indexA = seasonOrder.indexOf(normalizedA)
  const indexB = seasonOrder.indexOf(normalizedB)
  const distance = Math.abs(indexA - indexB)
  const isAdjacent = distance === 1 || distance === 3 // 3 means wrapping (Winter→Spring)
  
  if (isAdjacent) {
    return {
      score: 95,
      type: 'Adjacent Seasons',
      description: 'Natural flow and smooth transitions between your energies',
      details: `${normalizedA} flows into ${normalizedB}`,
      points: 28
    }
  }
  
  // Opposite seasons (e.g., Summer-Winter)
  if (distance === 2) {
    return {
      score: 85,
      type: 'Opposite Seasons',
      description: 'Complementary energies - you balance each other\'s extremes',
      details: `${normalizedA} and ${normalizedB} create complete annual cycle`,
      points: 25
    }
  }
  
  return {
    score: 75,
    type: 'Harmonious',
    description: 'Compatible seasonal energies',
    points: 22
  }
}

// ═══════════════════════════════════════════════════════
// QI STATE SYNERGY CALCULATION (20% weight)
// ═══════════════════════════════════════════════════════

function calculateQiStateSynergy(strengthA, strengthB) {
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  const synergies = []
  let totalSynergy = 0
  
  elements.forEach(element => {
    const qiA = strengthA.qiStates[element]
    const qiB = strengthB.qiStates[element]
    
    // Check if one person's strong state helps the other's weak state
    const multA = strengthA.multipliers[element]
    const multB = strengthB.multipliers[element]
    
    // Synergy when one is 王/相 (strong) and other is 囚/死 (weak)
    if ((multA >= 1.2 && multB <= 0.5) || (multB >= 1.2 && multA <= 0.5)) {
      const synergyScore = Math.abs(multA - multB) * 20
      synergies.push({
        element,
        personA: { state: qiA.nameZh, multiplier: multA },
        personB: { state: qiB.nameZh, multiplier: multB },
        score: synergyScore,
        description: multA > multB
          ? `Person A's ${qiA.nameZh} ${element} empowers Person B's ${qiB.nameZh} ${element}`
          : `Person B's ${qiB.nameZh} ${element} empowers Person A's ${qiA.nameZh} ${element}`
      })
      totalSynergy += synergyScore
    }
  })
  
  const score = Math.min(100, totalSynergy)
  
  return {
    score,
    synergies,
    points: Math.round(score * 0.2) // Out of 20
  }
}

// ═══════════════════════════════════════════════════════
// YIN/YANG BALANCE CALCULATION (10% weight)
// ═══════════════════════════════════════════════════════

function calculateYinYangBalance(profileA, profileB) {
  // Count Yin/Yang from heavenly stems
  const yinStems = ['乙', '丁', '己', '辛', '癸'] // Yin
  const yangStems = ['甲', '丙', '戊', '庚', '壬'] // Yang
  
  const countYinYang = (profile) => {
    let yin = 0
    let yang = 0
    
    // Check each pillar's heavenly stem
    ['year', 'month', 'day', 'hour'].forEach(pillar => {
      const stem = profile[pillar]?.stem?.chinese || profile[pillar]?.heavenlyStem?.chinese
      if (stem) {
        if (yinStems.includes(stem)) yin++
        else if (yangStems.includes(stem)) yang++
      }
    })
    
    return { yin, yang, total: yin + yang }
  }
  
  const balanceA = countYinYang(profileA)
  const balanceB = countYinYang(profileB)
  
  // Perfect balance is 50/50 combined
  const totalYin = balanceA.yin + balanceB.yin
  const totalYang = balanceA.yang + balanceB.yang
  const total = totalYin + totalYang
  const yinPercent = (totalYin / total) * 100
  
  // Score based on how close to 50/50
  const deviation = Math.abs(50 - yinPercent)
  const score = Math.max(0, 100 - (deviation * 2))
  
  return {
    score,
    personA: balanceA,
    personB: balanceB,
    combined: { yin: totalYin, yang: totalYang, yinPercent, yangPercent: 100 - yinPercent },
    description: score > 80 
      ? 'Excellent Yin/Yang balance - harmonious energy flow'
      : score > 60
        ? 'Good Yin/Yang balance with slight tendency toward ' + (yinPercent > 50 ? 'Yin' : 'Yang')
        : 'Imbalanced Yin/Yang - may need conscious balancing',
    points: Math.round(score * 0.1) // Out of 10
  }
}

// ═══════════════════════════════════════════════════════
// RATING SYSTEM
// ═══════════════════════════════════════════════════════

function getRating(score) {
  if (score >= 90) return {
    level: 'Exceptional SoulPartners',
    emoji: '🌟💛',
    color: '#FFD700',
    description: 'Rare constitutional harmony - you complete each other beautifully'
  }
  if (score >= 75) return {
    level: 'Strong Constitutional Match',
    emoji: '✨💙',
    color: '#4169E1',
    description: 'Excellent complementarity with natural ease and flow'
  }
  if (score >= 60) return {
    level: 'Good Complementarity',
    emoji: '💚',
    color: '#10b981',
    description: 'Solid foundation with mutual support and growth potential'
  }
  if (score >= 45) return {
    level: 'Moderate Match',
    emoji: '🟡',
    color: '#f59e0b',
    description: 'Compatible but requires conscious effort and understanding'
  }
  return {
    level: 'Challenging Partnership',
    emoji: '🟠',
    color: '#f97316',
    description: 'Significant differences - growth opportunity through conscious work'
  }
}

// ═══════════════════════════════════════════════════════
// INSIGHTS GENERATOR
// ═══════════════════════════════════════════════════════

function generateInsights(overallScore, elementBalance, seasonalHarmony, seasonA, seasonB) {
  const insights = []
  
  // Overall insight
  if (overallScore >= 90) {
    insights.push({
      type: 'positive',
      message: 'This is a rare constitutional match! Your elements naturally complement each other.'
    })
  }
  
  // Element complementarity insights
  if (elementBalance.complementarityPairs.length > 0) {
    const topPair = elementBalance.complementarityPairs[0]
    insights.push({
      type: 'positive',
      message: `⭐ ${topPair.description}`,
      category: 'elements'
    })
  }
  
  // Shared weakness warnings
  if (elementBalance.sharedWeaknesses.length > 0) {
    elementBalance.sharedWeaknesses.forEach(weakness => {
      insights.push({
        type: 'warning',
        message: `⚠️ ${weakness.warning}`,
        category: 'elements'
      })
    })
  }
  
  // Same season warning
  if (seasonalHarmony.type === 'Same Season') {
    insights.push({
      type: 'warning',
      message: '⚠️ Both born in the same season means you share weaknesses. Seek friends from complementary seasons to balance your partnership.',
      category: 'seasons'
    })
  }
  
  // Adjacent season celebration
  if (seasonalHarmony.type === 'Adjacent Seasons') {
    insights.push({
      type: 'positive',
      message: `✅ ${seasonA.name} → ${seasonB.name} creates natural flow and smooth transitions!`,
      category: 'seasons'
    })
  }
  
  return insights
}

// ═══════════════════════════════════════════════════════
// HELPER: GET WHAT EACH PERSON GIVES
// ═══════════════════════════════════════════════════════

export function getWhatYouGive(profile, strength) {
  const contributions = []
  
  // Find top 2 strongest elements
  const elements = Object.entries(strength.percentages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
  
  elements.forEach(([element, percent]) => {
    if (percent > 30) {
      const traits = getElementTraits(element)
      contributions.push(...traits)
    }
  })
  
  return contributions.slice(0, 4) // Top 4 contributions
}

function getElementTraits(element) {
  const traits = {
    Wood: ['Strategic planning', 'Long-term vision', 'Growth energy', 'Creative ideas'],
    Fire: ['Passionate energy', 'Emotional warmth', 'Enthusiasm', 'Inspiration'],
    Earth: ['Stable foundation', 'Practical support', 'Grounding presence', 'Nurturing care'],
    Metal: ['Analytical clarity', 'Precise execution', 'Quality standards', 'Structural thinking'],
    Water: ['Emotional depth', 'Flow & adaptability', 'Intuitive wisdom', 'Deep reflection']
  }
  return traits[element] || []
}
