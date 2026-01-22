import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { KnowledgeBaseProvider } from './contexts/KnowledgeBaseContext'
import { ConversationsProvider } from './contexts/ConversationsContext'
import { LanguageProvider } from './contexts/LanguageContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import LoadingSpinner from './components/layout/LoadingSpinner'

// Core pages - loaded immediately
import Dashboard from './components/Dashboard'

// Lazy-loaded pages - loaded on demand to reduce initial bundle
const DiamondProfileForm = lazy(() => import('./components/DiamondProfileForm'))
const InputForm = lazy(() => import('./components/InputForm'))
const SimpleProfileForm = lazy(() => import('./components/SimpleProfileForm'))
const Results = lazy(() => import('./components/Results'))
const MigrationPage = lazy(() => import('./pages/MigrationPage'))
const CompatibilityPage = lazy(() => import('./pages/CompatibilityPage'))
const DataManager = lazy(() => import('./pages/DataManager'))
const AISoulPartnerPage = lazy(() => import('./pages/AISoulPartnerPage'))
const KnowledgeBasePage = lazy(() => import('./pages/KnowledgeBasePage'))
const ConstitutionalAssessmentPage = lazy(() => import('./pages/ConstitutionalAssessmentPage'))
const SystemsPage = lazy(() => import('./pages/SystemsPage'))
const OperationsPage = lazy(() => import('./pages/OperationsPage'))
const AdminConsolePage = lazy(() => import('./pages/AdminConsolePage'))
const LunaConsole = lazy(() => import('./components/console/LunaConsole').then(m => ({ default: m.LunaConsole })))
const TimelineConsolePage = lazy(() => import('./pages/TimelineConsolePage'))
const CustomizingYourSoulPartnerPage = lazy(() => import('./pages/CustomizingYourSoulPartnerPage'))
const BaZiCalculatorPage = lazy(() => import('./pages/BaZiCalculatorPage'))
const BaZiModularPage = lazy(() => import('./pages/BaZiModularPage'))
const BaZiSeasonalityPage = lazy(() => import('./pages/BaZiSeasonalityPage'))
const SoulGardenPage = lazy(() => import('./pages/SoulGardenPage'))
const SanctuaryPage = lazy(() => import('./pages/SanctuaryPage'))
const TranscriptTesterPage = lazy(() => import('./pages/TranscriptTesterPage'))
const BrainArchitecturePage = lazy(() => import('./pages/BrainArchitecturePage'))
const ZodiacCuspsPage = lazy(() => import('./pages/ZodiacCuspsPage'))
const ChineseZodiacPage = lazy(() => import('./pages/ChineseZodiacPage'))
const SoulFamilyPage = lazy(() => import('./pages/SoulFamilyPage'))
const GuestChat = lazy(() => import('./pages/GuestChat'))
const NumerologyDecodePage = lazy(() => import('./pages/NumerologyDecodePage'))
const WesternAstrologyDecodePage = lazy(() => import('./pages/WesternAstrologyDecodePage'))
const VoiceTestPage = lazy(() => import('./pages/VoiceTestPage'))
const LunaVoicePage = lazy(() => import('./pages/LunaVoicePage'))
const BiographyJournalPage = lazy(() => import('./pages/BiographyJournalPage'))
const WesternElementalAnalysisPage = lazy(() => import('./pages/WesternElementalAnalysisPage'))
const CompatibilityMatchPage = lazy(() => import('./pages/CompatibilityMatchPage'))
const UnifiedCompatibilityPage = lazy(() => import('./pages/UnifiedCompatibilityPage'))
const DynamicPersonalityPage = lazy(() => import('./pages/DynamicPersonalityPage'))
const LunaPersonalityTunerPage = lazy(() => import('./pages/LunaPersonalityTunerPage'))
const MemoryExplorerPage = lazy(() => import('./pages/MemoryExplorerPage'))
const ConstellationPage = lazy(() => import('./pages/ConstellationPage'))
const VedicAstrologyPage = lazy(() => import('./pages/VedicAstrologyPage'))
const RelationshipCathedralPage = lazy(() => import('./pages/RelationshipCathedralPage'))
const AdminCMSPage = lazy(() => import('./pages/AdminCMSPage'))

// CCLR - Couples Cosmic Love Rejuvenation (lazy loaded)
const CCLRHomePage = lazy(() => import('./pages/cclr').then(m => ({ default: m.CCLRHomePage })))
const CCLRSessionPage = lazy(() => import('./pages/cclr').then(m => ({ default: m.CCLRSessionPage })))
const CreateSessionPage = lazy(() => import('./pages/cclr').then(m => ({ default: m.CreateSessionPage })))

// Suspense fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center">
    <LoadingSpinner />
  </div>
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
        <ProfileProvider>
          <KnowledgeBaseProvider>
          <ConversationsProvider>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<RegisterForm />} />
            <Route path="/voice-test" element={<VoiceTestPage />} />
            <Route path="/luna-voice" element={<LunaVoicePage />} />

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

            {/* Numerology Decode - Deep numerological analysis */}
            <Route
              path="/numerology/:profileId"
              element={
                <ProtectedRoute>
                  <NumerologyDecodePage />
                </ProtectedRoute>
              }
            />

            {/* Western Astrology Decode - Deep astrological analysis */}
            <Route
              path="/western/:profileId"
              element={
                <ProtectedRoute>
                  <WesternAstrologyDecodePage />
                </ProtectedRoute>
              }
            />

            {/* Western Elemental Analysis - Transparent calculation */}
            <Route
              path="/western-elements/:profileId"
              element={
                <ProtectedRoute>
                  <WesternElementalAnalysisPage />
                </ProtectedRoute>
              }
            />

            {/* Vedic Astrology (Jyotish) - Sidereal zodiac */}
            <Route
              path="/vedic"
              element={
                <ProtectedRoute>
                  <VedicAstrologyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vedic/:profileId"
              element={
                <ProtectedRoute>
                  <VedicAstrologyPage />
                </ProtectedRoute>
              }
            />

            {/* Relationship Cathedral - Full Western + Vedic combined experience */}
            <Route
              path="/cathedral/:id"
              element={
                <ProtectedRoute>
                  <RelationshipCathedralPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cathedral"
              element={
                <ProtectedRoute>
                  <RelationshipCathedralPage />
                </ProtectedRoute>
              }
            />

            {/* Admin CMS - Content Management System */}
            <Route
              path="/cms"
              element={
                <ProtectedRoute>
                  <AdminCMSPage />
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

            {/* NEW: Compatibility Match with Explainability (L0-L3) */}
            <Route
              path="/match"
              element={
                <ProtectedRoute>
                  <CompatibilityMatchPage />
                </ProtectedRoute>
              }
            />

            {/* GENESIS Unified Compatibility - 90-Dimensional Analysis */}
            <Route
              path="/unified-compatibility"
              element={
                <ProtectedRoute>
                  <UnifiedCompatibilityPage />
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
              path="/operations"
              element={
                <ProtectedRoute>
                  <OperationsPage />
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

            {/* BaZi Modular - Atomic Design Components */}
            <Route
              path="/bazi-modular"
              element={
                <ProtectedRoute>
                  <BaZiModularPage />
                </ProtectedRoute>
              }
            />

            {/* BaZi Seasonality - Learning Hall Education Module */}
            <Route
              path="/bazi-seasonality"
              element={
                <ProtectedRoute>
                  <BaZiSeasonalityPage />
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

            {/* GENESIS Transcript Tester - Phase 6 Testing Interface */}
            <Route
              path="/transcript-tester"
              element={
                <ProtectedRoute>
                  <TranscriptTesterPage />
                </ProtectedRoute>
              }
            />

            {/* GENESIS Brain Architecture Wiki */}
            <Route
              path="/brain-architecture"
              element={
                <ProtectedRoute>
                  <BrainArchitecturePage />
                </ProtectedRoute>
              }
            />

            {/* 36-Position Zodiac Cusps Page */}
            <Route
              path="/zodiac-cusps"
              element={
                <ProtectedRoute>
                  <ZodiacCuspsPage />
                </ProtectedRoute>
              }
            />

            {/* Chinese Zodiac + Five Elements Page */}
            <Route
              path="/chinese-zodiac"
              element={
                <ProtectedRoute>
                  <ChineseZodiacPage />
                </ProtectedRoute>
              }
            />

            {/* Soul Family - GENESIS Family Archive */}
            <Route
              path="/soul-family"
              element={
                <ProtectedRoute>
                  <SoulFamilyPage />
                </ProtectedRoute>
              }
            />

            {/* Guest Chat - Selection page (no guest selected) */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <GuestChat />
                </ProtectedRoute>
              }
            />

            {/* Guest Chat - Chat with specific guest */}
            <Route
              path="/chat/:partnerId"
              element={
                <ProtectedRoute>
                  <GuestChat />
                </ProtectedRoute>
              }
            />

            {/* CCLR - Couples Cosmic Love Rejuvenation */}
            <Route
              path="/cclr"
              element={
                <ProtectedRoute>
                  <CCLRHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cclr/new"
              element={
                <ProtectedRoute>
                  <CreateSessionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cclr/session/:sessionId"
              element={
                <ProtectedRoute>
                  <CCLRSessionPage />
                </ProtectedRoute>
              }
            />

            {/* Biography Journal - Text-based life story preservation */}
            <Route
              path="/biography"
              element={
                <ProtectedRoute>
                  <BiographyJournalPage />
                </ProtectedRoute>
              }
            />

            {/* Dynamic Personality - P4-P8 Luna Fusion Engines */}
            <Route
              path="/dynamic-personality"
              element={
                <ProtectedRoute>
                  <DynamicPersonalityPage />
                </ProtectedRoute>
              }
            />

            {/* Luna Personality Tuner - Customize Luna's personality */}
            <Route
              path="/luna-tuner"
              element={
                <ProtectedRoute>
                  <LunaPersonalityTunerPage />
                </ProtectedRoute>
              }
            />

            {/* Memory Explorer - Happiness Anchors, Emotion Trends, Relationship Stats */}
            <Route
              path="/memory-explorer"
              element={
                <ProtectedRoute>
                  <MemoryExplorerPage />
                </ProtectedRoute>
              }
            />

            {/* AI Constellation - Multi-AI Perspectives */}
            <Route
              path="/constellation"
              element={
                <ProtectedRoute>
                  <ConstellationPage />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to dashboard (or login if not authenticated) */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </Suspense>
          </ConversationsProvider>
          </KnowledgeBaseProvider>
        </ProfileProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
