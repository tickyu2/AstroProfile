import React from 'react'

export default function NumerologyPanel({ numerology }) {
    const num = numerology || {}
    
    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                <span className="text-xl">🔢</span>
                <h2 className="text-sm font-bold text-amber-400">NUMEROLOGY</h2>
            </div>

            <style>{`
                @keyframes rotateCircle {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .number-circle:hover {
                    animation: rotateCircle 2s linear infinite;
                }
            `}</style>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-3 border border-purple-400/30 text-center transition-all hover:scale-105 hover:shadow-lg number-circle">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{num.lifePath?.number || '?'}</span>
                    </div>
                    <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wide">Life Path</div>
                    <div className="text-[9px] text-white/50 mt-0.5">Your Journey</div>
                </div>
                <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-lg p-3 border border-pink-400/30 text-center transition-all hover:scale-105 hover:shadow-lg number-circle">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{num.expression?.number || '?'}</span>
                    </div>
                    <div className="text-[10px] text-pink-300 font-bold uppercase tracking-wide">Destiny</div>
                    <div className="text-[9px] text-white/50 mt-0.5">Your Purpose</div>
                </div>
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-lg p-3 border border-amber-400/30 text-center transition-all hover:scale-105 hover:shadow-lg number-circle">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{num.soulUrge?.number || '?'}</span>
                    </div>
                    <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wide">Soul Urge</div>
                    <div className="text-[9px] text-white/50 mt-0.5">Inner Drive</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg p-3 border border-green-400/30 text-center transition-all hover:scale-105 hover:shadow-lg number-circle">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{num.personality?.number || '?'}</span>
                    </div>
                    <div className="text-[10px] text-green-300 font-bold uppercase tracking-wide">Personality</div>
                    <div className="text-[9px] text-white/50 mt-0.5">How You're Seen</div>
                </div>
            </div>

            <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                <p className="text-[11px] text-white/80 leading-relaxed">
                    Your Life Path ({num.lifePath?.number || '?'}) reveals your soul's journey. Destiny ({num.expression?.number || '?'}) shows your life purpose. Soul Urge ({num.soulUrge?.number || '?'}) is what truly drives you. Personality ({num.personality?.number || '?'}) is how others see you.
                </p>
            </div>

            <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all hover:scale-[1.02] shadow-lg">
                Decode Your Numbers →
            </button>
        </div>
    )
}
