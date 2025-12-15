import React from 'react'

export default function Big5Panel({ big5, profile }) {
    // If no Big 5 data, show message
    if (!big5 || !big5.provided) {
        return (
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-blue-950/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500">
                <div className="px-6 pt-6 pb-4 border-b border-cyan-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center backdrop-blur-sm border border-cyan-500/30">
                            <span className="text-2xl">🌊</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                                BIG 5 PERSONALITY
                            </h2>
                            <p className="text-xs text-white/40">
                                {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName} • ` : ''}Five-Factor Model
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <span className="text-3xl opacity-30">📊</span>
                    </div>
                    <p className="text-white/60 text-sm mb-2">Big 5 traits not set</p>
                    <p className="text-white/40 text-xs">Edit profile to add your personality spectrum</p>
                </div>
            </div>
        )
    }

    const traits = [
        {
            key: 'openness',
            name: 'Openness',
            icon: '🎨',
            value: big5.openness || 50,
            lowLabel: 'Practical',
            highLabel: 'Creative',
            color: 'from-purple-400 to-pink-400',
            bgGradient: 'from-purple-500/20 to-pink-500/20',
            description: 'Imagination, curiosity, artistic sensitivity'
        },
        {
            key: 'conscientiousness',
            name: 'Conscientiousness',
            icon: '🎯',
            value: big5.conscientiousness || 50,
            lowLabel: 'Spontaneous',
            highLabel: 'Organized',
            color: 'from-blue-400 to-cyan-400',
            bgGradient: 'from-blue-500/20 to-cyan-500/20',
            description: 'Organization, responsibility, self-discipline'
        },
        {
            key: 'extraversion',
            name: 'Extraversion',
            icon: '⚡',
            value: big5.extraversion || 50,
            lowLabel: 'Reserved',
            highLabel: 'Outgoing',
            color: 'from-yellow-400 to-orange-400',
            bgGradient: 'from-yellow-500/20 to-orange-500/20',
            description: 'Social energy, assertiveness, enthusiasm'
        },
        {
            key: 'agreeableness',
            name: 'Agreeableness',
            icon: '❤️',
            value: big5.agreeableness || 50,
            lowLabel: 'Competitive',
            highLabel: 'Cooperative',
            color: 'from-rose-400 to-pink-400',
            bgGradient: 'from-rose-500/20 to-pink-500/20',
            description: 'Compassion, trust, cooperation'
        },
        {
            key: 'neuroticism',
            name: 'Emotional Stability',
            icon: '🧘',
            value: 100 - (big5.neuroticism || 50), // Invert for "stability"
            lowLabel: 'Sensitive',
            highLabel: 'Resilient',
            color: 'from-emerald-400 to-teal-400',
            bgGradient: 'from-emerald-500/20 to-teal-500/20',
            description: 'Emotional resilience, stress management'
        }
    ]

    // Get interpretation
    const getInterpretation = (value) => {
        if (value < 30) return 'Low'
        if (value < 45) return 'Below Average'
        if (value < 55) return 'Average'
        if (value < 70) return 'Above Average'
        return 'High'
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-blue-950/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] group">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Wave decoration - subtle */}
            <div className="absolute top-0 right-0 w-40 h-40 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M 0 50 Q 25 30 50 50 T 100 50" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-cyan-400"/>
                    <path d="M 0 60 Q 25 40 50 60 T 100 60" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-blue-400"/>
                </svg>
            </div>

            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-cyan-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center backdrop-blur-sm border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">🌊</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                                BIG 5 PERSONALITY
                            </h2>
                            <p className="text-xs text-white/40">
                                {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName} • ` : ''}Five-Factor Model
                            </p>
                        </div>
                    </div>
                    
                    {/* OCEAN acronym badge */}
                    <div className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                        <span className="text-xs text-cyan-300 font-bold tracking-widest">O·C·E·A·N</span>
                    </div>
                </div>
            </div>
            
            {/* Content - Five personality dimensions */}
            <div className="relative px-6 py-5 space-y-3">
                {traits.map((trait, index) => (
                    <div key={trait.key} className="relative group/trait">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover/trait:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-cyan-400/30 transition-all duration-300">
                            {/* Trait header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{trait.icon}</span>
                                    <div>
                                        <div className="text-sm font-bold text-white">{trait.name}</div>
                                        <div className="text-[10px] text-white/40">{trait.description}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-black bg-gradient-to-r ${trait.color} bg-clip-text text-transparent`}>
                                        {trait.value}
                                    </div>
                                    <div className="text-[9px] text-white/40 uppercase tracking-wide">
                                        {getInterpretation(trait.value)}
                                    </div>
                                </div>
                            </div>

                            {/* Visual spectrum bar */}
                            <div className="relative">
                                {/* Background track */}
                                <div className="h-3 rounded-full bg-slate-800/50 border border-white/5 overflow-hidden">
                                    {/* Filled portion with gradient */}
                                    <div 
                                        className={`h-full bg-gradient-to-r ${trait.color} transition-all duration-700 ease-out relative`}
                                        style={{ width: `${trait.value}%` }}
                                    >
                                        {/* Animated shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                    </div>
                                </div>
                                
                                {/* Labels */}
                                <div className="flex justify-between mt-1.5 text-[10px]">
                                    <span className="text-white/40">{trait.lowLabel}</span>
                                    <span className="text-white/40">{trait.highLabel}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Info note */}
                <div className="relative mt-4 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-400/5 to-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">💡</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-cyan-200 font-bold mb-1">Personality Spectrum</div>
                            <div className="text-[10px] text-cyan-300/70 leading-relaxed">
                                The Big Five model measures personality across five universal dimensions. Your profile shows where you naturally fall on each spectrum—there are no "good" or "bad" scores.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient */}
            <div className="h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0"></div>
        </div>
    )
}
