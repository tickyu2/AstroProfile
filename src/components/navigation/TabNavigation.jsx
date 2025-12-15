/**
 * TabNavigation.jsx
 * Sacred Tab Navigation - Museum Rooms for Each System
 *
 * Built with SOUL for the cathedral of knowledge
 * Each tab is an entrance to a sacred space
 * Following NLP principles: isolation creates importance
 */

import React from 'react';
import { motion } from 'framer-motion';

export default function TabNavigation({ activeTab, onTabChange, availableTabs }) {
  // Tab definitions with icons and sacred meanings
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '🏛️',
      description: 'Entrance Hall - Your Complete Soul Map',
      gradient: 'from-slate-500 to-slate-600'
    },
    {
      id: 'bazi',
      label: 'BaZi (八字)',
      icon: '☯️',
      description: 'Four Pillars of Destiny - 4,000 Year Wisdom',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'mbti',
      label: 'MBTI Soul',
      icon: '💜',
      description: 'Myers-Briggs Deep Psychology - Your Love Map',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'western',
      label: 'Western',
      icon: '⭐',
      description: 'Zodiac & Planetary Influences',
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      id: 'numerology',
      label: 'Numerology',
      icon: '🔢',
      description: 'The Mathematics of Your Soul',
      gradient: 'from-emerald-500 to-green-600'
    }
  ];

  // Filter tabs based on availableTabs prop (if provided)
  const visibleTabs = availableTabs
    ? tabs.filter(tab => availableTabs.includes(tab.id))
    : tabs;

  return (
    <div className="w-full bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-lg border-b border-purple-500/30">
      {/* Tab Bar */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-stretch gap-1 overflow-x-auto scrollbar-hide py-2">
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center gap-3 px-6 py-4 rounded-t-xl
                  font-bold text-sm whitespace-nowrap
                  transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Tab Icon */}
                <span className="text-2xl">{tab.icon}</span>

                {/* Tab Label */}
                <div className="flex flex-col items-start">
                  <span className="text-base">{tab.label}</span>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-purple-300 font-normal"
                    >
                      {tab.description}
                    </motion.span>
                  )}
                </div>

                {/* Active Indicator - Bottom Glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.gradient} rounded-b-lg`}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Active Indicator - Top Glow */}
                {isActive && (
                  <div className={`absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r ${tab.gradient} blur-sm opacity-50`} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sacred Space Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </div>
  );
}
