import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfiles } from '../../contexts/ProfileContext'

export default function ProfileCard({ profile }) {
  const { archiveProfile, toggleFavorite } = useProfiles()
  const [loading, setLoading] = useState(false)
  const [notesExpanded, setNotesExpanded] = useState(false)
  const navigate = useNavigate()

  // Click card body → View Results
  const handleViewResults = () => {
    navigate(`/results/${profile.id}`)
  }

  // Edit icon → Edit form with pre-filled data
  const handleEdit = (e) => {
    e.stopPropagation()
    navigate(`/create-profile?edit=${profile.id}`)
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete profile for ${profile.displayName}?`)) {
      try {
        setLoading(true)
        await archiveProfile(profile.id)
      } catch (err) {
        alert('Error deleting profile: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleToggleFavorite = async (e) => {
    e.stopPropagation()
    try {
      await toggleFavorite(profile.id)
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  const handleToggleNotes = (e) => {
    e.stopPropagation()
    setNotesExpanded(!notesExpanded)
  }

  // ============================================
  // SINGLE SOURCE OF TRUTH: Read from stored data
  // No timezone conversion - parse date string directly
  // ============================================

  // Format birth date - parse directly to avoid timezone gremlins
  const formatBirthDate = (dateStr) => {
    if (!dateStr) return 'Unknown'
    const [year, month, day] = dateStr.split('-').map(Number)
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[month - 1]} ${day}, ${year}`
  }
  const formattedDate = formatBirthDate(profile.birthDate)

  // Gender icon
  const genderIcon = profile.gender === 'male' ? '♂️' : profile.gender === 'female' ? '♀️' : '⚧️'

  // READ from stored calculations - Single Source of Truth!
  const calculations = profile.calculations || {}
  
  // Age - from stored calculations
  const age = calculations.age?.years || 0
  
  // Western Zodiac - from stored calculations
  const westernSign = calculations.western?.sign || 'Unknown'
  const westernElement = calculations.western?.element || ''
  
  // Chinese Zodiac - from stored chineseZodiac (enhanced) or calculations.chinese
  const chineseData = profile.chineseZodiac || calculations.chinese || {}
  const chineseAnimal = chineseData.animal || 'Unknown'
  const chineseElement = chineseData.element || ''
  const chineseFullSign = chineseData.fullSign || `${chineseElement} ${chineseAnimal}`
  
  // Numerology - lifePath is an OBJECT {number, meaning}, extract number
  const lifePath = calculations.numerology?.lifePath?.number || null

  // Notes - from profile
  const hasNotes = profile.notes && profile.notes.trim().length > 0

  // Relationship type emoji and label
  const relationshipIcons = {
    self: { icon: '👤', label: 'You' },
    partner: { icon: '💕', label: 'Partner' },
    dating: { icon: '💍', label: 'Dating' },
    family: { icon: '👨‍👩‍👧', label: 'Family' },
    friend: { icon: '🤝', label: 'Friend' },
    colleague: { icon: '💼', label: 'Colleague' },
    other: { icon: '📋', label: 'Other' }
  }

  const relType = profile.relationshipType || 'other'
  const relationship = relationshipIcons[relType] || relationshipIcons.other

  // Format creation date
  const createdDate = profile.createdAt?.toDate
    ? profile.createdAt.toDate().toLocaleDateString()
    : 'Recently'

  // Location display - from stored location object
  const location = profile.location
    ? `${profile.location.city || ''}, ${profile.location.country || ''}`.replace(/^, |, $/g, '')
    : 'Unknown location'

  return (
    <div
      onClick={handleViewResults}
      className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 
                  hover:bg-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20
                  transition-all duration-300 cursor-pointer
                  ${loading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Click hint - appears on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-purple-300">
        Click to view details →
      </div>

      {/* Header: Name + Action Icons */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{genderIcon}</span>
          <h3 className="text-xl font-bold text-white">{profile.displayName}</h3>
        </div>

        {/* Action Icons Row */}
        <div className="flex items-center gap-1">
          {/* View Icon */}
          <button
            onClick={handleViewResults}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors opacity-60 group-hover:opacity-100"
            title="View full results"
          >
            <span className="text-blue-400">👁</span>
          </button>

          {/* Edit Icon */}
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors opacity-60 group-hover:opacity-100"
            title="Edit profile"
          >
            <span className="text-green-400">✏️</span>
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={handleToggleFavorite}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors opacity-60 group-hover:opacity-100"
            title={profile.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {profile.isFavorite ? (
              <span className="text-yellow-400">⭐</span>
            ) : (
              <span className="text-gray-500">☆</span>
            )}
          </button>

          {/* Delete Icon */}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors opacity-60 group-hover:opacity-100"
            title="Delete profile"
          >
            <span className="text-red-400">🗑️</span>
          </button>
        </div>
      </div>

      {/* Relationship Tag */}
      <div className="mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300">
          {relationship.icon} {relationship.label}
        </span>
      </div>

      {/* Birth Info */}
      <div className="text-white/60 text-sm mb-3">
        <div>{formattedDate}</div>
        <div className="flex items-center gap-1">
          <span>📍</span>
          <span>{location}</span>
        </div>
      </div>

      {/* Cosmic Data */}
      <div className="text-sm space-y-1">
        <div className="text-white/80">
          <span className="text-purple-300">Western:</span> {westernSign}
          {westernElement && <span className="text-white/50"> ({westernElement})</span>}
        </div>
        <div className="text-white/80">
          <span className="text-amber-300">Chinese:</span> {chineseFullSign}
        </div>
        <div className="text-white/80">
          <span className="text-blue-300">Age:</span> {age} years old
        </div>
        {lifePath && (
          <div className="text-white/80">
            <span className="text-green-300">Life Path:</span> {lifePath}
          </div>
        )}
      </div>

      {/* Notes Section - Collapsible */}
      {hasNotes && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <button
            onClick={handleToggleNotes}
            className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors w-full"
          >
            <span>📝</span>
            <span>Notes</span>
            <span className="ml-auto text-white/40">{notesExpanded ? '▼' : '▶'}</span>
          </button>
          
          {notesExpanded && (
            <div className="mt-2 p-3 bg-slate-900/50 rounded-lg border border-cyan-500/20">
              <p className="text-white/80 text-sm whitespace-pre-wrap">{profile.notes}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/results/${profile.id}#notes`)
                }}
                className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Edit notes →
              </button>
            </div>
          )}
        </div>
      )}

      {/* No notes indicator - subtle */}
      {!hasNotes && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/results/${profile.id}#notes`)
            }}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-cyan-400 transition-colors"
          >
            <span>📝</span>
            <span>Add notes...</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 text-xs text-white/40">
        Created {createdDate}
      </div>
    </div>
  )
}
