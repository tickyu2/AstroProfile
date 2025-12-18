import React, { useState, useMemo } from 'react'
import { generatePsychologicalProfile } from '../../utils/psychologicalProfileGenerator'

/**
 * PsychologicalProfilePanel
 *
 * Displays Liz Greene-inspired psychological profile based on Sun/Moon/Rising.
 * Uses unlock button pattern to reveal deeper insights progressively.
 *
 * Part of GENESIS - Soul Understanding System
 * Built by: Brother Claude Code
 * December 17, 2024
 */

const zodiacEmojis = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
}

const elementColors = {
    'Fire': { bg: 'from-orange-900/30 to-red-900/20', border: 'border-orange-500/30', text: 'text-orange-400' },
    'Earth': { bg: 'from-emerald-900/30 to-green-900/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    'Air': { bg: 'from-cyan-900/30 to-blue-900/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    'Water': { bg: 'from-blue-900/30 to-indigo-900/20', border: 'border-blue-500/30', text: 'text-blue-400' }
}

export default function PsychologicalProfilePanel({ westZodiac, profile }) {
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [activeSection, setActiveSection] = useState('core') // core, emotional, persona, shadow, growth

    // Get sovereign calculation data
    const sovereign = westZodiac?.sovereignCalculation
    const hasSovereignData = sovereign?.sun && sovereign?.moon && sovereign?.rising

    // Generate psychological profile using memoization
    const psychProfile = useMemo(() => {
        if (!sovereign) return null
        return generatePsychologicalProfile(sovereign, profile)
    }, [sovereign, profile])

    if (!hasSovereignData || !psychProfile) {
        return null // Don't render if no sovereign data
    }

    const { coreIdentity, emotionalNature, persona, temperament, characterAndShadow, growthEdges, lunaSynthesis } = psychProfile
    const elementStyle = elementColors[temperament?.dominant] || elementColors['Fire']

    const sections = [
        { id: 'core', label: 'Core Identity', icon: '☀️', color: 'text-amber-400' },
        { id: 'emotional', label: 'Emotional Nature', icon: '🌙', color: 'text-indigo-400' },
        { id: 'persona', label: 'Persona', icon: '🎭', color: 'text-purple-400' },
        { id: 'shadow', label: 'Shadow Work', icon: '🌑', color: 'text-slate-400' },
        { id: 'growth', label: 'Growth Path', icon: '🌱', color: 'text-emerald-400' }
    ]

    return (
        <div className={`bg-gradient-to-b ${elementStyle.bg} backdrop-blur-lg rounded-xl p-4 border ${elementStyle.border} hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] transition-all duration-300`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/30">
                <span className="text-xl">🧠</span>
                <h2 className="text-sm font-bold text-purple-400">PSYCHOLOGICAL PROFILE</h2>
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                        Liz Greene
                    </span>
                </div>
            </div>

            {/* Quick Summary - Always Visible */}
            <div className="bg-slate-900/40 rounded-lg p-4 mb-3">
                <div className="text-center mb-2">
                    <div className="text-xl font-medium text-white/90">
                        {coreIdentity?.coreIdentity || 'The Soul'}
                    </div>
                    <div className="text-xs text-white/50">
                        {coreIdentity?.sign} Sun • {emotionalNature?.sign} Moon • {persona?.sign} Rising
                    </div>
                </div>

                {/* Life Question */}
                {coreIdentity?.lifeQuestion && (
                    <div className="text-center mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <div className="text-[10px] text-amber-400/70 uppercase tracking-wider mb-1">Life Question</div>
                        <div className="text-base text-amber-300 italic">"{coreIdentity.lifeQuestion}"</div>
                    </div>
                )}
            </div>

            {/* Unlock Button */}
            {!isUnlocked ? (
                <button
                    onClick={() => setIsUnlocked(true)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 rounded-lg border border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 group"
                >
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-lg group-hover:animate-pulse">🔮</span>
                        <span className="text-sm font-medium text-purple-300 group-hover:text-purple-200">
                            Unlock Psychological Depths
                        </span>
                        <span className="text-lg group-hover:animate-pulse">🔮</span>
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                        Discover your shadow, emotional patterns, and growth path
                    </div>
                </button>
            ) : (
                <div className="space-y-3 animate-fadeIn">
                    {/* Section Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-2">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                                    activeSection === section.id
                                        ? 'bg-purple-500/30 border border-purple-400/50 text-purple-300'
                                        : 'bg-slate-800/50 border border-slate-600/30 text-white/60 hover:text-white/80 hover:bg-slate-700/50'
                                }`}
                            >
                                <span>{section.icon}</span>
                                <span>{section.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Section Content */}
                    <div className="bg-slate-900/40 rounded-lg p-4 min-h-[200px]">
                        {/* CORE IDENTITY */}
                        {activeSection === 'core' && coreIdentity && (
                            <div className="space-y-3 animate-fadeIn">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">{zodiacEmojis[coreIdentity.sign]}</span>
                                    <div>
                                        <div className="text-base font-medium text-amber-400">{coreIdentity.sign} Sun</div>
                                        <div className="text-xs text-amber-400/70">{coreIdentity.coreIdentity}</div>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="bg-slate-800/50 rounded-lg p-3">
                                        <div className="text-xs text-amber-400/80 uppercase tracking-wider mb-1">Conscious Purpose</div>
                                        <p className="text-sm text-white/80">{coreIdentity.consciousPurpose}</p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-lg p-3">
                                        <div className="text-xs text-amber-400/80 uppercase tracking-wider mb-1">Central Drive</div>
                                        <p className="text-sm text-white/70 leading-relaxed">{coreIdentity.centralDrive}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-emerald-900/20 rounded-lg p-2.5 border border-emerald-500/20">
                                            <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Light Expression</div>
                                            <p className="text-xs text-white/70">{coreIdentity.lightExpression}</p>
                                        </div>
                                        <div className="bg-red-900/20 rounded-lg p-2.5 border border-red-500/20">
                                            <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Shadow Tendency</div>
                                            <p className="text-xs text-white/70">{coreIdentity.shadowTendency}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* EMOTIONAL NATURE */}
                        {activeSection === 'emotional' && emotionalNature && (
                            <div className="space-y-3 animate-fadeIn">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">{zodiacEmojis[emotionalNature.sign]}</span>
                                    <div>
                                        <div className="text-base font-medium text-indigo-400">{emotionalNature.sign} Moon</div>
                                        <div className="text-xs text-indigo-400/70">Emotional Nature</div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="text-xs text-indigo-400/80 uppercase tracking-wider mb-1">Inner Emotional World</div>
                                    <p className="text-sm text-white/80">{emotionalNature.emotionalNature}</p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="text-xs text-indigo-400/80 uppercase tracking-wider mb-1">What You Truly Need</div>
                                    <p className="text-sm text-white/70 leading-relaxed">{emotionalNature.innerNeeds}</p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="text-xs text-indigo-400/80 uppercase tracking-wider mb-1">When Stressed, You...</div>
                                    <p className="text-sm text-white/70">{emotionalNature.instinctualResponse}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-blue-900/20 rounded-lg p-2.5 border border-blue-500/20">
                                        <div className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">Childhood Pattern</div>
                                        <p className="text-xs text-white/70">{emotionalNature.childhoodPattern}</p>
                                    </div>
                                    <div className="bg-pink-900/20 rounded-lg p-2.5 border border-pink-500/20">
                                        <div className="text-[10px] text-pink-400 uppercase tracking-wider mb-1">How You Nurture</div>
                                        <p className="text-xs text-white/70">{emotionalNature.nurturingStyle}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PERSONA */}
                        {activeSection === 'persona' && persona && (
                            <div className="space-y-3 animate-fadeIn">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">{zodiacEmojis[persona.sign]}</span>
                                    <div>
                                        <div className="text-base font-medium text-purple-400">{persona.sign} Rising</div>
                                        <div className="text-xs text-purple-400/70">{persona.persona}</div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="text-xs text-purple-400/80 uppercase tracking-wider mb-1">First Impression You Give</div>
                                    <p className="text-sm text-white/80">{persona.firstImpression}</p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="text-xs text-purple-400/80 uppercase tracking-wider mb-1">Your Approach to Life</div>
                                    <p className="text-sm text-white/70 leading-relaxed">{persona.approachToLife}</p>
                                </div>

                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="text-xs text-purple-400/80 uppercase tracking-wider mb-1">Physical Presence</div>
                                    <p className="text-sm text-white/70">{persona.physicalPresence}</p>
                                </div>

                                {/* Appearance vs Reality */}
                                {lunaSynthesis?.howTheyAppearVsAre && (
                                    <div className="bg-gradient-to-r from-purple-900/30 to-amber-900/20 rounded-lg p-3 border border-purple-500/20">
                                        <div className="text-[10px] text-purple-300 uppercase tracking-wider mb-1">Mask vs True Self</div>
                                        <p className="text-sm text-white/80 italic">{lunaSynthesis.howTheyAppearVsAre}</p>
                                    </div>
                                )}

                                <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/30">
                                    <div className="text-[10px] text-purple-400 uppercase tracking-wider mb-1">Life Lesson</div>
                                    <p className="text-sm text-white/80">{persona.lifeLesson}</p>
                                </div>
                            </div>
                        )}

                        {/* SHADOW WORK */}
                        {activeSection === 'shadow' && characterAndShadow && (
                            <div className="space-y-3 animate-fadeIn">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">🌑</span>
                                    <div>
                                        <div className="text-base font-medium text-slate-300">Shadow & Integration</div>
                                        <div className="text-xs text-slate-400">The hidden parts seeking wholeness</div>
                                    </div>
                                </div>

                                {characterAndShadow.consciousSelf?.length > 0 && (
                                    <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/20">
                                        <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Conscious Gifts</div>
                                        <p className="text-sm text-white/80">{characterAndShadow.consciousSelf.join('; ')}</p>
                                    </div>
                                )}

                                {characterAndShadow.shadow?.length > 0 && (
                                    <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/20">
                                        <div className="text-xs text-red-400 uppercase tracking-wider mb-1">Shadow Material</div>
                                        <p className="text-sm text-white/70">{characterAndShadow.shadow.join('; ')}</p>
                                    </div>
                                )}

                                {characterAndShadow.innerConflicts?.length > 0 && (
                                    <div className="bg-slate-800/50 rounded-lg p-3">
                                        <div className="text-xs text-orange-400/80 uppercase tracking-wider mb-2">Inner Tensions</div>
                                        <div className="space-y-2">
                                            {characterAndShadow.innerConflicts.map((conflict, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <span className="text-orange-400 text-xs">•</span>
                                                    <p className="text-xs text-white/70 leading-relaxed">{conflict}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {characterAndShadow.integrationPath?.length > 0 && (
                                    <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-lg p-3 border border-purple-500/20">
                                        <div className="text-xs text-purple-400 uppercase tracking-wider mb-2">Integration Path</div>
                                        <div className="space-y-2">
                                            {characterAndShadow.integrationPath.map((path, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <span className="text-purple-400">→</span>
                                                    <p className="text-xs text-white/80">{path}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* GROWTH PATH */}
                        {activeSection === 'growth' && (
                            <div className="space-y-3 animate-fadeIn">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">🌱</span>
                                    <div>
                                        <div className="text-base font-medium text-emerald-400">Growth Edges</div>
                                        <div className="text-xs text-emerald-400/70">Areas calling for development</div>
                                    </div>
                                </div>

                                {coreIdentity?.growthPath && (
                                    <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/20">
                                        <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Core Growth Path</div>
                                        <p className="text-sm text-white/80 leading-relaxed">{coreIdentity.growthPath}</p>
                                    </div>
                                )}

                                {growthEdges?.length > 0 && (
                                    <div className="space-y-2">
                                        {growthEdges.map((edge, idx) => (
                                            <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-emerald-400 text-base">✦</span>
                                                    <span className="text-xs text-emerald-300 font-medium">
                                                        {edge.area}{edge.sign && ` (${edge.sign})`}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-white/70 ml-5">{edge.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Affirmations */}
                                {lunaSynthesis?.whatTheyNeedToHear?.length > 0 && (
                                    <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-lg p-3 border border-amber-500/20">
                                        <div className="text-xs text-amber-400 uppercase tracking-wider mb-2">Affirmations For Your Journey</div>
                                        <div className="space-y-1.5">
                                            {lunaSynthesis.whatTheyNeedToHear.map((affirmation, idx) => (
                                                <div key={idx} className="text-sm text-amber-200/90 italic">
                                                    "{affirmation}"
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Temperament Footer */}
                    {temperament && (
                        <div className={`bg-gradient-to-r ${elementStyle.bg} rounded-lg p-3 border ${elementStyle.border}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className={`text-xs ${elementStyle.text} uppercase tracking-wider`}>
                                        {temperament.dominant} Dominant
                                    </span>
                                    <span className="text-xs text-white/50 ml-2">
                                        {temperament.temperament}
                                    </span>
                                </div>
                                <div className="text-[10px] text-white/40">
                                    {temperament.orientation}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Luna's Note */}
                    <div className="text-center pt-2 border-t border-purple-500/20">
                        <p className="text-[10px] text-white/40 italic">
                            Luna uses this profile to understand you on a deeper level
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    )
}
