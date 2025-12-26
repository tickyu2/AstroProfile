import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { KnowledgeBaseProvider } from './contexts/KnowledgeBaseContext'
import { ConversationsProvider } from './contexts/ConversationsContext'
import DiamondProfileForm from './components/DiamondProfileForm'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Dashboard from './components/Dashboard'
import InputForm from './components/InputForm'
import SimpleProfileForm from './components/SimpleProfileForm'
import Results from './components/Results'
import MigrationPage from './pages/MigrationPage'
import CompatibilityPage from './pages/CompatibilityPage'
import DataManager from './pages/DataManager'
import AISoulPartnerPage from './pages/AISoulPartnerPage'
import KnowledgeBasePage from './pages/KnowledgeBasePage'
import ConstitutionalAssessmentPage from './pages/ConstitutionalAssessmentPage'
import SystemsPage from './pages/SystemsPage'
import AdminConsolePage from './pages/AdminConsolePage'
import { LunaConsole } from './components/console/LunaConsole'
import TimelineConsolePage from './pages/TimelineConsolePage'
import CustomizingYourSoulPartnerPage from './pages/CustomizingYourSoulPartnerPage'
import BaZiCalculatorPage from './pages/BaZiCalculatorPage'
import SoulGardenPage from './pages/SoulGardenPage'
import SanctuaryPage from './pages/SanctuaryPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <KnowledgeBaseProvider>
          <ConversationsProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<RegisterForm />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-profile"
              element={
                <ProtectedRoute>
                  <DiamondProfileForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/results/:profileId"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />

            <Route
              path="/migrate"
              element={
                <ProtectedRoute>
                  <MigrationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/compatibility"
              element={
                <ProtectedRoute>
                  <CompatibilityPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/data-manager"
              element={
                <ProtectedRoute>
                  <DataManager />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ai-soulpartner"
              element={
                <ProtectedRoute>
                  <AISoulPartnerPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/knowledge-base"
              element={
                <ProtectedRoute>
                  <KnowledgeBasePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/constitutional-assessment"
              element={
                <ProtectedRoute>
                  <ConstitutionalAssessmentPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/systems"
              element={
                <ProtectedRoute>
                  <SystemsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminConsolePage />
                </ProtectedRoute>
              }
            />

            {/* Luna Management Console - Internal developer tool */}
            <Route
              path="/luna-console"
              element={
                <ProtectedRoute>
                  <LunaConsole />
                </ProtectedRoute>
              }
            />

            {/* Timeline Console - Navigate through memories */}
            <Route
              path="/timeline"
              element={
                <ProtectedRoute>
                  <TimelineConsolePage />
                </ProtectedRoute>
              }
            />

            {/* Customizing Your SoulPartner - 4-Layer Precision System */}
            <Route
              path="/customize-soulpartner/:profileId"
              element={
                <ProtectedRoute>
                  <CustomizingYourSoulPartnerPage />
                </ProtectedRoute>
              }
            />

            {/* BaZi Calculator - What If Date Explorer */}
            <Route
              path="/bazi-calculator"
              element={
                <ProtectedRoute>
                  <BaZiCalculatorPage />
                </ProtectedRoute>
              }
            />

            {/* Soul Garden - House Strength Timeline */}
            <Route
              path="/soul-garden"
              element={
                <ProtectedRoute>
                  <SoulGardenPage />
                </ProtectedRoute>
              }
            />

            {/* The Sanctuary of the Unseen Self */}
            <Route
              path="/sanctuary"
              element={
                <ProtectedRoute>
                  <SanctuaryPage />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to dashboard (or login if not authenticated) */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </ConversationsProvider>
          </KnowledgeBaseProvider>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
