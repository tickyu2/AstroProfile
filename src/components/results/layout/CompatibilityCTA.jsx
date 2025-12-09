import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CompatibilityCTA() {
    const navigate = useNavigate()

    return (
        <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500/30 text-center fade-in delay-6">
            <div className="text-5xl mb-4">🔮✨🔮</div>
            <h3 className="text-3xl font-bold text-white mb-3">
                Ready to Find Your SoulPartner?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
                Discover who completes your constitutional makeup through mathematical compatibility analysis.
                Compare your SoulPrint with friends, partners, or potential matches.
            </p>
            <button
                onClick={() => navigate('/compatibility')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
                🔥 Compare Your SoulPrint 🔥
            </button>
            <p className="text-white/50 text-sm mt-4">
                • Elemental Harmony Analysis • Seasonal Compatibility • Qi State Synergy •
            </p>
        </div>
    )
}
