import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useContentStore } from '../stores/contentStore'

export default function ModulesPage() {
  const { modules, fetchModules, createModule, reorderModules, isLoading } = useContentStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newModule, setNewModule] = useState({
    slug: '',
    title: '',
    description: '',
    icon: '',
    color: '#f59e0b'
  })

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(modules)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const moduleIds = items.map(m => m.id)
    reorderModules(moduleIds)
  }

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    await createModule(newModule)
    setShowCreateModal(false)
    setNewModule({ slug: '', title: '', description: '', icon: '', color: '#f59e0b' })
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modules</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
        >
          + New Module
        </button>
      </div>

      {isLoading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="modules">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {modules.map((module, index) => (
                  <Draggable key={module.id} draggableId={module.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white p-4 rounded-lg shadow ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-amber-500' : ''
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
                              to={`/modules/${module.id}`}
                              className="text-lg font-medium hover:text-amber-600"
                            >
                              {module.icon && <span className="mr-2">{module.icon}</span>}
                              {module.title}
                            </Link>
                            <div className="text-sm text-gray-500">
                              /{module.slug} • {module.section_count || 0} sections
                            </div>
                          </div>

                          <span className={`px-2 py-1 text-xs rounded-full ${
                            module.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : module.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {module.status}
                          </span>

                          <Link
                            to={`/modules/${module.id}`}
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Module</h2>
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={newModule.slug}
                  onChange={(e) => setNewModule({ ...newModule, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="url-friendly-slug"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Icon (emoji)</label>
                  <input
                    type="text"
                    value={newModule.icon}
                    onChange={(e) => setNewModule({ ...newModule, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="💡"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input
                    type="color"
                    value={newModule.color}
                    onChange={(e) => setNewModule({ ...newModule, color: e.target.value })}
                    className="w-full h-10 border rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                >
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
