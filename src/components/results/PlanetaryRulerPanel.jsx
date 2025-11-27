import React from 'react'

const planetaryDescriptions = {
    'Mars': 'Mars gives you warrior energy - courage, passion, and drive. You face challenges head-on and inspire others through action. Your natural dynamism makes things happen.',
    'Moon': 'The Moon gifts you emotional intelligence and intuitive power. You feel what others miss, nurture naturally, and understand the hidden currents of human connection.',
    'Mercury': 'Mercury blesses you with mental agility and communication mastery. Your quick mind and verbal skill make you the connector, the explainer, the bridge between ideas.',
    'Jupiter': 'Jupiter expands everything you touch - optimism, wisdom, luck. You see possibilities where others see limits. Growth is your natural state.',
    'Venus': 'Venus grants you aesthetic sensitivity and relationship grace. Beauty matters to you - in art, in love, in life. You create harmony naturally.',
    'Saturn': 'Saturn teaches through structure and discipline. You build things that last, earn respect through persistence, and understand that mastery takes time.',
    'Sun': 'The Sun powers your core vitality and leadership presence. You naturally shine, inspire confidence, and bring warmth wherever you go. Born to lead.'
}

export default function PlanetaryRulerPanel({ dayInfo }) {
    const dayOfWeek = dayInfo || {}
    
    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                <span className="text-xl">🌟</span>
                <h2 className="text-sm font-bold text-amber-400">PLANETARY RULER</h2>
            </div>
            
            <div className="text-center mb-3">
                <div className="text-3xl font-bold text-white mb-1">{dayOfWeek.day}</div>
                <div className="text-sm text-amber-400 font-semibold mb-1">Ruled by {dayOfWeek.planet}</div>
                <div className="text-[10px] text-white/60 italic mb-2">{dayOfWeek.traits}</div>
            </div>

            <div className="bg-slate-900/40 rounded-lg p-2 mb-3">
                <p className="text-[11px] text-white/80 leading-relaxed">
                    {planetaryDescriptions[dayOfWeek.planet]}
                </p>
            </div>

            <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all hover:scale-[1.02] shadow-lg">
                {dayOfWeek.planet} Influence Explained →
            </button>
        </div>
    )
}
