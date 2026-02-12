// Element colors for Western astrology radar
export const WESTERN_ELEMENT_COLORS = {
    Fire: '#ef4444',
    Earth: '#84cc16',
    Air: '#60a5fa',
    Water: '#06b6d4'
}

// Element icons and colors for Western astrology
export const elementConfig = {
    Fire: { icon: '\u{1F525}', color: 'red', bgClass: 'bg-red-500/20', textClass: 'text-red-400', borderClass: 'border-red-500/40' },
    Earth: { icon: '\u{1F30D}', color: 'amber', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400', borderClass: 'border-amber-500/40' },
    Air: { icon: '\u{1F4A8}', color: 'cyan', bgClass: 'bg-cyan-500/20', textClass: 'text-cyan-400', borderClass: 'border-cyan-500/40' },
    Water: { icon: '\u{1F4A7}', color: 'blue', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400', borderClass: 'border-blue-500/40' }
}

// Element meanings for Western astrology
export const elementMeanings = {
    Fire: {
        keywords: 'Passion, Energy, Initiative, Courage, Enthusiasm',
        description: 'Fire signs (Aries, Leo, Sagittarius) embody dynamic action and inspiration. High Fire indicates a passionate, energetic nature that initiates and leads.',
        highMeaning: 'You burn bright with enthusiasm and courage. Your energy inspires others to action. You naturally lead and motivate.',
        lowMeaning: 'You may benefit from cultivating more spontaneity, passion, and willingness to take risks.',
        balanced: 'Your fire is well-regulated - you can be passionate without being consumed.'
    },
    Earth: {
        keywords: 'Stability, Practicality, Material Security, Patience',
        description: 'Earth signs (Taurus, Virgo, Capricorn) ground energy into tangible reality. High Earth indicates reliability, patience, and material mastery.',
        highMeaning: 'You are deeply grounded and practical. You build lasting structures and value security. Others rely on your stability.',
        lowMeaning: 'You may need to develop more patience, practicality, and connection to physical reality.',
        balanced: 'Your earth element is steady - you can be practical without being rigid.'
    },
    Air: {
        keywords: 'Intellect, Communication, Ideas, Social Connection',
        description: 'Air signs (Gemini, Libra, Aquarius) process through thought and communication. High Air indicates mental agility and social intelligence.',
        highMeaning: 'Your mind moves quickly, connecting ideas and people. Communication flows naturally. You thrive in intellectual exchange.',
        lowMeaning: 'You may benefit from developing clearer communication and more intellectual detachment.',
        balanced: 'Your air is circulating well - you think clearly without overthinking.'
    },
    Water: {
        keywords: 'Emotion, Intuition, Empathy, Depth',
        description: 'Water signs (Cancer, Scorpio, Pisces) navigate through feeling and intuition. High Water indicates emotional depth and psychic sensitivity.',
        highMeaning: 'You feel deeply and intuit what others miss. Emotional intelligence is your superpower. You understand the unspoken.',
        lowMeaning: 'You may need to develop more emotional awareness and trust in your intuition.',
        balanced: 'Your water flows freely - you can feel deeply without drowning.'
    }
}

// Signs mapped to elements for calculation display
export const signElements = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
}

// Planet symbols mapping
export const planetSymbols = {
    sun: '\u2609', moon: '\u263D', rising: '\u2B06',
    mercury: '\u263F', venus: '\u2640', mars: '\u2642',
    jupiter: '\u2643', saturn: '\u2644', uranus: '\u2645', neptune: '\u2646', pluto: '\u2647',
    north_node: '\u260A', south_node: '\u260B', chiron: '\u26B7'
}

// Planet weight tiers
export const PLANET_WEIGHTS = {
    // Trinity (Heavy - 3.0x)
    sun: { weight: 3.0, tier: 'trinity', name: 'Sun' },
    moon: { weight: 3.0, tier: 'trinity', name: 'Moon' },
    rising: { weight: 3.0, tier: 'trinity', name: 'Rising' },
    // Personal Planets (Moderate - 2.0x)
    mercury: { weight: 2.0, tier: 'personal', name: 'Mercury' },
    venus: { weight: 2.0, tier: 'personal', name: 'Venus' },
    mars: { weight: 2.0, tier: 'personal', name: 'Mars' },
    // Outer Planets (Lesser - 1.0x)
    jupiter: { weight: 1.0, tier: 'outer', name: 'Jupiter' },
    saturn: { weight: 1.0, tier: 'outer', name: 'Saturn' },
    uranus: { weight: 1.0, tier: 'outer', name: 'Uranus' },
    neptune: { weight: 1.0, tier: 'outer', name: 'Neptune' },
    pluto: { weight: 1.0, tier: 'outer', name: 'Pluto' },
    north_node: { weight: 1.0, tier: 'outer', name: 'North Node' },
    south_node: { weight: 1.0, tier: 'outer', name: 'South Node' },
    chiron: { weight: 0.5, tier: 'minimal', name: 'Chiron' }
}

// Generate bar chart string
export const generateBar = (weight) => {
    const blocks = Math.round(weight * 4)
    return '\u2588'.repeat(blocks)
}

// Calculate detailed element breakdown from planets
export const calculateElementBreakdown = (planets, risingSign) => {
    const breakdown = {
        Fire: { trinity: [], personal: [], outer: [], minimal: [], total: 0 },
        Earth: { trinity: [], personal: [], outer: [], minimal: [], total: 0 },
        Air: { trinity: [], personal: [], outer: [], minimal: [], total: 0 },
        Water: { trinity: [], personal: [], outer: [], minimal: [], total: 0 }
    }

    // Process each planet
    Object.entries(planets || {}).forEach(([key, planet]) => {
        const planetInfo = PLANET_WEIGHTS[key]
        if (!planetInfo || !planet?.sign) return

        const element = signElements[planet.sign]
        if (!element || !breakdown[element]) return

        const entry = {
            key,
            symbol: planetSymbols[key] || '\u25CF',
            name: planetInfo.name,
            sign: planet.sign,
            weight: planetInfo.weight,
            bar: generateBar(planetInfo.weight)
        }

        breakdown[element][planetInfo.tier].push(entry)
        breakdown[element].total += planetInfo.weight
    })

    // Add Rising sign if available
    if (risingSign && signElements[risingSign]) {
        const element = signElements[risingSign]
        breakdown[element].trinity.push({
            key: 'rising',
            symbol: '\u2B06',
            name: 'Rising',
            sign: risingSign,
            weight: 3.0,
            bar: generateBar(3.0)
        })
        breakdown[element].total += 3.0
    }

    return breakdown
}

// Detect stelliums (3+ planets in same sign)
export const detectStelliums = (planets, risingSign) => {
    const signCount = {}

    // Count planets per sign
    Object.entries(planets || {}).forEach(([key, planet]) => {
        if (!planet?.sign) return
        if (!signCount[planet.sign]) {
            signCount[planet.sign] = { count: 0, planets: [], points: 0 }
        }
        const weight = PLANET_WEIGHTS[key]?.weight || 1.0
        signCount[planet.sign].count++
        signCount[planet.sign].planets.push(PLANET_WEIGHTS[key]?.name || key)
        signCount[planet.sign].points += weight
    })

    // Add rising
    if (risingSign) {
        if (!signCount[risingSign]) {
            signCount[risingSign] = { count: 0, planets: [], points: 0 }
        }
        signCount[risingSign].count++
        signCount[risingSign].planets.push('Rising')
        signCount[risingSign].points += 3.0
    }

    // Find stelliums
    const stelliums = []
    Object.entries(signCount).forEach(([sign, data]) => {
        if (data.count >= 3) {
            stelliums.push({
                sign,
                element: signElements[sign],
                count: data.count,
                planets: data.planets,
                points: data.points
            })
        }
    })

    return stelliums
}

// Generate insight based on element breakdown
export const generateElementInsight = (element, breakdown, totalChartWeight, stelliums) => {
    const percentage = totalChartWeight > 0 ? (breakdown.total / totalChartWeight) * 100 : 0
    const trinityTotal = breakdown.trinity.reduce((sum, p) => sum + p.weight, 0)
    const personalTotal = breakdown.personal.reduce((sum, p) => sum + p.weight, 0)
    const outerTotal = breakdown.outer.reduce((sum, p) => sum + p.weight, 0)

    const relevantStellium = stelliums.find(s => s.element === element)

    // Check for special patterns
    if (element === 'Earth' && breakdown.trinity.length === 3) {
        return '\u{1F4A1} TRIPLE EARTH TRINITY: Sun/Moon/Rising ALL in Earth signs. This is RARE (only 3% of population). Your core identity, emotional nature, and outer persona are ALL grounded. Result: Unshakeable stability, practical mastery, builds lasting value.'
    }

    if (trinityTotal === 0 && personalTotal === 0 && outerTotal > 0) {
        return `\u{1F4A1} BORROWED ${element.toUpperCase()}: Your ${element} comes ONLY from outer planets (generational). This means ${element} is AVAILABLE but not core to identity. You can access ${element.toLowerCase()} energy when vision aligns, but you don't NEED it daily.`
    }

    if (element === 'Water' && breakdown.personal.length === 1 && breakdown.personal[0].name === 'Venus') {
        return '\u{1F4A1} WATER PARADOX: Your ONLY Water is Venus (love/values). You CAN access emotional depth IN RELATIONSHIPS ONLY. Outside relationships, emotions feel "impractical." With colleagues: practical. With loved ones: surprisingly tender.'
    }

    if (percentage >= 40) {
        const meanings = {
            Fire: 'You burn bright with passion and initiative. Your energy inspires others to action.',
            Earth: 'You are exceptionally grounded and practical. You build lasting structures.',
            Air: 'You excel at abstract thinking and communication. Your mind moves quickly.',
            Water: 'You have exceptional emotional depth and intuitive wisdom.'
        }
        return `\u{1F4A1} ${element.toUpperCase()} DOMINANT: ${meanings[element]}`
    }

    if (percentage < 15) {
        const deficits = {
            Fire: 'You may struggle with self-promotion and maintaining enthusiasm. Growth edge: Practice passion in small doses.',
            Earth: 'You may struggle with grounding and practical follow-through. Growth edge: Develop body awareness, create structure.',
            Air: 'You think through DOING or FEELING, not conceptualizing. Growth edge: Practice articulating embodied wisdom.',
            Water: 'You process feelings through DOING or THINKING. Growth edge: Practice feeling before fixing.'
        }
        return `\u26A0\uFE0F ${element.toUpperCase()} DEFICIT: ${deficits[element]}`
    }

    return null
}
