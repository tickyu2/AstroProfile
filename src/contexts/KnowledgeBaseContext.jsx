/**
 * KnowledgeBaseContext.jsx
 * Manages the AI SoulPartner's Knowledge Base
 *
 * Stores markdown documents that Claude can reference:
 * - GENESIS documentation
 * - User preferences
 * - Technical context
 * - Any other knowledge the AI should have
 *
 * Features:
 * - Document CRUD operations
 * - Category-based organization
 * - Priority-based selection for token management
 * - Always-include flags for critical documents
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { calculateFourPillars } from '../utils/fourPillarsCalculator';
import { calculateTenGods, getDayMaster } from '../utils/tenGodsCalculations';
import { generateSoulDNA, decodeSoulDNA } from '../utils/soulDNAEncoder';
import { getCompatibilityRankings } from '../utils/mbti/mbtiCompatibilityMatrix';
import { calculateCompatibility, getCompatibilityLevel as getWesternLevel } from '../utils/westernZodiac/westernZodiacCompatibility';
import { getCuspById, getAllCusps as getAllCuspsList } from '../utils/westernZodiac/cuspCalculator';
import { personalizationEngine } from '../utils/personalizationEngine';
import { generatePsychologicalProfile, generateCompletePsychologicalProfile } from '../utils/psychologicalProfileGenerator';
import { calculateWithComparison, SEASONAL_MULTIPLIERS, QI_STATE_NAMES } from '../utils/seasonalStrength';

const KnowledgeBaseContext = createContext({});

// Document categories
export const KNOWLEDGE_CATEGORIES = {
  GENESIS: {
    id: 'genesis',
    label: 'GENESIS Overview',
    icon: '🌟',
    description: 'Core concepts and vision of GENESIS'
  },
  TECHNICAL: {
    id: 'technical',
    label: 'Technical',
    icon: '⚙️',
    description: 'Technical documentation and architecture'
  },
  PERSONAL: {
    id: 'personal',
    label: 'Personal Context',
    icon: '👤',
    description: 'Information about you and your preferences'
  },
  CONSTITUTIONAL: {
    id: 'constitutional',
    label: 'Constitutional Intelligence',
    icon: '☯️',
    description: 'How constitutional patterns work'
  },
  REFERENCE: {
    id: 'reference',
    label: 'Reference',
    icon: '📚',
    description: 'Reference materials and guides'
  },
  PROFILE_SUMMARY: {
    id: 'profile_summary',
    label: 'Profile Summary',
    icon: '🧬',
    description: 'Auto-generated constitutional profile summaries'
  }
};

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within KnowledgeBaseProvider');
  }
  return context;
};

export function KnowledgeBaseProvider({ children }) {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mutex: Track which profiles are currently being synced to prevent duplicates
  // Using useRef for synchronous access (useState is async and won't work for rapid-fire calls)
  const syncingProfilesRef = useRef(new Set());

  // Real-time listener for knowledge base documents
  useEffect(() => {
    if (!currentUser) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'knowledgeBase'),
      where('userId', '==', currentUser.uid),
      orderBy('priority', 'desc'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('📚 Knowledge Base loaded:', docs.length, 'documents', docs.map(d => d.title));
        setDocuments(docs);
        setLoading(false);
      },
      (err) => {
        console.error('📚 Error loading knowledge base:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  // Create new document
  const createDocument = async (docData) => {
    try {
      setError(null);

      const wordCount = docData.content?.split(/\s+/).length || 0;

      const document = {
        userId: currentUser.uid,
        title: docData.title,
        category: docData.category || 'reference',
        content: docData.content || '',
        summary: docData.summary || '',
        alwaysInclude: docData.alwaysInclude || false,
        priority: docData.priority || 5,
        tags: docData.tags || [],
        wordCount,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Optional profileId for profile-linked documents
        ...(docData.profileId && { profileId: docData.profileId })
      };

      const docRef = await addDoc(collection(db, 'knowledgeBase'), document);
      console.log('📚 Knowledge document created:', docRef.id);

      return { id: docRef.id, ...document };
    } catch (err) {
      console.error('Error creating document:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update document
  const updateDocument = async (docId, updates) => {
    try {
      setError(null);

      const wordCount = updates.content?.split(/\s+/).length || 0;

      const docRef = doc(db, 'knowledgeBase', docId);
      await updateDoc(docRef, {
        ...updates,
        wordCount,
        updatedAt: serverTimestamp()
      });

      console.log('📚 Knowledge document updated:', docId);
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete document
  const deleteDocument = async (docId) => {
    try {
      setError(null);
      await deleteDoc(doc(db, 'knowledgeBase', docId));
      console.log('📚 Knowledge document deleted:', docId);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.message);
      throw err;
    }
  };

  // Get documents for Claude (respects token limits)
  const getDocumentsForContext = (options = {}) => {
    const {
      maxTokens = 4000, // Approximate token limit for knowledge
      categories = null, // Filter by specific categories
      includeAll = false // Include all docs regardless of flags
    } = options;

    let selectedDocs = [...documents];

    // Filter by categories if specified
    if (categories && categories.length > 0) {
      selectedDocs = selectedDocs.filter(d => categories.includes(d.category));
    }

    // Sort by priority and always-include flag
    selectedDocs.sort((a, b) => {
      if (a.alwaysInclude && !b.alwaysInclude) return -1;
      if (!a.alwaysInclude && b.alwaysInclude) return 1;
      return (b.priority || 5) - (a.priority || 5);
    });

    // If includeAll, return everything
    if (includeAll) {
      return selectedDocs;
    }

    // Select docs respecting token limits (rough estimate: 1 word ≈ 1.3 tokens)
    const result = [];
    let estimatedTokens = 0;

    for (const doc of selectedDocs) {
      const docTokens = Math.ceil((doc.wordCount || 0) * 1.3);

      // Always include docs marked as such
      if (doc.alwaysInclude) {
        result.push(doc);
        estimatedTokens += docTokens;
        continue;
      }

      // Check if we have room for this document
      if (estimatedTokens + docTokens <= maxTokens) {
        result.push(doc);
        estimatedTokens += docTokens;
      }
    }

    console.log(`📚 Selected ${result.length}/${documents.length} docs for context (~${estimatedTokens} tokens)`);
    return result;
  };

  // Build knowledge prompt for Claude
  const buildKnowledgePrompt = (options = {}) => {
    // DEBUG: Log documents state
    console.log('📚 buildKnowledgePrompt called:', {
      totalDocuments: documents.length,
      documentTitles: documents.map(d => d.title),
      loading
    });

    const docs = getDocumentsForContext(options);

    if (docs.length === 0) {
      console.log('📚 No documents selected for context!');
      return '';
    }

    let prompt = `## KNOWLEDGE BASE

The following documents contain important context and information:

`;

    docs.forEach((doc, index) => {
      const categoryInfo = Object.values(KNOWLEDGE_CATEGORIES).find(c => c.id === doc.category);
      prompt += `### ${index + 1}. ${doc.title} ${categoryInfo?.icon || '📄'}
**Category:** ${categoryInfo?.label || doc.category}
${doc.summary ? `**Summary:** ${doc.summary}\n` : ''}
${doc.content}

---

`;
    });

    return prompt;
  };

  // Sync profile to KB - CLEAN APPROACH: Delete all old docs for this profile, create fresh ones
  // This ensures no duplicates and proper tag format on all documents
  // Uses mutex to prevent concurrent syncs for the same profile
  const syncProfileToKB = async (profile) => {
    if (!currentUser || !profile?.id) return null;

    // MUTEX CHECK: If this profile is already being synced, skip
    // Using ref for synchronous check (useState is async and won't block rapid-fire calls)
    if (syncingProfilesRef.current.has(profile.id)) {
      console.log('⚠️ Sync already in progress for profile:', profile.id, '- SKIPPING');
      return null;
    }

    // ACQUIRE MUTEX: Mark this profile as being synced (synchronous)
    syncingProfilesRef.current.add(profile.id);

    try {
      setError(null);
      const timestamp = new Date().toLocaleString();

      console.log('═══════════════════════════════════════════════════════════');
      console.log('🧬 syncProfileToKB STARTED for:', profile.displayName || profile.firstName);
      console.log('   Profile ID:', profile.id);
      console.log('   MUTEX ACQUIRED');
      console.log('═══════════════════════════════════════════════════════════');

      // STEP 1: Delete ALL existing profile documents for this profile
      // Query Firestore DIRECTLY to avoid stale React state issues
      // (React state may not have updated yet from previous saves)
      const existingDocsQuery = query(
        collection(db, 'knowledgeBase'),
        where('userId', '==', currentUser.uid),
        where('category', '==', 'profile_summary'),
        where('profileId', '==', profile.id)
      );

      const existingSnapshot = await getDocs(existingDocsQuery);
      const existingProfileDocs = existingSnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      console.log('🔍 Direct Firestore query found', existingProfileDocs.length, 'existing docs for profile:', profile.id);

      if (existingProfileDocs.length > 0) {
        console.log('🗑️ Deleting', existingProfileDocs.length, 'existing docs...');
        for (const existingDoc of existingProfileDocs) {
          try {
            await deleteDocument(existingDoc.id);
            console.log('   ✓ Deleted:', existingDoc.title);
          } catch (err) {
            console.error('   ✗ Error deleting:', existingDoc.id, err);
          }
        }
      }

      // STEP 2: Create fresh Constitutional Blueprint
      const content = buildProfileSummaryContent(profile);
      const title = `${profile.displayName || profile.firstName || 'Profile'} - Constitutional Blueprint`;
      const constitutionalDocTag = `constitutional-blueprint-${profile.id}`;

      const newConstitutionalDoc = await createDocument({
        title,
        category: 'profile_summary',
        content,
        summary: `Constitutional identity for ${profile.displayName || profile.firstName}`,
        alwaysInclude: true,
        priority: 10,
        tags: [timestamp, 'auto-generated', 'constitutional-blueprint', constitutionalDocTag, profile.id],
        profileId: profile.id
      });
      console.log('✅ Constitutional Blueprint created:', newConstitutionalDoc?.id);

      // STEP 3: Create fresh Psychological Profile
      await syncPsychologicalProfileToKB(profile, timestamp);

      console.log('═══════════════════════════════════════════════════════════');
      console.log('✅ syncProfileToKB COMPLETE for:', profile.displayName || profile.firstName);
      console.log('   MUTEX RELEASED');
      console.log('═══════════════════════════════════════════════════════════');

      return newConstitutionalDoc?.id;
    } catch (err) {
      console.error('Error syncing profile to KB:', err);
      setError(err.message);
      return null;
    } finally {
      // RELEASE MUTEX: Always release, even on error (synchronous)
      syncingProfilesRef.current.delete(profile.id);
    }
  };

  // Sync psychological profile (Liz Greene depth psychology) to KB as separate document
  // Called from syncProfileToKB after old docs are deleted - just create fresh
  const syncPsychologicalProfileToKB = async (profile, timestamp) => {
    if (!currentUser || !profile?.id) return null;

    try {
      // Build the profile data structure expected by generateCompletePsychologicalProfile
      const profileData = buildProfileDataForPsychEngine(profile);

      if (!profileData) {
        console.log('⚠️ Insufficient data for psychological profile generation');
        console.log('   Profile:', profile.displayName);
        console.log('   Has sovereignCalc:', !!profile.calculations?.western?.sovereignCalculation);
        return null;
      }

      // Generate the complete psychological profile (Liz Greene + Tripartite Soul)
      const psychologicalProfile = generateCompletePsychologicalProfile(profileData);

      if (!psychologicalProfile) {
        console.log('⚠️ Psychological profile generation returned null');
        return null;
      }

      const psychTitle = `${profile.displayName || profile.firstName || 'Profile'} - Psychological Profile (Liz Greene)`;
      const psychDocTag = `psych-profile-${profile.id}`;
      const ts = timestamp || new Date().toLocaleString();

      // Create fresh psychological profile (old docs already deleted by parent)
      const newPsychDoc = await createDocument({
        title: psychTitle,
        category: 'profile_summary',
        content: psychologicalProfile,
        summary: `Liz Greene depth psychology profile for ${profile.displayName || profile.firstName}`,
        alwaysInclude: true,
        priority: 99,  // Highest priority - this is THE psychological foundation
        tags: [ts, 'auto-generated', 'psychological-profile', 'liz-greene', psychDocTag, profile.id],
        profileId: profile.id
      });
      console.log('✅ Psychological Profile created:', newPsychDoc?.id);
      return newPsychDoc?.id;
    } catch (err) {
      console.error('Error syncing psychological profile to KB:', err);
      return null;
    }
  };

  // Build profile data structure for the psychological engine
  // Extracts planets, aspects, and constitutional data from profile
  const buildProfileDataForPsychEngine = (profile) => {
    const name = profile.displayName || profile.firstName || 'Unknown';
    const western = profile.calculations?.western;
    const sovereignData = western?.sovereignCalculation;
    const chinese = profile.chineseZodiac || profile.calculations?.chinese;

    // Need at minimum: Sun and Moon signs from sovereign calculation
    // Note: sun/moon are at sovereignData.sun/moon, NOT inside sovereignData.planets
    if (!sovereignData?.sun || !sovereignData?.moon) {
      console.log('⚠️ No sovereign calculation data available for psychological engine');
      console.log('   sovereignData:', sovereignData ? Object.keys(sovereignData) : 'null');
      return null;
    }

    // Build complete planets object for psychological engine
    // The API returns sun/moon/rising separately from other planets
    // We need to combine them into a single planets object
    const completePlanets = {
      sun: sovereignData.sun,
      moon: sovereignData.moon,
      ascendant: sovereignData.rising,  // API calls it 'rising', engine expects 'ascendant'
      ...(sovereignData.planets || {})   // mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto
    };

    // Normalize aspects from API format to engine format
    // API returns: { planet1: { name: 'mercury' }, planet2: { name: 'saturn' }, aspect: 'Square', orb: 0.67 }
    // Engine expects: { p1: 'Mercury', p2: 'Saturn', type: 'square', orb: 0.67 }
    const rawAspects = sovereignData.aspects || profile.aspects || [];

    // Helper to capitalize planet names (sun -> Sun, mercury -> Mercury)
    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

    const normalizedAspects = rawAspects.map(a => {
      // Extract planet names, handling both object format (API) and string format (manual)
      const p1Raw = typeof a.planet1 === 'object' ? a.planet1?.name : (a.planet1 || a.p1 || '');
      const p2Raw = typeof a.planet2 === 'object' ? a.planet2?.name : (a.planet2 || a.p2 || '');

      return {
        p1: capitalize(p1Raw),  // 'mercury' -> 'Mercury'
        p2: capitalize(p2Raw),  // 'saturn' -> 'Saturn'
        // Normalize aspect type to lowercase
        type: (a.aspect || a.type || '').toLowerCase(),
        orb: parseFloat(a.orb) || 0,
        nature: a.quality || a.nature || 'neutral',
        exactness: a.exactness
      };
    });

    console.log('🧠 Building psych engine data:', {
      sun: completePlanets.sun?.sign,
      moon: completePlanets.moon?.sign,
      ascendant: completePlanets.ascendant?.sign,
      planetCount: Object.keys(completePlanets).length,
      aspectCount: normalizedAspects.length,
      sampleAspect: normalizedAspects[0] ? `${normalizedAspects[0].p1}-${normalizedAspects[0].p2} ${normalizedAspects[0].type}` : 'none'
    });

    // Build the profile structure expected by generateCompletePsychologicalProfile
    return {
      displayName: name,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,

      // Complete planets including sun, moon, ascendant, and all other planets
      planets: completePlanets,

      // Normalized aspects for psychological engine
      aspects: normalizedAspects,

      // Constitutional identity for integration
      constitutional_identity: {
        chinese: {
          dayMaster: chinese?.dayMaster || profile.dayMaster,
          animal: chinese?.fullSign || `${chinese?.element || ''} ${chinese?.animal || ''}`.trim()
        },
        western: {
          sun: sovereignData.sun,
          moon: sovereignData.moon,
          ascendant: sovereignData.rising
        }
      }
    };
  };

  // Cleanup duplicate profile documents across all profiles
  // Call this to fix existing duplicates
  // Queries Firestore directly to avoid stale state issues
  const cleanupDuplicateProfileDocs = async () => {
    if (!currentUser) return { cleaned: 0, profiles: [] };

    // Query Firestore directly to get fresh data
    const profileDocsQuery = query(
      collection(db, 'knowledgeBase'),
      where('userId', '==', currentUser.uid),
      where('category', '==', 'profile_summary')
    );
    const snapshot = await getDocs(profileDocsQuery);
    const profileDocs = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(d => d.profileId);

    // Group by profileId
    const byProfile = {};
    profileDocs.forEach(doc => {
      if (!byProfile[doc.profileId]) byProfile[doc.profileId] = [];
      byProfile[doc.profileId].push(doc);
    });

    let totalCleaned = 0;
    const cleanedProfiles = [];

    for (const [profileId, docs] of Object.entries(byProfile)) {
      if (docs.length > 1) {
        // Sort by updatedAt descending, keep most recent
        const sorted = [...docs].sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
          const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
          return dateB - dateA;
        });

        const [keep, ...remove] = sorted;
        console.log(`🧹 Profile ${profileId}: keeping ${keep.id}, removing ${remove.length} duplicates`);

        for (const dupDoc of remove) {
          try {
            await deleteDocument(dupDoc.id);
            totalCleaned++;
          } catch (err) {
            console.error('Cleanup error:', err);
          }
        }

        cleanedProfiles.push({ profileId, kept: keep.id, removed: remove.length });
      }
    }

    console.log(`🧹 Cleanup complete: removed ${totalCleaned} duplicate docs`);
    return { cleaned: totalCleaned, profiles: cleanedProfiles };
  };

  // Mass delete ALL profile summary documents
  // Use this to clean up when things go wrong
  const deleteAllProfileSummaries = async () => {
    if (!currentUser) return { deleted: 0 };

    try {
      // Query Firestore directly for ALL profile summary documents
      const profileDocsQuery = query(
        collection(db, 'knowledgeBase'),
        where('userId', '==', currentUser.uid),
        where('category', '==', 'profile_summary')
      );
      const snapshot = await getDocs(profileDocsQuery);

      console.log('🗑️ Mass delete: Found', snapshot.docs.length, 'profile summary documents');

      let deleted = 0;
      for (const docSnapshot of snapshot.docs) {
        try {
          await deleteDoc(doc(db, 'knowledgeBase', docSnapshot.id));
          deleted++;
          console.log('   ✓ Deleted:', docSnapshot.data().title);
        } catch (err) {
          console.error('   ✗ Error deleting:', docSnapshot.id, err);
        }
      }

      console.log(`🗑️ Mass delete complete: removed ${deleted} documents`);
      return { deleted };
    } catch (err) {
      console.error('Error in mass delete:', err);
      setError(err.message);
      return { deleted: 0, error: err.message };
    }
  };

  // Build profile summary content from profile data
  // Calculates Four Pillars dynamically if not already stored
  const buildProfileSummaryContent = (profile) => {
    const lines = [];
    const name = profile.displayName || profile.firstName || 'Unknown';

    lines.push(`# Constitutional Blueprint: ${name}`);
    lines.push('');
    lines.push(`**Relationship:** ${profile.relationshipType || 'Not specified'}`);

    if (profile.birthDate) {
      lines.push(`**Birth Date:** ${profile.birthDate}${profile.birthTime ? ` at ${profile.birthTime}` : ''}`);
    }
    if (profile.location?.fullAddress || profile.location?.city) {
      lines.push(`**Birth Location:** ${profile.location.fullAddress || profile.location.city}`);
    }

    // Calculate Four Pillars dynamically for accurate BaZi data
    let fourPillars = null;
    let tenGods = null;
    let dayMaster = null;

    if (profile.birthDate && profile.birthTime) {
      try {
        const birthDateObj = new Date(profile.birthDate);
        fourPillars = calculateFourPillars(
          birthDateObj,
          profile.birthTime,
          profile.locationData || profile.location
        );

        if (fourPillars) {
          tenGods = calculateTenGods(fourPillars);
          dayMaster = getDayMaster(fourPillars);
          console.log('🧬 Four Pillars calculated for KB:', fourPillars.dayMaster?.element);
        }
      } catch (error) {
        console.error('Error calculating Four Pillars for KB:', error);
      }
    }

    // Generate SoulDNA code
    let soulDNA = null;
    let decodedDNA = null;
    if (fourPillars && tenGods) {
      try {
        soulDNA = generateSoulDNA(fourPillars, tenGods);
        if (soulDNA) {
          decodedDNA = decodeSoulDNA(soulDNA);
          console.log('🧬 SoulDNA generated for KB:', soulDNA);
        }
      } catch (error) {
        console.error('Error generating SoulDNA for KB:', error);
      }
    }

    // Chinese Zodiac / BaZi
    const chinese = profile.chineseZodiac || profile.calculations?.chinese;

    if (fourPillars || chinese) {
      lines.push('');
      lines.push('## Chinese Astrology (BaZi) - Four Pillars of Destiny');
      lines.push('');

      if (chinese?.fullSign) {
        lines.push(`**Chinese Zodiac:** ${chinese.fullSign}`);
      } else if (chinese?.animal) {
        lines.push(`**Chinese Zodiac:** ${chinese.element || ''} ${chinese.animal}`);
      }

      if (fourPillars) {
        // Day Master - THE core identity
        // Note: dayMaster.stem contains the actual properties (element, polarity, name, chinese)
        if (fourPillars.dayMaster) {
          const dm = fourPillars.dayMaster;
          const stem = dm.stem || dm; // stem contains the actual data
          lines.push('');
          lines.push(`### Day Master (Core Self): ${stem.chinese || ''} ${stem.name || stem.element || 'Unknown'}`);
          lines.push(`- Element: ${stem.element || 'Unknown'}`);
          lines.push(`- Polarity: ${stem.polarity || stem.yinYang || 'Unknown'}`);
          if (dm.description) {
            lines.push(`- Nature: ${dm.description}`);
          }
        }

        // SoulDNA - Unique constitutional code
        if (soulDNA && decodedDNA) {
          lines.push('');
          lines.push(`### SoulDNA Code: \`${soulDNA}\``);
          lines.push('');
          lines.push('**Decoded:**');
          lines.push(`- Primary Element: ${decodedDNA.elements?.primary || 'Unknown'} (${decodedDNA.primaryPercentage || 0}%)`);
          lines.push(`- Secondary Element: ${decodedDNA.elements?.secondary || 'Unknown'}`);
          lines.push(`- Tertiary Element: ${decodedDNA.elements?.tertiary || 'Unknown'}`);
          lines.push(`- Dominant Ten God: ${decodedDNA.dominantTenGod || 'Unknown'}`);
          lines.push(`- Energy Polarity: ${decodedDNA.yinYang || 'Unknown'}`);
          lines.push('');
          lines.push(`*Format: XXX-L##Z (Elements-TenGod+Percentage+YinYang)*`);
        }

        // All Four Pillars in detail
        lines.push('');
        lines.push('### The Four Pillars');
        lines.push('');

        const pillars = fourPillars.pillars || fourPillars;

        // Year Pillar
        if (pillars.year) {
          const y = pillars.year;
          lines.push(`**Year Pillar (Ancestral Foundation, ages 0-16):**`);
          lines.push(`- Heavenly Stem: ${y.stem?.chinese || ''} ${y.stem?.name || ''} (${y.stem?.element || 'Unknown'})`);
          lines.push(`- Earthly Branch: ${y.branch?.chinese || ''} ${y.branch?.animal || y.branch?.name || ''} (${y.branch?.element || 'Unknown'})`);
          lines.push('');
        }

        // Month Pillar
        if (pillars.month) {
          const m = pillars.month;
          lines.push(`**Month Pillar (Parents & Early Career, ages 17-32):**`);
          lines.push(`- Heavenly Stem: ${m.stem?.chinese || ''} ${m.stem?.name || ''} (${m.stem?.element || 'Unknown'})`);
          lines.push(`- Earthly Branch: ${m.branch?.chinese || ''} ${m.branch?.animal || m.branch?.name || ''} (${m.branch?.element || 'Unknown'})`);
          lines.push('');
        }

        // Day Pillar (Most Important!)
        if (pillars.day) {
          const d = pillars.day;
          lines.push(`**Day Pillar (Self & Spouse, ages 33-48) - YOUR CORE:**`);
          lines.push(`- Heavenly Stem (Day Master): ${d.stem?.chinese || ''} ${d.stem?.name || ''} (${d.stem?.element || 'Unknown'})`);
          lines.push(`- Earthly Branch: ${d.branch?.chinese || ''} ${d.branch?.animal || d.branch?.name || ''} (${d.branch?.element || 'Unknown'})`);
          lines.push('');
        }

        // Hour Pillar
        if (pillars.hour) {
          const h = pillars.hour;
          lines.push(`**Hour Pillar (Children & Later Life, ages 49+):**`);
          lines.push(`- Heavenly Stem: ${h.stem?.chinese || ''} ${h.stem?.name || ''} (${h.stem?.element || 'Unknown'})`);
          lines.push(`- Earthly Branch: ${h.branch?.chinese || ''} ${h.branch?.animal || h.branch?.name || ''} (${h.branch?.element || 'Unknown'})`);
          lines.push('');
        }

        // Element Balance
        if (fourPillars.elementalBalance || fourPillars.elementBalance) {
          const elements = fourPillars.elementalBalance?.elements || fourPillars.elementBalance || {};
          lines.push('### Elemental Balance');
          const elementList = Object.entries(elements)
            .filter(([_, v]) => v > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([elem, count]) => `${elem}: ${count}`)
            .join(', ');
          if (elementList) {
            lines.push(`- ${elementList}`);
          }
          lines.push('');
        }

        // Yin/Yang Balance from Four Pillars
        if (fourPillars.yinYangBalance) {
          const yy = fourPillars.yinYangBalance;
          lines.push('### Yin/Yang Balance');
          lines.push(`- Yin: ${yy.yinPercentage || yy.yin || 0}%`);
          lines.push(`- Yang: ${yy.yangPercentage || yy.yang || 0}%`);
          lines.push('');
        }

        // ═══════════════════════════════════════════════════════════════
        // SEASONAL STRENGTH ANALYSIS (五行旺衰)
        // Day Master strength changes dramatically based on birth season!
        // ═══════════════════════════════════════════════════════════════
        try {
          const seasonalComparison = calculateWithComparison(fourPillars.pillars || fourPillars);
          const dayMasterElement = fourPillars.dayMaster?.stem?.element;
          const birthSeason = seasonalComparison.debug?.season?.season;

          if (seasonalComparison && dayMasterElement && birthSeason) {
            lines.push('### Seasonal Strength Analysis (五行旺衰)');
            lines.push('*How your elements change with birth season - crucial for accurate BaZi!*');
            lines.push('');

            // Birth Season
            const seasonName = seasonalComparison.debug?.season?.name || birthSeason;
            lines.push(`**Birth Season:** ${seasonName}`);
            lines.push('');

            // Day Master Qi State - THE KEY INSIGHT
            const multipliers = SEASONAL_MULTIPLIERS[birthSeason] || {};
            const dayMasterMultiplier = multipliers[dayMasterElement] || 1.0;
            const qiState = QI_STATE_NAMES[dayMasterMultiplier] || 'Unknown';

            // Generate metaphor based on element + season
            const dayMasterMetaphors = {
              Fire: {
                winter: 'a flickering candle in the snow - needs constant fuel and protection',
                summer: 'a roaring bonfire - naturally powerful and radiant',
                spring: 'a warming hearth - fed by abundant wood, growing stronger',
                autumn: 'a controlled forge fire - metal conducts heat away',
                earth: 'a campfire - steady and reliable'
              },
              Water: {
                summer: 'a shallow puddle evaporating in the sun - easily depleted',
                winter: 'a mighty frozen river - vast and powerful in its domain',
                autumn: 'a flowing stream fed by metal condensation - gaining strength',
                spring: 'a nurturing rain - gives life to wood, becoming tired',
                earth: 'a steady well - contained but reliable'
              },
              Wood: {
                autumn: 'a tree being chopped - metal cuts relentlessly',
                spring: 'a forest in full bloom - unstoppable growth',
                winter: 'a seedling being watered - nurtured and growing',
                summer: 'an exhausted parent tree - gave everything to feed fire',
                earth: 'a planted garden - rooted but challenged'
              },
              Metal: {
                spring: 'a dull blade against a dense forest - powerless to cut',
                autumn: 'a gleaming sword at peak sharpness - supreme power',
                summer: 'a melting ingot in the forge - fire overcomes',
                winter: 'a resting tool - created water, now recuperating',
                earth: 'an ore being refined - supported and strengthened'
              },
              Earth: {
                spring: 'soil covered by roots - wood dominates the ground',
                earth: 'a mountain at center - supreme stability',
                summer: 'volcanic ash enriching the land - fire strengthens',
                autumn: 'a tired mother - gave birth to metal, exhausted',
                winter: 'eroding riverbank - water washes away'
              }
            };

            const metaphor = dayMasterMetaphors[dayMasterElement]?.[birthSeason] ||
                            'expressing uniquely in this season';

            lines.push(`**Day Master Qi State:** ${dayMasterElement} in ${seasonName.replace(/[🌸☀️🍂❄️🌍]/g, '').trim()}`);
            lines.push(`- State: ${qiState}`);
            lines.push(`- Multiplier: ${dayMasterMultiplier}x`);
            lines.push(`- Metaphor: *Like ${metaphor}*`);
            lines.push('');

            // Before vs After Seasonal Adjustment
            const rawPct = seasonalComparison.raw?.percentages || {};
            const adjustedPct = seasonalComparison.adjusted?.percentages || {};

            lines.push('**Elemental Balance - BEFORE Seasonal Adjustment (Raw):**');
            const rawSorted = Object.entries(rawPct)
              .sort((a, b) => b[1] - a[1])
              .map(([elem, pct]) => `${elem}: ${pct.toFixed(1)}%`);
            lines.push(`- ${rawSorted.join(', ')}`);
            lines.push('');

            lines.push('**Elemental Balance - AFTER Seasonal Adjustment (True Strength):**');
            const adjSorted = Object.entries(adjustedPct)
              .sort((a, b) => b[1] - a[1])
              .map(([elem, pct]) => `${elem}: ${pct.toFixed(1)}%`);
            lines.push(`- ${adjSorted.join(', ')}`);
            lines.push('');

            // Element Qi States
            lines.push('**All Elements Qi States this Season:**');
            Object.entries(multipliers)
              .sort((a, b) => b[1] - a[1])
              .forEach(([elem, mult]) => {
                const state = QI_STATE_NAMES[mult] || '';
                const emoji = elem === dayMasterElement ? ' ⭐ (You)' : '';
                lines.push(`- ${elem}: ${state}${emoji}`);
              });
            lines.push('');
          }
        } catch (seasonalError) {
          console.error('Error calculating seasonal strength for KB:', seasonalError);
        }
      }

      // Ten Gods (if calculated)
      if (tenGods) {
        lines.push('### Ten Gods Analysis');
        const godsList = Object.entries(tenGods)
          .filter(([key, val]) => val && typeof val === 'object' && val.count > 0)
          .map(([god, data]) => `${god}: ${data.count}`)
          .join(', ');
        if (godsList) {
          lines.push(`- Active Ten Gods: ${godsList}`);
        }
        lines.push('');
      }
    }

    // Western Zodiac
    const western = profile.calculations?.western;
    if (western?.sign) {
      lines.push('');
      lines.push('## Western Astrology');
      lines.push(`- **Sun Sign:** ${western.sign}${western.element ? ` (${western.element})` : ''}`);
      if (western.modality) {
        lines.push(`- **Modality:** ${western.modality}`);
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SOVEREIGN ASTRONOMICAL DATA - Complete planetary positions & aspects
    // This is the FACTUAL astronomical foundation for all interpretations
    // ═══════════════════════════════════════════════════════════════════════
    const sovereignDataForAstro = western?.sovereignCalculation;
    if (sovereignDataForAstro) {
      lines.push('');
      lines.push('## Sovereign Astronomical Data');
      lines.push('*Real planetary positions calculated using VSOP87 theory (Moshier Ephemeris)*');
      lines.push('');

      // Constitutional Trinity (Sun, Moon, Rising)
      lines.push('### Constitutional Trinity');

      if (sovereignDataForAstro.sun) {
        const sun = sovereignDataForAstro.sun;
        const retrograde = sun.retrograde ? ' ℞' : '';
        lines.push(`- **Sun:** ${sun.sign} ${sun.degreeInSign?.toFixed(2) || ''}°${retrograde} (House ${sun.house || '?'})`);
      }

      if (sovereignDataForAstro.moon) {
        const moon = sovereignDataForAstro.moon;
        const retrograde = moon.retrograde ? ' ℞' : '';
        lines.push(`- **Moon:** ${moon.sign} ${moon.degreeInSign?.toFixed(2) || ''}°${retrograde} (House ${moon.house || '?'})`);
        if (moon.phase) {
          lines.push(`- **Moon Phase:** ${moon.phase}`);
        }
      }

      if (sovereignDataForAstro.rising) {
        const rising = sovereignDataForAstro.rising;
        lines.push(`- **Ascendant (Rising):** ${rising.sign} ${rising.degreeInSign?.toFixed(2) || ''}°`);
      }

      // All Planetary Positions with Retrograde Status
      const planets = sovereignDataForAstro.planets;
      if (planets && Object.keys(planets).length > 0) {
        lines.push('');
        lines.push('### Planetary Positions');
        lines.push('');

        // Define planet order for consistent display
        const planetOrder = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

        // Track retrogrades for summary
        const retrogradeList = [];

        planetOrder.forEach(planetName => {
          const planet = planets[planetName];
          if (planet) {
            const retrograde = planet.retrograde ? ' ℞' : '';
            if (planet.retrograde) {
              retrogradeList.push(planetName.charAt(0).toUpperCase() + planetName.slice(1));
            }
            const displayName = planetName.charAt(0).toUpperCase() + planetName.slice(1);
            const degree = planet.degreeInSign?.toFixed(2) || planet.degree?.toFixed(2) || '';
            const house = planet.house ? ` (House ${planet.house})` : '';
            lines.push(`- **${displayName}:** ${planet.sign} ${degree}°${retrograde}${house}`);
          }
        });

        // Retrograde Summary (prominently displayed)
        if (retrogradeList.length > 0) {
          lines.push('');
          lines.push('### Retrograde Planets ℞');
          lines.push(`**${retrogradeList.length} planets retrograde at birth:** ${retrogradeList.join(', ')}`);
          lines.push('');
          lines.push('*Retrograde planets indicate areas of life requiring inner development, past-life themes, or unconventional expression of that planetary energy.*');
        } else {
          lines.push('');
          lines.push('### Retrograde Planets');
          lines.push('*No planets retrograde at birth - direct forward momentum in all planetary expressions.*');
        }
      }

      // House Cusps
      if (sovereignDataForAstro.houses && sovereignDataForAstro.houses.length > 0) {
        lines.push('');
        lines.push('### House Cusps (Placidus)');
        lines.push('');

        const houseDescriptions = [
          'Self & Identity',
          'Money & Values',
          'Communication & Siblings',
          'Home & Family',
          'Creativity & Romance',
          'Health & Service',
          'Partnerships & Marriage',
          'Transformation & Shared Resources',
          'Philosophy & Higher Learning',
          'Career & Public Image',
          'Friends & Aspirations',
          'Unconscious & Karma'
        ];

        sovereignDataForAstro.houses.forEach((house, index) => {
          if (house && house.sign) {
            const houseNum = index + 1;
            const description = houseDescriptions[index] || '';
            const degree = house.degreeInSign?.toFixed(1) || '';
            lines.push(`- **House ${houseNum} (${description}):** ${house.sign} ${degree}°`);
          }
        });
      }

      // Aspects
      const aspects = sovereignDataForAstro.aspects;
      if (aspects && aspects.length > 0) {
        lines.push('');
        lines.push('### Major Aspects');
        lines.push('');

        // Group aspects by type
        const conjunctions = aspects.filter(a => a.aspect?.toLowerCase() === 'conjunction');
        const trines = aspects.filter(a => a.aspect?.toLowerCase() === 'trine');
        const sextiles = aspects.filter(a => a.aspect?.toLowerCase() === 'sextile');
        const squares = aspects.filter(a => a.aspect?.toLowerCase() === 'square');
        const oppositions = aspects.filter(a => a.aspect?.toLowerCase() === 'opposition');

        const formatAspect = (a) => {
          const p1 = typeof a.planet1 === 'object' ? a.planet1?.name : a.planet1;
          const p2 = typeof a.planet2 === 'object' ? a.planet2?.name : a.planet2;
          const orb = a.orb?.toFixed(1) || '';
          return `${p1}-${p2} (${orb}° orb)`;
        };

        if (conjunctions.length > 0) {
          lines.push(`**Conjunctions (☌):** ${conjunctions.map(formatAspect).join('; ')}`);
        }
        if (trines.length > 0) {
          lines.push(`**Trines (△ - Harmonious):** ${trines.map(formatAspect).join('; ')}`);
        }
        if (sextiles.length > 0) {
          lines.push(`**Sextiles (✱ - Opportunities):** ${sextiles.map(formatAspect).join('; ')}`);
        }
        if (squares.length > 0) {
          lines.push(`**Squares (□ - Tension/Growth):** ${squares.map(formatAspect).join('; ')}`);
        }
        if (oppositions.length > 0) {
          lines.push(`**Oppositions (☍ - Polarities):** ${oppositions.map(formatAspect).join('; ')}`);
        }
      }

      // Element Balance from Western Chart
      if (sovereignDataForAstro.elementBalance) {
        const elements = sovereignDataForAstro.elementBalance;
        lines.push('');
        lines.push('### Western Element Balance');
        lines.push(`- Fire: ${elements.fire || 0} | Earth: ${elements.earth || 0} | Air: ${elements.air || 0} | Water: ${elements.water || 0}`);
      }
    }

    // Psychological Profile (Liz Greene-inspired depth psychology)
    // Uses sovereign chart data for Sun/Moon/Rising if available
    const sovereignData = western?.sovereignCalculation;
    if (sovereignData) {
      try {
        const psychProfile = generatePsychologicalProfile(sovereignData, profile);

        if (psychProfile) {
          lines.push('');
          lines.push('## Psychological Profile');
          lines.push('*Depth psychology insights for Luna - understanding the soul beneath the surface*');
          lines.push('');

          // I. Core Identity (Sun)
          if (psychProfile.coreIdentity) {
            const core = psychProfile.coreIdentity;
            lines.push('### Core Identity (Sun - Conscious Self)');
            lines.push(`**Archetype:** ${core.coreIdentity || 'The Soul'}`);
            lines.push(`**Central Drive:** ${core.centralDrive || ''}`);
            lines.push(`**Light Expression:** ${core.lightExpression || ''}`);
            lines.push(`**Shadow Tendency:** ${core.shadowTendency || ''}`);
            lines.push(`**Life Question:** ${core.lifeQuestion || ''}`);
            lines.push(`**Growth Path:** ${core.growthPath || ''}`);
            lines.push('');
          }

          // II. Emotional Nature (Moon)
          if (psychProfile.emotionalNature) {
            const emo = psychProfile.emotionalNature;
            lines.push('### Emotional Nature (Moon - Inner World)');
            lines.push(`**Emotional Style:** ${emo.emotionalNature || ''}`);
            lines.push(`**Inner Needs:** ${emo.innerNeeds || ''}`);
            lines.push(`**Instinctual Response:** ${emo.instinctualResponse || ''}`);
            lines.push(`**Childhood Pattern:** ${emo.childhoodPattern || ''}`);
            lines.push(`**Emotional Shadow:** ${emo.emotionalShadow || ''}`);
            lines.push(`**Nurturing Style:** ${emo.nurturingStyle || ''}`);
            if (emo.phase) {
              lines.push(`**Moon Phase at Birth:** ${emo.phase.name || emo.phase} - ${emo.phase.meaning || ''}`);
            }
            lines.push('');
          }

          // III. Persona (Rising)
          if (psychProfile.persona) {
            const persona = psychProfile.persona;
            lines.push('### Persona (Rising - Mask to the World)');
            lines.push(`**First Impression:** ${persona.firstImpression || ''}`);
            lines.push(`**Approach to Life:** ${persona.approachToLife || ''}`);
            lines.push(`**Physical Presence:** ${persona.physicalPresence || ''}`);
            lines.push(`**Life Lesson:** ${persona.lifeLesson || ''}`);
            lines.push('');
          }

          // IV. Temperament (Elements)
          if (psychProfile.temperament) {
            const temp = psychProfile.temperament;
            lines.push('### Temperament (Elemental Nature)');
            lines.push(`**Dominant Element:** ${temp.dominant || 'Unknown'}`);
            lines.push(`**Temperament Type:** ${temp.temperament || ''}`);
            lines.push(`**Orientation:** ${temp.orientation || ''}`);
            lines.push(`**Strengths:** ${temp.strengths || ''}`);
            lines.push(`**Challenges:** ${temp.challenges || ''}`);
            lines.push('');
          }

          // V. Character & Shadow Integration
          if (psychProfile.characterAndShadow) {
            const cs = psychProfile.characterAndShadow;
            lines.push('### Character & Shadow Work');

            if (cs.consciousSelf?.length > 0) {
              lines.push(`**Conscious Gifts:** ${cs.consciousSelf.join('; ')}`);
            }
            if (cs.shadow?.length > 0) {
              lines.push(`**Shadow Material:** ${cs.shadow.join('; ')}`);
            }
            if (cs.innerConflicts?.length > 0) {
              lines.push('**Inner Tensions:**');
              cs.innerConflicts.forEach(conflict => {
                lines.push(`- ${conflict}`);
              });
            }
            if (cs.integrationPath?.length > 0) {
              lines.push('**Integration Path:**');
              cs.integrationPath.forEach(path => {
                lines.push(`- ${path}`);
              });
            }
            lines.push('');
          }

          // VI. Growth Edges
          if (psychProfile.growthEdges?.length > 0) {
            lines.push('### Growth Edges (Areas for Development)');
            psychProfile.growthEdges.forEach(edge => {
              lines.push(`- **${edge.area}${edge.sign ? ` (${edge.sign})` : ''}:** ${edge.description}`);
            });
            lines.push('');
          }

          // VII. Luna Synthesis (THE KEY SECTION FOR AI)
          if (psychProfile.lunaSynthesis) {
            const luna = psychProfile.lunaSynthesis;
            lines.push('### 🌙 Luna\'s Guide to This Soul');
            lines.push('*This section is specifically for Luna to understand how to best support this person*');
            lines.push('');
            lines.push(`**Quick Summary:** ${luna.shortSummary || ''}`);
            lines.push(`**Core Motivation:** ${luna.coreMotivation || ''}`);
            lines.push(`**Emotional Needs to Honor:** ${luna.emotionalNeedsToHonor || ''}`);
            lines.push(`**Appearance vs Reality:** ${luna.howTheyAppearVsAre || ''}`);
            lines.push(`**Sensitive Areas (Handle Gently):** ${luna.sensitiveAreas || ''}`);

            if (luna.bestApproach?.length > 0) {
              lines.push('**Best Approach:**');
              luna.bestApproach.forEach(approach => {
                lines.push(`- ${approach}`);
              });
            }

            if (luna.whatTheyNeedToHear?.length > 0) {
              lines.push('**Affirmations They Need:**');
              luna.whatTheyNeedToHear.forEach(affirmation => {
                lines.push(`- "${affirmation}"`);
              });
            }

            if (luna.topicsToExplore?.length > 0) {
              lines.push('**Topics to Explore:**');
              luna.topicsToExplore.forEach(topic => {
                lines.push(`- ${topic}`);
              });
            }
            lines.push('');
          }

          console.log('🌙 Psychological profile integrated into KB for:', profile.displayName || profile.firstName);
        }
      } catch (error) {
        console.error('Error generating psychological profile for KB:', error);
      }
    }

    // MBTI
    if (profile.mbti) {
      lines.push('');
      lines.push('## Personality Type');
      lines.push(`- **MBTI:** ${profile.mbti}`);

      // Add MBTI Compatibility Rankings (ALL 15 types)
      try {
        const mbtiRankings = getCompatibilityRankings(profile.mbti);
        if (mbtiRankings && mbtiRankings.length > 0) {
          lines.push('');
          lines.push('### MBTI Compatibility Rankings (All Types)');
          lines.push('');

          // Group by compatibility level
          const excellent = mbtiRankings.filter(r => r.score >= 90);
          const veryGood = mbtiRankings.filter(r => r.score >= 75 && r.score < 90);
          const good = mbtiRankings.filter(r => r.score >= 60 && r.score < 75);
          const moderate = mbtiRankings.filter(r => r.score >= 45 && r.score < 60);
          const challenging = mbtiRankings.filter(r => r.score < 45);

          if (excellent.length > 0) {
            lines.push(`**Excellent (90%+):** ${excellent.map(r => `${r.type} (${r.score}%)`).join(', ')}`);
          }
          if (veryGood.length > 0) {
            lines.push(`**Very Good (75-89%):** ${veryGood.map(r => `${r.type} (${r.score}%)`).join(', ')}`);
          }
          if (good.length > 0) {
            lines.push(`**Good (60-74%):** ${good.map(r => `${r.type} (${r.score}%)`).join(', ')}`);
          }
          if (moderate.length > 0) {
            lines.push(`**Moderate (45-59%):** ${moderate.map(r => `${r.type} (${r.score}%)`).join(', ')}`);
          }
          if (challenging.length > 0) {
            lines.push(`**Challenging (<45%):** ${challenging.map(r => `${r.type} (${r.score}%)`).join(', ')}`);
          }
        }
      } catch (error) {
        console.error('Error generating MBTI compatibility rankings:', error);
      }
    }

    // Western Zodiac Compatibility Rankings (ALL cusps)
    const westernCusp = profile.calculations?.western?.cuspId || profile.calculations?.western?.cusp;
    if (westernCusp) {
      try {
        const allCusps = getAllCuspsList();
        const userCusp = getCuspById(westernCusp);

        if (userCusp && allCusps && allCusps.length > 0) {
          // Calculate compatibility with ALL cusps
          const allCompatibility = allCusps
            .filter(cusp => cusp.id !== userCusp.id)
            .map(cusp => {
              const score = calculateCompatibility(userCusp, cusp);
              const level = getWesternLevel(score);
              return { cusp, score, level };
            })
            .sort((a, b) => b.score - a.score);

          lines.push('');
          lines.push('### Western Zodiac Compatibility Rankings (All Signs/Cusps)');
          lines.push('');

          // Group by tier
          const golden = allCompatibility.filter(c => c.score >= 90);
          const excellent = allCompatibility.filter(c => c.score >= 80 && c.score < 90);
          const good = allCompatibility.filter(c => c.score >= 70 && c.score < 80);
          const moderate = allCompatibility.filter(c => c.score >= 60 && c.score < 70);
          const challenging = allCompatibility.filter(c => c.score < 60);

          if (golden.length > 0) {
            lines.push(`**Golden (90%+):** ${golden.map(c => `${c.cusp.name} (${c.score}%)`).join(', ')}`);
          }
          if (excellent.length > 0) {
            lines.push(`**Excellent (80-89%):** ${excellent.map(c => `${c.cusp.name} (${c.score}%)`).join(', ')}`);
          }
          if (good.length > 0) {
            lines.push(`**Good (70-79%):** ${good.map(c => `${c.cusp.name} (${c.score}%)`).join(', ')}`);
          }
          if (moderate.length > 0) {
            lines.push(`**Moderate (60-69%):** ${moderate.map(c => `${c.cusp.name} (${c.score}%)`).join(', ')}`);
          }
          if (challenging.length > 0) {
            lines.push(`**Challenging (<60%):** ${challenging.map(c => `${c.cusp.name} (${c.score}%)`).join(', ')}`);
          }
        }
      } catch (error) {
        console.error('Error generating Western Zodiac compatibility rankings:', error);
      }
    }

    // Big 5 if available (check multiple possible structures)
    const big5 = profile.big5 || profile.calculations?.big5;
    if (big5 && (big5.provided || big5.openness !== undefined)) {
      lines.push('');
      lines.push('## Big Five Personality Traits (OCEAN)');
      lines.push(`- **Openness:** ${big5.openness ?? 50}% - curiosity, creativity, openness to new experiences`);
      lines.push(`- **Conscientiousness:** ${big5.conscientiousness ?? 50}% - organization, dependability, self-discipline`);
      lines.push(`- **Extraversion:** ${big5.extraversion ?? 50}% - sociability, assertiveness, positive emotions`);
      lines.push(`- **Agreeableness:** ${big5.agreeableness ?? 50}% - cooperation, trust, helpfulness`);
      lines.push(`- **Neuroticism:** ${big5.neuroticism ?? 50}% - emotional instability, anxiety, moodiness`);
    }

    // Numerology if available
    const numerology = profile.numerology || profile.calculations?.numerology;
    if (numerology) {
      lines.push('');
      lines.push('## Numerology');

      // Helper to extract number value from potentially nested object
      const extractNumValue = (val) => {
        if (val === null || val === undefined) return null;
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return val;
        if (typeof val === 'object') {
          // Try common property names for the actual number
          return val.number ?? val.value ?? val.num ?? JSON.stringify(val);
        }
        return String(val);
      };

      // Helper to extract meaning from potentially nested object
      const extractMeaning = (val) => {
        if (val === null || val === undefined) return null;
        if (typeof val === 'object') {
          return val.meaning ?? val.description ?? val.interpretation ?? null;
        }
        return null;
      };

      const lifePath = numerology.lifePath ?? numerology.lifePathNumber;
      if (lifePath !== undefined && lifePath !== null) {
        const num = extractNumValue(lifePath);
        const meaning = extractMeaning(lifePath) || numerology.lifePathMeaning;
        lines.push(`- **Life Path Number:** ${num}${meaning ? ` - ${meaning}` : ''}`);
      }

      const expression = numerology.expression ?? numerology.expressionNumber;
      if (expression !== undefined && expression !== null) {
        const num = extractNumValue(expression);
        const meaning = extractMeaning(expression);
        lines.push(`- **Expression Number:** ${num}${meaning ? ` - ${meaning}` : ''}`);
      }

      const soulUrge = numerology.soulUrge ?? numerology.soulUrgeNumber;
      if (soulUrge !== undefined && soulUrge !== null) {
        const num = extractNumValue(soulUrge);
        const meaning = extractMeaning(soulUrge);
        lines.push(`- **Soul Urge Number:** ${num}${meaning ? ` - ${meaning}` : ''}`);
      }

      const birthday = numerology.birthday ?? numerology.birthdayNumber;
      if (birthday !== undefined && birthday !== null) {
        const num = extractNumValue(birthday);
        const meaning = extractMeaning(birthday);
        lines.push(`- **Birthday Number:** ${num}${meaning ? ` - ${meaning}` : ''}`);
      }

      const personality = numerology.personality ?? numerology.personalityNumber;
      if (personality !== undefined && personality !== null) {
        const num = extractNumValue(personality);
        const meaning = extractMeaning(personality);
        lines.push(`- **Personality Number:** ${num}${meaning ? ` - ${meaning}` : ''}`);
      }

      const maturity = numerology.maturity ?? numerology.maturityNumber;
      if (maturity !== undefined && maturity !== null) {
        const num = extractNumValue(maturity);
        const meaning = extractMeaning(maturity);
        lines.push(`- **Maturity Number:** ${num}${meaning ? ` - ${meaning}` : ''}`);
      }
    }

    // Enneagram if available
    const enneagram = profile.enneagram || profile.calculations?.enneagram;
    if (enneagram) {
      lines.push('');
      lines.push('## Enneagram');
      if (enneagram.type) {
        lines.push(`- **Type:** ${enneagram.type}${enneagram.name ? ` - ${enneagram.name}` : ''}`);
      }
      if (enneagram.wing) {
        lines.push(`- **Wing:** ${enneagram.wing}`);
      }
      if (enneagram.tritype) {
        lines.push(`- **Tritype:** ${enneagram.tritype}`);
      }
    }

    // Story Questions Assessment (8-Level Emotional Storytelling)
    const storyAssessment = profile.aiSoulPartner?.storyAssessment;
    if (storyAssessment) {
      lines.push('');
      lines.push('## Story Questions Assessment');
      lines.push('*Psychological profile revealed through 8 emotional story scenarios*');
      lines.push('');

      // Summary narrative
      if (storyAssessment.summary) {
        lines.push(storyAssessment.summary);
      } else {
        // Build summary from individual fields if no pre-built summary
        if (storyAssessment.dominantElement) {
          lines.push(`**Dominant Element (Story-Derived):** ${storyAssessment.dominantElement}`);
        }
        if (storyAssessment.dominantTenGod) {
          lines.push(`**Dominant Ten God (Story-Derived):** ${storyAssessment.dominantTenGod}`);
        }
        if (storyAssessment.yinYangBalance) {
          lines.push(`**Yin/Yang Balance (Story-Derived):** ${storyAssessment.yinYangBalance}`);
        }
      }

      // Completion timestamp
      if (storyAssessment.completedAt) {
        const completedDate = storyAssessment.completedAt.toDate
          ? storyAssessment.completedAt.toDate().toLocaleDateString()
          : new Date(storyAssessment.completedAt).toLocaleDateString();
        lines.push('');
        lines.push(`*Assessment completed: ${completedDate}*`);
      }
    }

    // Personalization Metrics (Progressive Personalization Algorithm)
    try {
      const metrics = personalizationEngine.calculateDepth(profile);
      const recommendations = personalizationEngine.generateRecommendations(profile, metrics);

      lines.push('');
      lines.push('## Personalization Metrics');
      lines.push('*Netflix-style recommendation precision based on data quality*');
      lines.push('');

      // Quality tier with emoji
      lines.push(`### Data Quality: ${metrics.tierEmoji} ${metrics.totalScore}% (${metrics.tierLabel})`);
      lines.push(`- Base Layer (Constitutional): ${metrics.baseDepth}%`);
      lines.push(`- Cream Layer (Psychological + Behavioral): ${metrics.creamDepth}%`);
      lines.push('');

      // Recommendation confidence
      lines.push('### Recommendation Confidence');
      lines.push(`- Overall: ${metrics.recommendationConfidence.overall}%`);
      lines.push(`- Compatibility Matching: ${metrics.recommendationConfidence.compatibility}%`);
      lines.push(`- 9th House Learning Path: ${metrics.recommendationConfidence.ninthHouse}%`);
      lines.push(`- Elemental Harmony: ${metrics.recommendationConfidence.elementalHarmony}%`);

      // Compatibility recommendations
      if (recommendations.compatibility?.length > 0) {
        lines.push('');
        lines.push('### Compatibility Insights');
        recommendations.compatibility.forEach(rec => {
          lines.push(`**${rec.type.replace(/_/g, ' ')}:** ${rec.matches.join(', ')} (${rec.confidence}% confidence)`);
          if (rec.reason) {
            lines.push(`  *${rec.reason}*`);
          }
        });
      }

      // Learning path
      if (recommendations.learningPath?.ninthHouse) {
        lines.push('');
        lines.push('### 9th House Wisdom Path');
        lines.push(`${recommendations.learningPath.ninthHouse} (${recommendations.learningPath.confidence}% confidence)`);
      }

      // Data gaps (what to improve)
      if (metrics.dataGaps?.length > 0) {
        lines.push('');
        lines.push('### Growth Opportunities');
        lines.push('*Complete these for better personalization:*');
        metrics.dataGaps.slice(0, 3).forEach(gap => {
          lines.push(`- **${gap.label}** (+${gap.potentialGain}%): ${gap.prompt}`);
        });
      }

      lines.push('');
      lines.push(`*Personalization calculated: ${new Date(metrics.calculatedAt).toLocaleDateString()}*`);

    } catch (error) {
      console.error('Error calculating personalization metrics:', error);
    }

    lines.push('');
    lines.push('---');
    lines.push('*Auto-generated from profile data with real-time BaZi calculation.*');
    lines.push(`*Generated: ${new Date().toLocaleString()}*`);

    return lines.join('\n');
  };

  // Get stats
  const getStats = () => {
    const totalDocs = documents.length;
    const totalWords = documents.reduce((sum, d) => sum + (d.wordCount || 0), 0);
    const alwaysIncludeCount = documents.filter(d => d.alwaysInclude).length;

    const byCategory = {};
    documents.forEach(d => {
      byCategory[d.category] = (byCategory[d.category] || 0) + 1;
    });

    return {
      totalDocs,
      totalWords,
      estimatedTokens: Math.ceil(totalWords * 1.3),
      alwaysIncludeCount,
      byCategory
    };
  };

  const value = {
    documents,
    loading,
    error,
    categories: KNOWLEDGE_CATEGORIES,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentsForContext,
    buildKnowledgePrompt,
    getStats,
    syncProfileToKB,  // Auto-sync profile data to KB
    cleanupDuplicateProfileDocs,  // Remove duplicate profile blueprints
    deleteAllProfileSummaries  // Mass delete all profile summaries (nuclear option)
  };

  return (
    <KnowledgeBaseContext.Provider value={value}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
}

export default KnowledgeBaseContext;
