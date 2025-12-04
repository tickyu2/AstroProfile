// ========================================
// SEASONAL CALCULATIONS - SINGLE SOURCE OF TRUTH
// ========================================
// This file contains:
// 1. Seasonal strength calculations (Five Qi States - 五行旺衰)
// 2. Actionable guidance for each element/season combination
// 
// Used by:
// - SeasonalDebugPanel (technical breakdown)
// - SeasonalStrengthPanel (user-friendly weather report)
//
// Calculation methodology verified with Baby Gemini
// ========================================

// ========================================
// SEASONAL DEFINITIONS & MULTIPLIERS
// ========================================

export const SEASONS = {
  Spring: {
    name: 'Spring',
    chinese: '春',
    icon: '🌸',
    months: ['Tiger', 'Rabbit', 'Dragon'], // 寅卯辰 (Jan-Mar solar)
    multipliers: {
      Wood: 1.5,   // 王 Prosperous (King)
      Fire: 1.2,   // 相 Strengthening (Child) 
      Water: 0.8,  // 休 Resting (Mother)
      Earth: 0.5,  // 囚 Trapped (Prisoner)
      Metal: 0.2   // 死 Dead (Powerless)
    }
  },
  Summer: {
    name: 'Summer',
    chinese: '夏',
    icon: '☀️',
    months: ['Snake', 'Horse', 'Goat'], // 巳午未 (Apr-Jun solar)
    multipliers: {
      Fire: 1.5,   // 王 Prosperous
      Earth: 1.2,  // 相 Strengthening
      Wood: 0.8,   // 休 Resting
      Metal: 0.5,  // 囚 Trapped
      Water: 0.2   // 死 Dead
    }
  },
  Autumn: {
    name: 'Autumn',
    chinese: '秋',
    icon: '🍂',
    months: ['Monkey', 'Rooster', 'Dog'], // 申酉戌 (Jul-Sep solar)
    multipliers: {
      Metal: 1.5,  // 王 Prosperous
      Water: 1.2,  // 相 Strengthening
      Earth: 0.8,  // 休 Resting
      Wood: 0.2,   // 死 Dead
      Fire: 0.5    // 囚 Trapped
    }
  },
  Winter: {
    name: 'Winter',
    chinese: '冬',
    icon: '❄️',
    months: ['Pig', 'Rat', 'Ox'], // 亥子丑 (Oct-Dec solar)
    multipliers: {
      Water: 1.5,  // 王 Prosperous
      Wood: 1.2,   // 相 Strengthening
      Metal: 0.8,  // 休 Resting
      Fire: 0.2,   // 死 Dead
      Earth: 0.5   // 囚 Trapped
    }
  }
}

// Earth Transitions occur between seasons (last 18 days of each season)
// For simplicity, we use the final month of each season as "Earth Season"
export const EARTH_SEASON_MONTHS = ['Dragon', 'Goat', 'Dog', 'Ox']

// ========================================
// SEASONAL LOOKUP
// ========================================

export function getSeasonFromMonth(monthBranch) {
  // Handle if monthBranch is an object with english/name property
  const branchName = typeof monthBranch === 'string' ? monthBranch : 
                     (monthBranch?.english || monthBranch?.name || '')
  
  // Check if Earth Season (Transition)
  if (EARTH_SEASON_MONTHS.includes(branchName)) {
    return {
      name: 'Earth Season (Transition)',
      chinese: '土',
      icon: '🏔️',
      months: EARTH_SEASON_MONTHS,
      multipliers: {
        Earth: 1.5,  // 王 Prosperous
        Metal: 1.2,  // 相 Strengthening  
        Fire: 0.8,   // 休 Resting
        Wood: 0.5,   // 囚 Trapped
        Water: 0.2   // 死 Dead
      }
    }
  }
  
  // Regular season lookup
  for (const [seasonName, seasonData] of Object.entries(SEASONS)) {
    if (seasonData.months.includes(branchName)) {
      return seasonData
    }
  }
  
  console.warn('⚠️ Could not find season for month:', branchName, '- defaulting to Spring')
  return SEASONS.Spring // default
}

// ========================================
// CORE CALCULATION FUNCTION
// ========================================

export function calculateSeasonalStrength(fourPillars, birthSeason) {
  // Step 1: Count raw elements (weighted by pillar importance)
  // Day Pillar (70%) = Core self / Day Master
  // Hour (15%) = Private self / Inner world
  // Month (10%) = Public self / Relationships  
  // Year (5%) = Ancestral / Family influence
  
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

  // Step 2: Apply seasonal multipliers
  const multipliers = birthSeason.multipliers
  const adjusted = {}
  const qiStates = {}
  
  for (const element of Object.keys(rawCounts)) {
    const raw = rawCounts[element]
    const multiplier = multipliers[element]
    adjusted[element] = raw * multiplier
    
    // Determine Qi State (五行旺衰)
    if (multiplier === 1.5) qiStates[element] = { state: '王', name: 'Prosperous', nameZh: '旺', color: '#10b981' }
    else if (multiplier === 1.2) qiStates[element] = { state: '相', name: 'Strengthening', nameZh: '相', color: '#3b82f6' }
    else if (multiplier === 0.8) qiStates[element] = { state: '休', name: 'Resting', nameZh: '休', color: '#f59e0b' }
    else if (multiplier === 0.5) qiStates[element] = { state: '囚', name: 'Trapped', nameZh: '囚', color: '#f97316' }
    else if (multiplier === 0.2) qiStates[element] = { state: '死', name: 'Dead', nameZh: '死', color: '#ef4444' }
  }

  // Step 3: Calculate percentages
  const total = Object.values(adjusted).reduce((sum, val) => sum + val, 0)
  const percentages = {}
  
  for (const element of Object.keys(adjusted)) {
    percentages[element] = total > 0 ? (adjusted[element] / total) * 100 : 0
  }

  // Find strongest and weakest
  const sortedElements = Object.entries(percentages)
    .sort((a, b) => b[1] - a[1])
  
  const strongest = { element: sortedElements[0][0], percentage: sortedElements[0][1] }
  const weakest = { element: sortedElements[sortedElements.length - 1][0], percentage: sortedElements[sortedElements.length - 1][1] }

  return {
    raw: rawCounts,
    multipliers,
    adjusted,
    percentages,
    qiStates,
    strongest,
    weakest,
    total
  }
}

// ========================================
// ACTIONABLE GUIDANCE DATABASE
// ========================================

export const SEASONAL_GUIDANCE = {
  // WOOD GUIDANCE
  Wood: {
    Spring: {
      strengths: [
        "THIS IS YOUR TIME! Peak growth, creativity, and expansion.",
        "Leadership and innovation abilities at maximum.",
        "Perfect time for starting new projects and ventures.",
        "Natural charisma and influence heightened."
      ],
      weaknesses: [
        "Can grow too fast and overextend yourself.",
        "May become overly aggressive or impulsive.",
        "Risk of burning out from excessive activity.",
        "Others may feel overwhelmed by your intensity."
      ],
      relationships: "You need Metal partners to prune your growth and Earth partners to ground you. Wood+Wood can be competitive rather than collaborative."
    },
    Summer: {
      strengths: [
        "Your growth fuels Fire's brilliance - you're the foundation for others' success.",
        "Creative projects launched in Spring now flourish.",
        "Good time for visibility and public presentations.",
        "Your ideas inspire and energize others."
      ],
      weaknesses: [
        "Fire drains Wood - you may feel depleted if you give too much.",
        "Protect your boundaries - everyone wants your energy.",
        "Risk of being used without reciprocation.",
        "May feel your contributions aren't acknowledged."
      ],
      relationships: "Seek Water partners who replenish you. Fire partners are exciting but draining. Metal partners provide necessary structure."
    },
    Autumn: {
      strengths: [
        "Time to harvest what you planted - reap rewards from Spring/Summer efforts.",
        "Metal's precision helps refine your wild growth into valuable products.",
        "Excellent for strategic planning and reflection.",
        "Quality over quantity becomes your strength."
      ],
      weaknesses: [
        "Metal cuts Wood - this is your most challenging season.",
        "Growth abilities limited, innovation harder.",
        "May feel criticized or restricted.",
        "DON'T judge your Wood abilities based on Autumn performance."
      ],
      relationships: "CRUCIAL: You need Water partners to strengthen you in Autumn. Metal partners will unintentionally weaken you. Avoid Wood partners (both struggling)."
    },
    Winter: {
      strengths: [
        "Water nourishes Wood - this is your preparation and recovery season.",
        "Deep planning and visioning for next Spring's growth.",
        "Intuition and insight are heightened - trust your gut.",
        "Good time for learning, reading, strategic thinking."
      ],
      weaknesses: [
        "Visible growth minimal - you're working underground.",
        "Others may not see your value during this season.",
        "Can feel stagnant or unproductive (you're not - you're preparing).",
        "Patience required - Spring will come."
      ],
      relationships: "Water partners are ideal - they fuel your next growth cycle. Fire partners complement you (water+wood+fire = complete cycle)."
    }
  },

  // FIRE GUIDANCE  
  Fire: {
    Spring: {
      strengths: [
        "Wood feeds Fire - strong support from environment.",
        "Growing warmth and visibility.",
        "Good time to build momentum for Summer peak.",
        "Your passion has fuel to burn bright."
      ],
      weaknesses: [
        "Not yet at full strength - don't overcommit.",
        "May feel impatient to shine (Summer is coming).",
        "Can burn resources too quickly if not careful."
      ],
      relationships: "Wood partners are excellent matches - they fuel you naturally. Earth partners can ground your intensity."
    },
    Summer: {
      strengths: [
        "THIS IS YOUR TIME! Peak passion, energy, and leadership.",
        "Ability to inspire and energize others is unmatched.",
        "Perfect for performance, speaking, creative expression.",
        "Maximum visibility and influence."
      ],
      weaknesses: [
        "Can burn too bright and exhaust yourself and others.",
        "May be impulsive or overly confident.",
        "Risk of drama or conflict from excess heat.",
        "Everyone wants your energy - protect boundaries."
      ],
      relationships: "You need Earth partners to ground your intensity and Water partners to prevent burnout. Fire+Fire can be explosive (exciting but unsustainable)."
    },
    Autumn: {
      strengths: [
        "Fire creates Earth (ash) - your passion produces lasting value.",
        "Good time to consolidate and stabilize what you built.",
        "Metal refines what you created.",
        "Transform intensity into wisdom."
      ],
      weaknesses: [
        "Metal drains Fire - energy declining.",
        "May feel your spark dimming.",
        "Others may not appreciate you as much.",
        "Frustration from reduced impact."
      ],
      relationships: "Wood partners can reignite you. Avoid Metal partners (they drain you). Earth partners help you transition gracefully."
    },
    Winter: {
      strengths: [
        "Time for rest and inner reflection.",
        "Planning next Summer's brilliance.",
        "Deep connection with purpose.",
        "Wisdom gained from past intensity."
      ],
      weaknesses: [
        "Water threatens Fire - this is your HARDEST season.",
        "Energy at its lowest. Hibernate and conserve when possible.",
        "May feel depressed or dim - this is TEMPORARY, not permanent.",
        "Avoid draining situations or people. Protect your flame."
      ],
      relationships: "CRUCIAL: You need Wood partners to shelter you and Earth partners to insulate you in Winter. Avoid Water partners."
    }
  },

  // EARTH GUIDANCE
  Earth: {
    Spring: {
      strengths: [
        "You ground and stabilize Wood's wild growth.",
        "Your reliability is valuable when others are scattered.",
        "Good time to build foundations for the year.",
        "Practical support role appreciated."
      ],
      weaknesses: [
        "Wood depletes Earth - you may feel drained.",
        "Others may take you for granted.",
        "Your steady nature seems boring compared to Spring's excitement.",
        "Hard to say no when everyone needs grounding."
      ],
      relationships: "Fire partners energize you (Fire creates Earth). Metal partners drain you but create value. Avoid multiple Wood partners."
    },
    Summer: {
      strengths: [
        "Fire feeds Earth - this is YOUR time for growth!",
        "Receiving energy and recognition.",
        "Perfect for building, organizing, creating structure.",
        "Your stability is the foundation for Fire's brilliance."
      ],
      weaknesses: [
        "Can become too fixed or stubborn.",
        "May accumulate too much (hoarding tendency).",
        "Risk of being overwhelmed by Fire's intensity.",
        "Others may see you as limiting their freedom."
      ],
      relationships: "Fire partners are excellent - they fuel you. Metal partners receive your support gracefully. Avoid Water partners (they drain you)."
    },
    Autumn: {
      strengths: [
        "Earth creates Metal - you produce valuable outcomes.",
        "Harvest time - reap what you stabilized.",
        "Your efforts from Summer now bear fruit.",
        "Wisdom and experience recognized."
      ],
      weaknesses: [
        "Metal drains Earth - giving a lot, receiving little.",
        "May feel unappreciated or taken for granted.",
        "Your resources going to others' success.",
        "Fatigue from constant output."
      ],
      relationships: "Fire partners replenish you. Avoid too many Metal partners (they drain you). Wood partners help break up stagnation."
    },
    Winter: {
      strengths: [
        "Time to rest and restore your resources.",
        "Your stability provides safety in cold season.",
        "Planning and preparation for next cycle.",
        "Inner work and self-care."
      ],
      weaknesses: [
        "Water erodes Earth - challenging season.",
        "May feel undermined or unstable.",
        "Hard to maintain boundaries.",
        "Others may exploit your giving nature."
      ],
      relationships: "CRUCIAL: You need Fire partners to warm and strengthen you. Avoid Water partners in Winter. Metal partners can drain you."
    }
  },

  // METAL GUIDANCE
  Metal: {
    Spring: {
      strengths: [
        "You provide cutting clarity Wood's growth needs.",
        "Strategic thinking and quality control valuable.",
        "Good time to refine ideas and plans.",
        "Your precision prevents waste."
      ],
      weaknesses: [
        "Wood at maximum, Metal at minimum - this is your HARDEST season.",
        "Your cutting ability is blunted.",
        "May feel dull, ineffective, or rejected.",
        "Others may see you as obstacle to growth.",
        "DON'T judge your Metal abilities based on Spring performance."
      ],
      relationships: "CRUCIAL: You need Autumn-born Metal partners or Earth partners who strengthen you in Spring. Wood partners will unintentionally deplete you."
    },
    Summer: {
      strengths: [
        "Fire refines Metal - you're being shaped and improved.",
        "Transformation and growth through challenges.",
        "Learning to be flexible without losing edge.",
        "Your precision helps focus Fire's scattered energy."
      ],
      weaknesses: [
        "Fire melts Metal - energy depleting.",
        "May feel criticized or under attack.",
        "Hard to maintain your clarity and standards.",
        "Risk of becoming brittle or defensive."
      ],
      relationships: "Earth partners shield you from Fire's intensity. Water partners cool you down. Avoid excessive Fire exposure."
    },
    Autumn: {
      strengths: [
        "THIS IS YOUR TIME! Peak clarity, precision, and effectiveness.",
        "Decision-making abilities at maximum.",
        "Perfect for cutting away waste and revealing value.",
        "Your standards and discernment are appreciated."
      ],
      weaknesses: [
        "Can be too harsh or critical.",
        "May cut away things that still have value.",
        "Others may see you as cold or ruthless.",
        "Risk of perfectionism paralysis."
      ],
      relationships: "You need Earth partners to temper you and Water partners to flow from your cutting. Metal+Metal can be too rigid."
    },
    Winter: {
      strengths: [
        "Metal creates Water - your clarity produces wisdom.",
        "Good time for deep analysis and reflection.",
        "Your precision helps others navigate unclear waters.",
        "Strategic value recognized."
      ],
      weaknesses: [
        "Water drains Metal - giving energy, low return.",
        "May feel your contributions aren't valued.",
        "Others take your clarity for granted.",
        "Fatigue from constant sharpness."
      ],
      relationships: "Earth partners restore you. Avoid too many Water partners (they drain you). Fire partners provide needed warmth."
    }
  },

  // WATER GUIDANCE
  Water: {
    Spring: {
      strengths: [
        "Water nourishes Wood - you're essential for growth!",
        "Your wisdom and depth fuel others' success.",
        "Good time for supporting and mentoring.",
        "Your adaptability is valuable during change."
      ],
      weaknesses: [
        "Wood drinks Water - you may feel drained.",
        "Giving a lot, receiving little recognition.",
        "Your deep insights may be ignored for quick growth.",
        "Risk of depletion from constant support."
      ],
      relationships: "Metal partners replenish you. Avoid too many Wood partners (they drain you). Fire partners provide contrast but can be exhausting."
    },
    Summer: {
      strengths: [
        "You balance Fire's intensity with depth.",
        "Your cooling presence is desperately needed.",
        "Preventing burnout and excess.",
        "Your wisdom provides perspective on passion."
      ],
      weaknesses: [
        "Fire evaporates Water - this is your most challenging season.",
        "Energy at its lowest. Conserve and hibernate when possible.",
        "May feel overwhelmed by intensity around you.",
        "Others may see you as dampening their enthusiasm.",
        "DON'T judge your Water abilities based on Summer performance."
      ],
      relationships: "CRUCIAL: You need Metal partners to feed you and Earth partners who appreciate your depth. Avoid Fire partners in Summer."
    },
    Autumn: {
      strengths: [
        "Metal creates Water - you're being fed!",
        "Receiving energy and recognition.",
        "Good time for deep work and creativity.",
        "Your wisdom and intuition heightened."
      ],
      weaknesses: [
        "Can become too withdrawn or isolated.",
        "May drown in emotions or overthinking.",
        "Others may see you as mysterious or distant.",
        "Risk of stagnation from excess stillness."
      ],
      relationships: "Metal partners are excellent - they fuel you naturally. Wood partners receive your gifts gratefully. Earth partners can muddy your clarity."
    },
    Winter: {
      strengths: [
        "THIS IS YOUR TIME! Peak wisdom, intuition, and depth.",
        "Maximum flow and adaptability.",
        "Perfect for reflection, learning, strategic thinking.",
        "Your insights are most accurate now."
      ],
      weaknesses: [
        "Can be too cold or detached.",
        "May become paralyzed by too many possibilities.",
        "Others may see you as pessimistic or passive.",
        "Risk of depression from excess stillness."
      ],
      relationships: "You need Wood partners to direct your flow and Metal partners to maintain your clarity. Water+Water can become stagnant."
    }
  }
}

// ========================================
// HELPER FUNCTION TO GET GUIDANCE
// ========================================

export function getGuidanceForElement(element, season) {
  const seasonName = season.name.split(' ')[0] // Get 'Spring', 'Summer', etc., handle 'Earth Season (Transition)'
  
  // For Earth Season, treat as the transition before the next season
  // For simplicity, we'll use Autumn guidance (since most Earth transitions occur at end of seasons)
  const lookupSeason = seasonName === 'Earth' ? 'Autumn' : seasonName
  
  return SEASONAL_GUIDANCE[element]?.[lookupSeason] || {
    strengths: ["Information not available for this combination."],
    weaknesses: ["Information not available for this combination."],
    relationships: "Information not available for this combination."
  }
}
