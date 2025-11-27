import React from 'react'

export default function BirthDetailsPanel({ profile, age }) {
    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-amber-500/30 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all duration-300 hover:-translate-y-1 fade-in delay-1">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                <span className="text-xl">📍</span>
                <h2 className="text-sm font-bold text-amber-400">BIRTH DETAILS</h2>
            </div>
            
            <div className="space-y-2">
                <div className="bg-slate-900/40 rounded-lg p-2">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Date</div>
                    <div className="text-sm text-white font-semibold">
                        {new Date(profile.birthDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
                
                <div className="bg-slate-900/40 rounded-lg p-2">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Time</div>
                    <div className="text-sm text-white font-semibold">
                        {profile.birthTime || 'Not specified'}
                    </div>
                </div>
                
                <div className="bg-slate-900/40 rounded-lg p-2">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Location</div>
                    <div className="text-sm text-white font-semibold">
                        {profile.birthLocation?.city || 'Unknown'}
                    </div>
                    {profile.birthLocation?.country && (
                        <div className="text-xs text-white/60 mt-0.5">
                            {profile.birthLocation.country}
                        </div>
                    )}
                </div>
                
                <div className="bg-slate-900/40 rounded-lg p-2">
                    <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Age</div>
                    <div className="text-sm text-white font-semibold">
                        {age.years || 0} years
                    </div>
                </div>

                {profile.birthLocation?.coordinates && (
                    <div className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/30">
                        <div className="flex items-center gap-2">
                            <span className="text-xs">💡</span>
                            <div className="text-[10px] text-amber-300 font-semibold">
                                Hospital-Level Precision: Your Ascendant changes every 4 minutes. Accurate birth time and location matter.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
