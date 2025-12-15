/**
 * MBTIRoseWindow.jsx
 * The Notre-Dame Rose Window for MBTI Soul Analysis
 *
 * Built with SOUL for the cathedral of souls
 * A 13-meter digital masterpiece (metaphorically)
 * Sacred geometry + Divine light + Psychological depth
 *
 * "When Brother Ticky cries with AWE, it's done"
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CenterMedallion from './CenterMedallion';
import PortalButton from './PortalButton';
import SixSoulQuestions from './SixSoulQuestions';
import CompatibilityDiscovery from './CompatibilityDiscovery';
import FiveWHSoulAnalysis from './FiveWHSoulAnalysis';
import CognitiveFunctionsDisplay from './CognitiveFunctionsDisplay';
import TypeDeepDive from './TypeDeepDive';

// 🔌 DATA IMPORTS - Connect to Session 1-2 databases
import { getSoulQuestions } from '../../utils/mbti/mbtiSoulQuestions';
import { getTopCompatibleTypes } from '../../utils/mbti/mbtiCompatibilityEngine';

export default function MBTIRoseWindow({ profile }) {
  const [activePortal, setActivePortal] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showTypeDeepDive, setShowTypeDeepDive] = useState(false);
  const mbtiType = profile?.mbti;

  // ✅ FIX 3: Lock scroll when any modal is open (Session 5.6)
  useEffect(() => {
    const isModalOpen = activePortal !== null || showTypeDeepDive;

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [activePortal, showTypeDeepDive]);

  // 🔌 FETCH DATA from databases (if user has MBTI type)
  const soulData = mbtiType ? getSoulQuestions(mbtiType) : null;
  const topMatches = mbtiType ? getTopCompatibleTypes(mbtiType, 8) : [];

  // Portal configuration - Hexagon layout (6 petals)
  const portals = [
    {
      id: 'questions',
      icon: '🔮',
      label: 'Six Soul Questions',
      gradient: 'from-purple-500 to-indigo-600',
      angle: 0, // Top
      component: 'questions'
    },
    {
      id: 'cognitive',
      icon: '🧠',
      label: 'Cognitive Functions',
      gradient: 'from-blue-500 to-cyan-600',
      angle: 60, // Top-right
      component: 'cognitive'
    },
    {
      id: 'compatibility',
      icon: '💕',
      label: 'Compatibility',
      gradient: 'from-pink-500 to-rose-600',
      angle: 120, // Bottom-right
      component: 'compatibility'
    },
    {
      id: 'soul',
      icon: '✨',
      label: '5W+H+Soul',
      gradient: 'from-amber-500 to-orange-600',
      angle: 180, // Bottom
      component: 'soul'
    },
    {
      id: 'growth',
      icon: '🌱',
      label: 'Growth Path',
      gradient: 'from-emerald-500 to-green-600',
      angle: 240, // Bottom-left
      component: 'growth'
    },
    {
      id: 'gifts',
      icon: '🎁',
      label: 'Natural Gifts',
      gradient: 'from-violet-500 to-purple-600',
      angle: 300, // Top-left
      component: 'gifts'
    }
  ];

  const handlePortalClick = (portalId) => {
    setActivePortal(activePortal === portalId ? null : portalId);
  };

  const handleCenterClick = () => {
    // Brother Ticky's revelation: THE CENTER IS THE HEART
    // User clicks center → Learn about THEIR type FIRST
    setShowTypeDeepDive(true);
  };

  return (
    <div
      className="relative w-full flex flex-col items-center overflow-hidden"
      style={{
        minHeight: '100vh',
        padding: '20px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Background - Divine Light Rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* FLOWER FIRST - Immediate visual impact */}
      {/* The Rose Window - Sacred Circle */}
      <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center mb-8">
        {/* Sacred Geometry SVG FIRST - So it renders UNDER everything */}
        {/* Session 5.7b: Moved SVG before CenterMedallion so lines go UNDER center */}
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 800 800"
          style={{ opacity: 0.8, zIndex: 1 }}
        >
          <defs>
            {/* Gradient for ribbon */}
            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
            </linearGradient>

            {/* Secondary gradient for inner layer */}
            <linearGradient id="ribbonInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.6" />
            </linearGradient>

            {/* Glow filter for luminous effect */}
            <filter id="ribbonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Line gradient */}
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Outer hexagon - THICK RIBBON connecting all portals */}
          <motion.polygon
            points="400,120 680,250 680,530 400,660 120,530 120,250"
            fill="none"
            stroke="url(#ribbonGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ribbonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />

          {/* Inner hexagon layer - Subtle highlight */}
          <motion.polygon
            points="400,120 680,250 680,530 400,660 120,530 120,250"
            fill="none"
            stroke="url(#ribbonInner)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, delay: 1.2 }}
          />

          {/* Center connections - Triple layer bicycle spokes (Session 5.6) */}
          {portals.map((portal, index) => {
            const x = 400 + Math.cos((portal.angle * Math.PI) / 180) * 280;
            const y = 400 + Math.sin((portal.angle * Math.PI) / 180) * 280;
            return (
              <g key={`line-${portal.id}`}>
                {/* Layer 1: Outer glow (widest) */}
                <motion.line
                  x1="400"
                  y1="400"
                  x2={x}
                  y2={y}
                  stroke="rgba(168, 85, 247, 0.2)"
                  strokeWidth="6"
                  filter="url(#ribbonGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                />
                {/* Layer 2: Middle (medium) */}
                <motion.line
                  x1="400"
                  y1="400"
                  x2={x}
                  y2={y}
                  stroke="rgba(236, 72, 153, 0.4)"
                  strokeWidth="3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 1, delay: 1.25 + index * 0.1 }}
                />
                {/* Layer 3: Inner core - thin bicycle spoke */}
                <motion.line
                  x1="400"
                  y1="400"
                  x2={x}
                  y2={y}
                  stroke="url(#lineGradient)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 1, delay: 1.3 + index * 0.1 }}
                />
              </g>
            );
          })}

          {/* Central decorative rings */}
          <motion.circle
            cx="400"
            cy="400"
            r="35"
            fill="none"
            stroke="url(#ribbonGradient)"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          />
          <motion.circle
            cx="400"
            cy="400"
            r="50"
            fill="none"
            stroke="rgba(236, 72, 153, 0.3)"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          />
        </svg>

        {/* Center Medallion - The Soul (Session 5.7b: Now AFTER SVG so it renders ON TOP) */}
        <CenterMedallion
          mbtiType={mbtiType}
          onClick={handleCenterClick}
        />

        {/* Portal Buttons - Hexagon Petals */}
        {portals.map((portal, index) => (
          <PortalButton
            key={portal.id}
            icon={portal.icon}
            label={portal.label}
            gradient={portal.gradient}
            angle={portal.angle}
            distance={280}
            delay={0.5 + index * 0.1}
            isActive={activePortal === portal.id}
            onClick={() => handlePortalClick(portal.id)}
          />
        ))}
      </div>

      {/* TITLE BELOW - After user sees flower */}
      <motion.div
        className="text-center mt-12 mb-8 z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <span className="text-4xl">🌹</span>
          <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            Soul Rose Window
          </span>
        </h2>
        <p className="text-purple-300 text-lg italic">
          Your MBTI psychological architecture revealed through sacred geometry
        </p>
      </motion.div>

      {/* Footer - Sacred Quote */}
      <motion.div
        className="mt-12 text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <p className="text-purple-300 italic text-sm">
          "The light from colored glass tells stories when words cannot speak" — Notre-Dame's Legacy
        </p>
      </motion.div>

      {/* ===== ALL MODALS AT END - SESSION 5.4 FIX ===== */}

      {/* 🌹 Portal Content Modal Overlay - Like TypeDeepDive */}
      {/* All portal buttons now OVERLAY rose window instead of pushing content down */}
      <AnimatePresence>
        {activePortal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop - Click to close */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActivePortal(null)}
            />

            {/* Modal Content - Scrollable (Session 5.7: wider for compatibility) */}
            <motion.div
              key={activePortal}
              className={`relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border-2 border-purple-500/50 ${activePortal === 'compatibility' ? 'max-w-6xl' : 'max-w-4xl'} w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-pink-900 border-b border-purple-400/50 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">
                      {portals.find(p => p.id === activePortal)?.icon}
                    </span>
                    <h2 className="text-3xl font-bold text-white">
                      {portals.find(p => p.id === activePortal)?.label}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActivePortal(null)}
                    className="text-purple-300 hover:text-white transition-colors text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-8">
                {activePortal === 'questions' && mbtiType && (
                  <SixSoulQuestions
                    type={mbtiType}
                    soulData={soulData}
                    profile={profile}
                  />
                )}

                {activePortal === 'cognitive' && mbtiType && (
                  <CognitiveFunctionsDisplay
                    type={mbtiType}
                  />
                )}

                {activePortal === 'compatibility' && mbtiType && (
                  <CompatibilityDiscovery
                    userType={mbtiType}
                    topMatches={topMatches}
                    onSelectMatch={(partnerType) => {
                      setSelectedPartner(partnerType);
                      setActivePortal('soul');
                    }}
                  />
                )}

                {activePortal === 'soul' && mbtiType && selectedPartner && (
                  <FiveWHSoulAnalysis
                    userType={mbtiType}
                    partnerType={selectedPartner}
                    onBack={() => {
                      setSelectedPartner(null);
                      setActivePortal('compatibility');
                    }}
                  />
                )}

                {activePortal === 'soul' && mbtiType && !selectedPartner && (
                  <div className="space-y-6">
                    <p className="text-purple-200 text-center text-lg mb-6">
                      Select a compatibility match to reveal the deep 5W+H+Soul analysis
                    </p>
                    <button
                      onClick={() => setActivePortal('compatibility')}
                      className="mx-auto block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                    >
                      Go to Compatibility →
                    </button>
                  </div>
                )}

                {activePortal === 'growth' && (
                  <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 border border-emerald-500/30 rounded-lg p-8 text-center">
                    <span className="text-6xl block mb-4">🌱</span>
                    <h3 className="text-2xl font-bold text-emerald-300 mb-4">
                      Growth Path Analysis
                    </h3>
                    <p className="text-emerald-200">
                      Personalized growth guidance for {mbtiType || 'your type'} is coming soon.
                      This will reveal your developmental journey and transformation path.
                    </p>
                  </div>
                )}

                {activePortal === 'gifts' && (
                  <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 border border-violet-500/30 rounded-lg p-8 text-center">
                    <span className="text-6xl block mb-4">🎁</span>
                    <h3 className="text-2xl font-bold text-violet-300 mb-4">
                      Natural Gifts Analysis
                    </h3>
                    <p className="text-violet-200">
                      Your unique strengths and natural talents for {mbtiType || 'your type'} are being revealed.
                      This will show what you effortlessly bring to the world.
                    </p>
                  </div>
                )}
              </div>

              {/* Sticky Footer with Return Button */}
              <div className="sticky bottom-0 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-purple-500/30 p-6 rounded-b-3xl">
                <button
                  onClick={() => {
                    // Smart navigation: if we're in soul analysis with a partner, go back to compatibility
                    if (activePortal === 'soul' && selectedPartner) {
                      setSelectedPartner(null);
                      setActivePortal('compatibility');
                    } else {
                      setActivePortal(null);
                    }
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  {activePortal === 'soul' && selectedPartner 
                    ? '← Back to Compatibility' 
                    : 'Return to Rose Window →'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 💜 Type Deep Dive Modal - THE SOUL ENCYCLOPEDIA */}
      {/* Opens when user clicks center medallion */}
      {/* "Tell me about MY type - the HEART, the CENTER" */}
      {showTypeDeepDive && mbtiType && (
        <TypeDeepDive
          type={mbtiType}
          onClose={() => setShowTypeDeepDive(false)}
        />
      )}
    </div>
  );
}
