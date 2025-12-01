import React, { useState } from 'react'

export default function FourPillarsPanel({ profile, fourPillars }) {
    const [expandedPillar, setExpandedPillar] = useState(null)
    const [showElementBreakdown, setShowElementBreakdown] = useState(false)
    const [showYinYangBreakdown, setShowYinYangBreakdown] = useState(false)

    if (!fourPillars) {
        return null
    }

    const { year, month, day, hour, elementBalance: rawElementBalance, yinYangBalance } = fourPillars

    // ========================================
    // NORMALIZE ELEMENT BALANCE TO 100%
    // ========================================
    // Convert raw counts to percentages that total exactly 100%
    const normalizeElementBalance = (rawElements) => {
        // Calculate total
        const total = Object.values(rawElements).reduce((sum, count) => sum + count, 0)
        
        if (total === 0) {
            return { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 }
        }
        
        // Convert to percentages (with rounding)
        const percentages = {}
        let percentTotal = 0
        const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
        
        elements.forEach(element => {
            percentages[element] = Math.round((rawElements[element] / total) * 100)
            percentTotal += percentages[element]
        })
        
        // Adjust for rounding errors (distribute difference to largest element)
        if (percentTotal !== 100) {
            const diff = 100 - percentTotal
            const largestElement = elements.reduce((a, b) => 
                rawElements[a] > rawElements[b] ? a : b
            )
            percentages[largestElement] += diff
        }
        
        return percentages
    }

    const elementBalance = normalizeElementBalance(rawElementBalance)

    // Pillar weights (for educational visualization)
    // Must total exactly 100%
    const weights = {
        day: 70,   // Core soul essence
        hour: 15,  // Private inner nature
        month: 10, // Seasonal constitution
        year: 5    // Ancestral foundation
    }
    // Total: 70 + 15 + 10 + 5 = 100% ✓

    // Circle sizes - CALCULATED FROM AREA (π r²)
    // Each circle's area represents its cumulative percentage of total influence
    // Formula: radius = √(percentage) × outerRadius
    const outerRadius = 170  // Total radius in pixels
    const circleSizes = {
        // Year = 100% of area (outermost) = full circle
        year: outerRadius * 2,  // 340px diameter
        
        // Month = 95% of area (Year 5% + Month 10% + Hour 15% + Core 70%)
        month: Math.sqrt(0.95) * outerRadius * 2,  // 332px diameter
        
        // Hour = 85% of area (Hour 15% + Core 70%)
        hour: Math.sqrt(0.85) * outerRadius * 2,  // 313px diameter
        
        // Core = 70% of area (most important!)
        day: Math.sqrt(0.70) * outerRadius * 2   // 284px diameter
    }
    // Now the VISUAL AREA matches the IMPORTANCE percentages! 🎯

    // Get animal emoji
    const getAnimalEmoji = (animal) => {
        const emojiMap = {
            'Rat': '🐀', 'Ox': '🐂', 'Tiger': '🐅', 'Rabbit': '🐰',
            'Dragon': '🐉', 'Snake': '🐍', 'Horse': '🐴', 'Goat': '🐐',
            'Monkey': '🐒', 'Rooster': '🐓', 'Dog': '🐕', 'Pig': '🐖'
        }
        return emojiMap[animal] || '⭐'
    }

    // Element colors
    const elementColors = {
        Wood: 'from-green-500 to-emerald-600',
        Fire: 'from-red-500 to-orange-600',
        Earth: 'from-yellow-600 to-amber-700',
        Metal: 'from-gray-400 to-slate-500',
        Water: 'from-blue-500 to-cyan-600'
    }

    // Pillar card component with SYNCHRONIZED animation matching its ring!
    const PillarCard = ({ pillar, weight, title, subtitle, pillarType, isExpanded, onToggle }) => {
        // Map pillar type to animation name and GOLDEN RATIO frequency!
        const animationMap = {
            'day': { animation: 'pulse-day-card', duration: '2.5s' },      // Syncs with Core ring! (Base)
            'hour': { animation: 'pulse-hour-card', duration: '3.09s' },   // Syncs with Hour ring! (Golden ratio)
            'month': { animation: 'pulse-month-card', duration: '3.82s' }, // Syncs with Month ring! (Golden ratio)
            'year': { animation: 'pulse-year-card', duration: '4.72s' }    // Syncs with Year ring! (Golden ratio)
        }
        
        const { animation, duration } = animationMap[pillarType] || animationMap['day']
        
        return (
            <div 
                className={`
                    relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 
                    backdrop-blur-lg rounded-xl p-4 border-2 cursor-pointer
                    transition-all duration-300 hover:scale-105
                    ${isExpanded ? 'border-amber-500 shadow-lg shadow-amber-500/30' : 'border-slate-700/50'}
                `}
                style={{
                    animation: `${animation} ${duration} ease-in-out infinite`
                }}
                onClick={onToggle}
            >
            {/* Weight Badge */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full w-12 h-12 flex items-center justify-center font-bold text-white shadow-lg">
                {weight}%
            </div>

            {/* Title */}
            <div className="mb-3">
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wide">{title}</div>
                <div className="text-[10px] text-white/60">{subtitle}</div>
            </div>

            {/* Main Content */}
            <div className="flex items-center gap-3 mb-2">
                <div className="text-4xl">{getAnimalEmoji(pillar.branch.animal)}</div>
                <div>
                    <div className="text-lg font-bold text-white">
                        {pillar.stem.name} {pillar.branch.animal}
                    </div>
                    <div className="text-sm text-white/70">
                        {pillar.stem.chinese}{pillar.branch.chinese}
                    </div>
                </div>
            </div>

            {/* Element Badges */}
            <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 bg-gradient-to-r ${elementColors[pillar.stem.element]} text-white rounded-full font-semibold`}>
                    {pillar.stem.element}
                </span>
                <span className={`text-xs px-2 py-1 ${pillar.stem.polarity === 'Yang' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white rounded-full font-semibold`}>
                    {pillar.stem.polarity}
                </span>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in">
                    <div className="text-xs text-white/80 space-y-2">
                        <div>
                            <span className="text-amber-400 font-semibold">Stem:</span> {pillar.stem.name} ({pillar.stem.chinese})
                        </div>
                        <div>
                            <span className="text-amber-400 font-semibold">Branch:</span> {pillar.branch.animal} ({pillar.branch.chinese})
                        </div>
                        <div>
                            <span className="text-amber-400 font-semibold">Elements:</span> {pillar.stem.element} (stem) + {pillar.branch.element} (branch)
                        </div>
                        <div className="text-[10px] text-white/60 mt-2">
                            Click to learn more about this pillar's significance
                        </div>
                    </div>
                </div>
            )}

            {/* Expand Indicator */}
            <div className="absolute bottom-2 right-2 text-xs text-amber-400">
                {isExpanded ? '▼' : '▶'}
            </div>
        </div>
        )
    }

    return (
        <>
            {/* Harmonic Resonance Pulsing Animations - Each ring pulses at its own frequency */}
            <style>{`
                @keyframes pulse-container {
                    0%, 100% { 
                        border-color: rgba(168, 85, 247, 0.3);
                        box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
                    }
                    50% { 
                        border-color: rgba(168, 85, 247, 0.6);
                        box-shadow: 0 0 40px rgba(168, 85, 247, 0.4);
                    }
                }
                
                /* SYNCHRONICITY PRINCIPLE: Each pillar card pulses at same frequency as its ring! */
                
                /* DAY PILLAR CARD - Syncs with Day/Core ring (2.5s, PURPLE) */
                @keyframes pulse-day-card {
                    0%, 100% { 
                        border-color: rgba(168, 85, 247, 0.4);
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    50% { 
                        border-color: rgba(168, 85, 247, 0.9);
                        box-shadow: 0 10px 30px rgba(168, 85, 247, 0.4), 
                                    0 0 25px rgba(168, 85, 247, 0.3);
                    }
                }
                
                /* HOUR PILLAR CARD - Syncs with Hour ring (3.0s, GREEN) */
                @keyframes pulse-hour-card {
                    0%, 100% { 
                        border-color: rgba(34, 197, 94, 0.4);
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    50% { 
                        border-color: rgba(34, 197, 94, 0.9);
                        box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4), 
                                    0 0 25px rgba(34, 197, 94, 0.3);
                    }
                }
                
                /* MONTH PILLAR CARD - Syncs with Month ring (3.5s, BLUE) */
                @keyframes pulse-month-card {
                    0%, 100% { 
                        border-color: rgba(59, 130, 246, 0.4);
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    50% { 
                        border-color: rgba(59, 130, 246, 0.9);
                        box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4), 
                                    0 0 25px rgba(59, 130, 246, 0.3);
                    }
                }
                
                /* YEAR PILLAR CARD - Syncs with Year ring (4.0s, YELLOW) */
                @keyframes pulse-year-card {
                    0%, 100% { 
                        border-color: rgba(251, 191, 36, 0.4);
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    50% { 
                        border-color: rgba(251, 191, 36, 0.9);
                        box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4), 
                                    0 0 25px rgba(251, 191, 36, 0.3);
                    }
                }
                
                @keyframes pulse-elements {
                    0%, 100% { 
                        border-color: rgba(59, 130, 246, 0.3);
                        box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
                    }
                    50% { 
                        border-color: rgba(59, 130, 246, 0.6);
                        box-shadow: 0 0 40px rgba(59, 130, 246, 0.4);
                    }
                }
                
                @keyframes pulse-year {
                    0%, 100% { 
                        opacity: 0.8;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scale(1.005);
                    }
                }
                
                @keyframes pulse-month {
                    0%, 100% { 
                        opacity: 0.8;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scale(1.008);
                    }
                }
                
                @keyframes pulse-hour {
                    0%, 100% { 
                        opacity: 0.8;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scale(1.01);
                    }
                }
                
                @keyframes pulse-core {
                    0%, 100% { 
                        opacity: 0.9;
                        transform: scale(1);
                        box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
                    }
                    50% { 
                        opacity: 1;
                        transform: scale(1.015);
                        box-shadow: 0 0 40px rgba(168, 85, 247, 0.6);
                    }
                }
                
                /* LEGEND LINE PULSING - Each line pulses at its pillar's frequency! */
                @keyframes pulse-legend-day {
                    0%, 100% { 
                        opacity: 0.8;
                        transform: scaleX(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scaleX(1.1);
                    }
                }
                
                @keyframes pulse-legend-hour {
                    0%, 100% { 
                        opacity: 0.8;
                        transform: scaleX(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scaleX(1.1);
                    }
                }
                
                @keyframes pulse-legend-month {
                    0%, 100% { 
                        opacity: 0.8;
                        transform: scaleX(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scaleX(1.1);
                    }
                }
                
                @keyframes pulse-legend-year {
                    0%, 100% { 
                        opacity: 0.8;
                        transform: scaleX(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scaleX(1.1);
                    }
                }
            `}</style>
        <div className="fade-in delay-3">
            {/* Header - PULSING! */}
            <div className="mb-6 text-center">
                <div className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-lg px-6 py-3 border border-purple-500/30"
                     style={{
                         animation: 'pulse-container 6s ease-in-out infinite'
                     }}>
                    <div className="text-xl text-purple-300 font-bold uppercase tracking-wide flex items-center gap-2 justify-center">
                        ⭐ YOUR COSMIC BLUEPRINT ⭐
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                        What Makes You, You
                    </div>
                </div>
            </div>

            {/* Concentric Circles Visualization */}
            <div className="mb-6 bg-gradient-to-br from-slate-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 relative overflow-hidden"
                 style={{
                     animation: 'pulse-container 6s ease-in-out infinite'
                 }}>
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                
                <div className="relative">
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-white mb-2">What Shapes You</h3>
                        <p className="text-sm text-white/70">Circle size = How much it influences you (π r²)</p>
                    </div>

                    {/* Concentric Circles - area-based sizing */}
                    <div className="flex items-center justify-center relative py-12" style={{height: '450px'}}>
                        {/* Year Pillar - Outermost (5%) - PULSING ANIMATION - GOLDEN RATIO! */}
                        <div 
                            className="absolute rounded-full border-[3px] border-amber-400/80 bg-amber-400/10 flex items-center justify-center cursor-pointer hover:border-amber-300 hover:bg-amber-400/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all animate-pulse-slow"
                            style={{
                                width: `${circleSizes.year}px`,
                                height: `${circleSizes.year}px`,
                                zIndex: 1,
                                animation: 'pulse-year 4.72s ease-in-out infinite'
                            }}
                            onClick={() => setExpandedPillar(expandedPillar === 'year' ? null : 'year')}
                        >
                        </div>

                        {/* Month Pillar - Mid (10%) - PULSING ANIMATION - GOLDEN RATIO! */}
                        <div 
                            className="absolute rounded-full border-[3px] border-blue-400/80 bg-blue-400/10 flex items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-400/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                            style={{
                                width: `${circleSizes.month}px`,
                                height: `${circleSizes.month}px`,
                                zIndex: 2,
                                animation: 'pulse-month 3.82s ease-in-out infinite'
                            }}
                            onClick={() => setExpandedPillar(expandedPillar === 'month' ? null : 'month')}
                        >
                        </div>

                        {/* Hour Pillar - Inner (15%) - PULSING ANIMATION - GOLDEN RATIO! */}
                        <div 
                            className="absolute rounded-full border-[3px] border-green-400/80 bg-green-400/10 flex items-center justify-center cursor-pointer hover:border-green-300 hover:bg-green-400/20 hover:shadow-lg hover:shadow-green-500/30 transition-all"
                            style={{
                                width: `${circleSizes.hour}px`,
                                height: `${circleSizes.hour}px`,
                                zIndex: 3,
                                animation: 'pulse-hour 3.09s ease-in-out infinite'
                            }}
                            onClick={() => setExpandedPillar(expandedPillar === 'hour' ? null : 'hour')}
                        >
                        </div>

                        {/* Day Pillar - Center (70% of AREA) - CORE SOUL - PULSING ANIMATION */}
                        <div 
                            className="absolute rounded-full border-[5px] border-purple-400 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center cursor-pointer hover:border-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:shadow-2xl hover:shadow-purple-500/50 transition-colors"
                            style={{
                                width: `${circleSizes.day}px`,
                                height: `${circleSizes.day}px`,
                                zIndex: 4,
                                animation: 'pulse-core 2.5s ease-in-out infinite'
                            }}
                            onClick={() => setExpandedPillar(expandedPillar === 'day' ? null : 'day')}
                        >
                            <div className="text-center px-6">
                                <div className="text-xs text-purple-300 font-bold uppercase mb-1">Day Pillar</div>
                                <div className="text-4xl mb-2">{getAnimalEmoji(day.branch.animal)}</div>
                                <div className="text-sm text-white font-bold mb-1">{day.stem.name} {day.branch.animal}</div>
                                <div className="text-xs text-purple-300 font-bold mb-2">70%</div>
                                <div className="text-xs text-white/80 leading-relaxed border-t border-purple-400/30 pt-2">
                                    This is your core essence - who you really are deep inside. It shapes 70% of your personality!
                                </div>
                            </div>
                        </div>

                        {/* EXTERNAL LABELS REMOVED - TOO CLUTTERED */}
                        {/* Information now in the ranked list instead */}

                        {/* RANKED PILLAR LIST - CENTERED LEFT - Each line pulses at its frequency! */}
                        <div className="absolute top-1/2 left-0 transform -translate-x-4 -translate-y-1/2 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-white/10 z-10" style={{minWidth: '280px'}}>
                            <div className="text-xs text-white/70 font-bold uppercase mb-3 text-center">What Makes You, You</div>
                            
                            {/* Day Pillar - 70% - Most Important - PULSING LINE! */}
                            <div className="mb-3 pb-3 border-b border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-12 h-1 bg-purple-400 rounded" 
                                         style={{
                                             animation: 'pulse-legend-day 2.5s ease-in-out infinite'
                                         }}></div>
                                    <div className="text-sm text-purple-400 font-bold">Day Pillar</div>
                                    <div className="text-sm text-purple-400 font-bold">70%</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl">{getAnimalEmoji(day.branch.animal)}</div>
                                    <div>
                                        <div className="text-xs text-white font-semibold">{day.stem.name} {day.branch.animal}</div>
                                        <div className="text-xs text-white/60">Your core soul essence</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hour Pillar - 15% - PULSING LINE! */}
                            <div className="mb-3 pb-3 border-b border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-10 h-1 bg-green-400 rounded"
                                         style={{
                                             animation: 'pulse-legend-hour 3.09s ease-in-out infinite'
                                         }}></div>
                                    <div className="text-sm text-green-400 font-bold">Hour Pillar</div>
                                    <div className="text-sm text-green-400 font-bold">15%</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xl">{getAnimalEmoji(hour.branch.animal)}</div>
                                    <div>
                                        <div className="text-xs text-white font-semibold">{hour.stem.name} {hour.branch.animal}</div>
                                        <div className="text-xs text-white/60">Your private inner nature</div>
                                    </div>
                                </div>
                            </div>

                            {/* Month Pillar - 10% - PULSING LINE! */}
                            <div className="mb-3 pb-3 border-b border-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-1 bg-blue-400 rounded"
                                         style={{
                                             animation: 'pulse-legend-month 3.82s ease-in-out infinite'
                                         }}></div>
                                    <div className="text-sm text-blue-400 font-bold">Month Pillar</div>
                                    <div className="text-sm text-blue-400 font-bold">10%</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xl">{getAnimalEmoji(month.branch.animal)}</div>
                                    <div>
                                        <div className="text-xs text-white font-semibold">{month.stem.name} {month.branch.animal}</div>
                                        <div className="text-xs text-white/60">Your seasonal influence</div>
                                    </div>
                                </div>
                            </div>

                            {/* Year Pillar - 5% - PULSING LINE! */}
                            <div className="mb-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-1 bg-amber-400 rounded"
                                         style={{
                                             animation: 'pulse-legend-year 4.72s ease-in-out infinite'
                                         }}></div>
                                    <div className="text-sm text-amber-400 font-bold">Year Pillar</div>
                                    <div className="text-sm text-amber-400 font-bold">5%</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xl">{getAnimalEmoji(year.branch.animal)}</div>
                                    <div>
                                        <div className="text-xs text-white font-semibold">{year.stem.name} {year.branch.animal}</div>
                                        <div className="text-xs text-white/60">Your ancestral foundation</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="text-center mt-6 text-xs text-white/60">
                        Click any circle to focus on that pillar
                    </div>
                </div>
            </div>

            {/* Four Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <PillarCard
                    pillar={day}
                    weight={weights.day}
                    title="Day Pillar (日柱)"
                    subtitle="Your Core Soul Essence"
                    pillarType="day"
                    isExpanded={expandedPillar === 'day'}
                    onToggle={() => setExpandedPillar(expandedPillar === 'day' ? null : 'day')}
                />
                <PillarCard
                    pillar={hour}
                    weight={weights.hour}
                    title="Hour Pillar (时柱)"
                    subtitle="Your Private Inner Nature"
                    pillarType="hour"
                    isExpanded={expandedPillar === 'hour'}
                    onToggle={() => setExpandedPillar(expandedPillar === 'hour' ? null : 'hour')}
                />
                <PillarCard
                    pillar={month}
                    weight={weights.month}
                    title="Month Pillar (月柱)"
                    subtitle="Your Seasonal Constitution"
                    pillarType="month"
                    isExpanded={expandedPillar === 'month'}
                    onToggle={() => setExpandedPillar(expandedPillar === 'month' ? null : 'month')}
                />
                <PillarCard
                    pillar={year}
                    weight={weights.year}
                    title="Year Pillar (年柱)"
                    subtitle="Your Ancestral Foundation"
                    pillarType="year"
                    isExpanded={expandedPillar === 'year'}
                    onToggle={() => setExpandedPillar(expandedPillar === 'year' ? null : 'year')}
                />
            </div>

            {/* Element Balance Chart */}
            <div className="mb-6 bg-gradient-to-br from-slate-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30"
                 style={{
                     animation: 'pulse-elements 5.5s ease-in-out infinite'
                 }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">🌟 Five Elements Balance</h3>
                    <button
                        onClick={() => setShowElementBreakdown(!showElementBreakdown)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        {showElementBreakdown ? 'Hide Details ▼' : 'Show Details ▶'}
                    </button>
                </div>

                <div className="space-y-3">
                    {Object.entries(elementBalance).map(([element, percent]) => (
                        <div key={element}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-white">{element}</span>
                                <span className="text-sm text-amber-400 font-bold">{percent}%</span>
                            </div>
                            <div className="h-6 bg-slate-800/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${elementColors[element]} transition-all duration-1000 flex items-center justify-end pr-2`}
                                    style={{width: `${percent}%`}}
                                >
                                    {percent > 0 && (
                                        <span className="text-xs text-white font-bold drop-shadow-lg">
                                            {percent}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showElementBreakdown && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 text-xs text-white/80 space-y-2 animate-fade-in">
                        <div><span className="text-green-400">Wood:</span> Growth, expansion, flexibility</div>
                        <div><span className="text-red-400">Fire:</span> Transformation, passion, visibility</div>
                        <div><span className="text-yellow-400">Earth:</span> Stability, grounding, nurturing</div>
                        <div><span className="text-gray-400">Metal:</span> Structure, precision, boundaries</div>
                        <div><span className="text-blue-400">Water:</span> Flow, wisdom, adaptability</div>
                    </div>
                )}
            </div>

            {/* Yin/Yang Balance */}
            <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">☯️ Yin/Yang Balance</h3>
                    <button
                        onClick={() => setShowYinYangBreakdown(!showYinYangBreakdown)}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        {showYinYangBreakdown ? 'Hide Details ▼' : 'Show Details ▶'}
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-l-full flex items-center justify-start pl-4" style={{width: `${yinYangBalance.yang}%`}}>
                        <span className="text-sm text-white font-bold drop-shadow-lg">Yang {yinYangBalance.yang}%</span>
                    </div>
                    <div className="flex-1 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-r-full flex items-center justify-end pr-4" style={{width: `${yinYangBalance.yin}%`}}>
                        <span className="text-sm text-white font-bold drop-shadow-lg">Yin {yinYangBalance.yin}%</span>
                    </div>
                </div>

                {showYinYangBreakdown && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 text-xs text-white/80 space-y-2 animate-fade-in">
                        <div><span className="text-orange-400">Yang Energy:</span> Active, logical, assertive, external, masculine principle</div>
                        <div><span className="text-blue-400">Yin Energy:</span> Receptive, intuitive, nurturing, internal, feminine principle</div>
                        <div className="text-white/60 mt-2">
                            Balance = {yinYangBalance.yang > 60 ? 'Yang-dominant (action-oriented)' : yinYangBalance.yin > 60 ? 'Yin-dominant (reflective)' : 'Harmoniously balanced'}
                        </div>
                    </div>
                )}
            </div>

            {/* Educational Footer */}
            <div className="mt-6 bg-gradient-to-r from-amber-600/10 to-yellow-600/10 backdrop-blur-lg rounded-xl p-4 border border-amber-500/20">
                <div className="text-sm text-white/80">
                    <div className="font-semibold text-amber-400 mb-2">Understanding Your Four Pillars:</div>
                    <div className="text-xs space-y-1 text-white/70">
                        <div>• <span className="text-purple-400">Day Pillar (70%)</span> - Your core identity, how you see yourself</div>
                        <div>• <span className="text-green-400">Hour Pillar (15%)</span> - Your private nature, inner world</div>
                        <div>• <span className="text-blue-400">Month Pillar (10%)</span> - Your relational style, how you connect</div>
                        <div>• <span className="text-amber-400">Year Pillar (5%)</span> - Your ancestral energy, family influence</div>
                        <div className="mt-2 text-amber-300 font-semibold">Total: 100% of your soul constitution ✓</div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
