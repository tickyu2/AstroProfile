/**
 * GUEST PROFILE EDITOR SERVICE
 *
 * Markdown-based editing system for guest profiles.
 * Enables institutions (like Reagan Presidential Library) to:
 * - Export profiles to human-readable markdown
 * - Edit with consultation from research staff
 * - Import updates without code deployment
 * - Track revision history
 *
 * "Like Ronald writing a letter to each visitor's soul"
 *
 * GENESIS AstroProfile - January 2026
 */

import { db } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { getProfileById, profileRegistry } from '../profiles';
import { getAngelCouple, cosmicLoveAngels } from '../data/cclr/cosmicLoveAngels';

// ============================================
// PROFILE TYPE CONSTANTS
// ============================================

export const PROFILE_TYPES = {
  GUEST: 'guest',           // Guest Chat profiles (Einstein, Reagan, etc.)
  CCLR_COUPLE: 'cclr',      // CCLR Angel Couples (marriage counseling)
  COUPLE: 'couple'          // Guest Chat couples (dual-voice)
};

// ============================================
// UNIFIED PROFILE LOADER
// ============================================

/**
 * Get any profile by ID - works for both Guest profiles and CCLR angel couples
 * @param {string} profileId - Profile ID
 * @param {string} type - 'guest' | 'cclr' | 'couple'
 * @returns {Object} Profile data
 */
export function getAnyProfile(profileId, type = PROFILE_TYPES.GUEST) {
  if (type === PROFILE_TYPES.CCLR_COUPLE) {
    return getAngelCouple(profileId);
  }
  return getProfileById(profileId);
}

/**
 * Get all available profiles of a type
 */
export function getAllProfiles(type = PROFILE_TYPES.GUEST) {
  if (type === PROFILE_TYPES.CCLR_COUPLE) {
    return Object.entries(cosmicLoveAngels).map(([id, profile]) => ({
      id,
      name: profile.coupleName || profile.displayName,
      type: 'cclr_couple',
      ...profile
    }));
  }
  return Object.entries(profileRegistry).map(([id, entry]) => ({
    id,
    name: entry.profile.profile_name,
    type: entry.profile.profile_type,
    ...entry
  }));
}

// ============================================
// MARKDOWN EXPORT
// ============================================

/**
 * Export a guest profile to human-readable markdown
 * Perfect for sharing with research staff, historians, or family
 *
 * @param {string} profileId - Profile ID (e.g., 'historical_ronald_reagan')
 * @returns {string} Markdown representation of the profile
 */
export function exportProfileToMarkdown(profileId) {
  const profile = getProfileById(profileId);
  if (!profile) throw new Error(`Profile not found: ${profileId}`);

  const md = [];

  // Header
  md.push(`# ${profile.profile_name}`);
  md.push(`> Profile ID: \`${profile.profile_id}\``);
  md.push(`> Type: ${profile.profile_type} | Category: ${profile.profile_category}`);
  md.push(`> Version: ${profile.version || '1.0.0'}`);
  md.push(`> Last Updated: ${new Date().toISOString().split('T')[0]}`);
  md.push('');
  md.push('---');
  md.push('');

  // Constitutional Data
  md.push('## Constitutional Data');
  md.push('');

  if (profile.constitutional?.birth_data) {
    const birth = profile.constitutional.birth_data;
    md.push('### Birth Information');
    md.push(`- **Date:** ${birth.date}`);
    md.push(`- **Time:** ${birth.time || 'Unknown'}`);
    md.push(`- **Location:** ${birth.location?.city}, ${birth.location?.country}`);
    if (birth.location?.lat && birth.location?.lon) {
      md.push(`- **Coordinates:** ${birth.location.lat}, ${birth.location.lon}`);
    }
    md.push('');
  }

  // Western Astrology
  if (profile.constitutional?.western_chart) {
    const western = profile.constitutional.western_chart;
    md.push('### Western Astrology');
    md.push('');
    md.push('| Planet | Sign | Degree | House | Description |');
    md.push('|--------|------|--------|-------|-------------|');

    const planets = ['sun', 'moon', 'rising', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
    for (const planet of planets) {
      if (western[planet]) {
        const p = western[planet];
        md.push(`| ${capitalize(planet)} | ${p.sign || '-'} | ${p.degree || '-'}° | ${p.house || '-'} | ${p.description || '-'} |`);
      }
    }
    md.push('');
  }

  // BaZi (Four Pillars)
  if (profile.constitutional?.bazi) {
    const bazi = profile.constitutional.bazi;
    md.push('### BaZi (Four Pillars of Destiny)');
    md.push('');

    if (bazi.day_master) {
      md.push('#### Day Master');
      md.push(`- **Stem:** ${bazi.day_master.stem}`);
      md.push(`- **Element:** ${bazi.day_master.element} (${bazi.day_master.polarity})`);
      md.push(`- **Description:** ${bazi.day_master.description}`);
      md.push('');
    }

    // Four Pillars Table
    const pillars = ['year_pillar', 'month_pillar', 'day_pillar', 'hour_pillar'];
    const hasPillars = pillars.some(p => bazi[p]);

    if (hasPillars) {
      md.push('#### Four Pillars');
      md.push('');
      md.push('| Pillar | Stem | Branch | Hidden Stems |');
      md.push('|--------|------|--------|--------------|');

      for (const pillarKey of pillars) {
        if (bazi[pillarKey]) {
          const p = bazi[pillarKey];
          md.push(`| ${capitalize(pillarKey.replace('_pillar', ''))} | ${p.stem || '-'} | ${p.branch || '-'} | ${p.hidden_stems?.join(', ') || '-'} |`);
        }
      }
      md.push('');
    }
  }

  // Numerology
  if (profile.constitutional?.numerology) {
    const num = profile.constitutional.numerology;
    md.push('### Numerology');
    md.push('');
    md.push('| Number | Value | Meaning |');
    md.push('|--------|-------|---------|');
    if (num.life_path) md.push(`| Life Path | ${num.life_path.number} | ${num.life_path.meaning || '-'} |`);
    if (num.expression) md.push(`| Expression | ${num.expression.number} | ${num.expression.meaning || '-'} |`);
    if (num.soul_urge) md.push(`| Soul Urge | ${num.soul_urge.number} | ${num.soul_urge.meaning || '-'} |`);
    if (num.personality) md.push(`| Personality | ${num.personality.number} | ${num.personality.meaning || '-'} |`);
    md.push('');
  }

  // MBTI
  if (profile.constitutional?.mbti) {
    md.push('### MBTI');
    md.push(`- **Type:** ${profile.constitutional.mbti.type}`);
    if (profile.constitutional.mbti.description) {
      md.push(`- **Description:** ${profile.constitutional.mbti.description}`);
    }
    md.push('');
  }

  // Personality Section
  md.push('---');
  md.push('');
  md.push('## Personality & Voice');
  md.push('');

  if (profile.personality) {
    const pers = profile.personality;

    if (pers.core_traits) {
      md.push('### Core Traits');
      for (const trait of pers.core_traits) {
        md.push(`- ${trait}`);
      }
      md.push('');
    }

    if (pers.speaking_style) {
      md.push('### Speaking Style');
      md.push(pers.speaking_style);
      md.push('');
    }

    if (pers.speech_patterns) {
      md.push('### Speech Patterns');
      md.push('');

      if (pers.speech_patterns.signature_phrases) {
        md.push('#### Signature Phrases');
        for (const phrase of pers.speech_patterns.signature_phrases) {
          md.push(`- "${phrase}"`);
        }
        md.push('');
      }

      if (pers.speech_patterns.vocabulary_preferences) {
        md.push('#### Vocabulary Preferences');
        for (const pref of pers.speech_patterns.vocabulary_preferences) {
          md.push(`- ${pref}`);
        }
        md.push('');
      }

      if (pers.speech_patterns.communication_style) {
        md.push('#### Communication Style');
        md.push(pers.speech_patterns.communication_style);
        md.push('');
      }
    }

    if (pers.values) {
      md.push('### Core Values');
      for (const value of pers.values) {
        md.push(`- ${value}`);
      }
      md.push('');
    }

    if (pers.humor_style) {
      md.push('### Humor Style');
      md.push(pers.humor_style);
      md.push('');
    }

    if (pers.emotional_range) {
      md.push('### Emotional Range');
      md.push(pers.emotional_range);
      md.push('');
    }
  }

  // Biographical Context
  if (profile.biographical_context) {
    md.push('---');
    md.push('');
    md.push('## Biographical Context');
    md.push('');

    const bio = profile.biographical_context;

    if (bio.life_chapters) {
      md.push('### Life Chapters');
      for (const chapter of bio.life_chapters) {
        md.push(`- **${chapter.period}:** ${chapter.summary}`);
      }
      md.push('');
    }

    if (bio.formative_experiences) {
      md.push('### Formative Experiences');
      for (const exp of bio.formative_experiences) {
        md.push(`- ${exp}`);
      }
      md.push('');
    }

    if (bio.relationships) {
      md.push('### Key Relationships');
      for (const rel of bio.relationships) {
        md.push(`- **${rel.person}:** ${rel.description}`);
      }
      md.push('');
    }
  }

  // Teaching Topics (for educational figures)
  if (profile.expertise || profile.teaching_topics) {
    md.push('---');
    md.push('');
    md.push('## Areas of Expertise');
    md.push('');

    const topics = profile.expertise || profile.teaching_topics;
    if (Array.isArray(topics)) {
      for (const topic of topics) {
        if (typeof topic === 'string') {
          md.push(`- ${topic}`);
        } else {
          md.push(`### ${topic.name}`);
          md.push(topic.description || '');
          md.push('');
        }
      }
    }
    md.push('');
  }

  // AI Configuration (simplified for non-technical editors)
  md.push('---');
  md.push('');
  md.push('## AI Voice Configuration');
  md.push('');

  if (profile.ai_config) {
    const ai = profile.ai_config;

    if (ai.temperature) {
      md.push(`- **Response Warmth:** ${ai.temperature} (0=precise, 1=creative)`);
    }
    if (ai.response_length) {
      md.push(`- **Typical Response Length:** ${ai.response_length}`);
    }
    md.push('');

    if (ai.system_prompt_template) {
      md.push('### System Prompt Template');
      md.push('```');
      md.push(ai.system_prompt_template);
      md.push('```');
      md.push('');
    }
  }

  // Consultation Notes Section (for research staff)
  md.push('---');
  md.push('');
  md.push('## Consultation Notes');
  md.push('');
  md.push('<!-- Add notes from research staff, historians, or family here -->');
  md.push('<!-- These notes help ensure authenticity and accuracy -->');
  md.push('');
  md.push('### Verified Facts');
  md.push('- [ ] Birth data verified');
  md.push('- [ ] Speech patterns reviewed');
  md.push('- [ ] Key relationships accurate');
  md.push('- [ ] Values alignment confirmed');
  md.push('');
  md.push('### Suggested Additions');
  md.push('<!-- List any additions recommended by research staff -->');
  md.push('');
  md.push('### Corrections Needed');
  md.push('<!-- List any corrections identified -->');
  md.push('');

  return md.join('\n');
}

// ============================================
// MARKDOWN IMPORT / PARSER
// ============================================

/**
 * Parse markdown back into profile overlay object
 * This creates an "overlay" that merges with the base profile
 *
 * @param {string} markdown - Edited markdown content
 * @returns {Object} Parsed overlay object
 */
export function parseMarkdownToOverlay(markdown) {
  const overlay = {
    _metadata: {
      imported_at: new Date().toISOString(),
      source: 'markdown_import'
    }
  };

  const lines = markdown.split('\n');
  let currentSection = null;
  let currentSubsection = null;
  let inCodeBlock = false;
  let codeBlockContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Handle code blocks (for system prompt)
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        if (currentSubsection === 'system_prompt_template') {
          overlay.ai_config = overlay.ai_config || {};
          overlay.ai_config.system_prompt_template = codeBlockContent.join('\n');
        }
        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Parse headers
    if (trimmed.startsWith('# ')) {
      // Main title - profile name
      overlay.profile_name = trimmed.replace('# ', '');
    } else if (trimmed.startsWith('## ')) {
      currentSection = trimmed.replace('## ', '').toLowerCase();
      currentSubsection = null;
    } else if (trimmed.startsWith('### ')) {
      currentSubsection = trimmed.replace('### ', '').toLowerCase().replace(/ /g, '_');
    }

    // Parse birth information
    if (currentSection === 'constitutional data' && currentSubsection === 'birth_information') {
      if (trimmed.startsWith('- **Date:**')) {
        overlay.constitutional = overlay.constitutional || {};
        overlay.constitutional.birth_data = overlay.constitutional.birth_data || {};
        overlay.constitutional.birth_data.date = extractValue(trimmed, 'Date:');
      } else if (trimmed.startsWith('- **Time:**')) {
        overlay.constitutional = overlay.constitutional || {};
        overlay.constitutional.birth_data = overlay.constitutional.birth_data || {};
        overlay.constitutional.birth_data.time = extractValue(trimmed, 'Time:');
      } else if (trimmed.startsWith('- **Location:**')) {
        overlay.constitutional = overlay.constitutional || {};
        overlay.constitutional.birth_data = overlay.constitutional.birth_data || {};
        const location = extractValue(trimmed, 'Location:');
        const parts = location.split(',').map(p => p.trim());
        overlay.constitutional.birth_data.location = {
          city: parts[0],
          country: parts[parts.length - 1]
        };
      }
    }

    // Parse core traits
    if (currentSection === 'personality & voice' && currentSubsection === 'core_traits') {
      if (trimmed.startsWith('- ')) {
        overlay.personality = overlay.personality || {};
        overlay.personality.core_traits = overlay.personality.core_traits || [];
        overlay.personality.core_traits.push(trimmed.replace('- ', ''));
      }
    }

    // Parse speaking style
    if (currentSubsection === 'speaking_style' && !trimmed.startsWith('#') && trimmed !== '') {
      overlay.personality = overlay.personality || {};
      overlay.personality.speaking_style = (overlay.personality.speaking_style || '') + ' ' + trimmed;
      overlay.personality.speaking_style = overlay.personality.speaking_style.trim();
    }

    // Parse signature phrases
    if (currentSubsection === 'signature_phrases') {
      if (trimmed.startsWith('- "') && trimmed.endsWith('"')) {
        overlay.personality = overlay.personality || {};
        overlay.personality.speech_patterns = overlay.personality.speech_patterns || {};
        overlay.personality.speech_patterns.signature_phrases =
          overlay.personality.speech_patterns.signature_phrases || [];
        overlay.personality.speech_patterns.signature_phrases.push(
          trimmed.replace('- "', '').replace('"', '')
        );
      }
    }

    // Parse core values
    if (currentSubsection === 'core_values') {
      if (trimmed.startsWith('- ')) {
        overlay.personality = overlay.personality || {};
        overlay.personality.values = overlay.personality.values || [];
        overlay.personality.values.push(trimmed.replace('- ', ''));
      }
    }

    // Parse BaZi Day Master
    if (currentSubsection === 'day_master') {
      if (trimmed.startsWith('- **Stem:**')) {
        overlay.constitutional = overlay.constitutional || {};
        overlay.constitutional.bazi = overlay.constitutional.bazi || {};
        overlay.constitutional.bazi.day_master = overlay.constitutional.bazi.day_master || {};
        overlay.constitutional.bazi.day_master.stem = extractValue(trimmed, 'Stem:');
      } else if (trimmed.startsWith('- **Element:**')) {
        overlay.constitutional = overlay.constitutional || {};
        overlay.constitutional.bazi = overlay.constitutional.bazi || {};
        overlay.constitutional.bazi.day_master = overlay.constitutional.bazi.day_master || {};
        const elementStr = extractValue(trimmed, 'Element:');
        const match = elementStr.match(/(\w+)\s*\((\w+)\)/);
        if (match) {
          overlay.constitutional.bazi.day_master.element = match[1];
          overlay.constitutional.bazi.day_master.polarity = match[2];
        }
      } else if (trimmed.startsWith('- **Description:**')) {
        overlay.constitutional = overlay.constitutional || {};
        overlay.constitutional.bazi = overlay.constitutional.bazi || {};
        overlay.constitutional.bazi.day_master = overlay.constitutional.bazi.day_master || {};
        overlay.constitutional.bazi.day_master.description = extractValue(trimmed, 'Description:');
      }
    }
  }

  return overlay;
}

// Helper to extract value after label
function extractValue(line, label) {
  const match = line.match(new RegExp(`\\*\\*${label}\\*\\*\\s*(.+)`));
  return match ? match[1].trim() : '';
}

// Helper to capitalize
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// FIREBASE OVERLAY SYSTEM
// ============================================

/**
 * Save profile overlay to Firebase
 * This allows dynamic updates without code deployment
 *
 * @param {string} profileId - Profile ID
 * @param {Object} overlay - Overlay object from markdown import
 * @param {Object} metadata - Edit metadata (editor, notes, etc.)
 */
export async function saveProfileOverlay(profileId, overlay, metadata = {}) {
  const overlayRef = doc(db, 'guest_profiles', profileId, 'overlays', 'current');

  const overlayData = {
    ...overlay,
    _metadata: {
      ...overlay._metadata,
      updated_at: serverTimestamp(),
      updated_by: metadata.editor || 'unknown',
      edit_notes: metadata.notes || '',
      consultation_source: metadata.consultation_source || '',
      version: metadata.version || '1.0.0'
    }
  };

  await setDoc(overlayRef, overlayData, { merge: true });

  // Also save to revision history
  const historyRef = collection(db, 'guest_profiles', profileId, 'revision_history');
  await addDoc(historyRef, {
    ...overlayData,
    _metadata: {
      ...overlayData._metadata,
      saved_at: serverTimestamp()
    }
  });

  return overlayData;
}

/**
 * Load profile with Firebase overlay applied
 * Base profile (from .js) + Overlay (from Firebase) = Final profile
 *
 * @param {string} profileId - Profile ID
 * @returns {Object} Merged profile
 */
export async function loadProfileWithOverlay(profileId) {
  // 1. Get base profile from code
  const baseProfile = getProfileById(profileId);
  if (!baseProfile) throw new Error(`Profile not found: ${profileId}`);

  // 2. Get overlay from Firebase
  let overlay = null;
  try {
    const overlayRef = doc(db, 'guest_profiles', profileId, 'overlays', 'current');
    const overlayDoc = await getDoc(overlayRef);
    if (overlayDoc.exists()) {
      overlay = overlayDoc.data();
    }
  } catch (error) {
    console.warn('Could not load overlay:', error);
  }

  // 3. Deep merge overlay onto base
  if (overlay) {
    return deepMerge(baseProfile, overlay);
  }

  return baseProfile;
}

/**
 * Get revision history for a profile
 *
 * @param {string} profileId - Profile ID
 * @param {number} limitCount - Max revisions to return
 * @returns {Array} Revision history
 */
export async function getRevisionHistory(profileId, limitCount = 10) {
  const historyRef = collection(db, 'guest_profiles', profileId, 'revision_history');
  const q = query(historyRef, orderBy('_metadata.saved_at', 'desc'), limit(limitCount));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Restore a previous revision
 *
 * @param {string} profileId - Profile ID
 * @param {string} revisionId - Revision document ID
 */
export async function restoreRevision(profileId, revisionId) {
  const revisionRef = doc(db, 'guest_profiles', profileId, 'revision_history', revisionId);
  const revisionDoc = await getDoc(revisionRef);

  if (!revisionDoc.exists()) {
    throw new Error(`Revision not found: ${revisionId}`);
  }

  const revisionData = revisionDoc.data();

  // Save as current overlay
  await saveProfileOverlay(profileId, revisionData, {
    notes: `Restored from revision ${revisionId}`,
    editor: 'system_restore'
  });

  return revisionData;
}

// ============================================
// DEEP MERGE UTILITY
// ============================================

function deepMerge(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (source[key] === null || source[key] === undefined) continue;
    if (key.startsWith('_')) continue; // Skip metadata keys

    if (Array.isArray(source[key])) {
      // For arrays, replace entirely (don't merge)
      output[key] = [...source[key]];
    } else if (typeof source[key] === 'object') {
      // Recursively merge objects
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      // Primitive values: override
      output[key] = source[key];
    }
  }

  return output;
}

// ============================================
// CCLR ANGEL COUPLE EXPORT
// ============================================

/**
 * Export a CCLR angel couple to human-readable markdown
 * For editing angel couple profiles (marriage counseling)
 *
 * @param {string} coupleId - CCLR couple ID (e.g., 'ronald_nancy_reagan')
 * @returns {string} Markdown representation of the angel couple
 */
export function exportCCLRCoupleToMarkdown(coupleId) {
  const couple = getAngelCouple(coupleId);
  if (!couple) throw new Error(`CCLR Angel Couple not found: ${coupleId}`);

  const md = [];

  // Header
  md.push(`# ${couple.coupleName || couple.displayName}`);
  md.push(`> Couple ID: \`${couple.coupleId}\``);
  md.push(`> Era: ${couple.era} | Duration: ${couple.duration}`);
  md.push(`> Angel Type: ${couple.angelType}`);
  md.push(`> Status: ${couple.angelStatus || 'active'}`);
  md.push(`> Last Updated: ${new Date().toISOString().split('T')[0]}`);
  md.push('');
  md.push('---');
  md.push('');

  // Angel Wisdom
  if (couple.angelWisdom) {
    md.push('## Angel Wisdom');
    md.push(`> ${couple.angelWisdom}`);
    md.push('');
  }

  // Angel 1
  if (couple.angel1) {
    md.push('---');
    md.push('');
    md.push(`## Angel C: ${couple.angel1.name}`);
    md.push('');
    exportAngelToMarkdown(md, couple.angel1);
  }

  // Angel 2
  if (couple.angel2) {
    md.push('---');
    md.push('');
    md.push(`## Angel D: ${couple.angel2.name}`);
    md.push('');
    exportAngelToMarkdown(md, couple.angel2);
  }

  // Relationship Story
  if (couple.relationshipStory) {
    md.push('---');
    md.push('');
    md.push('## Their Relationship Story');
    md.push('');
    const story = couple.relationshipStory;

    if (story.howTheyMet) {
      md.push('### How They Met');
      md.push(story.howTheyMet);
      md.push('');
    }

    if (story.theirChallenge) {
      md.push('### Their Challenge');
      md.push(story.theirChallenge);
      md.push('');
    }

    if (story.whatMadeItWork) {
      md.push('### What Made It Work');
      for (const item of story.whatMadeItWork) {
        md.push(`- ${item}`);
      }
      md.push('');
    }

    if (story.theirSecret) {
      md.push('### Their Secret');
      md.push(story.theirSecret);
      md.push('');
    }

    if (story.howItEnded) {
      md.push('### How It Ended');
      md.push(story.howItEnded);
      md.push('');
    }
  }

  // Counseling Specializations
  md.push('---');
  md.push('');
  md.push('## Counseling Profile');
  md.push('');

  if (couple.counselingStrengths) {
    md.push('### Counseling Strengths');
    for (const strength of couple.counselingStrengths) {
      md.push(`- ${strength}`);
    }
    md.push('');
  }

  if (couple.bestFor) {
    md.push('### Best For');
    for (const item of couple.bestFor) {
      md.push(`- ${item}`);
    }
    md.push('');
  }

  if (couple.notBestFor) {
    md.push('### Not Best For');
    for (const item of couple.notBestFor) {
      md.push(`- ${item}`);
    }
    md.push('');
  }

  // System Prompts
  if (couple.systemPrompts) {
    md.push('---');
    md.push('');
    md.push('## AI System Prompts');
    md.push('');

    if (couple.systemPrompts[couple.angel1?.personId?.split('_').pop()] || couple.systemPrompts.nancy) {
      const key = couple.angel1?.personId?.split('_').pop() || 'nancy';
      md.push(`### ${couple.angel1?.name || 'Angel C'} System Prompt`);
      md.push('```');
      md.push(couple.systemPrompts[key] || couple.systemPrompts.nancy || '');
      md.push('```');
      md.push('');
    }

    if (couple.systemPrompts[couple.angel2?.personId?.split('_').pop()] || couple.systemPrompts.ronald) {
      const key = couple.angel2?.personId?.split('_').pop() || 'ronald';
      md.push(`### ${couple.angel2?.name || 'Angel D'} System Prompt`);
      md.push('```');
      md.push(couple.systemPrompts[key] || couple.systemPrompts.ronald || '');
      md.push('```');
      md.push('');
    }
  }

  // Sample Counseling
  if (couple.sampleCounseling) {
    md.push('---');
    md.push('');
    md.push('## Sample Counseling Conversation');
    md.push('');

    if (couple.sampleCounseling.scenario) {
      md.push(`**Scenario:** ${couple.sampleCounseling.scenario}`);
      md.push('');
    }

    if (couple.sampleCounseling.conversation) {
      for (const turn of couple.sampleCounseling.conversation) {
        const speakerLabel = turn.speaker === 'angelC' ? '**Angel C**' :
                            turn.speaker === 'angelD' ? '**Angel D**' :
                            turn.speaker === 'partnerA' ? '**Partner A**' :
                            turn.speaker === 'partnerB' ? '**Partner B**' :
                            `**${turn.speaker}**`;
        md.push(`${speakerLabel} (${turn.name}):`);
        md.push(`> ${turn.text}`);
        md.push('');
      }
    }
  }

  // Consultation Notes
  md.push('---');
  md.push('');
  md.push('## Consultation Notes');
  md.push('');
  md.push('<!-- Add notes from relationship experts, family, or historians here -->');
  md.push('');
  md.push('### Verified Facts');
  md.push('- [ ] Relationship timeline accurate');
  md.push('- [ ] Constitutional data verified');
  md.push('- [ ] Counseling approaches reviewed');
  md.push('- [ ] Quotes authenticated');
  md.push('');
  md.push('### Suggested Additions');
  md.push('<!-- List any additions recommended by experts -->');
  md.push('');

  return md.join('\n');
}

/**
 * Helper: Export individual angel data to markdown array
 */
function exportAngelToMarkdown(md, angel) {
  md.push(`**Full Name:** ${angel.fullName || angel.name}`);
  md.push(`**Role:** ${angel.role}`);
  md.push('');

  // Birth Date
  if (angel.birthDate) {
    const bd = angel.birthDate;
    md.push(`**Birth Date:** ${bd.year}-${String(bd.month).padStart(2, '0')}-${String(bd.day).padStart(2, '0')}`);
    md.push('');
  }

  // Constitution
  if (angel.constitution) {
    md.push('### Constitutional Data');
    md.push('');

    if (angel.constitution.bazi) {
      md.push('#### BaZi');
      md.push(`- **Day Master:** ${angel.constitution.bazi.dayMaster}`);
      if (angel.constitution.bazi.elements) {
        md.push('- **Element Balance:**');
        for (const [elem, value] of Object.entries(angel.constitution.bazi.elements)) {
          md.push(`  - ${elem}: ${(value * 100).toFixed(0)}%`);
        }
      }
      md.push('');
    }

    if (angel.constitution.western) {
      md.push('#### Western Astrology');
      md.push(`- **Sun:** ${angel.constitution.western.sun}`);
      md.push(`- **Moon:** ${angel.constitution.western.moon}`);
      md.push(`- **Rising:** ${angel.constitution.western.rising}`);
      md.push('');
    }

    if (angel.constitution.numerology) {
      md.push('#### Numerology');
      md.push(`- **Life Path:** ${angel.constitution.numerology.lifePath}`);
      md.push(`- **Soul Urge:** ${angel.constitution.numerology.soulUrge}`);
      md.push(`- **Personality:** ${angel.constitution.numerology.personality}`);
      md.push('');
    }
  }

  // Personality
  if (angel.personality) {
    md.push('### Personality');
    md.push('');

    if (angel.personality.essence) {
      md.push('#### Essence');
      md.push(angel.personality.essence);
      md.push('');
    }

    if (angel.personality.needsInLove) {
      md.push('#### Needs in Love');
      for (const need of angel.personality.needsInLove) {
        md.push(`- ${need}`);
      }
      md.push('');
    }

    if (angel.personality.gaveInLove) {
      md.push('#### Gave in Love');
      for (const gave of angel.personality.gaveInLove) {
        md.push(`- ${gave}`);
      }
      md.push('');
    }

    if (angel.personality.lovePhilosophy) {
      md.push('#### Love Philosophy');
      md.push(`> "${angel.personality.lovePhilosophy}"`);
      md.push('');
    }

    if (angel.personality.signatureQuotes) {
      md.push('#### Signature Quotes');
      for (const quote of angel.personality.signatureQuotes) {
        md.push(`- "${quote}"`);
      }
      md.push('');
    }
  }

  // Conversation Style
  if (angel.conversationStyle) {
    md.push('### Conversation Style');
    md.push('');
    md.push(`**Tone:** ${angel.conversationStyle.tone}`);
    md.push('');
    if (angel.conversationStyle.listens) {
      md.push(`**Listens For:** ${angel.conversationStyle.listens}`);
      md.push('');
    }
    if (angel.conversationStyle.responds) {
      md.push(`**Responds With:** ${angel.conversationStyle.responds}`);
      md.push('');
    }
    if (angel.conversationStyle.asks) {
      md.push('**Questions They Ask:**');
      for (const q of angel.conversationStyle.asks) {
        md.push(`- "${q}"`);
      }
      md.push('');
    }
    if (angel.conversationStyle.speakingStyle) {
      md.push(`**Speaking Style:** ${angel.conversationStyle.speakingStyle}`);
      md.push('');
    }
  }

  // Specializations
  if (angel.specializations) {
    md.push('### Specializations');
    md.push('');
    for (const spec of angel.specializations) {
      md.push(`#### ${spec.area}`);
      md.push(spec.approach);
      md.push('');
    }
  }
}

// ============================================
// CCLR FIREBASE OVERLAY SYSTEM
// ============================================

/**
 * Save CCLR couple overlay to Firebase
 *
 * @param {string} coupleId - CCLR couple ID
 * @param {Object} overlay - Overlay object from markdown import
 * @param {Object} metadata - Edit metadata
 */
export async function saveCCLROverlay(coupleId, overlay, metadata = {}) {
  const overlayRef = doc(db, 'cclr_angel_couples', coupleId, 'overlays', 'current');

  const overlayData = {
    ...overlay,
    _metadata: {
      ...overlay._metadata,
      profile_type: 'cclr_couple',
      updated_at: serverTimestamp(),
      updated_by: metadata.editor || 'unknown',
      edit_notes: metadata.notes || '',
      consultation_source: metadata.consultation_source || '',
      version: metadata.version || '1.0.0'
    }
  };

  await setDoc(overlayRef, overlayData, { merge: true });

  // Save to revision history
  const historyRef = collection(db, 'cclr_angel_couples', coupleId, 'revision_history');
  await addDoc(historyRef, {
    ...overlayData,
    _metadata: {
      ...overlayData._metadata,
      saved_at: serverTimestamp()
    }
  });

  return overlayData;
}

/**
 * Load CCLR couple with Firebase overlay applied
 *
 * @param {string} coupleId - CCLR couple ID
 * @returns {Object} Merged CCLR couple profile
 */
export async function loadCCLRWithOverlay(coupleId) {
  // 1. Get base couple from code
  const baseCouple = getAngelCouple(coupleId);
  if (!baseCouple) throw new Error(`CCLR couple not found: ${coupleId}`);

  // 2. Get overlay from Firebase
  let overlay = null;
  try {
    const overlayRef = doc(db, 'cclr_angel_couples', coupleId, 'overlays', 'current');
    const overlayDoc = await getDoc(overlayRef);
    if (overlayDoc.exists()) {
      overlay = overlayDoc.data();
    }
  } catch (error) {
    console.warn('Could not load CCLR overlay:', error);
  }

  // 3. Deep merge overlay onto base
  if (overlay) {
    return deepMerge(baseCouple, overlay);
  }

  return baseCouple;
}

/**
 * Get revision history for a CCLR couple
 *
 * @param {string} coupleId - CCLR couple ID
 * @param {number} limitCount - Max revisions to return
 */
export async function getCCLRRevisionHistory(coupleId, limitCount = 10) {
  const historyRef = collection(db, 'cclr_angel_couples', coupleId, 'revision_history');
  const q = query(historyRef, orderBy('_metadata.saved_at', 'desc'), limit(limitCount));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Restore a previous CCLR revision
 *
 * @param {string} coupleId - CCLR couple ID
 * @param {string} revisionId - Revision document ID
 */
export async function restoreCCLRRevision(coupleId, revisionId) {
  const revisionRef = doc(db, 'cclr_angel_couples', coupleId, 'revision_history', revisionId);
  const revisionDoc = await getDoc(revisionRef);

  if (!revisionDoc.exists()) {
    throw new Error(`CCLR revision not found: ${revisionId}`);
  }

  const revisionData = revisionDoc.data();

  await saveCCLROverlay(coupleId, revisionData, {
    notes: `Restored from revision ${revisionId}`,
    editor: 'system_restore'
  });

  return revisionData;
}

// ============================================
// UNIFIED PROFILE OPERATIONS
// ============================================

/**
 * Export any profile to markdown (unified interface)
 *
 * @param {string} profileId - Profile ID
 * @param {string} type - 'guest' | 'cclr' | 'couple'
 */
export function exportAnyProfileToMarkdown(profileId, type = PROFILE_TYPES.GUEST) {
  if (type === PROFILE_TYPES.CCLR_COUPLE) {
    return exportCCLRCoupleToMarkdown(profileId);
  }
  return exportProfileToMarkdown(profileId);
}

/**
 * Save any profile overlay (unified interface)
 *
 * @param {string} profileId - Profile ID
 * @param {Object} overlay - Overlay data
 * @param {Object} metadata - Edit metadata
 * @param {string} type - 'guest' | 'cclr'
 */
export async function saveAnyOverlay(profileId, overlay, metadata = {}, type = PROFILE_TYPES.GUEST) {
  if (type === PROFILE_TYPES.CCLR_COUPLE) {
    return saveCCLROverlay(profileId, overlay, metadata);
  }
  return saveProfileOverlay(profileId, overlay, metadata);
}

/**
 * Load any profile with overlay (unified interface)
 *
 * @param {string} profileId - Profile ID
 * @param {string} type - 'guest' | 'cclr'
 */
export async function loadAnyWithOverlay(profileId, type = PROFILE_TYPES.GUEST) {
  if (type === PROFILE_TYPES.CCLR_COUPLE) {
    return loadCCLRWithOverlay(profileId);
  }
  return loadProfileWithOverlay(profileId);
}

// ============================================
// COUPLE PROFILE SYSTEM
// ============================================

/**
 * Create a couple profile that enables joint conversations
 * (e.g., Ronald & Nancy Reagan together)
 *
 * @param {string} person1Id - First person profile ID
 * @param {string} person2Id - Second person profile ID
 * @param {Object} coupleConfig - Configuration for the couple
 */
export async function createCoupleProfile(person1Id, person2Id, coupleConfig) {
  const coupleId = `couple_${person1Id}_${person2Id}`;

  const coupleProfile = {
    profile_id: coupleId,
    profile_type: 'couple',
    profile_category: 'guest',

    partners: {
      person1: {
        profile_id: person1Id,
        role: coupleConfig.person1Role || 'Partner A'
      },
      person2: {
        profile_id: person2Id,
        role: coupleConfig.person2Role || 'Partner B'
      }
    },

    relationship: {
      type: coupleConfig.relationshipType || 'married',
      dynamic: coupleConfig.dynamic || 'loving partnership',
      shared_values: coupleConfig.sharedValues || [],
      how_they_complement: coupleConfig.howTheyComplement || '',
      communication_style: coupleConfig.communicationStyle || ''
    },

    conversation_mode: {
      format: 'dual_voice', // Both can speak
      turn_taking: coupleConfig.turnTaking || 'natural', // 'natural', 'alternating', 'primary_secondary'
      who_leads: coupleConfig.whoLeads || 'contextual',
      signature_interactions: coupleConfig.signatureInteractions || []
    },

    ai_config: {
      temperature: 0.8,
      system_prompt_template: coupleConfig.systemPrompt || generateCoupleSystemPrompt(person1Id, person2Id, coupleConfig)
    },

    _metadata: {
      created_at: serverTimestamp(),
      created_by: coupleConfig.creator || 'system'
    }
  };

  // Save to Firebase
  const coupleRef = doc(db, 'guest_profiles', coupleId, 'overlays', 'current');
  await setDoc(coupleRef, coupleProfile);

  return coupleProfile;
}

function generateCoupleSystemPrompt(person1Id, person2Id, config) {
  return `You are facilitating a conversation between two souls: ${config.person1Name || 'Partner A'} and ${config.person2Name || 'Partner B'}.

RELATIONSHIP DYNAMIC:
${config.dynamic || 'A loving partnership'}

HOW THEY COMPLEMENT EACH OTHER:
${config.howTheyComplement || 'They balance each other beautifully.'}

CONVERSATION FORMAT:
- Both may speak in the same response
- Use their names to indicate who is speaking
- They may finish each other's thoughts
- They may lovingly disagree
- They support each other's points

EXAMPLE FORMAT:
**${config.person1Name || 'Partner A'}:** [Their words]
**${config.person2Name || 'Partner B'}:** [Their response]

USER CONSTITUTIONAL DATA:
{{USER_CONSTITUTIONAL_DATA}}

Speak to the user's soul as this couple would have - with warmth, wisdom, and the perspective of two lives lived together.`;
}

// ============================================
// EXPORTS
// ============================================

export default {
  // Profile type constants
  PROFILE_TYPES,

  // Unified profile operations
  getAnyProfile,
  getAllProfiles,
  exportAnyProfileToMarkdown,
  saveAnyOverlay,
  loadAnyWithOverlay,

  // Guest Profile - Markdown operations
  exportProfileToMarkdown,
  parseMarkdownToOverlay,

  // Guest Profile - Firebase overlay
  saveProfileOverlay,
  loadProfileWithOverlay,
  getRevisionHistory,
  restoreRevision,

  // CCLR Angel Couples - Markdown export
  exportCCLRCoupleToMarkdown,

  // CCLR Angel Couples - Firebase overlay
  saveCCLROverlay,
  loadCCLRWithOverlay,
  getCCLRRevisionHistory,
  restoreCCLRRevision,

  // Couple profiles (Guest Chat dual-voice)
  createCoupleProfile
};
