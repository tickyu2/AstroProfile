/**
 * ResultsHeader.jsx
 * SESSION 5.3: OPTIMIZED HEADER - Navigation + Tabs Combined
 *
 * Reduces header from 240px to 60px
 * Gives 180px more space for rose window hexagon
 * User name replaces "AstroProfile"
 * Tabs inline with navigation
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AIInsightsButton from '../../aiInsights/AIInsightsButton'

export default function ResultsHeader({
    currentUser,
    handleLogout,
    handleRefresh,
    refreshing,
    profileId,
    profile,
    activeTab,
    onTabChange
}) {
    const navigate = useNavigate()

    // Tab definitions (same as TabNavigation.jsx)
    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: '🏛️',
            gradient: 'from-slate-500 to-slate-600'
        },
        {
            id: 'bazi',
            label: 'BaZi',
            icon: '☯️',
            gradient: 'from-purple-500 to-pink-600'
        },
        {
            id: 'mbti',
            label: 'MBTI Soul',
            icon: '💜',
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            id: 'enneagram',
            label: 'Enneagram',
            icon: '⚗️',
            gradient: 'from-purple-500 to-amber-600'
        },
        {
            id: 'western',
            label: 'Western',
            icon: '⭐',
            gradient: 'from-amber-500 to-orange-600'
        },
        {
            id: 'numerology',
            label: 'Numerology',
            icon: '🔢',
            gradient: 'from-emerald-500 to-green-600'
        }
    ]

    return (
        <header className="backdrop-blur-lg bg-white/10 border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

                {/* LEFT: User Name + Tabs */}
                <div className="flex items-center gap-6">
                    {/* User's Full Name (replaces AstroProfile logo) */}
                    <div className="text-yellow-400 font-bold text-lg whitespace-nowrap flex items-center gap-2">
                        <span className="text-2xl">✨</span>
                        <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                            {profile?.displayName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'User'}
                        </span>
                    </div>

                    {/* Tabs inline with name */}
                    <nav className="flex gap-1">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id

                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`
                                        relative px-3 py-2 rounded-lg text-sm font-medium
                                        transition-all duration-200
                                        flex items-center gap-2
                                        ${isActive
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                            : 'text-gray-400 hover:text-white hover:bg-slate-800/80'
                                        }
                                    `}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-base">{tab.icon}</span>
                                    <span className="hidden md:inline">{tab.label}</span>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.gradient}`}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            )
                        })}
                    </nav>
                </div>

                {/* RIGHT: Actions with THE GOOSE button! */}
                <div className="flex items-center gap-3 text-sm">
                    {/* 🦢 THE GOOSE - AI Insights Button! */}
                    <AIInsightsButton profile={profile} />
                    <span className="text-white/30">|</span>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
                    >
                        ← Dashboard
                    </button>
                    <span className="text-white/30">|</span>
                    <button
                        onClick={() => navigate(`/create-profile?edit=${profileId}`)}
                        className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
                    >
                        ✏️ Edit
                    </button>
                    <span className="text-white/30">|</span>
                    <span className="text-white/60 text-xs hidden lg:inline">
                        {currentUser?.email}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-xs font-medium"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </header>
    )
}
