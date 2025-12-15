import React from 'react'

export default function MBTIPanel({ mbti, profile }) {
    // If no MBTI data, show message
    if (!mbti) {
        return (
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-pink-950/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500">
                <div className="px-6 pt-6 pb-4 border-b border-purple-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-600/20 flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                            <span className="text-2xl">🧠</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                                MBTI PERSONALITY
                            </h2>
                            <p className="text-xs text-white/40">
                                {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName} • ` : ''}Myers-Briggs Type
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <span className="text-3xl opacity-30">🧩</span>
                    </div>
                    <p className="text-white/60 text-sm mb-2">MBTI type not set</p>
                    <p className="text-white/40 text-xs">Edit profile to add your personality type</p>
                </div>
            </div>
        )
    }

    // MBTI type descriptions
    const mbtiDescriptions = {
        'INTJ': {
            name: 'The Architect',
            description: 'Strategic visionary with analytical mind',
            traits: ['Strategic', 'Analytical', 'Independent', 'Determined'],
            cognitive: 'Ni-Te-Fi-Se',
            color: 'from-purple-400 to-indigo-400'
        },
        'INTP': {
            name: 'The Logician',
            description: 'Philosophical thinker and innovator',
            traits: ['Logical', 'Curious', 'Objective', 'Innovative'],
            cognitive: 'Ti-Ne-Si-Fe',
            color: 'from-cyan-400 to-blue-400'
        },
        'ENTJ': {
            name: 'The Commander',
            description: 'Bold strategic leader',
            traits: ['Decisive', 'Confident', 'Strategic', 'Ambitious'],
            cognitive: 'Te-Ni-Se-Fi',
            color: 'from-red-400 to-orange-400'
        },
        'ENTP': {
            name: 'The Debater',
            description: 'Clever innovator and challenger',
            traits: ['Inventive', 'Energetic', 'Clever', 'Quick'],
            cognitive: 'Ne-Ti-Fe-Si',
            color: 'from-yellow-400 to-amber-400'
        },
        'INFJ': {
            name: 'The Advocate',
            description: 'Insightful idealist',
            traits: ['Insightful', 'Principled', 'Compassionate', 'Creative'],
            cognitive: 'Ni-Fe-Ti-Se',
            color: 'from-teal-400 to-emerald-400'
        },
        'INFP': {
            name: 'The Mediator',
            description: 'Poetic healer and idealist',
            traits: ['Idealistic', 'Empathetic', 'Creative', 'Authentic'],
            cognitive: 'Fi-Ne-Si-Te',
            color: 'from-pink-400 to-rose-400'
        },
        'ENFJ': {
            name: 'The Protagonist',
            description: 'Inspiring charismatic leader',
            traits: ['Charismatic', 'Inspiring', 'Altruistic', 'Natural leader'],
            cognitive: 'Fe-Ni-Se-Ti',
            color: 'from-green-400 to-lime-400'
        },
        'ENFP': {
            name: 'The Campaigner',
            description: 'Creative free spirit',
            traits: ['Enthusiastic', 'Creative', 'Sociable', 'Free-spirited'],
            cognitive: 'Ne-Fi-Te-Si',
            color: 'from-orange-400 to-yellow-400'
        },
        'ISTJ': {
            name: 'The Logistician',
            description: 'Practical and reliable organizer',
            traits: ['Responsible', 'Organized', 'Practical', 'Loyal'],
            cognitive: 'Si-Te-Fi-Ne',
            color: 'from-slate-400 to-gray-400'
        },
        'ISFJ': {
            name: 'The Defender',
            description: 'Warm protective supporter',
            traits: ['Supportive', 'Reliable', 'Patient', 'Dedicated'],
            cognitive: 'Si-Fe-Ti-Ne',
            color: 'from-blue-400 to-cyan-400'
        },
        'ESTJ': {
            name: 'The Executive',
            description: 'Organized efficient manager',
            traits: ['Organized', 'Practical', 'Direct', 'Traditional'],
            cognitive: 'Te-Si-Ne-Fi',
            color: 'from-amber-400 to-orange-400'
        },
        'ESFJ': {
            name: 'The Consul',
            description: 'Social harmonizer and caretaker',
            traits: ['Caring', 'Social', 'Popular', 'Organized'],
            cognitive: 'Fe-Si-Ne-Ti',
            color: 'from-rose-400 to-pink-400'
        },
        'ISTP': {
            name: 'The Virtuoso',
            description: 'Bold hands-on experimenter',
            traits: ['Practical', 'Observant', 'Adaptable', 'Reserved'],
            cognitive: 'Ti-Se-Ni-Fe',
            color: 'from-stone-400 to-zinc-400'
        },
        'ISFP': {
            name: 'The Adventurer',
            description: 'Charming artistic explorer',
            traits: ['Flexible', 'Charming', 'Artistic', 'Curious'],
            cognitive: 'Fi-Se-Ni-Te',
            color: 'from-violet-400 to-purple-400'
        },
        'ESTP': {
            name: 'The Entrepreneur',
            description: 'Energetic bold perceiver',
            traits: ['Energetic', 'Perceptive', 'Bold', 'Resourceful'],
            cognitive: 'Se-Ti-Fe-Ni',
            color: 'from-red-400 to-pink-400'
        },
        'ESFP': {
            name: 'The Entertainer',
            description: 'Spontaneous vivacious performer',
            traits: ['Spontaneous', 'Enthusiastic', 'Playful', 'Social'],
            cognitive: 'Se-Fi-Te-Ni',
            color: 'from-fuchsia-400 to-pink-400'
        }
    }

    const typeInfo = mbtiDescriptions[mbti] || {
        name: mbti,
        description: 'Personality type',
        traits: [],
        cognitive: '',
        color: 'from-gray-400 to-slate-400'
    }

    // Determine temperament group
    const getTemperament = (type) => {
        if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(type)) return { name: 'NT - Rational', color: 'purple', emoji: '🔬' }
        if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(type)) return { name: 'NF - Idealist', color: 'blue', emoji: '🌟' }
        if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(type)) return { name: 'SJ - Guardian', color: 'amber', emoji: '🛡️' }
        if (['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(type)) return { name: 'SP - Artisan', color: 'green', emoji: '🎨' }
        return { name: 'Unknown', color: 'gray', emoji: '❓' }
    }

    const temperament = getTemperament(mbti)

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-pink-950/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] group">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-600/20 flex items-center justify-center backdrop-blur-sm border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">🧠</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                                MBTI PERSONALITY
                            </h2>
                            <p className="text-xs text-white/40">
                                {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName} • ` : ''}Myers-Briggs Type
                            </p>
                        </div>
                    </div>
                    
                    {/* Temperament badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
                        <span className="text-sm">{temperament.emoji}</span>
                        <span className="text-xs text-purple-300 font-semibold whitespace-nowrap">
                            {temperament.name}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="relative px-6 py-5 space-y-4">
                {/* Type Badge - Dominant */}
                <div className="relative group/type">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover/type:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-purple-400/30 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className={`text-6xl font-black tracking-tighter bg-gradient-to-br ${typeInfo.color} bg-clip-text text-transparent`}>
                                {mbti}
                            </div>
                            <div className="flex-1">
                                <div className="text-lg font-bold text-white mb-1">{typeInfo.name}</div>
                                <div className="text-sm text-white/60">{typeInfo.description}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cognitive Stack - Technical */}
                {typeInfo.cognitive && (
                    <div className="relative group/cog">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover/cog:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-cyan-400/30 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">🧩</span>
                                <div className="text-[10px] text-cyan-300/60 uppercase tracking-wide font-semibold">Cognitive Functions</div>
                            </div>
                            <div className="text-xl text-white font-mono font-bold tracking-wide">
                                {typeInfo.cognitive}
                            </div>
                            <div className="text-xs text-white/40 mt-1">Your mental processing hierarchy</div>
                        </div>
                    </div>
                )}

                {/* Key Traits - Phi spacing */}
                {typeInfo.traits.length > 0 && (
                    <div className="relative group/traits">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 rounded-xl opacity-0 group-hover/traits:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-pink-400/30 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">✨</span>
                                <div className="text-[10px] text-pink-300/60 uppercase tracking-wide font-semibold">Core Characteristics</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {typeInfo.traits.map((trait, idx) => (
                                    <div 
                                        key={idx}
                                        className="px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center hover:bg-purple-500/20 hover:border-purple-400/40 transition-all duration-200"
                                    >
                                        <span className="text-sm text-purple-200 font-medium">{trait}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Note */}
                <div className="relative p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-400/5 to-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">💡</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-purple-200 font-bold mb-1">Cognitive Blueprint</div>
                            <div className="text-[10px] text-purple-300/70 leading-relaxed">
                                MBTI reveals your natural cognitive preferences and communication style—essential for understanding compatibility and interaction patterns.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient */}
            <div className="h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0"></div>
        </div>
    )
}
