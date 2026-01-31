import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ModulesPage from './pages/ModulesPage'
import ModuleEditorPage from './pages/ModuleEditorPage'
import SectionEditorPage from './pages/SectionEditorPage'
import SubsectionEditorPage from './pages/SubsectionEditorPage'
import TranslationsPage from './pages/TranslationsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="modules" element={<ModulesPage />} />
        <Route path="modules/:moduleId" element={<ModuleEditorPage />} />
        <Route path="sections/:sectionId" element={<SectionEditorPage />} />
        <Route path="subsections/:subsectionId" element={<SubsectionEditorPage />} />
        <Route path="translations" element={<TranslationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
