import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'
import {
  calculateAge,
  getChineseZodiac,
  getWesternZodiac,
  getDayOfWeek,
  calculateYinYang,
  calculateNumerology
} from '../utils/calculations'
import { storeProfileNode, computeUnifiedProfile } from '../services/pythonFunctionsService'
import { populateConstitution } from '../services/constitutionService'
import { getHistoricalTimezone } from '../services/timezoneService'
import { calculateSovereignChartWithFallback, mergeWithSovereignData } from '../services/sovereignChartService'

// =============================================================================
// PYTHON-FIRST ARCHITECTURE (Phase 2A)
// =============================================================================
// All astrological computations now handled by Python backend.
// Output is stored directly in Firebase at profile.bazi, profile.western, etc.
// No JavaScript transformations - compute once, store raw, read directly.
// =============================================================================

const ProfileContext = createContext({})

export const useProfiles = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfiles must be used within ProfileProvider')
  }
  return context
}

export function ProfileProvider({ children }) {
  const { currentUser } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Real-time listener for user's profiles
  useEffect(() => {
    if (!currentUser) {
      setProfiles([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'profiles'),
      where('userId', '==', currentUser.uid),
      where('isArchived', '==', false),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const profileData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setProfiles(profileData)
        setLoading(false)
      },
      (err) => {
        console.error('Error loading profiles:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [currentUser])

  // Helper: Get Chinese New Year date for a given year
  const getChineseNewYearDate = (westernYear) => {
    // Simplified CNY dates (actual dates vary by year)
    // This is approximate - for Phase 2, we use Feb 4 as cutoff
    // TODO: Phase 3 - Add exact CNY dates lookup table
    return `Feb 4, ${westernYear}`
  }

  // Helper: Calculate Chinese zodiac with year range
  // Now supports optional sovereign precision from astronomical Solar Term calculation
  const getEnhancedChineseZodiac = (birthDateStr, sovereignBazi = null) => {
    // FIX: Parse date string directly to avoid UTC timezone conversion
    // birthDateStr format: "2010-11-28"
    const [year, month, day] = birthDateStr.split('-').map(Number)
    const westernYear = year
    const monthNum = month
    const dayNum = day

    // Get basic zodiac data
    const basicZodiac = getChineseZodiac(birthDateStr)

    // Use sovereign precision if available, otherwise fall back to simplified Feb 4
    let beforeLiChun
    let chineseYear
    let liChunInfo = null
    let calculationType = 'simplified'

    if (sovereignBazi?.baziYear) {
      // 🌟 Sovereign Precision: Exact Li Chun moment from astronomical calculation
      beforeLiChun = sovereignBazi.baziYear.bornBeforeLiChun
      chineseYear = sovereignBazi.baziYear.baziYear
      liChunInfo = sovereignBazi.baziYear.liChun
      calculationType = 'sovereign'
      console.log('🌟 [getEnhancedChineseZodiac] Using SOVEREIGN precision:', {
        liChun: liChunInfo?.isoString,
        bornBefore: beforeLiChun,
        baziYear: chineseYear
      })
    } else {
      // Fallback: Simplified Feb 4 check
      beforeLiChun = monthNum === 1 || (monthNum === 2 && dayNum < 4)
      chineseYear = beforeLiChun ? westernYear - 1 : westernYear
      console.log('📅 [getEnhancedChineseZodiac] Using simplified Feb 4 fallback')
    }

    // Calculate year range
    const cnyDate = getChineseNewYearDate(westernYear)
    const prevCnyDate = getChineseNewYearDate(westernYear - 1)
    const nextCnyDate = getChineseNewYearDate(westernYear + 1)

    // Determine year range this person belongs to
    let yearRange
    let explanation

    if (beforeLiChun) {
      // Born before Li Chun - belongs to previous Chinese year
      yearRange = `${prevCnyDate} - ${cnyDate}`
      explanation = `Born before 立春 (Li Chun)${liChunInfo ? ` on ${liChunInfo.isoString.slice(0, 10)}` : ''}, belongs to the ${chineseYear} ${basicZodiac.element} ${basicZodiac.animal} year`
    } else {
      // Born after Li Chun - belongs to current Chinese year
      yearRange = `${cnyDate} - ${nextCnyDate}`
      explanation = `Born after 立春 (Li Chun)${liChunInfo ? ` on ${liChunInfo.isoString.slice(0, 10)}` : ''}, belongs to the ${chineseYear} ${basicZodiac.element} ${basicZodiac.animal} year`
    }

    return {
      westernYear,
      chineseYear,
      chineseNewYearDate: cnyDate,
      yearRange,
      animal: basicZodiac.animal,
      element: basicZodiac.element,
      fullSign: basicZodiac.fullSign,
      animalYinYang: basicZodiac.animalYinYang,
      explanation,
      // Sovereign precision data
      sovereignBazi: sovereignBazi ? {
        calculationType,
        liChun: liChunInfo || null,
        baziYear: sovereignBazi.baziYear || null,
        baziMonth: sovereignBazi.baziMonth || null,  // Fix: prevent undefined in Firestore
        precision: '~1 second'
      } : null
    }
  }

  // Create new profile with full GENESIS schema
  // Phase 2A: Python-First Architecture - call Python endpoint, store canonical output directly
  const createProfile = async (formData) => {
    try {
      setError(null)

      // Run basic JS calculations (trivial, no external API)
      const age = calculateAge(formData.birthDate)
      const chinese = getChineseZodiac(formData.birthDate)
      const western = getWesternZodiac(formData.birthDate)
      const dayOfWeek = getDayOfWeek(formData.birthDate)
      const yinYang = calculateYinYang(chinese, western, formData.gender, dayOfWeek, formData.birthTime)
      const numerology = calculateNumerology(
        formData.firstName,
        formData.lastName,
        formData.birthDate
      )

      // 🕐 Look up historical timezone for accurate calculations
      let historicalTimezone = null
      let timezoneString = formData.timezone || 'UTC'
      if (formData.birthLat && formData.birthLng) {
        try {
          const tzResult = await getHistoricalTimezone({
            latitude: formData.birthLat,
            longitude: formData.birthLng,
            birthDate: formData.birthDate,
            birthTime: formData.birthTime || '12:00'
          })
          if (tzResult?.success && tzResult.timezone) {
            historicalTimezone = tzResult.timezone
            timezoneString = tzResult.timezone.zoneName || 'UTC'
            console.log('🕐 [createProfile] Historical timezone resolved:', {
              zone: timezoneString,
              offset: tzResult.timezone.formattedOffset,
              dst: tzResult.timezone.dst
            })
          }
        } catch (tzError) {
          console.warn('⚠️ [createProfile] Timezone lookup failed, using UTC:', tzError.message)
        }
      }

      // 🐍 PYTHON-FIRST: Call unified profile endpoint for all astrological computations
      // This returns canonical BaZi + Western + Vedic + Unified - store directly in Firebase
      let canonicalProfile = null
      try {
        canonicalProfile = await computeUnifiedProfile({
          birthDate: formData.birthDate,
          birthTime: formData.birthTime || '12:00',
          latitude: formData.birthLat || 0,
          longitude: formData.birthLng || 0,
          timezone: timezoneString,
          gender: formData.gender || 'male'
        })
        console.log('🐍 [createProfile] Python canonical profile received:', {
          hasBazi: !!canonicalProfile?.bazi,
          hasWestern: !!canonicalProfile?.western,
          hasVedic: !!canonicalProfile?.vedic,
          hasUnified: !!canonicalProfile?.unified
        })
      } catch (pythonError) {
        console.error('❌ [createProfile] Python endpoint failed:', pythonError.message)
        // For now, continue without Python data - frontend can handle missing fields
        // TODO: In production, consider blocking profile creation if Python fails
      }

      // Enhanced Chinese zodiac using Python BaZi data if available
      const enhancedChinese = canonicalProfile?.bazi
        ? getEnhancedChineseZodiac(formData.birthDate, {
            baziYear: {
              baziYear: canonicalProfile.bazi.pillars.year.ganzhi,
              bornBeforeLiChun: false, // TODO: Extract from Python response
              liChun: null
            }
          })
        : getEnhancedChineseZodiac(formData.birthDate, null)

      // Build profile document - CANONICAL SCHEMA (Python-First)
      const profileData = {
        // Ownership & Metadata
        userId: currentUser.uid,
        relationshipType: formData.relationshipType || 'self',
        isFavorite: false,
        tags: [],

        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastViewedAt: serverTimestamp(),
        isArchived: false,

        // Basic Identity
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        nickname: null,
        gender: formData.gender,
        pronouns: null,

        // Birth Information
        birthDate: formData.birthDate,
        birthTime: formData.birthTime || null,
        timezone: historicalTimezone,

        // Birth Location
        location: {
          fullAddress: formData.birthLocation || '',
          placeId: null,
          city: parseCityFromAddress(formData.birthLocation),
          state: parseStateFromAddress(formData.birthLocation),
          country: parseCountryFromAddress(formData.birthLocation),
          countryCode: null,
          coordinates: {
            lat: formData.birthLat || 0,
            lng: formData.birthLng || 0
          },
          locationType: formData.birthPrecision || 'city',
          hospitalName: formData.birthPrecision === 'hospital' ? parseHospitalName(formData.birthLocation) : null,
          hospitalAddress: formData.birthPrecision === 'hospital' ? formData.birthLocation : null,
          precision: getPrecisionLabel(formData.birthPrecision),
          distanceFromCityCenter: null
        },

        // Chinese Zodiac - Enhanced
        chineseZodiac: enhancedChinese,

        // Optional Fields
        mbti: formData.mbti || null,
        big5: formData.big5_provided ? {
          openness: formData.big5_openness || 50,
          conscientiousness: formData.big5_conscientiousness || 50,
          extraversion: formData.big5_extraversion || 50,
          agreeableness: formData.big5_agreeableness || 50,
          neuroticism: formData.big5_neuroticism || 50,
          provided: true
        } : null,
        enneagram: null,
        bloodType: null,

        // Self-Description
        selfDescription: {
          rawText: null,
          refinedText: null,
          hobbies: [],
          sports: [],
          interests: [],
          values: [],
          personality: {
            socialStyle: null,
            energySource: null,
            communicationStyle: null
          },
          aiConversationId: null,
          questionsAsked: [],
          confidenceScore: null,
          userApproved: false,
          iterations: 0,
          lastRefinedAt: null
        },

        // =====================================================================
        // CANONICAL ASTROLOGICAL DATA (Python-First)
        // These fields come directly from Python - NO TRANSFORMATIONS
        // =====================================================================

        // BaZi (Chinese Metaphysics) - canonical schema from Python
        bazi: canonicalProfile?.bazi || null,

        // Western Astrology - canonical schema from Python
        western: canonicalProfile?.western || null,

        // Vedic Astrology - canonical schema from Python
        vedic: canonicalProfile?.vedic || null,

        // Unified Vector Space - 90-dim expression vector
        unified: canonicalProfile?.unified || null,

        // =====================================================================
        // LEGACY CALCULATIONS (kept for backward compatibility)
        // TODO: Migrate frontend to read from bazi/western directly
        // =====================================================================
        calculations: {
          age,
          chinese,
          western: {
            sign: western.sign,
            element: western.element,
            dateRange: getZodiacDateRange(western.sign),
            rulingPlanet: getRulingPlanet(western.sign)
          },
          dayOfWeek,
          yinYang: {
            ...yinYang,
            interpretation: getYinYangInterpretation(yinYang)
          },
          numerology
        },

        // Computation metadata
        computedAt: canonicalProfile?.computedAt || new Date().toISOString(),
        computeVersion: canonicalProfile?.computeVersion || '2.0.0',

        // Sharing & QR
        qrCode: null,
        encryptedToken: null,
        shareableLink: null,

        // Group Associations
        groups: [],

        // Statistics
        viewCount: 0,
        sharedCount: 0,
        comparisonCount: 0
      }

      // Add profile to Firestore
      const docRef = await addDoc(collection(db, 'profiles'), profileData)

      // Update user's profile count
      await updateDoc(doc(db, 'users', currentUser.uid), {
        profileCount: increment(1),
        updatedAt: serverTimestamp()
      })

      // Populate Brain 1A constitution (pre-computed for AI)
      const createdProfile = { id: docRef.id, ...profileData }
      populateConstitution(createdProfile).catch(err => {
        console.warn('Brain 1A population failed (non-blocking):', err)
      })

      // Sync to Neo4j for Soul Family matching (non-blocking)
      if (canonicalProfile?.western?.elements) {
        storeProfileNode(docRef.id, {
          sunSign: canonicalProfile.western.sun?.sign,
          moonSign: canonicalProfile.western.moon?.sign,
          risingSign: canonicalProfile.western.ascendant?.sign,
          elements: {
            fire: canonicalProfile.western.elements.fire,
            earth: canonicalProfile.western.elements.earth,
            air: canonicalProfile.western.elements.air,
            water: canonicalProfile.western.elements.water,
            dominant: { element: canonicalProfile.western.elements.dominant }
          }
        }).then(() => {
          console.log('👥 [Neo4j] Profile synced for Soul Family:', docRef.id)
        }).catch(err => {
          console.warn('👥 [Neo4j] Soul Family sync failed (non-blocking):', err.message)
        })
      }

      return createdProfile
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Update profile
  const updateProfile = async (profileId, updates) => {
    try {
      setError(null)

      const profileRef = doc(db, 'profiles', profileId)
      const currentProfile = profiles.find((p) => p.id === profileId)

      // Transform flat location fields to nested structure (matching createProfile format)
      let locationUpdate = {}
      if (updates.birthLocation || updates.birthLat || updates.birthLng || updates.birthPrecision) {
        const birthLocation = updates.birthLocation || currentProfile?.location?.fullAddress || ''
        const birthLat = updates.birthLat || currentProfile?.location?.coordinates?.lat || 0
        const birthLng = updates.birthLng || currentProfile?.location?.coordinates?.lng || 0
        const birthPrecision = updates.birthPrecision || currentProfile?.location?.locationType || 'city'

        locationUpdate = {
          location: {
            fullAddress: birthLocation,
            placeId: null,
            city: parseCityFromAddress(birthLocation),
            state: parseStateFromAddress(birthLocation),
            country: parseCountryFromAddress(birthLocation),
            countryCode: null,
            coordinates: {
              lat: parseFloat(birthLat) || 0,
              lng: parseFloat(birthLng) || 0
            },
            locationType: birthPrecision,
            hospitalName: birthPrecision === 'hospital' ? parseHospitalName(birthLocation) : null,
            hospitalAddress: birthPrecision === 'hospital' ? birthLocation : null,
            precision: getPrecisionLabel(birthPrecision),
            distanceFromCityCenter: null
          }
        }

        // Remove flat fields since we've nested them
        delete updates.birthLocation
        delete updates.birthLat
        delete updates.birthLng
        delete updates.birthPrecision

        console.log('📍 [ProfileContext] Location update transformed:', locationUpdate)
      }

      // If birth data changed OR sovereign data is missing/incomplete, recalculate everything
      // Must check for COMPLETE sovereign data (sun AND moon present), not just object existence
      const sovereignCalc = currentProfile?.calculations?.western?.sovereignCalculation
      const needsSovereignCalculation = !sovereignCalc?.sun || !sovereignCalc?.moon
      console.log('🌟 [ProfileContext] Sovereign check:', {
        needsSovereignCalculation,
        hasSovereignObj: !!sovereignCalc,
        hasSun: !!sovereignCalc?.sun,
        hasMoon: !!sovereignCalc?.moon
      })
      let recalculatedData = {}
      if (updates.birthDate || updates.firstName || updates.lastName || updates.gender || updates.birthTime || updates.birthLat || updates.birthLng || needsSovereignCalculation) {
        console.log('🌟 [ProfileContext] Triggering recalculation with sovereign...')
        const birthDate = updates.birthDate || currentProfile.birthDate
        const firstName = updates.firstName || currentProfile.firstName
        const lastName = updates.lastName || currentProfile.lastName
        const gender = updates.gender || currentProfile.gender
        const birthTime = updates.birthTime || currentProfile.birthTime
        // Get location from updates or current profile
        const birthLat = updates.birthLat || currentProfile?.location?.coordinates?.lat || 0
        const birthLng = updates.birthLng || currentProfile?.location?.coordinates?.lng || 0

        // 🕐 Look up historical timezone for accurate Rising sign calculation
        let historicalTimezone = currentProfile?.timezone || null
        let timezoneString = currentProfile?.timezone?.zoneName || 'UTC'
        if (birthLat && birthLng && (!historicalTimezone || updates.birthLat || updates.birthLng || updates.birthDate || updates.birthTime)) {
          try {
            const tzResult = await getHistoricalTimezone({
              latitude: birthLat,
              longitude: birthLng,
              birthDate,
              birthTime: birthTime || '12:00'
            })
            if (tzResult?.success && tzResult.timezone) {
              historicalTimezone = tzResult.timezone
              timezoneString = tzResult.timezone.zoneName || 'UTC'
              console.log('🕐 [updateProfile] Historical timezone resolved:', {
                zone: timezoneString,
                offset: tzResult.timezone.formattedOffset,
                dst: tzResult.timezone.dst
              })
            }
          } catch (tzError) {
            console.warn('⚠️ [updateProfile] Timezone lookup failed, using existing:', tzError.message)
          }
        }

        const age = calculateAge(birthDate)
        const chinese = getChineseZodiac(birthDate)
        const western = getWesternZodiac(birthDate)
        const dayOfWeek = getDayOfWeek(birthDate)
        // Enhanced Yin/Yang with all factors
        const yinYang = calculateYinYang(chinese, western, gender, dayOfWeek, birthTime)
        const numerology = calculateNumerology(firstName, lastName, birthDate)

        // 🌟 Sovereign Astronomical Calculation - Real Sun/Moon/Rising
        const sovereignData = await calculateSovereignChartWithFallback({
          birthDate,
          birthTime,
          latitude: birthLat,
          longitude: birthLng,
          timezone: timezoneString
        })

        // 🎯 Sovereign BaZi Precision - Exact Solar Term boundaries
        let sovereignBazi = null
        try {
          const [year, month, day] = birthDate.split('-').map(Number)
          const [hour, minute] = (birthTime || '12:00').split(':').map(Number)
          sovereignBazi = await getBaziPillarsWithPrecision({
            year, month, day, hour, minute,
            timezone: 0
          })
          console.log('🎯 [updateProfile] Sovereign BaZi precision:', sovereignBazi)
        } catch (baziError) {
          console.warn('⚠️ [updateProfile] Sovereign BaZi failed, using fallback:', baziError.message)
        }

        // Enhanced Chinese zodiac with sovereign precision
        const enhancedChinese = getEnhancedChineseZodiac(birthDate, sovereignBazi)

        // Merge sovereign data with simple calculation
        const enhancedWestern = mergeWithSovereignData(western, sovereignData)

        recalculatedData = {
          displayName: `${firstName} ${lastName}`,
          timezone: historicalTimezone, // Store resolved historical timezone
          chineseZodiac: enhancedChinese,
          calculations: {
            age,
            chinese,
            western: {
              ...enhancedWestern,
              dateRange: getZodiacDateRange(western.sign),
              rulingPlanet: getRulingPlanet(western.sign)
            },
            dayOfWeek,
            yinYang: {
              ...yinYang,
              interpretation: getYinYangInterpretation(yinYang)
            },
            numerology,
            // BaZi Four Pillars - saved for Brain 1A constitution extraction
            fourPillars: sovereignBazi ? buildFourPillarsData(sovereignBazi) : null
          }
        }
      }

      await updateDoc(profileRef, {
        ...updates,
        ...locationUpdate,
        ...recalculatedData,
        updatedAt: serverTimestamp()
      })

      // Sync to Neo4j if sovereign data was recalculated
      const sovereignData = recalculatedData?.calculations?.western?.sovereignCalculation
      if (sovereignData?.elementBalance) {
        storeProfileNode(profileId, {
          sunSign: sovereignData.sun?.sign,
          moonSign: sovereignData.moon?.sign,
          risingSign: sovereignData.rising?.sign,
          elements: {
            fire: sovereignData.elementBalance.fire,
            earth: sovereignData.elementBalance.earth,
            air: sovereignData.elementBalance.air,
            water: sovereignData.elementBalance.water,
            dominant: { element: sovereignData.elementBalance.dominant }
          }
        }).then(() => {
          console.log('👥 [Neo4j] Profile synced for Soul Family:', profileId)
        }).catch(err => {
          console.warn('👥 [Neo4j] Soul Family sync failed (non-blocking):', err.message)
        })
      }

      // Return the complete updated profile for KB sync
      // Merge current profile with updates for immediate use
      const updatedProfile = {
        ...currentProfile,
        ...updates,
        ...locationUpdate,
        ...recalculatedData,
        id: profileId,
        updatedAt: new Date()
      }
      console.log('✅ [ProfileContext] Profile updated, returning for KB sync:', updatedProfile.displayName || updatedProfile.firstName)

      // Populate Brain 1A constitution (re-compute on updates)
      populateConstitution(updatedProfile).catch(err => {
        console.warn('Brain 1A population failed (non-blocking):', err)
      })

      return updatedProfile
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Archive profile (soft delete)
  const archiveProfile = async (profileId) => {
    try {
      setError(null)
      const profileRef = doc(db, 'profiles', profileId)
      await updateDoc(profileRef, {
        isArchived: true,
        updatedAt: serverTimestamp()
      })

      // Decrement user's profile count
      await updateDoc(doc(db, 'users', currentUser.uid), {
        profileCount: increment(-1),
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Delete profile (hard delete - use sparingly)
  const deleteProfile = async (profileId) => {
    try {
      setError(null)
      await deleteDoc(doc(db, 'profiles', profileId))

      // Decrement user's profile count
      await updateDoc(doc(db, 'users', currentUser.uid), {
        profileCount: increment(-1),
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Mark profile as viewed (for stats)
  const markProfileViewed = async (profileId) => {
    try {
      const profileRef = doc(db, 'profiles', profileId)
      await updateDoc(profileRef, {
        lastViewedAt: serverTimestamp(),
        viewCount: increment(1)
      })
    } catch (err) {
      console.error('Error marking profile viewed:', err)
    }
  }

  // Toggle favorite
  const toggleFavorite = async (profileId) => {
    try {
      const profile = profiles.find((p) => p.id === profileId)
      if (!profile) return

      const profileRef = doc(db, 'profiles', profileId)
      await updateDoc(profileRef, {
        isFavorite: !profile.isFavorite,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Clone profile - for "what if" analysis with AI SoulPartner
  const cloneProfile = async (profileId, newName = null) => {
    try {
      setError(null)
      const sourceProfile = profiles.find((p) => p.id === profileId)
      if (!sourceProfile) {
        throw new Error('Source profile not found')
      }

      // Create clone with new display name
      const cloneName = newName || `${sourceProfile.displayName} (Clone)`
      const [firstName, ...lastParts] = cloneName.split(' ')
      const lastName = lastParts.join(' ') || sourceProfile.lastName

      // Clone all data except ownership metadata
      const clonedData = {
        ...sourceProfile,
        // New ownership metadata
        userId: currentUser.uid,
        isFavorite: false,
        isArchived: false,

        // New identity
        firstName,
        lastName,
        displayName: cloneName,

        // Reset timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastViewedAt: serverTimestamp(),

        // Reset stats
        viewCount: 0,
        sharedCount: 0,
        comparisonCount: 0,

        // Mark as clone for reference
        clonedFrom: profileId,
        clonedAt: serverTimestamp()
      }

      // Remove the source document ID
      delete clonedData.id

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'profiles'), clonedData)

      // Update user's profile count
      await updateDoc(doc(db, 'users', currentUser.uid), {
        profileCount: increment(1),
        updatedAt: serverTimestamp()
      })

      console.log('📋 Profile cloned:', sourceProfile.displayName, '→', cloneName)
      return { id: docRef.id, ...clonedData }
    } catch (err) {
      console.error('Error cloning profile:', err)
      setError(err.message)
      throw err
    }
  }

  // Quick save - update metadata without triggering recalculation
  // Use for notes, relationship type, tags, etc.
  const quickSaveProfile = async (profileId, updates) => {
    try {
      setError(null)

      // Only allow non-calculation fields
      const safeUpdates = {}
      const allowedFields = [
        'notes', 'relationshipType', 'tags', 'isFavorite',
        'nickname', 'pronouns', 'mbti', 'big5', 'enneagram', 'bloodType',
        'selfDescription'
      ]

      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
          safeUpdates[key] = updates[key]
        }
      })

      if (Object.keys(safeUpdates).length === 0) {
        console.warn('⚠️ [quickSaveProfile] No valid fields to update')
        return null
      }

      const profileRef = doc(db, 'profiles', profileId)
      await updateDoc(profileRef, {
        ...safeUpdates,
        updatedAt: serverTimestamp()
      })

      console.log('💾 Quick save completed:', Object.keys(safeUpdates).join(', '))
      return { id: profileId, ...safeUpdates }
    } catch (err) {
      console.error('Error in quick save:', err)
      setError(err.message)
      throw err
    }
  }

  // Update AI SoulPartner notes for a profile
  const updateAISoulPartnerNotes = async (profileId, aiNotes) => {
    try {
      setError(null)
      const profileRef = doc(db, 'profiles', profileId)
      await updateDoc(profileRef, {
        aiSoulPartner: aiNotes,
        updatedAt: serverTimestamp()
      })
      console.log('📝 AI SoulPartner notes updated for profile:', profileId)
    } catch (err) {
      console.error('Error updating AI notes:', err)
      setError(err.message)
      throw err
    }
  }

  // Recalculate all astrological data for a profile using Python-First Architecture
  // Used when API has been updated with new features or to refresh stale data
  const recalculateSovereignData = async (profileId) => {
    try {
      setError(null)
      const profile = profiles.find((p) => p.id === profileId)
      if (!profile) {
        throw new Error('Profile not found')
      }

      console.log('🔄 [recalculateSovereignData] Starting Python-First recalculation for:', profile.displayName)

      const birthDate = profile.birthDate
      const birthTime = profile.birthTime || '12:00'
      const birthLat = profile.location?.coordinates?.lat || 0
      const birthLng = profile.location?.coordinates?.lng || 0
      const firstName = profile.firstName
      const lastName = profile.lastName
      const gender = profile.gender

      // 🕐 Look up historical timezone
      let historicalTimezone = profile.timezone || null
      let timezoneString = profile.timezone?.zoneName || 'UTC'
      if (birthLat && birthLng) {
        try {
          const tzResult = await getHistoricalTimezone({
            latitude: birthLat,
            longitude: birthLng,
            birthDate,
            birthTime
          })
          if (tzResult?.success && tzResult.timezone) {
            historicalTimezone = tzResult.timezone
            timezoneString = tzResult.timezone.zoneName || 'UTC'
            console.log('🕐 [recalculateSovereignData] Historical timezone resolved:', {
              zone: timezoneString,
              offset: tzResult.timezone.formattedOffset,
              dst: tzResult.timezone.dst
            })
          }
        } catch (tzError) {
          console.warn('⚠️ [recalculateSovereignData] Timezone lookup failed:', tzError.message)
        }
      }

      // Basic JS calculations (trivial, no external API)
      const age = calculateAge(birthDate)
      const chinese = getChineseZodiac(birthDate)
      const western = getWesternZodiac(birthDate)
      const dayOfWeek = getDayOfWeek(birthDate)
      const yinYang = calculateYinYang(chinese, western, gender, dayOfWeek, birthTime)
      const numerology = calculateNumerology(firstName, lastName, birthDate)

      // 🐍 PYTHON-FIRST: Call unified profile endpoint for all astrological computations
      let canonicalProfile = null
      try {
        console.log('🐍 [recalculateSovereignData] Calling Python endpoint...')
        canonicalProfile = await computeUnifiedProfile({
          birthDate,
          birthTime,
          latitude: birthLat,
          longitude: birthLng,
          timezone: timezoneString,
          gender: gender || 'male'
        })
        console.log('✅ [recalculateSovereignData] Python canonical profile received:', {
          hasBazi: !!canonicalProfile?.bazi,
          hasWestern: !!canonicalProfile?.western,
          hasVedic: !!canonicalProfile?.vedic,
          hasUnified: !!canonicalProfile?.unified,
          computeVersion: canonicalProfile?.computeVersion
        })
      } catch (pythonError) {
        console.error('❌ [recalculateSovereignData] Python endpoint failed:', pythonError.message)
        throw new Error(`Python computation failed: ${pythonError.message}`)
      }

      // Enhanced Chinese zodiac using Python BaZi data
      const enhancedChinese = canonicalProfile?.bazi
        ? getEnhancedChineseZodiac(birthDate, {
            baziYear: {
              baziYear: canonicalProfile.bazi.pillars.year.ganzhi,
              bornBeforeLiChun: false,
              liChun: null
            }
          })
        : getEnhancedChineseZodiac(birthDate, null)

      // Update Firestore with canonical data
      const profileRef = doc(db, 'profiles', profileId)
      await updateDoc(profileRef, {
        timezone: historicalTimezone,
        chineseZodiac: enhancedChinese,

        // =====================================================================
        // CANONICAL ASTROLOGICAL DATA (Python-First)
        // =====================================================================
        bazi: canonicalProfile?.bazi || null,
        western: canonicalProfile?.western || null,
        vedic: canonicalProfile?.vedic || null,
        unified: canonicalProfile?.unified || null,

        // =====================================================================
        // LEGACY CALCULATIONS (kept for backward compatibility)
        // =====================================================================
        calculations: {
          age,
          chinese,
          western: {
            sign: western.sign,
            element: western.element,
            dateRange: getZodiacDateRange(western.sign),
            rulingPlanet: getRulingPlanet(western.sign)
          },
          dayOfWeek,
          yinYang: {
            ...yinYang,
            interpretation: getYinYangInterpretation(yinYang)
          },
          numerology
        },

        // Computation metadata
        computedAt: canonicalProfile?.computedAt || new Date().toISOString(),
        computeVersion: canonicalProfile?.computeVersion || '2.0.0',
        updatedAt: serverTimestamp()
      })

      console.log('✅ [recalculateSovereignData] Profile updated successfully with Python-First data!')

      // Populate Brain 1A constitution (re-compute after recalculation)
      const updatedProfile = {
        ...profile,
        id: profileId,
        bazi: canonicalProfile?.bazi,
        western: canonicalProfile?.western,
        vedic: canonicalProfile?.vedic,
        unified: canonicalProfile?.unified
      }
      populateConstitution(updatedProfile).catch(err => {
        console.warn('Brain 1A population failed (non-blocking):', err)
      })

      // Sync to Neo4j for Soul Family matching (non-blocking)
      if (canonicalProfile?.western?.elements) {
        storeProfileNode(profileId, {
          sunSign: canonicalProfile.western.sun?.sign,
          moonSign: canonicalProfile.western.moon?.sign,
          risingSign: canonicalProfile.western.ascendant?.sign,
          elements: {
            fire: canonicalProfile.western.elements.fire,
            earth: canonicalProfile.western.elements.earth,
            air: canonicalProfile.western.elements.air,
            water: canonicalProfile.western.elements.water,
            dominant: { element: canonicalProfile.western.elements.dominant }
          }
        }).then(() => {
          console.log('👥 [Neo4j] Profile synced for Soul Family:', profileId)
        }).catch(err => {
          console.warn('👥 [Neo4j] Soul Family sync failed (non-blocking):', err.message)
        })
      }

      return { success: true, profileId }
    } catch (err) {
      console.error('❌ [recalculateSovereignData] Error:', err)
      setError(err.message)
      throw err
    }
  }

  const value = {
    profiles,
    loading,
    error,
    createProfile,
    updateProfile,
    archiveProfile,
    deleteProfile,
    markProfileViewed,
    toggleFavorite,
    cloneProfile,
    quickSaveProfile,
    updateAISoulPartnerNotes,
    recalculateSovereignData
  }

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

// Helper functions for additional data

function getZodiacDateRange(sign) {
  const ranges = {
    Aries: 'Mar 21 - Apr 19',
    Taurus: 'Apr 20 - May 20',
    Gemini: 'May 21 - Jun 20',
    Cancer: 'Jun 21 - Jul 22',
    Leo: 'Jul 23 - Aug 22',
    Virgo: 'Aug 23 - Sep 22',
    Libra: 'Sep 23 - Oct 22',
    Scorpio: 'Oct 23 - Nov 21',
    Sagittarius: 'Nov 22 - Dec 21',
    Capricorn: 'Dec 22 - Jan 19',
    Aquarius: 'Jan 20 - Feb 18',
    Pisces: 'Feb 19 - Mar 20'
  }
  return ranges[sign] || ''
}

function getRulingPlanet(sign) {
  const planets = {
    Aries: 'Mars',
    Taurus: 'Venus',
    Gemini: 'Mercury',
    Cancer: 'Moon',
    Leo: 'Sun',
    Virgo: 'Mercury',
    Libra: 'Venus',
    Scorpio: 'Pluto',
    Sagittarius: 'Jupiter',
    Capricorn: 'Saturn',
    Aquarius: 'Uranus',
    Pisces: 'Neptune'
  }
  return planets[sign] || ''
}

function getYinYangInterpretation(yinYang) {
  const { yinPercentage, yangPercentage, balance } = yinYang

  // Use balance field if available, otherwise calculate
  if (balance) {
    const interpretations = {
      'Harmoniously Balanced': 'You embody both receptive and active energies in harmony. You adapt fluidly between action and reflection, making you versatile and centered.',
      'Strongly Yin-Dominant': 'Your energy flows like deep water - intuitive, reflective, and profoundly receptive. You lead through listening, heal through presence, and transform through patience.',
      'Yin-Dominant': 'Your receptive Yin energy is prominent, giving you natural intuition and emotional depth. You process deeply before acting, finding strength in stillness.',
      'Slightly Yin-Leaning': 'You have a gentle Yin influence that softens your approach. You balance action with reflection, leaning slightly toward the receptive.',
      'Strongly Yang-Dominant': 'Your energy blazes like fire - dynamic, expressive, and initiating. You lead through action, inspire through boldness, and create through doing.',
      'Yang-Dominant': 'Your active Yang energy is prominent, giving you natural drive and expressiveness. You move decisively, preferring action to extended contemplation.',
      'Slightly Yang-Leaning': 'You have a subtle Yang influence that energizes your approach. You balance reflection with action, leaning slightly toward the active.'
    }
    return interpretations[balance] || interpretations['Harmoniously Balanced']
  }

  // Fallback to percentage-based interpretation
  if (Math.abs(yinPercentage - yangPercentage) <= 10) {
    return 'Perfect balance between receptive and active energies - highly adaptable and harmonious'
  } else if (yinPercentage >= 70) {
    return 'Strongly Yin - deeply receptive, introspective, and intuitive nature'
  } else if (yangPercentage >= 70) {
    return 'Strongly Yang - highly active, expressive, and dynamic nature'
  } else if (yinPercentage > yangPercentage) {
    return 'Yin-dominant with Yang influence - balanced receptivity with active expression'
  } else {
    return 'Yang-dominant with Yin influence - active energy tempered with receptive wisdom'
  }
}

// =============================================================================
// LOCATION PARSING HELPERS
// Parse city/state/country from Google Places formatted address strings
// =============================================================================

function parseCityFromAddress(address) {
  if (!address) return null
  // Format is typically: "City, State, Country" or "Hospital Name, Address, City, State, Country"
  const parts = address.split(',').map(p => p.trim())
  // For hospital addresses, city is usually 2nd or 3rd from end
  // For city addresses, city is usually first
  if (parts.length >= 3) {
    // Try to find a part that looks like a city (not a number, not too long)
    // Usually the 2nd-to-last or 3rd-to-last part before country
    return parts[parts.length - 3] || parts[0]
  }
  return parts[0] || null
}

function parseStateFromAddress(address) {
  if (!address) return null
  const parts = address.split(',').map(p => p.trim())
  // State/Province is usually 2nd from end (before country)
  if (parts.length >= 2) {
    return parts[parts.length - 2] || null
  }
  return null
}

function parseCountryFromAddress(address) {
  if (!address) return null
  const parts = address.split(',').map(p => p.trim())
  // Country is always last
  return parts[parts.length - 1] || null
}

function parseHospitalName(address) {
  if (!address) return null
  // Hospital format: "Hospital Name, Street Address, City, State, Country"
  const parts = address.split(',').map(p => p.trim())
  // First part is usually the hospital name
  return parts[0] || null
}

function getPrecisionLabel(precision) {
  const labels = {
    'city': '±15km',
    'hospital': '±10m',
    'home': '±10m',
    'exact': '±1m'
  }
  return labels[precision] || '±15km'
}
