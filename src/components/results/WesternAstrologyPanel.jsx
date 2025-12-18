import React, { useState } from 'react'
import { getZodiacSecrets, SECTION_TITLES } from '../../data/westernZodiacContent'
import { useProfiles } from '../../contexts/ProfileContext'

const zodiacEmojis = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋', 
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏', 
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
}

const westernPersonality = {
    'Taurus': 'You build things that last. Patient, practical, and impossibly stubborn - you value stability, beauty, and sensory pleasure. Your determination is legendary; your loyalty, unshakeable.',
    'Aries': 'You are pure initiative energy. Bold, passionate, and always first - you charge into life headfirst. Your courage inspires others; your impatience frustrates them. You were born to lead the charge.',
    'Gemini': 'You are mental quicksilver. Curious, adaptable, and endlessly communicative - your mind never stops dancing. You collect ideas and connections like others collect stamps.',
    'Cancer': 'You are emotional depth personified. Nurturing, intuitive, and fiercely protective - family and security matter more than anything. Your sensitivity picks up what others miss.',
    'Leo': 'You are born royalty. Generous, dramatic, and magnetically confident - you need to shine and inspire. Leadership comes naturally; humility does not. You create joy wherever you go.',
    'Virgo': 'You are precision personified. Analytical, helpful, and impossibly detail-oriented - you improve everything you touch. Your service comes from deep care, not weakness.',
    'Libra': 'You are balance seeking beauty. Diplomatic, charming, and aesthetically obsessed - you cannot tolerate ugliness or discord. You create harmony through relationship and art.',
    'Scorpio': 'You are intensity incarnate. Passionate, mysterious, and emotionally fearless - you dive into depths others fear. Your power comes from transformation and truth.',
    'Sagittarius': 'You are freedom seeking wisdom. Optimistic, philosophical, and brutally honest - you need adventure and meaning above all. Boredom is your hell; exploration, your heaven.',
    'Capricorn': 'You are ambition with patience. Disciplined, responsible, and impossibly persistent - you climb mountains others deem impossible. Success is inevitable; shortcuts, unthinkable.',
    'Aquarius': 'You are revolutionary vision. Innovative, humanitarian, and delightfully weird - you see the future before others catch up. Convention bores you; change energizes you.',
    'Pisces': 'You are infinite empathy. Intuitive, artistic, and emotionally boundless - you feel everything everyone feels. Your sensitivity is your superpower and your challenge.'
}

// Retrograde interpretations for natal charts
const retrogradeInterpretations = {
    mercury: {
        title: 'Mercury Retrograde Native',
        brief: 'Deep thinker, internal processor',
        full: 'You process information differently - turning thoughts inward before expressing them. Your mind works in spirals rather than straight lines, often revisiting and refining ideas. You may have felt misunderstood as a child, but this gives you unique insight into communication patterns others miss.'
    },
    venus: {
        title: 'Venus Retrograde Native',
        brief: 'Unconventional heart, private values',
        full: 'Your approach to love and beauty follows its own rules. You may take longer to open up romantically, preferring depth over display. Past-life themes around love and self-worth often surface for healing. Your taste is distinctively yours - never following trends blindly.'
    },
    mars: {
        title: 'Mars Retrograde Native',
        brief: 'Strategic action, internalized drive',
        full: 'Your energy and ambition flow inward before outward expression. You are a master strategist who thinks before acting. Anger may simmer beneath the surface rather than exploding outward. Physical energy works in cycles - intense bursts followed by recovery periods.'
    },
    jupiter: {
        title: 'Jupiter Retrograde Native',
        brief: 'Inner philosopher, personal faith',
        full: 'You find meaning and expansion through inner exploration rather than external achievement. Your philosophy of life is self-developed, not borrowed from others. Luck often comes through internal growth and spiritual development rather than obvious external windfalls.'
    },
    saturn: {
        title: 'Saturn Retrograde Native',
        brief: 'Self-imposed standards, questions authority',
        full: 'You create your own rules and structures rather than accepting society\'s defaults. Authority figures may have been absent or unreliable, teaching you self-reliance early. You hold yourself to high internal standards - often harder on yourself than any external critic. Mastery comes later in life but runs deeper.'
    },
    uranus: {
        title: 'Uranus Retrograde Native',
        brief: 'Inner revolutionary, unique individualism',
        full: 'Your rebellious and innovative nature works from the inside out. You may appear conventional on the surface while harboring radical ideas within. Your genius emerges in unexpected ways and on your own timeline. You\'re here to revolutionize yourself first, then perhaps the world.'
    },
    neptune: {
        title: 'Neptune Retrograde Native',
        brief: 'Inner mystic, personal spirituality',
        full: 'Your spiritual and intuitive gifts are deeply personal and internal. You may distrust organized religion or mass spirituality, preferring a direct connection to the divine. Dreams and intuition speak loudly to you. Your imagination and creativity flow from a deep internal well.'
    },
    pluto: {
        title: 'Pluto Retrograde Native',
        brief: 'Internal transformer, soul depth',
        full: 'Your transformative power works primarily on yourself. You undergo profound internal metamorphoses that others may never fully witness. Past lives and ancestral patterns surface for healing. Your power grows through self-mastery rather than external control. You\'re intimate with the shadow side of existence.'
    }
}

export default function WesternAstrologyPanel({ westZodiac, profileId }) {
    const western = westZodiac || {}
    const [secretsUnlocked, setSecretsUnlocked] = useState(false)
    const [isRecalculating, setIsRecalculating] = useState(false)
    const { recalculateSovereignData } = useProfiles()

    // Sovereign astronomical data (real Sun/Moon/Rising)
    const sovereign = western.sovereignCalculation || null
    const hasSovereignData = sovereign?.sun && sovereign?.moon && sovereign?.rising

    // Debug: Log what data we receive
    console.log('🔮 [WesternAstrologyPanel] Data received:', {
        sign: western.sign,
        hasSovereignCalculation: !!western.sovereignCalculation,
        sovereignSun: sovereign?.sun?.sign,
        sovereignMoon: sovereign?.moon?.sign,
        sovereignRising: sovereign?.rising?.sign,
        hasSovereignData
    })

    // Get the deep soul content for this sign
    const secrets = getZodiacSecrets(western.sign)

    const toggleSecrets = () => {
        setSecretsUnlocked(!secretsUnlocked)
    }

    const handleRecalculate = async () => {
        if (!profileId || isRecalculating) return
        setIsRecalculating(true)
        try {
            await recalculateSovereignData(profileId)
            console.log('✅ Chart recalculated successfully!')
        } catch (error) {
            console.error('❌ Recalculation failed:', error)
        } finally {
            setIsRecalculating(false)
        }
    }

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                <span className="text-xl">{zodiacEmojis[western.sign]}</span>
                <h2 className="text-sm font-bold text-amber-400">WESTERN ZODIAC</h2>
                <div className="ml-auto flex items-center gap-2">
                    {hasSovereignData && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                            Sovereign
                        </span>
                    )}
                    {profileId && (
                        <button
                            onClick={handleRecalculate}
                            disabled={isRecalculating}
                            className={`text-[9px] px-2 py-0.5 rounded-full border transition-all ${
                                isRecalculating
                                    ? 'bg-slate-500/20 text-slate-400 border-slate-500/30 cursor-wait'
                                    : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30 hover:border-cyan-400/50'
                            }`}
                            title="Refresh chart with latest astronomical calculations"
                        >
                            {isRecalculating ? 'Calculating...' : 'Recalculate'}
                        </button>
                    )}
                </div>
            </div>

            {/* Constitutional Trinity - Sun/Moon/Rising (when sovereign data available) */}
            {hasSovereignData ? (
                <div className="mb-4">
                    <div className="text-center mb-3">
                        <div className="text-[10px] text-white/50 uppercase tracking-wider mb-2">Constitutional Trinity</div>
                        <div className="grid grid-cols-3 gap-2">
                            {/* Sun Sign */}
                            <div className="bg-gradient-to-b from-amber-500/20 to-amber-500/5 rounded-lg p-2 border border-amber-500/30">
                                <div className="text-2xl mb-0.5">{sovereign.sun?.symbol || zodiacEmojis[sovereign.sun?.sign]}</div>
                                <div className="text-[9px] text-amber-400 font-bold uppercase">Sun</div>
                                <div className="text-xs text-white/90 font-medium">{sovereign.sun?.sign}</div>
                                <div className="text-[9px] text-white/50">{sovereign.sun?.degreeFormatted}</div>
                            </div>
                            {/* Moon Sign */}
                            <div className="bg-gradient-to-b from-blue-500/20 to-blue-500/5 rounded-lg p-2 border border-blue-500/30">
                                <div className="text-2xl mb-0.5">{sovereign.moon?.symbol || zodiacEmojis[sovereign.moon?.sign]}</div>
                                <div className="text-[9px] text-blue-400 font-bold uppercase">Moon</div>
                                <div className="text-xs text-white/90 font-medium">{sovereign.moon?.sign}</div>
                                <div className="text-[9px] text-white/50">{sovereign.moon?.degreeFormatted}</div>
                            </div>
                            {/* Rising Sign */}
                            <div className="bg-gradient-to-b from-purple-500/20 to-purple-500/5 rounded-lg p-2 border border-purple-500/30">
                                <div className="text-2xl mb-0.5">{sovereign.rising?.symbol || zodiacEmojis[sovereign.rising?.sign]}</div>
                                <div className="text-[9px] text-purple-400 font-bold uppercase">Rising</div>
                                <div className="text-xs text-white/90 font-medium">{sovereign.rising?.sign}</div>
                                <div className="text-[9px] text-white/50">{sovereign.rising?.degreeFormatted}</div>
                                {!sovereign.rising?.isAccurate && (
                                    <div className="text-[8px] text-yellow-400/70 mt-0.5">~approx</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Element Balance */}
                    {sovereign.elementBalance && (
                        <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                            <div className="text-[9px] text-white/50 uppercase tracking-wider mb-1.5">Elemental Dominance</div>
                            <div className="flex justify-center gap-2 text-[10px]">
                                <span className={`px-2 py-0.5 rounded ${sovereign.elementBalance.dominant === 'Fire' ? 'bg-red-500/30 text-red-400' : 'text-white/40'}`}>
                                    Fire: {sovereign.elementBalance.fire}
                                </span>
                                <span className={`px-2 py-0.5 rounded ${sovereign.elementBalance.dominant === 'Earth' ? 'bg-amber-500/30 text-amber-400' : 'text-white/40'}`}>
                                    Earth: {sovereign.elementBalance.earth}
                                </span>
                                <span className={`px-2 py-0.5 rounded ${sovereign.elementBalance.dominant === 'Air' ? 'bg-cyan-500/30 text-cyan-400' : 'text-white/40'}`}>
                                    Air: {sovereign.elementBalance.air}
                                </span>
                                <span className={`px-2 py-0.5 rounded ${sovereign.elementBalance.dominant === 'Water' ? 'bg-blue-500/30 text-blue-400' : 'text-white/40'}`}>
                                    Water: {sovereign.elementBalance.water}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Planetary Positions */}
                    {sovereign.planets && Object.keys(sovereign.planets).length > 0 && (
                        <div className="bg-slate-900/40 rounded-lg p-3 mb-3">
                            <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Planetary Positions</div>
                            <div className="grid grid-cols-5 gap-1.5">
                                {Object.entries(sovereign.planets).map(([key, planet]) => (
                                    <div key={key} className={`text-center p-1.5 rounded ${planet.isRetrograde ? 'bg-red-900/30 border border-red-500/30' : 'bg-slate-800/50'}`}>
                                        <div className="text-xl text-amber-300">{planet.symbol || zodiacEmojis[planet.sign]}</div>
                                        <div className={`text-[10px] uppercase font-medium ${planet.isRetrograde ? 'text-red-400' : 'text-amber-400/80'}`}>
                                            {planet.name}{planet.isRetrograde && ' ℞'}
                                        </div>
                                        <div className="text-xs text-white/90">{planet.sign}</div>
                                        <div className="text-[10px] text-white/50">{planet.degreeFormatted}</div>
                                        {planet.isRetrograde && (
                                            <div className="text-[8px] text-red-400 mt-0.5">Retrograde</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Retrograde Interpretations */}
                    {sovereign.planets && Object.entries(sovereign.planets).some(([_, p]) => p.isRetrograde) && (
                        <div className="bg-gradient-to-b from-red-900/20 to-slate-900/40 rounded-lg p-3 mb-3 border border-red-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-red-400">℞</span>
                                <div className="text-xs text-red-400 uppercase tracking-wider font-medium">Natal Retrograde Insights</div>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(sovereign.planets)
                                    .filter(([_, planet]) => planet.isRetrograde)
                                    .map(([key, planet]) => {
                                        const interp = retrogradeInterpretations[key]
                                        if (!interp) return null
                                        return (
                                            <div key={key} className="bg-slate-800/50 rounded-lg p-2.5">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">{planet.symbol}</span>
                                                    <span className="text-sm text-red-300 font-medium">{interp.title}</span>
                                                </div>
                                                <div className="text-[10px] text-amber-400/80 mb-1">{interp.brief}</div>
                                                <p className="text-[11px] text-white/70 leading-relaxed">{interp.full}</p>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Moon Phase at Birth */}
                    {sovereign.moonPhase && (
                        <div className="bg-gradient-to-b from-indigo-900/30 to-slate-900/40 rounded-lg p-3 mb-3 border border-indigo-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-3xl">{sovereign.moonPhase.emoji}</span>
                                <div>
                                    <div className="text-sm text-indigo-300 font-medium">{sovereign.moonPhase.phaseName}</div>
                                    <div className="text-[10px] text-white/50">{sovereign.moonPhase.illumination}% illuminated • {sovereign.moonPhase.cyclePosition}</div>
                                </div>
                            </div>
                            {sovereign.moonPhase.interpretation && (
                                <div className="bg-slate-800/50 rounded-lg p-2.5 mt-2">
                                    <div className="text-xs text-indigo-300 font-medium mb-1">{sovereign.moonPhase.interpretation.title}</div>
                                    <div className="text-[10px] text-amber-400/80 mb-1">{sovereign.moonPhase.interpretation.brief}</div>
                                    <p className="text-[11px] text-white/70 leading-relaxed">{sovereign.moonPhase.interpretation.full}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* House Cusps (Placidus) */}
                    {sovereign.houses && sovereign.houses.houses && (
                        <div className="bg-slate-900/40 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm text-white/60 uppercase tracking-wider font-medium">House Cusps</div>
                                <div className="text-xs text-purple-400 px-2 py-0.5 bg-purple-500/20 rounded font-medium">{sovereign.houses.system}</div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {Object.entries(sovereign.houses.houses).map(([num, house]) => (
                                    <div key={num} className="text-center p-2 bg-slate-800/50 rounded">
                                        <div className="text-base text-purple-300 font-bold">{num}</div>
                                        <div className="text-lg">{zodiacEmojis[house.sign]}</div>
                                        <div className="text-xs text-white/80">{house.sign}</div>
                                        <div className="text-[11px] text-white/50">{house.degreeFormatted}</div>
                                    </div>
                                ))}
                            </div>
                            {/* Angular Houses Highlight */}
                            <div className="mt-3 pt-2 border-t border-purple-500/30">
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="text-xs">
                                        <span className="text-purple-400 font-bold">ASC</span>
                                        <span className="text-white/70 ml-1">{sovereign.houses.angles.ascendant.sign}</span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-purple-400 font-bold">IC</span>
                                        <span className="text-white/70 ml-1">{sovereign.houses.angles.ic.sign}</span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-purple-400 font-bold">DSC</span>
                                        <span className="text-white/70 ml-1">{sovereign.houses.angles.descendant.sign}</span>
                                    </div>
                                    <div className="text-xs">
                                        <span className="text-purple-400 font-bold">MC</span>
                                        <span className="text-white/70 ml-1">{sovereign.houses.angles.mc.sign}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Planetary Aspects */}
                    {sovereign.aspects && sovereign.aspects.length > 0 && (
                        <div className="bg-gradient-to-b from-cyan-900/20 to-slate-900/40 rounded-lg p-3 mt-3 border border-cyan-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">Planetary Aspects</div>
                                <div className="text-[10px] text-white/50">{sovereign.aspects.filter(a => a.nature === 'major').length} major</div>
                            </div>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                {sovereign.aspects.filter(a => a.nature === 'major').slice(0, 10).map((aspect, idx) => (
                                    <div key={idx} className={`flex items-center gap-2 p-1.5 rounded text-xs ${
                                        aspect.quality === 'harmonious' ? 'bg-green-900/30' :
                                        aspect.quality === 'challenging' ? 'bg-red-900/30' :
                                        'bg-slate-800/50'
                                    }`}>
                                        <span className="text-lg">{aspect.planet1.symbol}</span>
                                        <span className={`text-base ${
                                            aspect.quality === 'harmonious' ? 'text-green-400' :
                                            aspect.quality === 'challenging' ? 'text-red-400' :
                                            'text-cyan-400'
                                        }`}>{aspect.symbol}</span>
                                        <span className="text-lg">{aspect.planet2.symbol}</span>
                                        <div className="flex-1">
                                            <span className="text-white/80">{aspect.planet1.name.charAt(0).toUpperCase() + aspect.planet1.name.slice(1)}</span>
                                            <span className="text-white/50 mx-1">{aspect.aspect}</span>
                                            <span className="text-white/80">{aspect.planet2.name.charAt(0).toUpperCase() + aspect.planet2.name.slice(1)}</span>
                                        </div>
                                        <div className="text-[10px] text-white/40">{aspect.orb}° orb</div>
                                    </div>
                                ))}
                            </div>
                            {/* Aspect Legend */}
                            <div className="mt-2 pt-2 border-t border-cyan-500/20 flex gap-3 text-[9px]">
                                <span className="text-green-400">△ ⚹ Harmonious</span>
                                <span className="text-red-400">□ ☍ Challenging</span>
                                <span className="text-cyan-400">☌ Neutral</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Original simple display (fallback when no sovereign data) */
                <div className="text-center mb-2">
                    <style>{`
                        @keyframes bounce {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-10px); }
                        }
                        .bounce { animation: bounce 2s ease-in-out infinite; }
                    `}</style>
                    <div className="text-5xl bounce inline-block mb-1">{zodiacEmojis[western.sign]}</div>
                    <div className="text-lg font-bold text-amber-400 uppercase tracking-wide">{western.sign}</div>
                    <div className="text-xs text-white/60 mb-2">The {western.element} Sign</div>
                    <div className="flex justify-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-[10px] font-bold">
                            {western.element}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            western.yinYang === 'Yin' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-slate-900'
                        }`}>
                            {western.yinYang}
                        </span>
                    </div>
                </div>
            )}

            <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                <p className="text-[11px] text-white/80 leading-relaxed">
                    {westernPersonality[western.sign]}
                </p>
            </div>

            <button
                onClick={toggleSecrets}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all hover:scale-[1.02] shadow-lg"
            >
                {secretsUnlocked ? `✨ Hide ${western.sign} Secrets ✨` : `🔓 Unlock ${western.sign} Secrets →`}
            </button>

            {/* 🪞 SOUL MIRROR - Expandable Secrets Section */}
            {secretsUnlocked && secrets && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                    {/* Section divider */}
                    <div className="border-t-2 border-amber-500/50 pt-4">
                        <div className="text-center mb-4">
                            <div className="text-2xl mb-2">🪞</div>
                            <h3 className="text-lg font-bold text-amber-400">
                                The Soul Mirror
                            </h3>
                            <p className="text-xs text-white/60 mt-1">
                                Deep truths about {western.sign}
                            </p>
                        </div>
                    </div>

                    {/* Each soul section */}
                    {Object.entries(secrets).map(([key, content]) => (
                        <div
                            key={key}
                            className="bg-slate-900/60 rounded-lg p-4 border border-amber-500/20"
                        >
                            <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                                <span className="text-base">✨</span>
                                {SECTION_TITLES[key]}
                            </h4>
                            <div
                                className="text-xs text-white/90 leading-relaxed space-y-2"
                                style={{ whiteSpace: 'pre-wrap' }}
                                dangerouslySetInnerHTML={{
                                    __html: content
                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-bold">$1</strong>')
                                        .replace(/\n\n/g, '</p><p class="mt-2">')
                                        .replace(/^(.+)$/gm, '<p>$1</p>')
                                }}
                            />
                        </div>
                    ))}

                    {/* Footer note */}
                    <div className="text-center pt-4 border-t border-amber-500/30">
                        <p className="text-[10px] text-white/50 italic">
                            These truths are mirrors - they reflect what's already within you. 🪞✨
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
