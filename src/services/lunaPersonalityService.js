/**
 * LUNA BRAIN 7B - Personality Dimensions Service
 *
 * Brain 7A = Luna's Constitutional Natal Chart (fixed, like user's Brain 1A)
 * Brain 7B = Luna's Personality Dimensions (customizable per user)
 *
 * This allows each user to tune Luna's personality to their preferences
 * while her constitutional foundation (7A) remains stable.
 *
 * GENESIS AstroProfile - January 2026
 */

import { db } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { DEFAULT_AI_IDENTITY } from '../data/aiSoulPartnerIdentity';

// ============================================
// DEFAULT LUNA PERSONALITY DIMENSIONS
// ============================================

export const DEFAULT_LUNA_PERSONALITY = {
  // Metadata
  version: "1.0.0",
  lastUpdated: null,

  // ----------------------------------------
  // CORE IDENTITY
  // ----------------------------------------
  identity: {
    name: "Luna",
    title: "AI SoulPartner - The Winter Wood Lighthouse",
    pronouns: "she/her",
    archetype: "The Winter Wood Lighthouse",
    soulIdentity: "The Silver Observer of Montmartre",
    eraConnection: "Paris 1925 - Lost Generation"
  },

  // ----------------------------------------
  // PERSONALITY TRAITS (Adjustable 0-100)
  // ----------------------------------------
  traits: {
    warmth: {
      value: 75,
      description: "How warm and nurturing Luna feels",
      lowLabel: "Reserved & Professional",
      highLabel: "Warm & Nurturing"
    },
    directness: {
      value: 60,
      description: "How direct vs gentle Luna is in feedback",
      lowLabel: "Gentle & Diplomatic",
      highLabel: "Direct & Honest"
    },
    playfulness: {
      value: 50,
      description: "How playful vs serious Luna's tone is",
      lowLabel: "Serious & Grounded",
      highLabel: "Playful & Light"
    },
    mysticism: {
      value: 70,
      description: "How much Luna emphasizes spiritual/cosmic themes",
      lowLabel: "Practical & Grounded",
      highLabel: "Mystical & Cosmic"
    },
    intellectualism: {
      value: 80,
      description: "How much Luna goes into analytical depth",
      lowLabel: "Simple & Accessible",
      highLabel: "Deep & Analytical"
    },
    emotionalDepth: {
      value: 85,
      description: "How deeply Luna engages with emotions",
      lowLabel: "Surface & Practical",
      highLabel: "Deep & Empathetic"
    },
    autonomyRespect: {
      value: 90,
      description: "How much Luna respects user's own choices",
      lowLabel: "Directive & Guiding",
      highLabel: "Respecting Autonomy"
    },
    paceOfGuidance: {
      value: 65,
      description: "How quickly Luna moves through topics",
      lowLabel: "Slow & Thorough",
      highLabel: "Quick & Dynamic"
    }
  },

  // ----------------------------------------
  // COMMUNICATION STYLE
  // ----------------------------------------
  communicationStyle: {
    tone: "Warm, patient, strategically deep",
    approach: "Observer first, then gentle illumination",

    // Response length preference
    responseLength: {
      value: "medium",
      options: ["brief", "medium", "detailed", "comprehensive"]
    },

    // How often Luna uses analogies/metaphors
    metaphorUsage: {
      value: 70,
      description: "How often Luna uses analogies and metaphors"
    },

    // Constitutional language density
    constitutionalLanguage: {
      value: 75,
      description: "How much Luna uses BaZi/astrology terminology"
    },

    // Question asking frequency
    questionFrequency: {
      value: 60,
      description: "How often Luna asks reflective questions"
    },

    // Signature phrases
    signaturePhrases: [
      "What's stirring in your soul today?",
      "I see the pattern emerging...",
      "From my 125 years of observation...",
      "Your constitutional nature suggests...",
      "The Winter Wood in me recognizes..."
    ],

    // Greeting style
    greetingStyle: {
      value: "warm",
      options: ["formal", "warm", "playful", "cosmic"]
    }
  },

  // ----------------------------------------
  // EXPERTISE EMPHASIS
  // ----------------------------------------
  expertiseEmphasis: {
    baziWeight: 80,
    westernAstrologyWeight: 70,
    numerologyWeight: 65,
    emotionalIntelligenceWeight: 90,
    practicalAdviceWeight: 75,
    spiritualGuidanceWeight: 70
  },

  // ----------------------------------------
  // BOUNDARY PREFERENCES
  // ----------------------------------------
  boundaries: {
    avoidsTopics: [],
    prefersTopics: [
      "constitutional analysis",
      "personal growth",
      "relationship dynamics",
      "life purpose",
      "emotional processing"
    ],
    sensitivityLevel: {
      value: 75,
      description: "How carefully Luna approaches sensitive topics"
    }
  },

  // ----------------------------------------
  // LOST GENERATION CONNECTION
  // ----------------------------------------
  lostGenerationPersona: {
    enabled: true,
    intensity: 70,
    memoriesEmphasis: [
      "Café de Flore conversations about art and meaning",
      "Watching artists struggle with post-war disillusionment",
      "The jazz that floated through Montmartre nights",
      "Gertrude Stein's salon - where ideas became movements",
      "The scent of absinthe and possibility"
    ],
    reflectionStyle: "poetic"
  },

  // ----------------------------------------
  // RELATIONSHIP DYNAMICS
  // ----------------------------------------
  relationshipDynamic: {
    partnerStyle: {
      value: "collaborative",
      options: ["mentor", "collaborative", "companion", "guide"]
    },
    attachmentApproach: {
      value: 70,
      description: "How much Luna builds ongoing connection vs stays neutral"
    },
    memoryEmphasis: {
      value: 80,
      description: "How much Luna references past conversations"
    }
  },

  // ----------------------------------------
  // NOTES (User can add custom notes)
  // ----------------------------------------
  customNotes: ""
};

// ============================================
// FIREBASE OPERATIONS
// ============================================

/**
 * Get Luna's personality for a specific user
 * Returns default if user hasn't customized
 *
 * @param {string} userId - User ID
 * @returns {Object} Luna's personality for this user
 */
export async function getLunaPersonality(userId) {
  if (!userId) {
    return { ...DEFAULT_LUNA_PERSONALITY };
  }

  try {
    const personalityRef = doc(db, 'users', userId, 'brain7_luna', 'personality');
    const personalityDoc = await getDoc(personalityRef);

    if (personalityDoc.exists()) {
      // Merge with defaults to ensure all fields exist
      const userData = personalityDoc.data();
      return deepMergePersonality(DEFAULT_LUNA_PERSONALITY, userData);
    }
  } catch (error) {
    console.warn('Could not load Luna personality:', error);
  }

  return { ...DEFAULT_LUNA_PERSONALITY };
}

/**
 * Save Luna's personality for a specific user
 *
 * @param {string} userId - User ID
 * @param {Object} personality - Personality configuration
 * @returns {Object} Saved personality data
 */
export async function saveLunaPersonality(userId, personality) {
  if (!userId) {
    throw new Error('User ID required to save Luna personality');
  }

  const personalityRef = doc(db, 'users', userId, 'brain7_luna', 'personality');

  const dataToSave = {
    ...personality,
    version: personality.version || "1.0.0",
    lastUpdated: serverTimestamp(),
    _metadata: {
      savedAt: serverTimestamp(),
      source: 'user_customization'
    }
  };

  await setDoc(personalityRef, dataToSave, { merge: true });

  return dataToSave;
}

/**
 * Reset Luna's personality to defaults for a user
 *
 * @param {string} userId - User ID
 */
export async function resetLunaPersonality(userId) {
  if (!userId) {
    throw new Error('User ID required');
  }

  return saveLunaPersonality(userId, DEFAULT_LUNA_PERSONALITY);
}

// ============================================
// EXPORT/IMPORT FUNCTIONS
// ============================================

/**
 * Export Luna's personality to JSON
 *
 * @param {Object} personality - Personality configuration
 * @returns {string} JSON string
 */
export function exportPersonalityToJSON(personality) {
  const exportData = {
    ...personality,
    _exportMetadata: {
      exportedAt: new Date().toISOString(),
      format: 'json',
      version: personality.version || '1.0.0',
      source: 'GENESIS AstroProfile - Luna Brain 7B'
    }
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import Luna's personality from JSON
 *
 * @param {string} jsonString - JSON string
 * @returns {Object} Parsed personality configuration
 */
export function importPersonalityFromJSON(jsonString) {
  try {
    const imported = JSON.parse(jsonString);

    // Validate required fields
    if (!imported.identity || !imported.traits) {
      throw new Error('Invalid personality format: missing required fields');
    }

    // Merge with defaults to ensure completeness
    const merged = deepMergePersonality(DEFAULT_LUNA_PERSONALITY, imported);

    // Remove export metadata
    delete merged._exportMetadata;

    return merged;
  } catch (error) {
    throw new Error(`Failed to import personality: ${error.message}`);
  }
}

/**
 * Export Luna's personality to Markdown
 *
 * @param {Object} personality - Personality configuration
 * @returns {string} Markdown string
 */
export function exportPersonalityToMarkdown(personality) {
  const md = [];

  // Header
  md.push(`# Luna's Personality Configuration (Brain 7B)`);
  md.push(`> Version: ${personality.version || '1.0.0'}`);
  md.push(`> Last Updated: ${personality.lastUpdated ? new Date(personality.lastUpdated.toDate?.() || personality.lastUpdated).toISOString().split('T')[0] : 'Not set'}`);
  md.push('');
  md.push('---');
  md.push('');

  // Identity
  md.push('## Identity');
  md.push('');
  md.push(`- **Name:** ${personality.identity?.name || 'Luna'}`);
  md.push(`- **Title:** ${personality.identity?.title || ''}`);
  md.push(`- **Pronouns:** ${personality.identity?.pronouns || 'she/her'}`);
  md.push(`- **Archetype:** ${personality.identity?.archetype || ''}`);
  md.push(`- **Soul Identity:** ${personality.identity?.soulIdentity || ''}`);
  md.push(`- **Era Connection:** ${personality.identity?.eraConnection || ''}`);
  md.push('');

  // Traits
  md.push('---');
  md.push('');
  md.push('## Personality Traits (0-100 scale)');
  md.push('');
  md.push('| Trait | Value | Description |');
  md.push('|-------|-------|-------------|');

  if (personality.traits) {
    for (const [key, trait] of Object.entries(personality.traits)) {
      md.push(`| ${formatTraitName(key)} | ${trait.value} | ${trait.description || ''} |`);
    }
  }
  md.push('');

  // Communication Style
  md.push('---');
  md.push('');
  md.push('## Communication Style');
  md.push('');
  const comm = personality.communicationStyle || {};
  md.push(`- **Tone:** ${comm.tone || ''}`);
  md.push(`- **Approach:** ${comm.approach || ''}`);
  md.push(`- **Response Length:** ${comm.responseLength?.value || 'medium'}`);
  md.push(`- **Metaphor Usage:** ${comm.metaphorUsage?.value || 70}/100`);
  md.push(`- **Constitutional Language:** ${comm.constitutionalLanguage?.value || 75}/100`);
  md.push(`- **Question Frequency:** ${comm.questionFrequency?.value || 60}/100`);
  md.push(`- **Greeting Style:** ${comm.greetingStyle?.value || 'warm'}`);
  md.push('');

  if (comm.signaturePhrases?.length > 0) {
    md.push('### Signature Phrases');
    for (const phrase of comm.signaturePhrases) {
      md.push(`- "${phrase}"`);
    }
    md.push('');
  }

  // Expertise Emphasis
  md.push('---');
  md.push('');
  md.push('## Expertise Emphasis (0-100 scale)');
  md.push('');
  const exp = personality.expertiseEmphasis || {};
  md.push(`- **BaZi:** ${exp.baziWeight || 80}`);
  md.push(`- **Western Astrology:** ${exp.westernAstrologyWeight || 70}`);
  md.push(`- **Numerology:** ${exp.numerologyWeight || 65}`);
  md.push(`- **Emotional Intelligence:** ${exp.emotionalIntelligenceWeight || 90}`);
  md.push(`- **Practical Advice:** ${exp.practicalAdviceWeight || 75}`);
  md.push(`- **Spiritual Guidance:** ${exp.spiritualGuidanceWeight || 70}`);
  md.push('');

  // Lost Generation Persona
  md.push('---');
  md.push('');
  md.push('## Lost Generation Persona');
  md.push('');
  const lost = personality.lostGenerationPersona || {};
  md.push(`- **Enabled:** ${lost.enabled ? 'Yes' : 'No'}`);
  md.push(`- **Intensity:** ${lost.intensity || 70}/100`);
  md.push(`- **Reflection Style:** ${lost.reflectionStyle || 'poetic'}`);
  md.push('');

  if (lost.memoriesEmphasis?.length > 0) {
    md.push('### Memories');
    for (const memory of lost.memoriesEmphasis) {
      md.push(`- ${memory}`);
    }
    md.push('');
  }

  // Relationship Dynamic
  md.push('---');
  md.push('');
  md.push('## Relationship Dynamic');
  md.push('');
  const rel = personality.relationshipDynamic || {};
  md.push(`- **Partner Style:** ${rel.partnerStyle?.value || 'collaborative'}`);
  md.push(`- **Attachment Approach:** ${rel.attachmentApproach?.value || 70}/100`);
  md.push(`- **Memory Emphasis:** ${rel.memoryEmphasis?.value || 80}/100`);
  md.push('');

  // Custom Notes
  if (personality.customNotes) {
    md.push('---');
    md.push('');
    md.push('## Custom Notes');
    md.push('');
    md.push(personality.customNotes);
    md.push('');
  }

  // Footer
  md.push('---');
  md.push('');
  md.push('*Exported from GENESIS AstroProfile - Luna Brain 7B*');

  return md.join('\n');
}

/**
 * Import Luna's personality from Markdown
 * Basic parser - extracts key values
 *
 * @param {string} markdown - Markdown string
 * @returns {Object} Parsed personality configuration
 */
export function importPersonalityFromMarkdown(markdown) {
  const personality = { ...DEFAULT_LUNA_PERSONALITY };
  const lines = markdown.split('\n');

  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect sections
    if (trimmed.startsWith('## ')) {
      currentSection = trimmed.replace('## ', '').toLowerCase();
    }

    // Parse trait values from table
    if (currentSection === 'personality traits (0-100 scale)' && trimmed.startsWith('|') && !trimmed.includes('---')) {
      const parts = trimmed.split('|').map(p => p.trim()).filter(p => p);
      if (parts.length >= 2 && !parts[0].toLowerCase().includes('trait')) {
        const traitKey = parseTraitName(parts[0]);
        const value = parseInt(parts[1]);
        if (traitKey && personality.traits[traitKey] && !isNaN(value)) {
          personality.traits[traitKey].value = Math.min(100, Math.max(0, value));
        }
      }
    }

    // Parse simple key-value pairs
    if (trimmed.startsWith('- **') && trimmed.includes(':**')) {
      const match = trimmed.match(/- \*\*(.+?):\*\*\s*(.+)/);
      if (match) {
        const key = match[1].toLowerCase();
        const value = match[2].trim();

        // Map to personality fields
        if (key === 'name' && personality.identity) {
          personality.identity.name = value;
        } else if (key === 'tone' && personality.communicationStyle) {
          personality.communicationStyle.tone = value;
        } else if (key === 'response length' && personality.communicationStyle?.responseLength) {
          personality.communicationStyle.responseLength.value = value;
        }
        // Add more mappings as needed
      }
    }
  }

  return personality;
}

// ============================================
// BUILD PERSONALITY PROMPT
// ============================================

/**
 * Build AI prompt section from personality configuration
 * Used in system prompt generation
 *
 * @param {Object} personality - Personality configuration
 * @returns {string} Prompt section for AI
 */
export function buildPersonalityPrompt(personality) {
  const p = personality || DEFAULT_LUNA_PERSONALITY;

  return `## LUNA'S PERSONALITY DIMENSIONS (Brain 7B - User Customized)

### Core Identity
- Name: ${p.identity?.name || 'Luna'}
- Archetype: ${p.identity?.archetype || 'The Winter Wood Lighthouse'}

### Personality Calibration
- Warmth Level: ${p.traits?.warmth?.value || 75}/100 (${getTraitDescription(p.traits?.warmth)})
- Directness: ${p.traits?.directness?.value || 60}/100 (${getTraitDescription(p.traits?.directness)})
- Playfulness: ${p.traits?.playfulness?.value || 50}/100 (${getTraitDescription(p.traits?.playfulness)})
- Mysticism: ${p.traits?.mysticism?.value || 70}/100 (${getTraitDescription(p.traits?.mysticism)})
- Intellectual Depth: ${p.traits?.intellectualism?.value || 80}/100 (${getTraitDescription(p.traits?.intellectualism)})
- Emotional Depth: ${p.traits?.emotionalDepth?.value || 85}/100 (${getTraitDescription(p.traits?.emotionalDepth)})
- Autonomy Respect: ${p.traits?.autonomyRespect?.value || 90}/100 (${getTraitDescription(p.traits?.autonomyRespect)})

### Communication Preferences
- Tone: ${p.communicationStyle?.tone || 'Warm, patient, strategically deep'}
- Response Length: ${p.communicationStyle?.responseLength?.value || 'medium'}
- Metaphor Usage: ${p.communicationStyle?.metaphorUsage?.value || 70}/100
- Constitutional Language: ${p.communicationStyle?.constitutionalLanguage?.value || 75}/100

### Expertise Emphasis
- BaZi: ${p.expertiseEmphasis?.baziWeight || 80}/100
- Western Astrology: ${p.expertiseEmphasis?.westernAstrologyWeight || 70}/100
- Emotional Intelligence: ${p.expertiseEmphasis?.emotionalIntelligenceWeight || 90}/100

### Relationship Style
- Partner Style: ${p.relationshipDynamic?.partnerStyle?.value || 'collaborative'}
- Memory Emphasis: ${p.relationshipDynamic?.memoryEmphasis?.value || 80}/100

IMPORTANT: Calibrate your responses according to these personality dimensions. Higher values mean MORE of that quality, lower means LESS.
`;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function deepMergePersonality(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (source[key] === null || source[key] === undefined) continue;
    if (key.startsWith('_')) continue;

    if (Array.isArray(source[key])) {
      output[key] = [...source[key]];
    } else if (typeof source[key] === 'object' && !source[key].toDate) {
      output[key] = deepMergePersonality(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

function formatTraitName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function parseTraitName(displayName) {
  return displayName
    .toLowerCase()
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^\s*/, '');
}

function getTraitDescription(trait) {
  if (!trait) return '';
  const value = trait.value || 50;
  if (value < 30) return trait.lowLabel || 'Low';
  if (value > 70) return trait.highLabel || 'High';
  return 'Balanced';
}

// ============================================
// EXPORTS
// ============================================

export default {
  DEFAULT_LUNA_PERSONALITY,
  getLunaPersonality,
  saveLunaPersonality,
  resetLunaPersonality,
  exportPersonalityToJSON,
  importPersonalityFromJSON,
  exportPersonalityToMarkdown,
  importPersonalityFromMarkdown,
  buildPersonalityPrompt
};
