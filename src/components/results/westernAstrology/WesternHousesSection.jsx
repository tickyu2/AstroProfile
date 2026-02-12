import React, { useState, useMemo } from 'react'
import { planetSymbols } from './elementAnalysis'

// Western Houses data - 12 life domains
const WESTERN_HOUSES = {
    1: {
        icon: '\u{1F3AD}', name: 'Self & Identity', keyword: 'The Mask', element: 'Fire',
        domain: 'Physical appearance, first impressions, how you start things',
        careers: ['Actor', 'Model', 'Influencer', 'Public speaker', 'Leader'],
        complement: 7, complementName: '7th (Partnerships)'
    },
    2: {
        icon: '\u{1F4B0}', name: 'Money & Values', keyword: 'The Vault', element: 'Earth',
        domain: 'Money, possessions, self-worth, material security',
        careers: ['Finance', 'Banking', 'Real estate', 'Wealth management'],
        complement: 8, complementName: '8th (Shared Resources)'
    },
    3: {
        icon: '\u{1F4F1}', name: 'Communication', keyword: 'The Messenger', element: 'Air',
        domain: 'Communication, siblings, short trips, daily learning, languages',
        careers: ['Writer', 'Journalist', 'Teacher', 'Translator', 'Social media'],
        complement: 9, complementName: '9th (Philosophy)'
    },
    4: {
        icon: '\u{1F3E1}', name: 'Home & Roots', keyword: 'The Foundation', element: 'Water',
        domain: 'Home, family, roots, emotional security, private life',
        careers: ['Interior design', 'Family therapy', 'Real estate', 'Chef'],
        complement: 10, complementName: '10th (Career)'
    },
    5: {
        icon: '\u{1F3A8}', name: 'Creativity', keyword: 'The Artist', element: 'Fire',
        domain: 'Creativity, romance, children, hobbies, joy, self-expression',
        careers: ['Artist', 'Entertainer', 'Teacher', 'Game designer', 'Performer'],
        complement: 11, complementName: '11th (Community)'
    },
    6: {
        icon: '\u{1F3E5}', name: 'Health & Service', keyword: 'The Healer', element: 'Earth',
        domain: 'Daily work, health, routines, service, pets, duties',
        careers: ['Doctor', 'Nurse', 'Nutritionist', 'Fitness trainer', 'Assistant'],
        complement: 12, complementName: '12th (Spirituality)'
    },
    7: {
        icon: '\u{1F491}', name: 'Partnerships', keyword: 'The Mirror', element: 'Air',
        domain: 'Marriage, business partners, contracts, equality',
        careers: ['Mediator', 'Marriage counselor', 'Diplomat', 'Partnership law'],
        complement: 1, complementName: '1st (Self)'
    },
    8: {
        icon: '\u{1F52E}', name: 'Transformation', keyword: 'The Phoenix', element: 'Water',
        domain: 'Death/rebirth, shared money, intimacy, psychology, occult',
        careers: ['Psychologist', 'Investigator', 'Estate planner', 'Researcher'],
        complement: 2, complementName: '2nd (Personal Resources)'
    },
    9: {
        icon: '\u{1F30D}', name: 'Philosophy', keyword: 'The Philosopher', element: 'Fire',
        domain: 'Philosophy, travel, higher education, religion, publishing',
        careers: ['Professor', 'Philosopher', 'Travel guide', 'Publisher', 'Minister'],
        complement: 3, complementName: '3rd (Communication)'
    },
    10: {
        icon: '\u{1F454}', name: 'Career', keyword: 'The Mountain', element: 'Earth',
        domain: 'Career, reputation, public life, authority, legacy',
        careers: ['CEO', 'Politician', 'Public figure', 'Executive', 'Authority'],
        complement: 4, complementName: '4th (Home)'
    },
    11: {
        icon: '\u{1F91D}', name: 'Community', keyword: 'The Revolutionary', element: 'Air',
        domain: 'Friends, groups, humanitarian ideals, technology, future vision',
        careers: ['Activist', 'Tech innovator', 'Community organizer', 'Futurist'],
        complement: 5, complementName: '5th (Creativity)'
    },
    12: {
        icon: '\u{1F549}\uFE0F', name: 'Spirituality', keyword: 'The Mystic', element: 'Water',
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

export default function WesternHousesSection({ houses, planets }) {
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
        if (count >= 5) return { stars: '\u2605\u2605\u2605\u2605\u2605', label: 'Very Strong' }
        if (count >= 3) return { stars: '\u2605\u2605\u2605\u2605\u2606', label: 'Strong' }
        if (count >= 2) return { stars: '\u2605\u2605\u2605\u2606\u2606', label: 'Moderate' }
        if (count >= 1) return { stars: '\u2605\u2605\u2606\u2606\u2606', label: 'Activated' }
        return { stars: '\u2606\u2606\u2606\u2606\u2606', label: 'Empty' }
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
                        <span className="text-amber-400">{rating.stars.replace(/\u2606/g, '')}</span>
                        <span className="text-white/30">{rating.stars.replace(/\u2605/g, '')}</span>
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
                    <span className="text-lg">{'\u{1F3DB}\uFE0F'}</span>
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
                    <div className="text-[10px] text-purple-400 font-medium mb-1">{'\u{1F4A1}'} Compatibility Insight</div>
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
                    <span className="text-base">{'\u{1F4DA}'}</span>
                    <span className="text-white/70">More Info</span>
                </button>
                <button
                    className="flex flex-col items-center gap-1 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg transition-all text-[10px]"
                    onClick={() => setShowTheory(!showTheory)}
                >
                    <span className="text-base">{'\u{1F393}'}</span>
                    <span className="text-white/70">Theory</span>
                </button>
                <button
                    className="flex flex-col items-center gap-1 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg transition-all text-[10px]"
                    onClick={() => setShowMasteryGuide(!showMasteryGuide)}
                >
                    <span className="text-base">{'\u{1F3AF}'}</span>
                    <span className="text-white/70">Mastery</span>
                </button>
                <a
                    href="https://www.khanacademy.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 rounded-lg transition-all text-[10px]"
                >
                    <span className="text-base">{'\u{1F517}'}</span>
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
                                <strong>{'\u2605\u2605\u2605\u2605\u2605'}</strong> = 5+ planets (Very Strong) |
                                <strong>{'\u2605\u2605\u2605\u2605\u2606'}</strong> = 3-4 (Strong) |
                                <strong>{'\u2605\u2605\u2605\u2606\u2606'}</strong> = 2 (Moderate) |
                                <strong>{'\u2605\u2605\u2606\u2606\u2606'}</strong> = 1 (Weak) |
                                <strong>{'\u2605\u2606\u2606\u2606\u2606'}</strong> = 0 (Empty)
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mastery Guide Panel */}
            {showMasteryGuide && (
                <div className="mt-3 p-3 bg-gradient-to-br from-purple-900/30 to-slate-800/50 border border-purple-500/30 rounded-lg">
                    <div className="text-xs text-purple-400 font-bold mb-2">{'\u{1F3AF}'} Life Domain Mastery Guide</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 bg-slate-800/50 rounded">
                            <div className="text-white/90 font-medium mb-1">{'\u{1F4F1}'} Master Languages?</div>
                            <div className="text-white/60">Focus on 3rd House</div>
                            <div className={`text-[9px] ${housePlanetCounts[3].count >= 2 ? 'text-green-400' : 'text-amber-400'}`}>
                                Your strength: {getStarRating(housePlanetCounts[3].count).stars}
                            </div>
                        </div>
                        <div className="p-2 bg-slate-800/50 rounded">
                            <div className="text-white/90 font-medium mb-1">{'\u{1F30D}'} Philosophical Debate?</div>
                            <div className="text-white/60">Focus on 9th House</div>
                            <div className={`text-[9px] ${housePlanetCounts[9].count >= 2 ? 'text-green-400' : 'text-amber-400'}`}>
                                Your strength: {getStarRating(housePlanetCounts[9].count).stars}
                            </div>
                        </div>
                        <div className="p-2 bg-slate-800/50 rounded">
                            <div className="text-white/90 font-medium mb-1">{'\u{1F454}'} Career Success?</div>
                            <div className="text-white/60">Focus on 10th House</div>
                            <div className={`text-[9px] ${housePlanetCounts[10].count >= 2 ? 'text-green-400' : 'text-amber-400'}`}>
                                Your strength: {getStarRating(housePlanetCounts[10].count).stars}
                            </div>
                        </div>
                        <div className="p-2 bg-slate-800/50 rounded">
                            <div className="text-white/90 font-medium mb-1">{'\u{1F549}\uFE0F'} Spiritual Depth?</div>
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
