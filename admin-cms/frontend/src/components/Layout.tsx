import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-amber-400">Genesis CMS</h1>
          <p className="text-sm text-gray-400">Content Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-amber-500 text-gray-900' : 'hover:bg-gray-800'
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/modules"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-amber-500 text-gray-900' : 'hover:bg-gray-800'
              }`
            }
          >
            Modules
          </NavLink>

          <NavLink
            to="/translations"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-amber-500 text-gray-900' : 'hover:bg-gray-800'
              }`
            }
          >
            Translations
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">
            {user?.displayName || user?.email}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Role: {user?.role}
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
