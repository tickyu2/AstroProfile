/**
 * ═══════════════════════════════════════════════════════════════════════
 * SEASONAL GUIDANCE SYSTEM
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Actionable intelligence for each Element × Season combination
 * Answers Grok's challenge: "What the hell do I DO with this information?"
 * 
 * Structure: seasonalGuidance[element][season] = { strengths, weaknesses, relationships }
 */

// Season definitions
export const SEASONS = {
  Spring: {
    name: 'Spring',
    icon: '🌸',
    months: ['Tiger', 'Rabbit', 'Dragon'],
    ruler: 'Wood',
    multipliers: { Wood: 1.5, Fire: 1.2, Water: 0.8, Earth: 0.5, Metal: 0.2 }
  },
  Summer: {
    name: 'Summer',
    icon: '☀️',
    months: ['Snake', 'Horse', 'Goat'],
    ruler: 'Fire',
    multipliers: { Fire: 1.5, Earth: 1.2, Wood: 0.8, Metal: 0.5, Water: 0.2 }
  },
  Autumn: {
    name: 'Autumn',
    icon: '🍂',
    months: ['Monkey', 'Rooster', 'Dog'],
    ruler: 'Metal',
    multipliers: { Metal: 1.5, Water: 1.2, Earth: 0.8, Wood: 0.2, Fire: 0.5 }
  },
  Winter: {
    name: 'Winter',
    icon: '❄️',
    months: ['Pig', 'Rat', 'Ox'],
    ruler: 'Water',
    multipliers: { Water: 1.5, Wood: 1.2, Metal: 0.8, Fire: 0.2, Earth: 0.5 }
  }
}

export function getSeasonFromMonth(monthBranch) {
  // Handle if monthBranch is an object with english/name property
  const branchName = typeof monthBranch === 'string' ? monthBranch : 
                     (monthBranch?.english || monthBranch?.name || '')
  
  console.log('🔍 getSeasonFromMonth received:', monthBranch, '→ using:', branchName)
  
  for (const [seasonName, seasonData] of Object.entries(SEASONS)) {
    if (seasonData.months.includes(branchName)) {
      return seasonData
    }
  }
  
  console.warn('⚠️ Could not find season for month:', branchName, '- defaulting to Spring')
  return SEASONS.Spring // default
}

export function calculateSeasonalStrength(fourPillars, birthSeason) {
  // Count raw elements (weighted by pillar importance)
  const weights = { year: 0.05, month: 0.10, day: 0.70, hour: 0.15 }
  const rawCounts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 }
  
  const pillars = [
    { ...fourPillars.year, weight: weights.year },
    { ...fourPillars.month, weight: weights.month },
    { ...fourPillars.day, weight: weights.day },
    { ...fourPillars.hour, weight: weights.hour }
  ]
  
  pillars.forEach(pillar => {
    // Handle different possible property names
    const stemElement = pillar.heavenlyStem?.element || pillar.stem?.element
    const branchElement = pillar.earthlyBranch?.element || pillar.branch?.element
    
    if (stemElement && rawCounts.hasOwnProperty(stemElement)) {
      rawCounts[stemElement] += pillar.weight
    }
    if (branchElement && rawCounts.hasOwnProperty(branchElement)) {
      rawCounts[branchElement] += pillar.weight
    }
  })
  
  // Normalize to percentages
  const total = Object.values(rawCounts).reduce((sum, val) => sum + val, 0)
  const rawPercentages = {}
  Object.keys(rawCounts).forEach(element => {
    rawPercentages[element] = (rawCounts[element] / total) * 100
  })
  
  // Apply seasonal multipliers
  const multipliers = birthSeason.multipliers
  const adjustedCounts = {}
  Object.keys(rawCounts).forEach(element => {
    adjustedCounts[element] = rawCounts[element] * multipliers[element]
  })
  
  // Normalize adjusted to percentages
  const adjustedTotal = Object.values(adjustedCounts).reduce((sum, val) => sum + val, 0)
  const adjustedPercentages = {}
  Object.keys(adjustedCounts).forEach(element => {
    adjustedPercentages[element] = (adjustedCounts[element] / adjustedTotal) * 100
  })
  
  // Qi states
  const qiStates = {}
  Object.keys(rawCounts).forEach(element => {
    const mult = multipliers[element]
    if (mult >= 1.5) qiStates[element] = '王 Prosperous'
    else if (mult >= 1.2) qiStates[element] = '相 Strengthening'
    else if (mult >= 0.8) qiStates[element] = '休 Resting'
    else if (mult >= 0.5) qiStates[element] = '囚 Trapped'
    else qiStates[element] = '死 Dead'
  })
  
  return {
    raw: rawPercentages,
    adjusted: adjustedPercentages,
    multipliers,
    qiStates
  }
}

// Comprehensive actionable guidance
export const seasonalGuidance = {
  Wood: {
    Spring: {
      strengths: [
        "This is YOUR season! Your growth energy is at maximum. Start new projects now.",
        "Your creativity and expansion abilities are unstoppable in Spring. Think BIG.",
        "Networking and relationship-building come naturally - people are drawn to your vitality.",
        "Physical energy is high - perfect for exercise, outdoor activities, new routines."
      ],
      weaknesses: [
        "May grow too fast without solid foundation. Balance expansion with structure.",
        "Can be impulsive - have a Metal friend review major decisions.",
        "Might overwhelm others with your energy. Remember not everyone has your Spring power."
      ],
      relationships: "You need partners with strong Earth or Metal to ground your explosive growth. Fire partners amplify you (exciting but potentially exhausting)."
    },
    Summer: {
      strengths: [
        "Your Wood feeds the Fire of summer - you're still energized and productive.",
        "Great time for implementing ideas you started in Spring.",
        "Social and expressive - your ideas gain traction easily."
      ],
      weaknesses: [
        "Wood being consumed by Fire can feel draining if you overextend.",
        "Don't let Fire's demands burn you out - pace yourself.",
        "May feel pressure to perform - remember to recharge."
      ],
      relationships: "Seek Water partners who can replenish you when Fire season drains your reserves."
    },
    Autumn: {
      strengths: [
        "Time to harvest what you grew in Spring. Focus on completion, not starting.",
        "Your flexibility helps you adapt to Metal's cutting energy.",
        "Good period for refining and improving existing projects."
      ],
      weaknesses: [
        "Metal cuts Wood - you're vulnerable now. Avoid major confrontations.",
        "Decision-making may feel harder. Get support from strong Metal thinkers.",
        "Energy dips compared to Spring/Summer. Don't judge yourself harshly."
      ],
      relationships: "Autumn-born Metal partners provide the clarity you lack right now. Their season gives them power to protect you."
    },
    Winter: {
      strengths: [
        "Water nourishes Wood - this is your preparation and recovery season.",
        "Deep planning and visioning for next Spring's growth.",
        "Intuition and insight are heightened - trust your gut.",
        "Good time for learning, reading, strategic thinking."
      ],
      weaknesses: [
        "Visible growth is slow - can feel frustrating. Trust the underground work.",
        "May feel cold or isolated compared to your Spring vitality.",
        "Avoid forcing action - this is about preparation, not execution."
      ],
      relationships: "Water partners help you rest and restore. Fire partners keep you warm but may drain your preparation time."
    }
  },

  Fire: {
    Spring: {
      strengths: [
        "Wood feeds Fire - you're being nourished and strengthened all Spring.",
        "Charisma and enthusiasm build steadily toward your Summer peak.",
        "Great time for relationship-building and inspiring others."
      ],
      weaknesses: [
        "Not yet at full power - don't compare yourself to Summer you.",
        "May feel eager to shine but conditions aren't optimal yet. Patience.",
        "Wood people around you are thriving - don't compete, collaborate."
      ],
      relationships: "Wood partners fuel your Fire naturally. Earth partners ground your growing intensity."
    },
    Summer: {
      strengths: [
        "THIS IS YOUR TIME! Peak passion, energy, leadership, and visibility.",
        "Your ability to inspire and lead is unmatched right now.",
        "Performance, public speaking, creative expression - all at maximum.",
        "Others naturally follow your light. Be the sun you are."
      ],
      weaknesses: [
        "Can burn too bright and exhaust yourself or others.",
        "May be impulsive or overly confident. Ground yourself with Earth.",
        "Avoid burning bridges - your words carry extra fire right now.",
        "Everyone wants your energy - protect your boundaries."
      ],
      relationships: "You need Earth partners to ground your intensity and Water partners to prevent burnout. Fire+Fire can be explosive (exciting but unsustainable)."
    },
    Autumn: {
      strengths: [
        "Fire produces Earth in the cycle - you're still productive and warm.",
        "Good time for consolidating gains from Summer's peak.",
        "Maturity and wisdom replace Summer's raw intensity - this is evolved Fire."
      ],
      weaknesses: [
        "Metal's cutting energy can snuff out Fire - you're vulnerable.",
        "Energy drops noticeably from Summer. Don't fight it, adapt.",
        "May feel less charismatic or visible - it's the season, not you.",
        "Avoid major public launches or performances - not your optimal timing."
      ],
      relationships: "Seek Wood partners who can reignite you, or Earth partners who appreciate your warmth even when you're not blazing."
    },
    Winter: {
      strengths: [
        "Your Fire brings light to the darkest season - others need you.",
        "Inner work and deep transformation happen now.",
        "Refined passion - less explosive, more sustained warmth."
      ],
      weaknesses: [
        "Water threatens Fire - this is your most challenging season.",
        "Energy at its lowest. Hibernate and conserve when possible.",
        "May feel depressed or dim - this is TEMPORARY, not permanent.",
        "Avoid draining situations or people. Protect your flame."
      ],
      relationships: "CRITICAL: You need Wood or Earth partners in Winter. Water partners may unintentionally extinguish you. Fire partners help you both survive."
    }
  },

  Earth: {
    Spring: {
      strengths: [
        "You ground Spring's explosive Wood growth - others need your stability.",
        "Practical implementation of wild ideas - you're the reality check.",
        "Nurturing and supportive role comes naturally."
      ],
      weaknesses: [
        "Wood controls Earth - you feel pressed and constrained in Spring.",
        "Hard to say 'no' when everyone wants your grounding energy.",
        "May feel slow or stuck compared to Wood's rapid growth.",
        "Boundaries are crucial - protect yourself from Wood's demands."
      ],
      relationships: "Fire partners warm you and make Spring easier. Metal partners help you maintain boundaries against Wood's pressure."
    },
    Summer: {
      strengths: [
        "Fire produces Earth - this is YOUR nourishing season!",
        "Steady growth and consolidation. You build what Fire inspires.",
        "Reliability and trustworthiness shine. People lean on you.",
        "Great time for financial decisions, home improvements, foundations."
      ],
      weaknesses: [
        "Fire's intensity can overwhelm if you absorb too much.",
        "May become too cautious or slow - Fire wants action.",
        "Can feel pressure to support everyone's Summer ambitions."
      ],
      relationships: "Fire partners energize you naturally. Metal partners appreciate the solid foundation you provide."
    },
    Autumn: {
      strengths: [
        "Earth produces Metal - you're productive and generative.",
        "Harvest time literally and metaphorically. Reap what you've built.",
        "Organization, structure, and practical completion are effortless.",
        "This is when your steady work pays off visibly."
      ],
      weaknesses: [
        "Giving too much to Metal's production - remember to keep some for yourself.",
        "Can become rigid or overly focused on rules and procedures.",
        "May miss emotional/intuitive signals in favor of practical concerns."
      ],
      relationships: "Metal partners benefit from your stability. Water partners help you stay flexible and flowing."
    },
    Winter: {
      strengths: [
        "You dam and direct Water's flow - control and structure.",
        "Planning and foundations for future building.",
        "Patience and endurance are your superpowers in Winter."
      ],
      weaknesses: [
        "Water erodes Earth - you're being challenged and tested.",
        "May feel undermined or worn down by Winter's relentless flow.",
        "Boundaries might feel constantly breached. Exhausting.",
        "Hard to feel productive when Water wants to dissolve structure."
      ],
      relationships: "Fire partners provide crucial warmth and protection. Earth partners share the burden of containing Water's pressure."
    }
  },

  Metal: {
    Spring: {
      strengths: [
        "You provide the cutting clarity that Wood's growth needs.",
        "Strategic thinking and decision-making are your gifts to Spring chaos.",
        "Quality control - you prevent bad ideas from taking root."
      ],
      weaknesses: [
        "Wood is at maximum, Metal at minimum - this is your HARDEST season.",
        "Your cutting ability is blunted - can't enforce boundaries as effectively.",
        "May feel dull, tired, or ineffective compared to other times.",
        "Decision-making is HARDER now - delay major choices if possible.",
        "DON'T judge your Metal abilities based on Spring performance. Seasons matter!"
      ],
      relationships: "CRUCIAL: You need Autumn-born Metal partners or Earth partners who strengthen you in Spring. Wood partners will unintentionally deplete you."
    },
    Summer: {
      strengths: [
        "Metal provides structure to Fire's passion - strategic channeling.",
        "You refine and polish Fire's raw creative output.",
        "Precision and elegance emerge from Fire's chaos."
      ],
      weaknesses: [
        "Fire melts Metal - you're being worn down by Summer's heat.",
        "Can feel your sharpness dulling. Boundaries harder to maintain.",
        "May need to be more flexible than your Metal nature prefers.",
        "Avoid battles you can't win - Fire is too strong right now."
      ],
      relationships: "Earth partners shield you from Fire's intensity. Water partners cool the heat. Avoid Fire partners in Summer unless you have strong Earth."
    },
    Autumn: {
      strengths: [
        "THIS IS YOUR SEASON! Peak clarity, decisiveness, and precision.",
        "Your ability to cut through BS is legendary right now.",
        "Strategic thinking, organization, and execution are effortless.",
        "Others seek your judgment and leadership - you see clearly.",
        "Perfect timing for major decisions, cutting losses, strategic pivots."
      ],
      weaknesses: [
        "Can be too sharp or critical - remember not everyone has Autumn Metal power.",
        "May cut things that still have value. Balance precision with compassion.",
        "Tendency toward perfectionism or rigidity at peak Metal."
      ],
      relationships: "Water partners benefit from your clarity. Earth partners strengthen you further. Avoid Spring-born Wood partners (you'll dominate them)."
    },
    Winter: {
      strengths: [
        "Metal produces Water - you're generative and flowing.",
        "Refined intuition - Metal's clarity meets Water's depth.",
        "Strategic depth - you see far and clear into future possibilities.",
        "Good time for planning, research, and deep analysis."
      ],
      weaknesses: [
        "Giving your structure to create Water's flow can feel like dissolving.",
        "May lose some of your sharp edges - more fluid than usual.",
        "Could feel less decisive or more contemplative than you prefer."
      ],
      relationships: "Water partners flow naturally with you. Fire partners provide warmth without threatening your core."
    }
  },

  Water: {
    Spring: {
      strengths: [
        "Water nourishes Wood - you're the essential support system for Spring's growth.",
        "Behind-the-scenes power - you enable everyone else's success.",
        "Deep intuition and emotional intelligence are gifts others need.",
        "Flexibility and adaptation help you navigate Spring's chaos."
      ],
      weaknesses: [
        "You're being drained to feed Wood's massive growth - can feel exhausting.",
        "Giving too much without replenishing yourself. Boundaries!",
        "May feel depleted or invisible while Wood takes center stage.",
        "Your depth might be overlooked in favor of Wood's visible growth."
      ],
      relationships: "Metal partners replenish you (Metal produces Water). Water partners understand the giving-fatigue. Avoid Wood partners unless they consciously give back."
    },
    Summer: {
      strengths: [
        "You're the cooling, calming force in Fire's heat - essential balance.",
        "Emotional intelligence and intuition ground Fire's passion.",
        "You prevent burnout by bringing flow and ease.",
        "Depth and reflection balance Summer's intensity."
      ],
      weaknesses: [
        "Fire evaporates Water - this is YOUR hardest season.",
        "Energy at its lowest. Literally being dried out by Summer heat.",
        "May feel emotionally raw or oversensitive.",
        "Your natural flow is disrupted by Fire's intensity.",
        "Avoid major emotional decisions - your Water nature is compromised."
      ],
      relationships: "CRITICAL: You need Metal or Water partners in Summer. Fire partners will unintentionally drain you. Earth partners dam your flow uncomfortably."
    },
    Autumn: {
      strengths: [
        "Metal produces Water - you're being strengthened and replenished!",
        "Flow returns after Summer's drought. Relief and renewal.",
        "Intuition sharpens as Metal's clarity feeds your depth.",
        "Great time for emotional healing and restoring reserves."
      ],
      weaknesses: [
        "Metal's cutting energy can be harsh - your sensitivity feels it deeply.",
        "May need to develop thicker boundaries than you prefer.",
        "Could feel forced into more structure than your nature likes."
      ],
      relationships: "Metal partners strengthen you naturally. Water partners help you recover from Summer. Fire partners provide welcome warmth."
    },
    Winter: {
      strengths: [
        "THIS IS YOUR TIME! Peak intuition, flow, depth, and emotional power.",
        "Your ability to read situations and people is unmatched.",
        "Adaptability and wisdom are at maximum - you navigate complexity effortlessly.",
        "Deep work, research, emotional processing, strategic thinking all optimal.",
        "Others come to you for depth and understanding - you see what they miss."
      ],
      weaknesses: [
        "Can go too deep and lose connection to surface/practical reality.",
        "May become overly introspective or isolated. Stay connected.",
        "Tendency to absorb everyone's emotions - protect your energy.",
        "Your depth can intimidate - remember to stay relatable."
      ],
      relationships: "You need Fire partners to keep you warm and visible. Metal partners resonate with your depth. Avoid Earth partners who try to dam your Winter flow."
    }
  }
}

export default seasonalGuidance
