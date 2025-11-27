import React from 'react'

export default function NotesPanel({ 
    notes, 
    setNotes, 
    notesSaving, 
    notesSaved, 
    handleSaveNotes,
    notesRef 
}) {
    return (
        <div ref={notesRef} id="notes" className="mt-8 bg-gradient-to-br from-cyan-600/20 to-teal-600/20 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30 fade-in delay-6">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📝</span>
                <div>
                    <h3 className="text-xl font-bold text-white">Personal Notes</h3>
                    <p className="text-white/60 text-sm">Your private thoughts about this person</p>
                </div>
            </div>
            
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here... e.g., 'First date went well, he's very thoughtful. Loves hiking and has a great sense of humor. Second date planned for Saturday!'"
                className="w-full h-32 px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
            />
            
            <div className="flex items-center justify-between mt-3">
                <span className="text-white/40 text-xs">
                    {notes.length > 0 ? `${notes.length} characters` : 'No notes yet'}
                </span>
                
                <div className="flex items-center gap-3">
                    {notesSaved && (
                        <span className="text-green-400 text-sm flex items-center gap-1">
                            <span>✓</span> Saved!
                        </span>
                    )}
                    <button
                        onClick={handleSaveNotes}
                        disabled={notesSaving}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {notesSaving ? 'Saving...' : 'Save Notes 💾'}
                    </button>
                </div>
            </div>
        </div>
    )
}
