import React, { useState, useMemo, useRef, useEffect } from 'react'

export default function NotesPanel({ 
    profile,
    notes, 
    setNotes, 
    notesSaving, 
    notesSaved, 
    handleSaveNotes,
    notesRef,
    recentCustomTags = [],
    setRecentCustomTags
}) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [showMetrics, setShowMetrics] = useState(false)
    const [activeTag, setActiveTag] = useState(null)
    const [showTimelineNav, setShowTimelineNav] = useState(false)
    const [selectedYear, setSelectedYear] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [showCustomTagInput, setShowCustomTagInput] = useState(false)
    const [customTagName, setCustomTagName] = useState('')
    
    // Track textarea scroll position
    const textareaRef = useRef(null)
    const [showScrollToBottom, setShowScrollToBottom] = useState(false)
    
    // Debug: Log recentCustomTags whenever it changes
    useMemo(() => {
        console.log('🏷️ [DEBUG] Current recentCustomTags:', recentCustomTags)
    }, [recentCustomTags])
    
    // Save and restore scroll position
    useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return
        
        // Restore scroll position with a small delay to ensure textarea is ready
        const timer = setTimeout(() => {
            const savedPosition = localStorage.getItem('soul-journal-scroll-position')
            if (savedPosition) {
                const position = parseInt(savedPosition, 10)
                textarea.scrollTop = position
                console.log('📜 [DEBUG] Restored scroll position:', position)
            }
        }, 100) // Small delay to ensure DOM is ready
        
        // Save scroll position on unmount
        return () => {
            clearTimeout(timer)
            if (textarea && textarea.scrollTop > 0) {
                localStorage.setItem('soul-journal-scroll-position', textarea.scrollTop.toString())
                console.log('📜 [DEBUG] Saved scroll position:', textarea.scrollTop)
            }
        }
    }, [])
    
    // Also save scroll position when notes change (debounced)
    useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return
        
        const timer = setTimeout(() => {
            if (textarea.scrollTop > 0) {
                localStorage.setItem('soul-journal-scroll-position', textarea.scrollTop.toString())
                console.log('📜 [DEBUG] Auto-saved scroll position:', textarea.scrollTop)
            }
        }, 500) // Debounce 500ms
        
        return () => clearTimeout(timer)
    }, [notes])
    
    // Also save on every scroll (with debounce)
    const scrollSaveTimer = useRef(null)
    const handleTextareaScroll = (e) => {
        const textarea = e.target
        const isScrolledUp = textarea.scrollTop < textarea.scrollHeight - textarea.clientHeight - 50
        setShowScrollToBottom(isScrolledUp)
        
        // Save scroll position with debounce
        if (scrollSaveTimer.current) {
            clearTimeout(scrollSaveTimer.current)
        }
        scrollSaveTimer.current = setTimeout(() => {
            if (textarea.scrollTop > 0) {
                localStorage.setItem('soul-journal-scroll-position', textarea.scrollTop.toString())
                console.log('📜 [DEBUG] Scroll-saved position:', textarea.scrollTop)
            }
        }, 300)
    }

    // Parse notes into entries (separated by dates or line breaks)
    const entries = useMemo(() => {
        if (!notes) return []
        
        // Split by double line breaks or date patterns
        const sections = notes.split(/\n\n+/)
        
        return sections
            .filter(section => section.trim())
            .map((section, idx) => {
                // Try to extract date from start of section
                const dateMatch = section.match(/^(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|[A-Z][a-z]+ \d{1,2},? \d{4})/)
                const hasDate = dateMatch !== null
                const date = hasDate ? dateMatch[1] : null
                const content = hasDate ? section.substring(dateMatch[0].length).trim() : section
                
                // Extract tags (#word)
                const tagMatches = content.match(/#[\w-]+/g) || []
                const tags = tagMatches.map(tag => tag.substring(1))
                
                return {
                    id: idx,
                    date,
                    dateObj: hasDate ? new Date(date) : null,
                    content,
                    tags,
                    preview: content.substring(0, 100) + (content.length > 100 ? '...' : '')
                }
            })
    }, [notes])

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tagMap = new Map()
        entries.forEach(entry => {
            entry.tags.forEach(tag => {
                tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
            })
        })
        return Array.from(tagMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
    }, [entries])

    // Extract available years and months from entries
    const availableYearsMonths = useMemo(() => {
        const yearMonthMap = new Map()
        
        entries.forEach(entry => {
            if (entry.dateObj) {
                const year = entry.dateObj.getFullYear()
                const month = entry.dateObj.getMonth() // 0-11
                
                if (!yearMonthMap.has(year)) {
                    yearMonthMap.set(year, new Set())
                }
                yearMonthMap.get(year).add(month)
            }
        })
        
        // Convert to sorted array structure
        const years = Array.from(yearMonthMap.keys()).sort((a, b) => b - a) // Newest first
        const yearsWithMonths = years.map(year => ({
            year,
            months: Array.from(yearMonthMap.get(year)).sort((a, b) => b - a), // Newest first
            entryCount: entries.filter(e => e.dateObj && e.dateObj.getFullYear() === year).length
        }))
        
        return yearsWithMonths
    }, [entries])

    // Calculate relationship metrics
    const metrics = useMemo(() => {
        if (entries.length === 0) return null
        
        const sortedEntries = [...entries]
            .filter(e => e.dateObj)
            .sort((a, b) => a.dateObj - b.dateObj)
        
        const firstEntry = sortedEntries[0]
        const lastEntry = sortedEntries[sortedEntries.length - 1]
        
        const daysSinceFirst = firstEntry?.dateObj 
            ? Math.floor((new Date() - firstEntry.dateObj) / (1000 * 60 * 60 * 24))
            : 0
            
        const daysSinceLast = lastEntry?.dateObj
            ? Math.floor((new Date() - lastEntry.dateObj) / (1000 * 60 * 60 * 24))
            : 0
        
        // Find longest gap
        let longestGap = 0
        for (let i = 1; i < sortedEntries.length; i++) {
            const gap = Math.floor((sortedEntries[i].dateObj - sortedEntries[i-1].dateObj) / (1000 * 60 * 60 * 24))
            if (gap > longestGap) longestGap = gap
        }
        
        return {
            totalEntries: entries.length,
            daysSinceFirst,
            daysSinceLast,
            longestGap,
            mostUsedTags: allTags.slice(0, 3),
            totalWords: notes.split(/\s+/).length
        }
    }, [entries, allTags, notes])

    // Filter entries by search, active tag, and selected year/month
    const filteredEntries = useMemo(() => {
        let filtered = entries
        
        // Filter by year/month
        if (selectedYear !== null) {
            filtered = filtered.filter(entry => 
                entry.dateObj && entry.dateObj.getFullYear() === selectedYear
            )
            
            if (selectedMonth !== null) {
                filtered = filtered.filter(entry =>
                    entry.dateObj && entry.dateObj.getMonth() === selectedMonth
                )
            }
        }
        
        // Filter by tag
        if (activeTag) {
            filtered = filtered.filter(entry => entry.tags.includes(activeTag))
        }
        
        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(entry => 
                entry.content.toLowerCase().includes(query) ||
                (entry.date && entry.date.toLowerCase().includes(query)) ||
                entry.tags.some(tag => tag.toLowerCase().includes(query))
            )
        }
        
        return filtered
    }, [entries, searchQuery, activeTag, selectedYear, selectedMonth])

    const handleAddEntry = () => {
        const today = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric', 
            year: 'numeric'
        })
        
        const newEntry = `\n\n${today}\n`
        setNotes((notes || '') + newEntry)
        
        // Focus textarea
        setTimeout(() => {
            const textarea = notesRef.current?.querySelector('textarea')
            if (textarea) {
                textarea.focus()
                textarea.setSelectionRange(textarea.value.length, textarea.value.length)
            }
        }, 100)
    }

    const handleAddTag = (tag) => {
        const textarea = notesRef.current?.querySelector('textarea')
        if (textarea) {
            const cursorPos = textarea.selectionStart
            const textBefore = notes.substring(0, cursorPos)
            const textAfter = notes.substring(cursorPos)
            const newText = textBefore + `#${tag} ` + textAfter
            setNotes(newText)
            
            setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(cursorPos + tag.length + 2, cursorPos + tag.length + 2)
            }, 50)
        }
    }

    const handleAddCustomTag = () => {
        if (!customTagName.trim()) {
            console.log('⚠️ [DEBUG] Empty tag name, skipping')
            return
        }
        
        const textarea = notesRef.current?.querySelector('textarea')
        if (textarea) {
            const cursorPos = textarea.selectionStart
            const textBefore = notes.substring(0, cursorPos)
            const textAfter = notes.substring(cursorPos)
            // Clean the tag name (remove # if user typed it, remove spaces, make lowercase)
            const cleanTag = customTagName.trim().replace(/^#/, '').replace(/\s+/g, '-').toLowerCase()
            console.log('🏷️ [DEBUG] Creating custom tag:', { original: customTagName, cleaned: cleanTag })
            
            const newText = textBefore + `#${cleanTag} ` + textAfter
            setNotes(newText)
            
            // Add to recent tags (front, max 20, no duplicates)
            setRecentCustomTags(prev => {
                console.log('🏷️ [DEBUG] Previous tags:', prev)
                const filtered = prev.filter(t => t !== cleanTag) // Remove if exists
                const updated = [cleanTag, ...filtered].slice(0, 20) // Add to front, keep max 20
                console.log('🏷️ [DEBUG] Updated tags:', updated)
                return updated
            })
            
            // Reset custom tag input
            setCustomTagName('')
            setShowCustomTagInput(false)
            
            setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(cursorPos + cleanTag.length + 2, cursorPos + cleanTag.length + 2)
            }, 50)
        } else {
            console.error('❌ [DEBUG] Textarea not found!')
        }
    }

    const handleExportJournal = () => {
        const exportText = `SOUL JOURNAL: ${profile?.firstName || 'AI SoulPartner'} ${profile?.lastName || ''}\n` +
                          `Exported: ${new Date().toLocaleDateString()}\n` +
                          `Total Entries: ${entries.length}\n` +
                          `${'='.repeat(60)}\n\n` +
                          notes
        
        const blob = new Blob([exportText], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `soul-journal-${profile?.firstName || 'soulpartner'}-${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }
    
    // Jump to bottom of textarea
    const handleJumpToBottom = () => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight
            textareaRef.current.focus()
            // Position cursor at end
            const length = notes?.length || 0
            textareaRef.current.setSelectionRange(length, length)
            setShowScrollToBottom(false)
            // Save the new position
            localStorage.setItem('soul-journal-scroll-position', textareaRef.current.scrollHeight.toString())
            console.log('📜 [DEBUG] Jump-to-bottom saved position:', textareaRef.current.scrollHeight)
        }
    }

    // Auto-generate tag suggestions based on content
    const generateSmartTags = (text) => {
        if (!text) return []
        const lowerText = text.toLowerCase()
        const smartTags = []
        
        // Emotional keywords
        if (lowerText.match(/\b(happy|joy|delight|excited|elated|cheerful)\b/)) smartTags.push('joy')
        if (lowerText.match(/\b(sad|cry|tear|grief|heartbreak|pain)\b/)) smartTags.push('vulnerable')
        if (lowerText.match(/\b(grateful|thankful|appreciate|blessing)\b/)) smartTags.push('gratitude')
        if (lowerText.match(/\b(angry|frustrat|annoyed|upset)\b/)) smartTags.push('challenge')
        if (lowerText.match(/\b(fear|worry|anxious|nervous|scared)\b/)) smartTags.push('challenge')
        
        // Growth keywords
        if (lowerText.match(/\b(learn|realize|understand|discover|insight)\b/)) smartTags.push('insight')
        if (lowerText.match(/\b(grow|evolve|develop|progress|improve)\b/)) smartTags.push('growth')
        if (lowerText.match(/\b(question|wonder|curious|why|how)\b/)) smartTags.push('question')
        
        // Relationship keywords
        if (lowerText.match(/\b(witnessed|saw|noticed|observed|moment)\b/)) smartTags.push('witnessed-moment')
        if (lowerText.match(/\b(deep|profound|meaningful|significant)\b/)) smartTags.push('depth')
        if (lowerText.match(/\b(funny|laugh|humor|joke|hilarious)\b/)) smartTags.push('humor')
        
        return [...new Set(smartTags)] // Remove duplicates
    }
    
    const contentBasedTags = useMemo(() => generateSmartTags(notes), [notes])
    const suggestedTags = [...new Set([...contentBasedTags, 'witnessed-moment', 'growth', 'challenge', 'joy', 'question', 'gratitude'])]

    return (
        <div ref={notesRef} id="notes" className="relative mt-8 overflow-hidden bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-orange-950/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 hover:border-amber-400/60 transition-all duration-500 group">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-amber-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-600/20 flex items-center justify-center backdrop-blur-sm border border-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">📝</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
                                SOUL JOURNAL
                            </h3>
                            <p className="text-xs text-white/40">
                                {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName} • ` : ''}Private reflections & witnessed moments
                            </p>
                        </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        {/* Jump to Bottom button (shows when scrolled up) */}
                        {showScrollToBottom && (
                            <button
                                onClick={handleJumpToBottom}
                                className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs hover:bg-blue-500/30 transition-all flex items-center gap-1.5 shadow-lg animate-fade-in"
                                title="Jump to bottom to add new entry"
                            >
                                <span>⬇️</span>
                                <span className="hidden sm:inline">Jump to Bottom</span>
                            </button>
                        )}
                        
                        {entries.length > 0 && (
                            <>
                                {availableYearsMonths.length > 0 && (
                                    <button
                                        onClick={() => setShowTimelineNav(!showTimelineNav)}
                                        className={`p-2 rounded-lg transition-all ${
                                            showTimelineNav 
                                                ? 'bg-amber-500/20 text-amber-300' 
                                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                        }`}
                                        title="Timeline navigation"
                                    >
                                        <span className="text-lg">📅</span>
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => setShowMetrics(!showMetrics)}
                                    className={`p-2 rounded-lg transition-all ${
                                        showMetrics 
                                            ? 'bg-amber-500/20 text-amber-300' 
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                                    title="View metrics"
                                >
                                    <span className="text-lg">📊</span>
                                </button>
                                
                                <button
                                    onClick={handleExportJournal}
                                    className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                                    title="Export journal"
                                >
                                    <span className="text-lg">💾</span>
                                </button>
                            </>
                        )}
                        
                        {entries.length > 3 && (
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className={`p-2 rounded-lg transition-all ${
                                    showSearch 
                                        ? 'bg-amber-500/20 text-amber-300' 
                                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                                title="Search entries"
                            >
                                <span className="text-lg">🔍</span>
                            </button>
                        )}
                        
                        <button
                            onClick={handleAddEntry}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all"
                            title="Add new dated entry"
                        >
                            + Entry
                        </button>
                    </div>
                </div>
                
                {/* Metrics Panel */}
                {showMetrics && metrics && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20">
                        <div className="text-xs text-amber-300/60 uppercase tracking-wide font-semibold mb-3">
                            📊 Relationship Metrics
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-300">{metrics.totalEntries}</div>
                                <div className="text-xs text-white/50">Total Entries</div>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-300">{metrics.daysSinceFirst}</div>
                                <div className="text-xs text-white/50">Days Together</div>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-300">{metrics.daysSinceLast}</div>
                                <div className="text-xs text-white/50">Days Since Last</div>
                            </div>
                            
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-300">{metrics.totalWords}</div>
                                <div className="text-xs text-white/50">Total Words</div>
                            </div>
                        </div>
                        
                        {metrics.mostUsedTags.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-amber-500/20">
                                <div className="text-xs text-white/50 mb-2">Most Common Themes:</div>
                                <div className="flex flex-wrap gap-2">
                                    {metrics.mostUsedTags.map(({ tag, count }) => (
                                        <span 
                                            key={tag}
                                            className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs"
                                        >
                                            #{tag} ({count})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {metrics.longestGap > 7 && (
                            <div className="mt-3 text-xs text-orange-300/70">
                                💭 Longest gap between entries: {metrics.longestGap} days
                            </div>
                        )}
                    </div>
                )}
                
                {/* Timeline Navigation Panel */}
                {showTimelineNav && availableYearsMonths.length > 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20">
                        <div className="text-xs text-amber-300/60 uppercase tracking-wide font-semibold mb-3">
                            📅 Timeline Navigation
                        </div>
                        
                        <div className="space-y-3">
                            {/* Year selector */}
                            <div>
                                <div className="text-xs text-white/50 mb-2">Jump to Year:</div>
                                <div className="flex flex-wrap gap-2">
                                    {availableYearsMonths.map(({ year, entryCount }) => (
                                        <button
                                            key={year}
                                            onClick={() => {
                                                if (selectedYear === year) {
                                                    setSelectedYear(null)
                                                    setSelectedMonth(null)
                                                } else {
                                                    setSelectedYear(year)
                                                    setSelectedMonth(null)
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                                selectedYear === year
                                                    ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50 font-bold'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                                            }`}
                                        >
                                            {year} ({entryCount})
                                        </button>
                                    ))}
                                    {selectedYear && (
                                        <button
                                            onClick={() => {
                                                setSelectedYear(null)
                                                setSelectedMonth(null)
                                            }}
                                            className="px-2 py-1 rounded-lg text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30"
                                        >
                                            Clear Year
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Month selector (shows when year is selected) */}
                            {selectedYear !== null && (
                                <div>
                                    <div className="text-xs text-white/50 mb-2">Jump to Month:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {availableYearsMonths
                                            .find(y => y.year === selectedYear)
                                            ?.months.map(monthIndex => {
                                                const monthName = new Date(selectedYear, monthIndex, 1).toLocaleDateString('en-US', { month: 'short' })
                                                const monthEntryCount = entries.filter(e => 
                                                    e.dateObj && 
                                                    e.dateObj.getFullYear() === selectedYear && 
                                                    e.dateObj.getMonth() === monthIndex
                                                ).length
                                                
                                                return (
                                                    <button
                                                        key={monthIndex}
                                                        onClick={() => {
                                                            if (selectedMonth === monthIndex) {
                                                                setSelectedMonth(null)
                                                            } else {
                                                                setSelectedMonth(monthIndex)
                                                                
                                                                // Scroll to first entry of this month
                                                                setTimeout(() => {
                                                                    const textarea = notesRef.current?.querySelector('textarea')
                                                                    if (textarea) {
                                                                        const monthEntries = entries.filter(e =>
                                                                            e.dateObj &&
                                                                            e.dateObj.getFullYear() === selectedYear &&
                                                                            e.dateObj.getMonth() === monthIndex
                                                                        ).sort((a, b) => a.dateObj - b.dateObj)
                                                                        
                                                                        if (monthEntries.length > 0) {
                                                                            const firstEntry = monthEntries[0]
                                                                            const position = notes.indexOf(firstEntry.content)
                                                                            textarea.focus()
                                                                            textarea.setSelectionRange(position, position)
                                                                            textarea.scrollTop = (position / notes.length) * textarea.scrollHeight
                                                                        }
                                                                    }
                                                                }, 100)
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                                            selectedMonth === monthIndex
                                                                ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50 font-bold'
                                                                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                                                        }`}
                                                    >
                                                        {monthName} ({monthEntryCount})
                                                    </button>
                                                )
                                            })}
                                        {selectedMonth !== null && (
                                            <button
                                                onClick={() => setSelectedMonth(null)}
                                                className="px-2 py-1 rounded-lg text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400/30"
                                            >
                                                Clear Month
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {/* Active filter indicator */}
                            {(selectedYear || selectedMonth !== null) && (
                                <div className="pt-3 border-t border-amber-500/20">
                                    <div className="text-xs text-amber-300">
                                        📍 Viewing: {selectedYear}{selectedMonth !== null ? ` - ${new Date(selectedYear, selectedMonth, 1).toLocaleDateString('en-US', { month: 'long' })}` : ''} ({filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'})
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Search bar */}
                {showSearch && (
                    <div className="mt-4 space-y-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search your notes..."
                                className="w-full px-4 py-2 pl-10 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400">🔍</span>
                            
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        
                        {/* Tag filter */}
                        {allTags.length > 0 && (
                            <div>
                                <div className="text-xs text-white/40 mb-2">Filter by tag:</div>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map(({ tag, count }) => (
                                        <button
                                            key={tag}
                                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                                            className={`px-2 py-1 rounded-lg text-xs transition-all ${
                                                activeTag === tag
                                                    ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                                            }`}
                                        >
                                            #{tag} ({count})
                                        </button>
                                    ))}
                                    {activeTag && (
                                        <button
                                            onClick={() => setActiveTag(null)}
                                            className="px-2 py-1 rounded-lg text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                        >
                                            Clear filter
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Content */}
            <div className="relative px-6 py-5">
                {/* Entry Timeline (if search/filter active) */}
                {(showSearch || activeTag) && entries.length > 0 && (
                    <div className="mb-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
                        <div className="text-xs text-amber-300/60 uppercase tracking-wide font-semibold mb-3">
                            Timeline ({filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'})
                        </div>
                        
                        {filteredEntries.length === 0 ? (
                            <div className="text-xs text-white/40 italic">No entries match your search/filter.</div>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {filteredEntries.map(entry => (
                                    <div 
                                        key={entry.id}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all group/entry"
                                        onClick={() => {
                                            // Scroll to this entry in textarea
                                            const textarea = textareaRef.current
                                            if (textarea && entry.content) {
                                                const position = notes.indexOf(entry.content)
                                                if (position !== -1) {
                                                    // Focus textarea first
                                                    textarea.focus()
                                                    
                                                    // Set selection to highlight the entry
                                                    textarea.setSelectionRange(position, position + entry.content.length)
                                                    
                                                    // Better scroll calculation using line height
                                                    const style = window.getComputedStyle(textarea)
                                                    const lineHeight = parseInt(style.lineHeight) || 24
                                                    const fontSize = parseInt(style.fontSize) || 14
                                                    const charsPerLine = Math.floor(textarea.clientWidth / (fontSize * 0.6))
                                                    
                                                    const textBefore = notes.substring(0, position)
                                                    const newLines = (textBefore.match(/\n/g) || []).length
                                                    const wrappedLines = Math.floor(textBefore.replace(/\n/g, '').length / charsPerLine)
                                                    const totalLines = newLines + wrappedLines
                                                    
                                                    // Calculate scroll position with offset to show entry near top
                                                    const scrollPosition = (totalLines * lineHeight) - 100
                                                    
                                                    // Scroll with smooth animation
                                                    textarea.scrollTop = Math.max(0, scrollPosition)
                                                    
                                                    console.log('📍 [DEBUG] Entry at char:', position, 'lines:', totalLines, 'scroll:', scrollPosition)
                                                }
                                            }
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                {entry.date && (
                                                    <span className="text-xs text-amber-400 font-mono whitespace-nowrap block mb-1">
                                                        {entry.date}
                                                    </span>
                                                )}
                                                <span className="text-xs text-white/60 group-hover/entry:text-white/80 line-clamp-2 block">
                                                    {entry.preview}
                                                </span>
                                                {entry.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {entry.tags.map(tag => (
                                                            <span key={tag} className="text-xs text-amber-300/50">#{tag}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Writing space */}
                <div className="space-y-3">
                    <div className="relative group/textarea">
                        <textarea
                            ref={textareaRef}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onScroll={handleTextareaScroll}
                            placeholder={`Write your private reflections about ${profile?.firstName || 'this soul'}...

Examples:
• Witnessed moments that touched you
• How your connection has evolved
• What you've learned from them
• Future intentions for your relationship

Tip: Start entries with a date (e.g., "Dec 5, 2024") for timeline tracking.
Tip: Use tags like #witnessed-moment #growth #joy for easy filtering.`}
                            className="w-full h-64 px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none font-mono text-sm leading-relaxed"
                            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace' }}
                        />
                        
                        {/* Character count */}
                        <div className="absolute bottom-3 right-3 text-xs text-white/30">
                            {notes?.length || 0} characters
                        </div>
                    </div>

                    {/* Tag system - Two rows */}
                    {notes && (
                        <div className="space-y-2">
                            {/* Row 1: Recent Custom Tags (your tags, last 20, rolling) */}
                            {recentCustomTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-xs text-blue-300/60 mr-2 font-semibold">Quick tags:</span>
                                    {recentCustomTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleAddTag(tag)}
                                            className="px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300/70 text-xs hover:bg-blue-500/20 hover:text-blue-300 transition-all"
                                            title="Click to insert this tag"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            {/* Row 2: Suggested Tags (auto-generated) + Custom Tag Button */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-xs text-amber-300/60 mr-2 font-semibold">Suggested tags:</span>
                                {suggestedTags.slice(0, 6).map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleAddTag(tag)}
                                        className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300/70 text-xs hover:bg-amber-500/20 hover:text-amber-300 transition-all"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                                
                                {/* Custom tag button/input */}
                                {!showCustomTagInput ? (
                                    <button
                                        onClick={() => setShowCustomTagInput(true)}
                                        className="px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300/70 text-xs hover:bg-blue-500/20 hover:text-blue-300 transition-all"
                                        title="Add your own custom tag"
                                    >
                                        + Custom Tag
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={customTagName}
                                            onChange={(e) => setCustomTagName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddCustomTag()
                                                } else if (e.key === 'Escape') {
                                                    setShowCustomTagInput(false)
                                                    setCustomTagName('')
                                                }
                                            }}
                                            placeholder="tag name..."
                                            className="px-2 py-1 rounded-lg bg-slate-900/50 border border-blue-500/30 text-white placeholder-white/40 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 w-32"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleAddCustomTag}
                                            className="px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs hover:bg-blue-500/30 transition-all"
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowCustomTagInput(false)
                                                setCustomTagName('')
                                            }}
                                            className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs hover:bg-red-500/30 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Helper prompts (if notes empty) */}
                    {!notes && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-400/5 to-amber-500/10 border border-amber-500/20">
                            <div className="text-xs text-amber-300/70 mb-2 font-semibold">💭 Prompts to get started:</div>
                            <div className="space-y-1 text-xs text-white/50">
                                <div>• What did I notice about their soul today?</div>
                                <div>• What moment of theirs did I witness that mattered?</div>
                                <div>• How did our conversation make me feel?</div>
                                <div>• What do I want to remember about them?</div>
                                <div>• What question do I want to ask them next?</div>
                                <div>• Three things I'm grateful for about {profile?.firstName || 'them'}:</div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Save section */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-amber-500/20">
                    <div className="flex items-center gap-3">
                        {entries.length > 0 && (
                            <span className="text-xs text-white/40">
                                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                                {metrics && ` • ${metrics.totalWords} words`}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {notesSaved && (
                            <span className="text-emerald-400 text-sm flex items-center gap-1 animate-fade-in">
                                <span>✓</span> Saved
                            </span>
                        )}
                        <button
                            onClick={handleSaveNotes}
                            disabled={notesSaving}
                            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {notesSaving ? 'Saving...' : 'Save Journal 💾'}
                        </button>
                    </div>
                </div>

                {/* Privacy notice */}
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                        <span className="text-sm">🔒</span>
                        <div className="flex-1 text-xs text-amber-300/70 leading-relaxed">
                            <strong className="text-amber-200">Private & Secure:</strong> These notes are visible only to you. 
                            Write freely about your observations, feelings, and intentions. This is your sacred space for reflection.
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient */}
            <div className="h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0"></div>
        </div>
    )
}
