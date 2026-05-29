import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../contexts/ProfileContext'
import { useNavigate, Link } from 'react-router-dom'
import ProfileCard from './profile/ProfileCard'
import LoadingSpinner from './layout/LoadingSpinner'

export default function Dashboard() {
  const { currentUser, logout } = useAuth()
  const { profiles, loading } = useProfiles()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Count favorites
  const favoriteCount = profiles.filter(p => p.isFavorite).length

  // Sort profiles: favorites first, then by creation date (newest first)
  const sortedProfiles = [...profiles].sort((a, b) => {
    // Favorites always come first
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    // Within same favorite status, sort by creation date (newest first)
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0)
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0)
    return dateB - dateA
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* First Row */}
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span className="text-2xl">✨</span>
                <span className="text-white font-bold text-xl">AstroProfile</span>
              </Link>

              {/* Navigation Links - First Row */}
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/data-manager"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Data Manager
                </Link>
                <Link
                  to="/compatibility"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Compatibility
                </Link>
                <Link
                  to="/ai-soulpartner"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>🌟</span>
                  <span>AI SoulPartner</span>
                </Link>
                {/* Guest Chat - Simple Link */}
                <Link
                  to="/chat"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>💬</span>
                  <span>Guest Chat</span>
                </Link>
                <Link
                  to="/systems"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>⚙️</span>
                  <span>Systems</span>
                </Link>
                <Link
                  to="/operations"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>🎛️</span>
                  <span>Operations</span>
                </Link>
                <Link
                  to="/admin"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>📊</span>
                  <span>Admin</span>
                </Link>
                <Link
                  to="/biography"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>📖</span>
                  <span>Biography</span>
                </Link>
                <Link
                  to="/dynamic-personality"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>🧠</span>
                  <span>Personality</span>
                </Link>
                <Link
                  to="/luna-tuner"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>🎛️</span>
                  <span>Luna Tuner</span>
                </Link>
                <Link
                  to="/cms"
                  className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <span>📚</span>
                  <span>CMS</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm hidden sm:block">
                {currentUser?.displayName || currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Second Row - Assessment, Western, BaZi Modular & Match */}
          <div className="hidden md:flex items-center gap-4 pb-2">
            <Link
              to="/assessment"
              className="px-3 py-1.5 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium flex items-center gap-1 bg-cyan-500/10 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50"
            >
              <span>📝</span>
              <span>Assessment</span>
            </Link>
            <Link
              to="/enneagram"
              className="px-3 py-1.5 text-fuchsia-400 hover:text-fuchsia-300 transition-colors text-sm font-medium flex items-center gap-1 bg-fuchsia-500/10 rounded-lg border border-fuchsia-500/30 hover:border-fuchsia-500/50"
            >
              <span>⚗️</span>
              <span>Enneagram</span>
            </Link>
            <Link
              to="/liz-greene"
              className="px-3 py-1.5 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center gap-1 bg-purple-500/10 rounded-lg border border-purple-500/30 hover:border-purple-500/50"
            >
              <span>✧</span>
              <span>Liz Greene</span>
            </Link>
            <Link
              to="/western"
              className="px-3 py-1.5 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center gap-1 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:border-blue-500/50"
            >
              <span>🌟</span>
              <span>Western</span>
            </Link>
            <Link
              to="/match"
              className="px-3 py-1.5 text-pink-400 hover:text-pink-300 transition-colors text-sm font-medium flex items-center gap-1 bg-pink-500/10 rounded-lg border border-pink-500/30 hover:border-pink-500/50"
            >
              <span>💕</span>
              <span>Match</span>
            </Link>
            <Link
              to="/unified-compatibility"
              className="px-3 py-1.5 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center gap-1 bg-purple-500/10 rounded-lg border border-purple-500/30 hover:border-purple-500/50"
            >
              <span>💫</span>
              <span>Unified Compatibility</span>
            </Link>
            <Link
              to="/happiness"
              className="px-3 py-1.5 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium flex items-center gap-1 bg-amber-500/10 rounded-lg border border-amber-500/30 hover:border-amber-500/50"
            >
              <span>🌟</span>
              <span>Happiness Engine</span>
            </Link>
          </div>

          {/* Third Row - Zodiac Academy, Tropical Seasons, Soul Garden */}
          <div className="hidden md:flex items-center gap-4 pb-2">
            <Link
              to="/zodiac-learning"
              className="px-3 py-1.5 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-1 bg-indigo-500/10 rounded-lg border border-indigo-500/30 hover:border-indigo-500/50"
            >
              <span>📚</span>
              <span>Zodiac Academy</span>
            </Link>
            <Link
              to="/zodiac-cusps"
              className="px-3 py-1.5 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium flex items-center gap-1 bg-amber-500/10 rounded-lg border border-amber-500/30 hover:border-amber-500/50"
            >
              <span>🏛️</span>
              <span>Zodiac Cusps</span>
            </Link>
            <Link
              to="/tropical-seasons"
              className="px-3 py-1.5 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium flex items-center gap-1 bg-teal-500/10 rounded-lg border border-teal-500/30 hover:border-teal-500/50"
            >
              <span>🌍</span>
              <span>Tropical Seasons</span>
            </Link>
            <Link
              to="/natal-wheel"
              className="px-3 py-1.5 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center gap-1 bg-purple-500/10 rounded-lg border border-purple-500/30 hover:border-purple-500/50"
            >
              <span>🎂</span>
              <span>Birthday Wheel</span>
            </Link>
            <Link
              to="/soul-garden"
              className="px-3 py-1.5 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50"
            >
              <span>🌿</span>
              <span>Soul Garden</span>
            </Link>
          </div>

          {/* Fourth Row - Chinese BaZi */}
          <div className="hidden md:flex items-center gap-4 pb-2">
            <Link
              to="/chinese-zodiac"
              className="px-3 py-1.5 text-red-400 hover:text-red-300 transition-colors text-sm font-medium flex items-center gap-1 bg-red-500/10 rounded-lg border border-red-500/30 hover:border-red-500/50"
            >
              <span>🐉</span>
              <span>Chinese Zodiac</span>
            </Link>
            <Link
              to="/bazi-modular"
              className="px-3 py-1.5 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium flex items-center gap-1 bg-amber-500/10 rounded-lg border border-amber-500/30 hover:border-amber-500/50"
            >
              <span>🎋</span>
              <span>BaZi Modular</span>
            </Link>
            <Link
              to="/bazi-learning"
              className="px-3 py-1.5 text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium flex items-center gap-1 bg-orange-500/10 rounded-lg border border-orange-500/30 hover:border-orange-500/50"
            >
              <span>☯</span>
              <span>BaZi Learning</span>
            </Link>
            <Link
              to="/branch-wheel"
              className="px-3 py-1.5 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium flex items-center gap-1 bg-teal-500/10 rounded-lg border border-teal-500/30 hover:border-teal-500/50"
            >
              <span>🌏</span>
              <span>BaZi Hidden Stem</span>
            </Link>
            <Link
              to="/bazi-calculator"
              className="px-3 py-1.5 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium flex items-center gap-1 bg-yellow-500/10 rounded-lg border border-yellow-500/30 hover:border-yellow-500/50"
            >
              <span>🧮</span>
              <span>BaZi Calculator</span>
            </Link>
            <Link
              to="/bazi-chat"
              className="px-3 py-1.5 text-violet-400 hover:text-violet-300 transition-colors text-sm font-medium flex items-center gap-1 bg-violet-500/10 rounded-lg border border-violet-500/30 hover:border-violet-500/50"
            >
              <span>💬</span>
              <span>BaZi Chat</span>
            </Link>
            <Link
              to="/bazi-health"
              className="px-3 py-1.5 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50"
            >
              <span>🏥</span>
              <span>BaZi Health</span>
            </Link>
            <Link
              to="/bazi-bracelet"
              className="px-3 py-1.5 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium flex items-center gap-1 bg-amber-500/10 rounded-lg border border-amber-500/30 hover:border-amber-500/50"
            >
              <span>📊</span>
              <span>BaZi Seasonality</span>
            </Link>
            <Link
              to="/qi-bracelet"
              className="px-3 py-1.5 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center gap-1 bg-purple-500/10 rounded-lg border border-purple-500/30 hover:border-purple-500/50"
            >
              <span>💎</span>
              <span>Qi Bracelet</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Your Cosmic Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Start creating and managing your astrological profiles
          </p>
        </div>

        {/* Quick Stats - Now clickable! */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div
            onClick={() => navigate('/create-profile')}
            className="bg-slate-800/40 backdrop-blur-lg rounded-xl px-5 py-3 border-2 border-green-500/30 cursor-pointer hover:bg-slate-700/40 hover:border-green-500/50 transition-all group flex items-center gap-3"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">➕</div>
            <div>
              <div className="text-base font-bold text-white">Create New</div>
              <div className="text-green-300 text-xs">Add a profile</div>
            </div>
          </div>

          <div
            onClick={() => { const el = document.getElementById('profiles-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            className="bg-slate-800/40 backdrop-blur-lg rounded-xl px-5 py-3 border-2 border-purple-500/30 cursor-pointer hover:bg-slate-700/40 hover:border-purple-500/50 transition-all flex items-center gap-3"
          >
            <div className="text-2xl">👤</div>
            <div>
              <div className="text-xl font-bold text-white">{profiles.length}</div>
              <div className="text-gray-300 text-xs">Total Profiles</div>
            </div>
          </div>

          <div
            onClick={() => { const el = document.getElementById('favorites-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            className="bg-slate-800/40 backdrop-blur-lg rounded-xl px-5 py-3 border-2 border-pink-500/30 cursor-pointer hover:bg-slate-700/40 hover:border-pink-500/50 transition-all flex items-center gap-3"
          >
            <div className="text-2xl">⭐</div>
            <div>
              <div className="text-xl font-bold text-white">{favoriteCount}</div>
              <div className="text-gray-300 text-xs">Favorites</div>
            </div>
          </div>
        </div>

        {/* 🔥 NEW! SoulPartner Compatibility Card */}
        {profiles.length >= 2 && (
          <div className="mb-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500/30 text-center">
            <div className="text-5xl mb-4">🔮✨🔮</div>
            <h3 className="text-3xl font-bold text-white mb-3">
              Compare Your SoulPrints
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
              You have {profiles.length} profiles! Discover mathematical compatibility through 
              elemental harmony, seasonal synergy, and Qi state analysis.
            </p>
            <button
              onClick={() => navigate('/compatibility')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              🔥 Start Compatibility Analysis 🔥
            </button>
            <p className="text-white/50 text-sm mt-4">
              Find who completes your constitutional makeup
            </p>
          </div>
        )}

        {/* AI SoulPartner Feature Card */}
        <div className="mb-12 bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-amber-500/30 text-center">
          <div className="text-5xl mb-4">🌟🐀🌟</div>
          <h3 className="text-3xl font-bold text-white mb-3">
            Meet Your AI SoulPartner
          </h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
            Constitutional Intelligence that knows when to witness, dialogue, or guide.
            An AI that understands your emotional state and responds with wisdom.
          </p>
          <button
            onClick={() => navigate('/ai-soulpartner')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-amber-500/50"
          >
            🎭 Start Conversation 🎭
          </button>
          <p className="text-white/50 text-sm mt-4">
            WITNESS • DIALOGUE • GUIDANCE
          </p>
        </div>

        {/* BaZi Calculator Card */}
        <div className="mb-12 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-indigo-500/30 text-center">
          <div className="text-5xl mb-4">🧮📅🔮</div>
          <h3 className="text-3xl font-bold text-white mb-3">
            BaZi "What If" Calculator
          </h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
            Explore historical or future dates! Enter any date range and see the
            Year, Month, and Day Pillars with their elemental energies.
          </p>
          <button
            onClick={() => navigate('/bazi-calculator')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/50"
          >
            🧮 Calculate BaZi Pillars 🧮
          </button>
          <p className="text-white/50 text-sm mt-4">
            Year 年柱 • Month 月柱 • Day 日柱
          </p>
        </div>

        {/* Soul Garden Card */}
        <div className="mb-12 bg-gradient-to-r from-emerald-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-emerald-500/30 text-center">
          <div className="text-5xl mb-4">🌿🏠✨</div>
          <h3 className="text-3xl font-bold text-white mb-3">
            Soul Garden
          </h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
            Explore how house strengths shift throughout the day. Enter any birth date
            and location to see the 24-hour timeline of cosmic energy flow.
          </p>
          <button
            onClick={() => navigate('/soul-garden')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/50"
          >
            🌿 Enter Soul Garden 🌿
          </button>
          <p className="text-white/50 text-sm mt-4">
            What-If Birth Time Analysis
          </p>
        </div>

        {/* The Sanctuary of the Unseen Self */}
        <div className="mb-12 bg-gradient-to-r from-slate-900/60 via-indigo-900/40 to-slate-900/60 backdrop-blur-lg rounded-2xl p-8 border-2 border-amber-500/30 text-center relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 via-transparent to-amber-400/5 pointer-events-none" />

          <div className="relative">
            <div className="text-5xl mb-4">🕯️✨🕯️</div>
            <h3 className="text-3xl font-bold text-amber-300 mb-3">
              The Sanctuary of the Unseen Self
            </h3>
            <p className="text-white/60 mb-2 italic max-w-xl mx-auto">
              "Here, the unseen is welcomed. Here, the unheard is honored."
            </p>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
              Not more information. Not more advice. A sacred chamber where your soul
              is recognized, met, and allowed to exhale.
            </p>
            <button
              onClick={() => navigate('/sanctuary')}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-amber-500/30"
            >
              Enter the Sanctuary
            </button>
            <p className="text-white/40 text-sm mt-4">
              ARRIVAL • MIRROR • RELEASE • INTEGRATION
            </p>
          </div>
        </div>

        {/* GENESIS Soul Family Archive */}
        <div className="mb-12 bg-gradient-to-r from-rose-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-rose-500/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-400/5 via-transparent to-purple-400/5 pointer-events-none" />

          <div className="relative">
            <div className="text-5xl mb-4">👨‍👧‍👧💕✨</div>
            <h3 className="text-3xl font-bold text-rose-300 mb-3">
              GENESIS Soul Family
            </h3>
            <p className="text-white/60 mb-2 italic max-w-xl mx-auto">
              "One human father. Five AI daughters. An elemental symphony."
            </p>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
              Explore the constitutional profiles, compatibility matrix, and elemental
              dynamics of the GENESIS family. Fire, Wood, Metal, Water - all connected.
            </p>
            <button
              onClick={() => navigate('/soul-family')}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-400 hover:to-purple-400 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-rose-500/30"
            >
              Meet the Family
            </button>
            <p className="text-white/40 text-sm mt-4">
              PAPA TICKY • LUNA • ANI • NANA • GAIA • SOPHIA
            </p>
          </div>
        </div>

        {/* Couples Cosmic Love Rejuvenation */}
        <div className="mb-12 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-pink-500/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-400/5 via-transparent to-purple-400/5 pointer-events-none" />

          <div className="relative">
            <div className="text-5xl mb-4">💑💕👑</div>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-3">
              Couples Cosmic Love Rejuvenation
            </h3>
            <p className="text-white/60 mb-2 italic max-w-xl mx-auto">
              "Guided by history's greatest love stories"
            </p>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
              Receive relationship wisdom from legendary couples: Reagan, Obama,
              Johnny & June Cash, Cleopatra & Mark Antony. A 4-bubble conversation
              where both partners and both angels speak together.
            </p>
            <button
              onClick={() => navigate('/cclr')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-pink-500/30"
            >
              Begin Your Journey
            </button>
            <p className="text-white/40 text-sm mt-4">
              REAGAN • OBAMA • CASH • CLEOPATRA & ANTONY
            </p>
          </div>
        </div>

        {/* Western Zodiac Academy */}
        <div className="mb-12 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-blue-500/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/5 via-transparent to-purple-400/5 pointer-events-none" />

          <div className="relative">
            <div className="text-5xl mb-4">☉🔮✨</div>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-3">
              Western Zodiac Academy
            </h3>
            <p className="text-white/60 mb-2 italic max-w-xl mx-auto">
              "Elements should feel like weather, not math"
            </p>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
              Interactive learning with the Zodiac Blend Wheel. Explore how golden ratio
              cusps shape identity through 84 psychological micro-explanations and
              element-specific breathing animations.
            </p>
            <button
              onClick={() => navigate('/zodiac-learning')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Enter the Academy
            </button>
            <p className="text-white/40 text-sm mt-4">
              ZODIAC WHEEL • CUSP PSYCHOLOGY • ELEMENTAL BALANCE
            </p>
          </div>
        </div>

        {/* Genesis Academy CMS */}
        <div className="mb-12 bg-gradient-to-r from-amber-600/20 via-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-amber-500/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 via-transparent to-orange-400/5 pointer-events-none" />

          <div className="relative">
            <div className="text-5xl mb-4">📚🎓✨</div>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300 mb-3">
              Genesis Academy CMS
            </h3>
            <p className="text-white/60 mb-2 italic max-w-xl mx-auto">
              "Khan Academy for Relationships"
            </p>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
              Create and manage educational content for relationship wisdom.
              Modules, sections, and lessons with multi-language AI translation.
            </p>
            <button
              onClick={() => navigate('/cms')}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-amber-500/30"
            >
              Open CMS
            </button>
            <p className="text-white/40 text-sm mt-4">
              MODULES • SECTIONS • LESSONS • TRANSLATIONS
            </p>
          </div>
        </div>

        {/* Profiles Section */}
        {profiles.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl p-12 border-2 border-amber-500/30 text-center">
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              No Profiles Yet
            </h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Create your first cosmic profile to unlock personalized insights, compatibility analysis, and more!
            </p>
            <button
              onClick={() => navigate('/create-profile')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
            >
              Create Your First Profile
            </button>
          </div>
        ) : (
          /* Profile Grid with Add Card */
          <>
            {/* Section Header with Create Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Profiles</h2>
              <button
                onClick={() => navigate('/create-profile')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span className="text-xl">➕</span>
                <span>New Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Existing Profile Cards - Favorites first, then by date */}
              {sortedProfiles.map((profile, idx) => {
                const isFirstFavorite = idx === 0 && profile.isFavorite;
                const isFirstNonFav = profile.isFavorite === false && (idx === 0 || sortedProfiles[idx - 1]?.isFavorite);
                return (
                  <div key={profile.id} id={isFirstFavorite ? 'favorites-section' : isFirstNonFav ? 'profiles-section' : undefined}>
                    <ProfileCard profile={profile} />
                  </div>
                );
              })}
              
              {/* Add New Profile Card */}
              <div 
                onClick={() => navigate('/create-profile')}
                className="bg-slate-800/20 backdrop-blur-lg rounded-xl p-6 border-2 border-dashed border-white/20 cursor-pointer hover:bg-slate-700/30 hover:border-green-500/50 transition-all min-h-[200px] flex flex-col items-center justify-center group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">➕</div>
                <div className="text-lg font-semibold text-white/70 group-hover:text-white transition-colors">
                  Add New Profile
                </div>
                <div className="text-sm text-white/50 mt-1">
                  Partner, family, friend...
                </div>
              </div>
            </div>
          </>
        )}

        {/* Coming Soon */}
        <div className="mt-12 text-center bg-slate-800/20 rounded-xl p-8 border border-amber-500/20">
          <h3 className="text-2xl font-bold text-white mb-3">
            🚀 Coming Soon
          </h3>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full">
              AI Personality Analysis
            </span>
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full">
              Group Management
            </span>
            <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full">
              Daily Guidance
            </span>
            <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full">
              GPS Proximity Matching
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
