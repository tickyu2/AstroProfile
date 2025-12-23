import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { clearConversationCache } from '../services/aiSoulPartnerService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Register with email/password
  const signup = async (email, password, displayName) => {
    try {
      setError(null)

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName })

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName,
        photoURL: null,
        authProvider: 'email',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        accountStatus: 'active',
        subscriptionTier: 'free',
        tokenUsage: {
          used: 0,
          remaining: 1000,
          lastReset: serverTimestamp(),
          resetPeriod: 'monthly'
        },
        profileCount: 0,
        favoriteProfileIds: [],
        defaultProfileId: null,
        visibility: 'active',
        discoverableBy: 'everyone',
        privacySettings: {
          showLocation: true,
          allowMessaging: true,
          showInSearch: true,
          shareWithGroups: true
        },
        currentLocation: null,
        searchPreferences: {
          defaultRadius: 50000, // 50km
          regions: [],
          savedSearches: []
        },
        lookingFor: null,
        groupIds: [],
        preferences: {
          theme: 'cosmic',
          notifications: {
            email: true,
            push: false,
            messages: true,
            reminders: true,
            dailyGuidance: false
          },
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        aiInteractionCount: 0,
        lastAiInteraction: null
      })

      return userCredential.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Login with email/password
  const login = async (email, password) => {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Update last login timestamp
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        { lastLoginAt: serverTimestamp() },
        { merge: true }
      )

      return userCredential.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Logout
  const logout = async () => {
    try {
      setError(null)
      // Clear all caches before logout (security: prevent data leakage to next user)
      clearConversationCache()
      console.log('🔐 [AuthContext] Cleared all caches on logout')
      await signOut(auth)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Password reset
  const resetPassword = async (email) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Get user profile data from Firestore
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      return userDoc.exists() ? userDoc.data() : null
    } catch (err) {
      console.error('Error fetching user profile:', err)
      return null
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    getUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
