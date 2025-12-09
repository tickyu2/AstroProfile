import React, { useState } from 'react'
import { getZodiacSecrets, SECTION_TITLES } from '../../data/westernZodiacContent'

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

export default function WesternAstrologyPanel({ westZodiac }) {
    const western = westZodiac || {}
    const [secretsUnlocked, setSecretsUnlocked] = useState(false)

    // Get the deep soul content for this sign
    const secrets = getZodiacSecrets(western.sign)

    const toggleSecrets = () => {
        setSecretsUnlocked(!secretsUnlocked)
    }

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                <span className="text-xl">{zodiacEmojis[western.sign]}</span>
                <h2 className="text-sm font-bold text-amber-400">WESTERN ZODIAC</h2>
            </div>
            
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
