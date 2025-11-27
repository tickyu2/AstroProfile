import React from 'react'
import EnhancedChineseZodiacPanel from '../EnhancedChineseZodiacPanel'

export default function YearPillarPanel({ profile, chinese, zodiacProfile }) {
    // Extract year from birth date
    const [year] = (profile.birthDate || '').split('-').map(Number)
    
    return (
        <div className="fade-in delay-2">
            {/* Add Year Pillar context header */}
            <div className="mb-2 text-center">
                <div className="inline-block bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-lg rounded-lg px-4 py-2 border border-amber-500/30">
                    <div className="text-xs text-amber-300 font-bold uppercase tracking-wide">
                        📍 Year Pillar (5% of your soul)
                    </div>
                    <div className="text-[10px] text-white/60 mt-0.5">
                        Your Ancestral Foundation
                    </div>
                </div>
            </div>

            {/* Use existing EnhancedChineseZodiacPanel */}
            <EnhancedChineseZodiacPanel 
                zodiacProfile={zodiacProfile}
                zodiacResult={chinese}
                year={year}
            />

            {/* Add hint about Four Pillars */}
            <div className="mt-2 text-center">
                <div className="inline-block bg-blue-500/10 rounded-lg px-3 py-1 border border-blue-500/30">
                    <div className="text-[10px] text-blue-300">
                        💡 This is where you came from - but there's 95% more! See your complete soul map below ↓
                    </div>
                </div>
            </div>
        </div>
    )
}
