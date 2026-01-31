import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useContentStore } from '../stores/contentStore'

export default function SectionEditorPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const {
    currentSection,
    fetchSection,
    updateSection,
    createSubsection,
    reorderSubsections,
    isLoading
  } = useContentStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    slug: '',
    description: '',
    icon: '',
    status: ''
  })
  const [showSubsectionModal, setShowSubsectionModal] = useState(false)
  const [newSubsection, setNewSubsection] = useState({
    slug: '',
    title: '',
    content_type: 'markdown' as const
  })

  useEffect(() => {
    if (sectionId) {
      fetchSection(sectionId)
    }
  }, [sectionId, fetchSection])

  useEffect(() => {
    if (currentSection) {
      setEditForm({
        title: currentSection.title || '',
        slug: currentSection.slug || '',
        description: currentSection.description || '',
        icon: currentSection.icon || '',
        status: currentSection.status || 'draft'
      })
    }
  }, [currentSection])

  const handleSave = async () => {
    if (sectionId) {
      await updateSection(sectionId, editForm)
      setIsEditing(false)
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentSection?.subsections) return

    const items = Array.from(currentSection.subsections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const subsectionIds = items.map(s => s.id)
    reorderSubsections(sectionId!, subsectionIds)
  }

  const handleCreateSubsection = async (e: React.FormEvent) => {
    e.preventDefault()
    await createSubsection({
      section_id: sectionId,
      ...newSubsection
    })
    setShowSubsectionModal(false)
    setNewSubsection({ slug: '', title: '', content_type: 'markdown' })
  }

  if (isLoading || !currentSection) {
    return <div className="p-8 text-gray-500">Loading...</div>
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/modules" className="hover:text-amber-600">Modules</Link>
        <span className="mx-2">/</span>
        <Link to={`/modules/${currentSection.module_id}`} className="hover:text-amber-600">
          Module
        </Link>
        <span className="mx-2">/</span>
        <span>{currentSection.title}</span>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {currentSection.icon && <span className="mr-2">{currentSection.icon}</span>}
            {currentSection.title}
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
                Edit Section
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
          <p className="text-gray-600">{currentSection.description || 'No description'}</p>
        )}
      </div>

      {/* Subsections */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Subsections</h2>
          <button
            onClick={() => setShowSubsectionModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm"
          >
            + Add Subsection
          </button>
        </div>

        {!currentSection.subsections || currentSection.subsections.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No subsections yet. Add your first subsection to add content.
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subsections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {currentSection.subsections.map((subsection, index) => (
                    <Draggable key={subsection.id} draggableId={subsection.id} index={index}>
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
                                to={`/subsections/${subsection.id}`}
                                className="font-medium hover:text-amber-600"
                              >
                                {subsection.title}
                              </Link>
                              <div className="text-sm text-gray-500">
                                {subsection.content_type}
                                {subsection.duration_minutes && ` • ${subsection.duration_minutes} min`}
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              subsection.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {subsection.status}
                            </span>
                            <Link
                              to={`/subsections/${subsection.id}`}
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

      {/* Create Subsection Modal */}
      {showSubsectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Subsection</h2>
            <form onSubmit={handleCreateSubsection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newSubsection.title}
                  onChange={(e) => setNewSubsection({ ...newSubsection, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={newSubsection.slug}
                  onChange={(e) => setNewSubsection({ ...newSubsection, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content Type</label>
                <select
                  value={newSubsection.content_type}
                  onChange={(e) => setNewSubsection({ ...newSubsection, content_type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="markdown">Markdown Article</option>
                  <option value="video">Video Lesson</option>
                  <option value="quiz">Quiz</option>
                  <option value="exercise">Exercise</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubsectionModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                >
                  Add Subsection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
