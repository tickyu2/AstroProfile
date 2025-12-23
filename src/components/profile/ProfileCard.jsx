import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfiles } from '../../contexts/ProfileContext'

export default function ProfileCard({ profile }) {
  const { archiveProfile, toggleFavorite, cloneProfile, quickSaveProfile } = useProfiles()
  const [loading, setLoading] = useState(false)
  const [notesExpanded, setNotesExpanded] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState(profile.notes || '')
  const [savingNotes, setSavingNotes] = useState(false)
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

  // Clone profile for "what if" analysis
  const handleClone = async (e) => {
    e.stopPropagation()
    const newName = window.prompt(
      `Clone "${profile.displayName}"?\n\nEnter name for the clone:`,
      `${profile.displayName} (What If)`
    )
    if (newName) {
      try {
        setLoading(true)
        await cloneProfile(profile.id, newName)
      } catch (err) {
        alert('Error cloning profile: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  // Quick save notes without recalculation
  const handleQuickSaveNotes = async (e) => {
    e.stopPropagation()
    try {
      setSavingNotes(true)
      await quickSaveProfile(profile.id, { notes: notesValue })
      setEditingNotes(false)
    } catch (err) {
      alert('Error saving notes: ' + err.message)
    } finally {
      setSavingNotes(false)
    }
  }

  // Start editing notes inline
  const handleStartEditNotes = (e) => {
    e.stopPropagation()
    setNotesValue(profile.notes || '')
    setEditingNotes(true)
    setNotesExpanded(true)
  }

  // Cancel editing notes
  const handleCancelEditNotes = (e) => {
    e.stopPropagation()
    setNotesValue(profile.notes || '')
    setEditingNotes(false)
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
      className={`group relative backdrop-blur-sm rounded-xl p-5
                  transition-all duration-300 cursor-pointer
                  ${loading ? 'opacity-50 pointer-events-none' : ''}
                  ${profile.isFavorite
                    ? 'bg-amber-500/10 border-2 border-amber-400/40 hover:bg-amber-500/15 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/20'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'}`}
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

          {/* Clone Icon - for "what if" analysis */}
          <button
            onClick={handleClone}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors opacity-60 group-hover:opacity-100"
            title="Clone profile (What If analysis)"
          >
            <span className="text-purple-400">📋</span>
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

      {/* Notes Section - Collapsible with Inline Edit */}
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
              {editingNotes ? (
                <>
                  <textarea
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-slate-800 text-white/90 text-sm p-2 rounded border border-cyan-500/30 focus:border-cyan-400 focus:outline-none resize-none"
                    rows={4}
                    placeholder="Add your notes here..."
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleQuickSaveNotes}
                      disabled={savingNotes}
                      className="px-3 py-1 bg-green-500/80 hover:bg-green-500 text-white text-xs rounded transition-colors disabled:opacity-50"
                    >
                      {savingNotes ? '💾 Saving...' : '💾 Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEditNotes}
                      className="px-3 py-1 bg-gray-500/50 hover:bg-gray-500/70 text-white/70 text-xs rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-white/80 text-sm whitespace-pre-wrap">{profile.notes}</p>
                  <button
                    onClick={handleStartEditNotes}
                    className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    Edit notes →
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* No notes indicator - with inline add option */}
      {!hasNotes && (
        <div className="mt-3 pt-3 border-t border-white/10">
          {editingNotes ? (
            <div className="p-3 bg-slate-900/50 rounded-lg border border-cyan-500/20">
              <textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-slate-800 text-white/90 text-sm p-2 rounded border border-cyan-500/30 focus:border-cyan-400 focus:outline-none resize-none"
                rows={3}
                placeholder="Add your notes here..."
                autoFocus
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleQuickSaveNotes}
                  disabled={savingNotes || !notesValue.trim()}
                  className="px-3 py-1 bg-green-500/80 hover:bg-green-500 text-white text-xs rounded transition-colors disabled:opacity-50"
                >
                  {savingNotes ? '💾 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  onClick={handleCancelEditNotes}
                  className="px-3 py-1 bg-gray-500/50 hover:bg-gray-500/70 text-white/70 text-xs rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStartEditNotes}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-cyan-400 transition-colors"
            >
              <span>📝</span>
              <span>Add notes...</span>
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 text-xs text-white/40">
        Created {createdDate}
      </div>
    </div>
  )
}
