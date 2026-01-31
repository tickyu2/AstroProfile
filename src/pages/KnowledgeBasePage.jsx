/**
 * KnowledgeBasePage.jsx
 * Management interface for AI SoulPartner's Knowledge Base
 *
 * Features:
 * - View all documents organized by category
 * - Create new documents with markdown editor
 * - Edit existing documents
 * - Set priority and always-include flags
 * - Import .md files
 * - View token usage stats
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useKnowledgeBase, KNOWLEDGE_CATEGORIES } from '../contexts/KnowledgeBaseContext';

export default function KnowledgeBasePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    deleteAllProfileSummaries,
    getStats,
    initializeKB
  } = useKnowledgeBase();

  // Initialize KB when page mounts (this page needs KB documents)
  useEffect(() => {
    initializeKB();
  }, [initializeKB]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingDoc, setEditingDoc] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for new/edit document
  const [formData, setFormData] = useState({
    title: '',
    category: 'genesis',
    content: '',
    summary: '',
    alwaysInclude: false,
    priority: 5,
    tags: ''
  });

  const stats = getStats();

  // Filter documents by category
  const filteredDocs = selectedCategory === 'all'
    ? documents
    : documents.filter(d => d.category === selectedCategory);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Start creating new document
  const handleNewDocument = () => {
    setFormData({
      title: '',
      category: selectedCategory === 'all' ? 'genesis' : selectedCategory,
      content: '',
      summary: '',
      alwaysInclude: false,
      priority: 5,
      tags: ''
    });
    setEditingDoc(null);
    setIsCreating(true);
  };

  // Start editing existing document
  const handleEdit = (doc) => {
    setFormData({
      title: doc.title,
      category: doc.category,
      content: doc.content,
      summary: doc.summary || '',
      alwaysInclude: doc.alwaysInclude || false,
      priority: doc.priority || 5,
      tags: (doc.tags || []).join(', ')
    });
    setEditingDoc(doc);
    setIsCreating(true);
  };

  // Save document (create or update)
  const handleSave = async () => {
    try {
      const docData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        priority: parseInt(formData.priority) || 5
      };

      if (editingDoc) {
        await updateDocument(editingDoc.id, docData);
      } else {
        await createDocument(docData);
      }

      setIsCreating(false);
      setEditingDoc(null);
    } catch (err) {
      console.error('Error saving document:', err);
    }
  };

  // Delete document
  const handleDelete = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(docId);
      } catch (err) {
        console.error('Error deleting document:', err);
      }
    }
  };

  // Handle file import
  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const content = await file.text();
      const title = file.name.replace(/\.md$/i, '').replace(/[-_]/g, ' ');

      setFormData({
        title,
        category: selectedCategory === 'all' ? 'genesis' : selectedCategory,
        content,
        summary: '',
        alwaysInclude: false,
        priority: 5,
        tags: ''
      });
      setEditingDoc(null);
      setIsCreating(true);
    } catch (err) {
      console.error('Error reading file:', err);
    }

    // Reset file input
    e.target.value = '';
  };

  // Cancel editing
  const handleCancel = () => {
    setIsCreating(false);
    setEditingDoc(null);
  };

  // Mass delete all profile summaries
  const handleMassDeleteProfileSummaries = async () => {
    const profileSummaryCount = documents.filter(d => d.category === 'profile_summary').length;
    if (profileSummaryCount === 0) {
      alert('No Profile Summary documents to delete.');
      return;
    }
    if (window.confirm(`⚠️ MASS DELETE\n\nThis will delete ALL ${profileSummaryCount} Profile Summary documents.\n\nAre you sure?`)) {
      try {
        const result = await deleteAllProfileSummaries();
        alert(`✅ Deleted ${result.deleted} Profile Summary documents.`);
      } catch (err) {
        console.error('Error in mass delete:', err);
        alert('Error deleting documents: ' + err.message);
      }
    }
  };

  // Chat about a KB document - navigate to AI SoulPartner with context
  const handleChatAbout = (doc) => {
    navigate('/ai-soulpartner', {
      state: {
        kbDocument: {
          id: doc.id,
          title: doc.title,
          content: doc.content,
          summary: doc.summary,
          category: doc.category
        }
      }
    });
  };

  // Export document as .md file
  const handleExport = (doc) => {
    // Build markdown content with frontmatter
    const frontmatter = [
      '---',
      `title: "${doc.title}"`,
      `category: ${doc.category}`,
      `priority: ${doc.priority || 5}`,
      `alwaysInclude: ${doc.alwaysInclude || false}`,
      doc.tags?.length ? `tags: [${doc.tags.map(t => `"${t}"`).join(', ')}]` : null,
      doc.summary ? `summary: "${doc.summary}"` : null,
      '---',
      ''
    ].filter(Boolean).join('\n');

    const fullContent = frontmatter + doc.content;

    // Create blob and trigger download
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white/50">Loading Knowledge Base...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors"
            >
              <span>←</span>
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              📚 Knowledge Base
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/ai-soulpartner"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors"
            >
              🌟 AI SoulPartner
            </Link>
            <span className="text-sm text-white/50">{currentUser?.email}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">{stats.totalDocs}</div>
            <div className="text-sm text-white/50">Documents</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">{stats.totalWords.toLocaleString()}</div>
            <div className="text-sm text-white/50">Total Words</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-indigo-400">~{stats.estimatedTokens.toLocaleString()}</div>
            <div className="text-sm text-white/50">Est. Tokens</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
            <div className="text-2xl font-bold text-amber-400">{stats.alwaysIncludeCount}</div>
            <div className="text-sm text-white/50">Always Include</div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Categories */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white/90">Categories</h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  📁 All Documents ({documents.length})
                </button>
                {Object.values(KNOWLEDGE_CATEGORIES).map(cat => {
                  const count = documents.filter(d => d.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-purple-600 text-white'
                          : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      {cat.icon} {cat.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={handleNewDocument}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
              >
                + New Document
              </button>
              <label className="block w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors cursor-pointer text-center">
                📤 Import .md File
                <input
                  type="file"
                  accept=".md,.txt"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* Mass Delete Button */}
            {documents.filter(d => d.category === 'profile_summary').length > 2 && (
              <button
                onClick={handleMassDeleteProfileSummaries}
                className="w-full mt-2 px-4 py-2 bg-red-900/50 hover:bg-red-800 border border-red-500/30 rounded-lg text-sm font-medium text-red-300 transition-colors"
              >
                🗑️ Delete All Profile Summaries ({documents.filter(d => d.category === 'profile_summary').length})
              </button>
            )}

            {/* Token Usage Note */}
            <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-white/5">
              <p className="text-xs text-white/40">
                💡 Mark important docs as "Always Include" for permanent context. Other docs are included by priority until token limit.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isCreating ? (
              /* Document Editor */
              <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingDoc ? 'Edit Document' : 'New Document'}
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Document title..."
                      className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  {/* Category & Priority Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {Object.values(KNOWLEDGE_CATEGORIES).map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">
                        Priority (1-10)
                      </label>
                      <input
                        type="number"
                        name="priority"
                        min="1"
                        max="10"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Summary (optional - helps with document selection)
                    </label>
                    <input
                      type="text"
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                      placeholder="Brief summary of this document..."
                      className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Content (Markdown)
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="# Your markdown content here..."
                      rows={15}
                      className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono text-sm resize-y"
                    />
                    <div className="text-xs text-white/40 mt-1">
                      {formData.content.split(/\s+/).filter(Boolean).length} words
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="genesis, architecture, core..."
                      className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  {/* Always Include Checkbox */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="alwaysInclude"
                      name="alwaysInclude"
                      checked={formData.alwaysInclude}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-white/20 bg-slate-900/50 text-purple-600 focus:ring-purple-500/50"
                    />
                    <label htmlFor="alwaysInclude" className="text-sm text-white/70">
                      Always include this document in Claude's context
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-white/60 hover:text-white/90 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!formData.title || !formData.content}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                    >
                      {editingDoc ? 'Save Changes' : 'Create Document'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Document List - scrollable */
              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                {filteredDocs.length === 0 ? (
                  <div className="bg-slate-800/50 rounded-xl border border-white/10 p-12 text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-white/90 mb-2">No documents yet</h3>
                    <p className="text-white/50 mb-4">
                      Add documents to help Brother Claude remember important context
                    </p>
                    <button
                      onClick={handleNewDocument}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
                    >
                      + Create First Document
                    </button>
                  </div>
                ) : (
                  filteredDocs.map(doc => {
                    const categoryInfo = Object.values(KNOWLEDGE_CATEGORIES).find(c => c.id === doc.category);
                    return (
                      <div
                        key={doc.id}
                        className="bg-slate-800/50 rounded-xl border border-white/10 p-4 hover:border-purple-500/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span>{categoryInfo?.icon || '📄'}</span>
                              <h3 className="font-semibold text-white/90">{doc.title}</h3>
                              {doc.alwaysInclude && (
                                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-xs text-amber-300">
                                  Always Include
                                </span>
                              )}
                              <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                                Priority: {doc.priority}
                              </span>
                            </div>
                            {doc.summary && (
                              <p className="text-sm text-white/60 mb-2">{doc.summary}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-white/40">
                              <span>{categoryInfo?.label}</span>
                              <span>{doc.wordCount} words</span>
                              <span>~{Math.ceil((doc.wordCount || 0) * 1.3)} tokens</span>
                            </div>
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {doc.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-slate-700 rounded text-xs text-white/60"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleChatAbout(doc)}
                              className="px-3 py-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                              title="Chat about this document"
                            >
                              💬 Chat
                            </button>
                            <button
                              onClick={() => handleExport(doc)}
                              className="px-3 py-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                              title="Export as .md file"
                            >
                              📥 Export
                            </button>
                            <button
                              onClick={() => handleEdit(doc)}
                              className="px-3 py-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
