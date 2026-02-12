import React, { useState } from 'react'
import { ResponsiveRadar } from '@nivo/radar'
import {
    WESTERN_ELEMENT_COLORS, elementConfig, elementMeanings,
    calculateElementBreakdown, detectStelliums, generateElementInsight
} from './elementAnalysis'
import {
    ELEMENT_MEANINGS,
    calculateOverlapScore, calculateComplementScore,
    calculateCommunicationScore, calculateTotalCompatibility,
    getCompatibilityRating, rankAllCusps,
    analyzeUserConstitution, calculateIdealPartner,
    generateMatchReasons, generateBadMatchReasons
} from './compatibilityEngine'

// Elemental Dominance Section Component
export default
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
                {renderTierSection('trinity', 'TRINITY (Heavy Weight)', '3.0Ã—', data.trinity, config.textClass)}

                {/* Personal Section */}
                {renderTierSection('personal', 'PERSONAL PLANETS (Moderate)', '2.0Ã—', data.personal, config.textClass)}

                {/* Outer Section */}
                {renderTierSection('outer', 'OUTER PLANETS (Lesser)', '1.0Ã—', data.outer, config.textClass)}

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
                            â­ STELLIUM DETECTED: {relevantStellium.count} planets in {relevantStellium.sign}!
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
                                <span className="text-lg">ðŸŒ</span>
                                <div>
                                    <div className="text-xs text-white/80 font-bold uppercase tracking-wide">Western Elements Map</div>
                                    <div className="text-[9px] text-white/40 italic">HOW you operate â€¢ Your Psychological Blueprint</div>
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
                    <span>{showDetails ? 'ðŸ“–' : 'ðŸ“Š'}</span>
                    {showDetails ? 'Hide Details' : 'More Info'}
                </button>

                {/* Theory Button */}
                <button
                    onClick={() => setShowTheory(!showTheory)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-400 hover:border-purple-400/50 hover:from-purple-500/20 hover:to-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <span>{showTheory ? 'ðŸ”¬' : 'ðŸ“'}</span>
                    {showTheory ? 'Hide Theory' : 'Theory'}
                </button>

                {/* Element Match Button */}
                <button
                    onClick={() => { setShowMatch(!showMatch); if (!showMatch) setShowLab(false); }}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-lg text-sm font-medium text-pink-400 hover:border-pink-400/50 hover:from-pink-500/20 hover:to-rose-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <span>{showMatch ? 'ðŸ’”' : 'ðŸ’•'}</span>
                    {showMatch ? 'Hide Match' : 'Element Match'}
                </button>

                {/* Physics Lab Button */}
                <button
                    onClick={() => { setShowLab(!showLab); if (!showLab) setShowMatch(false); }}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg text-sm font-medium text-emerald-400 hover:border-emerald-400/50 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all flex items-center justify-center gap-2"
                >
                    <span>{showLab ? 'ðŸ”¬' : 'ðŸ§ª'}</span>
                    {showLab ? 'Exit Lab' : 'Physics Lab'}
                </button>
            </div>

            {/* Theory Section */}
            {showTheory && (
                <div className="mb-3 space-y-3 animate-fadeIn">
                    {/* Formula Overview */}
                    <div className="bg-gradient-to-b from-purple-900/30 to-slate-900/40 rounded-lg p-3 border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">ðŸ“</span>
                            <div className="text-sm text-purple-300 font-bold">Western Zodiac Element Formula</div>
                        </div>

                        {/* The Formula */}
                        <div className="bg-slate-900/60 rounded-lg p-3 mb-3 font-mono text-xs">
                            <div className="text-cyan-400 mb-2">Element % = (Î£ Planet Weights) / (Total Weight) Ã— 100</div>
                            <div className="text-white/60 space-y-1">
                                <div>Where each planet contributes:</div>
                                <div className="ml-2 text-amber-400">Planet_Contribution = Weight Ã— Sign_Element_Match</div>
                            </div>
                        </div>

                        {/* Weight Tiers */}
                        <div className="text-xs text-white/80 mb-3">
                            <div className="font-bold text-purple-300 mb-2">Planetary Weight Tiers:</div>
                            <div className="grid grid-cols-1 gap-2">
                                {/* Heavy Tier */}
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-amber-400 font-bold">HEAVY (3.0Ã—)</span>
                                        <span className="text-amber-400/60">~40-50% of total</span>
                                    </div>
                                    <div className="flex gap-3 text-white/70">
                                        <span>â˜‰ Sun</span>
                                        <span>â˜½ Moon</span>
                                        <span>â¬†ï¸ Rising</span>
                                    </div>
                                    <div className="text-[10px] text-white/50 mt-1">The Constitutional Trinity - defines core identity</div>
                                </div>

                                {/* Moderate Tier */}
                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-cyan-400 font-bold">MODERATE (2.0Ã—)</span>
                                        <span className="text-cyan-400/60">~25-35% of total</span>
                                    </div>
                                    <div className="flex gap-3 text-white/70">
                                        <span>â˜¿ Mercury</span>
                                        <span>â™€ Venus</span>
                                        <span>â™‚ Mars</span>
                                    </div>
                                    <div className="text-[10px] text-white/50 mt-1">Inner Planets - personal expression & action</div>
                                </div>

                                {/* Lesser Tier */}
                                <div className="bg-slate-500/10 border border-slate-500/30 rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-300 font-bold">LESSER (1.0Ã—)</span>
                                        <span className="text-slate-400/60">~15-25% of total</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-white/60">
                                        <span>â™ƒ Jupiter</span>
                                        <span>â™„ Saturn</span>
                                        <span>â™… Uranus</span>
                                        <span>â™† Neptune</span>
                                        <span>â™‡ Pluto</span>
                                        <span>â˜Š Nodes</span>
                                    </div>
                                    <div className="text-[10px] text-white/50 mt-1">Outer/Generational Planets - collective trends</div>
                                </div>

                                {/* Minimal Tier */}
                                <div className="bg-slate-600/10 border border-slate-600/30 rounded p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-400 font-bold">MINIMAL (0.5Ã—)</span>
                                        <span className="text-slate-500/60">If included</span>
                                    </div>
                                    <div className="flex gap-3 text-white/50">
                                        <span>âš· Chiron</span>
                                    </div>
                                    <div className="text-[10px] text-white/40 mt-1">Asteroid - healing themes</div>
                                </div>
                            </div>
                        </div>

                        {/* Sign to Element Mapping */}
                        <div className="text-xs">
                            <div className="font-bold text-purple-300 mb-2">Sign â†’ Element Mapping:</div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-400">ðŸ”¥ Fire:</span>
                                    <span className="text-white/60">Aries, Leo, Sagittarius</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-400">ðŸŒ Earth:</span>
                                    <span className="text-white/60">Taurus, Virgo, Capricorn</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-cyan-400">ðŸ’¨ Air:</span>
                                    <span className="text-white/60">Gemini, Libra, Aquarius</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400">ðŸ’§ Water:</span>
                                    <span className="text-white/60">Cancer, Scorpio, Pisces</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Insights */}
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">ðŸ’¡</span>
                            <div className="text-xs text-yellow-400 uppercase tracking-wider font-medium">Key Insights</div>
                        </div>
                        <div className="text-[11px] text-white/70 space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="text-amber-400">1.</span>
                                <p><strong className="text-amber-300">Trinity Dominates:</strong> Sun/Moon/Rising contribute ~40-50% of total weight. Birth time accuracy is CRITICAL.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-400">2.</span>
                                <p><strong className="text-cyan-300">Stelliums Amplify:</strong> Multiple planets in same element compound the effect. A Taurus stellium â†’ strong Earth.</p>
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
                            <span>âš–ï¸</span>
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
                        <span className="text-base">ðŸ§®</span>
                        <div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">
                            Step-by-Step Element Calculations
                        </div>
                    </div>

                    {/* Detailed breakdown for each element */}
                    {elements.map((element) => renderElementBreakdown(element))}

                    {/* Grand Total Summary */}
                    <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 rounded-lg p-3 border border-slate-600/50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">ðŸ“Š</span>
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
                                <span className="text-base">â­</span>
                                <div className="text-xs text-yellow-400 uppercase tracking-wider font-medium">
                                    Stelliums Detected ({stelliums.length})
                                </div>
                            </div>
                            <div className="space-y-1">
                                {stelliums.map((stellium, idx) => (
                                    <div key={idx} className="text-[10px] text-white/70">
                                        â€¢ <span className="text-yellow-300">{stellium.count} planets in {stellium.sign}</span>
                                        <span className="text-white/50"> ({stellium.element}) </span>
                                        <span className="text-white/40">â†’ {stellium.planets.join(', ')}</span>
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
                    { id: 1, name: 'What I Have', icon: 'ðŸŒŸ', color: 'text-amber-400' },
                    { id: 2, name: 'What I Lack', icon: 'ðŸŽ¯', color: 'text-red-400' },
                    { id: 3, name: 'What I Need', icon: 'ðŸ’Ž', color: 'text-emerald-400' },
                    { id: 4, name: 'Who Can Give', icon: 'ðŸ’•', color: 'text-pink-400' },
                    { id: 5, name: 'New Balance', icon: 'âš–ï¸', color: 'text-cyan-400' },
                    { id: 6, name: 'Will I Flourish?', icon: 'ðŸŒ±', color: 'text-green-400' }
                ]

                return (
                    <div className="mt-3 space-y-3 animate-fadeIn">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">ðŸ’•</span>
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
                                        <span className="text-lg">ðŸŒŸ</span>
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
                                    Next: What I Lack â†’
                                </button>
                            </div>
                        )}

                        {/* SECTION 2: WHAT I LACK */}
                        {matchSection === 2 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-red-900/30 to-slate-900/40 rounded-lg p-3 border border-red-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">ðŸŽ¯</span>
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
                                                            <strong>âš ï¸ Relationship Impact:</strong> {meaning.deficitImpact}
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
                                            <span className="text-2xl mb-2">âœ¨</span>
                                            <div className="text-sm">You have no significant deficits! Your elements are well-balanced.</div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setMatchSection(1)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        â† Back
                                    </button>
                                    <button onClick={() => setMatchSection(3)} className="flex-1 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
                                        Next: What I Need â†’
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 3: WHAT I NEED */}
                        {matchSection === 3 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-emerald-900/30 to-slate-900/40 rounded-lg p-3 border border-emerald-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">ðŸ’Ž</span>
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
                                        <div className="text-[11px] text-emerald-300 font-bold mb-1">ðŸ’¡ THE PERFECT FORMULA:</div>
                                        <div className="text-[10px] text-white/70">
                                            {Object.entries(idealPartner).sort((a, b) => b[1] - a[1]).map(([el, pct]) => `${el} ${pct}%`).join(' + ')} = YOUR IDEAL
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setMatchSection(2)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        â† Back
                                    </button>
                                    <button onClick={() => setMatchSection(4)} className="flex-1 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
                                        Next: Who Can Give â†’
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
                                        <span className="text-lg">ðŸ“š</span>
                                        <div className="text-sm text-pink-300 font-bold">ELEMENTAL COMPATIBILITY RANKINGS</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-pink-400/50">
                                        <strong className="text-pink-300">ðŸ’¡ Learning Mode:</strong> Scroll through all 36 zodiac positions ranked by elemental compatibility.
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
                                            const rankBadge = cusp.rank === 1 ? 'ðŸ¥‡' : cusp.rank === 2 ? 'ðŸ¥ˆ' : cusp.rank === 3 ? 'ðŸ¥‰' : `#${cusp.rank}`

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
                                                                        {fillsDeficit && <span className="text-[8px]"> âœ“</span>}
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
                                                                    <span>ðŸŽ“</span> WHY THIS SCORE? (Educational Breakdown)
                                                                </div>

                                                                {/* What Works */}
                                                                {(reasons.length > 0 || filledDeficits.length > 0 || hasGoodCommunication) && (
                                                                    <div className="mb-3">
                                                                        <div className="text-[9px] text-green-400 font-medium mb-1">âœ… WHAT WORKS:</div>
                                                                        <div className="space-y-1 pl-2">
                                                                            {filledDeficits.map((d, i) => (
                                                                                <div key={i} className="text-[9px] text-white/70">
                                                                                    â€¢ {ELEMENT_MEANINGS[d.element].icon} <strong className="text-green-300">Fills your {d.element} deficit</strong>:
                                                                                    Partner has {cusp.elements[d.element]}% (strength), you have {userElements[d.element]}% (deficit).
                                                                                    This brings emotional/intellectual balance.
                                                                                </div>
                                                                            ))}
                                                                            {hasGoodCommunication && (
                                                                                <div className="text-[9px] text-white/70">
                                                                                    â€¢ ðŸ’¬ <strong className="text-green-300">Strong Communication Potential</strong>:
                                                                                    Partner's Air+Water = {cusp.partnerAirWater}% enables articulation AND emotional depth.
                                                                                </div>
                                                                            )}
                                                                            {isComplementary && (
                                                                                <div className="text-[9px] text-white/70">
                                                                                    â€¢ ðŸ’Ž <strong className="text-green-300">High Complementarity ({cusp.scores.complement.toFixed(0)}%)</strong>:
                                                                                    Partner's strengths align with your weaknesses = growth potential.
                                                                                </div>
                                                                            )}
                                                                            {reasons.map((r, i) => (
                                                                                <div key={`r-${i}`} className="text-[9px] text-white/70">
                                                                                    â€¢ {r.icon} {r.text}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* What Doesn't Work */}
                                                                {(badReasons.length > 0 || unfilledDeficits.length > 0 || !hasGoodCommunication) && (
                                                                    <div className="mb-2">
                                                                        <div className="text-[9px] text-red-400 font-medium mb-1">âš ï¸ CHALLENGES:</div>
                                                                        <div className="space-y-1 pl-2">
                                                                            {unfilledDeficits.map((d, i) => (
                                                                                <div key={i} className="text-[9px] text-white/60">
                                                                                    â€¢ {ELEMENT_MEANINGS[d.element].icon} <strong className="text-yellow-300">{d.element} deficit unfilled</strong>:
                                                                                    Partner only has {cusp.elements[d.element]}% (not enough to fill your {d.deficit.toFixed(0)}% deficit).
                                                                                </div>
                                                                            ))}
                                                                            {!hasGoodCommunication && (
                                                                                <div className="text-[9px] text-white/60">
                                                                                    â€¢ ðŸ’¬ <strong className="text-yellow-300">Limited Communication Bridge</strong>:
                                                                                    Partner's Air+Water = only {cusp.partnerAirWater}%. May struggle to articulate feelings.
                                                                                </div>
                                                                            )}
                                                                            {badReasons.map((r, i) => (
                                                                                <div key={`b-${i}`} className="text-[9px] text-white/60">
                                                                                    â€¢ âŒ {r}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Learning Insight */}
                                                                <div className="mt-2 p-2 bg-amber-500/10 rounded border border-amber-500/20">
                                                                    <div className="text-[9px] text-amber-300">
                                                                        <strong>ðŸ’¡ KEY INSIGHT:</strong>{' '}
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
                                                                <div className="text-[9px] text-cyan-400 font-medium mb-1">ðŸ“Š SCORE MATH:</div>
                                                                <div className="font-mono text-[9px] text-white/60 space-y-0.5">
                                                                    <div>Overlap {cusp.scores.overlap.toFixed(1)}% Ã— 0.20 = <span className="text-cyan-400">{(cusp.scores.overlap * 0.20).toFixed(1)}</span></div>
                                                                    <div>Complement {cusp.scores.complement.toFixed(1)}% Ã— 0.60 = <span className="text-emerald-400">{(cusp.scores.complement * 0.60).toFixed(1)}</span></div>
                                                                    <div>Communication {cusp.scores.communication.toFixed(1)}% Ã— 0.20 = <span className="text-purple-400">{(cusp.scores.communication * 0.20).toFixed(1)}</span></div>
                                                                    <div className="border-t border-white/10 pt-1 mt-1">
                                                                        Raw: {cusp.scores.rawTotal?.toFixed(1) || '?'}% â†’ Normalized: <span className={`font-bold ${cusp.rating.color}`}>{cusp.scores.total.toFixed(1)}%</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Collapsed hint */}
                                                    {!isSelected && (
                                                        <div className="text-[8px] text-white/30 text-center mt-1">
                                                            Click to see educational breakdown â†’
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Scroll indicator */}
                                    <div className="text-[9px] text-white/40 text-center mt-2">
                                        â†• Scroll to explore all 36 zodiac positions
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setMatchSection(3)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        â† Back
                                    </button>
                                    <button onClick={() => setMatchSection(5)} className="flex-1 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
                                        Next: New Balance â†’
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 5: WHAT WOULD BE THE NEW BALANCE (Venn Diagram) */}
                        {matchSection === 5 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-cyan-900/30 to-slate-900/40 rounded-lg p-3 border border-cyan-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">ðŸ’«</span>
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
                                        <div className="text-[10px] text-white/80 font-bold mb-2">ðŸŽ¯ YOUR COMBINED NEW BALANCE:</div>
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
                                                        {isFilled && <span className="text-[9px] text-green-400">âœ“ FILLED!</span>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="mt-3 p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                        <div className="text-[10px] text-white/80">
                                            <strong className="text-cyan-300">ðŸ’¡ RESULT:</strong> Together you form a more complete elemental system.
                                            {userAnalysis.deficits.length > 0 && ` Your ${userAnalysis.deficits.map(d => d.element).join('+')} deficits are ${selectedCusp.deficitsFilled.filter(d => d.filled).length > 0 ? 'FILLED' : 'partially addressed'} by partner's strengths.`}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setMatchSection(4)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        â† Back
                                    </button>
                                    <button onClick={() => setMatchSection(6)} className="flex-1 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
                                        Next: Will I Flourish? â†’
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECTION 6: WILL I FLOURISH? */}
                        {matchSection === 6 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-green-900/30 to-slate-900/40 rounded-lg p-3 border border-green-500/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg">ðŸŒ±</span>
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
                                                ? 'ðŸ’š YES! Constitutional perfection - you complete each other!'
                                                : selectedCusp.scores.total >= 80
                                                    ? 'ðŸ’š YES - Excellent foundation with strong growth potential!'
                                                    : selectedCusp.scores.total >= 70
                                                        ? 'ðŸ’› Good match - Solid foundation with room to grow.'
                                                        : selectedCusp.scores.total >= 60
                                                            ? 'ðŸ’› MAYBE - Moderate compatibility, requires conscious effort.'
                                                            : 'âŒ CHALLENGING - Significant differences to navigate.'
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
                                        <div className="text-[10px] text-emerald-400 font-bold mb-2">ðŸ’« HOW YOU'LL GROW TOGETHER:</div>
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
                                        <div className="text-[10px] text-yellow-400 font-bold mb-2">âš ï¸ CHALLENGES TO NAVIGATE:</div>
                                        <div className="space-y-1 text-[9px] text-white/70">
                                            {userAnalysis.communicationCapacity < 20 && (
                                                <div className="flex items-start gap-1">
                                                    <span>ðŸ’¬</span>
                                                    <span>Communication Mismatch: Your Air+Water capacity ({(userAnalysis.communicationCapacity * 2).toFixed(0)}%) is lower than partner's ({selectedCusp.partnerAirWater}%). Patience needed.</span>
                                                </div>
                                            )}
                                            {userAnalysis.dominant.value > 40 && (
                                                <div className="flex items-start gap-1">
                                                    <span>ðŸŒ</span>
                                                    <span>Pace Difference: Your {userAnalysis.dominant.element} dominance means you process differently. Establish timing agreements.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
                                        <div className="text-[10px] text-cyan-400 font-bold mb-2">ðŸŒŸ RELATIONSHIP TIMELINE:</div>
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
                                            <strong className="text-pink-300">ðŸ’™ FINAL MESSAGE:</strong> This match offers you the gift of becoming MORE than you are alone.
                                            {userAnalysis.deficits.length > 0 && ` Your ${userAnalysis.deficits.map(d => d.element).join('+')} deficits aren't flaws - they're invitations for growth.`}
                                            {' '}Partner's strengths can fill your gaps IF you embrace the learning. This is constitutional completion.
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setMatchSection(1)} className="w-full py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                    â† Start Over (Section 1)
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
                    { id: 1, name: 'Measure Baseline', icon: 'ðŸŒ¡ï¸', color: 'text-amber-400' },
                    { id: 2, name: 'Identify Deficits', icon: 'ðŸ”', color: 'text-red-400' },
                    { id: 3, name: 'Experiment Balance', icon: 'âš—ï¸', color: 'text-emerald-400' },
                    { id: 4, name: 'Test Cusps', icon: 'ðŸ§²', color: 'text-pink-400' },
                    { id: 5, name: 'Synergy Patterns', icon: 'ðŸŒ€', color: 'text-cyan-400' },
                    { id: 6, name: 'Predict Outcomes', icon: 'ðŸ“ˆ', color: 'text-purple-400' }
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
                                <span className="text-xl">ðŸ”¬</span>
                                <div>
                                    <div className="text-sm text-emerald-300 font-bold">ELEMENT PHYSICS LAB</div>
                                    <div className="text-[10px] text-white/50">Discover Your Constitution Through Experiment</div>
                                </div>
                            </div>
                            <div className="text-[10px] text-white/60 italic bg-slate-900/40 rounded p-2 border-l-2 border-emerald-400/50">
                                ðŸ’¡ <strong>Philosophy:</strong> Don't just read answers - DISCOVER through hands-on experimentation with sliders, scenarios, and predictions!
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
                                    <span className="mr-1">{labStation > s.id ? 'âœ“' : s.icon}</span>
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
                                        <span className="text-lg">ðŸŒ¡ï¸</span>
                                        <div className="text-sm text-amber-300 font-bold">STATION 1: Measure Your Baseline</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-amber-400/50">
                                        <strong className="text-amber-300">ðŸ”¬ EXPERIMENT 1.1:</strong> Observe your natural element distribution. Your task: Identify patterns without judgment.
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
                                                            {isHigh && <span className="ml-1 text-[9px]">â†‘ HIGH</span>}
                                                            {isLow && <span className="ml-1 text-[9px]">â†“ LOW</span>}
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
                                            <div className="text-[10px] text-cyan-400 font-medium mb-2">ðŸ“ OBSERVATION QUESTION 1:</div>
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
                                                            {isSelected && isCorrect && ' âœ“'}
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
                                                        ? `âœ“ Correct! ${labNotebook.q1} is your dominant element at ${userElements[labNotebook.q1].toFixed(0)}%`
                                                        : `âœ— Not quite. Your highest is ${elements.find(e => userElements[e] === Math.max(...Object.values(userElements)))}`
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                            <div className="text-[10px] text-cyan-400 font-medium mb-2">ðŸ“ OBSERVATION QUESTION 2:</div>
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
                                                            {isSelected && isDeficit && ' âœ“'}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                            {labNotebook.q2?.length > 0 && (
                                                <div className="mt-2 text-[10px] p-2 rounded bg-amber-500/10 text-amber-300">
                                                    ðŸ’¡ Deficits are elements below 20%. You identified: {labNotebook.q2.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Experiment Result */}
                                    <div className="mt-3 p-3 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 rounded-lg border border-amber-500/20">
                                        <div className="text-[10px] text-amber-300 font-bold mb-2">ðŸŽ¯ EXPERIMENT 1 RESULT:</div>
                                        <div className="text-[10px] text-white/70 space-y-1">
                                            <div>â€¢ <strong className="text-white/90">Dominant:</strong> {elements.find(e => userElements[e] === Math.max(...Object.values(userElements)))} ({Math.max(...Object.values(userElements)).toFixed(0)}%)</div>
                                            <div>â€¢ <strong className="text-white/90">Deficits:</strong> {userAnalysis.deficits.map(d => `${d.element} (${userElements[d.element].toFixed(0)}%)`).join(', ') || 'None detected'}</div>
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
                                    Continue to Station 2: Identify Deficits â†’
                                </button>
                            </div>
                        )}

                        {/* ========== STATION 2: IDENTIFY YOUR DEFICITS ========== */}
                        {labStation === 2 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-red-900/30 to-slate-900/40 rounded-lg p-3 border border-red-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">ðŸ”</span>
                                        <div className="text-sm text-red-300 font-bold">STATION 2: Identify Your Deficits</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-red-400/50">
                                        <strong className="text-red-300">ðŸ”¬ EXPERIMENT 2.1:</strong> See how your deficits manifest in real scenarios. Your task: Test how you naturally respond.
                                    </div>

                                    {/* Scenario 1: Communication (Air) */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 mb-3 border border-slate-700/50">
                                        <div className="text-[10px] text-cyan-400 font-medium mb-2">ðŸ’¬ SCENARIO 1: Communication Challenge</div>
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
                                                        â—‹ {option.text}
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
                                                        <strong>ðŸ’¡ DISCOVERY:</strong> You naturally avoid verbal explanation!
                                                        {userElements.Air < 20 && (
                                                            <> This is your <strong>AIR DEFICIT ({userElements.Air.toFixed(0)}%)</strong> manifesting.
                                                            With higher Air (30%+), you'd comfortably articulate reasoning.</>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>âœ“ Interesting!</strong> You chose verbal explanation.
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
                                        <div className="text-[10px] text-blue-400 font-medium mb-2">ðŸ’§ SCENARIO 2: Emotional Processing</div>
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
                                                        â—‹ {option.text}
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
                                                        <strong>ðŸ’¡ DISCOVERY:</strong> You jump to ACTION instead of FEELING!
                                                        {userElements.Water < 20 && (
                                                            <> This is your <strong>WATER DEFICIT ({userElements.Water.toFixed(0)}%)</strong> manifesting.
                                                            Emotions feel "impractical" so you solve or avoid.</>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>âœ“ Good awareness!</strong> You chose to feel first.
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
                                        <div className="text-[10px] text-red-300 font-bold mb-2">ðŸ”¬ EXPERIMENT 2 SUMMARY:</div>
                                        <div className="text-[10px] text-white/70 space-y-2">
                                            {userAnalysis.deficits.map(d => (
                                                <div key={d.element} className="p-2 bg-slate-800/50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <span className={elementConfig[d.element].textClass}>{elementConfig[d.element].icon}</span>
                                                        <strong className="text-white/90">{d.element} DEFICIT ({userElements[d.element].toFixed(0)}%)</strong>
                                                    </div>
                                                    <div className="text-[9px] text-white/50 mt-1">
                                                        {d.element === 'Air' && 'â€¢ Struggle with verbal articulation, prefer demonstrating over explaining'}
                                                        {d.element === 'Water' && 'â€¢ Process emotions through action, feelings seem impractical'}
                                                        {d.element === 'Fire' && 'â€¢ Hesitant to take risks, prefer stability over spontaneity'}
                                                        {d.element === 'Earth' && 'â€¢ Struggle with practical details, prefer ideas over execution'}
                                                    </div>
                                                </div>
                                            ))}
                                            {userAnalysis.deficits.length === 0 && (
                                                <div className="text-green-400">âœ“ No significant deficits detected! Your elements are well-balanced.</div>
                                            )}
                                            <div className="mt-2 pt-2 border-t border-white/10">
                                                <strong className="text-emerald-400">Hypothesis Confirmed:</strong> A partner with HIGH {userAnalysis.deficits.map(d => d.element).join(' + ') || 'balanced elements'} would provide what you lack.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setLabStation(1)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        â† Back
                                    </button>
                                    <button onClick={() => setLabStation(3)} className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all">
                                        Continue to Station 3 â†’
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========== STATION 3: EXPERIMENT WITH BALANCE ========== */}
                        {labStation === 3 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-emerald-900/30 to-slate-900/40 rounded-lg p-3 border border-emerald-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">âš—ï¸</span>
                                        <div className="text-sm text-emerald-300 font-bold">STATION 3: Experiment with Balance</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-emerald-400/50">
                                        <strong className="text-emerald-300">ðŸ”¬ EXPERIMENT 3.1:</strong> Adjust partner element sliders and watch compatibility change in real-time!
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
                                        <div className="text-[10px] text-emerald-400 font-medium mb-2">ðŸŽšï¸ PARTNER ELEMENTS (Adjustable):</div>
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
                                        <div className="text-[10px] text-pink-400 font-medium mb-2">ðŸ“Š LIVE COMPATIBILITY:</div>
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
                                                ðŸ’Ž High complementarity! This configuration fills your gaps well.
                                            </div>
                                        )}
                                    </div>

                                    {/* Experiment Challenges */}
                                    <div className="mt-3 space-y-2">
                                        <div className="text-[10px] text-amber-400 font-medium">ðŸŽ¯ EXPERIMENT CHALLENGES:</div>
                                        <div className="text-[9px] text-white/60 space-y-1 p-2 bg-slate-800/50 rounded">
                                            <div>â€¢ Try setting partner Water to 50%+ â†’ Watch complement rise</div>
                                            <div>â€¢ Try setting partner Fire to 60%+ â†’ Watch score drop</div>
                                            <div>â€¢ Find the configuration that gives you the highest score!</div>
                                        </div>
                                    </div>

                                    {/* Discovery Recording */}
                                    <div className="mt-3 p-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg border border-emerald-500/20">
                                        <div className="text-[10px] text-emerald-300 font-bold mb-2">ðŸ”¬ DISCOVERY RECORDED:</div>
                                        <div className="text-[10px] text-white/70">
                                            Current optimal config: Water {labPartnerElements.Water}% + Air {labPartnerElements.Air}% + Earth {labPartnerElements.Earth}% + Fire {labPartnerElements.Fire}%
                                            {labScores.total >= 55 && <span className="text-green-400 ml-1">âœ“ Good match!</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setLabStation(2)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        â† Back
                                    </button>
                                    <button onClick={() => setLabStation(4)} className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all">
                                        Continue to Station 4 â†’
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========== STATION 4: TEST PARTNER COMBINATIONS ========== */}
                        {labStation === 4 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-pink-900/30 to-slate-900/40 rounded-lg p-3 border border-pink-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">ðŸ§²</span>
                                        <div className="text-sm text-pink-300 font-bold">STATION 4: Test Partner Combinations</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-pink-400/50">
                                        <strong className="text-pink-300">ðŸ”¬ EXPERIMENT 4.1:</strong> Test actual zodiac cusps to find best matches. Select cusps and compare results!
                                    </div>

                                    {/* Cusp Selector */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 mb-3">
                                        <div className="text-[10px] text-pink-400 font-medium mb-2">ðŸŽ¯ SELECT A CUSP TO TEST:</div>
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
                                                ðŸŽ² Random Cusp
                                            </button>
                                            <button
                                                onClick={() => setLabSelectedCusp(rankedCusps[0])}
                                                className="flex-1 py-1 text-[10px] bg-green-500/20 border border-green-500/30 rounded text-green-400 hover:bg-green-500/30"
                                            >
                                                ðŸ¥‡ Show Best Match
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
                                                <div className="text-[10px] text-cyan-400 font-medium">ðŸ“Š YOUR TESTED CUSPS:</div>
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
                                                ðŸ’¡ <strong>Notice a pattern?</strong> Top scorers typically have high Water + Air!
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick View: All 36 Ranked */}
                                    <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50 max-h-[200px] overflow-y-auto">
                                        <div className="text-[10px] text-amber-400 font-medium mb-2">ðŸ† ALL 36 CUSPS RANKED:</div>
                                        {rankedCusps.slice(0, 10).map(cusp => (
                                            <div
                                                key={cusp.id}
                                                onClick={() => setLabSelectedCusp(cusp)}
                                                className="flex justify-between items-center py-1 px-2 hover:bg-slate-800/50 rounded cursor-pointer"
                                            >
                                                <span className="text-[9px] text-white/70">
                                                    {cusp.rank <= 3 ? ['ðŸ¥‡', 'ðŸ¥ˆ', 'ðŸ¥‰'][cusp.rank - 1] : `#${cusp.rank}`} {cusp.name}
                                                </span>
                                                <span className={`text-[9px] font-bold ${cusp.rating.color}`}>{cusp.scores.total.toFixed(1)}%</span>
                                            </div>
                                        ))}
                                        <div className="text-[9px] text-white/40 text-center mt-2">...and 26 more</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setLabStation(3)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        â† Back
                                    </button>
                                    <button onClick={() => setLabStation(5)} className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all">
                                        Continue to Station 5 â†’
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========== STATION 5: OBSERVE SYNERGY PATTERNS ========== */}
                        {labStation === 5 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-cyan-900/30 to-slate-900/40 rounded-lg p-3 border border-cyan-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">ðŸŒ€</span>
                                        <div className="text-sm text-cyan-300 font-bold">STATION 5: Observe Synergy Patterns</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-cyan-400/50">
                                        <strong className="text-cyan-300">ðŸ”¬ EXPERIMENT 5.1:</strong> Visualize what happens when your elements combine with a partner. Click elements to see synergy effects!
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
                                                                    <span>{unique.toFixed(0)}% {fillsGap && 'â†'}</span>
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
                                                                <div className="text-[10px] text-cyan-400 font-bold mb-2">ðŸŒŸ YOUR UNIQUE CONTRIBUTION:</div>
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
                                                                <div className="text-[10px] text-pink-400 font-bold mb-2">ðŸ’ WHAT PARTNER BRINGS:</div>
                                                                <div className="text-[9px] text-white/70 space-y-2">
                                                                    {elements.filter(el => partner.elements[el] > userElements[el]).map(el => {
                                                                        const fillsGap = userElements[el] < 20 && partner.elements[el] > 20
                                                                        return (
                                                                            <div key={el} className={`p-2 rounded ${fillsGap ? 'bg-green-500/10 border border-green-500/20' : 'bg-pink-500/10'}`}>
                                                                                <strong className={fillsGap ? 'text-green-400' : elementConfig[el].textClass}>
                                                                                    {elementConfig[el].icon} {el} ({partner.elements[el]}%)
                                                                                    {fillsGap && ' â† FILLS YOUR GAP!'}
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
                                                                <div className="text-[10px] text-purple-400 font-bold mb-2">ðŸ¤ YOUR COMMON GROUND:</div>
                                                                <div className="text-[9px] text-white/70">
                                                                    <p className="mb-2">You share <strong>{partner.scores.overlap.toFixed(0)}%</strong> elemental overlap. This provides:</p>
                                                                    <ul className="space-y-1 pl-2">
                                                                        <li>â€¢ Immediate rapport and understanding</li>
                                                                        <li>â€¢ Shared values and approaches</li>
                                                                        <li>â€¢ Foundation for communication</li>
                                                                    </ul>
                                                                    <p className="mt-2 text-amber-300">
                                                                        ðŸ’¡ Ideal overlap: 40-60%. Too little = hard to connect. Too much = no growth.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Combined Balance */}
                                                <div className="mt-3 p-2 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded border border-white/10">
                                                    <div className="text-[10px] text-white/80 font-medium mb-2">ðŸŽ¯ COMBINED NEW BALANCE:</div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {elements.map(el => {
                                                            const combined = (userElements[el] + partner.elements[el]) / 2
                                                            const improved = userElements[el] < 20 && combined >= 20
                                                            return (
                                                                <div key={el} className="text-center">
                                                                    <div className="text-[10px]">{elementConfig[el].icon}</div>
                                                                    <div className={`text-xs font-bold ${improved ? 'text-green-400' : 'text-white/70'}`}>
                                                                        {combined.toFixed(0)}%
                                                                        {improved && <span className="text-[8px]">âœ“</span>}
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
                                        <div className="text-[10px] text-cyan-300 font-bold mb-2">ðŸŒ€ SYNERGY INSIGHT:</div>
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
                                        â† Back
                                    </button>
                                    <button onClick={() => setLabStation(6)} className="flex-1 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm hover:bg-emerald-500/30 transition-all">
                                        Continue to Station 6 â†’
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========== STATION 6: PREDICT LONG-TERM OUTCOMES ========== */}
                        {labStation === 6 && (
                            <div className="space-y-3">
                                <div className="bg-gradient-to-b from-purple-900/30 to-slate-900/40 rounded-lg p-3 border border-purple-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">ðŸ“ˆ</span>
                                        <div className="text-sm text-purple-300 font-bold">STATION 6: Predict Long-Term Outcomes</div>
                                    </div>
                                    <div className="text-[10px] text-white/60 mb-3 p-2 bg-slate-800/50 rounded border-l-2 border-purple-400/50">
                                        <strong className="text-purple-300">ðŸ”¬ EXPERIMENT 6.1:</strong> Drag the timeline slider to see how your relationship evolves over time!
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
                                        <div className="text-[10px] text-purple-400 font-medium mb-2">â° RELATIONSHIP TIMELINE:</div>
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
                                            ðŸ“… Month {labTimelineMonth}
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
                                                    <div className="text-[10px] text-cyan-400 font-medium mb-2">ðŸ“ˆ YOUR DEVELOPMENT:</div>
                                                    <div className="space-y-1 text-[9px]">
                                                        {userElements.Air < 20 && (
                                                            <div className="flex justify-between">
                                                                <span className="text-white/60">Air:</span>
                                                                <span className="text-green-400">{userElements.Air.toFixed(0)}% â†’ {(userElements.Air + airGrowth).toFixed(0)}% (+{airGrowth.toFixed(0)}%)</span>
                                                            </div>
                                                        )}
                                                        {userElements.Water < 20 && (
                                                            <div className="flex justify-between">
                                                                <span className="text-white/60">Water:</span>
                                                                <span className="text-green-400">{userElements.Water.toFixed(0)}% â†’ {(userElements.Water + waterGrowth).toFixed(0)}% (+{waterGrowth.toFixed(0)}%)</span>
                                                            </div>
                                                        )}
                                                        {userElements.Air >= 20 && userElements.Water >= 20 && (
                                                            <div className="text-white/50">No major deficits to fill - focus on deepening connection</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Relationship Status */}
                                                <div className="bg-slate-800/50 rounded p-2">
                                                    <div className="text-[10px] text-pink-400 font-medium mb-2">ðŸ’• RELATIONSHIP STATUS:</div>
                                                    <div className="flex justify-between items-center text-[9px]">
                                                        <span className="text-white/60">Compatibility:</span>
                                                        <span className="text-pink-400 font-bold">
                                                            {baseCompatibility.toFixed(0)}% â†’ {newCompatibility.toFixed(0)}%
                                                            {growthRate > 0 && <span className="text-green-400"> (+{compatibilityGrowth.toFixed(0)}%)</span>}
                                                            {growthRate < 0 && <span className="text-red-400"> ({compatibilityGrowth.toFixed(0)}%)</span>}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Phase-specific insights */}
                                                <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                                                    <div className="text-[9px] text-purple-300">
                                                        {labTimelineMonth === 0 && 'ðŸŒŸ At month 0, attraction is strong but untested. Communication gaps will soon surface for growth.'}
                                                        {labTimelineMonth === 6 && 'ðŸ“š At month 6, you\'re in the learning phase. Partner is modeling new emotional/communication patterns.'}
                                                        {labTimelineMonth === 12 && 'âš¡ At month 12, significant adjustment has occurred. You\'re starting to internalize partner\'s strengths.'}
                                                        {labTimelineMonth === 18 && 'ðŸŒŠ At month 18, deeper emotional intimacy emerges. Your deficits are noticeably filling.'}
                                                        {labTimelineMonth === 24 && 'ðŸŒ€ At month 24, SYNERGY achieved! You operate as one complementary system. Flow state.'}
                                                        {labTimelineMonth === 36 && 'ðŸ† At month 36, CONSTITUTIONAL COMPLETION! You\'ve become more than you were alone.'}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })()}

                                    {/* Lab Report Summary */}
                                    <div className="mt-3 p-3 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 rounded-lg border border-emerald-500/20">
                                        <div className="text-[10px] text-emerald-300 font-bold mb-2">ðŸ“‹ YOUR LAB REPORT SUMMARY:</div>
                                        <div className="text-[9px] text-white/70 space-y-1">
                                            <div>â€¢ <strong>Experiments Conducted:</strong> 6 stations</div>
                                            <div>â€¢ <strong>Your Constitution:</strong> {elements.find(e => userElements[e] === Math.max(...Object.values(userElements)))}-dominant ({Math.max(...Object.values(userElements)).toFixed(0)}%)</div>
                                            <div>â€¢ <strong>Deficits Identified:</strong> {userAnalysis.deficits.map(d => d.element).join(', ') || 'None'}</div>
                                            <div>â€¢ <strong>Best Match:</strong> {rankedCusps[0]?.name} ({rankedCusps[0]?.scores.total.toFixed(1)}%)</div>
                                            <div>â€¢ <strong>Growth Potential:</strong> Constitutional completion through complementarity</div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-white/10 text-center">
                                            <div className="text-[10px] text-purple-400">ðŸ† CONGRATULATIONS!</div>
                                            <div className="text-[9px] text-white/50">You've completed the Element Physics Lab</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setLabStation(5)} className="flex-1 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white/60 text-sm hover:text-white/80 transition-all">
                                        â† Back
                                    </button>
                                    <button onClick={() => setLabStation(1)} className="flex-1 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 text-sm hover:bg-purple-500/30 transition-all">
                                        â†» Start Over
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