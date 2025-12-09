import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ResultsHeader({ currentUser, handleLogout, handleRefresh, refreshing, profileId }) {
    const navigate = useNavigate()

    return (
        <div className="backdrop-blur-lg bg-white/10 border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">✨</span>
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                        AstroProfile
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                    >
                        ← Dashboard
                    </button>
                    <span className="text-white/60">|</span>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="text-white/80 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <span className="text-white/60">|</span>
                    <button
                        onClick={() => navigate(`/create-profile?edit=${profileId}`)}
                        className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                    >
                        ✏️ Edit
                    </button>
                    <span className="text-white/60">|</span>
                    <span className="text-white/80">{currentUser?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
