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

import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { generatePsychologicalProfile } from '../utils/psychologicalProfileGenerator';

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

  // Sync profile to KB - creates or updates profile summary document
  // Handles duplicates by keeping only the most recent one
  const syncProfileToKB = async (profile) => {
    if (!currentUser || !profile?.id) return null;

    try {
      setError(null);

      // Build the constitutional summary content
      const content = buildProfileSummaryContent(profile);
      const title = `${profile.displayName || profile.firstName || 'Profile'} - Constitutional Blueprint`;

      // Find ALL existing KB docs for this profile (handles duplicates)
      const existingDocs = documents.filter(d =>
        d.category === 'profile_summary' &&
        d.profileId === profile.id
      );

      if (existingDocs.length > 0) {
        // Sort by updatedAt descending to keep the most recent
        const sortedDocs = [...existingDocs].sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
          const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
          return dateB - dateA;
        });

        // Keep the first (most recent), delete the rest
        const [keepDoc, ...duplicates] = sortedDocs;

        // Delete duplicates if any exist
        if (duplicates.length > 0) {
          console.log('🧹 Found', duplicates.length, 'duplicate KB docs for profile', profile.id, '- cleaning up...');
          for (const dupDoc of duplicates) {
            try {
              await deleteDocument(dupDoc.id);
              console.log('🗑️ Deleted duplicate KB doc:', dupDoc.id);
            } catch (err) {
              console.error('Error deleting duplicate:', dupDoc.id, err);
            }
          }
        }

        // Update the kept document
        await updateDocument(keepDoc.id, {
          title,
          content,
          summary: `Constitutional identity for ${profile.displayName || profile.firstName}`,
          profileId: profile.id
        });
        console.log('🧬 Profile KB updated:', profile.id, '(kept doc:', keepDoc.id, ')');
        return keepDoc.id;
      } else {
        // Create new
        const newDoc = await createDocument({
          title,
          category: 'profile_summary',
          content,
          summary: `Constitutional identity for ${profile.displayName || profile.firstName}`,
          alwaysInclude: true,  // Always include profile summaries
          priority: 10,  // High priority
          tags: ['auto-generated', 'profile', profile.id],
          profileId: profile.id  // Custom field to track which profile
        });
        console.log('🧬 Profile KB created:', profile.id);
        return newDoc.id;
      }
    } catch (err) {
      console.error('Error syncing profile to KB:', err);
      setError(err.message);
      return null;
    }
  };

  // Cleanup duplicate profile documents across all profiles
  // Call this to fix existing duplicates
  const cleanupDuplicateProfileDocs = async () => {
    if (!currentUser) return { cleaned: 0, profiles: [] };

    const profileDocs = documents.filter(d => d.category === 'profile_summary' && d.profileId);

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
        if (fourPillars.dayMaster) {
          const dm = fourPillars.dayMaster;
          lines.push('');
          lines.push(`### Day Master (Core Self): ${dm.chinese || ''} ${dm.name || dm.element || 'Unknown'}`);
          lines.push(`- Element: ${dm.element || 'Unknown'}`);
          lines.push(`- Polarity: ${dm.polarity || dm.yinYang || 'Unknown'}`);
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
    lines.push('*Auto-generated from profile data with real-time BaZi calculation. Updated when profile changes.*');

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
    cleanupDuplicateProfileDocs  // Remove duplicate profile blueprints
  };

  return (
    <KnowledgeBaseContext.Provider value={value}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
}

export default KnowledgeBaseContext;
