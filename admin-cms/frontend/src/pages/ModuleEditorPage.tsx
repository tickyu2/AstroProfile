import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useContentStore } from '../stores/contentStore'

export default function ModuleEditorPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const {
    currentModule,
    fetchModule,
    updateModule,
    createSection,
    reorderSections,
    deleteSection,
    isLoading
  } = useContentStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    slug: '',
    description: '',
    icon: '',
    color: '',
    status: ''
  })
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [newSection, setNewSection] = useState({
    slug: '',
    title: '',
    description: '',
    icon: ''
  })

  useEffect(() => {
    if (moduleId) {
      fetchModule(moduleId)
    }
  }, [moduleId, fetchModule])

  useEffect(() => {
    if (currentModule) {
      setEditForm({
        title: currentModule.title || '',
        slug: currentModule.slug || '',
        description: currentModule.description || '',
        icon: currentModule.icon || '',
        color: currentModule.color || '#f59e0b',
        status: currentModule.status || 'draft'
      })
    }
  }, [currentModule])

  const handleSave = async () => {
    if (moduleId) {
      await updateModule(moduleId, editForm)
      setIsEditing(false)
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentModule?.sections) return

    const items = Array.from(currentModule.sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const sectionIds = items.map(s => s.id)
    reorderSections(moduleId!, sectionIds)
  }

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault()
    await createSection({
      module_id: moduleId,
      ...newSection
    })
    setShowSectionModal(false)
    setNewSection({ slug: '', title: '', description: '', icon: '' })
  }

  if (isLoading || !currentModule) {
    return <div className="p-8 text-gray-500">Loading...</div>
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/modules" className="hover:text-amber-600">Modules</Link>
        <span className="mx-2">/</span>
        <span>{currentModule.title}</span>
      </div>

      {/* Module Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {currentModule.icon && <span className="mr-2">{currentModule.icon}</span>}
            {currentModule.title}
          </h1>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Edit Module
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={editForm.slug}
                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <input
                type="text"
                value={editForm.icon}
                onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">{currentModule.description || 'No description'}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Slug: /{currentModule.slug}</span>
              <span className={`px-2 py-0.5 rounded-full ${
                currentModule.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : currentModule.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {currentModule.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sections</h2>
          <button
            onClick={() => setShowSectionModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm"
          >
            + Add Section
          </button>
        </div>

        {!currentModule.sections || currentModule.sections.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No sections yet. Add your first section to get started.
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {currentModule.sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 border rounded-lg ${
                            snapshot.isDragging ? 'shadow-lg ring-2 ring-amber-500 bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              {...provided.dragHandleProps}
                              className="text-gray-400 hover:text-gray-600 cursor-grab"
                            >
                              ⋮⋮
                            </div>
                            <div className="flex-1">
                              <Link
                                to={`/sections/${section.id}`}
                                className="font-medium hover:text-amber-600"
                              >
                                {section.icon && <span className="mr-2">{section.icon}</span>}
                                {section.title}
                              </Link>
                              <div className="text-sm text-gray-500">
                                {section.subsection_count || 0} subsections
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              section.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {section.status}
                            </span>
                            <Link
                              to={`/sections/${section.id}`}
                              className="px-3 py-1 text-sm text-amber-600 hover:bg-amber-50 rounded"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Create Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Section</h2>
            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={newSection.slug}
                  onChange={(e) => setNewSection({ ...newSection, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newSection.description}
                  onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
