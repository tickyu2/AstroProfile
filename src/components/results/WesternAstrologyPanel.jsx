import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponsiveRadar } from '@nivo/radar'
import { getZodiacSecrets, SECTION_TITLES } from '../../data/westernZodiacContent'
import { useProfiles } from '../../contexts/ProfileContext'
import SoulFamilyPanel from '../soul/SoulFamilyPanel'
import HouseSignZonePopup from './HouseSignZonePopup'

// Element colors for Western astrology radar
const WESTERN_ELEMENT_COLORS = {
    Fire: '#ef4444',
    Earth: '#84cc16',
    Air: '#60a5fa',
    Water: '#06b6d4'
}

const zodiacEmojis = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
}

/**
 * Format degree for display, with fallback for legacy profiles
 *
 * v2.0 Python profiles include `degreeFormatted` directly - this helper
 * provides backward compatibility for profiles created before v2.0.
 *
 * @param {Object} planetData - Planet data object (may have degreeFormatted, degree, sign)
 * @returns {string} - Formatted degree string (e.g., "14.05° Cancer") or empty string
 */
const formatDegree = (planetData) => {
    if (!planetData) return ''
    // v2.0: Use degreeFormatted if available (pre-formatted by Python)
    if (planetData.degreeFormatted) return planetData.degreeFormatted
    // Legacy fallback: format from degree + sign
    if (planetData.degree !== undefined && planetData.sign) {
        return `${Number(planetData.degree).toFixed(2)}° ${planetData.sign}`
    }
    return ''
}

const westernPersonality = {
    'Taurus': 'You build things that last. Patient, practical, and impossibly stubborn - you value stability, beauty, and sensory pleasure. Your determination is legendary; your loyalty, unshakeable.',
    'Aries': 'You are pure initiative energy. Bold, passionate, and always first - you charge into life headfirst. Your courage inspires others; your impatience frustrates them. You were born to lead the charge.',
    'Gemini': 'You are mental quicksilver. Curious, adaptable, and endlessly communicative - your mind never stops dancing. You collect ideas and connections like others collect stamps.',
    'Cancer': 'You are emotional depth personified. Nurturing, intuitive, and fiercely protective - family and security matter more than anything. Your sensitivity picks up what others miss.',
    'Leo': 'You are born royalty. Generous, dramatic, and magnetically confident - you need to shine and inspire. Leadership comes naturally; humility does not. You create joy wherever you go.',
    'Virgo': 'You are precision personified. Analytical, helpful, and impossibly detail-oriented - you improve everything you touch. Your service comes from deep care, not weakness.',
    'Libra': 'You are balance seeking beauty. Diplomatic, charming, and aesthetically obsessed - you cannot tolerate ugliness or discord. You create harmony through relationship and art.',
    'Scorpio': 'You are intensity incarnate. Passionate, mysterious, and emotionally fearless - you dive into depths others fear. Your power comes from transformation and truth.',
    'Sagittarius': 'You are freedom seeking wisdom. Optimistic, philosophical, and brutally honest - you need adventure and meaning above all. Boredom is your hell; exploration, your heaven.',
    'Capricorn': 'You are ambition with patience. Disciplined, responsible, and impossibly persistent - you climb mountains others deem impossible. Success is inevitable; shortcuts, unthinkable.',
    'Aquarius': 'You are revolutionary vision. Innovative, humanitarian, and delightfully weird - you see the future before others catch up. Convention bores you; change energizes you.',
    'Pisces': 'You are infinite empathy. Intuitive, artistic, and emotionally boundless - you feel everything everyone feels. Your sensitivity is your superpower and your challenge.'
}

// Retrograde interpretations for natal charts
const retrogradeInterpretations = {
    mercury: {
        title: 'Mercury Retrograde Native',
        brief: 'Deep thinker, internal processor',
        full: 'You process information differently - turning thoughts inward before expressing them. Your mind works in spirals rather than straight lines, often revisiting and refining ideas. You may have felt misunderstood as a child, but this gives you unique insight into communication patterns others miss.'
    },
    venus: {
        title: 'Venus Retrograde Native',
        brief: 'Unconventional heart, private values',
        full: 'Your approach to love and beauty follows its own rules. You may take longer to open up romantically, preferring depth over display. Past-life themes around love and self-worth often surface for healing. Your taste is distinctively yours - never following trends blindly.'
    },
    mars: {
        title: 'Mars Retrograde Native',
        brief: 'Strategic action, internalized drive',
        full: 'Your energy and ambition flow inward before outward expression. You are a master strategist who thinks before acting. Anger may simmer beneath the surface rather than exploding outward. Physical energy works in cycles - intense bursts followed by recovery periods.'
    },
    jupiter: {
        title: 'Jupiter Retrograde Native',
        brief: 'Inner philosopher, personal faith',
        full: 'You find meaning and expansion through inner exploration rather than external achievement. Your philosophy of life is self-developed, not borrowed from others. Luck often comes through internal growth and spiritual development rather than obvious external windfalls.'
    },
    saturn: {
        title: 'Saturn Retrograde Native',
        brief: 'Self-imposed standards, questions authority',
        full: 'You create your own rules and structures rather than accepting society\'s defaults. Authority figures may have been absent or unreliable, teaching you self-reliance early. You hold yourself to high internal standards - often harder on yourself than any external critic. Mastery comes later in life but runs deeper.'
    },
    uranus: {
        title: 'Uranus Retrograde Native',
        brief: 'Inner revolutionary, unique individualism',
        full: 'Your rebellious and innovative nature works from the inside out. You may appear conventional on the surface while harboring radical ideas within. Your genius emerges in unexpected ways and on your own timeline. You\'re here to revolutionize yourself first, then perhaps the world.'
    },
    neptune: {
        title: 'Neptune Retrograde Native',
        brief: 'Inner mystic, personal spirituality',
        full: 'Your spiritual and intuitive gifts are deeply personal and internal. You may distrust organized religion or mass spirituality, preferring a direct connection to the divine. Dreams and intuition speak loudly to you. Your imagination and creativity flow from a deep internal well.'
    },
    pluto: {
        title: 'Pluto Retrograde Native',
        brief: 'Internal transformer, soul depth',
        full: 'Your transformative power works primarily on yourself. You undergo profound internal metamorphoses that others may never fully witness. Past lives and ancestral patterns surface for healing. Your power grows through self-mastery rather than external control. You\'re intimate with the shadow side of existence.'
    },
    north_node: {
        title: 'North Node Retrograde Native',
        brief: 'Karmic path through inner reflection',
        full: 'Your soul\'s growth direction works through internal development before external manifestation. You may feel drawn to revisit past-life talents and comfort zones (South Node themes) before confidently stepping into your North Node destiny. Your karmic lessons unfold through introspection, dreams, and subtle inner guidance rather than obvious external events.'
    },
    south_node: {
        title: 'South Node Retrograde Native',
        brief: 'Past-life wisdom internalized',
        full: 'Your accumulated past-life gifts and patterns are processed internally. You carry deep ancestral and karmic memories that surface through intuition and déjà vu experiences. The challenge is to honor this wisdom while still moving toward new growth.'
    },
    chiron: {
        title: 'Chiron Retrograde Native',
        brief: 'Inner healer, wounds transform to wisdom',
        full: 'Your deepest wounds and healing gifts work from the inside out. You may have experienced early life challenges that weren\'t visible to others. Your path to becoming a healer involves first addressing your own internal pain. The wisdom you gain becomes medicine for others, but only after you\'ve integrated it yourself.'
    }
}

// Element icons and colors for Western astrology
const elementConfig = {
    Fire: { icon: '🔥', color: 'red', bgClass: 'bg-red-500/20', textClass: 'text-red-400', borderClass: 'border-red-500/40' },
    Earth: { icon: '🌍', color: 'amber', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400', borderClass: 'border-amber-500/40' },
    Air: { icon: '💨', color: 'cyan', bgClass: 'bg-cyan-500/20', textClass: 'text-cyan-400', borderClass: 'border-cyan-500/40' },
    Water: { icon: '💧', color: 'blue', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400', borderClass: 'border-blue-500/40' }
}

// Element meanings for Western astrology
const elementMeanings = {
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

// Western Houses data - 12 life domains
const WESTERN_HOUSES = {
    1: {
        icon: '🎭', name: 'Self & Identity', keyword: 'The Mask', element: 'Fire',
        domain: 'Physical appearance, first impressions, how you start things',
        careers: ['Actor', 'Model', 'Influencer', 'Public speaker', 'Leader'],
        complement: 7, complementName: '7th (Partnerships)'
    },
    2: {
        icon: '💰', name: 'Money & Values', keyword: 'The Vault', element: 'Earth',
        domain: 'Money, possessions, self-worth, material security',
        careers: ['Finance', 'Banking', 'Real estate', 'Wealth management'],
        complement: 8, complementName: '8th (Shared Resources)'
    },
    3: {
        icon: '📱', name: 'Communication', keyword: 'The Messenger', element: 'Air',
        domain: 'Communication, siblings, short trips, daily learning, languages',
        careers: ['Writer', 'Journalist', 'Teacher', 'Translator', 'Social media'],
        complement: 9, complementName: '9th (Philosophy)'
    },
    4: {
        icon: '🏡', name: 'Home & Roots', keyword: 'The Foundation', element: 'Water',
        domain: 'Home, family, roots, emotional security, private life',
        careers: ['Interior design', 'Family therapy', 'Real estate', 'Chef'],
        complement: 10, complementName: '10th (Career)'
    },
    5: {
        icon: '🎨', name: 'Creativity', keyword: 'The Artist', element: 'Fire',
        domain: 'Creativity, romance, children, hobbies, joy, self-expression',
        careers: ['Artist', 'Entertainer', 'Teacher', 'Game designer', 'Performer'],
        complement: 11, complementName: '11th (Community)'
    },
    6: {
        icon: '🏥', name: 'Health & Service', keyword: 'The Healer', element: 'Earth',
        domain: 'Daily work, health, routines, service, pets, duties',
        careers: ['Doctor', 'Nurse', 'Nutritionist', 'Fitness trainer', 'Assistant'],
        complement: 12, complementName: '12th (Spirituality)'
    },
    7: {
        icon: '💑', name: 'Partnerships', keyword: 'The Mirror', element: 'Air',
        domain: 'Marriage, business partners, contracts, equality',
        careers: ['Mediator', 'Marriage counselor', 'Diplomat', 'Partnership law'],
        complement: 1, complementName: '1st (Self)'
    },
    8: {
        icon: '🔮', name: 'Transformation', keyword: 'The Phoenix', element: 'Water',
        domain: 'Death/rebirth, shared money, intimacy, psychology, occult',
        careers: ['Psychologist', 'Investigator', 'Estate planner', 'Researcher'],
        complement: 2, complementName: '2nd (Personal Resources)'
    },
    9: {
        icon: '🌍', name: 'Philosophy', keyword: 'The Philosopher', element: 'Fire',
        domain: 'Philosophy, travel, higher education, religion, publishing',
        careers: ['Professor', 'Philosopher', 'Travel guide', 'Publisher', 'Minister'],
        complement: 3, complementName: '3rd (Communication)'
    },
    10: {
        icon: '👔', name: 'Career', keyword: 'The Mountain', element: 'Earth',
        domain: 'Career, reputation, public life, authority, legacy',
        careers: ['CEO', 'Politician', 'Public figure', 'Executive', 'Authority'],
        complement: 4, complementName: '4th (Home)'
    },
    11: {
        icon: '🤝', name: 'Community', keyword: 'The Revolutionary', element: 'Air',
        domain: 'Friends, groups, humanitarian ideals, technology, future vision',
        careers: ['Activist', 'Tech innovator', 'Community organizer', 'Futurist'],
        complement: 5, complementName: '5th (Creativity)'
    },
    12: {
        icon: '🕉️', name: 'Spirituality', keyword: 'The Mystic', element: 'Water',
        domain: 'Spirituality, dreams, hidden matters, institutions, surrender',
        careers: ['Spiritual teacher', 'Artist', 'Therapist', 'Hospital worker'],
        complement: 6, complementName: '6th (Health & Service)'
    }
}

// House element colors
const HOUSE_ELEMENT_COLORS = {
    Fire: { border: 'border-red-500/40', bg: 'bg-red-500/10', text: 'text-red-400' },
    Earth: { border: 'border-lime-500/40', bg: 'bg-lime-500/10', text: 'text-lime-400' },
    Air: { border: 'border-blue-400/40', bg: 'bg-blue-400/10', text: 'text-blue-400' },
    Water: { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-400' }
}

// Signs mapped to elements for calculation display
const signElements = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
}

// Planet symbols mapping
const planetSymbols = {
    sun: '☉', moon: '☽', rising: '⬆',
    mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
    north_node: '☊', south_node: '☋', chiron: '⚷'
}

// Planet weight tiers
const PLANET_WEIGHTS = {
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
const generateBar = (weight) => {
    const blocks = Math.round(weight * 4)
    return '█'.repeat(blocks)
}

// Calculate detailed element breakdown from planets
const calculateElementBreakdown = (planets, risingSign) => {
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
            symbol: planetSymbols[key] || '●',
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
            symbol: '⬆',
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
const detectStelliums = (planets, risingSign) => {
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
const generateElementInsight = (element, breakdown, totalChartWeight, stelliums) => {
    const percentage = totalChartWeight > 0 ? (breakdown.total / totalChartWeight) * 100 : 0
    const trinityTotal = breakdown.trinity.reduce((sum, p) => sum + p.weight, 0)
    const personalTotal = breakdown.personal.reduce((sum, p) => sum + p.weight, 0)
    const outerTotal = breakdown.outer.reduce((sum, p) => sum + p.weight, 0)

    const relevantStellium = stelliums.find(s => s.element === element)

    // Check for special patterns
    if (element === 'Earth' && breakdown.trinity.length === 3) {
        return '💡 TRIPLE EARTH TRINITY: Sun/Moon/Rising ALL in Earth signs. This is RARE (only 3% of population). Your core identity, emotional nature, and outer persona are ALL grounded. Result: Unshakeable stability, practical mastery, builds lasting value.'
    }

    if (trinityTotal === 0 && personalTotal === 0 && outerTotal > 0) {
        return `💡 BORROWED ${element.toUpperCase()}: Your ${element} comes ONLY from outer planets (generational). This means ${element} is AVAILABLE but not core to identity. You can access ${element.toLowerCase()} energy when vision aligns, but you don't NEED it daily.`
    }

    if (element === 'Water' && breakdown.personal.length === 1 && breakdown.personal[0].name === 'Venus') {
        return '💡 WATER PARADOX: Your ONLY Water is Venus (love/values). You CAN access emotional depth IN RELATIONSHIPS ONLY. Outside relationships, emotions feel "impractical." With colleagues: practical. With loved ones: surprisingly tender.'
    }

    if (percentage >= 40) {
        const meanings = {
            Fire: 'You burn bright with passion and initiative. Your energy inspires others to action.',
            Earth: 'You are exceptionally grounded and practical. You build lasting structures.',
            Air: 'You excel at abstract thinking and communication. Your mind moves quickly.',
            Water: 'You have exceptional emotional depth and intuitive wisdom.'
        }
        return `💡 ${element.toUpperCase()} DOMINANT: ${meanings[element]}`
    }

    if (percentage < 15) {
        const deficits = {
            Fire: 'You may struggle with self-promotion and maintaining enthusiasm. Growth edge: Practice passion in small doses.',
            Earth: 'You may struggle with grounding and practical follow-through. Growth edge: Develop body awareness, create structure.',
            Air: 'You think through DOING or FEELING, not conceptualizing. Growth edge: Practice articulating embodied wisdom.',
            Water: 'You process feelings through DOING or THINKING. Growth edge: Practice feeling before fixing.'
        }
        return `⚠️ ${element.toUpperCase()} DEFICIT: ${deficits[element]}`
    }

    return null
}

// ===========================================
// 36-CUSP ZODIAC PROFILES DATABASE
// ===========================================
// Each cusp position has typical element distributions
// Pure signs are strongly dominant (50-60%), cusps blend adjacent signs

const CUSP_PROFILES = [
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
const ELEMENT_MEANINGS = {
    Fire: {
        icon: '🔥',
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
        icon: '🌍',
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
        icon: '💨',
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
        icon: '💧',
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
const calculateOverlapScore = (person1, person2) => {
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
const calculateComplementScore = (person1, person2) => {
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
const calculateCommunicationScore = (person1, person2) => {
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
const calculateTotalCompatibility = (overlapTotal, complementAvg, commScore) => {
    return (overlapTotal * 0.20) + (complementAvg * 0.60) + (commScore * 0.20)
}

// Get A-F grade with letter grade and proper styling
const getCompatibilityRating = (score) => {
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
const normalizeScores = (cuspsWithRawScores) => {
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
const rankAllCusps = (userElements) => {
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
const analyzeUserConstitution = (userElements) => {
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
const calculateIdealPartner = (userAnalysis) => {
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
const generateMatchReasons = (userElements, cusp, userAnalysis) => {
    const reasons = []

    // Check Water contribution
    if (userAnalysis.hasWaterDeficit && cusp.elements.Water > 30) {
        reasons.push({
            icon: '💧',
            text: `Water ${cusp.elements.Water}%: Fills your Water deficit with emotional depth you lack`
        })
    }

    // Check Air contribution
    if (userAnalysis.hasAirDeficit && cusp.elements.Air > 25) {
        reasons.push({
            icon: '💨',
            text: `Air ${cusp.elements.Air}%: Fills your Air deficit with articulation ability`
        })
    }

    // Check Earth common ground
    if (userElements.Earth > 30 && cusp.elements.Earth >= 15 && cusp.elements.Earth <= 25) {
        reasons.push({
            icon: '🌍',
            text: `Earth ${cusp.elements.Earth}%: Good common ground for grounding rapport`
        })
    }

    // Check Fire balance
    if (userElements.Earth > 40 && cusp.elements.Fire <= 20) {
        reasons.push({
            icon: '🔥',
            text: `Fire ${cusp.elements.Fire}%: Minimal Fire won't overwhelm your stability`
        })
    }

    // Combined Air+Water check
    const partnerAirWater = cusp.elements.Air + cusp.elements.Water
    if (partnerAirWater >= 60 && (userAnalysis.hasAirDeficit || userAnalysis.hasWaterDeficit)) {
        reasons.push({
            icon: '💎',
            text: `Combined Air+Water (${partnerAirWater}%): Provides both communication AND emotional depth`
        })
    }

    return reasons
}

// Generate "why bad" reasons for a poor match
const generateBadMatchReasons = (userElements, cusp, userAnalysis) => {
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

// ===========================================
// WESTERN HOUSES SECTION COMPONENT
// ===========================================
function WesternHousesSection({ houses, planets }) {
    const [hoveredHouse, setHoveredHouse] = useState(null)
    const [showTheory, setShowTheory] = useState(false)
    const [showMasteryGuide, setShowMasteryGuide] = useState(false)

    // Helper: Convert sign + degree to absolute longitude
    const signToLongitude = (sign, degree) => {
        const signOrder = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
        const signIndex = signOrder.indexOf(sign)
        if (signIndex === -1) return undefined
        return (signIndex * 30) + (degree || 0)
    }

    // Helper: Extract longitude from a cusp object (handles multiple formats)
    const extractLongitude = (cusp) => {
        if (cusp === undefined || cusp === null) return undefined
        // Direct number value
        if (typeof cusp === 'number') return cusp
        // Object with longitude
        if (cusp.longitude !== undefined) return cusp.longitude
        // Object with degree + sign (convert to absolute longitude)
        if (cusp.degree !== undefined && cusp.sign) {
            return signToLongitude(cusp.sign, cusp.degree)
        }
        return undefined
    }

    // Helper: Get house cusp longitude from various possible data formats
    const getHouseCuspLongitude = (houseCusps, houseNum) => {
        if (!houseCusps) return undefined

        // Try various key formats: house_1, 1, "1"
        const possibleKeys = [
            `house_${houseNum}`,
            houseNum,
            String(houseNum),
            `${houseNum}`
        ]

        // Try direct access
        for (const key of possibleKeys) {
            const longitude = extractLongitude(houseCusps[key])
            if (longitude !== undefined) return longitude
        }

        // Try nested .houses format (can be object or array)
        if (houseCusps.houses) {
            // If array, use index (house 1 = index 0)
            if (Array.isArray(houseCusps.houses)) {
                const longitude = extractLongitude(houseCusps.houses[houseNum - 1])
                if (longitude !== undefined) return longitude
            } else {
                for (const key of possibleKeys) {
                    const longitude = extractLongitude(houseCusps.houses[key])
                    if (longitude !== undefined) return longitude
                }
            }
        }

        // Try nested .cusps format (can be object or array)
        if (houseCusps.cusps) {
            if (Array.isArray(houseCusps.cusps)) {
                const longitude = extractLongitude(houseCusps.cusps[houseNum - 1])
                if (longitude !== undefined) return longitude
            } else {
                for (const key of possibleKeys) {
                    const longitude = extractLongitude(houseCusps.cusps[key])
                    if (longitude !== undefined) return longitude
                }
            }
        }

        // Try if houseCusps itself is an array
        if (Array.isArray(houseCusps)) {
            const longitude = extractLongitude(houseCusps[houseNum - 1])
            if (longitude !== undefined) return longitude
        }

        return undefined
    }

    // Helper: Calculate which house a planet is in based on its longitude and house cusps
    const calculatePlanetHouse = (planetLongitude, houseCusps) => {
        if (planetLongitude === undefined || planetLongitude === null || !houseCusps) return null

        // House cusps are in order 1-12, each with a longitude
        // A planet is in house N if it's between cusp N and cusp N+1
        for (let i = 1; i <= 12; i++) {
            const currentCusp = getHouseCuspLongitude(houseCusps, i)
            const nextHouse = i === 12 ? 1 : i + 1
            const nextCusp = getHouseCuspLongitude(houseCusps, nextHouse)

            if (currentCusp === undefined || nextCusp === undefined) continue

            // Handle wrap-around at 0/360 degrees
            if (currentCusp <= nextCusp) {
                // Normal case: cusp doesn't cross 0°
                if (planetLongitude >= currentCusp && planetLongitude < nextCusp) {
                    return i
                }
            } else {
                // Wrap-around case: cusp crosses 0° (e.g., 350° to 10°)
                if (planetLongitude >= currentCusp || planetLongitude < nextCusp) {
                    return i
                }
            }
        }
        // Return null if house cannot be determined - do NOT default to house 1
        return null
    }

    // Calculate planets per house
    const housePlanetCounts = useMemo(() => {
        const counts = {}
        for (let i = 1; i <= 12; i++) {
            counts[i] = { planets: [], count: 0 }
        }

        if (planets) {
            Object.entries(planets).forEach(([key, planet]) => {
                // First check if planet already has house assignment
                let houseNum = planet.house

                // If not, calculate from longitude using house cusps
                if (!houseNum && planet.longitude !== undefined && houses) {
                    houseNum = calculatePlanetHouse(planet.longitude, houses)
                }

                // Also try calculating from degree if longitude not available
                if (!houseNum && planet.degree !== undefined && planet.sign && houses) {
                    // Convert sign + degree to absolute longitude
                    const signOrder = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                                      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
                    const signIndex = signOrder.indexOf(planet.sign)
                    if (signIndex !== -1) {
                        const absoluteLongitude = (signIndex * 30) + planet.degree
                        houseNum = calculatePlanetHouse(absoluteLongitude, houses)
                    }
                }

                if (houseNum && houseNum >= 1 && houseNum <= 12) {
                    counts[houseNum].planets.push({
                        name: planet.name || key,
                        symbol: planet.symbol || planetSymbols[key] || '?'
                    })
                    counts[houseNum].count++
                }
            })
        }

        return counts
    }, [planets, houses])

    // Get star rating based on planet count
    const getStarRating = (count) => {
        if (count >= 5) return { stars: '★★★★★', label: 'Very Strong' }
        if (count >= 3) return { stars: '★★★★☆', label: 'Strong' }
        if (count >= 2) return { stars: '★★★☆☆', label: 'Moderate' }
        if (count >= 1) return { stars: '★★☆☆☆', label: 'Activated' }
        return { stars: '☆☆☆☆☆', label: 'Empty' }
    }

    // Find strongest and weakest houses
    const housesRanked = useMemo(() => {
        return Object.entries(housePlanetCounts)
            .map(([num, data]) => ({ num: parseInt(num), ...data }))
            .sort((a, b) => b.count - a.count)
    }, [housePlanetCounts])

    const strongestHouse = housesRanked[0]
    const complementHouse = strongestHouse ? WESTERN_HOUSES[WESTERN_HOUSES[strongestHouse.num].complement] : null

    // Render individual house card
    const renderHouseCard = (houseNum) => {
        const house = WESTERN_HOUSES[houseNum]
        const planetData = housePlanetCounts[houseNum]
        const rating = getStarRating(planetData.count)
        const colors = HOUSE_ELEMENT_COLORS[house.element]
        const isHovered = hoveredHouse === houseNum
        const isStrong = planetData.count >= 3

        return (
            <div
                key={houseNum}
                className={`relative p-2 rounded-lg transition-all cursor-pointer ${colors.bg} border ${colors.border} ${
                    isHovered ? 'scale-105 shadow-lg z-10' : ''
                } ${isStrong ? 'ring-1 ring-amber-500/50' : ''}`}
                onMouseEnter={() => setHoveredHouse(houseNum)}
                onMouseLeave={() => setHoveredHouse(null)}
            >
                {/* House Icon & Number */}
                <div className="text-center">
                    <div className="text-xl mb-0.5">{house.icon}</div>
                    <div className={`text-[10px] font-bold ${colors.text}`}>{houseNum}{houseNum === 1 ? 'st' : houseNum === 2 ? 'nd' : houseNum === 3 ? 'rd' : 'th'} House</div>
                    <div className="text-[9px] text-white/70 truncate">{house.name}</div>
                </div>

                {/* Star Rating - Use visible colors for filled vs empty stars */}
                <div className="text-center mt-1">
                    <div className="text-[10px]">
                        <span className="text-amber-400">{rating.stars.replace(/☆/g, '')}</span>
                        <span className="text-white/30">{rating.stars.replace(/★/g, '')}</span>
                    </div>
                    <div className="text-[8px] text-white/50">{planetData.count} planet{planetData.count !== 1 ? 's' : ''}</div>
                </div>

                {/* Planet symbols if any */}
                {planetData.count > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1 flex-wrap">
                        {planetData.planets.slice(0, 4).map((p, i) => (
                            <span key={i} className="text-[10px] text-amber-300" title={p.name}>{p.symbol}</span>
                        ))}
                        {planetData.planets.length > 4 && (
                            <span className="text-[8px] text-white/40">+{planetData.planets.length - 4}</span>
                        )}
                    </div>
                )}

                {/* Hover Tooltip */}
                {isHovered && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-3 bg-slate-900/95 border border-white/20 rounded-lg shadow-xl z-20 text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{house.icon}</span>
                            <div>
                                <div className={`text-sm font-bold ${colors.text}`}>{house.name}</div>
                                <div className="text-[10px] text-white/50 italic">{house.keyword}</div>
                            </div>
                        </div>
                        <div className="text-[10px] text-white/80 mb-2">{house.domain}</div>

                        {planetData.count > 0 && (
                            <div className="text-[10px] text-amber-400 mb-2">
                                <span className="font-bold">Planets:</span> {planetData.planets.map(p => p.name).join(', ')}
                            </div>
                        )}

                        <div className="text-[10px] text-white/60 mb-1">
                            <span className="font-bold text-white/80">Careers:</span> {house.careers.slice(0, 3).join(', ')}
                        </div>

                        <div className="text-[10px] text-purple-400">
                            <span className="font-bold">Complement:</span> {house.complementName}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="bg-slate-900/40 rounded-lg p-3 mb-3 border border-slate-700/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🏛️</span>
                    <div>
                        <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Western Houses</div>
                        <div className="text-[9px] text-white/40 italic">Your Life Domain Strengths</div>
                    </div>
                </div>
                {strongestHouse && strongestHouse.count >= 1 && (
                    <div className="flex items-center gap-1.5">
                        {/* Strongest House Badge */}
                        <div className="text-[10px] px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                            {WESTERN_HOUSES[strongestHouse.num].icon} {strongestHouse.num}{strongestHouse.num === 1 ? 'st' : strongestHouse.num === 2 ? 'nd' : strongestHouse.num === 3 ? 'rd' : 'th'} House Strongest
                        </div>
                        {/* 2nd Strongest House Badge */}
                        {housesRanked[1] && housesRanked[1].count >= 1 && (
                            <div className="text-[10px] px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                                {WESTERN_HOUSES[housesRanked[1].num].icon} {housesRanked[1].num}{housesRanked[1].num === 1 ? 'st' : housesRanked[1].num === 2 ? 'nd' : housesRanked[1].num === 3 ? 'rd' : 'th'} House 2nd
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 3x4 House Grid */}
            <div className="space-y-2">
                {/* Row 1: Houses 1-4 (Self & Foundation) */}
                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Self & Foundation</div>
                <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map(num => renderHouseCard(num))}
                </div>

                {/* Row 2: Houses 5-8 (Creativity & Intimacy) */}
                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1 mt-3">Creativity & Intimacy</div>
                <div className="grid grid-cols-4 gap-1.5">
                    {[5, 6, 7, 8].map(num => renderHouseCard(num))}
                </div>

                {/* Row 3: Houses 9-12 (Meaning & Transcendence) */}
                <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1 mt-3">Meaning & Transcendence</div>
                <div className="grid grid-cols-4 gap-1.5">
                    {[9, 10, 11, 12].map(num => renderHouseCard(num))}
                </div>
            </div>

            {/* Compatibility Insight */}
            {strongestHouse && strongestHouse.count >= 2 && complementHouse && (
                <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="text-[10px] text-purple-400 font-medium mb-1">💡 Compatibility Insight</div>
                    <div className="text-[10px] text-white/70">
                        Strong {WESTERN_HOUSES[strongestHouse.num].icon} <span className="text-white/90 font-medium">{strongestHouse.num}{strongestHouse.num === 1 ? 'st' : strongestHouse.num === 2 ? 'nd' : strongestHouse.num === 3 ? 'rd' : 'th'} House ({WESTERN_HOUSES[strongestHouse.num].name})</span>
                        {' '}complements partner with strong{' '}
                        <span className="text-white/90 font-medium">{WESTERN_HOUSES[strongestHouse.num].complementName}</span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-3 grid grid-cols-4 gap-2">
                <button
                    className="flex flex-col items-center gap-1 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg transition-all text-[10px]"
                    onClick={() => setShowTheory(!showTheory)}
                >
                    <span className="text-base">📚</span>
                    <span className="text-white/70">More Info</span>
                </button>
                <button
                    className="flex flex-col items-center gap-1 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg transition-all text-[10px]"
                    onClick={() => setShowTheory(!showTheory)}
                >
                    <span className="text-base">🎓</span>
                    <span className="text-white/70">Theory</span>
                </button>
                <button
                    className="flex flex-col items-center gap-1 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg transition-all text-[10px]"
                    onClick={() => setShowMasteryGuide(!showMasteryGuide)}
                >
                    <span className="text-base">🎯</span>
                    <span className="text-white/70">Mastery</span>
                </button>
                <a
                    href="https://www.khanacademy.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg transition-all text-[10px]"
                >
                    <span className="text-base">🔗</span>
                    <span className="text-white/70">Learn</span>
                </a>
            </div>

            {/* Theory Panel */}
            {showTheory && (
                <div className="mt-3 p-3 bg-slate-800/50 border border-white/10 rounded-lg">
                    <div className="text-xs text-amber-400 font-bold mb-2">Understanding Houses</div>
                    <div className="text-[11px] text-white/70 space-y-2">
                        <p>While <strong>SIGNS</strong> show <em>HOW</em> you do things (personality), <strong>HOUSES</strong> show <em>WHERE</em> you do things (life areas).</p>
                        <p><strong>Example:</strong> Sun in Taurus (sign) = HOW you shine (steady, grounded). Sun in 10th House = WHERE you shine (career, public life).</p>
                        <p><strong>Result:</strong> "You shine steadily in your career"</p>
                        <div className="mt-2 pt-2 border-t border-white/10">
                            <div className="text-[10px] text-white/50">
                                <strong>★★★★★</strong> = 5+ planets (Very Strong) |
                                <strong>★★★★☆</strong> = 3-4 (Strong) |
                                <strong>★★★☆☆</strong> = 2 (Moderate) |
                                <strong>★★☆☆☆</strong> = 1 (Weak) |
                                <strong>★☆☆☆☆</strong> = 0 (Empty)
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mastery Guide Panel */}
            {showMasteryGuide && (
                <div className="mt-3 p-3 bg-gradient-to-br from-purple-900/30 to-slate-800/50 border border-purple-500/30 rounded-lg">
                    <div className="text-xs text-purple-400 font-bold mb-2">🎯 Life Domain Mastery Guide</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 bg-slate-800/50 rounded">
                            <div className="text-white/90 font-medium mb-1">📱 Master Languages?</div>
                            <div className="text-white/60">Focus on 3rd House</div>
                            <div className={`text-[9px] ${housePlanetCounts[3].count >= 2 ? 'text-green-400' : 'text-amber-400'}`}>
                                Your strength: {getStarRating(housePlanetCounts[3].count).stars}
                            </div>
                        </div>
                        <div className="p-2 bg-slate-800/50 rounded">
                            <div className="text-white/90 font-medium mb-1">🌍 Philosophical Debate?</div>
                            <div className="text-white/60">Focus on 9th House</div>
                            <div className={`text-[9px] ${housePlanetCounts[9].count >= 2 ? 'text-green-400' : 'text-amber-400'}`}>
                                Your strength: {getStarRating(housePlanetCounts[9].count).stars}
                            </div>
                        </div>
                        <div className="p-2 bg-slate-800/50 rounded">
                            <div className="text-white/90 font-medium mb-1">👔 Career Success?</div>
                            <div className="text-white/60">Focus on 10th House</div>
                            <div className={`text-[9px] ${housePlanetCounts[10].count >= 2 ? 'text-green-400' : 'text-amber-400'}`}>
                                Your strength: {getStarRating(housePlanetCounts[10].count).stars}
                            </div>
                        </div>
                        <div className="p-2 bg-slate-800/50 rounded">
                            <div className="text-white/90 font-medium mb-1">🕉️ Spiritual Depth?</div>
                            <div className="text-white/60">Focus on 12th House</div>
                            <div className={`text-[9px] ${housePlanetCounts[12].count >= 2 ? 'text-green-400' : 'text-amber-400'}`}>
                                Your strength: {getStarRating(housePlanetCounts[12].count).stars}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Elemental Dominance Section Component
function ElementalDominanceSection({ elementBalance, planets, risingSign, partnerElements }) {
    const [showDetails, setShowDetails] = useState(false)
    const [showTheory, setShowTheory] = useState(false)
    const [showMatch, setShowMatch] = useState(false)
    const [showLab, setShowLab] = useState(false) // Physics Lab toggle
    const [expandedElements, setExpandedElements] = useState({})
    const [selectedCuspIndex, setSelectedCuspIndex] = useState(0) // For 6-section Element Match
    const [matchSection, setMatchSection] = useState(1) // Current section (1-6)
    const [showTop10, setShowTop10] = useState(true) // Toggle top 10 vs all 36
    const [showBottom5, setShowBottom5] = useState(false) // Toggle bottom 5 worst matches

    // Physics Lab States
    const [labStation, setLabStation] = useState(1) // Current lab station (1-6)
    const [labNotebook, setLabNotebook] = useState({}) // Track discoveries/answers
    const [labPartnerElements, setLabPartnerElements] = useState({ Fire: 10, Earth: 15, Air: 30, Water: 45 }) // Adjustable partner sliders
    const [labTestedCusps, setLabTestedCusps] = useState([]) // Cusps added to comparison
    const [labSelectedCusp, setLabSelectedCusp] = useState(null) // Currently testing cusp
    const [labTimelineMonth, setLabTimelineMonth] = useState(0) // Timeline slider (0-36)
    const [labScenarioAnswers, setLabScenarioAnswers] = useState({}) // Station 2 scenario answers
    const [labExpandedSynergy, setLabExpandedSynergy] = useState(null) // Station 5 expanded element

    const elements = ['Fire', 'Earth', 'Air', 'Water']
    const total = elementBalance.fire + elementBalance.earth + elementBalance.air + elementBalance.water
    const dominant = elementBalance.dominant

    // Calculate detailed breakdown
    const breakdown = calculateElementBreakdown(planets, risingSign)
    const stelliums = detectStelliums(planets, risingSign)
    const totalChartWeight = Object.values(breakdown).reduce((sum, el) => sum + el.total, 0)

    // Calculate percentages
    const percentages = {
        Fire: total > 0 ? Math.round((elementBalance.fire / total) * 100) : 0,
        Earth: total > 0 ? Math.round((elementBalance.earth / total) * 100) : 0,
        Air: total > 0 ? Math.round((elementBalance.air / total) * 100) : 0,
        Water: total > 0 ? Math.round((elementBalance.water / total) * 100) : 0
    }

    // Determine element status for interpretation
    const getElementStatus = (element, percent) => {
        if (percent >= 40) return 'high'
        if (percent <= 15) return 'low'
        return 'balanced'
    }

    // Toggle individual element breakdown
    const toggleElementBreakdown = (element) => {
        setExpandedElements(prev => ({
            ...prev,
            [element]: !prev[element]
        }))
    }

    // Render tier section (Trinity/Personal/Outer)
    const renderTierSection = (tier, tierName, weightLabel, planets, elementColor) => {
        if (planets.length === 0) {
            return (
                <div className="mb-2">
                    <div className="text-[10px] text-white/50 font-medium mb-1">
                        {tierName} ({weightLabel}):
                    </div>
                    <div className="text-[10px] text-white/30 italic pl-2">
                        No planets in this tier
                    </div>
                </div>
            )
        }

        const subtotal = planets.reduce((sum, p) => sum + p.weight, 0)

        return (
            <div className="mb-2">
                <div className="text-[10px] text-white/60 font-medium mb-1">
                    {tierName} ({weightLabel}):
                </div>
                <div className="space-y-0.5 pl-2 font-mono">
                    {planets.map((planet, idx) => (
                        <div key={idx} className="flex items-center text-[10px]">
                            <span className="w-4 text-center">{planet.symbol}</span>
                            <span className="text-white/70 w-24 truncate">{planet.name} in {planet.sign}</span>
                            <span className="text-white/60 w-12 text-right">{planet.weight.toFixed(1)} pts</span>
                            <span className={`ml-2 ${elementColor}`}>{planet.bar}</span>
                        </div>
                    ))}
                    <div className="flex items-center text-[10px] border-t border-white/10 pt-0.5 mt-1">
                        <span className="w-4"></span>
                        <span className="text-white/50 w-24">Subtotal:</span>
                        <span className="text-white/80 w-12 text-right font-medium">{subtotal.toFixed(1)} pts</span>
                    </div>
                </div>
            </div>
        )
    }

    // Render detailed element breakdown
    const renderElementBreakdown = (element) => {
        const config = elementConfig[element]
        const data = breakdown[element]
        const percent = percentages[element]
        const relevantStellium = stelliums.find(s => s.element === element)
        const insight = generateElementInsight(element, data, totalChartWeight, stelliums)

        const trinitySubtotal = data.trinity.reduce((sum, p) => sum + p.weight, 0)
        const personalSubtotal = data.personal.reduce((sum, p) => sum + p.weight, 0)
        const outerSubtotal = data.outer.reduce((sum, p) => sum + p.weight, 0)

        return (
            <div className={`rounded-lg p-3 border ${config.bgClass} ${config.borderClass} mb-2`}>
                {/* Element Header */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{config.icon}</span>
                    <div className={`text-sm font-bold ${config.textClass}`}>
                        {element}: {percent.toFixed(2)}% ({data.total.toFixed(1)} points)
                    </div>
                </div>

                {/* WHERE YOUR ELEMENT COMES FROM */}
                <div className="text-[11px] text-white/80 font-medium mb-2">
                    WHERE YOUR {element.toUpperCase()} COMES FROM:
                </div>
                <div className="border-t border-white/20 mb-2"></div>

                {/* Trinity Section */}
                {renderTierSection('trinity', 'TRINITY (Heavy Weight)', '3.0×', data.trinity, config.textClass)}

                {/* Personal Section */}
                {renderTierSection('personal', 'PERSONAL PLANETS (Moderate)', '2.0×', data.personal, config.textClass)}

                {/* Outer Section */}
                {renderTierSection('outer', 'OUTER PLANETS (Lesser)', '1.0×', data.outer, config.textClass)}

                {/* Total Line */}
                <div className="border-t border-white/20 my-2"></div>
                <div className="flex items-center text-xs font-medium">
                    <span className="text-white/70">YOUR TOTAL {element.toUpperCase()}:</span>
                    <span className={`ml-auto ${config.textClass}`}>
                        {data.total.toFixed(1)} pts = {percent.toFixed(2)}%
                    </span>
                </div>

                {/* Stellium Alert */}
                {relevantStellium && (
                    <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/40 rounded text-[10px]">
                        <div className="text-yellow-400 font-medium">
                            ⭐ STELLIUM DETECTED: {relevantStellium.count} planets in {relevantStellium.sign}!
                        </div>
                        <div className="text-white/70 mt-0.5">
                            ({relevantStellium.planets.join(', ')} = {relevantStellium.points.toFixed(1)} pts = {((relevantStellium.points / data.total) * 100).toFixed(0)}% of your {element})
                        </div>
                    </div>
                )}

                {/* Insight */}
                {insight && (
                    <div className={`mt-2 p-2 bg-slate-900/50 rounded border-l-2 ${config.borderClass}`}>
                        <div className="text-[10px] text-white/70 leading-relaxed">
                            {insight}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="bg-slate-900/40 rounded-lg p-3 mb-3 border border-slate-700/50">
            <div className="text-xs text-white/60 uppercase tracking-wider mb-3 font-medium">Western Elements Analysis</div>

            {/* Main Element Display - Bigger with Icons */}
            <div className="grid grid-cols-4 gap-2 mb-3">
                {elements.map((element) => {
                    const config = elementConfig[element]
                    const value = elementBalance[element.toLowerCase()]
                    const isDominant = dominant === element
                    const percent = percentages[element]

                    return (
                        <div
                            key={element}
                            className={`text-center p-2 rounded-lg transition-all ${
                                isDominant
                                    ? `${config.bgClass} border ${config.borderClass}`
                                    : 'bg-slate-800/30'
                            }`}
                        >
                            <div className="text-xl mb-1">{config.icon}</div>
                            <div className={`text-sm font-bold ${isDominant ? config.textClass : 'text-white/50'}`}>
                                {element}
                            </div>
                            <div className={`text-lg font-bold ${isDominant ? config.textClass : 'text-white/70'}`}>
                                {value.toFixed(2)}
                            </div>
                            <div className={`text-xs ${isDominant ? config.textClass : 'text-white/40'}`}>
                                {percent}%
                            </div>
                            {/* Visual bar */}
                            <div className="mt-1.5 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${
                                        isDominant ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-slate-500/50'
                                    }`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Interactive 4-Axis Element Radar Chart */}
            {(() => {
                // Prepare radar data - normalized to max value
                const maxPercent = Math.max(...Object.values(percentages))
                const normalizedMax = Math.ceil(maxPercent / 10) * 10 + 10 // Round up to nearest 10 + padding
                const dominantColor = WESTERN_ELEMENT_COLORS[dominant] || '#f59e0b'

                const radarData = elements.map(element => ({
                    element,
                    score: percentages[element],
                    normalizedScore: percentages[element]
                }))

                return (
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🌐</span>
                                <div>
                                    <div className="text-xs text-white/80 font-bold uppercase tracking-wide">Western Elements Map</div>
                                    <div className="text-[9px] text-white/40 italic">HOW you operate • Your Psychological Blueprint</div>
                                </div>
                            </div>
                            <div
                                className="text-[10px] font-bold px-3 py-1 rounded-full border flex items-center gap-1"
                                style={{
                                    color: dominantColor,
                                    backgroundColor: `${dominantColor}20`,
                                    borderColor: `${dominantColor}40`
                                }}
                            >
                                {elementConfig[dominant]?.icon} {dominant} Dominant
                            </div>
                        </div>

                        {/* Nivo Radar Chart - Enlarged to match BaZi */}
                        <div className="h-[380px]">
                            <ResponsiveRadar
                                data={radarData}
                                keys={['score']}
                                indexBy="element"
                                maxValue={normalizedMax}
                                valueFormat={v => `${v.toFixed(0)}%`}
                                margin={{ top: 70, right: 90, bottom: 70, left: 90 }}
                                curve="linearClosed"
                                borderWidth={3}
                                borderColor={dominantColor}
                                gridLevels={5}
                                gridShape="circular"
                                gridLabelOffset={36}
                                layers={[
                                    // Custom outer ring frame layer
                                    ({ centerX, centerY, radiusScale }) => {
                                        const outerRadius = radiusScale(normalizedMax)
                                        return (
                                            <circle
                                                key="outer-ring"
                                                cx={centerX}
                                                cy={centerY}
                                                r={outerRadius}
                                                fill="none"
                                                stroke={dominantColor}
                                                strokeWidth={2.5}
                                                strokeOpacity={0.6}
                                            />
                                        )
                                    },
                                    'grid',
                                    'layers',
                                    'slices',
                                    'dots',
                                    'legends'
                                ]}
                                enableDots={true}
                                dotSize={14}
                                dotColor="#0f172a"
                                dotBorderWidth={3}
                                dotBorderColor={dominantColor}
                                enableDotLabel={true}
                                dotLabel={d => `${d.value.toFixed(0)}%`}
                                dotLabelYOffset={-18}
                                colors={[`${dominantColor}aa`]}
                                fillOpacity={0.4}
                                blendMode="normal"
                                animate={true}
                                motionConfig="gentle"
                                theme={{
                                    background: 'transparent',
                                    textColor: '#ffffff',
                                    fontSize: 12,
                                    axis: {
                                        ticks: {
                                            text: {
                                                fill: '#94a3b8',
                                                fontSize: 11
                                            }
                                        }
                                    },
                                    grid: {
                                        line: {
                                            stroke: `${dominantColor}25`,
                                            strokeWidth: 1.5
                                        }
                                    },
                                    crosshair: {
                                        line: {
                                            stroke: dominantColor,
                                            strokeWidth: 2
                                        }
                                    },
                                    tooltip: {
                                        container: {
                                            background: '#1e293b',
                                            color: '#ffffff',
                                            fontSize: 13,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                            border: `1px solid ${dominantColor}50`,
                                            padding: '12px 16px'
                                        }
                                    }
                                }}
                                gridLabel={({ id, anchor, x, y }) => {
                                    const elColor = WESTERN_ELEMENT_COLORS[id] || '#ffffff'
                                    const elConfig = elementConfig[id]
                                    // Offset labels: Fire/Air right, Water above, Earth below
                                    let offsetX = 0, offsetY = 0
                                    let textAnchor = anchor
                                    if (id === 'Fire') { offsetX = 12; offsetY = -8; textAnchor = 'start' }
                                    else if (id === 'Air') { offsetX = 12; offsetY = 8; textAnchor = 'start' }
                                    else if (id === 'Water') { offsetY = -12; textAnchor = 'middle' }
                                    else if (id === 'Earth') { offsetY = 12; textAnchor = 'middle' }
                                    return (
                                        <g transform={`translate(${x + offsetX}, ${y + offsetY})`}>
                                            <text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    fill: elColor,
                                                    textAnchor: textAnchor,
                                                    dominantBaseline: 'central',
                                                    textShadow: `0 0 10px ${elColor}60`
                                                }}
                                            >
                                                {elConfig?.icon} {id}
                                            </text>
                                        </g>
                                    )
                                }}
                                sliceTooltip={({ index, data: sliceData }) => {
                                    const config = elementConfig[index]
                                    const percent = percentages[index]
                                    const meaning = elementMeanings[index]
                                    return (
                                        <div style={{
                                            padding: '14px 18px',
                                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                            border: `2px solid ${WESTERN_ELEMENT_COLORS[index]}`,
                                            borderRadius: 14,
                                            minWidth: 200,
                                            maxWidth: 280
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                marginBottom: 10
                                            }}>
                                                <span style={{ fontSize: '1.8rem' }}>{config?.icon}</span>
                                                <div>
                                                    <strong style={{
                                                        color: WESTERN_ELEMENT_COLORS[index],
                                                        fontSize: '1.1rem'
                                                    }}>
                                                        {index}
                                                    </strong>
                                                    <div style={{
                                                        fontSize: '1.6rem',
                                                        fontWeight: 700,
                                                        color: '#ffffff'
                                                    }}>
                                                        {percent}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                color: '#94a3b8',
                                                marginBottom: 6,
                                                fontStyle: 'italic'
                                            }}>
                                                {meaning?.keywords}
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#e2e8f0',
                                                lineHeight: 1.5
                                            }}>
                                                {percent >= 35 ? meaning?.highMeaning : percent >= 20 ? meaning?.balanced : meaning?.lowMeaning}
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    </div>
                )
            })()}

            {/* Action Buttons Row */}
            <div className="flex gap-2 mb-2">
                {/* More Info Button */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg text-sm font-medium text-amber-400 hover:border-amber-400/50 hover:from-amber-500/20 hover:to-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <span>{showDetails ? '📖' : '📊'}</span>
                    {showDetails ? 'Hide Details' : 'More Info'}
                </button>

                {/* Theory Button */}
                <button
                    onClick={() => setShowTheory(!showTheory)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-400 hover:border-purple-400/50 hover:from-purple-500/20 hover:to-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <span>{showTheory ? '🔬' : '📐'}</span>
                    {showTheory ? 'Hide Theory' : 'Theory'}
                </button>

                {/* Element Match Button */}
                <button
                    onClick={() => { setShowMatch(!showMatch); if (!showMatch) setShowLab(false); }}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-lg text-sm font-medium text-pink-400 hover:border-pink-400/50 hover:from-pink-500/20 hover:to-rose-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <span>{showMatch ? '💔' : '💕'}</span>
                    {showMatch ? 'Hide Match' : 'Element Match'}
                </button>

                {/* Physics Lab Button */}
                <button
                    onClick={() => { setShowLab(!showLab); if (!showLab) setShowMatch(false); }}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg text-sm font-medium text-emerald-400 hover:border-emerald-400/50 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <span>{showLab ? '🔬' : '🧪'}</span>
                    {showLab ? 'Exit Lab' : 'Physics Lab'}
                </button>
            </div>

            {/* Theory Section */}
            {showTheory && (
                <div className="mb-3 space-y-3 animate-fadeIn">
                    {/* Formula Overview */}
                    <div className="bg-gradient-to-b from-purple-900/30 to-slate-900/40 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">📐</span>
                            <div className="text-sm text-purple-300 font-bold">Western Zodiac Element Formula</div>
                        </div>

                        {/* The Formula */}
                        <div className="bg-slate-900/60 rounded-lg p-3 mb-3 font-mono text-xs">
                            <div className="text-cyan-400 mb-2">Element % = (Σ Planet Weights) / (Total Weight) × 100</div>
                            <div className="text-white/60 space-y-1">
                                <div>Where each planet contributes:</div>
                                <div className="ml-2 text-amber-400">Planet_Contribution = Weight × Sign_Element_Match</div>
                            </div>
                        </div>

                        {/* Weight Tiers */}
                        <div className="text-xs text-white/80 mb-3">
                            <div className="font-bold text-purple-300 mb-2">Planetary Weight Tiers:</div>
                            <div className="grid grid-cols-1 gap-2">
                                {/* Heavy Tier */}
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-amber-400 font-bold">HEAVY (3.0×)</span>
                                        <span className="text-amber-400/60">~40-50% of total</span>
                                    </div>
                                    <div className="flex gap-3 text-white/70">
                                        <span>☉ Sun</span>
                                        <span>☽ Moon</span>
                                        <span>⬆️ Rising</span>
                                    </div>
                                    <div className="text-[10px] text-white/50 mt-1">The Constitutional Trinity - defines core identity</div>
                                </div>

                                {/* Moderate Tier */}
                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-cyan-400 font-bold">MODERATE (2.0×)</span>
                                        <span className="text-cyan-400/60">~25-35% of total</span>
                                    </div>
                                    <div className="flex gap-3 text-white/70">
                                        <span>☿ Mercury</span>
                                        <span>♀ Venus</span>
                                        <span>♂ Mars</span>
                                    </div>
                                    <div className="text-[10px] text-white/50 mt-1">Inner Planets - personal expression & action</div>
                                </div>

                                {/* Lesser Tier */}
                                <div className="bg-slate-500/10 border border-slate-500/30 rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-300 font-bold">LESSER (1.0×)</span>
                                        <span className="text-slate-400/60">~15-25% of total</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-white/60">
                                        <span>♃ Jupiter</span>
                                        <span>♄ Saturn</span>
                                        <span>♅ Uranus</span>
                                        <span>♆ Neptune</span>
                                        <span>♇ Pluto</span>
                                        <span>☊ Nodes</span>
                                    </div>
                                    <div className="text-[10px] text-white/50 mt-1">Outer/Generational Planets - collective trends</div>
                                </div>

                                {/* Minimal Tier */}
                                <div className="bg-slate-600/10 border border-slate-600/30 rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-400 font-bold">MINIMAL (0.5×)</span>
                                        <span className="text-slate-500/60">If included</span>
                                    </div>
                                    <div className="flex gap-3 text-white/50">
                                        <span>⚷ Chiron</span>
                                    </div>
                                    <div className="text-[10px] text-white/40 mt-1">Asteroid - healing themes</div>
                                </div>
                            </div>
                        </div>

                        {/* Sign to Element Mapping */}
                        <div className="text-xs">
                            <div className="font-bold text-purple-300 mb-2">Sign → Element Mapping:</div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-400">🔥 Fire:</span>
                                    <span className="text-white/60">Aries, Leo, Sagittarius</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-400">🌍 Earth:</span>
                                    <span className="text-white/60">Taurus, Virgo, Capricorn</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-cyan-400">💨 Air:</span>
                                    <span className="text-white/60">Gemini, Libra, Aquarius</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400">💧 Water:</span>
                                    <span className="text-white/60">Cancer, Scorpio, Pisces</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Insights */}
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">💡</span>
                            <div className="text-xs text-yellow-400 uppercase tracking-wider font-medium">Key Insights</div>
                        </div>
                        <div className="text-[11px] text-white/70 space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-amber-400">1.</span>
                                <p><strong className="text-amber-300">Trinity Dominates:</strong> Sun/Moon/Rising contribute ~40-50% of total weight. Birth time accuracy is CRITICAL.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-400">2.</span>
                                <p><strong className="text-cyan-300">Stelliums Amplify:</strong> Multiple planets in same element compound the effect. A Taurus stellium → strong Earth.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-400">3.</span>
                                <p><strong className="text-purple-300">Personal &gt; Generational:</strong> Your Mercury matters more than your Neptune (shared by your generation).</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-400">4.</span>
                                <p><strong className="text-green-300">Balance is Rare:</strong> Most charts show clear dominance (40%+) and deficit (&lt;20%). Perfect balance almost never occurs.</p>
                            </div>
                        </div>
                    </div>

                    {/* Western vs BaZi Note */}
                    <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-2 border border-indigo-500/20">
                        <div className="text-[10px] text-white/60 flex items-start gap-2">
                            <span>⚖️</span>
                            <div>
                                <strong className="text-indigo-300">Western vs BaZi:</strong> Western Zodiac measures <em>psychological structure</em> (how you think/feel/behave).
                                BaZi measures <em>energetic constitution</em> (qi flow). Different results = different lenses on the same soul.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Expandable Details Section - Math Teacher Style */}
            {showDetails && (
                <div className="mt-3 space-y-2 animate-fadeIn">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">🧮</span>
                        <div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">
                            Step-by-Step Element Calculations
                        </div>
                    </div>

                    {/* Detailed breakdown for each element */}
                    {elements.map((element) => renderElementBreakdown(element))}

                    {/* Grand Total Summary */}
                    <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 rounded-lg p-3 border border-slate-600/50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">📊</span>
                            <div className="text-xs text-white/80 uppercase tracking-wider font-medium">Grand Total</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            {elements.map((element) => {
                                const config = elementConfig[element]
                                return (
                                    <div key={element} className={`p-2 rounded ${config.bgClass}`}>
                                        <div className="text-lg">{config.icon}</div>
                                        <div className={`text-xs font-bold ${config.textClass}`}>{percentages[element]}%</div>
                                        <div className="text-[10px] text-white/50">{breakdown[element].total.toFixed(1)} pts</div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="text-[10px] text-white/40 text-center mt-2">
                            Total Chart Weight: {totalChartWeight.toFixed(1)} points
                        </div>
                    </div>

                    {/* Stellium Summary (if any) */}
                    {stelliums.length > 0 && (
                        <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-base">⭐</span>
                                <div className="text-xs text-yellow-400 uppercase tracking-wider font-medium">
                                    Stelliums Detected ({stelliums.length})
                                </div>
                            </div>
                            <div className="space-y-1">
                                {stelliums.map((stellium, idx) => (
                                    <div key={idx} className="text-[10px] text-white/70">
                                        • <span className="text-yellow-300">{stellium.count} planets in {stellium.sign}</span>
                                        <span className="text-white/50"> ({stellium.element}) </span>
                                        <span className="text-white/40">→ {stellium.planets.join(', ')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Element Match / Compatibility Section - 6-Section Storytelling Design */}
            {showMatch && (() => {
                // User's elements as percentages
                const userElements = {
                    Fire: percentages.Fire,
                    Earth: percentages.Earth,
                    Air: percentages.Air,
                    Water: percentages.Water
                }

                // Analyze user's constitution
                const userAnalysis = analyzeUserConstitution(userElements)
                const idealPartner = calculateIdealPartner(userAnalysis)

                // Rank all 36 cusps
                const rankedCusps = rankAllCusps(userElements)
                const selectedCusp = rankedCusps[selectedCuspIndex]
                const topMatches = rankedCusps.slice(0, 10)
                const bottomMatches = rankedCusps.slice(-5).reverse()

                // Section navigation
                const sections = [
                    { id: 1, name: 'What I Have', icon: '🌟', color: 'text-amber-400' },
                    { id: 2, name: 'What I Lack', icon: '🎯', color: 'text-red-400' },
                    { id: 3, name: 'What I Need', icon: '💎', color: 'text-emerald-400' },
                    { id: 4, name: 'Who Can Give', icon: '💕', color: 'text-pink-400' },
                    { id: 5, name: 'New Balance', icon: '⚖️', color: 'text-cyan-400' },
                    { id: 6, name: 'Will I Flourish?', icon: '🌱', color: 'text-green-400' }
                ]

                return (
                    <div className="mt-3 space-y-3 animate-fadeIn">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">💕</span>
                            <div className="text-xs text-pink-400 uppercase tracking-wider font-medium">
                                Element Match Discovery
                            </div>
                        </div>

                        {/* Section Navigation */}
                        <div className="flex flex-wrap gap-1 mb-3">
                            {sections.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setMatchSection(s.id)}
                                    className={`px-2 py-1 text-[10px] rounded-lg border transition-all ${
                                        matchSection === s.id
                                            ? `bg-pink-500/20 border-pink-500/50 ${s.color}`
                                            : 'bg-slate-800/50 border-slate-700/50 text-white/50 hover:text-white/80'
                                    }`}
                                >
                                    <span className="mr-1">{s.icon}</span>
                                    {s.name}
                                </button>
                            ))}
                        </div>

                        {/* SECTION 1: WHAT I HAVE */}
                        {matchSection === 1 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-amber-900/30 to-slate-900/40 rounded-lg p-3 border border-amber-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">🌟</span>
                                        <div className="text-sm text-amber-300 font-bold">YOUR ELEMENTAL CONSTITUTION</div>
                                    </div>

                                    {/* Element Bars with Meaning */}
                                    <div className="space-y-3">
                                        {elements.map(el => {
                                            const config = elementConfig[el]
                                            const pct = userElements[el]
                                            const meaning = ELEMENT_MEANINGS[el]
                                            const isStrength = pct >= 30
                                            const isDeficit = pct < 20

                                            return (
                                                <div key={el} className={`rounded-lg p-2 ${isStrength ? config.bgClass : isDeficit ? 'bg-slate-800/30' : 'bg-slate-800/20'}`}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">{meaning.icon}</span>
                                                            <span className={`text-sm font-bold ${config.textClass}`}>{el}: {pct}%</span>
                                                            {isStrength && <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">SUPERPOWER</span>}
                                                            {isDeficit && <span className="text-[9px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">DEFICIT</span>}
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mb-1">
                                                        <div
                                                            className={`h-full rounded-full ${isStrength ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : isDeficit ? 'bg-red-500/50' : 'bg-slate-500'}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-[10px] text-white/60">
                                                        {isStrength ? meaning.superpower : isDeficit ? meaning.deficit : meaning.positive}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Summary */}
                                    <div className="mt-3 p-2 bg-slate-900/50 rounded-lg border-l-2 border-amber-500/50">
                                        <div className="text-[10px] text-white/80">
                                            <strong className="text-amber-300">Summary:</strong> Your {userAnalysis.dominant.element} dominance ({userAnalysis.dominant.value}%) makes you exceptionally {ELEMENT_MEANINGS[userAnalysis.dominant.element]?.positive.split(',')[0]}.
                                            {userAnalysis.deficits.length > 0 && (
                                                <span> But your {userAnalysis.deficits.map(d => d.element).join('+')} deficit{userAnalysis.deficits.length > 1 ? 's' : ''} ({userAnalysis.totalDeficitSeverity.toFixed(0)}% severity) creates blind spots.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setMatchSection(2)} className="w-full py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
                                    Next: What I Lack →
                                </button>
                            </div>
                        )}

                        {/* SECTION 2: WHAT I LACK */}
                        {matchSection === 2 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-red-900/30 to-slate-900/40 rounded-lg p-3 border border-red-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">🎯</span>
                                        <div className="text-sm text-red-300 font-bold">YOUR BLIND SPOTS</div>
                                    </div>

                                    {userAnalysis.deficits.length > 0 ? (
                                        <div className="space-y-3">
                                            {userAnalysis.deficits.map(d => {
                                                const meaning = ELEMENT_MEANINGS[d.element]
                                                const config = elementConfig[d.element]
                                                return (
                                                    <div key={d.element} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-lg">{meaning.icon}</span>
                                                            <span className={`text-sm font-bold ${config.textClass}`}>{d.element} DEFICIT: {d.deficit}%</span>
                                                        </div>
                                                        <div className="text-[10px] text-white/70 mb-2">
                                                            {meaning.deficit}
                                                        </div>
                                                        <div className="text-[10px] text-white/60 mb-2">
                                                            <strong>This shows up as:</strong>
                                                            <ul className="list-disc list-inside mt-1 space-y-0.5">
                                                                {meaning.deficitExamples.map((ex, i) => (
                                                                    <li key={i}>{ex}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20 text-[10px] text-yellow-400/90">
                                                            <strong>⚠️ Relationship Impact:</strong> {meaning.deficitImpact}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                                                <div className="text-sm text-red-400 font-bold mb-1">Total Deficit Severity: {userAnalysis.totalDeficitSeverity.toFixed(0)}%</div>
                                                <div className="text-[10px] text-white/70">
                                                    You need a partner who provides {userAnalysis.deficits.map(d => d.element).join(' AND ')} to feel complete.
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-white/60">
                                            <span className="text-2xl mb-2">✨</span>
                                            <div className="text-sm">You have no significant deficits! Your elements are well-balanced.</div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setMatchSection(1)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        ← Back
                                    </button>
                                    <button onClick={() => setMatchSection(3)} className="flex-1 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
                                        Next: What I Need →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 3: WHAT I NEED */}
                        {matchSection === 3 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-emerald-900/30 to-slate-900/40 rounded-lg p-3 border border-emerald-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">💎</span>
                                        <div className="text-sm text-emerald-300 font-bold">YOUR IDEAL PARTNER ELEMENTS</div>
                                    </div>

                                    <div className="space-y-2">
                                        {Object.entries(idealPartner).sort((a, b) => b[1] - a[1]).map(([el, pct]) => {
                                            const meaning = ELEMENT_MEANINGS[el]
                                            const config = elementConfig[el]
                                            const priority = pct >= 35 ? 'HIGH' : pct >= 20 ? 'MEDIUM' : 'LOW'
                                            const priorityColor = priority === 'HIGH' ? 'text-red-400' : priority === 'MEDIUM' ? 'text-yellow-400' : 'text-slate-400'

                                            return (
                                                <div key={el} className={`rounded-lg p-2 ${config.bgClass} border ${config.borderClass}`}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span>{meaning.icon}</span>
                                                            <span className={`text-sm font-bold ${config.textClass}`}>{el}: {pct}%</span>
                                                        </div>
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${priorityColor} bg-slate-900/50`}>{priority} PRIORITY</span>
                                                    </div>
                                                    <div className="text-[10px] text-white/60">
                                                        {userAnalysis.deficits.find(d => d.element === el)
                                                            ? `To fill your ${el} deficit with ${meaning.positive}`
                                                            : `Enough for common ground without overwhelming`
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-3 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                                        <div className="text-[11px] text-emerald-300 font-bold mb-1">💡 THE PERFECT FORMULA:</div>
                                        <div className="text-[10px] text-white/70">
                                            {Object.entries(idealPartner).sort((a, b) => b[1] - a[1]).map(([el, pct]) => `${el} ${pct}%`).join(' + ')} = YOUR IDEAL
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setMatchSection(2)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        ← Back
                                    </button>
                                    <button onClick={() => setMatchSection(4)} className="flex-1 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
                                        Next: Who Can Give →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 4: WHO CAN GIVE (Ranked 36 Cusps) - Khan Academy Style */}
                        {matchSection === 4 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-pink-900/30 to-slate-900/40 rounded-lg p-3 border border-pink-500/30">
                                    {/* Header with Learning Context */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">📚</span>
                                        <div className="text-sm text-pink-300 font-bold">ELEMENTAL COMPATIBILITY RANKINGS</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-pink-400/50">
                                        <strong className="text-pink-300">💡 Learning Mode:</strong> Scroll through all 36 zodiac positions ranked by elemental compatibility.
                                        Click any match to understand <em>why</em> it scores high or low based on your constitution.
                                    </div>

                                    {/* Grade Scale Reference */}
                                    <div className="flex justify-center gap-2 mb-3 text-[9px]">
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded">A: 90%+ Perfect</span>
                                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">B: 80-89% Strong</span>
                                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">C: 70-79% Good</span>
                                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">D: 60-69%</span>
                                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded">F: &lt;60%</span>
                                    </div>

                                    {/* All 36 Cusps - Scrollable Educational List */}
                                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                                        {rankedCusps.map((cusp) => {
                                            const isSelected = selectedCuspIndex === cusp.rank - 1
                                            const reasons = generateMatchReasons(userElements, cusp, userAnalysis)
                                            const badReasons = generateBadMatchReasons(userElements, cusp, userAnalysis)
                                            const rankBadge = cusp.rank === 1 ? '🥇' : cusp.rank === 2 ? '🥈' : cusp.rank === 3 ? '🥉' : `#${cusp.rank}`

                                            // Generate educational insights
                                            const filledDeficits = cusp.deficitsFilled?.filter(d => d.filled) || []
                                            const unfilledDeficits = cusp.deficitsFilled?.filter(d => !d.filled) || []
                                            const hasGoodCommunication = cusp.partnerAirWater >= 50
                                            const isComplementary = cusp.scores.complement >= 60

                                            return (
                                                <div
                                                    key={cusp.id}
                                                    onClick={() => setSelectedCuspIndex(cusp.rank - 1)}
                                                    className={`rounded-lg p-3 border cursor-pointer transition-all ${
                                                        isSelected
                                                            ? `${cusp.rating.bg} ${cusp.rating.border} ring-2 ring-pink-400/50`
                                                            : cusp.rank <= 3
                                                                ? `${cusp.rating.bg} ${cusp.rating.border} hover:ring-1 hover:ring-white/20`
                                                                : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                                                    }`}
                                                >
                                                    {/* Main Row: Rank, Name, Grade, Score */}
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base font-bold">{rankBadge}</span>
                                                            <div>
                                                                <span className="text-sm font-bold text-white/90">{cusp.name}</span>
                                                                <div className="text-[9px] text-white/40">{cusp.dateRange}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-2xl font-black ${cusp.rating.gradeColor || cusp.rating.color}`}>
                                                                {cusp.rating.gradeLabel || cusp.rating.grade}
                                                            </span>
                                                            <div className="text-right">
                                                                <div className={`text-lg font-bold ${cusp.rating.color}`}>{cusp.scores.total.toFixed(1)}%</div>
                                                                <div className={`text-[9px] ${cusp.rating.color}`}>{cusp.rating.label}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Element Distribution Row */}
                                                    <div className="grid grid-cols-4 gap-1 mb-2 p-2 bg-slate-900/40 rounded">
                                                        {elements.map(el => {
                                                            const pct = cusp.elements[el]
                                                            const userPct = userElements[el]
                                                            const isUserDeficit = userPct < 20
                                                            const fillsDeficit = isUserDeficit && pct > 20
                                                            return (
                                                                <div key={el} className="text-center">
                                                                    <div className="text-[10px] text-white/50">{ELEMENT_MEANINGS[el].icon}</div>
                                                                    <div className={`text-xs font-bold ${fillsDeficit ? 'text-green-400' : 'text-white/70'}`}>
                                                                        {pct}%
                                                                        {fillsDeficit && <span className="text-[8px]"> ✓</span>}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* Quick Score Breakdown */}
                                                    <div className="flex justify-between text-[9px] mb-2 px-1">
                                                        <span className="text-cyan-400">Overlap: {cusp.scores.overlap.toFixed(0)}%</span>
                                                        <span className="text-emerald-400">Complement: {cusp.scores.complement.toFixed(0)}%</span>
                                                        <span className="text-purple-400">Communication: {cusp.scores.communication.toFixed(0)}%</span>
                                                    </div>

                                                    {/* EXPANDED: Educational Explanation (Khan Academy Style) */}
                                                    {isSelected && (
                                                        <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                                                            {/* Why This Score? - Teaching Block */}
                                                            <div className="bg-slate-900/60 rounded-lg p-3">
                                                                <div className="text-[10px] text-amber-400 font-bold mb-2 flex items-center gap-1">
                                                                    <span>🎓</span> WHY THIS SCORE? (Educational Breakdown)
                                                                </div>

                                                                {/* What Works */}
                                                                {(reasons.length > 0 || filledDeficits.length > 0 || hasGoodCommunication) && (
                                                                    <div className="mb-3">
                                                                        <div className="text-[9px] text-green-400 font-medium mb-1">✅ WHAT WORKS:</div>
                                                                        <div className="space-y-1 pl-2">
                                                                            {filledDeficits.map((d, i) => (
                                                                                <div key={i} className="text-[9px] text-white/70">
                                                                                    • {ELEMENT_MEANINGS[d.element].icon} <strong className="text-green-300">Fills your {d.element} deficit</strong>:
                                                                                    Partner has {cusp.elements[d.element]}% (strength), you have {userElements[d.element]}% (deficit).
                                                                                    This brings emotional/intellectual balance.
                                                                                </div>
                                                                            ))}
                                                                            {hasGoodCommunication && (
                                                                                <div className="text-[9px] text-white/70">
                                                                                    • 💬 <strong className="text-green-300">Strong Communication Potential</strong>:
                                                                                    Partner's Air+Water = {cusp.partnerAirWater}% enables articulation AND emotional depth.
                                                                                </div>
                                                                            )}
                                                                            {isComplementary && (
                                                                                <div className="text-[9px] text-white/70">
                                                                                    • 💎 <strong className="text-green-300">High Complementarity ({cusp.scores.complement.toFixed(0)}%)</strong>:
                                                                                    Partner's strengths align with your weaknesses = growth potential.
                                                                                </div>
                                                                            )}
                                                                            {reasons.map((r, i) => (
                                                                                <div key={`r-${i}`} className="text-[9px] text-white/70">
                                                                                    • {r.icon} {r.text}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* What Doesn't Work */}
                                                                {(badReasons.length > 0 || unfilledDeficits.length > 0 || !hasGoodCommunication) && (
                                                                    <div className="mb-2">
                                                                        <div className="text-[9px] text-red-400 font-medium mb-1">⚠️ CHALLENGES:</div>
                                                                        <div className="space-y-1 pl-2">
                                                                            {unfilledDeficits.map((d, i) => (
                                                                                <div key={i} className="text-[9px] text-white/60">
                                                                                    • {ELEMENT_MEANINGS[d.element].icon} <strong className="text-yellow-300">{d.element} deficit unfilled</strong>:
                                                                                    Partner only has {cusp.elements[d.element]}% (not enough to fill your {d.deficit.toFixed(0)}% deficit).
                                                                                </div>
                                                                            ))}
                                                                            {!hasGoodCommunication && (
                                                                                <div className="text-[9px] text-white/60">
                                                                                    • 💬 <strong className="text-yellow-300">Limited Communication Bridge</strong>:
                                                                                    Partner's Air+Water = only {cusp.partnerAirWater}%. May struggle to articulate feelings.
                                                                                </div>
                                                                            )}
                                                                            {badReasons.map((r, i) => (
                                                                                <div key={`b-${i}`} className="text-[9px] text-white/60">
                                                                                    • ❌ {r}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Learning Insight */}
                                                                <div className="mt-2 p-2 bg-amber-500/10 rounded border border-amber-500/20">
                                                                    <div className="text-[9px] text-amber-300">
                                                                        <strong>💡 KEY INSIGHT:</strong>{' '}
                                                                        {cusp.scores.total >= 80
                                                                            ? `This match scores well because partner provides what you lack most. Constitutional completion potential is high.`
                                                                            : cusp.scores.total >= 60
                                                                                ? `Moderate match. Some gaps filled, others remain. Would require conscious effort to bridge differences.`
                                                                                : `Lower compatibility because partner doesn't provide what you need most. Similar weaknesses or overwhelming elements.`
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Score Math Breakdown */}
                                                            <div className="bg-slate-900/40 rounded p-2">
                                                                <div className="text-[9px] text-cyan-400 font-medium mb-1">📊 SCORE MATH:</div>
                                                                <div className="font-mono text-[9px] text-white/60 space-y-0.5">
                                                                    <div>Overlap {cusp.scores.overlap.toFixed(1)}% × 0.20 = <span className="text-cyan-400">{(cusp.scores.overlap * 0.20).toFixed(1)}</span></div>
                                                                    <div>Complement {cusp.scores.complement.toFixed(1)}% × 0.60 = <span className="text-emerald-400">{(cusp.scores.complement * 0.60).toFixed(1)}</span></div>
                                                                    <div>Communication {cusp.scores.communication.toFixed(1)}% × 0.20 = <span className="text-purple-400">{(cusp.scores.communication * 0.20).toFixed(1)}</span></div>
                                                                    <div className="border-t border-white/10 pt-1 mt-1">
                                                                        Raw: {cusp.scores.rawTotal?.toFixed(1) || '?'}% → Normalized: <span className={`font-bold ${cusp.rating.color}`}>{cusp.scores.total.toFixed(1)}%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Collapsed hint */}
                                                    {!isSelected && (
                                                        <div className="text-[8px] text-white/30 text-center mt-1">
                                                            Click to see educational breakdown →
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Scroll indicator */}
                                    <div className="text-[9px] text-white/40 text-center mt-2">
                                        ↕ Scroll to explore all 36 zodiac positions
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setMatchSection(3)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        ← Back
                                    </button>
                                    <button onClick={() => setMatchSection(5)} className="flex-1 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
                                        Next: New Balance →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 5: WHAT WOULD BE THE NEW BALANCE (Venn Diagram) */}
                        {matchSection === 5 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-cyan-900/30 to-slate-900/40 rounded-lg p-3 border border-cyan-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">💫</span>
                                        <div className="text-sm text-cyan-300 font-bold">YOUR SYNERGY: You + {selectedCusp.name}</div>
                                    </div>

                                    {/* Visual Venn Concept */}
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {/* YOU */}
                                        <div className="bg-cyan-500/10 rounded-lg p-2 border border-cyan-500/20">
                                            <div className="text-[10px] text-cyan-400 font-bold mb-1 text-center">YOU</div>
                                            {elements.map(el => (
                                                <div key={el} className="text-[9px] text-white/60">
                                                    {ELEMENT_MEANINGS[el].icon} {userElements[el]}%
                                                </div>
                                            ))}
                                        </div>

                                        {/* OVERLAP */}
                                        <div className="bg-purple-500/10 rounded-lg p-2 border border-purple-500/20">
                                            <div className="text-[10px] text-purple-400 font-bold mb-1 text-center">SHARED</div>
                                            {elements.map(el => (
                                                <div key={el} className="text-[9px] text-white/60">
                                                    {ELEMENT_MEANINGS[el].icon} {Math.min(userElements[el], selectedCusp.elements[el])}%
                                                </div>
                                            ))}
                                            <div className="text-[9px] text-purple-400 mt-1 text-center font-bold">
                                                {selectedCusp.scores.overlap.toFixed(0)}% overlap
                                            </div>
                                        </div>

                                        {/* PARTNER */}
                                        <div className="bg-pink-500/10 rounded-lg p-2 border border-pink-500/20">
                                            <div className="text-[10px] text-pink-400 font-bold mb-1 text-center">PARTNER</div>
                                            {elements.map(el => (
                                                <div key={el} className="text-[9px] text-white/60">
                                                    {ELEMENT_MEANINGS[el].icon} {selectedCusp.elements[el]}%
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Combined New Balance */}
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                        <div className="text-[10px] text-white/80 font-bold mb-2">🎯 YOUR COMBINED NEW BALANCE:</div>
                                        <div className="space-y-1">
                                            {elements.map(el => {
                                                const combined = userElements[el] + selectedCusp.elements[el]
                                                const wasDeficit = userElements[el] < 20
                                                const isFilled = wasDeficit && selectedCusp.elements[el] > 20
                                                const config = elementConfig[el]

                                                return (
                                                    <div key={el} className="flex items-center justify-between">
                                                        <span className="text-[10px] text-white/70">
                                                            {ELEMENT_MEANINGS[el].icon} {el}: {userElements[el]}% + {selectedCusp.elements[el]}% = {combined}%
                                                        </span>
                                                        {isFilled && <span className="text-[9px] text-green-400">✓ FILLED!</span>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="mt-3 p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                        <div className="text-[10px] text-white/80">
                                            <strong className="text-cyan-300">💡 RESULT:</strong> Together you form a more complete elemental system.
                                            {userAnalysis.deficits.length > 0 && ` Your ${userAnalysis.deficits.map(d => d.element).join('+')} deficits are ${selectedCusp.deficitsFilled.filter(d => d.filled).length > 0 ? 'FILLED' : 'partially addressed'} by partner's strengths.`}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setMatchSection(4)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        ← Back
                                    </button>
                                    <button onClick={() => setMatchSection(6)} className="flex-1 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
                                        Next: Will I Flourish? →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 6: WILL I FLOURISH? */}
                        {matchSection === 6 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-green-900/30 to-slate-900/40 rounded-lg p-3 border border-green-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">🌱</span>
                                        <div className="text-sm text-green-300 font-bold">WILL YOU FLOURISH TOGETHER?</div>
                                    </div>

                                    {/* Overall Verdict with Letter Grade */}
                                    <div className={`rounded-lg p-4 text-center ${selectedCusp.rating.bg} border ${selectedCusp.rating.border} mb-3`}>
                                        <div className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Compatibility Grade</div>
                                        {/* Giant Letter Grade */}
                                        <div className="flex items-center justify-center gap-3 mb-2">
                                            <div className={`text-5xl font-black ${selectedCusp.rating.gradeColor || selectedCusp.rating.color}`}>
                                                {selectedCusp.rating.gradeLabel || selectedCusp.rating.grade || '?'}
                                            </div>
                                            <div className="text-left">
                                                <div className={`text-2xl font-bold ${selectedCusp.rating.color}`}>{selectedCusp.scores.total.toFixed(1)}%</div>
                                                <div className={`text-xs font-medium ${selectedCusp.rating.color}`}>{selectedCusp.rating.label}</div>
                                            </div>
                                        </div>
                                        {/* Verdict message based on grade */}
                                        <div className="mt-2 text-[11px] text-white/80 font-medium">
                                            {selectedCusp.scores.total >= 90
                                                ? '💚 YES! Constitutional perfection - you complete each other!'
                                                : selectedCusp.scores.total >= 80
                                                    ? '💚 YES - Excellent foundation with strong growth potential!'
                                                    : selectedCusp.scores.total >= 70
                                                        ? '💛 Good match - Solid foundation with room to grow.'
                                                        : selectedCusp.scores.total >= 60
                                                            ? '💛 MAYBE - Moderate compatibility, requires conscious effort.'
                                                            : '❌ CHALLENGING - Significant differences to navigate.'
                                            }
                                        </div>
                                        {/* Grading scale reference */}
                                        <div className="mt-3 pt-2 border-t border-white/10">
                                            <div className="text-[9px] text-white/50 flex justify-center gap-3">
                                                <span className="text-green-400">A: 90%+</span>
                                                <span className="text-emerald-400">B: 80-89%</span>
                                                <span className="text-cyan-400">C: 70-79%</span>
                                                <span className="text-yellow-400">D: 60-69%</span>
                                                <span className="text-red-400">F: &lt;60%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Growth Areas */}
                                    <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50 mb-2">
                                        <div className="text-[10px] text-emerald-400 font-bold mb-2">💫 HOW YOU'LL GROW TOGETHER:</div>
                                        <div className="space-y-2">
                                            {userAnalysis.deficits.slice(0, 2).map(d => (
                                                <div key={d.element} className="text-[9px] text-white/70">
                                                    <span className="text-emerald-400">{ELEMENT_MEANINGS[d.element].icon} {d.element} Development:</span>
                                                    <div className="ml-4 text-white/60">
                                                        Partner's {d.element} ({selectedCusp.elements[d.element]}%) can teach you {ELEMENT_MEANINGS[d.element].positive.split(',')[0]} through their modeling.
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Challenges */}
                                    <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50 mb-2">
                                        <div className="text-[10px] text-yellow-400 font-bold mb-2">⚠️ CHALLENGES TO NAVIGATE:</div>
                                        <div className="space-y-1 text-[9px] text-white/70">
                                            {userAnalysis.communicationCapacity < 20 && (
                                                <div className="flex items-start gap-1">
                                                    <span>💬</span>
                                                    <span>Communication Mismatch: Your Air+Water capacity ({(userAnalysis.communicationCapacity * 2).toFixed(0)}%) is lower than partner's ({selectedCusp.partnerAirWater}%). Patience needed.</span>
                                                </div>
                                            )}
                                            {userAnalysis.dominant.value > 40 && (
                                                <div className="flex items-start gap-1">
                                                    <span>🐌</span>
                                                    <span>Pace Difference: Your {userAnalysis.dominant.element} dominance means you process differently. Establish timing agreements.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                                        <div className="text-[10px] text-cyan-400 font-bold mb-2">🌟 RELATIONSHIP TIMELINE:</div>
                                        <div className="space-y-1 text-[9px]">
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-white/50">0-6 months:</span>
                                                <span className="text-white/70">Honeymoon + initial friction surfaces</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-white/50">6-12 months:</span>
                                                <span className="text-white/70">Learning + adjustment phase</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-white/50">12-24 months:</span>
                                                <span className="text-white/70">Synergy + flow emerges</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-white/50">24+ months:</span>
                                                <span className="text-white/70">Mastery + deep partnership</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Message */}
                                    <div className="mt-3 p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                                        <div className="text-[11px] text-white/80">
                                            <strong className="text-pink-300">💙 FINAL MESSAGE:</strong> This match offers you the gift of becoming MORE than you are alone.
                                            {userAnalysis.deficits.length > 0 && ` Your ${userAnalysis.deficits.map(d => d.element).join('+')} deficits aren't flaws - they're invitations for growth.`}
                                            {' '}Partner's strengths can fill your gaps IF you embrace the learning. This is constitutional completion.
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setMatchSection(1)} className="w-full py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                    ← Start Over (Section 1)
                                </button>
                            </div>
                        )}
                    </div>
                )
            })()}

            {/* ==================== PHYSICS LAB SECTION ==================== */}
            {showLab && (() => {
                // User's elements as percentages
                const userElements = {
                    Fire: percentages.Fire,
                    Earth: percentages.Earth,
                    Air: percentages.Air,
                    Water: percentages.Water
                }

                // Analyze user's constitution
                const userAnalysis = analyzeUserConstitution(userElements)
                const idealPartner = calculateIdealPartner(userAnalysis)

                // Rank all 36 cusps for lab experiments
                const rankedCusps = rankAllCusps(userElements)

                // Calculate compatibility from lab sliders
                const calculateLabCompatibility = () => {
                    const partner = labPartnerElements
                    const overlap = calculateOverlapScore(userElements, partner)
                    const complement = calculateComplementScore(userElements, partner)
                    const comm = calculateCommunicationScore(userElements, partner)
                    const rawTotal = calculateTotalCompatibility(overlap.score, complement.average, comm.score)
                    return { overlap: overlap.score, complement: complement.average, communication: comm.score, total: rawTotal }
                }
                const labScores = calculateLabCompatibility()

                // Lab station definitions
                const labStations = [
                    { id: 1, name: 'Measure Baseline', icon: '🌡️', color: 'text-amber-400' },
                    { id: 2, name: 'Identify Deficits', icon: '🔍', color: 'text-red-400' },
                    { id: 3, name: 'Experiment Balance', icon: '⚗️', color: 'text-emerald-400' },
                    { id: 4, name: 'Test Cusps', icon: '🧲', color: 'text-pink-400' },
                    { id: 5, name: 'Synergy Patterns', icon: '🌀', color: 'text-cyan-400' },
                    { id: 6, name: 'Predict Outcomes', icon: '📈', color: 'text-purple-400' }
                ]

                // Helper: Adjust partner element (keeps total = 100)
                const adjustPartnerElement = (element, newValue) => {
                    const clampedValue = Math.max(0, Math.min(100, newValue))
                    const current = { ...labPartnerElements }
                    const oldValue = current[element]
                    const diff = clampedValue - oldValue

                    // Distribute the difference across other elements proportionally
                    const otherElements = elements.filter(e => e !== element)
                    const otherTotal = otherElements.reduce((sum, e) => sum + current[e], 0)

                    if (otherTotal > 0) {
                        otherElements.forEach(e => {
                            const proportion = current[e] / otherTotal
                            current[e] = Math.max(0, Math.round(current[e] - diff * proportion))
                        })
                    }

                    current[element] = clampedValue

                    // Normalize to exactly 100
                    const total = Object.values(current).reduce((a, b) => a + b, 0)
                    if (total !== 100) {
                        const adjustment = 100 - total
                        const maxElement = otherElements.reduce((a, b) => current[a] > current[b] ? a : b)
                        current[maxElement] = Math.max(0, current[maxElement] + adjustment)
                    }

                    setLabPartnerElements(current)
                }

                // Helper: Add cusp to comparison
                const addCuspToComparison = (cusp) => {
                    if (labTestedCusps.length < 5 && !labTestedCusps.find(c => c.id === cusp.id)) {
                        setLabTestedCusps([...labTestedCusps, cusp])
                    }
                }

                return (
                    <div className="mt-3 space-y-3 animate-fadeIn">
                        {/* Lab Header */}
                        <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/30 rounded-lg p-3 border border-emerald-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">🔬</span>
                                <div>
                                    <div className="text-sm text-emerald-300 font-bold">ELEMENT PHYSICS LAB</div>
                                    <div className="text-[10px] text-white/50">Discover Your Constitution Through Experiment</div>
                                </div>
                            </div>
                            <div className="text-[10px] text-white/60 italic bg-slate-900/40 rounded p-2 border-l-2 border-emerald-400/50">
                                💡 <strong>Philosophy:</strong> Don't just read answers - DISCOVER through hands-on experimentation with sliders, scenarios, and predictions!
                            </div>
                        </div>

                        {/* Station Navigation */}
                        <div className="flex flex-wrap gap-1 mb-2">
                            {labStations.map((s, i) => (
                                <button
                                    key={s.id}
                                    onClick={() => setLabStation(s.id)}
                                    className={`px-2 py-1 text-[9px] rounded-lg border transition-all ${
                                        labStation === s.id
                                            ? `bg-emerald-500/20 border-emerald-500/50 ${s.color}`
                                            : labStation > s.id
                                                ? 'bg-green-500/10 border-green-500/30 text-green-400/70'
                                                : 'bg-slate-800/50 border-slate-700/50 text-white/40 hover:text-white/60'
                                    }`}
                                >
                                    <span className="mr-1">{labStation > s.id ? '✓' : s.icon}</span>
                                    {s.name}
                                </button>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                                    style={{ width: `${(labStation / 6) * 100}%` }}
                                />
                            </div>
                            <span className="text-[9px] text-emerald-400">{labStation}/6</span>
                        </div>

                        {/* ========== STATION 1: MEASURE YOUR BASELINE ========== */}
                        {labStation === 1 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-amber-900/30 to-slate-900/40 rounded-lg p-3 border border-amber-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🌡️</span>
                                        <div className="text-sm text-amber-300 font-bold">STATION 1: Measure Your Baseline</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-amber-400/50">
                                        <strong className="text-amber-300">🔬 EXPERIMENT 1.1:</strong> Observe your natural element distribution. Your task: Identify patterns without judgment.
                                    </div>

                                    {/* Element Display (Read-Only) */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 mb-3">
                                        <div className="text-[10px] text-white/50 mb-2 uppercase tracking-wider">Your Constitutional Elements:</div>
                                        {elements.map(el => {
                                            const pct = userElements[el]
                                            const config = elementConfig[el]
                                            const isHigh = pct >= 30
                                            const isLow = pct < 20
                                            return (
                                                <div key={el} className="mb-2">
                                                    <div className="flex items-center justify-between text-[11px] mb-1">
                                                        <span className={config.textClass}>{config.icon} {el}</span>
                                                        <span className={`font-bold ${isHigh ? 'text-green-400' : isLow ? 'text-red-400' : 'text-white/70'}`}>
                                                            {pct.toFixed(0)}%
                                                            {isHigh && <span className="ml-1 text-[9px]">↑ HIGH</span>}
                                                            {isLow && <span className="ml-1 text-[9px]">↓ LOW</span>}
                                                        </span>
                                                    </div>
                                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${config.bgClass.replace('/20', '/60')} transition-all`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Observation Questions */}
                                    <div className="space-y-3">
                                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                            <div className="text-[10px] text-cyan-400 font-medium mb-2">📝 OBSERVATION QUESTION 1:</div>
                                            <div className="text-[11px] text-white/80 mb-2">Which element is your HIGHEST?</div>
                                            <div className="flex flex-wrap gap-2">
                                                {elements.map(el => {
                                                    const isCorrect = userElements[el] === Math.max(...Object.values(userElements))
                                                    const isSelected = labNotebook.q1 === el
                                                    return (
                                                        <button
                                                            key={el}
                                                            onClick={() => setLabNotebook({ ...labNotebook, q1: el })}
                                                            className={`px-3 py-1 text-[10px] rounded border transition-all ${
                                                                isSelected
                                                                    ? isCorrect
                                                                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                                                        : 'bg-red-500/20 border-red-500/50 text-red-400'
                                                                    : 'bg-slate-700/50 border-slate-600/50 text-white/60 hover:text-white/80'
                                                            }`}
                                                        >
                                                            {elementConfig[el].icon} {el}
                                                            {isSelected && isCorrect && ' ✓'}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                            {labNotebook.q1 && (
                                                <div className={`mt-2 text-[10px] p-2 rounded ${
                                                    userElements[labNotebook.q1] === Math.max(...Object.values(userElements))
                                                        ? 'bg-green-500/10 text-green-400'
                                                        : 'bg-red-500/10 text-red-400'
                                                }`}>
                                                    {userElements[labNotebook.q1] === Math.max(...Object.values(userElements))
                                                        ? `✓ Correct! ${labNotebook.q1} is your dominant element at ${userElements[labNotebook.q1].toFixed(0)}%`
                                                        : `✗ Not quite. Your highest is ${elements.find(e => userElements[e] === Math.max(...Object.values(userElements)))}`
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                            <div className="text-[10px] text-cyan-400 font-medium mb-2">📝 OBSERVATION QUESTION 2:</div>
                                            <div className="text-[11px] text-white/80 mb-2">Which elements are in DEFICIT (below 20%)?</div>
                                            <div className="flex flex-wrap gap-2">
                                                {elements.map(el => {
                                                    const isDeficit = userElements[el] < 20
                                                    const isSelected = labNotebook.q2?.includes(el)
                                                    return (
                                                        <button
                                                            key={el}
                                                            onClick={() => {
                                                                const current = labNotebook.q2 || []
                                                                if (current.includes(el)) {
                                                                    setLabNotebook({ ...labNotebook, q2: current.filter(e => e !== el) })
                                                                } else {
                                                                    setLabNotebook({ ...labNotebook, q2: [...current, el] })
                                                                }
                                                            }}
                                                            className={`px-3 py-1 text-[10px] rounded border transition-all ${
                                                                isSelected
                                                                    ? isDeficit
                                                                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                                                        : 'bg-red-500/20 border-red-500/50 text-red-400'
                                                                    : 'bg-slate-700/50 border-slate-600/50 text-white/60 hover:text-white/80'
                                                            }`}
                                                        >
                                                            {elementConfig[el].icon} {el} ({userElements[el].toFixed(0)}%)
                                                            {isSelected && isDeficit && ' ✓'}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                            {labNotebook.q2?.length > 0 && (
                                                <div className="mt-2 text-[10px] p-2 rounded bg-amber-500/10 text-amber-300">
                                                    💡 Deficits are elements below 20%. You identified: {labNotebook.q2.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Experiment Result */}
                                    <div className="mt-3 p-3 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 rounded-lg border border-amber-500/20">
                                        <div className="text-[10px] text-amber-300 font-bold mb-2">🎯 EXPERIMENT 1 RESULT:</div>
                                        <div className="text-[10px] text-white/70 space-y-1">
                                            <div>• <strong className="text-white/90">Dominant:</strong> {elements.find(e => userElements[e] === Math.max(...Object.values(userElements)))} ({Math.max(...Object.values(userElements)).toFixed(0)}%)</div>
                                            <div>• <strong className="text-white/90">Deficits:</strong> {userAnalysis.deficits.map(d => `${d.element} (${userElements[d.element].toFixed(0)}%)`).join(', ') || 'None detected'}</div>
                                            <div className="mt-2 pt-2 border-t border-white/10">
                                                <strong className="text-emerald-400">Hypothesis:</strong> You might need a partner with HIGH {userAnalysis.deficits.map(d => d.element).join('+')} to balance your constitution.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setLabStation(2)}
                                    className="w-full py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all"
                                >
                                    Continue to Station 2: Identify Deficits →
                                </button>
                            </div>
                        )}

                        {/* ========== STATION 2: IDENTIFY YOUR DEFICITS ========== */}
                        {labStation === 2 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-red-900/30 to-slate-900/40 rounded-lg p-3 border border-red-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🔍</span>
                                        <div className="text-sm text-red-300 font-bold">STATION 2: Identify Your Deficits</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-red-400/50">
                                        <strong className="text-red-300">🔬 EXPERIMENT 2.1:</strong> See how your deficits manifest in real scenarios. Your task: Test how you naturally respond.
                                    </div>

                                    {/* Scenario 1: Communication (Air) */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 mb-3 border border-slate-700/50">
                                        <div className="text-[10px] text-cyan-400 font-medium mb-2">💬 SCENARIO 1: Communication Challenge</div>
                                        <div className="text-[11px] text-white/80 mb-3 p-2 bg-slate-800/60 rounded italic">
                                            "A colleague asks: 'How did you know that solution would work?'"
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { id: 'avoid', text: '"Just trust me, it works"', airLevel: 'low' },
                                                { id: 'demo', text: '"I can show you..." (demonstrates)', airLevel: 'low' },
                                                { id: 'explain', text: '"Well, the underlying principle is..."', airLevel: 'high' }
                                            ].map(option => {
                                                const isSelected = labScenarioAnswers.comm === option.id
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => setLabScenarioAnswers({ ...labScenarioAnswers, comm: option.id })}
                                                        className={`w-full text-left px-3 py-2 text-[10px] rounded border transition-all ${
                                                            isSelected
                                                                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                                                                : 'bg-slate-800/50 border-slate-700/50 text-white/60 hover:text-white/80'
                                                        }`}
                                                    >
                                                        ○ {option.text}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        {labScenarioAnswers.comm && (
                                            <div className={`mt-2 p-2 rounded text-[10px] ${
                                                labScenarioAnswers.comm !== 'explain'
                                                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                                                    : 'bg-green-500/10 border border-green-500/20 text-green-300'
                                            }`}>
                                                {labScenarioAnswers.comm !== 'explain' ? (
                                                    <>
                                                        <strong>💡 DISCOVERY:</strong> You naturally avoid verbal explanation!
                                                        {userElements.Air < 20 && (
                                                            <> This is your <strong>AIR DEFICIT ({userElements.Air.toFixed(0)}%)</strong> manifesting.
                                                            With higher Air (30%+), you'd comfortably articulate reasoning.</>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>✓ Interesting!</strong> You chose verbal explanation.
                                                        {userElements.Air >= 20
                                                            ? ' This aligns with your adequate Air element.'
                                                            : ' Despite low Air, you intellectually know this is ideal - but does it feel natural?'
                                                        }
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Scenario 2: Emotional Processing (Water) */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 mb-3 border border-slate-700/50">
                                        <div className="text-[10px] text-blue-400 font-medium mb-2">💧 SCENARIO 2: Emotional Processing</div>
                                        <div className="text-[11px] text-white/80 mb-3 p-2 bg-slate-800/60 rounded italic">
                                            "You're feeling overwhelmed. What's your instinct?"
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                { id: 'fix', text: '"What can I DO to fix this?"', waterLevel: 'low' },
                                                { id: 'distract', text: '"Let me work on something else"', waterLevel: 'low' },
                                                { id: 'feel', text: '"Let me sit with this feeling"', waterLevel: 'high' }
                                            ].map(option => {
                                                const isSelected = labScenarioAnswers.emotion === option.id
                                                return (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => setLabScenarioAnswers({ ...labScenarioAnswers, emotion: option.id })}
                                                        className={`w-full text-left px-3 py-2 text-[10px] rounded border transition-all ${
                                                            isSelected
                                                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                                                                : 'bg-slate-800/50 border-slate-700/50 text-white/60 hover:text-white/80'
                                                        }`}
                                                    >
                                                        ○ {option.text}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        {labScenarioAnswers.emotion && (
                                            <div className={`mt-2 p-2 rounded text-[10px] ${
                                                labScenarioAnswers.emotion !== 'feel'
                                                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                                                    : 'bg-green-500/10 border border-green-500/20 text-green-300'
                                            }`}>
                                                {labScenarioAnswers.emotion !== 'feel' ? (
                                                    <>
                                                        <strong>💡 DISCOVERY:</strong> You jump to ACTION instead of FEELING!
                                                        {userElements.Water < 20 && (
                                                            <> This is your <strong>WATER DEFICIT ({userElements.Water.toFixed(0)}%)</strong> manifesting.
                                                            Emotions feel "impractical" so you solve or avoid.</>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>✓ Good awareness!</strong> You chose to feel first.
                                                        {userElements.Water >= 20
                                                            ? ' This aligns with your adequate Water element.'
                                                            : ' Despite low Water, you recognize the value of emotional processing.'
                                                        }
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Deficit Summary */}
                                    <div className="mt-3 p-3 bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-lg border border-red-500/20">
                                        <div className="text-[10px] text-red-300 font-bold mb-2">🔬 EXPERIMENT 2 SUMMARY:</div>
                                        <div className="text-[10px] text-white/70 space-y-2">
                                            {userAnalysis.deficits.map(d => (
                                                <div key={d.element} className="p-2 bg-slate-800/50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <span className={elementConfig[d.element].textClass}>{elementConfig[d.element].icon}</span>
                                                        <strong className="text-white/90">{d.element} DEFICIT ({userElements[d.element].toFixed(0)}%)</strong>
                                                    </div>
                                                    <div className="text-[9px] text-white/50 mt-1">
                                                        {d.element === 'Air' && '• Struggle with verbal articulation, prefer demonstrating over explaining'}
                                                        {d.element === 'Water' && '• Process emotions through action, feelings seem impractical'}
                                                        {d.element === 'Fire' && '• Hesitant to take risks, prefer stability over spontaneity'}
                                                        {d.element === 'Earth' && '• Struggle with practical details, prefer ideas over execution'}
                                                    </div>
                                                </div>
                                            ))}
                                            {userAnalysis.deficits.length === 0 && (
                                                <div className="text-green-400">✓ No significant deficits detected! Your elements are well-balanced.</div>
                                            )}
                                            <div className="mt-2 pt-2 border-t border-white/10">
                                                <strong className="text-emerald-400">Hypothesis Confirmed:</strong> A partner with HIGH {userAnalysis.deficits.map(d => d.element).join(' + ') || 'balanced elements'} would provide what you lack.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setLabStation(1)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        ← Back
                                    </button>
                                    <button onClick={() => setLabStation(3)} className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all">
                                        Continue to Station 3 →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========== STATION 3: EXPERIMENT WITH BALANCE ========== */}
                        {labStation === 3 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-emerald-900/30 to-slate-900/40 rounded-lg p-3 border border-emerald-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">⚗️</span>
                                        <div className="text-sm text-emerald-300 font-bold">STATION 3: Experiment with Balance</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-emerald-400/50">
                                        <strong className="text-emerald-300">🔬 EXPERIMENT 3.1:</strong> Adjust partner element sliders and watch compatibility change in real-time!
                                    </div>

                                    {/* Your Constitution (Fixed) */}
                                    <div className="bg-slate-900/60 rounded-lg p-2 mb-3">
                                        <div className="text-[9px] text-white/50 mb-1">YOUR CONSTITUTION (Fixed):</div>
                                        <div className="flex gap-2 text-[10px]">
                                            {elements.map(el => (
                                                <span key={el} className={elementConfig[el].textClass}>
                                                    {elementConfig[el].icon} {userElements[el].toFixed(0)}%
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Partner Element Sliders */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 mb-3 border border-emerald-500/20">
                                        <div className="text-[10px] text-emerald-400 font-medium mb-2">🎚️ PARTNER ELEMENTS (Adjustable):</div>
                                        {elements.map(el => {
                                            const value = labPartnerElements[el]
                                            const config = elementConfig[el]
                                            return (
                                                <div key={el} className="mb-3">
                                                    <div className="flex items-center justify-between text-[10px] mb-1">
                                                        <span className={config.textClass}>{config.icon} {el}</span>
                                                        <span className="text-white/70 font-mono">{value}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="70"
                                                        value={value}
                                                        onChange={(e) => adjustPartnerElement(el, parseInt(e.target.value))}
                                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                                    />
                                                </div>
                                            )
                                        })}
                                        <div className="flex justify-between text-[9px] text-white/50 mt-2 pt-2 border-t border-white/10">
                                            <span>Total: {Object.values(labPartnerElements).reduce((a, b) => a + b, 0)}%</span>
                                            <button
                                                onClick={() => setLabPartnerElements({ Fire: 10, Earth: 15, Air: 30, Water: 45 })}
                                                className="text-emerald-400 hover:text-emerald-300"
                                            >
                                                Reset to Optimal
                                            </button>
                                        </div>
                                    </div>

                                    {/* Live Compatibility Score */}
                                    <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-3 border border-pink-500/20">
                                        <div className="text-[10px] text-pink-400 font-medium mb-2">📊 LIVE COMPATIBILITY:</div>
                                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                                            <div className="p-2 bg-slate-800/50 rounded">
                                                <div className="text-white/50">Overlap</div>
                                                <div className="text-cyan-400 font-bold text-lg">{labScores.overlap.toFixed(0)}%</div>
                                            </div>
                                            <div className="p-2 bg-slate-800/50 rounded">
                                                <div className="text-white/50">Complement</div>
                                                <div className="text-emerald-400 font-bold text-lg">{labScores.complement.toFixed(0)}%</div>
                                            </div>
                                            <div className="p-2 bg-slate-800/50 rounded">
                                                <div className="text-white/50">Communication</div>
                                                <div className="text-purple-400 font-bold text-lg">{labScores.communication.toFixed(0)}%</div>
                                            </div>
                                            <div className="p-2 bg-pink-500/20 rounded border border-pink-500/30">
                                                <div className="text-pink-300">TOTAL</div>
                                                <div className="text-pink-400 font-bold text-lg">{labScores.total.toFixed(1)}%</div>
                                            </div>
                                        </div>
                                        {labScores.complement >= 70 && (
                                            <div className="mt-2 text-[9px] text-green-400 bg-green-500/10 p-1 rounded">
                                                💎 High complementarity! This configuration fills your gaps well.
                                            </div>
                                        )}
                                    </div>

                                    {/* Experiment Challenges */}
                                    <div className="mt-3 space-y-2">
                                        <div className="text-[10px] text-amber-400 font-medium">🎯 EXPERIMENT CHALLENGES:</div>
                                        <div className="text-[9px] text-white/60 space-y-1 p-2 bg-slate-800/50 rounded">
                                            <div>• Try setting partner Water to 50%+ → Watch complement rise</div>
                                            <div>• Try setting partner Fire to 60%+ → Watch score drop</div>
                                            <div>• Find the configuration that gives you the highest score!</div>
                                        </div>
                                    </div>

                                    {/* Discovery Recording */}
                                    <div className="mt-3 p-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg border border-emerald-500/20">
                                        <div className="text-[10px] text-emerald-300 font-bold mb-2">🔬 DISCOVERY RECORDED:</div>
                                        <div className="text-[10px] text-white/70">
                                            Current optimal config: Water {labPartnerElements.Water}% + Air {labPartnerElements.Air}% + Earth {labPartnerElements.Earth}% + Fire {labPartnerElements.Fire}%
                                            {labScores.total >= 55 && <span className="text-green-400 ml-1">✓ Good match!</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setLabStation(2)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        ← Back
                                    </button>
                                    <button onClick={() => setLabStation(4)} className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all">
                                        Continue to Station 4 →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========== STATION 4: TEST PARTNER COMBINATIONS ========== */}
                        {labStation === 4 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-pink-900/30 to-slate-900/40 rounded-lg p-3 border border-pink-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🧲</span>
                                        <div className="text-sm text-pink-300 font-bold">STATION 4: Test Partner Combinations</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-pink-400/50">
                                        <strong className="text-pink-300">🔬 EXPERIMENT 4.1:</strong> Test actual zodiac cusps to find best matches. Select cusps and compare results!
                                    </div>

                                    {/* Cusp Selector */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 mb-3">
                                        <div className="text-[10px] text-pink-400 font-medium mb-2">🎯 SELECT A CUSP TO TEST:</div>
                                        <select
                                            value={labSelectedCusp?.id || ''}
                                            onChange={(e) => {
                                                const cusp = rankedCusps.find(c => c.id === e.target.value)
                                                setLabSelectedCusp(cusp)
                                            }}
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white/80 text-sm"
                                        >
                                            <option value="">-- Select a Cusp --</option>
                                            {rankedCusps.map(cusp => (
                                                <option key={cusp.id} value={cusp.id}>
                                                    #{cusp.rank}: {cusp.name} ({cusp.dateRange}) - {cusp.scores.total.toFixed(1)}%
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => setLabSelectedCusp(rankedCusps[Math.floor(Math.random() * rankedCusps.length)])}
                                                className="flex-1 py-1 text-[10px] bg-purple-500/20 border border-purple-500/30 rounded text-purple-400 hover:bg-purple-500/30"
                                            >
                                                🎲 Random Cusp
                                            </button>
                                            <button
                                                onClick={() => setLabSelectedCusp(rankedCusps[0])}
                                                className="flex-1 py-1 text-[10px] bg-green-500/20 border border-green-500/30 rounded text-green-400 hover:bg-green-500/30"
                                            >
                                                🥇 Show Best Match
                                            </button>
                                        </div>
                                    </div>

                                    {/* Selected Cusp Details */}
                                    {labSelectedCusp && (
                                        <div className="bg-slate-900/60 rounded-lg p-3 mb-3 border border-pink-500/20">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="text-sm font-bold text-white/90">{labSelectedCusp.name}</div>
                                                    <div className="text-[9px] text-white/50">{labSelectedCusp.dateRange}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-2xl font-black ${labSelectedCusp.rating.gradeColor || labSelectedCusp.rating.color}`}>
                                                        {labSelectedCusp.rating.gradeLabel}
                                                    </div>
                                                    <div className={`text-lg font-bold ${labSelectedCusp.rating.color}`}>
                                                        {labSelectedCusp.scores.total.toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Element Bars */}
                                            <div className="grid grid-cols-4 gap-1 mb-3 p-2 bg-slate-800/50 rounded">
                                                {elements.map(el => (
                                                    <div key={el} className="text-center">
                                                        <div className="text-[10px] text-white/50">{elementConfig[el].icon}</div>
                                                        <div className={`text-xs font-bold ${
                                                            userElements[el] < 20 && labSelectedCusp.elements[el] > 20
                                                                ? 'text-green-400'
                                                                : 'text-white/70'
                                                        }`}>
                                                            {labSelectedCusp.elements[el]}%
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Score Breakdown */}
                                            <div className="flex justify-between text-[9px] mb-2">
                                                <span className="text-cyan-400">Overlap: {labSelectedCusp.scores.overlap.toFixed(0)}%</span>
                                                <span className="text-emerald-400">Complement: {labSelectedCusp.scores.complement.toFixed(0)}%</span>
                                                <span className="text-purple-400">Comm: {labSelectedCusp.scores.communication.toFixed(0)}%</span>
                                            </div>

                                            <button
                                                onClick={() => addCuspToComparison(labSelectedCusp)}
                                                disabled={labTestedCusps.length >= 5 || labTestedCusps.find(c => c.id === labSelectedCusp.id)}
                                                className="w-full py-1 text-[10px] bg-pink-500/20 border border-pink-500/30 rounded text-pink-400 hover:bg-pink-500/30 disabled:opacity-50"
                                            >
                                                + Add to Comparison ({labTestedCusps.length}/5)
                                            </button>
                                        </div>
                                    )}

                                    {/* Comparison Table */}
                                    {labTestedCusps.length > 0 && (
                                        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="text-[10px] text-cyan-400 font-medium">📊 YOUR TESTED CUSPS:</div>
                                                <button
                                                    onClick={() => setLabTestedCusps([])}
                                                    className="text-[9px] text-red-400 hover:text-red-300"
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-[9px]">
                                                    <thead>
                                                        <tr className="text-white/50 border-b border-white/10">
                                                            <th className="text-left p-1">Cusp</th>
                                                            <th className="text-right p-1">Total</th>
                                                            <th className="text-right p-1">Over</th>
                                                            <th className="text-right p-1">Comp</th>
                                                            <th className="text-right p-1">Comm</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {labTestedCusps.sort((a, b) => b.scores.total - a.scores.total).map((cusp, i) => (
                                                            <tr key={cusp.id} className={i === 0 ? 'text-green-400' : 'text-white/70'}>
                                                                <td className="p-1">{cusp.name}</td>
                                                                <td className="p-1 text-right font-bold">{cusp.scores.total.toFixed(1)}%</td>
                                                                <td className="p-1 text-right">{cusp.scores.overlap.toFixed(0)}%</td>
                                                                <td className="p-1 text-right">{cusp.scores.complement.toFixed(0)}%</td>
                                                                <td className="p-1 text-right">{cusp.scores.communication.toFixed(0)}%</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-2 p-2 bg-amber-500/10 rounded text-[9px] text-amber-300">
                                                💡 <strong>Notice a pattern?</strong> Top scorers typically have high Water + Air!
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick View: All 36 Ranked */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50 max-h-[200px] overflow-y-auto">
                                        <div className="text-[10px] text-amber-400 font-medium mb-2">🏆 ALL 36 CUSPS RANKED:</div>
                                        {rankedCusps.slice(0, 10).map(cusp => (
                                            <div
                                                key={cusp.id}
                                                onClick={() => setLabSelectedCusp(cusp)}
                                                className="flex justify-between items-center py-1 px-2 hover:bg-slate-800/50 rounded cursor-pointer"
                                            >
                                                <span className="text-[9px] text-white/70">
                                                    {cusp.rank <= 3 ? ['🥇', '🥈', '🥉'][cusp.rank - 1] : `#${cusp.rank}`} {cusp.name}
                                                </span>
                                                <span className={`text-[9px] font-bold ${cusp.rating.color}`}>{cusp.scores.total.toFixed(1)}%</span>
                                            </div>
                                        ))}
                                        <div className="text-[9px] text-white/40 text-center mt-2">...and 26 more</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setLabStation(3)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        ← Back
                                    </button>
                                    <button onClick={() => setLabStation(5)} className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all">
                                        Continue to Station 5 →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========== STATION 5: OBSERVE SYNERGY PATTERNS ========== */}
                        {labStation === 5 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-cyan-900/30 to-slate-900/40 rounded-lg p-3 border border-cyan-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🌀</span>
                                        <div className="text-sm text-cyan-300 font-bold">STATION 5: Observe Synergy Patterns</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-cyan-400/50">
                                        <strong className="text-cyan-300">🔬 EXPERIMENT 5.1:</strong> Visualize what happens when your elements combine with a partner. Click elements to see synergy effects!
                                    </div>

                                    {/* Partner Selector for Synergy */}
                                    <div className="mb-3">
                                        <select
                                            value={labSelectedCusp?.id || rankedCusps[0]?.id}
                                            onChange={(e) => setLabSelectedCusp(rankedCusps.find(c => c.id === e.target.value))}
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white/80 text-sm"
                                        >
                                            {rankedCusps.slice(0, 10).map(cusp => (
                                                <option key={cusp.id} value={cusp.id}>
                                                    #{cusp.rank}: {cusp.name} - {cusp.scores.total.toFixed(1)}%
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Visual Venn Diagram */}
                                    {(() => {
                                        const partner = labSelectedCusp || rankedCusps[0]
                                        if (!partner) return null

                                        return (
                                            <div className="bg-slate-900/60 rounded-lg p-3 mb-3">
                                                <div className="grid grid-cols-3 gap-2 mb-3">
                                                    {/* YOU */}
                                                    <div
                                                        className={`bg-cyan-500/10 rounded-lg p-2 border cursor-pointer transition-all ${
                                                            labExpandedSynergy === 'you' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-cyan-500/20'
                                                        }`}
                                                        onClick={() => setLabExpandedSynergy(labExpandedSynergy === 'you' ? null : 'you')}
                                                    >
                                                        <div className="text-[10px] text-cyan-400 font-bold mb-1 text-center">YOU</div>
                                                        {elements.map(el => {
                                                            const unique = Math.max(0, userElements[el] - Math.min(userElements[el], partner.elements[el]))
                                                            return (
                                                                <div key={el} className="text-[9px] text-white/60 flex justify-between">
                                                                    <span>{elementConfig[el].icon}</span>
                                                                    <span>{unique.toFixed(0)}% unique</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* SHARED */}
                                                    <div
                                                        className={`bg-purple-500/10 rounded-lg p-2 border cursor-pointer transition-all ${
                                                            labExpandedSynergy === 'shared' ? 'border-purple-400 ring-2 ring-purple-400/30' : 'border-purple-500/20'
                                                        }`}
                                                        onClick={() => setLabExpandedSynergy(labExpandedSynergy === 'shared' ? null : 'shared')}
                                                    >
                                                        <div className="text-[10px] text-purple-400 font-bold mb-1 text-center">SHARED</div>
                                                        {elements.map(el => {
                                                            const shared = Math.min(userElements[el], partner.elements[el])
                                                            return (
                                                                <div key={el} className="text-[9px] text-white/60 flex justify-between">
                                                                    <span>{elementConfig[el].icon}</span>
                                                                    <span>{shared.toFixed(0)}%</span>
                                                                </div>
                                                            )
                                                        })}
                                                        <div className="text-[9px] text-purple-400 mt-1 text-center font-bold">
                                                            {partner.scores.overlap.toFixed(0)}% overlap
                                                        </div>
                                                    </div>

                                                    {/* PARTNER */}
                                                    <div
                                                        className={`bg-pink-500/10 rounded-lg p-2 border cursor-pointer transition-all ${
                                                            labExpandedSynergy === 'partner' ? 'border-pink-400 ring-2 ring-pink-400/30' : 'border-pink-500/20'
                                                        }`}
                                                        onClick={() => setLabExpandedSynergy(labExpandedSynergy === 'partner' ? null : 'partner')}
                                                    >
                                                        <div className="text-[10px] text-pink-400 font-bold mb-1 text-center">PARTNER</div>
                                                        {elements.map(el => {
                                                            const unique = Math.max(0, partner.elements[el] - Math.min(userElements[el], partner.elements[el]))
                                                            const fillsGap = userElements[el] < 20 && partner.elements[el] > 20
                                                            return (
                                                                <div key={el} className={`text-[9px] flex justify-between ${fillsGap ? 'text-green-400' : 'text-white/60'}`}>
                                                                    <span>{elementConfig[el].icon}</span>
                                                                    <span>{unique.toFixed(0)}% {fillsGap && '←'}</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Synergy Explanation Panel */}
                                                {labExpandedSynergy && (
                                                    <div className="bg-slate-800/60 rounded-lg p-3 border border-white/10 animate-fadeIn">
                                                        {labExpandedSynergy === 'you' && (
                                                            <div>
                                                                <div className="text-[10px] text-cyan-400 font-bold mb-2">🌟 YOUR UNIQUE CONTRIBUTION:</div>
                                                                <div className="text-[9px] text-white/70 space-y-2">
                                                                    {elements.filter(el => userElements[el] > partner.elements[el]).map(el => (
                                                                        <div key={el} className="p-2 bg-cyan-500/10 rounded">
                                                                            <strong className={elementConfig[el].textClass}>{elementConfig[el].icon} {el} ({userElements[el].toFixed(0)}%):</strong>
                                                                            <div className="text-[9px] mt-1">
                                                                                {el === 'Earth' && 'You ground the partnership with stability and practical wisdom.'}
                                                                                {el === 'Fire' && 'You bring passion, initiative, and motivating energy.'}
                                                                                {el === 'Air' && 'You contribute intellectual clarity and communication skills.'}
                                                                                {el === 'Water' && 'You provide emotional depth and intuitive understanding.'}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {labExpandedSynergy === 'partner' && (
                                                            <div>
                                                                <div className="text-[10px] text-pink-400 font-bold mb-2">💝 WHAT PARTNER BRINGS:</div>
                                                                <div className="text-[9px] text-white/70 space-y-2">
                                                                    {elements.filter(el => partner.elements[el] > userElements[el]).map(el => {
                                                                        const fillsGap = userElements[el] < 20 && partner.elements[el] > 20
                                                                        return (
                                                                            <div key={el} className={`p-2 rounded ${fillsGap ? 'bg-green-500/10 border border-green-500/20' : 'bg-pink-500/10'}`}>
                                                                                <strong className={fillsGap ? 'text-green-400' : elementConfig[el].textClass}>
                                                                                    {elementConfig[el].icon} {el} ({partner.elements[el]}%)
                                                                                    {fillsGap && ' ← FILLS YOUR GAP!'}
                                                                                </strong>
                                                                                <div className="text-[9px] mt-1">
                                                                                    {el === 'Water' && fillsGap && 'Partner models emotional depth. You learn to feel before fixing.'}
                                                                                    {el === 'Air' && fillsGap && 'Partner helps articulate your embodied wisdom into words.'}
                                                                                    {el === 'Fire' && fillsGap && 'Partner ignites your passion and courage to take risks.'}
                                                                                    {el === 'Earth' && fillsGap && 'Partner provides grounding stability you may lack.'}
                                                                                    {!fillsGap && 'Adds complementary energy to the relationship dynamic.'}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {labExpandedSynergy === 'shared' && (
                                                            <div>
                                                                <div className="text-[10px] text-purple-400 font-bold mb-2">🤝 YOUR COMMON GROUND:</div>
                                                                <div className="text-[9px] text-white/70">
                                                                    <p className="mb-2">You share <strong>{partner.scores.overlap.toFixed(0)}%</strong> elemental overlap. This provides:</p>
                                                                    <ul className="space-y-1 pl-2">
                                                                        <li>• Immediate rapport and understanding</li>
                                                                        <li>• Shared values and approaches</li>
                                                                        <li>• Foundation for communication</li>
                                                                    </ul>
                                                                    <p className="mt-2 text-amber-300">
                                                                        💡 Ideal overlap: 40-60%. Too little = hard to connect. Too much = no growth.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Combined Balance */}
                                                <div className="mt-3 p-2 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded border border-white/10">
                                                    <div className="text-[10px] text-white/80 font-medium mb-2">🎯 COMBINED NEW BALANCE:</div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {elements.map(el => {
                                                            const combined = (userElements[el] + partner.elements[el]) / 2
                                                            const improved = userElements[el] < 20 && combined >= 20
                                                            return (
                                                                <div key={el} className="text-center">
                                                                    <div className="text-[10px]">{elementConfig[el].icon}</div>
                                                                    <div className={`text-xs font-bold ${improved ? 'text-green-400' : 'text-white/70'}`}>
                                                                        {combined.toFixed(0)}%
                                                                        {improved && <span className="text-[8px]">✓</span>}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })()}

                                    {/* Synergy Insight */}
                                    <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-lg border border-cyan-500/20">
                                        <div className="text-[10px] text-cyan-300 font-bold mb-2">🌀 SYNERGY INSIGHT:</div>
                                        <div className="text-[10px] text-white/70">
                                            <strong className="text-emerald-400">Complementarity &gt; Similarity!</strong>
                                            <p className="mt-1">
                                                The best matches aren't those who are exactly like you - they're those who provide what you lack while you provide what they lack. This creates a complete system greater than either individual.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setLabStation(4)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        ← Back
                                    </button>
                                    <button onClick={() => setLabStation(6)} className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all">
                                        Continue to Station 6 →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========== STATION 6: PREDICT LONG-TERM OUTCOMES ========== */}
                        {labStation === 6 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-purple-900/30 to-slate-900/40 rounded-lg p-3 border border-purple-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">📈</span>
                                        <div className="text-sm text-purple-300 font-bold">STATION 6: Predict Long-Term Outcomes</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-purple-400/50">
                                        <strong className="text-purple-300">🔬 EXPERIMENT 6.1:</strong> Drag the timeline slider to see how your relationship evolves over time!
                                    </div>

                                    {/* Partner Selector */}
                                    <div className="mb-3">
                                        <select
                                            value={labSelectedCusp?.id || rankedCusps[0]?.id}
                                            onChange={(e) => setLabSelectedCusp(rankedCusps.find(c => c.id === e.target.value))}
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white/80 text-sm"
                                        >
                                            {rankedCusps.slice(0, 10).map(cusp => (
                                                <option key={cusp.id} value={cusp.id}>
                                                    #{cusp.rank}: {cusp.name} - {cusp.scores.total.toFixed(1)}%
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Timeline Slider */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 mb-3">
                                        <div className="text-[10px] text-purple-400 font-medium mb-2">⏰ RELATIONSHIP TIMELINE:</div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="36"
                                            step="6"
                                            value={labTimelineMonth}
                                            onChange={(e) => setLabTimelineMonth(parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                        />
                                        <div className="flex justify-between text-[9px] text-white/50 mt-1">
                                            <span>0mo</span>
                                            <span>6mo</span>
                                            <span>12mo</span>
                                            <span>18mo</span>
                                            <span>24mo</span>
                                            <span>36mo</span>
                                        </div>
                                        <div className="text-center text-sm text-purple-400 font-bold mt-2">
                                            📅 Month {labTimelineMonth}
                                        </div>
                                    </div>

                                    {/* Timeline Prediction Display */}
                                    {(() => {
                                        const partner = labSelectedCusp || rankedCusps[0]
                                        if (!partner) return null

                                        const baseCompatibility = partner.scores.total
                                        const growthRate = baseCompatibility >= 60 ? 0.3 : baseCompatibility >= 40 ? 0.1 : -0.2

                                        // Calculate growth based on timeline
                                        const airGrowth = userElements.Air < 20 ? Math.min(15, labTimelineMonth * 0.4) : 0
                                        const waterGrowth = userElements.Water < 20 ? Math.min(12, labTimelineMonth * 0.3) : 0
                                        const compatibilityGrowth = labTimelineMonth * growthRate
                                        const newCompatibility = Math.min(95, baseCompatibility + compatibilityGrowth)

                                        const phases = {
                                            0: { name: 'BEGINNING', color: 'text-cyan-400', desc: 'Initial attraction based on common ground. Honeymoon phase begins.' },
                                            6: { name: 'LEARNING', color: 'text-amber-400', desc: 'Learning each other\'s patterns. First challenges surface.' },
                                            12: { name: 'ADJUSTMENT', color: 'text-orange-400', desc: 'Adjusting to differences. Communication improving.' },
                                            18: { name: 'DEEPENING', color: 'text-pink-400', desc: 'Deeper understanding emerges. Trust solidifying.' },
                                            24: { name: 'SYNERGY', color: 'text-emerald-400', desc: 'Operating as complementary system. Flow state.' },
                                            36: { name: 'MASTERY', color: 'text-purple-400', desc: 'Constitutional completion. Mastery achieved.' }
                                        }

                                        const currentPhase = phases[labTimelineMonth] || phases[0]

                                        return (
                                            <div className="bg-slate-900/60 rounded-lg p-3 border border-purple-500/20 space-y-3">
                                                {/* Phase Header */}
                                                <div className="text-center">
                                                    <div className={`text-lg font-bold ${currentPhase.color}`}>{currentPhase.name} PHASE</div>
                                                    <div className="text-[10px] text-white/60">{currentPhase.desc}</div>
                                                </div>

                                                {/* Your Development */}
                                                <div className="bg-slate-800/50 rounded p-2">
                                                    <div className="text-[10px] text-cyan-400 font-medium mb-2">📈 YOUR DEVELOPMENT:</div>
                                                    <div className="space-y-1 text-[9px]">
                                                        {userElements.Air < 20 && (
                                                            <div className="flex justify-between">
                                                                <span className="text-white/60">Air:</span>
                                                                <span className="text-green-400">{userElements.Air.toFixed(0)}% → {(userElements.Air + airGrowth).toFixed(0)}% (+{airGrowth.toFixed(0)}%)</span>
                                                            </div>
                                                        )}
                                                        {userElements.Water < 20 && (
                                                            <div className="flex justify-between">
                                                                <span className="text-white/60">Water:</span>
                                                                <span className="text-green-400">{userElements.Water.toFixed(0)}% → {(userElements.Water + waterGrowth).toFixed(0)}% (+{waterGrowth.toFixed(0)}%)</span>
                                                            </div>
                                                        )}
                                                        {userElements.Air >= 20 && userElements.Water >= 20 && (
                                                            <div className="text-white/50">No major deficits to fill - focus on deepening connection</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Relationship Status */}
                                                <div className="bg-slate-800/50 rounded p-2">
                                                    <div className="text-[10px] text-pink-400 font-medium mb-2">💕 RELATIONSHIP STATUS:</div>
                                                    <div className="flex justify-between items-center text-[9px]">
                                                        <span className="text-white/60">Compatibility:</span>
                                                        <span className="text-pink-400 font-bold">
                                                            {baseCompatibility.toFixed(0)}% → {newCompatibility.toFixed(0)}%
                                                            {growthRate > 0 && <span className="text-green-400"> (+{compatibilityGrowth.toFixed(0)}%)</span>}
                                                            {growthRate < 0 && <span className="text-red-400"> ({compatibilityGrowth.toFixed(0)}%)</span>}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Phase-specific insights */}
                                                <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                                                    <div className="text-[9px] text-purple-300">
                                                        {labTimelineMonth === 0 && '🌟 At month 0, attraction is strong but untested. Communication gaps will soon surface for growth.'}
                                                        {labTimelineMonth === 6 && '📚 At month 6, you\'re in the learning phase. Partner is modeling new emotional/communication patterns.'}
                                                        {labTimelineMonth === 12 && '⚡ At month 12, significant adjustment has occurred. You\'re starting to internalize partner\'s strengths.'}
                                                        {labTimelineMonth === 18 && '🌊 At month 18, deeper emotional intimacy emerges. Your deficits are noticeably filling.'}
                                                        {labTimelineMonth === 24 && '🌀 At month 24, SYNERGY achieved! You operate as one complementary system. Flow state.'}
                                                        {labTimelineMonth === 36 && '🏆 At month 36, CONSTITUTIONAL COMPLETION! You\'ve become more than you were alone.'}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })()}

                                    {/* Lab Report Summary */}
                                    <div className="mt-3 p-3 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-lg border border-emerald-500/20">
                                        <div className="text-[10px] text-emerald-300 font-bold mb-2">📋 YOUR LAB REPORT SUMMARY:</div>
                                        <div className="text-[9px] text-white/70 space-y-1">
                                            <div>• <strong>Experiments Conducted:</strong> 6 stations</div>
                                            <div>• <strong>Your Constitution:</strong> {elements.find(e => userElements[e] === Math.max(...Object.values(userElements)))}-dominant ({Math.max(...Object.values(userElements)).toFixed(0)}%)</div>
                                            <div>• <strong>Deficits Identified:</strong> {userAnalysis.deficits.map(d => d.element).join(', ') || 'None'}</div>
                                            <div>• <strong>Best Match:</strong> {rankedCusps[0]?.name} ({rankedCusps[0]?.scores.total.toFixed(1)}%)</div>
                                            <div>• <strong>Growth Potential:</strong> Constitutional completion through complementarity</div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-white/10 text-center">
                                            <div className="text-[10px] text-purple-400">🏆 CONGRATULATIONS!</div>
                                            <div className="text-[9px] text-white/50">You've completed the Element Physics Lab</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setLabStation(5)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        ← Back
                                    </button>
                                    <button onClick={() => setLabStation(1)} className="flex-1 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm hover:bg-purple-500/30 transition-all">
                                        ↻ Start Over
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })()}
        </div>
    )
}

export default function WesternAstrologyPanel({ westZodiac, profileId, onRecalculate }) {
    const navigate = useNavigate()
    const western = westZodiac || {}
    const [secretsUnlocked, setSecretsUnlocked] = useState(false)
    const [isRecalculating, setIsRecalculating] = useState(false)
    const [showSoulFamily, setShowSoulFamily] = useState(false)
    const [showHouseMap, setShowHouseMap] = useState(false)
    const { recalculateSovereignData } = useProfiles()

    // Sovereign astronomical data (real Sun/Moon/Rising)
    const sovereign = western.sovereignCalculation || null
    const hasSovereignData = sovereign?.sun && sovereign?.moon && sovereign?.rising

    // Debug: Log what data we receive
    console.log('🔮 [WesternAstrologyPanel] Data received:', {
        sign: western.sign,
        hasSovereignCalculation: !!western.sovereignCalculation,
        sovereignSun: sovereign?.sun?.sign,
        sovereignMoon: sovereign?.moon?.sign,
        sovereignRising: sovereign?.rising?.sign,
        hasSovereignData
    })

    // Get the deep soul content for this sign
    const secrets = getZodiacSecrets(western.sign)

    const toggleSecrets = () => {
        setSecretsUnlocked(!secretsUnlocked)
    }

    const handleRecalculate = async () => {
        if (!profileId || isRecalculating) return
        setIsRecalculating(true)
        try {
            await recalculateSovereignData(profileId)
            console.log('✅ Chart recalculated successfully!')
            // Trigger parent refresh to reload profile data
            if (onRecalculate) {
                await onRecalculate()
            }
        } catch (error) {
            console.error('❌ Recalculation failed:', error)
        } finally {
            setIsRecalculating(false)
        }
    }

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                <span className="text-xl">{zodiacEmojis[western.sign]}</span>
                <h2 className="text-sm font-bold text-amber-400">WESTERN ZODIAC</h2>
                {hasSovereignData && (
                    <button
                        onClick={() => setShowHouseMap(true)}
                        className="text-[9px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                        title="How houses work from your Rising sign"
                    >
                        House Map
                    </button>
                )}
                {hasSovereignData && (
                    <button
                        onClick={() => navigate('/natal-wheel')}
                        className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                        title="Full natal chart wheel with Placidus houses"
                    >
                        Natal Wheel
                    </button>
                )}
                <div className="ml-auto flex items-center gap-2">
                    {hasSovereignData && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                            Sovereign
                        </span>
                    )}
                    {profileId && (
                        <button
                            onClick={handleRecalculate}
                            disabled={isRecalculating}
                            className={`text-[9px] px-2 py-0.5 rounded-full border transition-all ${
                                isRecalculating
                                    ? 'bg-slate-500/20 text-slate-400 border-slate-500/30 cursor-wait'
                                    : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30 hover:border-cyan-400/50'
                            }`}
                            title="Refresh chart with latest astronomical calculations"
                        >
                            {isRecalculating ? 'Calculating...' : 'Recalculate'}
                        </button>
                    )}
                </div>
            </div>

            {/* Constitutional Trinity - Sun/Moon/Rising (when sovereign data available) */}
            {hasSovereignData ? (
                <div className="mb-4">
                    <div className="text-center mb-3">
                        <div className="text-[10px] text-white/50 uppercase tracking-wider mb-2">Constitutional Trinity</div>
                        <div className="grid grid-cols-3 gap-2">
                            {/* Sun Sign */}
                            <div className="bg-gradient-to-b from-amber-500/20 to-amber-500/5 rounded-lg p-2 border border-amber-500/30">
                                <div className="text-2xl mb-0.5">{sovereign.sun?.symbol || zodiacEmojis[sovereign.sun?.sign]}</div>
                                <div className="text-[9px] text-amber-400 font-bold uppercase">Sun</div>
                                <div className="text-xs text-white/90 font-medium">{sovereign.sun?.sign}</div>
                                <div className="text-[9px] text-white/50">{formatDegree(sovereign.sun)}</div>
                            </div>
                            {/* Moon Sign */}
                            <div className="bg-gradient-to-b from-blue-500/20 to-blue-500/5 rounded-lg p-2 border border-blue-500/30">
                                <div className="text-2xl mb-0.5">{sovereign.moon?.symbol || zodiacEmojis[sovereign.moon?.sign]}</div>
                                <div className="text-[9px] text-blue-400 font-bold uppercase">Moon</div>
                                <div className="text-xs text-white/90 font-medium">{sovereign.moon?.sign}</div>
                                <div className="text-[9px] text-white/50">{formatDegree(sovereign.moon)}</div>
                            </div>
                            {/* Rising Sign */}
                            <div className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 rounded-lg p-2 border border-purple-500/30">
                                <div className="text-2xl mb-0.5">{sovereign.rising?.symbol || zodiacEmojis[sovereign.rising?.sign]}</div>
                                <div className="text-[9px] text-purple-400 font-bold uppercase">Rising</div>
                                <div className="text-xs text-white/90 font-medium">{sovereign.rising?.sign}</div>
                                <div className="text-[9px] text-white/50">{formatDegree(sovereign.rising)}</div>
                                {!sovereign.rising?.isAccurate && (
                                    <div className="text-[8px] text-yellow-400/70 mt-0.5">~approx</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Western Houses - Life Domain Strengths (NEW) */}
                    {/* Only show if we have actual house cusp data (not just wrapper) */}
                    {sovereign.houses && sovereign.planets && (
                        sovereign.houses.houses || sovereign.houses.cusps || Array.isArray(sovereign.houses) || sovereign.houses['1']
                    ) && (
                        <WesternHousesSection
                            houses={sovereign.houses}
                            planets={sovereign.planets}
                        />
                    )}

                    {/* Element Balance */}
                    {sovereign.elementBalance && (
                        <ElementalDominanceSection
                            elementBalance={sovereign.elementBalance}
                            planets={sovereign.planets}
                            risingSign={sovereign.rising?.sign}
                        />
                    )}

                    {/* Planetary Positions */}
                    {sovereign.planets && Object.keys(sovereign.planets).length > 0 && (
                        <div className="bg-slate-900/40 rounded-lg p-3 mb-3">
                            <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Planetary Positions</div>
                            <div className="grid grid-cols-5 gap-1.5">
                                {Object.entries(sovereign.planets).map(([key, planet]) => {
                                    // Support both isRetrograde (recalculated) and retrograde (Python canonical)
                                    const isRetro = planet.isRetrograde || planet.retrograde
                                    return (
                                        <div key={key} className={`text-center p-1.5 rounded ${isRetro ? 'bg-red-900/30 border border-red-500/30' : 'bg-slate-800/50'}`}>
                                            <div className="text-xl text-amber-300">{planet.symbol || zodiacEmojis[planet.sign]}</div>
                                            <div className={`text-[10px] uppercase font-medium ${isRetro ? 'text-red-400' : 'text-amber-400/80'}`}>
                                                {planet.name || key.charAt(0).toUpperCase() + key.slice(1)}{isRetro && ' ℞'}
                                            </div>
                                            <div className="text-xs text-white/90">{planet.sign}</div>
                                            <div className="text-[10px] text-white/50">{formatDegree(planet)}</div>
                                            {isRetro && (
                                                <div className="text-[8px] text-red-400 mt-0.5">Retrograde</div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Retrograde Interpretations */}
                    {sovereign.planets && Object.entries(sovereign.planets).some(([_, p]) => p.isRetrograde || p.retrograde) && (
                        <div className="bg-gradient-to-b from-red-900/20 to-slate-900/40 rounded-lg p-3 mb-3 border border-red-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-red-400">℞</span>
                                <div className="text-xs text-red-400 uppercase tracking-wider font-medium">Natal Retrograde Insights</div>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(sovereign.planets)
                                    .filter(([_, planet]) => planet.isRetrograde || planet.retrograde)
                                    .map(([key, planet]) => {
                                        const interp = retrogradeInterpretations[key]
                                        if (!interp) return null
                                        return (
                                            <div key={key} className="bg-slate-800/50 rounded-lg p-2.5">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">{planet.symbol || zodiacEmojis[planet.sign]}</span>
                                                    <span className="text-sm text-red-300 font-medium">{interp.title}</span>
                                                </div>
                                                <div className="text-[10px] text-amber-400/80 mb-1">{interp.brief}</div>
                                                <p className="text-[11px] text-white/70 leading-relaxed">{interp.full}</p>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Moon Phase at Birth */}
                    {/* Supports both v2.0 format (phase, illumination 0-1) and legacy format (phaseName, illumination %) */}
                    {sovereign.moonPhase && (
                        <div className="bg-gradient-to-b from-indigo-900/30 to-slate-900/40 rounded-lg p-3 mb-3 border border-indigo-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl">{sovereign.moonPhase.emoji}</span>
                                <div>
                                    <div className="text-sm text-indigo-300 font-medium">
                                        {sovereign.moonPhase.phase || sovereign.moonPhase.phaseName}
                                    </div>
                                    <div className="text-[10px] text-white/50">
                                        {/* v2.0: illumination is 0-1, legacy: illumination is percentage */}
                                        {sovereign.moonPhase.illumination <= 1
                                            ? `${Math.round(sovereign.moonPhase.illumination * 100)}% illuminated`
                                            : `${sovereign.moonPhase.illumination}% illuminated`
                                        }
                                        {sovereign.moonPhase.angle && ` • ${sovereign.moonPhase.angle.toFixed(1)}° from Sun`}
                                        {sovereign.moonPhase.cyclePosition && ` • ${sovereign.moonPhase.cyclePosition}`}
                                    </div>
                                </div>
                            </div>
                            {sovereign.moonPhase.interpretation && (
                                <div className="bg-slate-800/50 rounded-lg p-2.5 mt-2">
                                    <div className="text-xs text-indigo-300 font-medium mb-1">{sovereign.moonPhase.interpretation.title}</div>
                                    <div className="text-[10px] text-amber-400/80 mb-1">{sovereign.moonPhase.interpretation.brief}</div>
                                    <p className="text-[11px] text-white/70 leading-relaxed">{sovereign.moonPhase.interpretation.full}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* House Cusps (Placidus) */}
                    {/* Supports both v2.0 array format and legacy object format */}
                    {sovereign.houses && (Array.isArray(sovereign.houses) ? sovereign.houses.length > 0 : sovereign.houses.houses) && (() => {
                        // Normalize houses to array
                        const housesArr = Array.isArray(sovereign.houses)
                            ? sovereign.houses
                            : Array.isArray(sovereign.houses?.houses)
                                ? sovereign.houses.houses
                                : Object.entries(sovereign.houses?.houses || {}).map(([num, h]) => ({ house: parseInt(num), ...h }))

                        return (
                        <div className="bg-slate-900/40 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm text-white/60 uppercase tracking-wider font-medium">House Cusps</div>
                                <div className="text-xs text-purple-400 px-2 py-0.5 bg-purple-500/20 rounded font-medium">
                                    {sovereign.houseSystem || sovereign.houses?.system || 'Placidus'}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {housesArr.map((house, idx) => {
                                    const hNum = house.house || (idx + 1)
                                    // Next cusp degree = next house's degree (wraps at 12)
                                    const nextHouse = housesArr[(idx + 1) % housesArr.length]
                                    const nextDeg = nextHouse ? (nextHouse.degreeFormatted || `${(nextHouse.degree || 0).toFixed(1)}\u00B0 ${nextHouse.sign || ''}`) : ''
                                    const isAngular = hNum === 1 || hNum === 4 || hNum === 7 || hNum === 10
                                    const angularTag = hNum === 1 ? 'ASC' : hNum === 4 ? 'IC' : hNum === 7 ? 'DSC' : hNum === 10 ? 'MC' : null
                                    return (
                                        <div key={hNum} className={`text-center p-2 rounded ${isAngular ? 'bg-purple-500/15 border border-purple-500/30' : 'bg-slate-800/50'}`}>
                                            <div className="flex items-center justify-center gap-1">
                                                <span className={`text-base font-bold ${isAngular ? 'text-purple-300' : 'text-purple-300/70'}`}>{hNum}</span>
                                                {angularTag && <span className="text-[8px] text-purple-400 font-bold bg-purple-500/25 px-1 rounded">{angularTag}</span>}
                                            </div>
                                            <div className="text-lg">{zodiacEmojis[house.sign]}</div>
                                            <div className="text-xs text-white/80">{house.sign}</div>
                                            <div className="text-[10px] text-white/50">{house.degreeFormatted || `${(house.degree || 0).toFixed(2)}\u00B0 ${house.sign || ''}`}</div>
                                            <div className="text-[8px] text-white/30 mt-0.5" title={`Cusp ${hNum} starts here, ends at cusp ${(hNum % 12) + 1}`}>
                                                {'\u2192'} {nextDeg}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {/* Angular Houses Highlight */}
                            <div className="mt-3 pt-2 border-t border-purple-500/30">
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="text-xs">
                                        <span className="text-purple-400 font-bold">ASC</span>
                                        <span className="text-white/70 ml-1">
                                            {sovereign.ascendant?.sign || sovereign.rising?.sign || housesArr.find(h => h.house === 1)?.sign || '—'}
                                        </span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-purple-400 font-bold">IC</span>
                                        <span className="text-white/70 ml-1">
                                            {housesArr.find(h => h.house === 4)?.sign || housesArr[3]?.sign || '—'}
                                        </span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-purple-400 font-bold">DSC</span>
                                        <span className="text-white/70 ml-1">
                                            {housesArr.find(h => h.house === 7)?.sign || housesArr[6]?.sign || '—'}
                                        </span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-purple-400 font-bold">MC</span>
                                        <span className="text-white/70 ml-1">
                                            {sovereign.midheaven?.sign || housesArr.find(h => h.house === 10)?.sign || '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                    })()}

                    {/* Planetary Aspects */}
                    {sovereign.aspects && sovereign.aspects.length > 0 && (
                        <div className="bg-gradient-to-b from-cyan-900/20 to-slate-900/40 rounded-lg p-3 mt-3 border border-cyan-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">Planetary Aspects</div>
                                <div className="text-[10px] text-white/50">{sovereign.aspects.filter(a => a.nature === 'major').length} major</div>
                            </div>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                {sovereign.aspects.filter(a => a.nature === 'major').slice(0, 10).map((aspect, idx) => (
                                    <div key={idx} className={`flex items-center gap-2 p-1.5 rounded text-xs ${
                                        aspect.quality === 'harmonious' ? 'bg-green-900/30' :
                                        aspect.quality === 'challenging' ? 'bg-red-900/30' :
                                        'bg-slate-800/50'
                                    }`}>
                                        <span className="text-lg">{aspect.planet1.symbol}</span>
                                        <span className={`text-base ${
                                            aspect.quality === 'harmonious' ? 'text-green-400' :
                                            aspect.quality === 'challenging' ? 'text-red-400' :
                                            'text-cyan-400'
                                        }`}>{aspect.symbol}</span>
                                        <span className="text-lg">{aspect.planet2.symbol}</span>
                                        <div className="flex-1">
                                            <span className="text-white/80">{aspect.planet1.name.charAt(0).toUpperCase() + aspect.planet1.name.slice(1)}</span>
                                            <span className="text-white/50 mx-1">{aspect.aspect}</span>
                                            <span className="text-white/80">{aspect.planet2.name.charAt(0).toUpperCase() + aspect.planet2.name.slice(1)}</span>
                                        </div>
                                        <div className="text-[10px] text-white/40">{aspect.orb}° orb</div>
                                    </div>
                                ))}
                            </div>
                            {/* Aspect Legend */}
                            <div className="mt-2 pt-2 border-t border-cyan-500/20 flex gap-3 text-[9px]">
                                <span className="text-green-400">△ ⚹ Harmonious</span>
                                <span className="text-red-400">□ ☍ Challenging</span>
                                <span className="text-cyan-400">☌ Neutral</span>
                            </div>
                        </div>
                    )}

                    {/* Soul Family Discovery */}
                    {sovereign.elementBalance && (
                        <div className="mt-3">
                            <button
                                onClick={() => setShowSoulFamily(!showSoulFamily)}
                                className="w-full py-2 px-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-300 hover:border-purple-400/50 hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <span>👥</span>
                                {showSoulFamily ? 'Hide Soul Family' : 'Discover Soul Family'}
                                <span className="text-xs text-purple-400/70">(Neo4j)</span>
                            </button>
                            {showSoulFamily && (
                                <div className="mt-3">
                                    <SoulFamilyPanel
                                        userId={profileId}
                                        elementalProfile={{
                                            fire: sovereign.elementBalance.fire,
                                            earth: sovereign.elementBalance.earth,
                                            air: sovereign.elementBalance.air,
                                            water: sovereign.elementBalance.water
                                        }}
                                        onSelectMatch={(match) => {
                                            console.log('Soul Family match selected:', match)
                                            // Could navigate to match's profile or show compatibility details
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* Original simple display (fallback when no sovereign data) */
                <div className="text-center mb-2">
                    <style>{`
                        @keyframes bounce {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-10px); }
                        }
                        .bounce { animation: bounce 2s ease-in-out infinite; }
                    `}</style>
                    <div className="text-5xl bounce inline-block mb-1">{zodiacEmojis[western.sign]}</div>
                    <div className="text-lg font-bold text-amber-400 uppercase tracking-wide">{western.sign}</div>
                    <div className="text-xs text-white/60 mb-2">The {western.element} Sign</div>
                    <div className="flex justify-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-[10px] font-bold">
                            {western.element}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            western.yinYang === 'Yin' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-slate-900'
                        }`}>
                            {western.yinYang}
                        </span>
                    </div>
                </div>
            )}

            <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                <p className="text-[11px] text-white/80 leading-relaxed">
                    {westernPersonality[western.sign]}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={toggleSecrets}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all hover:scale-[1.02] shadow-lg"
                >
                    {secretsUnlocked ? `✨ Hide Secrets` : `🔓 Secrets →`}
                </button>
                {profileId && hasSovereignData && (
                    <button
                        onClick={() => navigate(`/western/${profileId}`)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-[1.02] shadow-lg"
                    >
                        🧠 AI Decode →
                    </button>
                )}
            </div>

            {/* 🪞 SOUL MIRROR - Expandable Secrets Section */}
            {secretsUnlocked && secrets && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                    {/* Section divider */}
                    <div className="border-t-2 border-amber-500/50 pt-4">
                        <div className="text-center mb-4">
                            <div className="text-2xl mb-2">🪞</div>
                            <h3 className="text-lg font-bold text-amber-400">
                                The Soul Mirror
                            </h3>
                            <p className="text-xs text-white/60 mt-1">
                                Deep truths about {western.sign}
                            </p>
                        </div>
                    </div>

                    {/* Each soul section */}
                    {Object.entries(secrets).map(([key, content]) => (
                        <div
                            key={key}
                            className="bg-slate-900/60 rounded-lg p-4 border border-amber-500/20"
                        >
                            <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                                <span className="text-base">✨</span>
                                {SECTION_TITLES[key]}
                            </h4>
                            <div
                                className="text-xs text-white/90 leading-relaxed space-y-2"
                                style={{ whiteSpace: 'pre-wrap' }}
                                dangerouslySetInnerHTML={{
                                    __html: content
                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-bold">$1</strong>')
                                        .replace(/\n\n/g, '</p><p class="mt-2">')
                                        .replace(/^(.+)$/gm, '<p>$1</p>')
                                }}
                            />
                        </div>
                    ))}

                    {/* Footer note */}
                    <div className="text-center pt-4 border-t border-amber-500/30">
                        <p className="text-[10px] text-white/50 italic">
                            These truths are mirrors - they reflect what's already within you. 🪞✨
                        </p>
                    </div>
                </div>
            )}

            {/* House Map Educational Popup */}
            {showHouseMap && hasSovereignData && (
                <HouseSignZonePopup
                    isOpen={showHouseMap}
                    onClose={() => setShowHouseMap(false)}
                    houses={sovereign.houses}
                    planets={sovereign.planets}
                    rising={sovereign.rising}
                    sun={sovereign.sun}
                    moon={sovereign.moon}
                    midheaven={sovereign.midheaven}
                    ascendant={sovereign.ascendant}
                />
            )}
        </div>
    )
}
