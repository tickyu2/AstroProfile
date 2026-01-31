import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useContentStore } from '../stores/contentStore'

export default function DashboardPage() {
  const { modules, fetchModules, isLoading } = useContentStore()

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const publishedCount = modules.filter(m => m.status === 'published').length
  const draftCount = modules.filter(m => m.status === 'draft').length
  const totalSections = modules.reduce((sum, m) => sum + (m.section_count || 0), 0)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold text-amber-500">{modules.length}</div>
          <div className="text-gray-600">Total Modules</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold text-green-500">{publishedCount}</div>
          <div className="text-gray-600">Published</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold text-yellow-500">{draftCount}</div>
          <div className="text-gray-600">Drafts</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-3xl font-bold text-blue-500">{totalSections}</div>
          <div className="text-gray-600">Total Sections</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            to="/modules"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Manage Modules
          </Link>
          <Link
            to="/translations"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Manage Translations
          </Link>
        </div>
      </div>

      {/* Recent Modules */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Modules</h2>
        {isLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : modules.length === 0 ? (
          <div className="text-gray-500">No modules yet. Create your first module to get started.</div>
        ) : (
          <div className="space-y-3">
            {modules.slice(0, 5).map((module) => (
              <Link
                key={module.id}
                to={`/modules/${module.id}`}
                className="block p-4 border rounded-lg hover:border-amber-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{module.title}</div>
                    <div className="text-sm text-gray-500">
                      {module.section_count || 0} sections
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
