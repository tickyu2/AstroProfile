/**
 * ADMIN CMS PAGE
 *
 * Genesis Academy Content Management System
 * Integrated within the main AstroProfile application
 * Manages: Modules > Sections > Subsections
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MarkdownEditor from '../components/cms/MarkdownEditor'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Firestore collections
const MODULES_COLLECTION = 'cms_modules'
const SECTIONS_COLLECTION = 'cms_sections'
const SUBSECTIONS_COLLECTION = 'cms_subsections'

export default function AdminCMSPage() {
  const { currentUser } = useAuth()
  // const [activeTab, setActiveTab] = useState('modules') // Reserved for future tabs
  const [modules, setModules] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [sections, setSections] = useState([])
  const [subsections, setSubsections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(null)
  const [editItem, setEditItem] = useState(null)
  // Tree view state
  const [showTreeView, setShowTreeView] = useState(true)
  const [expandedModules, setExpandedModules] = useState({})
  const [expandedSections, setExpandedSections] = useState({})
  const [allSections, setAllSections] = useState([])
  const [allSubsections, setAllSubsections] = useState([])
  // Full editor state (for editing subsection content directly from list)
  const [fullEditorSubsection, setFullEditorSubsection] = useState(null)

  // Fetch modules
  const fetchModules = useCallback(async () => {
    try {
      const q = query(collection(db, MODULES_COLLECTION), orderBy('sortOrder', 'asc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setModules(data)
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch sections for a module
  const fetchSections = useCallback(async (moduleId) => {
    try {
      const q = query(collection(db, SECTIONS_COLLECTION), orderBy('sortOrder', 'asc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(s => s.moduleId === moduleId)
      setSections(data)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }, [])

  // Fetch subsections for a section
  const fetchSubsections = useCallback(async (sectionId) => {
    try {
      const q = query(collection(db, SUBSECTIONS_COLLECTION), orderBy('sortOrder', 'asc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(s => s.sectionId === sectionId)
      setSubsections(data)
    } catch (error) {
      console.error('Error fetching subsections:', error)
    }
  }, [])

  // Fetch all sections for tree view
  const fetchAllSections = useCallback(async () => {
    try {
      const q = query(collection(db, SECTIONS_COLLECTION), orderBy('sortOrder', 'asc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAllSections(data)
    } catch (error) {
      console.error('Error fetching all sections:', error)
    }
  }, [])

  // Fetch all subsections for tree view
  const fetchAllSubsections = useCallback(async () => {
    try {
      const q = query(collection(db, SUBSECTIONS_COLLECTION), orderBy('sortOrder', 'asc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAllSubsections(data)
    } catch (error) {
      console.error('Error fetching all subsections:', error)
    }
  }, [])

  useEffect(() => {
    fetchModules()
    fetchAllSections()
    fetchAllSubsections()
  }, [fetchModules, fetchAllSections, fetchAllSubsections])

  useEffect(() => {
    if (selectedModule) {
      fetchSections(selectedModule.id)
    }
  }, [selectedModule, fetchSections])

  useEffect(() => {
    if (selectedSection) {
      fetchSubsections(selectedSection.id)
    }
  }, [selectedSection, fetchSubsections])

  // Create/Update Module
  const handleSaveModule = async (formData) => {
    try {
      if (editItem) {
        await updateDoc(doc(db, MODULES_COLLECTION, editItem.id), {
          ...formData,
          updatedAt: serverTimestamp(),
          updatedBy: currentUser.uid
        })
      } else {
        await addDoc(collection(db, MODULES_COLLECTION), {
          ...formData,
          sortOrder: modules.length,
          status: 'draft',
          createdAt: serverTimestamp(),
          createdBy: currentUser.uid
        })
      }
      fetchModules()
      setShowModal(null)
      setEditItem(null)
    } catch (error) {
      console.error('Error saving module:', error)
    }
  }

  // Create/Update Section
  const handleSaveSection = async (formData) => {
    try {
      if (editItem) {
        await updateDoc(doc(db, SECTIONS_COLLECTION, editItem.id), {
          ...formData,
          updatedAt: serverTimestamp(),
          updatedBy: currentUser.uid
        })
      } else {
        await addDoc(collection(db, SECTIONS_COLLECTION), {
          ...formData,
          moduleId: selectedModule.id,
          sortOrder: sections.length,
          status: 'draft',
          createdAt: serverTimestamp(),
          createdBy: currentUser.uid
        })
      }
      fetchSections(selectedModule.id)
      fetchAllSections() // Refresh tree view
      setShowModal(null)
      setEditItem(null)
    } catch (error) {
      console.error('Error saving section:', error)
    }
  }

  // Create/Update Subsection
  const handleSaveSubsection = async (formData) => {
    try {
      if (editItem) {
        await updateDoc(doc(db, SUBSECTIONS_COLLECTION, editItem.id), {
          ...formData,
          updatedAt: serverTimestamp(),
          updatedBy: currentUser.uid
        })
      } else {
        await addDoc(collection(db, SUBSECTIONS_COLLECTION), {
          ...formData,
          sectionId: selectedSection.id,
          sortOrder: subsections.length,
          status: 'draft',
          createdAt: serverTimestamp(),
          createdBy: currentUser.uid
        })
      }
      fetchSubsections(selectedSection.id)
      fetchAllSubsections() // Refresh tree view
      setShowModal(null)
      setEditItem(null)
    } catch (error) {
      console.error('Error saving subsection:', error)
    }
  }

  // Save content from full editor (directly updates subsection content)
  const handleFullEditorSave = async (newContent) => {
    if (!fullEditorSubsection) return

    try {
      await updateDoc(doc(db, SUBSECTIONS_COLLECTION, fullEditorSubsection.id), {
        content: newContent,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid
      })
      fetchSubsections(selectedSection.id)
      fetchAllSubsections() // Refresh tree view
      setFullEditorSubsection(null)
    } catch (error) {
      console.error('Error saving from full editor:', error)
    }
  }

  // Delete handlers
  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      const collectionName = type === 'module' ? MODULES_COLLECTION :
                            type === 'section' ? SECTIONS_COLLECTION :
                            SUBSECTIONS_COLLECTION
      await deleteDoc(doc(db, collectionName, id))

      if (type === 'module') {
        fetchModules()
      } else if (type === 'section') {
        fetchSections(selectedModule.id)
        fetchAllSections() // Refresh tree view
      } else {
        fetchSubsections(selectedSection.id)
        fetchAllSubsections() // Refresh tree view
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  // Toggle status
  const handleToggleStatus = async (type, item) => {
    const collectionName = type === 'module' ? MODULES_COLLECTION :
                          type === 'section' ? SECTIONS_COLLECTION :
                          SUBSECTIONS_COLLECTION
    const newStatus = item.status === 'published' ? 'draft' : 'published'

    try {
      await updateDoc(doc(db, collectionName, item.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      })

      if (type === 'module') {
        fetchModules()
      } else if (type === 'section') {
        fetchSections(selectedModule.id)
        fetchAllSections() // Refresh tree view
      } else {
        fetchSubsections(selectedSection.id)
        fetchAllSubsections() // Refresh tree view
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  // Move item up/down
  const handleMove = async (type, item, direction) => {
    const collectionName = type === 'module' ? MODULES_COLLECTION :
                          type === 'section' ? SECTIONS_COLLECTION :
                          SUBSECTIONS_COLLECTION

    // Get the list of items at this level
    let items
    if (type === 'module') {
      items = [...modules].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    } else if (type === 'section') {
      items = allSections.filter(s => s.moduleId === item.moduleId).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    } else {
      items = allSubsections.filter(s => s.sectionId === item.sectionId).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    }

    const currentIndex = items.findIndex(i => i.id === item.id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    // Check bounds
    if (newIndex < 0 || newIndex >= items.length) return

    // Swap sort orders
    const otherItem = items[newIndex]

    try {
      await Promise.all([
        updateDoc(doc(db, collectionName, item.id), { sortOrder: newIndex }),
        updateDoc(doc(db, collectionName, otherItem.id), { sortOrder: currentIndex })
      ])

      // Refresh data
      if (type === 'module') {
        fetchModules()
      } else if (type === 'section') {
        fetchAllSections()
        if (selectedModule) fetchSections(selectedModule.id)
      } else {
        fetchAllSubsections()
        if (selectedSection) fetchSubsections(selectedSection.id)
      }
    } catch (error) {
      console.error('Error moving item:', error)
    }
  }

  // Toggle tree node expansion
  const toggleModuleExpand = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  const toggleSectionExpand = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  // Navigate from tree view
  const navigateToModule = (module) => {
    setSelectedModule(module)
    setSelectedSection(null)
  }

  const navigateToSection = (section, module) => {
    setSelectedModule(module)
    setSelectedSection(section)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-amber-400">Genesis CMS</h1>
                <p className="text-white/60 text-sm">Content Management System</p>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => { setSelectedModule(null); setSelectedSection(null); }}
                className={`px-3 py-1 rounded ${!selectedModule ? 'bg-amber-500 text-slate-900' : 'text-white/60 hover:text-white'}`}
              >
                Modules
              </button>
              {selectedModule && (
                <>
                  <span className="text-white/40">/</span>
                  <button
                    onClick={() => setSelectedSection(null)}
                    className={`px-3 py-1 rounded ${selectedModule && !selectedSection ? 'bg-amber-500 text-slate-900' : 'text-white/60 hover:text-white'}`}
                  >
                    {selectedModule.title}
                  </button>
                </>
              )}
              {selectedSection && (
                <>
                  <span className="text-white/40">/</span>
                  <span className="px-3 py-1 bg-amber-500 text-slate-900 rounded">
                    {selectedSection.title}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-amber-400">{modules.length}</div>
            <div className="text-white/60 text-sm">Modules</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-green-400">
              {modules.filter(m => m.status === 'published').length}
            </div>
            <div className="text-white/60 text-sm">Published</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-yellow-400">
              {modules.filter(m => m.status === 'draft').length}
            </div>
            <div className="text-white/60 text-sm">Drafts</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-blue-400">13</div>
            <div className="text-white/60 text-sm">Languages</div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Tree View Sidebar */}
          {showTreeView && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>🌳</span> Content Tree
                  </h3>
                  <button
                    onClick={() => setShowTreeView(false)}
                    className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded"
                    title="Hide tree view"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-2 max-h-[600px] overflow-auto">
                  {modules.map((module, mIndex) => {
                    const moduleSections = allSections.filter(s => s.moduleId === module.id)
                      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    const isExpanded = expandedModules[module.id]
                    const isSelected = selectedModule?.id === module.id && !selectedSection

                    return (
                      <div key={module.id} className="mb-1">
                        {/* Module */}
                        <div className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${
                          isSelected ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-white/5 text-white/80'
                        }`}>
                          <button
                            onClick={() => toggleModuleExpand(module.id)}
                            className="p-1 hover:bg-white/10 rounded"
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                          <span className="text-lg">{module.icon || '📚'}</span>
                          <span
                            className="flex-1 text-sm cursor-pointer truncate"
                            onClick={() => navigateToModule(module)}
                            title={module.title}
                          >
                            {module.title}
                          </span>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => handleMove('module', module, 'up')}
                              disabled={mIndex === 0}
                              className="p-1 text-xs hover:bg-white/10 rounded disabled:opacity-30"
                              title="Move up"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMove('module', module, 'down')}
                              disabled={mIndex === modules.length - 1}
                              className="p-1 text-xs hover:bg-white/10 rounded disabled:opacity-30"
                              title="Move down"
                            >
                              ↓
                            </button>
                          </div>
                        </div>

                        {/* Sections */}
                        {isExpanded && moduleSections.map((section, sIndex) => {
                          const sectionSubsections = allSubsections.filter(sub => sub.sectionId === section.id)
                            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                          const isSectionExpanded = expandedSections[section.id]
                          const isSectionSelected = selectedSection?.id === section.id

                          return (
                            <div key={section.id} className="ml-4">
                              {/* Section */}
                              <div className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${
                                isSectionSelected ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-white/5 text-white/70'
                              }`}>
                                <button
                                  onClick={() => toggleSectionExpand(section.id)}
                                  className="p-1 hover:bg-white/10 rounded text-xs"
                                >
                                  {isSectionExpanded ? '▼' : '▶'}
                                </button>
                                <span className="text-base">{section.icon || '📄'}</span>
                                <span
                                  className="flex-1 text-xs cursor-pointer truncate"
                                  onClick={() => navigateToSection(section, module)}
                                  title={section.title}
                                >
                                  {section.title}
                                </span>
                                <div className="flex gap-0.5">
                                  <button
                                    onClick={() => handleMove('section', section, 'up')}
                                    disabled={sIndex === 0}
                                    className="p-0.5 text-xs hover:bg-white/10 rounded disabled:opacity-30"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    onClick={() => handleMove('section', section, 'down')}
                                    disabled={sIndex === moduleSections.length - 1}
                                    className="p-0.5 text-xs hover:bg-white/10 rounded disabled:opacity-30"
                                  >
                                    ↓
                                  </button>
                                </div>
                              </div>

                              {/* Subsections */}
                              {isSectionExpanded && sectionSubsections.map((sub, subIndex) => (
                                <div
                                  key={sub.id}
                                  className="ml-6 flex items-center gap-1 p-1.5 rounded text-white/60 hover:bg-white/5 hover:text-white/80"
                                >
                                  <span className="text-sm">
                                    {sub.contentType === 'video' ? '🎬' : sub.contentType === 'quiz' ? '❓' : '📝'}
                                  </span>
                                  <span
                                    className="flex-1 text-xs truncate cursor-pointer"
                                    onClick={() => navigateToSection(section, module)}
                                    title={sub.title}
                                  >
                                    {sub.title}
                                  </span>
                                  <div className="flex gap-0.5">
                                    <button
                                      onClick={() => handleMove('subsection', sub, 'up')}
                                      disabled={subIndex === 0}
                                      className="p-0.5 text-xs hover:bg-white/10 rounded disabled:opacity-30"
                                    >
                                      ↑
                                    </button>
                                    <button
                                      onClick={() => handleMove('subsection', sub, 'down')}
                                      disabled={subIndex === sectionSubsections.length - 1}
                                      className="p-0.5 text-xs hover:bg-white/10 rounded disabled:opacity-30"
                                    >
                                      ↓
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}

                  {modules.length === 0 && (
                    <div className="text-center text-white/40 py-8 text-sm">
                      No modules yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1">
            {!showTreeView && (
              <button
                onClick={() => setShowTreeView(true)}
                className="mb-4 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white/80 text-sm rounded-lg flex items-center gap-2"
              >
                <span>🌳</span> Show Tree View
              </button>
            )}

            <div className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">
                  {selectedSection ? 'Subsections' : selectedModule ? 'Sections' : 'Modules'}
                </h2>
                <button
                  onClick={() => {
                    setEditItem(null)
                    setShowModal(selectedSection ? 'subsection' : selectedModule ? 'section' : 'module')
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors"
                >
                  + Add {selectedSection ? 'Subsection' : selectedModule ? 'Section' : 'Module'}
                </button>
          </div>

          {/* List */}
          <div className="divide-y divide-white/10">
            {loading ? (
              <div className="p-8 text-center text-white/60">Loading...</div>
            ) : (
              <>
                {/* Modules List */}
                {!selectedModule && modules.map((module) => (
                  <div key={module.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{module.icon || '📚'}</div>
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedModule(module)}
                      >
                        <div className="font-medium text-white">{module.title}</div>
                        <div className="text-sm text-white/60">{module.description}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        module.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {module.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus('module', module)}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded"
                          title={module.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {module.status === 'published' ? '📤' : '📥'}
                        </button>
                        <button
                          onClick={() => { setEditItem(module); setShowModal('module'); }}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete('module', module.id)}
                          className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Sections List */}
                {selectedModule && !selectedSection && sections.map((section) => (
                  <div key={section.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{section.icon || '📄'}</div>
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedSection(section)}
                      >
                        <div className="font-medium text-white">{section.title}</div>
                        <div className="text-sm text-white/60">{section.description}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        section.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {section.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus('section', section)}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded"
                        >
                          {section.status === 'published' ? '📤' : '📥'}
                        </button>
                        <button
                          onClick={() => { setEditItem(section); setShowModal('section'); }}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete('section', section.id)}
                          className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Subsections List */}
                {selectedSection && subsections.map((subsection) => (
                  <div key={subsection.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {subsection.contentType === 'video' ? '🎬' :
                         subsection.contentType === 'quiz' ? '❓' : '📝'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{subsection.title}</div>
                        <div className="text-sm text-white/60">
                          {subsection.contentType}
                          {subsection.durationMinutes && ` • ${subsection.durationMinutes} min`}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        subsection.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {subsection.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus('subsection', subsection)}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded"
                          title={subsection.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {subsection.status === 'published' ? '📤' : '📥'}
                        </button>
                        <button
                          onClick={() => setFullEditorSubsection(subsection)}
                          className="p-2 text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10 rounded"
                          title="Full Editor"
                        >
                          📝
                        </button>
                        <button
                          onClick={() => { setEditItem(subsection); setShowModal('subsection'); }}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded"
                          title="Edit Details"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete('subsection', subsection.id)}
                          className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty States */}
                {!loading && !selectedModule && modules.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <div className="text-white/60">No modules yet. Create your first module to get started.</div>
                  </div>
                )}
                {!loading && selectedModule && !selectedSection && sections.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <div className="text-white/60">No sections in this module. Add a section to organize content.</div>
                  </div>
                )}
                {!loading && selectedSection && subsections.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <div className="text-white/60">No content yet. Add subsections to create lessons.</div>
                  </div>
                )}
              </>
            )}
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          type={showModal}
          item={editItem}
          onSave={showModal === 'module' ? handleSaveModule :
                  showModal === 'section' ? handleSaveSection :
                  handleSaveSubsection}
          onClose={() => { setShowModal(null); setEditItem(null); }}
        />
      )}

      {/* Full Editor (direct content editing from list view) */}
      {fullEditorSubsection && (
        <MarkdownEditor
          content={fullEditorSubsection.content || ''}
          title={fullEditorSubsection.title}
          onSave={handleFullEditorSave}
          onClose={() => setFullEditorSubsection(null)}
        />
      )}
    </div>
  )
}

// Modal Component
function Modal({ type, item, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    slug: item?.slug || '',
    description: item?.description || '',
    icon: item?.icon || '',
    content: item?.content || '',
    contentType: item?.contentType || 'markdown',
    videoUrl: item?.videoUrl || '',
    durationMinutes: item?.durationMinutes || '',
    difficulty: item?.difficulty || 'beginner'
  })
  const [showFullEditor, setShowFullEditor] = useState(false)
  const fileInputRef = React.useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  // Import markdown file
  const handleImportMd = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        setFormData(prev => ({ ...prev, content }))

        // Try to extract title from first H1
        const titleMatch = content.match(/^#\s+(.+)$/m)
        if (titleMatch && !formData.title) {
          setFormData(prev => ({ ...prev, title: titleMatch[1].trim() }))
        }
      }
    }
    reader.readAsText(file)
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  // Export as markdown file
  const handleExportMd = () => {
    const filename = formData.slug || formData.title?.toLowerCase().replace(/\s+/g, '-') || 'content'
    const content = formData.content || ''

    // Add title as H1 if not present
    let exportContent = content
    if (formData.title && !content.startsWith('# ')) {
      exportContent = `# ${formData.title}\n\n${content}`
    }

    const blob = new Blob([exportContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {item ? 'Edit' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500"
              placeholder="url-friendly-slug"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500"
              rows={3}
            />
          </div>

          {type !== 'subsection' && (
            <div>
              <label className="block text-sm text-white/60 mb-1">Icon (emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500"
                placeholder="📚"
              />
            </div>
          )}

          {type === 'subsection' && (
            <>
              <div>
                <label className="block text-sm text-white/60 mb-1">Content Type</label>
                <select
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="markdown">Markdown Article</option>
                  <option value="video">Video Lesson</option>
                  <option value="quiz">Quiz</option>
                  <option value="exercise">Exercise</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-white/60">Content (Markdown)</label>
                  <div className="flex gap-2">
                    {/* Hidden file input for import */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".md,.markdown,.txt"
                      onChange={handleImportMd}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors flex items-center gap-1"
                    >
                      <span>📥</span> Import .md
                    </button>
                    <button
                      type="button"
                      onClick={handleExportMd}
                      disabled={!formData.content}
                      className="px-3 py-1 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>📤</span> Export .md
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFullEditor(true)}
                      className="px-3 py-1 text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded transition-colors flex items-center gap-1"
                    >
                      <span>📝</span> Full Editor
                    </button>
                  </div>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500 font-mono text-sm"
                  rows={6}
                  placeholder="# Lesson Title&#10;&#10;Your markdown content here...&#10;&#10;Click 'Full Editor' for side-by-side preview"
                />
                <p className="mt-1 text-xs text-white/40">
                  Use the Full Editor for side-by-side markdown and HTML preview
                </p>
              </div>

              {/* Full-screen Markdown Editor */}
              {showFullEditor && (
                <MarkdownEditor
                  content={formData.content}
                  title={formData.title}
                  onSave={(newContent) => {
                    setFormData(prev => ({ ...prev, content: newContent }))
                    setShowFullEditor(false)
                  }}
                  onClose={() => setShowFullEditor(false)}
                />
              )}

              {formData.contentType === 'video' && (
                <div>
                  <label className="block text-sm text-white/60 mb-1">Video URL</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || '' })}
                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors"
            >
              {item ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
