/**
 * LANGUAGE CONTEXT
 *
 * Global language state management for multi-language support
 * "A Cathedral to house all souls" - Speaks the language of each user's heart
 *
 * Features:
 * - Persists language preference to localStorage and Firestore
 * - Provides translation utilities via context
 * - Auto-detects user's preferred language from browser
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'
import {
  translateMessage,
  detectLanguage,
  getSupportedLanguages,
  getLanguageDisplayName,
  getLanguageNativeName,
  getLanguageFlag,
  LANGUAGE_DISPLAY
} from '../services/translationService'

const LanguageContext = createContext({})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

// Detect browser language
const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage
  const langCode = browserLang.split('-')[0].toLowerCase()
  return LANGUAGE_DISPLAY[langCode] ? langCode : 'en'
}

export function LanguageProvider({ children }) {
  const { currentUser } = useAuth()
  const [language, setLanguageState] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem('preferredLanguage')
    if (stored && LANGUAGE_DISPLAY[stored]) {
      return stored
    }
    // Fall back to browser language
    return getBrowserLanguage()
  })
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCache, setTranslationCache] = useState({})

  // Load user's language preference from Firestore
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (!currentUser?.uid) return

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (userData.preferredLanguage && LANGUAGE_DISPLAY[userData.preferredLanguage]) {
            setLanguageState(userData.preferredLanguage)
            localStorage.setItem('preferredLanguage', userData.preferredLanguage)
          }
        }
      } catch (error) {
        console.error('Error loading user language preference:', error)
      }
    }

    loadUserLanguage()
  }, [currentUser])

  // Set language and persist to storage
  const setLanguage = useCallback(async (langCode) => {
    if (!LANGUAGE_DISPLAY[langCode]) {
      console.warn(`Language ${langCode} not supported`)
      return
    }

    setLanguageState(langCode)
    localStorage.setItem('preferredLanguage', langCode)

    // Persist to Firestore if logged in
    if (currentUser?.uid) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          preferredLanguage: langCode,
          updatedAt: new Date()
        })
      } catch (error) {
        console.error('Error saving language preference:', error)
      }
    }
  }, [currentUser])

  // Translate text to current language with caching
  const translate = useCallback(async (text, sourceLanguage = 'en') => {
    if (!text || language === sourceLanguage) {
      return text
    }

    // Check cache
    const cacheKey = `${sourceLanguage}:${language}:${text}`
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey]
    }

    setIsTranslating(true)
    try {
      const result = await translateMessage(text, language, sourceLanguage)
      const translatedText = result.translatedText || text

      // Update cache
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }))

      return translatedText
    } catch (error) {
      console.error('Translation error:', error)
      return text
    } finally {
      setIsTranslating(false)
    }
  }, [language, translationCache])

  // Batch translate multiple texts
  const translateBatch = useCallback(async (texts, sourceLanguage = 'en') => {
    if (language === sourceLanguage) {
      return texts
    }

    setIsTranslating(true)
    try {
      const results = await Promise.all(
        texts.map(text => translate(text, sourceLanguage))
      )
      return results
    } finally {
      setIsTranslating(false)
    }
  }, [language, translate])

  // Clear translation cache
  const clearCache = useCallback(() => {
    setTranslationCache({})
  }, [])

  // Get current language info
  const languageInfo = {
    code: language,
    name: getLanguageDisplayName(language),
    nativeName: getLanguageNativeName(language),
    flag: getLanguageFlag(language),
    isEnglish: language === 'en'
  }

  const value = {
    // Current language
    language,
    languageInfo,
    setLanguage,

    // Translation utilities
    translate,
    translateBatch,
    detectLanguage,
    isTranslating,

    // Language data
    supportedLanguages: getSupportedLanguages(),
    getLanguageDisplayName,
    getLanguageNativeName,
    getLanguageFlag,

    // Cache management
    clearCache
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext
