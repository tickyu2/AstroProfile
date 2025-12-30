/**
 * ===============================================================================
 * SPEAKER PROFILE SERVICE (Frontend)
 * ===============================================================================
 *
 * Manages speaker profiles for multi-speaker diarization sessions.
 * Handles enrollment, profile storage, and session configuration.
 *
 * USE CASES:
 * - Family biography collaboration (Mom, Dad, siblings)
 * - Therapeutic sessions (Therapist, Client)
 * - Group facilitation (Facilitator, Participants)
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode Enhancement
 */

// Speaker colors for UI (matches backend)
export const SPEAKER_COLORS = {
  speaker_0: { primary: '#3B82F6', name: 'Blue', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  speaker_1: { primary: '#10B981', name: 'Green', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  speaker_2: { primary: '#F59E0B', name: 'Amber', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  speaker_3: { primary: '#EF4444', name: 'Red', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  speaker_4: { primary: '#8B5CF6', name: 'Purple', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  speaker_5: { primary: '#EC4899', name: 'Pink', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  speaker_6: { primary: '#14B8A6', name: 'Teal', bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
  speaker_7: { primary: '#F97316', name: 'Orange', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  unknown: { primary: '#6B7280', name: 'Gray', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
};

// Session type templates
export const SESSION_TEMPLATES = {
  family: {
    name: 'Family Biography',
    description: 'Collaborative family storytelling with multiple family members',
    icon: '👨‍👩‍👧‍👦',
    defaultSpeakers: ['Mom', 'Dad', 'Child', 'Grandparent'],
    roles: ['Parent', 'Child', 'Grandparent', 'Sibling', 'Aunt/Uncle', 'Cousin']
  },
  therapy: {
    name: 'Therapeutic Session',
    description: 'Professional therapeutic or counseling session',
    icon: '🧠',
    defaultSpeakers: ['Therapist', 'Client'],
    roles: ['Therapist', 'Client', 'Partner', 'Family Member', 'Support Person']
  },
  facilitation: {
    name: 'Facilitated Session',
    description: 'Group discussion with a facilitator',
    icon: '🎯',
    defaultSpeakers: ['Facilitator', 'Participant 1', 'Participant 2'],
    roles: ['Facilitator', 'Participant', 'Observer', 'Note-taker']
  },
  interview: {
    name: 'Interview',
    description: 'One-on-one interview or biography session',
    icon: '🎤',
    defaultSpeakers: ['Interviewer', 'Subject'],
    roles: ['Interviewer', 'Subject', 'Translator', 'Assistant']
  },
  general: {
    name: 'General',
    description: 'General multi-speaker conversation',
    icon: '💬',
    defaultSpeakers: ['Speaker A', 'Speaker B'],
    roles: ['Speaker A', 'Speaker B', 'Speaker C', 'Speaker D', 'Speaker E']
  }
};

/**
 * Speaker Profile class
 */
export class SpeakerProfile {
  constructor({
    id,
    label,
    role,
    profileId,       // GENESIS profile ID (if linked to existing profile)
    colorKey,
    avatarUrl,
    isEnrolled = false,
    enrollmentSamples = 0,
    metadata = {}
  }) {
    this.id = id || `speaker_${Date.now()}`;
    this.label = label || 'Speaker';
    this.role = role;
    this.profileId = profileId;
    this.colorKey = colorKey || 'speaker_0';
    this.color = SPEAKER_COLORS[colorKey] || SPEAKER_COLORS.unknown;
    this.avatarUrl = avatarUrl;
    this.isEnrolled = isEnrolled;
    this.enrollmentSamples = enrollmentSamples;
    this.metadata = metadata;
  }

  toJSON() {
    return {
      id: this.id,
      label: this.label,
      role: this.role,
      profileId: this.profileId,
      colorKey: this.colorKey,
      color: this.color,
      avatarUrl: this.avatarUrl,
      isEnrolled: this.isEnrolled,
      enrollmentSamples: this.enrollmentSamples,
      metadata: this.metadata
    };
  }
}

/**
 * Diarization Session Configuration
 */
export class DiarizationSession {
  constructor({
    id,
    type = 'general',
    speakers = [],
    isActive = false,
    createdAt = Date.now(),
    metadata = {}
  }) {
    this.id = id || `session_${Date.now()}`;
    this.type = type;
    this.template = SESSION_TEMPLATES[type] || SESSION_TEMPLATES.general;
    this.speakers = speakers.map((s, i) => new SpeakerProfile({
      ...s,
      colorKey: s.colorKey || `speaker_${i}`
    }));
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.metadata = metadata;
  }

  addSpeaker(speakerData) {
    const index = this.speakers.length;
    const speaker = new SpeakerProfile({
      ...speakerData,
      colorKey: speakerData.colorKey || `speaker_${index}`
    });
    this.speakers.push(speaker);
    return speaker;
  }

  removeSpeaker(speakerId) {
    this.speakers = this.speakers.filter(s => s.id !== speakerId);
    // Reassign colors
    this.speakers.forEach((s, i) => {
      s.colorKey = `speaker_${i}`;
      s.color = SPEAKER_COLORS[s.colorKey] || SPEAKER_COLORS.unknown;
    });
  }

  updateSpeaker(speakerId, updates) {
    const speaker = this.speakers.find(s => s.id === speakerId);
    if (speaker) {
      Object.assign(speaker, updates);
      if (updates.colorKey) {
        speaker.color = SPEAKER_COLORS[updates.colorKey] || SPEAKER_COLORS.unknown;
      }
    }
    return speaker;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      template: this.template,
      speakers: this.speakers.map(s => s.toJSON()),
      isActive: this.isActive,
      createdAt: this.createdAt,
      metadata: this.metadata
    };
  }
}

/**
 * Speaker Profile Service
 */
class SpeakerProfileService {
  constructor() {
    this.currentSession = null;
    this.savedSessions = new Map();
    this.enrolledVoices = new Map(); // Store voice embeddings

    // Load saved sessions from localStorage
    this._loadFromStorage();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SESSION MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create a new diarization session
   */
  createSession(type = 'general', metadata = {}) {
    const template = SESSION_TEMPLATES[type] || SESSION_TEMPLATES.general;

    // Create session with default speakers from template
    const speakers = template.defaultSpeakers.map((label, index) => ({
      label,
      role: template.roles[index] || label,
      colorKey: `speaker_${index}`
    }));

    this.currentSession = new DiarizationSession({
      type,
      speakers,
      metadata
    });

    console.log(`[SpeakerProfile] Created ${type} session with ${speakers.length} speakers`);
    return this.currentSession;
  }

  /**
   * Load a saved session
   */
  loadSession(sessionId) {
    const saved = this.savedSessions.get(sessionId);
    if (saved) {
      this.currentSession = new DiarizationSession(saved);
      return this.currentSession;
    }
    return null;
  }

  /**
   * Save current session
   */
  saveSession() {
    if (!this.currentSession) return null;

    this.savedSessions.set(this.currentSession.id, this.currentSession.toJSON());
    this._saveToStorage();
    return this.currentSession.id;
  }

  /**
   * Get current session
   */
  getSession() {
    return this.currentSession;
  }

  /**
   * End current session
   */
  endSession() {
    if (this.currentSession) {
      this.currentSession.isActive = false;
      this.saveSession();
    }
    this.currentSession = null;
  }

  /**
   * List saved sessions
   */
  getSavedSessions() {
    return Array.from(this.savedSessions.values());
  }

  /**
   * Delete a saved session
   */
  deleteSession(sessionId) {
    this.savedSessions.delete(sessionId);
    this._saveToStorage();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SPEAKER MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Add speaker to current session
   */
  addSpeaker(speakerData) {
    if (!this.currentSession) {
      console.warn('[SpeakerProfile] No active session');
      return null;
    }
    return this.currentSession.addSpeaker(speakerData);
  }

  /**
   * Remove speaker from current session
   */
  removeSpeaker(speakerId) {
    if (!this.currentSession) return;
    this.currentSession.removeSpeaker(speakerId);
  }

  /**
   * Update speaker in current session
   */
  updateSpeaker(speakerId, updates) {
    if (!this.currentSession) return null;
    return this.currentSession.updateSpeaker(speakerId, updates);
  }

  /**
   * Get speakers from current session
   */
  getSpeakers() {
    return this.currentSession?.speakers || [];
  }

  /**
   * Get speaker by ID
   */
  getSpeaker(speakerId) {
    return this.currentSession?.speakers.find(s => s.id === speakerId);
  }

  /**
   * Get speaker color
   */
  getSpeakerColor(speakerId) {
    const speaker = this.getSpeaker(speakerId);
    return speaker?.color || SPEAKER_COLORS.unknown;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VOICE ENROLLMENT
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Start voice enrollment for a speaker
   * Returns a recorder that collects voice samples
   */
  async startEnrollment(speakerId) {
    const speaker = this.getSpeaker(speakerId);
    if (!speaker) {
      throw new Error(`Speaker ${speakerId} not found`);
    }

    console.log(`[SpeakerProfile] Starting enrollment for ${speaker.label}`);

    return {
      speakerId,
      speaker: speaker.toJSON(),
      samples: [],
      requiredSamples: 3, // Need at least 3 voice samples

      addSample: (audioBuffer) => {
        this.enrolledVoices.set(speakerId, [
          ...(this.enrolledVoices.get(speakerId) || []),
          audioBuffer
        ]);
        speaker.enrollmentSamples = this.enrolledVoices.get(speakerId).length;
        speaker.isEnrolled = speaker.enrollmentSamples >= 3;
        return speaker.enrollmentSamples;
      },

      complete: () => {
        const samples = this.enrolledVoices.get(speakerId) || [];
        speaker.isEnrolled = samples.length >= 3;
        speaker.enrollmentSamples = samples.length;
        console.log(`[SpeakerProfile] Enrollment complete for ${speaker.label}: ${samples.length} samples`);
        return speaker.toJSON();
      }
    };
  }

  /**
   * Get enrollment status for a speaker
   */
  getEnrollmentStatus(speakerId) {
    const speaker = this.getSpeaker(speakerId);
    if (!speaker) return null;

    const samples = this.enrolledVoices.get(speakerId) || [];
    return {
      speakerId,
      label: speaker.label,
      isEnrolled: speaker.isEnrolled,
      sampleCount: samples.length,
      requiredSamples: 3
    };
  }

  /**
   * Check if all speakers are enrolled
   */
  isFullyEnrolled() {
    if (!this.currentSession) return false;
    return this.currentSession.speakers.every(s => s.isEnrolled);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GENESIS PROFILE LINKING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Link a speaker to a GENESIS profile
   */
  linkToProfile(speakerId, profileId) {
    const speaker = this.getSpeaker(speakerId);
    if (speaker) {
      speaker.profileId = profileId;
      console.log(`[SpeakerProfile] Linked ${speaker.label} to profile ${profileId}`);
    }
    return speaker;
  }

  /**
   * Unlink speaker from GENESIS profile
   */
  unlinkFromProfile(speakerId) {
    const speaker = this.getSpeaker(speakerId);
    if (speaker) {
      speaker.profileId = null;
    }
    return speaker;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STORAGE
  // ─────────────────────────────────────────────────────────────────────────────

  _loadFromStorage() {
    try {
      const saved = localStorage.getItem('genesis_diarization_sessions');
      if (saved) {
        const sessions = JSON.parse(saved);
        sessions.forEach(session => {
          this.savedSessions.set(session.id, session);
        });
        console.log(`[SpeakerProfile] Loaded ${sessions.length} saved sessions`);
      }
    } catch (error) {
      console.error('[SpeakerProfile] Failed to load from storage:', error);
    }
  }

  _saveToStorage() {
    try {
      const sessions = Array.from(this.savedSessions.values());
      localStorage.setItem('genesis_diarization_sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('[SpeakerProfile] Failed to save to storage:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get available session templates
   */
  getTemplates() {
    return SESSION_TEMPLATES;
  }

  /**
   * Get available colors
   */
  getColors() {
    return SPEAKER_COLORS;
  }

  /**
   * Format session for backend
   */
  formatForBackend() {
    if (!this.currentSession) return null;

    return {
      sessionId: this.currentSession.id,
      sessionType: this.currentSession.type,
      expectedSpeakers: this.currentSession.speakers.map(s => ({
        label: s.label,
        profileId: s.profileId,
        metadata: s.metadata
      })),
      maxSpeakers: Math.max(4, this.currentSession.speakers.length)
    };
  }
}

// Singleton instance
export const speakerProfileService = new SpeakerProfileService();

export default speakerProfileService;
