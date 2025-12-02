import React from 'react'

export default function MBTIPanel({ mbti }) {
    // If no MBTI data, show message
    if (!mbti) {
        return (
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-1">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/30">
                    <span className="text-xl">🧠</span>
                    <h2 className="text-sm font-bold text-purple-400">MBTI PERSONALITY</h2>
                </div>
                <div className="text-center py-8">
                    <p className="text-white/60 text-sm mb-2">MBTI type not set</p>
                    <p className="text-white/40 text-xs">Add MBTI for personality insights</p>
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
            cognitive: 'Ni-Te-Fi-Se'
        },
        'INTP': {
            name: 'The Logician',
            description: 'Philosophical thinker and innovator',
            traits: ['Logical', 'Curious', 'Objective', 'Innovative'],
            cognitive: 'Ti-Ne-Si-Fe'
        },
        'ENTJ': {
            name: 'The Commander',
            description: 'Bold strategic leader',
            traits: ['Decisive', 'Confident', 'Strategic', 'Ambitious'],
            cognitive: 'Te-Ni-Se-Fi'
        },
        'ENTP': {
            name: 'The Debater',
            description: 'Clever innovator and challenger',
            traits: ['Inventive', 'Energetic', 'Clever', 'Quick'],
            cognitive: 'Ne-Ti-Fe-Si'
        },
        'INFJ': {
            name: 'The Advocate',
            description: 'Insightful idealist',
            traits: ['Insightful', 'Principled', 'Compassionate', 'Creative'],
            cognitive: 'Ni-Fe-Ti-Se'
        },
        'INFP': {
            name: 'The Mediator',
            description: 'Poetic healer and idealist',
            traits: ['Idealistic', 'Empathetic', 'Creative', 'Authentic'],
            cognitive: 'Fi-Ne-Si-Te'
        },
        'ENFJ': {
            name: 'The Protagonist',
            description: 'Inspiring charismatic leader',
            traits: ['Charismatic', 'Inspiring', 'Altruistic', 'Natural leader'],
            cognitive: 'Fe-Ni-Se-Ti'
        },
        'ENFP': {
            name: 'The Campaigner',
            description: 'Creative free spirit',
            traits: ['Enthusiastic', 'Creative', 'Sociable', 'Free-spirited'],
            cognitive: 'Ne-Fi-Te-Si'
        },
        'ISTJ': {
            name: 'The Logistician',
            description: 'Practical and reliable organizer',
            traits: ['Responsible', 'Organized', 'Practical', 'Loyal'],
            cognitive: 'Si-Te-Fi-Ne'
        },
        'ISFJ': {
            name: 'The Defender',
            description: 'Warm protective supporter',
            traits: ['Supportive', 'Reliable', 'Patient', 'Dedicated'],
            cognitive: 'Si-Fe-Ti-Ne'
        },
        'ESTJ': {
            name: 'The Executive',
            description: 'Organized efficient manager',
            traits: ['Organized', 'Practical', 'Direct', 'Traditional'],
            cognitive: 'Te-Si-Ne-Fi'
        },
        'ESFJ': {
            name: 'The Consul',
            description: 'Social harmonizer and caretaker',
            traits: ['Caring', 'Social', 'Popular', 'Organized'],
            cognitive: 'Fe-Si-Ne-Ti'
        },
        'ISTP': {
            name: 'The Virtuoso',
            description: 'Bold hands-on experimenter',
            traits: ['Practical', 'Observant', 'Adaptable', 'Reserved'],
            cognitive: 'Ti-Se-Ni-Fe'
        },
        'ISFP': {
            name: 'The Adventurer',
            description: 'Charming artistic explorer',
            traits: ['Flexible', 'Charming', 'Artistic', 'Curious'],
            cognitive: 'Fi-Se-Ni-Te'
        },
        'ESTP': {
            name: 'The Entrepreneur',
            description: 'Energetic bold perceiver',
            traits: ['Energetic', 'Perceptive', 'Bold', 'Resourceful'],
            cognitive: 'Se-Ti-Fe-Ni'
        },
        'ESFP': {
            name: 'The Entertainer',
            description: 'Spontaneous vivacious performer',
            traits: ['Spontaneous', 'Enthusiastic', 'Playful', 'Social'],
            cognitive: 'Se-Fi-Te-Ni'
        }
    }

    const typeInfo = mbtiDescriptions[mbti] || {
        name: mbti,
        description: 'Personality type',
        traits: [],
        cognitive: ''
    }

    // Determine temperament group
    const getTemperament = (type) => {
        if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(type)) return { name: 'NT - Rational', color: 'purple' }
        if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(type)) return { name: 'NF - Idealist', color: 'blue' }
        if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(type)) return { name: 'SJ - Guardian', color: 'amber' }
        if (['ISTP', 'ISFP', 'ESTP', 'ESFP'].includes(type)) return { name: 'SP - Artisan', color: 'green' }
        return { name: 'Unknown', color: 'gray' }
    }

    const temperament = getTemperament(mbti)

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-1">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/30">
                <span className="text-xl">🧠</span>
                <h2 className="text-sm font-bold text-purple-400">MBTI PERSONALITY</h2>
            </div>

            {/* MBTI Type Badge */}
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                        {mbti}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white">{typeInfo.name}</div>
                        <div className="text-xs text-white/60">{typeInfo.description}</div>
                    </div>
                </div>
            </div>

            {/* Temperament */}
            <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Temperament</div>
                <div className={`text-sm text-${temperament.color}-400 font-semibold`}>
                    {temperament.name}
                </div>
            </div>

            {/* Cognitive Functions */}
            {typeInfo.cognitive && (
                <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Cognitive Stack</div>
                    <div className="text-sm text-white font-mono">
                        {typeInfo.cognitive}
                    </div>
                </div>
            )}

            {/* Key Traits */}
            {typeInfo.traits.length > 0 && (
                <div className="bg-slate-900/40 rounded-lg p-2">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-2">Key Traits</div>
                    <div className="flex flex-wrap gap-1">
                        {typeInfo.traits.map((trait, idx) => (
                            <span 
                                key={idx}
                                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                            >
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Note */}
            <div className="mt-3 bg-purple-500/10 rounded-lg p-2 border border-purple-500/30">
                <div className="flex items-center gap-2">
                    <span className="text-xs">💡</span>
                    <div className="text-[10px] text-purple-300">
                        MBTI reveals cognitive preferences and communication style - useful for compatibility analysis.
                    </div>
                </div>
            </div>
        </div>
    )
}
