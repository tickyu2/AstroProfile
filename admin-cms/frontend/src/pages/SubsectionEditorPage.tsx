import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useContentStore } from '../stores/contentStore'

export default function SubsectionEditorPage() {
  const { subsectionId } = useParams<{ subsectionId: string }>()
  const { currentSubsection, fetchSubsection, updateSubsection, isLoading } = useContentStore()

  const [editForm, setEditForm] = useState({
    title: '',
    slug: '',
    content: '',
    content_type: 'markdown',
    video_url: '',
    duration_minutes: 0,
    difficulty: '',
    status: ''
  })
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (subsectionId) {
      fetchSubsection(subsectionId)
    }
  }, [subsectionId, fetchSubsection])

  useEffect(() => {
    if (currentSubsection) {
      setEditForm({
        title: currentSubsection.title || '',
        slug: currentSubsection.slug || '',
        content: currentSubsection.content || '',
        content_type: currentSubsection.content_type || 'markdown',
        video_url: currentSubsection.video_url || '',
        duration_minutes: currentSubsection.duration_minutes || 0,
        difficulty: currentSubsection.difficulty || '',
        status: currentSubsection.status || 'draft'
      })
    }
  }, [currentSubsection])

  const handleSave = async () => {
    if (!subsectionId) return

    setIsSaving(true)
    try {
      await updateSubsection(subsectionId, editForm)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !currentSubsection) {
    return <div className="p-8 text-gray-500">Loading...</div>
  }

  return (
    <div className="p-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">
          <Link to="/modules" className="hover:text-amber-600">Modules</Link>
          <span className="mx-2">/</span>
          <Link to={`/sections/${currentSubsection.section_id}`} className="hover:text-amber-600">
            Section
          </Link>
          <span className="mx-2">/</span>
          <span>{currentSubsection.title}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg ${
              showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Editor Panel */}
        <div className={`bg-white rounded-xl shadow p-6 overflow-auto ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <div className="space-y-4">
            {/* Meta fields */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b">
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
              <div>
                <label className="block text-sm font-medium mb-1">Content Type</label>
                <select
                  value={editForm.content_type}
                  onChange={(e) => setEditForm({ ...editForm, content_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="markdown">Markdown</option>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="exercise">Exercise</option>
                </select>
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
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  value={editForm.difficulty}
                  onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select...</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={editForm.duration_minutes}
                  onChange={(e) => setEditForm({ ...editForm, duration_minutes: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Video URL (if video type) */}
            {editForm.content_type === 'video' && (
              <div>
                <label className="block text-sm font-medium mb-1">Video URL</label>
                <input
                  type="url"
                  value={editForm.video_url}
                  onChange={(e) => setEditForm({ ...editForm, video_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://youtube.com/..."
                />
              </div>
            )}

            {/* Content Editor */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                className="w-full h-96 px-3 py-2 border rounded-lg font-mono text-sm resize-none"
                placeholder="Write your content in Markdown..."
              />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 bg-white rounded-xl shadow p-6 overflow-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-600">Preview</h2>
            <div className="prose max-w-none">
              <h1>{editForm.title}</h1>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {editForm.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
