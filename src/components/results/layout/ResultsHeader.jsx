/**
 * ResultsHeader.jsx
 * SESSION 5.3: OPTIMIZED HEADER - Navigation + Tabs Combined
 *
 * Reduces header from 240px to 60px
 * Gives 180px more space for rose window hexagon
 * Profile selector dropdown for easy switching
 * Tabs inline with navigation
 */

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AIInsightsButton from '../../aiInsights/AIInsightsButton'
import { useProfiles } from '../../../contexts/ProfileContext'

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
    const { profiles } = useProfiles()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // Handle profile selection
    const handleProfileSelect = (selectedProfileId) => {
        setIsDropdownOpen(false)
        if (selectedProfileId !== profileId) {
            navigate(`/results/${selectedProfileId}`)
        }
    }

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

                {/* LEFT: Profile Selector + Tabs */}
                <div className="flex items-center gap-6">
                    {/* Profile Selector Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-amber-500/30 hover:border-amber-400/50 transition-all"
                        >
                            <span className="text-xl">✨</span>
                            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent font-bold text-lg">
                                {profile?.displayName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'User'}
                            </span>
                            <svg
                                className={`w-4 h-4 text-amber-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-2xl overflow-hidden z-[100]"
                                >
                                    <div className="p-2 border-b border-white/10">
                                        <div className="text-xs text-white/50 px-2 py-1">Switch Profile ({profiles.length})</div>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {profiles.map((p) => {
                                            const isSelected = p.id === profileId
                                            const displayName = p.displayName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Unnamed'
                                            return (
                                                <button
                                                    key={p.id}
                                                    onClick={() => handleProfileSelect(p.id)}
                                                    className={`w-full px-3 py-2.5 flex items-center gap-3 transition-all text-left ${
                                                        isSelected
                                                            ? 'bg-purple-600/30 border-l-2 border-purple-400'
                                                            : 'hover:bg-white/5 border-l-2 border-transparent'
                                                    }`}
                                                >
                                                    <span className="text-lg">
                                                        {p.relationshipType === 'self' ? '👤' :
                                                         p.relationshipType === 'partner' ? '💕' :
                                                         p.relationshipType === 'family' ? '👨‍👩‍👧' :
                                                         p.relationshipType === 'friend' ? '👋' : '✨'}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`font-medium truncate ${isSelected ? 'text-amber-400' : 'text-white/90'}`}>
                                                            {displayName}
                                                        </div>
                                                        <div className="text-xs text-white/40 truncate">
                                                            {p.chineseZodiac?.element} {p.chineseZodiac?.animal} • {p.calculations?.western?.sign}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <span className="text-purple-400 text-sm">✓</span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <div className="p-2 border-t border-white/10">
                                        <button
                                            onClick={() => {
                                                setIsDropdownOpen(false)
                                                navigate('/create-profile')
                                            }}
                                            className="w-full px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all flex items-center gap-2"
                                        >
                                            <span>➕</span>
                                            <span>Create New Profile</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Click outside to close */}
                        {isDropdownOpen && (
                            <div
                                className="fixed inset-0 z-[99]"
                                onClick={() => setIsDropdownOpen(false)}
                            />
                        )}
                    </div>

                    {/* Tabs inline with selector */}
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

            {/* Second Row - BaZi Modular & Match */}
            <div className="max-w-6xl mx-auto px-4 pb-2 flex items-center gap-4">
                <Link
                    to="/bazi-modular"
                    className="px-3 py-1.5 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium flex items-center gap-1 bg-amber-500/10 rounded-lg border border-amber-500/30 hover:border-amber-500/50"
                >
                    <span>🎋</span>
                    <span>BaZi Modular</span>
                </Link>
                <Link
                    to="/match"
                    className="px-3 py-1.5 text-pink-400 hover:text-pink-300 transition-colors text-sm font-medium flex items-center gap-1 bg-pink-500/10 rounded-lg border border-pink-500/30 hover:border-pink-500/50"
                >
                    <span>💕</span>
                    <span>Match</span>
                </Link>
            </div>
        </header>
    )
}
