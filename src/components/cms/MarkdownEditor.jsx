/**
 * MARKDOWN EDITOR
 * Full-screen editor with side-by-side markdown and HTML preview
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'

// Markdown to HTML converter
function markdownToHtml(markdown) {
  if (!markdown) return ''

  // Process line by line for better control
  const lines = markdown.split('\n')
  const htmlLines = []
  let inCodeBlock = false
  let codeBlockContent = []
  let inList = false
  let listItems = []

  const flushList = () => {
    if (listItems.length > 0) {
      htmlLines.push('<ul>' + listItems.join('') + '</ul>')
      listItems = []
      inList = false
    }
  }

  const processInline = (text) => {
    return text
      // Escape HTML entities
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold and Italic (order matters - do combined first)
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    // Code block handling
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        htmlLines.push('<pre><code>' + codeBlockContent.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>')
        codeBlockContent = []
        inCodeBlock = false
      } else {
        // Start code block
        flushList()
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
      continue
    }

    // Empty line
    if (!trimmedLine) {
      flushList()
      htmlLines.push('')
      continue
    }

    // Headers
    const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
    if (headerMatch) {
      flushList()
      const level = headerMatch[1].length
      htmlLines.push(`<h${level}>${processInline(headerMatch[2])}</h${level}>`)
      continue
    }

    // Horizontal rule
    if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
      flushList()
      htmlLines.push('<hr />')
      continue
    }

    // Blockquote
    if (trimmedLine.startsWith('> ')) {
      flushList()
      htmlLines.push(`<blockquote>${processInline(trimmedLine.slice(2))}</blockquote>`)
      continue
    }

    // Unordered list item
    const ulMatch = trimmedLine.match(/^[-*+]\s+(.+)$/)
    if (ulMatch) {
      inList = true
      listItems.push(`<li>${processInline(ulMatch[1])}</li>`)
      continue
    }

    // Ordered list item
    const olMatch = trimmedLine.match(/^\d+\.\s+(.+)$/)
    if (olMatch) {
      inList = true
      listItems.push(`<li>${processInline(olMatch[1])}</li>`)
      continue
    }

    // Regular paragraph line
    flushList()
    htmlLines.push(`<p>${processInline(trimmedLine)}</p>`)
  }

  // Flush any remaining list
  flushList()

  // Join and clean up multiple empty lines
  let html = htmlLines.join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/<\/p>\n<p>/g, '</p>\n<p>')

  return html
}

export default function MarkdownEditor({
  content,
  title,
  onSave,
  onClose
}) {
  const [markdown, setMarkdown] = useState(content || '')
  const [showPreview, setShowPreview] = useState(true)
  const [syncScroll, setSyncScroll] = useState(false)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const previewRef = useRef(null)
  const editorContainerRef = useRef(null)
  const searchInputRef = useRef(null)

  // Search state
  const [showSearch, setShowSearch] = useState(false)
  const [searchInput, setSearchInput] = useState('') // What user types
  const [searchQuery, setSearchQuery] = useState('') // Active search (after pressing Enter)
  const [searchMatches, setSearchMatches] = useState([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [caseSensitive, setCaseSensitive] = useState(false)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [markdown])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setShowSearch(true)
        setTimeout(() => searchInputRef.current?.focus(), 50)
      }
      if (e.key === 'Escape') {
        if (showSearch) {
          e.preventDefault()
          setShowSearch(false)
          setSearchInput('')
          setSearchQuery('')
          setSearchMatches([])
          textareaRef.current?.focus()
        } else {
          e.preventDefault()
          onClose()
        }
      }
      // F3 or Ctrl+G for next match
      if (e.key === 'F3' || ((e.ctrlKey || e.metaKey) && e.key === 'g')) {
        e.preventDefault()
        if (searchMatches.length > 0) {
          goToNextMatch()
        }
      }
      // Shift+F3 for previous match
      if (e.key === 'F3' && e.shiftKey) {
        e.preventDefault()
        if (searchMatches.length > 0) {
          goToPrevMatch()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [markdown, onClose, showSearch, searchMatches, currentMatchIndex])

  // Find all matches when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setSearchMatches([])
      setCurrentMatchIndex(0)
      return
    }

    const matches = []
    const searchText = caseSensitive ? markdown : markdown.toLowerCase()
    const query = caseSensitive ? searchQuery : searchQuery.toLowerCase()

    let index = searchText.indexOf(query)
    while (index !== -1) {
      matches.push({ start: index, end: index + searchQuery.length })
      index = searchText.indexOf(query, index + 1)
    }

    setSearchMatches(matches)
    setCurrentMatchIndex(matches.length > 0 ? 0 : -1)

    // Highlight first match
    if (matches.length > 0) {
      highlightMatch(matches[0])
    }
  }, [searchQuery, markdown, caseSensitive])

  // Highlight a match in the textarea
  const highlightMatch = (match) => {
    const textarea = textareaRef.current
    if (!textarea || !match) return

    textarea.focus()
    textarea.setSelectionRange(match.start, match.end)

    // Scroll the match into view
    const lineHeight = 20
    const charsPerLine = 80
    const approxLine = Math.floor(match.start / charsPerLine)
    const scrollTop = approxLine * lineHeight - 100
    textarea.scrollTop = Math.max(0, scrollTop)
  }

  // Navigate to next match
  const goToNextMatch = () => {
    if (searchMatches.length === 0) return
    const nextIndex = (currentMatchIndex + 1) % searchMatches.length
    setCurrentMatchIndex(nextIndex)
    highlightMatch(searchMatches[nextIndex])
  }

  // Navigate to previous match
  const goToPrevMatch = () => {
    if (searchMatches.length === 0) return
    const prevIndex = currentMatchIndex <= 0 ? searchMatches.length - 1 : currentMatchIndex - 1
    setCurrentMatchIndex(prevIndex)
    highlightMatch(searchMatches[prevIndex])
  }

  // Execute search
  const executeSearch = () => {
    if (!searchInput.trim()) {
      setSearchQuery('')
      setSearchMatches([])
      setCurrentMatchIndex(0)
      return
    }
    setSearchQuery(searchInput.trim())
  }

  // Handle search input keydown (Enter to search/next, Shift+Enter for prev)
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!searchQuery || searchQuery !== searchInput.trim()) {
        // First Enter: execute search
        executeSearch()
      } else if (e.shiftKey) {
        // Shift+Enter: previous match
        goToPrevMatch()
      } else {
        // Enter: next match
        goToNextMatch()
      }
    }
  }

  // Sync scroll from editor to preview
  const handleSyncScroll = () => {
    const editor = editorContainerRef.current
    const textarea = textareaRef.current
    const preview = previewRef.current
    if (!preview) return

    // Try container first, then textarea
    let scrollingElement = editor
    if (editor && editor.scrollTop === 0 && textarea && textarea.scrollTop > 0) {
      scrollingElement = textarea
    }
    if (!scrollingElement) return

    const maxScroll = scrollingElement.scrollHeight - scrollingElement.clientHeight
    if (maxScroll <= 0) return

    // Calculate scroll percentage of editor
    const scrollPercent = scrollingElement.scrollTop / maxScroll
    // Apply same percentage to preview
    const previewScrollTop = scrollPercent * (preview.scrollHeight - preview.clientHeight)
    preview.scrollTo({ top: previewScrollTop, behavior: 'smooth' })
  }

  // Handle editor scroll for sync
  const handleEditorScroll = useCallback((e) => {
    if (!syncScroll || !showPreview) return

    const preview = previewRef.current
    if (!preview) return

    // Get the element that's actually scrolling (could be container or textarea)
    const scrollingElement = e?.target || editorContainerRef.current
    if (!scrollingElement) return

    const maxScroll = scrollingElement.scrollHeight - scrollingElement.clientHeight
    if (maxScroll <= 0) return

    const scrollPercent = scrollingElement.scrollTop / maxScroll
    const previewMaxScroll = preview.scrollHeight - preview.clientHeight
    preview.scrollTop = scrollPercent * previewMaxScroll
  }, [syncScroll, showPreview])

  // Import markdown file
  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        setMarkdown(content)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Export as markdown file
  const handleExport = () => {
    const filename = title?.toLowerCase().replace(/\s+/g, '-') || 'content'
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle save
  const handleSave = () => {
    onSave(markdown)
  }

  // Insert markdown syntax helper
  const insertSyntax = (before, after = '', placeholder = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = markdown.substring(start, end) || placeholder

    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end)
    setMarkdown(newText)

    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-800">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">
            Content Editor {title && <span className="text-amber-400">- {title}</span>}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowPreview(false)
              }}
              className={`px-3 py-1 text-sm rounded ${!showPreview ? 'bg-amber-500 text-slate-900' : 'text-white/60 hover:text-white'}`}
            >
              Editor Only
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowPreview(true)
              }}
              className={`px-3 py-1 text-sm rounded ${showPreview ? 'bg-amber-500 text-slate-900' : 'text-white/60 hover:text-white'}`}
            >
              Side by Side
            </button>
          </div>

          {/* Sync Scroll Controls - only show when side-by-side */}
          {showPreview && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSyncScroll()
                }}
                className="px-3 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg text-sm flex items-center gap-2"
                title="Sync preview to editor position"
              >
                <span>⬇️</span> Sync Now
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSyncScroll(!syncScroll)
                }}
                className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  syncScroll
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                }`}
                title={syncScroll ? 'Disable auto-sync' : 'Enable auto-sync scrolling'}
              >
                <span>{syncScroll ? '🔗' : '🔓'}</span> {syncScroll ? 'Auto-Sync ON' : 'Auto-Sync'}
              </button>
            </div>
          )}

          {/* Import/Export */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm flex items-center gap-2"
          >
            <span>📥</span> Import
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm flex items-center gap-2"
          >
            <span>📤</span> Export
          </button>

          {/* Cancel/Save */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg"
          >
            Save Content
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-white/10 bg-slate-800/50">
        <button onClick={() => insertSyntax('# ', '', 'Heading')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Heading 1">H1</button>
        <button onClick={() => insertSyntax('## ', '', 'Heading')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Heading 2">H2</button>
        <button onClick={() => insertSyntax('### ', '', 'Heading')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Heading 3">H3</button>
        <div className="w-px h-6 bg-white/20 mx-2" />
        <button onClick={() => insertSyntax('**', '**', 'bold')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded font-bold" title="Bold">B</button>
        <button onClick={() => insertSyntax('*', '*', 'italic')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded italic" title="Italic">I</button>
        <button onClick={() => insertSyntax('`', '`', 'code')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded font-mono" title="Inline Code">&lt;/&gt;</button>
        <div className="w-px h-6 bg-white/20 mx-2" />
        <button onClick={() => insertSyntax('- ', '', 'list item')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Bullet List">• List</button>
        <button onClick={() => insertSyntax('1. ', '', 'list item')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Numbered List">1. List</button>
        <button onClick={() => insertSyntax('> ', '', 'quote')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Blockquote">" Quote</button>
        <div className="w-px h-6 bg-white/20 mx-2" />
        <button onClick={() => insertSyntax('[', '](url)', 'link text')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Link">🔗</button>
        <button onClick={() => insertSyntax('![alt](', ')', 'image-url')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Image">🖼️</button>
        <button onClick={() => insertSyntax('\n---\n', '', '')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Horizontal Rule">—</button>
        <button onClick={() => insertSyntax('```\n', '\n```', 'code block')} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded" title="Code Block">{ }</button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => {
            setShowSearch(!showSearch)
            if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 50)
          }}
          className={`p-2 rounded flex items-center gap-1 text-sm ${showSearch ? 'bg-amber-500/20 text-amber-400' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
          title="Find (Ctrl+F)"
        >
          🔍 Find
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-3 px-6 py-2 border-b border-white/10 bg-slate-700/50">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-white/60 text-sm">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Type and press Enter to search..."
              className="flex-1 max-w-md px-3 py-1.5 bg-slate-800 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-amber-500"
              autoFocus
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                executeSearch()
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-medium rounded"
              title="Search (Enter)"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setCaseSensitive(!caseSensitive)}
              className={`px-2 py-1 text-xs rounded ${caseSensitive ? 'bg-amber-500 text-slate-900' : 'bg-slate-600 text-white/60 hover:text-white'}`}
              title="Case Sensitive"
            >
              Aa
            </button>
          </div>

          {/* Match counter and navigation */}
          <div className="flex items-center gap-2">
            <span className={`text-sm min-w-[80px] text-center ${searchMatches.length > 0 ? 'text-amber-400' : 'text-white/40'}`}>
              {searchQuery ? (
                searchMatches.length > 0
                  ? `${currentMatchIndex + 1} of ${searchMatches.length}`
                  : 'No matches'
              ) : (
                ''
              )}
            </span>
            <button
              type="button"
              onClick={goToPrevMatch}
              disabled={searchMatches.length === 0}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous (Shift+Enter)"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={goToNextMatch}
              disabled={searchMatches.length === 0}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next (Enter)"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSearch(false)
                setSearchInput('')
                setSearchQuery('')
                setSearchMatches([])
                textareaRef.current?.focus()
              }}
              className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className={`flex-1 flex overflow-hidden ${showPreview ? '' : ''}`}>
        {/* Markdown Editor */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2 border-r border-white/10' : 'w-full'}`}>
          <div className="px-4 py-2 text-sm text-white/40 bg-slate-800/30 border-b border-white/10 flex items-center justify-between">
            <span>Markdown Source</span>
            {syncScroll && showPreview && <span className="text-purple-400 text-xs">🔗 Scroll synced</span>}
          </div>
          <div ref={editorContainerRef} className="flex-1 overflow-auto" onScroll={handleEditorScroll}>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onScroll={handleEditorScroll}
              className="w-full min-h-full p-4 bg-slate-900 text-white font-mono text-sm resize-none focus:outline-none"
              placeholder="# Start writing your content...

Use **bold** and *italic* for emphasis.

## Subheadings organize your content

- Bullet points for lists
- Another item

> Blockquotes for important notes

```
Code blocks for examples
```
"
              spellCheck={false}
            />
          </div>
        </div>

        {/* HTML Preview */}
        {showPreview && (
          <div className="w-1/2 flex flex-col">
            <div className="px-4 py-2 text-sm text-white/40 bg-slate-800/30 border-b border-white/10 flex items-center justify-between">
              <span>HTML Preview (How users will see it)</span>
              {syncScroll && <span className="text-purple-400 text-xs">🔗 Scroll synced</span>}
            </div>
            <div
              ref={previewRef}
              className="flex-1 p-6 overflow-auto bg-white text-slate-900 prose prose-slate max-w-none"
              style={{
                fontSize: '14px',
                lineHeight: '1.5',
              }}
            >
              <style>{`
                .prose h1 { font-size: 1.75em; font-weight: bold; margin: 0.4em 0 0.2em 0; color: #1e293b; }
                .prose h2 { font-size: 1.4em; font-weight: bold; margin: 0.4em 0 0.2em 0; color: #334155; }
                .prose h3 { font-size: 1.15em; font-weight: bold; margin: 0.3em 0 0.15em 0; color: #475569; }
                .prose p { margin: 0.4em 0; }
                .prose ul, .prose ol { margin: 0.4em 0; padding-left: 1.5em; }
                .prose li { margin: 0.15em 0; }
                .prose blockquote { border-left: 4px solid #f59e0b; padding-left: 1em; margin: 0.5em 0; color: #64748b; font-style: italic; }
                .prose code { background: #f1f5f9; padding: 0.15em 0.3em; border-radius: 3px; font-size: 0.9em; }
                .prose pre { background: #1e293b; color: #e2e8f0; padding: 0.75em; border-radius: 6px; overflow-x: auto; margin: 0.5em 0; }
                .prose pre code { background: none; padding: 0; }
                .prose hr { border: none; border-top: 2px solid #e2e8f0; margin: 1em 0; }
                .prose a { color: #2563eb; text-decoration: underline; }
                .prose img { max-width: 100%; border-radius: 6px; }
                .prose strong { font-weight: 700; }
                .prose em { font-style: italic; }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }} />
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-2 border-t border-white/10 bg-slate-800/50 flex items-center justify-between text-sm text-white/40">
        <div>
          {markdown.length} characters | {markdown.split(/\s+/).filter(w => w).length} words | {markdown.split('\n').length} lines
        </div>
        <div className="flex items-center gap-4">
          <span>Ctrl+F to find</span>
          <span>Esc to cancel</span>
          <span>Ctrl+S to save</span>
        </div>
      </div>
    </div>
  )
}
