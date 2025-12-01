import React, { useState } from 'react'

export default function FourPillarsPanel({ profile, fourPillars }) {
    const [expandedPillar, setExpandedPillar] = useState(null)
    const [showElementBreakdown, setShowElementBreakdown] = useState(false)
    const [showYinYangBreakdown, setShowYinYangBreakdown] = useState(false)

    if (!fourPillars) {
        return null
    }

    const { year, month, day, hour, elementBalance, yinYangBalance } = fourPillars

    // Pillar weights (for educational visualization)
    // Must total exactly 100%
    const weights = {
        day: 70,   // Core soul essence
        hour: 15,  // Private inner nature
        month: 10, // Seasonal constitution
        year: 5    // Ancestral foundation
    }
    // Total: 70 + 15 + 10 + 5 = 100% ✓

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

    // Pillar card component
    const PillarCard = ({ pillar, weight, title, subtitle, isExpanded, onToggle }) => (
        <div 
            className={`
                relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 
                backdrop-blur-lg rounded-xl p-4 border-2 cursor-pointer
                transition-all duration-300 hover:scale-105
                ${isExpanded ? 'border-amber-500 shadow-lg shadow-amber-500/30' : 'border-slate-700/50'}
            `}
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

    return (
        <div className="fade-in delay-3">
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-lg px-6 py-3 border border-purple-500/30">
                    <div className="text-xl text-purple-300 font-bold uppercase tracking-wide flex items-center gap-2 justify-center">
                        ⭐ YOUR COMPLETE SOUL CONSTITUTION ⭐
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                        The Four Pillars of Destiny (四柱命理)
                    </div>
                </div>
            </div>

            {/* Concentric Circles Visualization */}
            <div className="mb-6 bg-gradient-to-br from-slate-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 relative overflow-hidden">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                
                <div className="relative">
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-white mb-2">Constitutional Hierarchy</h3>
                        <p className="text-sm text-white/70">Circle size = Influence strength</p>
                    </div>

                    {/* Concentric Circles */}
                    <div className="flex items-center justify-center relative" style={{height: '400px'}}>
                        {/* Year Pillar - Outermost (5%) */}
                        <div 
                            className="absolute rounded-full border-4 border-amber-500/30 flex items-center justify-center cursor-pointer hover:border-amber-500/60 transition-all"
                            style={{width: '360px', height: '360px'}}
                            onClick={() => setExpandedPillar(expandedPillar === 'year' ? null : 'year')}
                        >
                            <div className="absolute -top-8 text-center">
                                <div className="text-xs text-amber-400 font-bold">YEAR (5%)</div>
                                <div className="text-lg">{getAnimalEmoji(year.branch.animal)}</div>
                                <div className="text-xs text-white/70">{year.stem.name} {year.branch.animal}</div>
                            </div>
                        </div>

                        {/* Month Pillar - Mid (10%) */}
                        <div 
                            className="absolute rounded-full border-4 border-blue-500/40 flex items-center justify-center cursor-pointer hover:border-blue-500/70 transition-all"
                            style={{width: '280px', height: '280px'}}
                            onClick={() => setExpandedPillar(expandedPillar === 'month' ? null : 'month')}
                        >
                            <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-center">
                                <div className="text-xs text-blue-400 font-bold">MONTH (10%)</div>
                                <div className="text-xl">{getAnimalEmoji(month.branch.animal)}</div>
                                <div className="text-xs text-white/70">{month.stem.name} {month.branch.animal}</div>
                            </div>
                        </div>

                        {/* Hour Pillar - Inner (20%) */}
                        <div 
                            className="absolute rounded-full border-4 border-green-500/50 flex items-center justify-center cursor-pointer hover:border-green-500/80 transition-all"
                            style={{width: '200px', height: '200px'}}
                            onClick={() => setExpandedPillar(expandedPillar === 'hour' ? null : 'hour')}
                        >
                            <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-center">
                                <div className="text-xs text-green-400 font-bold">HOUR (20%)</div>
                                <div className="text-xl">{getAnimalEmoji(hour.branch.animal)}</div>
                                <div className="text-xs text-white/70">{hour.stem.name} {hour.branch.animal}</div>
                            </div>
                        </div>

                        {/* Day Pillar - Center (70%) - CORE SOUL */}
                        <div 
                            className="absolute rounded-full border-4 border-purple-500 bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-lg flex items-center justify-center cursor-pointer hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
                            style={{width: '120px', height: '120px'}}
                            onClick={() => setExpandedPillar(expandedPillar === 'day' ? null : 'day')}
                        >
                            <div className="text-center">
                                <div className="text-xs text-purple-300 font-bold uppercase">Core</div>
                                <div className="text-3xl mb-1">{getAnimalEmoji(day.branch.animal)}</div>
                                <div className="text-xs text-white font-bold">{day.stem.name}</div>
                                <div className="text-xs text-white">{day.branch.animal}</div>
                                <div className="text-xs text-purple-300 font-bold mt-1">70%</div>
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
                    isExpanded={expandedPillar === 'day'}
                    onToggle={() => setExpandedPillar(expandedPillar === 'day' ? null : 'day')}
                />
                <PillarCard
                    pillar={hour}
                    weight={weights.hour}
                    title="Hour Pillar (时柱)"
                    subtitle="Your Private Inner Nature"
                    isExpanded={expandedPillar === 'hour'}
                    onToggle={() => setExpandedPillar(expandedPillar === 'hour' ? null : 'hour')}
                />
                <PillarCard
                    pillar={month}
                    weight={weights.month}
                    title="Month Pillar (月柱)"
                    subtitle="Your Seasonal Constitution"
                    isExpanded={expandedPillar === 'month'}
                    onToggle={() => setExpandedPillar(expandedPillar === 'month' ? null : 'month')}
                />
                <PillarCard
                    pillar={year}
                    weight={weights.year}
                    title="Year Pillar (年柱)"
                    subtitle="Your Ancestral Foundation"
                    isExpanded={expandedPillar === 'year'}
                    onToggle={() => setExpandedPillar(expandedPillar === 'year' ? null : 'year')}
                />
            </div>

            {/* Element Balance Chart */}
            <div className="mb-6 bg-gradient-to-br from-slate-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
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
    )
}
