import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { getZoneForPlacement } from '../../utils/zoneKnowledgeBuilder'

// Zodiac glyphs
const zodiacEmojis = {
    'Aries': '\u2648', 'Taurus': '\u2649', 'Gemini': '\u264A', 'Cancer': '\u264B',
    'Leo': '\u264C', 'Virgo': '\u264D', 'Libra': '\u264E', 'Scorpio': '\u264F',
    'Sagittarius': '\u2650', 'Capricorn': '\u2651', 'Aquarius': '\u2652', 'Pisces': '\u2653'
}

// Planet symbols
const planetSymbols = {
    sun: '\u2609', moon: '\u263D', rising: '\u2B06',
    mercury: '\u263F', venus: '\u2640', mars: '\u2642',
    jupiter: '\u2643', saturn: '\u2644', uranus: '\u2645', neptune: '\u2646', pluto: '\u2647',
    north_node: '\u260A', south_node: '\u260B', chiron: '\u26B7'
}

// Planet weight for sorting (higher = more significant)
const PLANET_WEIGHT = {
    sun: 3, moon: 3, rising: 3,
    mercury: 2, venus: 2, mars: 2,
    jupiter: 1, saturn: 1, uranus: 1, neptune: 1, pluto: 1,
    north_node: 0.8, south_node: 0.8, chiron: 0.5
}

// Western Houses data — enriched for educational text
const WESTERN_HOUSES = {
    1: { icon: '\uD83C\uDFAD', name: 'Self & Identity', keyword: 'The Mask', element: 'Fire', domain: 'Physical appearance, first impressions, how you start things', lifeArea: 'who you are and how the world first sees you' },
    2: { icon: '\uD83D\uDCB0', name: 'Money & Values', keyword: 'The Vault', element: 'Earth', domain: 'Money, possessions, self-worth, material security', lifeArea: 'what you value and how you earn' },
    3: { icon: '\uD83D\uDCF1', name: 'Communication', keyword: 'The Messenger', element: 'Air', domain: 'Communication, siblings, short trips, daily learning', lifeArea: 'how you think, speak, and learn daily' },
    4: { icon: '\uD83C\uDFE1', name: 'Home & Roots', keyword: 'The Foundation', element: 'Water', domain: 'Home, family, roots, emotional security', lifeArea: 'your private life, family roots, and emotional foundation' },
    5: { icon: '\uD83C\uDFA8', name: 'Creativity', keyword: 'The Artist', element: 'Fire', domain: 'Creativity, romance, children, hobbies, self-expression', lifeArea: 'creative joy, romance, and self-expression' },
    6: { icon: '\uD83C\uDFE5', name: 'Health & Service', keyword: 'The Healer', element: 'Earth', domain: 'Daily work, health, routines, service, duties', lifeArea: 'daily work habits, health, and service to others' },
    7: { icon: '\uD83D\uDC91', name: 'Partnerships', keyword: 'The Mirror', element: 'Air', domain: 'Marriage, business partners, contracts, equality', lifeArea: 'committed partnerships and what you attract in others' },
    8: { icon: '\uD83D\uDD2E', name: 'Transformation', keyword: 'The Phoenix', element: 'Water', domain: 'Death/rebirth, shared money, intimacy, psychology', lifeArea: 'deep transformation, shared resources, and intimacy' },
    9: { icon: '\uD83C\uDF0D', name: 'Philosophy', keyword: 'The Philosopher', element: 'Fire', domain: 'Philosophy, travel, higher education, publishing', lifeArea: 'big-picture beliefs, travel, and higher learning' },
    10: { icon: '\uD83D\uDC54', name: 'Career', keyword: 'The Mountain', element: 'Earth', domain: 'Career, reputation, public life, authority, legacy', lifeArea: 'career achievement, public reputation, and legacy' },
    11: { icon: '\uD83E\uDD1D', name: 'Community', keyword: 'The Revolutionary', element: 'Air', domain: 'Friends, groups, humanitarian ideals, future vision', lifeArea: 'friends, social networks, and humanitarian vision' },
    12: { icon: '\uD83D\uDD49\uFE0F', name: 'Spirituality', keyword: 'The Mystic', element: 'Water', domain: 'Spirituality, dreams, hidden matters, surrender', lifeArea: 'spirituality, dreams, and the unconscious' }
}

// Element colors
const HOUSE_ELEMENT_COLORS = {
    Fire: { border: 'border-red-500/30', bg: 'bg-red-500/5', text: 'text-red-400' },
    Earth: { border: 'border-lime-500/30', bg: 'bg-lime-500/5', text: 'text-lime-400' },
    Air: { border: 'border-blue-400/30', bg: 'bg-blue-400/5', text: 'text-blue-400' },
    Water: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', text: 'text-cyan-400' }
}

// Sign qualities — one-line personality essence
const SIGN_QUALITIES = {
    Aries: 'bold initiative and courageous action',
    Taurus: 'steady persistence and sensual appreciation',
    Gemini: 'curious communication and mental agility',
    Cancer: 'nurturing protection and emotional depth',
    Leo: 'creative confidence and generous warmth',
    Virgo: 'analytical precision and devoted service',
    Libra: 'harmony, diplomacy, and artistic balance',
    Scorpio: 'transformative intensity and emotional power',
    Sagittarius: 'adventurous wisdom and philosophical optimism',
    Capricorn: 'ambitious discipline and structural mastery',
    Aquarius: 'innovative vision and humanitarian ideals',
    Pisces: 'spiritual intuition and compassionate imagination'
}

// What it means when a planet sits in a house
const PLANET_MEANINGS = {
    sun: 'Your core identity and life purpose express here',
    moon: 'Your emotional needs and instinctive reactions center here',
    mercury: 'Your thinking and communication style focuses here',
    venus: 'Your love style and aesthetic values shine here',
    mars: 'Your drive and assertive energy activate here',
    jupiter: 'Expansion, luck, and growth opportunities live here',
    saturn: 'Life lessons, discipline, and mastery develop here',
    uranus: 'Sudden change and originality disrupt here',
    neptune: 'Dreams, spirituality, and imagination dissolve boundaries here',
    pluto: 'Deep transformation and power dynamics operate here',
    north_node: 'Your soul growth direction points here',
    south_node: 'Past-life comfort zone and innate talents reside here',
    chiron: 'Your deepest wound and greatest healing gift lives here'
}

// Angular house labels — the 4 power points
const ANGULAR_LABELS = {
    1:  { tag: 'ASC', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30', meaning: 'First impressions \u2014 how the world sees you' },
    4:  { tag: 'IC',  color: 'text-cyan-400',    bg: 'bg-cyan-500/20 border-cyan-500/30',    meaning: 'Private roots \u2014 your emotional foundation' },
    7:  { tag: 'DSC', color: 'text-pink-400',    bg: 'bg-pink-500/20 border-pink-500/30',    meaning: 'Partnership style \u2014 what you attract in others' },
    10: { tag: 'MC',  color: 'text-orange-400',  bg: 'bg-orange-500/20 border-orange-500/30', meaning: 'Career destiny \u2014 how you achieve public success' }
}

// Sign order for longitude calculation
const SIGN_ORDER = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

function ordinal(n) {
    if (n === 1) return '1st'
    if (n === 2) return '2nd'
    if (n === 3) return '3rd'
    return `${n}th`
}

function signToLongitude(sign, degree) {
    const idx = SIGN_ORDER.indexOf(sign)
    if (idx === -1) return undefined
    return (idx * 30) + (degree || 0)
}

/**
 * Build a step-by-step educational interpretation for a placement.
 * Format: WHERE → HOUSE → SIGN → ZONE → PLANET
 */
function buildStepByStepInterpretation(label, sign, houseNum, zone, planetKey) {
    const houseData = WESTERN_HOUSES[houseNum]
    if (!houseData || !sign) return null

    const steps = []

    // Step 1: WHERE
    steps.push({
        question: `Where is your ${label}?`,
        answer: `In the ${ordinal(houseNum)} House \u2014 ${houseData.name} (${houseData.keyword})`
    })

    // Step 2: WHAT DOES THAT MEAN
    steps.push({
        question: 'What does this house rule?',
        answer: houseData.domain
    })

    // Step 3: WHY IT MATTERS
    const purposeMap = {
        'Sun': 'your core identity and life purpose',
        'Moon': 'your emotional needs and deepest instincts',
        'Rising': 'your outer personality and first impressions',
        'MC': 'your career destiny and public legacy'
    }
    const purpose = purposeMap[label] || `${label} energy`
    steps.push({
        question: 'So what does this mean for you?',
        answer: `${purpose} expresses through ${houseData.lifeArea || houseData.name.toLowerCase()}.`
    })

    // Step 4: SIGN FLAVOR
    if (SIGN_QUALITIES[sign]) {
        steps.push({
            question: 'How? (Sign flavor)',
            answer: `Through ${sign} energy \u2014 ${SIGN_QUALITIES[sign]}.`
        })
    }

    // Step 5: ZONE DETAIL
    if (zone) {
        steps.push({
            question: 'What specific flavor? (Zone)',
            answer: `Zone ${zone.id} \u201C${zone.name}\u201D \u2014 ${zone.archetype || 'unique'} energy adds precision to this placement.`
        })
    }

    return steps
}

/**
 * Build compact interpretation text for a house row
 */
function buildHouseInterpretation(houseNum, sign, zone, housePlanets) {
    const houseData = WESTERN_HOUSES[houseNum]
    if (!houseData || !sign) return ''

    let text = `Your ${houseData.lifeArea || houseData.name.toLowerCase()} is colored by ${sign} energy \u2014 ${SIGN_QUALITIES[sign] || sign}.`

    if (zone) {
        text += ` Zone ${zone.id} (\u201C${zone.name}\u201D) adds ${zone.archetype?.toLowerCase() || 'unique'} flavor.`
    }

    if (housePlanets.length > 0) {
        const primary = housePlanets[0]
        const meaning = PLANET_MEANINGS[primary.key]
        if (meaning) {
            text += ` ${meaning}.`
        }
    }

    return text
}

/**
 * HouseSignZonePopup — Educational floating panel (Khan Academy style)
 * Teaches how houses, signs, zones, and planets combine to create meaning.
 */
export default function HouseSignZonePopup({ isOpen, onClose, houses, planets, rising, sun, moon, midheaven, ascendant }) {
    // ESC key handler
    useEffect(() => {
        if (!isOpen) return
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [isOpen, onClose])

    // Drag state
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 })

    const onDragStart = useCallback((e) => {
        // Only left mouse button
        if (e.button !== 0) return
        e.preventDefault()
        dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y }

        const onMove = (ev) => {
            if (!dragRef.current.dragging) return
            const dx = ev.clientX - dragRef.current.startX
            const dy = ev.clientY - dragRef.current.startY
            setPos({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy })
        }
        const onUp = () => {
            dragRef.current.dragging = false
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }, [pos.x, pos.y])

    // Reset position when opened
    useEffect(() => {
        if (isOpen) setPos({ x: 0, y: 0 })
    }, [isOpen])

    // Normalize house cusps to array of 12
    const houseCusps = useMemo(() => {
        let raw = []
        if (!houses) return raw
        if (Array.isArray(houses)) {
            raw = houses
        } else if (houses.houses) {
            if (Array.isArray(houses.houses)) {
                raw = houses.houses
            } else {
                raw = Object.entries(houses.houses).map(([num, h]) => ({
                    house: parseInt(num),
                    sign: h.sign,
                    degree: h.degree,
                    degreeFormatted: h.degreeFormatted
                }))
            }
        }

        // Build lookup by house number, using both .house property and array index as fallback
        const byHouse = {}
        for (let idx = 0; idx < raw.length; idx++) {
            const c = raw[idx]
            if (!c) continue
            // Use explicit house number if valid, otherwise derive from array index (0-based → 1-based)
            const hNum = (c.house >= 1 && c.house <= 12) ? c.house : (idx + 1)
            if (hNum >= 1 && hNum <= 12 && !byHouse[hNum]) {
                byHouse[hNum] = { ...c, house: hNum }
            }
        }

        // Second pass: if any houses still missing and raw has enough items, fill by index
        if (Object.keys(byHouse).length < 12 && raw.length >= 12) {
            for (let idx = 0; idx < raw.length && idx < 12; idx++) {
                const hNum = idx + 1
                if (!byHouse[hNum] && raw[idx]) {
                    byHouse[hNum] = { ...raw[idx], house: hNum }
                }
            }
        }

        // Always produce sorted array of all houses present
        const result = []
        for (let i = 1; i <= 12; i++) {
            if (byHouse[i]) {
                result.push(byHouse[i])
            }
        }

        return result
    }, [houses])

    // Resolve midheaven with fallbacks
    const resolvedMidheaven = useMemo(() => {
        // 1. Direct midheaven prop
        if (midheaven?.sign) return midheaven

        // 2. Legacy: houses.angles.mc
        if (houses && !Array.isArray(houses) && houses.angles?.mc?.sign) {
            return houses.angles.mc
        }

        // 3. Fallback: use 10th house cusp from houseCusps array
        const h10 = houseCusps.find(c => c.house === 10)
        if (h10?.sign) {
            return { sign: h10.sign, degree: h10.degree, degreeFormatted: h10.degreeFormatted }
        }

        return null
    }, [midheaven, houses, houseCusps])

    // Resolve ascendant with fallbacks
    const resolvedAscendant = useMemo(() => {
        if (ascendant?.sign) return ascendant
        if (rising?.sign) return { sign: rising.sign, degree: rising.degreeInSign }

        // Legacy: houses.angles.ascendant
        if (houses && !Array.isArray(houses) && houses.angles?.ascendant?.sign) {
            return houses.angles.ascendant
        }

        // Fallback: use 1st house cusp
        const h1 = houseCusps.find(c => c.house === 1)
        if (h1?.sign) {
            return { sign: h1.sign, degree: h1.degree }
        }

        return null
    }, [ascendant, rising, houses, houseCusps])

    // Build planet-to-house mapping
    const housePlanetsMap = useMemo(() => {
        const map = {}
        for (let i = 1; i <= 12; i++) map[i] = []

        if (!planets) return map

        const calculateHouse = (planetLong) => {
            if (planetLong == null || houseCusps.length === 0) return null
            for (let i = 0; i < houseCusps.length; i++) {
                const cusp = houseCusps[i]
                const nextCusp = houseCusps[(i + 1) % houseCusps.length]
                if (!cusp || !nextCusp) continue

                const cuspLong = signToLongitude(cusp.sign, cusp.degree)
                const nextLong = signToLongitude(nextCusp.sign, nextCusp.degree)
                if (cuspLong == null || nextLong == null) continue

                if (cuspLong <= nextLong) {
                    if (planetLong >= cuspLong && planetLong < nextLong) return cusp.house || (i + 1)
                } else {
                    if (planetLong >= cuspLong || planetLong < nextLong) return cusp.house || (i + 1)
                }
            }
            return null
        }

        Object.entries(planets).forEach(([key, planet]) => {
            if (!planet) return
            let houseNum = planet.house

            if (!houseNum && planet.longitude != null) {
                houseNum = calculateHouse(planet.longitude)
            }
            if (!houseNum && planet.sign && planet.degree != null) {
                const lng = signToLongitude(planet.sign, planet.degree)
                if (lng != null) houseNum = calculateHouse(lng)
            }
            if (!houseNum && planet.sign && planet.degreeInSign != null) {
                const lng = signToLongitude(planet.sign, planet.degreeInSign)
                if (lng != null) houseNum = calculateHouse(lng)
            }

            if (houseNum && houseNum >= 1 && houseNum <= 12) {
                map[houseNum].push({
                    key,
                    name: planet.name || key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                    symbol: planet.symbol || planetSymbols[key] || '\u25CF'
                })
            }
        })

        for (let i = 1; i <= 12; i++) {
            map[i].sort((a, b) => (PLANET_WEIGHT[b.key] || 0) - (PLANET_WEIGHT[a.key] || 0))
        }

        return map
    }, [planets, houseCusps])

    // Build zone data for each house cusp
    const houseZones = useMemo(() => {
        const zones = {}
        for (const cusp of houseCusps) {
            const hNum = cusp.house
            zones[hNum] = getZoneForPlacement(cusp.sign, cusp.degree)
        }
        return zones
    }, [houseCusps])

    // Angular points data — with resolved midheaven/ascendant
    const angularData = useMemo(() => {
        const data = {}

        // ASC
        if (resolvedAscendant?.sign) {
            const deg = resolvedAscendant.degree ?? resolvedAscendant.degreeInSign
            data[1] = { sign: resolvedAscendant.sign, degree: deg, zone: getZoneForPlacement(resolvedAscendant.sign, deg) }
        }

        // MC
        if (resolvedMidheaven?.sign) {
            data[10] = { sign: resolvedMidheaven.sign, degree: resolvedMidheaven.degree, zone: getZoneForPlacement(resolvedMidheaven.sign, resolvedMidheaven.degree) }
        }

        // IC from house 4 cusp
        const h4 = houseCusps.find(c => c.house === 4)
        if (h4) {
            data[4] = { sign: h4.sign, degree: h4.degree, zone: getZoneForPlacement(h4.sign, h4.degree) }
        }

        // DSC from house 7 cusp
        const h7 = houseCusps.find(c => c.house === 7)
        if (h7) {
            data[7] = { sign: h7.sign, degree: h7.degree, zone: getZoneForPlacement(h7.sign, h7.degree) }
        }

        return data
    }, [resolvedAscendant, resolvedMidheaven, houseCusps])

    // Which houses have Constitutional Trinity (Sun/Moon)
    const trinityHouses = useMemo(() => {
        const set = new Set()
        if (sun?.house) set.add(sun.house)
        if (moon?.house) set.add(moon.house)
        return set
    }, [sun, moon])

    // Build step-by-step educational insights for Constitutional Trinity + MC
    const trinitySteps = useMemo(() => {
        const steps = []

        // Sun placement
        if (sun?.house && sun?.sign) {
            const hNum = sun.house
            const deg = sun.degreeInSign ?? sun.degree
            const zone = getZoneForPlacement(sun.sign, deg)
            const stepData = buildStepByStepInterpretation('Sun', sun.sign, hNum, zone, 'sun')
            if (stepData) {
                steps.push({ label: 'Sun', symbol: planetSymbols.sun, colorClass: 'text-amber-400', bgClass: 'bg-amber-500/10 border-amber-500/30', steps: stepData, houseNum: hNum, sign: sun.sign, degree: deg, zone })
            }
        }

        // Moon placement
        if (moon?.house && moon?.sign) {
            const hNum = moon.house
            const deg = moon.degreeInSign ?? moon.degree
            const zone = getZoneForPlacement(moon.sign, deg)
            const stepData = buildStepByStepInterpretation('Moon', moon.sign, hNum, zone, 'moon')
            if (stepData) {
                steps.push({ label: 'Moon', symbol: planetSymbols.moon, colorClass: 'text-blue-300', bgClass: 'bg-blue-500/10 border-blue-500/30', steps: stepData, houseNum: hNum, sign: moon.sign, degree: deg, zone })
            }
        }

        // MC / Midheaven
        if (resolvedMidheaven?.sign) {
            const deg = resolvedMidheaven.degree
            const zone = getZoneForPlacement(resolvedMidheaven.sign, deg)
            const stepData = buildStepByStepInterpretation('MC', resolvedMidheaven.sign, 10, zone, null)
            if (stepData) {
                steps.push({ label: 'Midheaven (MC)', symbol: '\u2606', colorClass: 'text-orange-400', bgClass: 'bg-orange-500/10 border-orange-500/30', steps: stepData, houseNum: 10, sign: resolvedMidheaven.sign, degree: deg, zone })
            }
        }

        return steps
    }, [sun, moon, resolvedMidheaven])

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop — click to close */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Card — fully opaque, draggable */}
            <div
                className="relative bg-slate-900 border border-amber-500/30 rounded-xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto p-5 shadow-2xl shadow-black/80"
                style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white/40 hover:text-white/80 text-lg leading-none z-10"
                    title="Close (ESC)"
                >
                    {'\u2715'}
                </button>

                {/* Header — drag handle */}
                <div className="mb-5 cursor-move select-none" onMouseDown={onDragStart}>
                    <h3 className="text-base font-bold text-amber-400">How Your Houses Work</h3>
                    <p className="text-[11px] text-white/40 italic">Astrology 101 {'\u2014'} Understanding your cosmic blueprint</p>
                </div>

                {/* Section 1: The Four Layers Explained */}
                <div className="bg-slate-800/50 rounded-lg p-4 mb-5 border border-slate-700/50">
                    <div className="text-[11px] text-white/80 font-medium mb-2">Every chart placement is a combination of four layers:</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-purple-500/10 rounded p-2 border border-purple-500/20">
                            <span className="text-purple-400 font-bold">HOUSE</span>
                            <span className="text-white/60"> = WHERE in your life?</span>
                            <div className="text-white/40 mt-0.5 italic">The room in your house</div>
                        </div>
                        <div className="bg-amber-500/10 rounded p-2 border border-amber-500/20">
                            <span className="text-amber-400 font-bold">SIGN</span>
                            <span className="text-white/60"> = HOW do you do it?</span>
                            <div className="text-white/40 mt-0.5 italic">The decoration style</div>
                        </div>
                        <div className="bg-cyan-500/10 rounded p-2 border border-cyan-500/20">
                            <span className="text-cyan-400 font-bold">ZONE</span>
                            <span className="text-white/60"> = What SPECIFIC flavor?</span>
                            <div className="text-white/40 mt-0.5 italic">The exact shade of paint</div>
                        </div>
                        <div className="bg-emerald-500/10 rounded p-2 border border-emerald-500/20">
                            <span className="text-emerald-400 font-bold">PLANET</span>
                            <span className="text-white/60"> = WHAT energy is active?</span>
                            <div className="text-white/40 mt-0.5 italic">Who's in the room</div>
                        </div>
                    </div>
                    <div className="text-[10px] text-white/50 mt-2.5 leading-relaxed">
                        Your <span className="text-emerald-400">Rising sign (Ascendant)</span> sets the starting point.
                        It determines which sign rules each house {'\u2014'} creating your unique cosmic map.
                    </div>
                </div>

                {/* Section 2: Step-by-Step — Your Key Placements */}
                {trinitySteps.length > 0 && (
                    <div className="mb-5">
                        <div className="text-xs text-amber-400 uppercase tracking-wider font-medium mb-3">
                            Reading Your Chart {'\u2014'} Step by Step
                        </div>

                        {trinitySteps.map((placement, pIdx) => (
                            <div key={pIdx} className={`rounded-lg p-3.5 border mb-3 ${placement.bgClass}`}>
                                {/* Placement header */}
                                <div className="flex items-center gap-2 mb-2.5">
                                    <span className="text-lg">{placement.symbol}</span>
                                    <span className={`text-sm font-bold ${placement.colorClass}`}>{placement.label}</span>
                                    <span className="text-[10px] text-white/50">
                                        {zodiacEmojis[placement.sign] || ''} {placement.sign}
                                        {placement.degree != null && ` ${placement.degree.toFixed(1)}\u00B0`}
                                        {placement.zone && ` \u2022 Zone ${placement.zone.id}`}
                                    </span>
                                </div>

                                {/* Step-by-step Q&A */}
                                <div className="space-y-2">
                                    {placement.steps.map((step, sIdx) => (
                                        <div key={sIdx} className="flex gap-2">
                                            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                                                <span className="text-[8px] text-white/60 font-bold">{sIdx + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] text-white/50 italic">{step.question}</div>
                                                <div className="text-[11px] text-white/80 leading-relaxed">{step.answer}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Section 3: Angular Power Axis */}
                <div className="mb-5">
                    <div className="text-xs text-purple-400 uppercase tracking-wider font-medium mb-1">Angular Power Axis</div>
                    <div className="text-[10px] text-white/40 mb-2.5">The 4 most powerful points in your chart {'\u2014'} the &quot;power cross&quot; that shapes your life.</div>
                    <div className="grid grid-cols-2 gap-2">
                        {[1, 10, 7, 4].map(hNum => {
                            const angular = ANGULAR_LABELS[hNum]
                            const aData = angularData[hNum]
                            if (!angular) return null

                            // If no data available, still show the position with placeholder
                            if (!aData) {
                                return (
                                    <div key={hNum} className="rounded-lg p-2.5 border border-slate-600/30 bg-slate-800/30">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className={`text-[10px] font-bold ${angular.color}`}>{angular.tag}</span>
                                            <span className="text-[9px] text-white/40">({ordinal(hNum)} House)</span>
                                        </div>
                                        <div className="text-[9px] text-white/30 italic">Data not available</div>
                                        <div className="text-[9px] text-white/50 mt-1">{angular.meaning}</div>
                                    </div>
                                )
                            }

                            return (
                                <div key={hNum} className={`rounded-lg p-2.5 border ${angular.bg}`}>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className={`text-[10px] font-bold ${angular.color}`}>{angular.tag}</span>
                                        <span className="text-[9px] text-white/40">({ordinal(hNum)} House)</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-base">{zodiacEmojis[aData.sign] || ''}</span>
                                        <span className="text-[11px] text-white/90 font-medium">{aData.sign}</span>
                                        {aData.zone && (
                                            <span className="text-[9px] text-white/50">Z{aData.zone.id}</span>
                                        )}
                                        {aData.degree != null && (
                                            <span className="text-[9px] text-white/40">{aData.degree.toFixed(1)}{'\u00B0'}</span>
                                        )}
                                    </div>
                                    {aData.zone && (
                                        <div className="text-[9px] text-white/60 italic mb-1">{'\u201C'}{aData.zone.name}{'\u201D'}</div>
                                    )}
                                    <div className="text-[9px] text-white/50">{angular.meaning}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Section 4: All 12 Houses */}
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="text-xs text-amber-400 uppercase tracking-wider font-medium">Your 12 Houses</div>
                        {houseCusps.length < 12 && (
                            <span className="text-[9px] text-red-400">({houseCusps.length}/12 loaded)</span>
                        )}
                    </div>
                    <div className="text-[10px] text-white/40 mb-2.5">Each house is a life domain. The sign on its cusp shows HOW you experience that area.</div>
                    <div className="space-y-1.5">
                        {houseCusps.length === 0 && (
                            <div className="text-[11px] text-white/40 italic p-3 text-center">House cusp data not available for this profile.</div>
                        )}
                        {houseCusps.map(cusp => {
                            const hNum = cusp.house
                            const houseData = WESTERN_HOUSES[hNum]
                            if (!houseData) return null

                            const zone = houseZones[hNum]
                            const hPlanets = housePlanetsMap[hNum] || []
                            const isAngular = !!ANGULAR_LABELS[hNum]
                            const isTrinity = trinityHouses.has(hNum)
                            const angular = ANGULAR_LABELS[hNum]
                            const colors = HOUSE_ELEMENT_COLORS[houseData.element] || HOUSE_ELEMENT_COLORS.Fire
                            const interpretation = buildHouseInterpretation(hNum, cusp.sign, zone, hPlanets)

                            // Determine background styling
                            let rowBg = `${colors.bg} ${colors.border}`
                            if (isAngular && isTrinity) {
                                rowBg = 'bg-gradient-to-r from-purple-500/10 to-amber-500/10 border-purple-400/40'
                            } else if (isAngular) {
                                rowBg = 'bg-purple-500/8 border-purple-500/30'
                            } else if (isTrinity) {
                                rowBg = 'bg-amber-500/8 border-amber-500/30'
                            }

                            return (
                                <div key={hNum} className={`rounded-lg p-2.5 border ${rowBg}`}>
                                    {/* Top line: House info + Sign/Zone + Planets */}
                                    <div className="flex items-start gap-2">
                                        {/* House icon + number */}
                                        <div className="flex-shrink-0 text-center w-10">
                                            <div className="text-lg leading-none">{houseData.icon}</div>
                                            <div className={`text-[9px] font-bold ${colors.text}`}>{ordinal(hNum)}</div>
                                        </div>

                                        {/* Main content */}
                                        <div className="flex-1 min-w-0">
                                            {/* House name + Angular tag + Trinity tag */}
                                            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                <span className="text-[11px] text-white/90 font-medium">{houseData.name}</span>
                                                <span className="text-[9px] text-white/40 italic">{houseData.keyword}</span>
                                                {angular && (
                                                    <span className={`text-[8px] px-1 py-0.5 rounded font-bold ${angular.color} ${angular.bg}`}>
                                                        {angular.tag}
                                                    </span>
                                                )}
                                                {isTrinity && (
                                                    <span className="text-[8px] px-1 py-0.5 rounded font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30">
                                                        {sun?.house === hNum ? '\u2609 Sun' : ''}{moon?.house === hNum ? '\u263D Moon' : ''}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Sign + Zone + Degree */}
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="text-sm">{zodiacEmojis[cusp.sign] || ''}</span>
                                                <span className="text-[10px] text-white/80">{cusp.sign}</span>
                                                {zone && (
                                                    <span className="text-[9px] text-cyan-400">Z{zone.id} {'\u201C'}{zone.name}{'\u201D'}</span>
                                                )}
                                                <span className="text-[9px] text-white/30">{cusp.degreeFormatted || `${(cusp.degree || 0).toFixed(1)}\u00B0`}</span>
                                            </div>

                                            {/* Planets in this house */}
                                            {hPlanets.length > 0 && (
                                                <div className="flex items-center gap-1 mb-1">
                                                    {hPlanets.map((p, i) => (
                                                        <span key={i} className="text-[11px] text-amber-300" title={p.name}>
                                                            {p.symbol}
                                                        </span>
                                                    ))}
                                                    <span className="text-[9px] text-amber-400/70">
                                                        {hPlanets.map(p => p.name).join(', ')}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Interpretation */}
                                            {interpretation && (
                                                <p className="text-[10px] text-white/55 leading-relaxed">{interpretation}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Section 5: How to Read Any Placement */}
                <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/40">
                    <div className="text-[10px] text-purple-400 uppercase tracking-wider font-medium mb-1.5">The Formula</div>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                        For any placement in your chart, read it like a sentence:
                    </p>
                    <div className="bg-slate-900/60 rounded p-2 mt-1.5 mb-2">
                        <p className="text-[11px] text-white/80 italic leading-relaxed">
                            "My <span className="text-purple-400">[house domain]</span> is expressed through{' '}
                            <span className="text-amber-400">[sign]</span> energy, with{' '}
                            <span className="text-cyan-400">[zone]</span> precision, and{' '}
                            <span className="text-emerald-400">[planet]</span> drive."
                        </p>
                    </div>
                    <p className="text-[10px] text-white/40 italic">
                        Angular houses (ASC, MC, DSC, IC) are the most powerful. Planets add extra energy to any house they visit.
                    </p>
                </div>
            </div>
        </div>,
        document.body
    )
}
