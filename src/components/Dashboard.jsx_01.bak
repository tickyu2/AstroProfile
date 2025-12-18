import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProfiles } from '../contexts/ProfileContext'
import { useNavigate } from 'react-router-dom'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span className="text-white font-bold text-xl">AstroProfile</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div 
            onClick={() => navigate('/create-profile')}
            className="bg-slate-800/40 backdrop-blur-lg rounded-xl p-6 border-2 border-green-500/30 cursor-pointer hover:bg-slate-700/40 hover:border-green-500/50 transition-all group"
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">➕</div>
            <div className="text-xl font-bold text-white mb-1">Create New</div>
            <div className="text-green-300 text-sm">Add a profile</div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/30">
            <div className="text-4xl mb-2">👤</div>
            <div className="text-2xl font-bold text-white mb-1">{profiles.length}</div>
            <div className="text-gray-300 text-sm">Total Profiles</div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl p-6 border-2 border-pink-500/30">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-white mb-1">{favoriteCount}</div>
            <div className="text-gray-300 text-sm">Favorites</div>
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
              {/* Existing Profile Cards */}
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
              
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
            <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full">
              Compatibility Matching
            </span>
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full">
              Group Management
            </span>
            <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full">
              Daily Guidance
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
