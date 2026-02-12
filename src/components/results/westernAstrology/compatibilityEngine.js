// ===========================================
// 36-CUSP ZODIAC PROFILES DATABASE
// ===========================================
// Each cusp position has typical element distributions
// Pure signs are strongly dominant (50-60%), cusps blend adjacent signs

export const CUSP_PROFILES = [
    // PURE SIGNS (12)
    { id: 'aries', name: 'Aries', dateRange: 'Mar 21 - Apr 19', type: 'pure',
      elements: { Fire: 55, Earth: 12, Air: 18, Water: 15 },
      description: 'Pure Fire - initiative, courage, action' },
    { id: 'taurus', name: 'Taurus', dateRange: 'Apr 20 - May 20', type: 'pure',
      elements: { Fire: 12, Earth: 58, Air: 15, Water: 15 },
      description: 'Pure Earth - stability, sensuality, persistence' },
    { id: 'gemini', name: 'Gemini', dateRange: 'May 21 - Jun 20', type: 'pure',
      elements: { Fire: 18, Earth: 10, Air: 60, Water: 12 },
      description: 'Pure Air - intellect, communication, adaptability' },
    { id: 'cancer', name: 'Cancer', dateRange: 'Jun 21 - Jul 22', type: 'pure',
      elements: { Fire: 12, Earth: 20, Air: 15, Water: 53 },
      description: 'Pure Water - emotional depth, nurturing, intuition' },
    { id: 'leo', name: 'Leo', dateRange: 'Jul 23 - Aug 22', type: 'pure',
      elements: { Fire: 58, Earth: 15, Air: 15, Water: 12 },
      description: 'Pure Fire - creativity, leadership, self-expression' },
    { id: 'virgo', name: 'Virgo', dateRange: 'Aug 23 - Sep 22', type: 'pure',
      elements: { Fire: 10, Earth: 55, Air: 22, Water: 13 },
      description: 'Pure Earth - analysis, service, perfectionism' },
    { id: 'libra', name: 'Libra', dateRange: 'Sep 23 - Oct 22', type: 'pure',
      elements: { Fire: 15, Earth: 12, Air: 55, Water: 18 },
      description: 'Pure Air - harmony, relationships, aesthetics' },
    { id: 'scorpio', name: 'Scorpio', dateRange: 'Oct 23 - Nov 21', type: 'pure',
      elements: { Fire: 18, Earth: 15, Air: 10, Water: 57 },
      description: 'Pure Water - intensity, transformation, depth' },
    { id: 'sagittarius', name: 'Sagittarius', dateRange: 'Nov 22 - Dec 21', type: 'pure',
      elements: { Fire: 60, Earth: 10, Air: 20, Water: 10 },
      description: 'Pure Fire - expansion, philosophy, adventure' },
    { id: 'capricorn', name: 'Capricorn', dateRange: 'Dec 22 - Jan 19', type: 'pure',
      elements: { Fire: 10, Earth: 60, Air: 15, Water: 15 },
      description: 'Pure Earth - ambition, structure, responsibility' },
    { id: 'aquarius', name: 'Aquarius', dateRange: 'Jan 20 - Feb 18', type: 'pure',
      elements: { Fire: 15, Earth: 8, Air: 65, Water: 12 },
      description: 'Pure Air - innovation, humanitarianism, independence' },
    { id: 'pisces', name: 'Pisces', dateRange: 'Feb 19 - Mar 20', type: 'pure',
      elements: { Fire: 10, Earth: 10, Air: 18, Water: 62 },
      description: 'Pure Water - empathy, spirituality, imagination' },

    // CUSPS (24 - between adjacent signs)
    { id: 'aries-taurus', name: 'Aries-Taurus Cusp', dateRange: 'Apr 16-22', type: 'cusp',
      elements: { Fire: 35, Earth: 38, Air: 15, Water: 12 },
      description: 'Cusp of Power - combining initiative with persistence' },
    { id: 'taurus-gemini', name: 'Taurus-Gemini Cusp', dateRange: 'May 17-23', type: 'cusp',
      elements: { Fire: 15, Earth: 35, Air: 38, Water: 12 },
      description: 'Cusp of Energy - grounded communication' },
    { id: 'gemini-cancer', name: 'Gemini-Cancer Cusp', dateRange: 'Jun 17-23', type: 'cusp',
      elements: { Fire: 12, Earth: 15, Air: 35, Water: 38 },
      description: 'Cusp of Magic - emotional intelligence meets articulation' },
    { id: 'cancer-gemini', name: 'Cancer-Gemini Cusp', dateRange: 'Jun 19-24', type: 'cusp',
      elements: { Fire: 10, Earth: 15, Air: 30, Water: 45 },
      description: 'Cusp of Magic - nurturing depth with communicative gifts' },
    { id: 'cancer-leo', name: 'Cancer-Leo Cusp', dateRange: 'Jul 19-25', type: 'cusp',
      elements: { Fire: 35, Earth: 18, Air: 14, Water: 33 },
      description: 'Cusp of Oscillation - emotional depth with expressive warmth' },
    { id: 'leo-virgo', name: 'Leo-Virgo Cusp', dateRange: 'Aug 19-25', type: 'cusp',
      elements: { Fire: 35, Earth: 38, Air: 17, Water: 10 },
      description: 'Cusp of Exposure - creative ambition with analytical precision' },
    { id: 'virgo-libra', name: 'Virgo-Libra Cusp', dateRange: 'Sep 19-25', type: 'cusp',
      elements: { Fire: 12, Earth: 35, Air: 40, Water: 13 },
      description: 'Cusp of Beauty - analytical grace, aesthetic service' },
    { id: 'libra-scorpio', name: 'Libra-Scorpio Cusp', dateRange: 'Oct 19-25', type: 'cusp',
      elements: { Fire: 16, Earth: 14, Air: 30, Water: 40 },
      description: 'Cusp of Drama - diplomatic intensity, balanced depth' },
    { id: 'scorpio-libra', name: 'Scorpio-Libra Cusp', dateRange: 'Oct 19-25', type: 'cusp',
      elements: { Fire: 12, Earth: 12, Air: 28, Water: 48 },
      description: 'Cusp of Drama - emotional depth with harmonious expression' },
    { id: 'scorpio-sagittarius', name: 'Scorpio-Sagittarius Cusp', dateRange: 'Nov 18-24', type: 'cusp',
      elements: { Fire: 40, Earth: 12, Air: 15, Water: 33 },
      description: 'Cusp of Revolution - passionate expansion, intense truth-seeking' },
    { id: 'sagittarius-capricorn', name: 'Sagittarius-Capricorn Cusp', dateRange: 'Dec 18-24', type: 'cusp',
      elements: { Fire: 35, Earth: 38, Air: 17, Water: 10 },
      description: 'Cusp of Prophecy - visionary ambition with grounded execution' },
    { id: 'capricorn-aquarius', name: 'Capricorn-Aquarius Cusp', dateRange: 'Jan 16-22', type: 'cusp',
      elements: { Fire: 12, Earth: 38, Air: 40, Water: 10 },
      description: 'Cusp of Mystery - structured innovation, practical idealism' },
    { id: 'aquarius-pisces', name: 'Aquarius-Pisces Cusp', dateRange: 'Feb 15-21', type: 'cusp',
      elements: { Fire: 12, Earth: 8, Air: 40, Water: 40 },
      description: 'Cusp of Sensitivity - visionary compassion, intuitive innovation' },
    { id: 'pisces-aquarius', name: 'Pisces-Aquarius Cusp', dateRange: 'Feb 15-21', type: 'cusp',
      elements: { Fire: 10, Earth: 10, Air: 35, Water: 45 },
      description: 'Cusp of Sensitivity - mystical intellect, emotional wisdom with articulation' },
    { id: 'pisces-aries', name: 'Pisces-Aries Cusp', dateRange: 'Mar 17-23', type: 'cusp',
      elements: { Fire: 35, Earth: 10, Air: 17, Water: 38 },
      description: 'Cusp of Rebirth - intuitive courage, spiritual action' },
    { id: 'aries-pisces', name: 'Aries-Pisces Cusp', dateRange: 'Mar 17-23', type: 'cusp',
      elements: { Fire: 40, Earth: 12, Air: 15, Water: 33 },
      description: 'Cusp of Rebirth - courageous sensitivity' },
    { id: 'taurus-aries', name: 'Taurus-Aries Cusp', dateRange: 'Apr 16-22', type: 'cusp',
      elements: { Fire: 30, Earth: 42, Air: 15, Water: 13 },
      description: 'Cusp of Power - persistent initiative' },
    { id: 'gemini-taurus', name: 'Gemini-Taurus Cusp', dateRange: 'May 17-23', type: 'cusp',
      elements: { Fire: 15, Earth: 30, Air: 42, Water: 13 },
      description: 'Cusp of Energy - communicative stability' },
    { id: 'leo-cancer', name: 'Leo-Cancer Cusp', dateRange: 'Jul 19-25', type: 'cusp',
      elements: { Fire: 40, Earth: 15, Air: 13, Water: 32 },
      description: 'Cusp of Oscillation - expressive nurturing' },
    { id: 'virgo-leo', name: 'Virgo-Leo Cusp', dateRange: 'Aug 19-25', type: 'cusp',
      elements: { Fire: 30, Earth: 42, Air: 18, Water: 10 },
      description: 'Cusp of Exposure - analytical creativity' },
    { id: 'libra-virgo', name: 'Libra-Virgo Cusp', dateRange: 'Sep 19-25', type: 'cusp',
      elements: { Fire: 13, Earth: 32, Air: 42, Water: 13 },
      description: 'Cusp of Beauty - graceful analysis' },
    { id: 'sagittarius-scorpio', name: 'Sagittarius-Scorpio Cusp', dateRange: 'Nov 18-24', type: 'cusp',
      elements: { Fire: 45, Earth: 10, Air: 18, Water: 27 },
      description: 'Cusp of Revolution - expansive depth' },
    { id: 'capricorn-sagittarius', name: 'Capricorn-Sagittarius Cusp', dateRange: 'Dec 18-24', type: 'cusp',
      elements: { Fire: 30, Earth: 45, Air: 15, Water: 10 },
      description: 'Cusp of Prophecy - grounded vision' },
    { id: 'aquarius-capricorn', name: 'Aquarius-Capricorn Cusp', dateRange: 'Jan 16-22', type: 'cusp',
      elements: { Fire: 13, Earth: 30, Air: 47, Water: 10 },
      description: 'Cusp of Mystery - innovative structure' }
]

// Element meanings and blind spot descriptions
export const ELEMENT_MEANINGS = {
    Fire: {
        icon: '\u{1F525}',
        positive: 'passion, initiative, courage, inspiration',
        superpower: 'You ignite action and inspire others',
        deficit: 'limited drive, struggles with motivation',
        deficitExamples: [
            'Hard to get excited about new projects',
            'Prefer stability over adventure',
            'May seem passive or unmotivated to Fire-dominant people'
        ],
        deficitImpact: 'Partners may feel you lack enthusiasm or spontaneity'
    },
    Earth: {
        icon: '\u{1F30D}',
        positive: 'grounding, stability, practicality, persistence',
        superpower: 'You build things that last',
        deficit: 'struggles with follow-through, may seem unreliable',
        deficitExamples: [
            'Ideas stay ideas, not actions',
            'Difficulty with routines and structure',
            'May abandon projects when bored'
        ],
        deficitImpact: 'Partners may feel you are unreliable or impractical'
    },
    Air: {
        icon: '\u{1F4A8}',
        positive: 'intellect, communication, articulation, adaptability',
        superpower: 'You articulate what others cannot express',
        deficit: 'limited articulation, struggles to explain',
        deficitExamples: [
            'Hard to explain "how you know" something',
            'Prefer showing over telling',
            '"Just do it" rather than "let me explain how"'
        ],
        deficitImpact: 'Partners may feel you are uncommunicative when you are just struggling to put sensations into words'
    },
    Water: {
        icon: '\u{1F4A7}',
        positive: 'emotional depth, intuition, empathy, sensitivity',
        superpower: 'You feel what others cannot sense',
        deficit: 'limited emotional depth, processes through action',
        deficitExamples: [
            '"What should I DO about this feeling?"',
            'Emotions feel impractical/inefficient',
            'Trust what you can measure over hunches'
        ],
        deficitImpact: 'Partners may feel you are emotionally distant or that you "don\'t understand" when you are trying to help by solving rather than feeling'
    }
}

// ===========================================
// ELEMENT COMPATIBILITY ENGINE
// ===========================================

// Calculate OVERLAP score (Venn intersection - common ground)
export const calculateOverlapScore = (person1, person2) => {
    const overlap = {
        Fire: Math.min(person1.Fire, person2.Fire),
        Earth: Math.min(person1.Earth, person2.Earth),
        Air: Math.min(person1.Air, person2.Air),
        Water: Math.min(person1.Water, person2.Water)
    }
    const total = overlap.Fire + overlap.Earth + overlap.Air + overlap.Water
    return { overlap, total }
}

// Calculate COMPLEMENT score with CRITICAL vs MINOR deficit weighting
// Critical deficits (< 15%) weighted 70%, minor deficits (15-20%) weighted 30%
// User reception weighted 70%, partner reception weighted 30%
export const calculateComplementScore = (person1, person2) => {
    // Separate CRITICAL deficits (< 15%) from MINOR deficits (15-20%)
    const getCriticalDeficits = (person) => ({
        Fire: person.Fire < 15 ? 20 - person.Fire : 0,
        Earth: person.Earth < 15 ? 20 - person.Earth : 0,
        Air: person.Air < 15 ? 20 - person.Air : 0,
        Water: person.Water < 15 ? 20 - person.Water : 0
    })

    const getMinorDeficits = (person) => ({
        Fire: (person.Fire >= 15 && person.Fire < 20) ? 20 - person.Fire : 0,
        Earth: (person.Earth >= 15 && person.Earth < 20) ? 20 - person.Earth : 0,
        Air: (person.Air >= 15 && person.Air < 20) ? 20 - person.Air : 0,
        Water: (person.Water >= 15 && person.Water < 20) ? 20 - person.Water : 0
    })

    const getAllDeficits = (person) => ({
        Fire: Math.max(0, 20 - person.Fire),
        Earth: Math.max(0, 20 - person.Earth),
        Air: Math.max(0, 20 - person.Air),
        Water: Math.max(0, 20 - person.Water)
    })

    // Strengths: element > 20% = strength
    const getStrengths = (person) => ({
        Fire: Math.max(0, person.Fire - 20),
        Earth: Math.max(0, person.Earth - 20),
        Air: Math.max(0, person.Air - 20),
        Water: Math.max(0, person.Water - 20)
    })

    const criticalDeficits1 = getCriticalDeficits(person1)
    const minorDeficits1 = getMinorDeficits(person1)
    const deficits1 = getAllDeficits(person1)
    const deficits2 = getAllDeficits(person2)
    const strengths1 = getStrengths(person1)
    const strengths2 = getStrengths(person2)

    const totalCritical1 = Object.values(criticalDeficits1).reduce((a, b) => a + b, 0)
    const totalMinor1 = Object.values(minorDeficits1).reduce((a, b) => a + b, 0)
    const totalDeficits1 = Object.values(deficits1).reduce((a, b) => a + b, 0)
    const totalDeficits2 = Object.values(deficits2).reduce((a, b) => a + b, 0)

    // Person2 fills Person1's CRITICAL deficits
    let criticalFill1 = 0
    Object.keys(criticalDeficits1).forEach(el => {
        if (criticalDeficits1[el] > 0 && strengths2[el] > 0) {
            criticalFill1 += Math.min(criticalDeficits1[el], strengths2[el])
        }
    })
    const criticalFillRate1 = totalCritical1 > 0 ? (criticalFill1 / totalCritical1) : 1

    // Person2 fills Person1's MINOR deficits
    let minorFill1 = 0
    Object.keys(minorDeficits1).forEach(el => {
        if (minorDeficits1[el] > 0 && strengths2[el] > 0) {
            minorFill1 += Math.min(minorDeficits1[el], strengths2[el])
        }
    })
    const minorFillRate1 = totalMinor1 > 0 ? (minorFill1 / totalMinor1) : 1

    // Weighted fill rate for Person1 (critical 70%, minor 30%)
    const userReception = (criticalFillRate1 * 0.70 + minorFillRate1 * 0.30) * 100

    // Person1 fills Person2's gaps (simpler calculation)
    let fill2 = 0
    const fillDetails2 = []
    Object.keys(deficits2).forEach(el => {
        if (deficits2[el] > 0) {
            const filled = strengths1[el] > 0 ? Math.min(deficits2[el], strengths1[el]) : 0
            fill2 += filled
            fillDetails2.push({ element: el, deficit: deficits2[el], filled, strength: strengths1[el] })
        }
    })
    const partnerReception = totalDeficits2 > 0 ? (fill2 / totalDeficits2) * 100 : 100

    // Fill details for display
    const fillDetails1 = []
    Object.keys(deficits1).forEach(el => {
        if (deficits1[el] > 0) {
            const filled = strengths2[el] > 0 ? Math.min(deficits1[el], strengths2[el]) : 0
            const isCritical = criticalDeficits1[el] > 0
            fillDetails1.push({ element: el, deficit: deficits1[el], filled, strength: strengths2[el], isCritical })
        }
    })

    // Legacy fill rates for backward compatibility
    const fill1Total = Object.keys(deficits1).reduce((sum, el) => {
        if (deficits1[el] > 0 && strengths2[el] > 0) {
            return sum + Math.min(deficits1[el], strengths2[el])
        }
        return sum
    }, 0)
    const fillRate1 = totalDeficits1 > 0 ? (fill1Total / totalDeficits1) * 100 : 100
    const fillRate2 = partnerReception

    // WEIGHTED AVERAGE: User reception 70%, Partner reception 30%
    const average = (userReception * 0.70 + partnerReception * 0.30)

    return {
        deficits1, deficits2,
        strengths1, strengths2,
        fillRate1, fillRate2,
        fillDetails1, fillDetails2,
        totalDeficits1, totalDeficits2,
        average,
        userReception,
        partnerReception,
        criticalFillRate1: criticalFillRate1 * 100,
        minorFillRate1: minorFillRate1 * 100
    }
}

// Calculate COMMUNICATION score - uses PARTNER'S capacity (growth potential!)
// NOT capped by user's deficit - this represents what partner CAN teach user
export const calculateCommunicationScore = (person1, person2) => {
    const comm1 = (person1.Air + person1.Water) / 2
    const comm2 = (person2.Air + person2.Water) / 2

    // NEW: Use partner's capacity (growth potential) instead of min
    // Partner's Air+Water represents communication they CAN provide
    // User will LEARN from partner, so this is growth potential!
    const partnerCapacity = comm2
    const score = Math.min(100, partnerCapacity) // Cap at 100%

    return {
        comm1,
        comm2,
        weakest: Math.min(comm1, comm2), // Keep for backward compatibility
        partnerCapacity,
        score,
        growthPotential: comm2 > comm1 ? comm2 - comm1 : 0 // How much user can grow
    }
}

// Calculate total compatibility with NEW weights (20/60/20)
// Overlap 20%, Complement 60% (MOST important!), Communication 20%
export const calculateTotalCompatibility = (overlapTotal, complementAvg, commScore) => {
    return (overlapTotal * 0.20) + (complementAvg * 0.60) + (commScore * 0.20)
}

// Get A-F grade with letter grade and proper styling
export const getCompatibilityRating = (score) => {
    if (score >= 90) return {
        label: 'Perfect Match',
        grade: 'A',
        gradeLabel: 'A+',
        color: 'text-green-400',
        bg: 'bg-green-500/20',
        border: 'border-green-500/40',
        gradeColor: 'text-green-300'
    }
    if (score >= 80) return {
        label: 'Strong Match',
        grade: 'B',
        gradeLabel: 'B',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/40',
        gradeColor: 'text-emerald-300'
    }
    if (score >= 70) return {
        label: 'Good Match',
        grade: 'C',
        gradeLabel: 'C',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/20',
        border: 'border-cyan-500/40',
        gradeColor: 'text-cyan-300'
    }
    if (score >= 60) return {
        label: 'Moderate Match',
        grade: 'D',
        gradeLabel: 'D',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/40',
        gradeColor: 'text-yellow-300'
    }
    return {
        label: 'Poor Match',
        grade: 'F',
        gradeLabel: 'F',
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-500/40',
        gradeColor: 'text-red-300'
    }
}

// ===========================================
// CUSP RANKING ALGORITHM WITH NORMALIZATION
// ===========================================

// Normalize raw scores to 25-95 range for A-F grading
// Best match = 95% (A+), Worst match = 25% (F)
export const normalizeScores = (cuspsWithRawScores) => {
    if (cuspsWithRawScores.length === 0) return cuspsWithRawScores

    // Find min and max raw scores
    const rawScores = cuspsWithRawScores.map(c => c.scores.rawTotal)
    const maxRaw = Math.max(...rawScores)
    const minRaw = Math.min(...rawScores)
    const range = maxRaw - minRaw

    // If all scores are the same, return all as 60% (middle)
    if (range === 0) {
        return cuspsWithRawScores.map(cusp => ({
            ...cusp,
            scores: {
                ...cusp.scores,
                total: 60,
                normalized: true
            },
            rating: getCompatibilityRating(60)
        }))
    }

    // Scale to 25-95 range
    return cuspsWithRawScores.map(cusp => {
        const normalizedScore = ((cusp.scores.rawTotal - minRaw) / range) * 70 + 25
        const rating = getCompatibilityRating(normalizedScore)
        return {
            ...cusp,
            scores: {
                ...cusp.scores,
                total: normalizedScore,
                normalized: true
            },
            rating
        }
    })
}

// Rank all 36 cusps against user's profile WITH NORMALIZATION
export const rankAllCusps = (userElements) => {
    // First pass: calculate raw scores for all cusps
    const cuspsWithRawScores = CUSP_PROFILES.map(cusp => {
        const overlapResult = calculateOverlapScore(userElements, cusp.elements)
        const complementResult = calculateComplementScore(userElements, cusp.elements)
        const commResult = calculateCommunicationScore(userElements, cusp.elements)
        const rawTotal = calculateTotalCompatibility(overlapResult.total, complementResult.average, commResult.score)

        // Calculate what makes this match good or bad
        const partnerAirWater = cusp.elements.Air + cusp.elements.Water
        const userDeficits = Object.entries(userElements)
            .filter(([_, val]) => val < 20)
            .map(([el, val]) => ({ element: el, deficit: 20 - val }))

        // Check if partner fills user's deficits
        const deficitsFilled = userDeficits.map(d => ({
            ...d,
            partnerStrength: Math.max(0, cusp.elements[d.element] - 20),
            filled: cusp.elements[d.element] > 20
        }))

        return {
            ...cusp,
            scores: {
                overlap: overlapResult.total,
                complement: complementResult.average,
                communication: commResult.score,
                rawTotal: rawTotal, // Keep raw for normalization
                total: rawTotal // Will be replaced with normalized
            },
            rating: getCompatibilityRating(rawTotal), // Temporary, will be updated
            overlapResult,
            complementResult,
            commResult,
            partnerAirWater,
            deficitsFilled
        }
    })

    // Second pass: normalize scores to 25-95 range
    const normalizedCusps = normalizeScores(cuspsWithRawScores)

    // Sort by normalized score and assign ranks
    return normalizedCusps
        .sort((a, b) => b.scores.total - a.scores.total)
        .map((cusp, index) => ({ ...cusp, rank: index + 1 }))
}

// Calculate user's deficits and strengths
export const analyzeUserConstitution = (userElements) => {
    const deficits = []
    const strengths = []
    const dominant = Object.entries(userElements)
        .reduce((max, [el, val]) => val > max.value ? { element: el, value: val } : max, { element: '', value: 0 })

    Object.entries(userElements).forEach(([element, value]) => {
        if (value < 20) {
            deficits.push({ element, value, deficit: 20 - value })
        } else if (value > 20) {
            strengths.push({ element, value, excess: value - 20 })
        }
    })

    const totalDeficitSeverity = deficits.reduce((sum, d) => sum + d.deficit, 0)
    const communicationCapacity = (userElements.Air + userElements.Water) / 2

    return {
        deficits: deficits.sort((a, b) => b.deficit - a.deficit),
        strengths: strengths.sort((a, b) => b.excess - a.excess),
        dominant,
        totalDeficitSeverity,
        communicationCapacity,
        hasAirDeficit: userElements.Air < 20,
        hasWaterDeficit: userElements.Water < 20,
        hasEarthDeficit: userElements.Earth < 20,
        hasFireDeficit: userElements.Fire < 20
    }
}

// Calculate ideal partner profile based on user's deficits
export const calculateIdealPartner = (userAnalysis) => {
    const ideal = { Fire: 15, Earth: 15, Air: 15, Water: 15 } // Base balanced

    // For each user deficit, partner should have strength
    userAnalysis.deficits.forEach(d => {
        if (d.element === 'Water') ideal.Water = 40 + Math.min(10, d.deficit)
        if (d.element === 'Air') ideal.Air = 30 + Math.min(10, d.deficit)
        if (d.element === 'Fire') ideal.Fire = 20 + Math.min(10, d.deficit)
        if (d.element === 'Earth') ideal.Earth = 20 + Math.min(10, d.deficit)
    })

    // For user strengths, partner needs less (to avoid too much same element)
    userAnalysis.strengths.forEach(s => {
        if (s.excess > 30) {
            ideal[s.element] = Math.max(10, ideal[s.element] - 10)
        }
    })

    // Normalize to 100%
    const total = Object.values(ideal).reduce((a, b) => a + b, 0)
    Object.keys(ideal).forEach(k => {
        ideal[k] = Math.round((ideal[k] / total) * 100)
    })

    return ideal
}

// Generate "why best" reasons for a match
export const generateMatchReasons = (userElements, cusp, userAnalysis) => {
    const reasons = []

    // Check Water contribution
    if (userAnalysis.hasWaterDeficit && cusp.elements.Water > 30) {
        reasons.push({
            icon: '\u{1F4A7}',
            text: `Water ${cusp.elements.Water}%: Fills your Water deficit with emotional depth you lack`
        })
    }

    // Check Air contribution
    if (userAnalysis.hasAirDeficit && cusp.elements.Air > 25) {
        reasons.push({
            icon: '\u{1F4A8}',
            text: `Air ${cusp.elements.Air}%: Fills your Air deficit with articulation ability`
        })
    }

    // Check Earth common ground
    if (userElements.Earth > 30 && cusp.elements.Earth >= 15 && cusp.elements.Earth <= 25) {
        reasons.push({
            icon: '\u{1F30D}',
            text: `Earth ${cusp.elements.Earth}%: Good common ground for grounding rapport`
        })
    }

    // Check Fire balance
    if (userElements.Earth > 40 && cusp.elements.Fire <= 20) {
        reasons.push({
            icon: '\u{1F525}',
            text: `Fire ${cusp.elements.Fire}%: Minimal Fire won't overwhelm your stability`
        })
    }

    // Combined Air+Water check
    const partnerAirWater = cusp.elements.Air + cusp.elements.Water
    if (partnerAirWater >= 60 && (userAnalysis.hasAirDeficit || userAnalysis.hasWaterDeficit)) {
        reasons.push({
            icon: '\u{1F48E}',
            text: `Combined Air+Water (${partnerAirWater}%): Provides both communication AND emotional depth`
        })
    }

    return reasons
}

// Generate "why bad" reasons for a poor match
export const generateBadMatchReasons = (userElements, cusp, userAnalysis) => {
    const reasons = []

    // Too much Fire for Earth-dominant
    if (userElements.Earth > 40 && cusp.elements.Fire > 45) {
        reasons.push(`Too much Fire (${cusp.elements.Fire}%) overwhelms your Earth stability`)
    }

    // Too much same element (too similar)
    const maxUserElement = Object.entries(userElements).reduce((max, [el, val]) => val > max.value ? { element: el, value: val } : max, { element: '', value: 0 })
    if (cusp.elements[maxUserElement.element] > 50) {
        reasons.push(`Too similar - both ${maxUserElement.element}-dominant creates imbalance`)
    }

    // Doesn't fill critical deficits
    if (userAnalysis.hasWaterDeficit && cusp.elements.Water < 20) {
        reasons.push(`Doesn't fill Water deficit - no emotional depth to offer`)
    }
    if (userAnalysis.hasAirDeficit && cusp.elements.Air < 20) {
        reasons.push(`Doesn't fill Air deficit - no articulation boost`)
    }

    return reasons
}
