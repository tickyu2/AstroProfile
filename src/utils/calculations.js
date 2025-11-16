// ============================================
// AGE CALCULATION
// ============================================
export function calculateAge(birthDate) {
    const birth = new Date(birthDate)
    const today = new Date()

    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    if (days < 0) {
        months--
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        days += lastMonth.getDate()
    }

    if (months < 0) {
        years--
        months += 12
    }

    return { years, months, days }
}

// ============================================
// CHINESE ZODIAC CALCULATION
// ============================================
export function getChineseZodiac(birthDate) {
    const birth = new Date(birthDate)
    const year = birth.getFullYear()

    // Chinese zodiac animals (12-year cycle starting from 1900 = Rat)
    const animals = [
        'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
        'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
    ]

    // Elements (5-year cycle)
    const elements = ['Metal', 'Water', 'Wood', 'Fire', 'Earth']

    // Chinese New Year dates (approximate - Feb 4th for simplicity in Phase 1)
    const month = birth.getMonth() + 1
    const day = birth.getDate()

    // If before Feb 4, use previous year
    let chineseYear = year
    if (month === 1 || (month === 2 && day < 4)) {
        chineseYear--
    }

    // Calculate animal (1900 is Year of Rat, index 0)
    const animalIndex = (chineseYear - 1900) % 12
    const animal = animals[animalIndex]

    // Calculate element (Metal starts at 0, 1)
    const elementIndex = Math.floor(((chineseYear - 1900) % 10) / 2)
    const element = elements[elementIndex]

    // Determine Yin/Yang for animal (even years = Yang, odd = Yin in zodiac order)
    const animalYinYang = animalIndex % 2 === 0 ? 'Yang' : 'Yin'

    return {
        animal,
        element,
        year: chineseYear,
        animalYinYang,
        fullSign: `${element} ${animal}`
    }
}

// ============================================
// WESTERN ZODIAC (SUN SIGN)
// ============================================
export function getWesternZodiac(birthDate) {
    const birth = new Date(birthDate)
    const month = birth.getMonth() + 1
    const day = birth.getDate()

    const signs = [
        { sign: 'Capricorn', element: 'Earth', yinYang: 'Yin', start: [12, 22], end: [1, 19] },
        { sign: 'Aquarius', element: 'Air', yinYang: 'Yang', start: [1, 20], end: [2, 18] },
        { sign: 'Pisces', element: 'Water', yinYang: 'Yin', start: [2, 19], end: [3, 20] },
        { sign: 'Aries', element: 'Fire', yinYang: 'Yang', start: [3, 21], end: [4, 19] },
        { sign: 'Taurus', element: 'Earth', yinYang: 'Yin', start: [4, 20], end: [5, 20] },
        { sign: 'Gemini', element: 'Air', yinYang: 'Yang', start: [5, 21], end: [6, 20] },
        { sign: 'Cancer', element: 'Water', yinYang: 'Yin', start: [6, 21], end: [7, 22] },
        { sign: 'Leo', element: 'Fire', yinYang: 'Yang', start: [7, 23], end: [8, 22] },
        { sign: 'Virgo', element: 'Earth', yinYang: 'Yin', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', element: 'Air', yinYang: 'Yang', start: [9, 23], end: [10, 22] },
        { sign: 'Scorpio', element: 'Water', yinYang: 'Yin', start: [10, 23], end: [11, 21] },
        { sign: 'Sagittarius', element: 'Fire', yinYang: 'Yang', start: [11, 22], end: [12, 21] }
    ]

    for (const s of signs) {
        const [startMonth, startDay] = s.start
        const [endMonth, endDay] = s.end

        if (
            (month === startMonth && day >= startDay) ||
            (month === endMonth && day <= endDay)
        ) {
            return s
        }
    }

    return signs[0] // Default to Capricorn if something goes wrong
}

// ============================================
// DAY OF WEEK CALCULATION
// ============================================
export function getDayOfWeek(birthDate) {
    const birth = new Date(birthDate)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = days[birth.getDay()]

    // Planetary rulers
    const rulers = {
        'Sunday': { planet: 'Sun', traits: 'Leadership, confidence, vitality' },
        'Monday': { planet: 'Moon', traits: 'Sensitivity, intuition, nurturing' },
        'Tuesday': { planet: 'Mars', traits: 'Courage, passion, action' },
        'Wednesday': { planet: 'Mercury', traits: 'Communication, intelligence, adaptability' },
        'Thursday': { planet: 'Jupiter', traits: 'Optimism, expansion, wisdom' },
        'Friday': { planet: 'Venus', traits: 'Love, beauty, harmony' },
        'Saturday': { planet: 'Saturn', traits: 'Discipline, responsibility, structure' }
    }

    return {
        day: dayName,
        planet: rulers[dayName].planet,
        traits: rulers[dayName].traits
    }
}

// ============================================
// YIN/YANG RATIO CALCULATION (SIMPLIFIED)
// ============================================
export function calculateYinYang(chineseZodiac, westernZodiac) {
    let yinCount = 0
    let yangCount = 0
    const factors = []

    // Chinese Animal
    if (chineseZodiac.animalYinYang === 'Yin') {
        yinCount++
        factors.push(`Chinese Animal (${chineseZodiac.animal}): Yin`)
    } else {
        yangCount++
        factors.push(`Chinese Animal (${chineseZodiac.animal}): Yang`)
    }

    // Chinese Element
    if (['Water', 'Metal'].includes(chineseZodiac.element)) {
        yinCount++
        factors.push(`Chinese Element (${chineseZodiac.element}): Yin`)
    } else if (['Wood', 'Fire'].includes(chineseZodiac.element)) {
        yangCount++
        factors.push(`Chinese Element (${chineseZodiac.element}): Yang`)
    } else {
        // Earth is neutral, split 0.5/0.5
        yinCount += 0.5
        yangCount += 0.5
        factors.push(`Chinese Element (${chineseZodiac.element}): Neutral (50% Yin, 50% Yang)`)
    }

    // Western Sign
    if (westernZodiac.yinYang === 'Yin') {
        yinCount++
        factors.push(`Western Sign (${westernZodiac.sign}): Yin`)
    } else {
        yangCount++
        factors.push(`Western Sign (${westernZodiac.sign}): Yang`)
    }

    const total = yinCount + yangCount
    const yinPercentage = Math.round((yinCount / total) * 100)
    const yangPercentage = Math.round((yangCount / total) * 100)

    return {
        yinPercentage,
        yangPercentage,
        yinCount,
        yangCount,
        factors
    }
}

// ============================================
// NUMEROLOGY CALCULATIONS
// ============================================

// Reduce number to single digit (except master numbers 11, 22, 33)
function reduceToSingleDigit(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
    }
    return num
}

// Life Path Number (most important - from birth date)
export function calculateLifePath(birthDate) {
    const birth = new Date(birthDate)
    const year = birth.getFullYear()
    const month = birth.getMonth() + 1
    const day = birth.getDate()

    // Sum all digits
    const yearSum = reduceToSingleDigit(year)
    const monthSum = reduceToSingleDigit(month)
    const daySum = reduceToSingleDigit(day)

    const lifePathNumber = reduceToSingleDigit(yearSum + monthSum + daySum)

    const meanings = {
        1: 'The Leader - Independent, ambitious, pioneering',
        2: 'The Peacemaker - Diplomatic, cooperative, sensitive',
        3: 'The Creative - Expressive, optimistic, artistic',
        4: 'The Builder - Practical, reliable, hardworking',
        5: 'The Freedom Seeker - Adventurous, versatile, progressive',
        6: 'The Nurturer - Responsible, caring, community-oriented',
        7: 'The Seeker - Analytical, spiritual, introspective',
        8: 'The Powerhouse - Ambitious, organized, materialistic',
        9: 'The Humanitarian - Compassionate, generous, idealistic',
        11: 'The Visionary - Intuitive, inspirational, idealistic (Master Number)',
        22: 'The Master Builder - Powerful, capable of great achievements (Master Number)',
        33: 'The Master Teacher - Compassionate teacher, highly evolved (Master Number)'
    }

    return {
        number: lifePathNumber,
        meaning: meanings[lifePathNumber]
    }
}

// Expression Number (from full name)
export function calculateExpression(firstName, lastName) {
    const letterValues = {
        A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
        J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
        S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    }

    const fullName = (firstName + lastName).toUpperCase().replace(/[^A-Z]/g, '')
    const sum = fullName.split('').reduce((total, letter) => total + (letterValues[letter] || 0), 0)
    const expressionNumber = reduceToSingleDigit(sum)

    const meanings = {
        1: 'Natural leader, original thinker',
        2: 'Diplomatic communicator, team player',
        3: 'Creative expresser, entertainer',
        4: 'Practical organizer, builder',
        5: 'Dynamic communicator, explorer',
        6: 'Nurturing caregiver, counselor',
        7: 'Deep thinker, researcher',
        8: 'Powerful achiever, business-minded',
        9: 'Humanitarian speaker, teacher',
        11: 'Inspirational leader (Master)',
        22: 'Visionary architect (Master)',
        33: 'Master healer and teacher (Master)'
    }

    return {
        number: expressionNumber,
        meaning: meanings[expressionNumber]
    }
}

// Soul Urge Number (from vowels in name - inner desires)
export function calculateSoulUrge(firstName, lastName) {
    const letterValues = {
        A: 1, E: 5, I: 9, O: 6, U: 3
    }

    const fullName = (firstName + lastName).toUpperCase()
    const vowels = fullName.match(/[AEIOU]/g) || []
    const sum = vowels.reduce((total, letter) => total + (letterValues[letter] || 0), 0)
    const soulUrgeNumber = reduceToSingleDigit(sum)

    const meanings = {
        1: 'Desires independence and leadership',
        2: 'Craves peace and partnership',
        3: 'Yearns for creative expression',
        4: 'Seeks stability and security',
        5: 'Longs for freedom and adventure',
        6: 'Desires to nurture and serve',
        7: 'Seeks spiritual understanding',
        8: 'Desires material success and power',
        9: 'Yearns to help humanity',
        11: 'Desires spiritual enlightenment (Master)',
        22: 'Yearns to build lasting legacy (Master)',
        33: 'Desires to uplift and heal (Master)'
    }

    return {
        number: soulUrgeNumber,
        meaning: meanings[soulUrgeNumber]
    }
}

// Personal Year Number (for current year guidance)
export function calculatePersonalYear(birthDate) {
    const birth = new Date(birthDate)
    const currentYear = new Date().getFullYear()
    const month = birth.getMonth() + 1
    const day = birth.getDate()

    const sum = reduceToSingleDigit(month) + reduceToSingleDigit(day) + reduceToSingleDigit(currentYear)
    const personalYear = reduceToSingleDigit(sum)

    const meanings = {
        1: 'New Beginnings - Time to start fresh, take initiative',
        2: 'Cooperation - Focus on relationships, patience required',
        3: 'Creativity - Express yourself, socialize, enjoy',
        4: 'Foundation Building - Work hard, be practical, establish security',
        5: 'Change & Freedom - Embrace change, travel, explore',
        6: 'Responsibility - Focus on home, family, service to others',
        7: 'Reflection - Time for introspection, spiritual growth, rest',
        8: 'Achievement - Business success, financial gains, recognition',
        9: 'Completion - Let go of the old, prepare for new cycle'
    }

    return {
        year: currentYear,
        number: personalYear,
        meaning: meanings[personalYear]
    }
}

// Master function to get all numerology data
export function calculateNumerology(firstName, lastName, birthDate) {
    return {
        lifePath: calculateLifePath(birthDate),
        expression: calculateExpression(firstName, lastName),
        soulUrge: calculateSoulUrge(firstName, lastName),
        personalYear: calculatePersonalYear(birthDate)
    }
}