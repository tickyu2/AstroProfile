import React, { useState } from 'react'

export default function BattlePanel({ profile, yinYangData }) {
    const [showDetails, setShowDetails] = useState(false)
    const [expandedBattle, setExpandedBattle] = useState(null)

    if (!yinYangData || !yinYangData.factors) {
        return null
    }

    // Extract factors with their contributions
    const factors = yinYangData.factors || []
    
    // Organize battles by weight
    const ultimateBattle = factors.find(f => f.name === 'Birth Time') || null
    const majorBattles = factors.filter(f => 
        ['Chinese Animal', 'Chinese Element', 'Western Sign', 'Western Element'].includes(f.name)
    )
    const miniBattles = factors.filter(f => 
        ['Birth Day', 'Gender'].includes(f.name)
    )

    // Battle weight reference
    const battleWeights = {
        'Birth Time': 20,
        'Chinese Animal': 15,
        'Chinese Element': 15,
        'Western Sign': 15,
        'Western Element': 15,
        'Birth Day': 10,
        'Gender': 10
    }

    // Get color for battle result
    const getBattleColor = (result) => {
        if (result === 'Yang') return 'from-red-500 to-orange-500'
        if (result === 'Yin') return 'from-blue-500 to-purple-500'
        return 'from-green-500 to-teal-500' // Balanced
    }

    // Get icon for battle type
    const getBattleIcon = (name) => {
        const icons = {
            'Birth Time': 'âŒ›',
            'Chinese Animal': 'ðŸ‰',
            'Chinese Element': 'ðŸŒŠ',
            'Western Sign': 'âœ¨',
            'Western Element': 'ðŸ"¥',
            'Birth Day': 'ðŸ"…',
            'Gender': 'âš§'
        }
        return icons[name] || 'âš"ï¸'
    }

    // Battle card component
    const BattleCard = ({ battle, rank, isExpanded, onToggle }) => {
        const weight = battleWeights[battle.name] || 0
        const icon = getBattleIcon(battle.name)
        const colorClass = getBattleColor(battle.classification)

        return (
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
                    {weight}
                </div>

                {/* Rank Badge */}
                <div className="absolute -top-3 -left-3 bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-amber-400 text-sm border-2 border-amber-500/50">
                    {rank}
                </div>

                {/* Icon */}
                <div className="text-center mb-2">
                    <div className="text-4xl mb-2">{icon}</div>
                    <div className="text-sm font-bold text-amber-400 uppercase tracking-wide">
                        {battle.name}
                    </div>
                </div>

                {/* Result */}
                <div className="text-center mb-3">
                    <div className={`inline-block px-4 py-2 bg-gradient-to-r ${colorClass} text-white font-bold rounded-lg text-lg`}>
                        {battle.classification}
                    </div>
                </div>

                {/* Value */}
                <div className="text-center text-sm text-white/80">
                    Your {battle.name}: <span className="font-semibold text-white">{battle.value}</span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in">
                        <div className="text-xs text-white/70 space-y-2">
                            <div>
                                <span className="text-amber-400 font-semibold">Weight:</span> {weight} points (out of 100)
                            </div>
                            <div>
                                <span className="text-amber-400 font-semibold">Your Value:</span> {battle.value}
                            </div>
                            <div>
                                <span className="text-amber-400 font-semibold">Classification:</span> {battle.classification}
                            </div>
                            <div>
                                <span className="text-amber-400 font-semibold">Contribution:</span> {battle.points} points to your Yin/Yang balance
                            </div>
                            {battle.reason && (
                                <div className="mt-2 p-2 bg-slate-800/50 rounded">
                                    <span className="text-amber-400 font-semibold">Why?</span>
                                    <div className="mt-1">{battle.reason}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="text-center mt-2 text-xs text-white/40">
                    {isExpanded ? 'Click to collapse âŠ' : 'Click for details â–¼'}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 flex items-center gap-2">
                        âš"ï¸ The 7 Battle System
                    </h2>
                    <p className="text-white/60 text-sm mt-1">
                        How 7 cosmic factors "battle" for influence over your Yin/Yang nature
                    </p>
                </div>
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                    {showDetails ? 'Hide Explanation â–¼' : 'Learn More â–¶'}
                </button>
            </div>

            {/* Explanation Section */}
            {showDetails && (
                <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-amber-500/20 animate-fade-in">
                    <div className="text-sm text-white/80 space-y-3">
                        <p>
                            <span className="text-amber-400 font-semibold">The 7 Battle System</span> is an ancient framework 
                            for understanding your constitutional nature. Think of it as 7 different cosmic forces 
                            "battling" for influence over whether you lean more Yin (receptive, inward, cool) or 
                            Yang (active, outward, hot).
                        </p>
                        <p>
                            Each battle has a different <span className="text-amber-400 font-semibold">weight</span> - 
                            representing its importance in shaping your nature:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                            <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                                <div className="text-red-400 font-bold text-center mb-1">âŒ› THE ULTIMATE BATTLE</div>
                                <div className="text-center text-xs text-white/70">Birth Time: 20 points</div>
                                <div className="text-center text-xs text-white/50 mt-1">
                                    When you were born determines your core energy rhythm
                                </div>
                            </div>
                            <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/30">
                                <div className="text-orange-400 font-bold text-center mb-1">âš"ï¸ MAJOR BATTLES</div>
                                <div className="text-center text-xs text-white/70">4 factors Ã— 15 points each</div>
                                <div className="text-center text-xs text-white/50 mt-1">
                                    Chinese & Western astrology elements
                                </div>
                            </div>
                            <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30">
                                <div className="text-yellow-400 font-bold text-center mb-1">ðŸ—¡ï¸ MINI BATTLES</div>
                                <div className="text-center text-xs text-white/70">2 factors Ã— 10 points each</div>
                                <div className="text-center text-xs text-white/50 mt-1">
                                    Birth day & biological gender
                                </div>
                            </div>
                        </div>
                        <p className="text-amber-300 font-semibold">
                            Total: 100 points = Your complete Yin/Yang profile
                        </p>
                        <p className="text-xs text-white/60 italic">
                            Remember: No single battle determines your nature. It's the combination of all 7 
                            that creates your unique constitutional balance.
                        </p>
                    </div>
                </div>
            )}

            {/* THE ULTIMATE BATTLE */}
            {ultimateBattle && (
                <div className="mb-6">
                    <div className="text-center mb-4">
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg uppercase text-sm tracking-wide">
                            âŒ› The Ultimate Battle
                        </div>
                    </div>
                    <BattleCard
                        battle={ultimateBattle}
                        rank="1"
                        isExpanded={expandedBattle === 'ultimate'}
                        onToggle={() => setExpandedBattle(expandedBattle === 'ultimate' ? null : 'ultimate')}
                    />
                </div>
            )}

            {/* MAJOR BATTLES */}
            {majorBattles.length > 0 && (
                <div className="mb-6">
                    <div className="text-center mb-4">
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold rounded-lg uppercase text-sm tracking-wide">
                            âš"ï¸ Major Battles
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {majorBattles.map((battle, index) => (
                            <BattleCard
                                key={battle.name}
                                battle={battle}
                                rank={index + 2}
                                isExpanded={expandedBattle === `major-${index}`}
                                onToggle={() => setExpandedBattle(expandedBattle === `major-${index}` ? null : `major-${index}`)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* MINI BATTLES */}
            {miniBattles.length > 0 && (
                <div>
                    <div className="text-center mb-4">
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-600 to-green-600 text-white font-bold rounded-lg uppercase text-sm tracking-wide">
                            ðŸ—¡ï¸ Mini Battles
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {miniBattles.map((battle, index) => (
                            <BattleCard
                                key={battle.name}
                                battle={battle}
                                rank={majorBattles.length + index + 2}
                                isExpanded={expandedBattle === `mini-${index}`}
                                onToggle={() => setExpandedBattle(expandedBattle === `mini-${index}` ? null : `mini-${index}`)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Final Score */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-600/20 to-purple-600/20 rounded-xl border border-amber-500/30">
                <div className="text-center">
                    <div className="text-sm text-amber-400 font-semibold mb-2">Your Battle Results:</div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-red-400">{yinYangData.yangPoints}</div>
                            <div className="text-xs text-white/60">Yang Points</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-400">{yinYangData.balancedPoints}</div>
                            <div className="text-xs text-white/60">Balanced Points</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-400">{yinYangData.yinPoints}</div>
                            <div className="text-xs text-white/60">Yin Points</div>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                            Overall Balance: {yinYangData.balance}
                        </div>
                    </div>
                </div>
            </div>

            {/* Educational Footer */}
            <div className="mt-4 text-xs text-white/50 text-center italic">
                Click any battle card to see detailed explanation of how it influences your nature
            </div>
        </div>
    )
}
