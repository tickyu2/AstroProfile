/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SPEAKER DIARIZATION SERVICE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Identifies and separates different speakers in audio for group sessions.
 *
 * USE CASES:
 * - Family biography collaboration (Mom, Dad, siblings)
 * - Therapeutic sessions (Therapist, Client)
 * - Group facilitation (Facilitator, Participants)
 *
 * FEATURES:
 * - Speaker enrollment with voice samples
 * - Real-time speaker identification
 * - Unknown speaker detection
 * - Speaker transition tracking
 *
 * PROVIDERS:
 * - AssemblyAI (primary - excellent diarization)
 * - Whisper + pyannote (fallback - open source)
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode Enhancement
 */

// Speaker colors for UI (consistent assignment)
export const SPEAKER_COLORS = {
  speaker_0: { primary: '#3B82F6', name: 'Blue' },    // Blue
  speaker_1: { primary: '#10B981', name: 'Green' },   // Green
  speaker_2: { primary: '#F59E0B', name: 'Amber' },   // Amber
  speaker_3: { primary: '#EF4444', name: 'Red' },     // Red
  speaker_4: { primary: '#8B5CF6', name: 'Purple' },  // Purple
  speaker_5: { primary: '#EC4899', name: 'Pink' },    // Pink
  speaker_6: { primary: '#14B8A6', name: 'Teal' },    // Teal
  speaker_7: { primary: '#F97316', name: 'Orange' },  // Orange
  unknown: { primary: '#6B7280', name: 'Gray' }       // Unknown
};

// Default speaker labels (can be customized)
export const DEFAULT_SPEAKER_LABELS = {
  family: ['Mom', 'Dad', 'Child 1', 'Child 2', 'Grandparent', 'Sibling'],
  therapy: ['Therapist', 'Client', 'Partner', 'Family Member'],
  facilitation: ['Facilitator', 'Participant 1', 'Participant 2', 'Observer'],
  interview: ['Interviewer', 'Interviewee', 'Translator'],
  general: ['Speaker A', 'Speaker B', 'Speaker C', 'Speaker D']
};

/**
 * Speaker Profile - represents an enrolled speaker
 */
export class SpeakerProfile {
  constructor({
    id,
    label,
    profileId,         // GENESIS profile ID (if linked)
    voiceEmbedding,    // Voice signature for identification
    samples = [],      // Audio samples for enrollment
    color,
    createdAt = Date.now(),
    metadata = {}
  }) {
    this.id = id || `speaker_${Date.now()}`;
    this.label = label || 'Unknown Speaker';
    this.profileId = profileId;
    this.voiceEmbedding = voiceEmbedding;
    this.samples = samples;
    this.color = color || SPEAKER_COLORS.unknown;
    this.createdAt = createdAt;
    this.metadata = metadata;
  }

  toJSON() {
    return {
      id: this.id,
      label: this.label,
      profileId: this.profileId,
      color: this.color,
      createdAt: this.createdAt,
      metadata: this.metadata,
      sampleCount: this.samples.length
    };
  }
}

/**
 * Diarized Segment - a portion of audio attributed to a speaker
 */
export class DiarizedSegment {
  constructor({
    speakerId,
    speakerLabel,
    text,
    startTime,
    endTime,
    confidence = 1.0,
    color
  }) {
    this.speakerId = speakerId;
    this.speakerLabel = speakerLabel;
    this.text = text;
    this.startTime = startTime;
    this.endTime = endTime;
    this.confidence = confidence;
    this.color = color || SPEAKER_COLORS[speakerId] || SPEAKER_COLORS.unknown;
    this.duration = endTime - startTime;
  }
}

/**
 * Speaker Diarization Service
 */
class SpeakerDiarizationService {
  constructor() {
    // Enrolled speakers for the current session
    this.enrolledSpeakers = new Map();

    // Active session state
    this.sessionId = null;
    this.sessionType = 'general'; // family, therapy, facilitation, etc.

    // Diarization results
    this.segments = [];
    this.speakerStats = {};

    // Provider configuration
    this.provider = process.env.DIARIZATION_PROVIDER || 'assemblyai';
    this.apiKey = process.env.ASSEMBLYAI_API_KEY;

    // Callbacks
    this.onSpeakerChange = null;
    this.onSegment = null;
  }

  /**
   * Initialize the diarization service
   */
  async initialize() {
    console.log(`[SpeakerDiarization] Initializing with provider: ${this.provider}`);

    if (this.provider === 'assemblyai' && !this.apiKey) {
      console.warn('[SpeakerDiarization] AssemblyAI API key not set, diarization disabled');
      return false;
    }

    return true;
  }

  /**
   * Start a diarization session
   * @param {Object} config - Session configuration
   */
  async startSession({
    sessionId,
    sessionType = 'general',
    expectedSpeakers = [],
    maxSpeakers = 4
  }) {
    this.sessionId = sessionId;
    this.sessionType = sessionType;
    this.segments = [];
    this.speakerStats = {};
    this.enrolledSpeakers.clear();

    // Pre-enroll expected speakers
    expectedSpeakers.forEach((speaker, index) => {
      const profile = new SpeakerProfile({
        id: `speaker_${index}`,
        label: speaker.label || DEFAULT_SPEAKER_LABELS[sessionType]?.[index] || `Speaker ${index + 1}`,
        profileId: speaker.profileId,
        color: SPEAKER_COLORS[`speaker_${index}`],
        metadata: speaker.metadata
      });
      this.enrolledSpeakers.set(profile.id, profile);
    });

    console.log(`[SpeakerDiarization] Session started: ${sessionId} (${sessionType})`);
    console.log(`[SpeakerDiarization] Expected speakers: ${this.enrolledSpeakers.size}`);

    return {
      sessionId: this.sessionId,
      speakers: Array.from(this.enrolledSpeakers.values()).map(s => s.toJSON())
    };
  }

  /**
   * Enroll a speaker with a voice sample
   * @param {string} label - Speaker label/name
   * @param {Buffer} audioSample - Audio sample for voice enrollment
   * @param {Object} metadata - Additional speaker metadata
   */
  async enrollSpeaker(label, audioSample, metadata = {}) {
    const speakerId = `speaker_${this.enrolledSpeakers.size}`;

    // In production, compute voice embedding from sample
    // For now, create profile without embedding
    const profile = new SpeakerProfile({
      id: speakerId,
      label,
      color: SPEAKER_COLORS[speakerId] || SPEAKER_COLORS.unknown,
      samples: [audioSample],
      metadata
    });

    // TODO: Compute voice embedding using pyannote or similar
    // profile.voiceEmbedding = await this._computeEmbedding(audioSample);

    this.enrolledSpeakers.set(speakerId, profile);
    console.log(`[SpeakerDiarization] Enrolled speaker: ${label} (${speakerId})`);

    return profile.toJSON();
  }

  /**
   * Update speaker label
   * @param {string} speakerId - Speaker ID
   * @param {string} newLabel - New label
   */
  updateSpeakerLabel(speakerId, newLabel) {
    const speaker = this.enrolledSpeakers.get(speakerId);
    if (speaker) {
      speaker.label = newLabel;
      console.log(`[SpeakerDiarization] Updated label: ${speakerId} → ${newLabel}`);
      return speaker.toJSON();
    }
    return null;
  }

  /**
   * Process audio for diarization
   * @param {Buffer|string} audio - Audio buffer or file path
   * @param {Object} options - Processing options
   */
  async processAudio(audio, options = {}) {
    if (this.provider === 'assemblyai') {
      return this._processWithAssemblyAI(audio, options);
    } else {
      return this._processWithWhisper(audio, options);
    }
  }

  /**
   * Process audio with AssemblyAI
   * @private
   */
  async _processWithAssemblyAI(audio, options = {}) {
    if (!this.apiKey) {
      console.warn('[SpeakerDiarization] AssemblyAI not configured');
      return this._fallbackDiarization(audio, options);
    }

    try {
      // Upload audio to AssemblyAI
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'authorization': this.apiKey,
          'content-type': 'application/octet-stream'
        },
        body: audio
      });

      const { upload_url } = await uploadResponse.json();

      // Request transcription with speaker diarization
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'authorization': this.apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: upload_url,
          speaker_labels: true,
          speakers_expected: this.enrolledSpeakers.size || options.maxSpeakers || 4
        })
      });

      const transcript = await transcriptResponse.json();

      // Poll for completion
      const result = await this._pollForCompletion(transcript.id);

      // Process diarization results
      return this._processAssemblyAIResult(result);

    } catch (error) {
      console.error('[SpeakerDiarization] AssemblyAI error:', error);
      return this._fallbackDiarization(audio, options);
    }
  }

  /**
   * Poll AssemblyAI for completion
   * @private
   */
  async _pollForCompletion(transcriptId) {
    const pollInterval = 1000; // 1 second
    const maxAttempts = 120; // 2 minutes max

    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { 'authorization': this.apiKey }
      });

      const result = await response.json();

      if (result.status === 'completed') {
        return result;
      } else if (result.status === 'error') {
        throw new Error(result.error);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Diarization timeout');
  }

  /**
   * Process AssemblyAI diarization result
   * @private
   */
  _processAssemblyAIResult(result) {
    const segments = [];
    const speakerMapping = new Map();
    let lastSpeaker = null;

    // Process utterances with speaker labels
    if (result.utterances) {
      for (const utterance of result.utterances) {
        const speakerId = utterance.speaker;

        // Map AssemblyAI speaker to our speaker profile
        if (!speakerMapping.has(speakerId)) {
          const index = speakerMapping.size;
          const enrolledSpeaker = this.enrolledSpeakers.get(`speaker_${index}`);
          speakerMapping.set(speakerId, enrolledSpeaker || {
            id: `speaker_${index}`,
            label: `Speaker ${String.fromCharCode(65 + index)}`, // A, B, C...
            color: SPEAKER_COLORS[`speaker_${index}`] || SPEAKER_COLORS.unknown
          });
        }

        const mappedSpeaker = speakerMapping.get(speakerId);

        const segment = new DiarizedSegment({
          speakerId: mappedSpeaker.id,
          speakerLabel: mappedSpeaker.label,
          text: utterance.text,
          startTime: utterance.start,
          endTime: utterance.end,
          confidence: utterance.confidence,
          color: mappedSpeaker.color
        });

        segments.push(segment);

        // Track speaker changes
        if (lastSpeaker !== speakerId) {
          lastSpeaker = speakerId;
          this.onSpeakerChange?.(mappedSpeaker);
        }

        // Update speaker stats
        this._updateSpeakerStats(mappedSpeaker.id, segment);

        // Emit segment
        this.onSegment?.(segment);
      }
    }

    this.segments = segments;
    return {
      segments,
      speakers: Array.from(speakerMapping.values()),
      stats: this.speakerStats,
      fullText: result.text
    };
  }

  /**
   * Fallback: Process with Whisper (no diarization, single speaker)
   * @private
   */
  _processWithWhisper(audio, options = {}) {
    // This would use Groq Whisper without diarization
    // Return single-speaker result
    return {
      segments: [],
      speakers: [{ id: 'speaker_0', label: 'Speaker', color: SPEAKER_COLORS.speaker_0 }],
      stats: {},
      note: 'Diarization not available, using single speaker mode'
    };
  }

  /**
   * Fallback diarization (when provider fails)
   * @private
   */
  _fallbackDiarization(audio, options = {}) {
    console.warn('[SpeakerDiarization] Using fallback (no diarization)');
    return this._processWithWhisper(audio, options);
  }

  /**
   * Update speaker statistics
   * @private
   */
  _updateSpeakerStats(speakerId, segment) {
    if (!this.speakerStats[speakerId]) {
      this.speakerStats[speakerId] = {
        totalDuration: 0,
        segmentCount: 0,
        wordCount: 0,
        avgConfidence: 0
      };
    }

    const stats = this.speakerStats[speakerId];
    stats.totalDuration += segment.duration;
    stats.segmentCount += 1;
    stats.wordCount += segment.text.split(/\s+/).length;
    stats.avgConfidence = (stats.avgConfidence * (stats.segmentCount - 1) + segment.confidence) / stats.segmentCount;
  }

  /**
   * Get speaker statistics for the session
   */
  getSpeakerStats() {
    const totalDuration = Object.values(this.speakerStats).reduce((sum, s) => sum + s.totalDuration, 0);

    return Object.entries(this.speakerStats).map(([speakerId, stats]) => {
      const speaker = this.enrolledSpeakers.get(speakerId);
      return {
        speakerId,
        label: speaker?.label || speakerId,
        color: speaker?.color || SPEAKER_COLORS.unknown,
        ...stats,
        percentageOfTime: totalDuration > 0 ? (stats.totalDuration / totalDuration * 100).toFixed(1) : 0
      };
    });
  }

  /**
   * Get timeline of speaker segments
   */
  getTimeline() {
    return this.segments.map(segment => ({
      speakerId: segment.speakerId,
      speakerLabel: segment.speakerLabel,
      color: segment.color,
      startTime: segment.startTime,
      endTime: segment.endTime,
      duration: segment.duration,
      text: segment.text.substring(0, 50) + (segment.text.length > 50 ? '...' : '')
    }));
  }

  /**
   * End the diarization session
   */
  endSession() {
    const result = {
      sessionId: this.sessionId,
      segments: this.segments,
      speakers: Array.from(this.enrolledSpeakers.values()).map(s => s.toJSON()),
      stats: this.getSpeakerStats(),
      timeline: this.getTimeline()
    };

    console.log(`[SpeakerDiarization] Session ended: ${this.segments.length} segments from ${this.enrolledSpeakers.size} speakers`);

    // Reset session state
    this.sessionId = null;
    this.segments = [];
    this.speakerStats = {};

    return result;
  }

  /**
   * Register callback for speaker changes
   * @param {Function} callback - (speaker) => void
   */
  onSpeakerChangeCallback(callback) {
    this.onSpeakerChange = callback;
  }

  /**
   * Register callback for new segments
   * @param {Function} callback - (segment) => void
   */
  onSegmentCallback(callback) {
    this.onSegment = callback;
  }
}

// Singleton instance
export const speakerDiarization = new SpeakerDiarizationService();

export default speakerDiarization;
