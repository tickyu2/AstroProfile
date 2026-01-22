/**
 * LANGUAGE TOGGLE COMPONENT
 *
 * Beautiful dropdown for selecting display language
 * Integrates with LanguageContext for global state management
 */

import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

export default function LanguageToggle({ compact = false, className = '' }) {
  const { language, languageInfo, setLanguage, supportedLanguages, isTranslating } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageSelect = async (langCode) => {
    await setLanguage(langCode)
    setIsOpen(false)
  }

  if (compact) {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-600/50 hover:border-amber-500/50 transition-all text-sm"
          title={`Language: ${languageInfo.name}`}
        >
          <span className="text-lg">{languageInfo.flag}</span>
          {isTranslating && (
            <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 transition-colors text-left ${
                    lang.code === language ? 'bg-amber-500/20 text-amber-400' : 'text-white'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1 text-sm">{lang.nativeName}</span>
                  {lang.code === language && (
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 hover:border-amber-500/50 transition-all"
      >
        <span className="text-xl">{languageInfo.flag}</span>
        <div className="flex flex-col items-start">
          <span className="text-white text-sm font-medium">{languageInfo.nativeName}</span>
          <span className="text-slate-400 text-xs">{languageInfo.name}</span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {isTranslating && (
          <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Select Language</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 transition-colors text-left ${
                  lang.code === language ? 'bg-amber-500/20' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${lang.code === language ? 'text-amber-400' : 'text-white'}`}>
                    {lang.nativeName}
                  </div>
                  <div className="text-xs text-slate-400">{lang.name}</div>
                </div>
                {lang.code === language && (
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
