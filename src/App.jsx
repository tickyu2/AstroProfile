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
const BaZiHealthPage = lazy(() => import('./pages/BaZiHealthPage'))
const BaZiSeasonalityPage = lazy(() => import('./pages/BaZiSeasonalityPage'))
const BaZiLearningPage = lazy(() => import('./pages/BaZiLearningPage'))
const BaZiChatPage = lazy(() => import('./pages/BaZiChatPage'))
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
const AssessmentPage = lazy(() => import('./pages/Assessment'))
const EnneagramPage = lazy(() => import('./pages/EnneagramPage'))
const LizGreeneCathedralPage = lazy(() => import('./pages/LizGreeneCathedralPage'))
const ZodiacLearningPage = lazy(() => import('./pages/ZodiacLearningPage'))
const ZodiacAcademyPage = lazy(() => import('./pages/ZodiacAcademyPage'))
const TropicalSeasonsPage = lazy(() => import('./pages/TropicalSeasonsPage'))
const NatalWheelPage = lazy(() => import('./pages/NatalWheelPage'))
const BaZiBranchWheelPage = lazy(() => import('./pages/BaZiBranchWheelPage'))
const GrayWhaleLifeCyclePage = lazy(() => import('./pages/GrayWhaleLifeCyclePage'))
const GrayWhaleMigrationPage = lazy(() => import('./pages/GrayWhaleMigrationPage'))

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

            {/* Protected routes — auth checked once by ProtectedRoute layout */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-profile" element={<DiamondProfileForm />} />
              <Route path="/results/:profileId" element={<Results />} />
              <Route path="/numerology/:profileId" element={<NumerologyDecodePage />} />
              <Route path="/western/:profileId" element={<WesternAstrologyDecodePage />} />
              <Route path="/western-elements/:profileId" element={<WesternElementalAnalysisPage />} />
              <Route path="/vedic" element={<VedicAstrologyPage />} />
              <Route path="/vedic/:profileId" element={<VedicAstrologyPage />} />
              <Route path="/cathedral/:id" element={<RelationshipCathedralPage />} />
              <Route path="/cathedral" element={<RelationshipCathedralPage />} />
              <Route path="/cms" element={<AdminCMSPage />} />
              <Route path="/migrate" element={<MigrationPage />} />
              <Route path="/compatibility" element={<CompatibilityPage />} />
              <Route path="/match" element={<CompatibilityMatchPage />} />
              <Route path="/unified-compatibility" element={<UnifiedCompatibilityPage />} />
              <Route path="/data-manager" element={<DataManager />} />
              <Route path="/ai-soulpartner" element={<AISoulPartnerPage />} />
              <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
              <Route path="/constitutional-assessment" element={<ConstitutionalAssessmentPage />} />
              <Route path="/systems" element={<SystemsPage />} />
              <Route path="/operations" element={<OperationsPage />} />
              <Route path="/admin" element={<AdminConsolePage />} />
              <Route path="/luna-console" element={<LunaConsole />} />
              <Route path="/timeline" element={<TimelineConsolePage />} />
              <Route path="/customize-soulpartner/:profileId" element={<CustomizingYourSoulPartnerPage />} />
              <Route path="/bazi-calculator" element={<BaZiCalculatorPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/western" element={<WesternAstrologyDecodePage />} />
              <Route path="/enneagram" element={<EnneagramPage />} />
              <Route path="/liz-greene" element={<LizGreeneCathedralPage />} />
              <Route path="/liz-greene/:profileId" element={<LizGreeneCathedralPage />} />
              <Route path="/bazi-modular" element={<BaZiModularPage />} />
              <Route path="/bazi-health" element={<BaZiHealthPage />} />
              <Route path="/bazi-seasonality" element={<BaZiSeasonalityPage />} />
              <Route path="/bazi-learning" element={<BaZiLearningPage />} />
              <Route path="/bazi-chat" element={<BaZiChatPage />} />
              <Route path="/soul-garden" element={<SoulGardenPage />} />
              <Route path="/sanctuary" element={<SanctuaryPage />} />
              <Route path="/transcript-tester" element={<TranscriptTesterPage />} />
              <Route path="/brain-architecture" element={<BrainArchitecturePage />} />
              <Route path="/zodiac-cusps" element={<ZodiacCuspsPage />} />
              <Route path="/zodiac-learning" element={<ZodiacLearningPage />} />
              <Route path="/zodiac-academy" element={<ZodiacAcademyPage />} />
              <Route path="/tropical-seasons" element={<TropicalSeasonsPage />} />
              <Route path="/natal-wheel" element={<NatalWheelPage />} />
              <Route path="/branch-wheel" element={<BaZiBranchWheelPage />} />
              <Route path="/whale-lifecycle" element={<GrayWhaleLifeCyclePage />} />
              <Route path="/whale-migration" element={<GrayWhaleMigrationPage />} />
              <Route path="/chinese-zodiac" element={<ChineseZodiacPage />} />
              <Route path="/soul-family" element={<SoulFamilyPage />} />
              <Route path="/chat" element={<GuestChat />} />
              <Route path="/chat/:partnerId" element={<GuestChat />} />
              <Route path="/cclr" element={<CCLRHomePage />} />
              <Route path="/cclr/new" element={<CreateSessionPage />} />
              <Route path="/cclr/session/:sessionId" element={<CCLRSessionPage />} />
              <Route path="/biography" element={<BiographyJournalPage />} />
              <Route path="/dynamic-personality" element={<DynamicPersonalityPage />} />
              <Route path="/luna-tuner" element={<LunaPersonalityTunerPage />} />
              <Route path="/memory-explorer" element={<MemoryExplorerPage />} />
              <Route path="/constellation" element={<ConstellationPage />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
