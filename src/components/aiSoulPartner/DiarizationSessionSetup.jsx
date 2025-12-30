/**
 * Diarization Session Setup
 * ==========================
 * UI for configuring multi-speaker voice sessions.
 * Allows users to select session type, add speakers, and begin recording.
 *
 * Session Types:
 * - Family Biography: Mom, Dad, Children, Grandparents
 * - Therapy: Therapist, Client, Support persons
 * - Facilitation: Facilitator, Participants
 * - Interview: Interviewer, Subject
 *
 * Part of GENESIS OS - Speaker Diarization Enhancement
 * Created: December 27, 2024
 */

import React, { useState, useCallback } from 'react';
import {
  speakerProfileService,
  SPEAKER_COLORS,
  SESSION_TEMPLATES
} from '../../services/speakerProfileService';

/**
 * Session Type Card
 */
function SessionTypeCard({ type, template, isSelected, onSelect }) {
  return (
    <div
      style={{
        ...styles.typeCard,
        ...(isSelected && styles.typeCardSelected)
      }}
      onClick={() => onSelect(type)}
    >
      <span style={styles.typeIcon}>{template.icon}</span>
      <div style={styles.typeInfo}>
        <span style={styles.typeName}>{template.name}</span>
        <span style={styles.typeDescription}>{template.description}</span>
      </div>
      {isSelected && (
        <span style={styles.checkmark}>✓</span>
      )}
    </div>
  );
}

/**
 * Speaker Row Component
 */
function SpeakerRow({ speaker, index, onUpdate, onRemove, availableProfiles = [] }) {
  const color = SPEAKER_COLORS[speaker.colorKey] || SPEAKER_COLORS.unknown;

  return (
    <div style={styles.speakerRow}>
      {/* Color indicator */}
      <div
        style={{
          ...styles.speakerColor,
          backgroundColor: color.primary
        }}
        title={color.name}
      />

      {/* Speaker label input */}
      <input
        style={styles.speakerInput}
        value={speaker.label}
        onChange={(e) => onUpdate(index, { label: e.target.value })}
        placeholder="Speaker name"
      />

      {/* Role selector */}
      <select
        style={styles.roleSelect}
        value={speaker.role || ''}
        onChange={(e) => onUpdate(index, { role: e.target.value })}
      >
        <option value="">Select role...</option>
        {SESSION_TEMPLATES[speakerProfileService.currentSession?.type || 'general'].roles.map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>

      {/* Link to profile */}
      {availableProfiles.length > 0 && (
        <select
          style={styles.profileSelect}
          value={speaker.profileId || ''}
          onChange={(e) => onUpdate(index, { profileId: e.target.value || null })}
        >
          <option value="">Link to profile...</option>
          {availableProfiles.map(profile => (
            <option key={profile.id} value={profile.id}>
              {profile.name || profile.displayName}
            </option>
          ))}
        </select>
      )}

      {/* Enrollment status */}
      <div style={styles.enrollmentBadge}>
        {speaker.isEnrolled ? (
          <span style={styles.enrolledBadge}>✓ Enrolled</span>
        ) : (
          <span style={styles.notEnrolledBadge}>○ Voice sample needed</span>
        )}
      </div>

      {/* Remove button */}
      <button
        style={styles.removeButton}
        onClick={() => onRemove(index)}
        title="Remove speaker"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Voice Enrollment Modal
 */
function VoiceEnrollmentModal({ speaker, onComplete, onClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const [sampleCount, setSampleCount] = useState(0);
  const [enrollmentHandler, setEnrollmentHandler] = useState(null);

  const startEnrollment = useCallback(async () => {
    const handler = await speakerProfileService.startEnrollment(speaker.id);
    setEnrollmentHandler(handler);
  }, [speaker.id]);

  // Initialize on mount
  React.useEffect(() => {
    startEnrollment();
  }, [startEnrollment]);

  const recordSample = async () => {
    setIsRecording(true);

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const buffer = await blob.arrayBuffer();

        if (enrollmentHandler) {
          const count = enrollmentHandler.addSample(buffer);
          setSampleCount(count);

          if (count >= 3) {
            const result = enrollmentHandler.complete();
            onComplete(result);
          }
        }

        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };

      mediaRecorder.start();

      // Record for 3 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 3000);

    } catch (error) {
      console.error('[VoiceEnrollment] Error:', error);
      setIsRecording(false);
    }
  };

  const color = SPEAKER_COLORS[speaker.colorKey] || SPEAKER_COLORS.unknown;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.enrollmentModal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span>Voice Enrollment: {speaker.label}</span>
          <button style={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div style={styles.enrollmentBody}>
          <div
            style={{
              ...styles.enrollmentSpeaker,
              borderColor: color.primary
            }}
          >
            <div
              style={{
                ...styles.enrollmentAvatar,
                backgroundColor: `${color.primary}30`
              }}
            >
              <span style={{ color: color.primary, fontSize: '24px' }}>
                {speaker.label.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <p style={styles.enrollmentInstructions}>
            Record 3 voice samples to help identify this speaker.
            Each sample should be 3 seconds of natural speech.
          </p>

          {/* Progress indicator */}
          <div style={styles.progressContainer}>
            {[1, 2, 3].map(num => (
              <div
                key={num}
                style={{
                  ...styles.progressDot,
                  backgroundColor: num <= sampleCount ? color.primary : 'rgba(100, 116, 139, 0.3)'
                }}
              />
            ))}
          </div>
          <span style={styles.progressText}>
            {sampleCount}/3 samples recorded
          </span>

          {/* Record button */}
          <button
            style={{
              ...styles.recordButton,
              ...(isRecording && styles.recordButtonActive)
            }}
            onClick={recordSample}
            disabled={isRecording || sampleCount >= 3}
          >
            {isRecording ? (
              <>
                <span style={styles.recordingIndicator} />
                Recording...
              </>
            ) : sampleCount >= 3 ? (
              '✓ Complete'
            ) : (
              <>🎤 Record Sample {sampleCount + 1}</>
            )}
          </button>

          {sampleCount >= 3 && (
            <p style={styles.completeText}>
              Voice enrollment complete! This speaker can now be identified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Diarization Session Setup Component
 */
export default function DiarizationSessionSetup({
  isOpen,
  onClose,
  onStartSession,
  availableProfiles = [] // GENESIS profiles to link speakers to
}) {
  const [sessionType, setSessionType] = useState('family');
  const [speakers, setSpeakers] = useState([]);
  const [enrollingSpeaker, setEnrollingSpeaker] = useState(null);
  const [step, setStep] = useState('type'); // 'type' | 'speakers' | 'enroll'

  // Initialize speakers when session type changes
  React.useEffect(() => {
    const session = speakerProfileService.createSession(sessionType);
    setSpeakers(session.speakers.map(s => s.toJSON()));
  }, [sessionType]);

  /**
   * Update a speaker
   */
  const handleUpdateSpeaker = (index, updates) => {
    const newSpeakers = [...speakers];
    newSpeakers[index] = { ...newSpeakers[index], ...updates };
    setSpeakers(newSpeakers);

    // Update in service
    speakerProfileService.updateSpeaker(speakers[index].id, updates);
  };

  /**
   * Remove a speaker
   */
  const handleRemoveSpeaker = (index) => {
    speakerProfileService.removeSpeaker(speakers[index].id);
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  /**
   * Add a speaker
   */
  const handleAddSpeaker = () => {
    const newSpeaker = speakerProfileService.addSpeaker({
      label: `Speaker ${speakers.length + 1}`,
      role: ''
    });
    setSpeakers([...speakers, newSpeaker.toJSON()]);
  };

  /**
   * Handle enrollment complete
   */
  const handleEnrollmentComplete = (result) => {
    setSpeakers(speakers.map(s =>
      s.id === result.id ? { ...s, isEnrolled: true, enrollmentSamples: result.enrollmentSamples } : s
    ));
    setEnrollingSpeaker(null);
  };

  /**
   * Start the session
   */
  const handleStartSession = () => {
    speakerProfileService.saveSession();
    const sessionConfig = speakerProfileService.formatForBackend();
    onStartSession?.(sessionConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.setupPanel}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <span style={styles.headerIcon}>👥</span>
            <div>
              <h2 style={styles.headerTitle}>Multi-Speaker Session</h2>
              <p style={styles.headerSubtitle}>
                Set up a group recording session with speaker identification
              </p>
            </div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        {/* Step indicator */}
        <div style={styles.stepIndicator}>
          <div style={{ ...styles.step, ...(step === 'type' && styles.stepActive) }}>
            <span style={styles.stepNumber}>1</span>
            <span>Session Type</span>
          </div>
          <div style={styles.stepDivider} />
          <div style={{ ...styles.step, ...(step === 'speakers' && styles.stepActive) }}>
            <span style={styles.stepNumber}>2</span>
            <span>Speakers</span>
          </div>
          <div style={styles.stepDivider} />
          <div style={{ ...styles.step, ...(step === 'enroll' && styles.stepActive) }}>
            <span style={styles.stepNumber}>3</span>
            <span>Voice Enrollment</span>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {step === 'type' && (
            <div style={styles.typeGrid}>
              {Object.entries(SESSION_TEMPLATES).map(([type, template]) => (
                <SessionTypeCard
                  key={type}
                  type={type}
                  template={template}
                  isSelected={sessionType === type}
                  onSelect={setSessionType}
                />
              ))}
            </div>
          )}

          {step === 'speakers' && (
            <div style={styles.speakersList}>
              <p style={styles.sectionDescription}>
                Add and configure the speakers who will participate in this session.
                You can link speakers to existing GENESIS profiles.
              </p>

              {speakers.map((speaker, index) => (
                <SpeakerRow
                  key={speaker.id}
                  speaker={speaker}
                  index={index}
                  onUpdate={handleUpdateSpeaker}
                  onRemove={handleRemoveSpeaker}
                  availableProfiles={availableProfiles}
                />
              ))}

              {speakers.length < 8 && (
                <button
                  style={styles.addSpeakerButton}
                  onClick={handleAddSpeaker}
                >
                  + Add Speaker
                </button>
              )}
            </div>
          )}

          {step === 'enroll' && (
            <div style={styles.enrollmentList}>
              <p style={styles.sectionDescription}>
                Record voice samples for each speaker to enable speaker identification.
                This step is optional but improves accuracy.
              </p>

              {speakers.map((speaker) => {
                const color = SPEAKER_COLORS[speaker.colorKey] || SPEAKER_COLORS.unknown;

                return (
                  <div key={speaker.id} style={styles.enrollmentRow}>
                    <div style={styles.enrollmentInfo}>
                      <div
                        style={{
                          ...styles.enrollmentDot,
                          backgroundColor: color.primary
                        }}
                      />
                      <span style={styles.enrollmentName}>{speaker.label}</span>
                      {speaker.isEnrolled ? (
                        <span style={styles.enrolledBadge}>✓ Enrolled</span>
                      ) : (
                        <span style={styles.notEnrolledBadge}>Not enrolled</span>
                      )}
                    </div>
                    <button
                      style={{
                        ...styles.enrollButton,
                        ...(speaker.isEnrolled && styles.enrollButtonComplete)
                      }}
                      onClick={() => setEnrollingSpeaker(speaker)}
                      disabled={speaker.isEnrolled}
                    >
                      {speaker.isEnrolled ? 'Complete' : '🎤 Enroll Voice'}
                    </button>
                  </div>
                );
              })}

              <p style={styles.skipNote}>
                You can skip enrollment and start the session - speaker labels will be
                assigned automatically based on voice patterns.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          {step !== 'type' && (
            <button
              style={styles.backButton}
              onClick={() => setStep(step === 'enroll' ? 'speakers' : 'type')}
            >
              ← Back
            </button>
          )}

          <div style={styles.footerRight}>
            <button style={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>

            {step === 'type' && (
              <button
                style={styles.nextButton}
                onClick={() => setStep('speakers')}
              >
                Next: Configure Speakers →
              </button>
            )}

            {step === 'speakers' && (
              <button
                style={styles.nextButton}
                onClick={() => setStep('enroll')}
                disabled={speakers.length < 2}
              >
                Next: Voice Enrollment →
              </button>
            )}

            {step === 'enroll' && (
              <button
                style={styles.startButton}
                onClick={handleStartSession}
              >
                🎙️ Start Session
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Voice Enrollment Modal */}
      {enrollingSpeaker && (
        <VoiceEnrollmentModal
          speaker={enrollingSpeaker}
          onComplete={handleEnrollmentComplete}
          onClose={() => setEnrollingSpeaker(null)}
        />
      )}
    </div>
  );
}

/**
 * Styles
 */
const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },

  setupPanel: {
    width: '680px',
    maxHeight: '90vh',
    backgroundColor: 'rgba(17, 17, 27, 0.98)',
    borderRadius: '16px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)'
  },

  headerContent: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },

  headerIcon: {
    fontSize: '32px'
  },

  headerTitle: {
    margin: 0,
    color: '#e2e8f0',
    fontSize: '18px',
    fontWeight: '600'
  },

  headerSubtitle: {
    margin: '4px 0 0',
    color: '#94a3b8',
    fontSize: '13px'
  },

  closeButton: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px'
  },

  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
    backgroundColor: 'rgba(30, 30, 46, 0.5)'
  },

  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    fontSize: '12px',
    transition: 'all 0.2s'
  },

  stepActive: {
    color: '#a5b4fc'
  },

  stepNumber: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '600'
  },

  stepDivider: {
    width: '40px',
    height: '1px',
    backgroundColor: 'rgba(100, 116, 139, 0.3)'
  },

  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px'
  },

  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },

  typeCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(100, 116, 139, 0.2)',
    backgroundColor: 'rgba(30, 30, 46, 0.5)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative'
  },

  typeCardSelected: {
    borderColor: 'rgba(139, 92, 246, 0.5)',
    backgroundColor: 'rgba(139, 92, 246, 0.1)'
  },

  typeIcon: {
    fontSize: '28px'
  },

  typeInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },

  typeName: {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '600'
  },

  typeDescription: {
    color: '#94a3b8',
    fontSize: '12px',
    lineHeight: '1.4'
  },

  checkmark: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    color: '#a5b4fc',
    fontSize: '14px',
    fontWeight: '600'
  },

  sectionDescription: {
    color: '#94a3b8',
    fontSize: '13px',
    marginBottom: '20px',
    lineHeight: '1.5'
  },

  speakersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  speakerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '10px',
    backgroundColor: 'rgba(30, 30, 46, 0.5)',
    border: '1px solid rgba(100, 116, 139, 0.2)'
  },

  speakerColor: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    flexShrink: 0
  },

  speakerInput: {
    flex: 1,
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(17, 17, 27, 0.6)',
    color: '#e2e8f0',
    fontSize: '13px',
    outline: 'none',
    minWidth: '120px'
  },

  roleSelect: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(17, 17, 27, 0.6)',
    color: '#94a3b8',
    fontSize: '12px',
    cursor: 'pointer',
    minWidth: '100px'
  },

  profileSelect: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(17, 17, 27, 0.6)',
    color: '#94a3b8',
    fontSize: '12px',
    cursor: 'pointer',
    minWidth: '120px'
  },

  enrollmentBadge: {
    flexShrink: 0
  },

  enrolledBadge: {
    fontSize: '10px',
    color: '#22c55e',
    padding: '3px 8px',
    borderRadius: '10px',
    backgroundColor: 'rgba(34, 197, 94, 0.1)'
  },

  notEnrolledBadge: {
    fontSize: '10px',
    color: '#f59e0b',
    padding: '3px 8px',
    borderRadius: '10px',
    backgroundColor: 'rgba(245, 158, 11, 0.1)'
  },

  removeButton: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    fontSize: '12px',
    cursor: 'pointer',
    flexShrink: 0
  },

  addSpeakerButton: {
    padding: '12px',
    borderRadius: '10px',
    border: '1px dashed rgba(139, 92, 246, 0.3)',
    backgroundColor: 'transparent',
    color: '#a5b4fc',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  enrollmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  enrollmentRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderRadius: '10px',
    backgroundColor: 'rgba(30, 30, 46, 0.5)',
    border: '1px solid rgba(100, 116, 139, 0.2)'
  },

  enrollmentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  enrollmentDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },

  enrollmentName: {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500'
  },

  enrollButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    color: '#a5b4fc',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },

  enrollButtonComplete: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#22c55e',
    cursor: 'default'
  },

  skipNote: {
    color: '#64748b',
    fontSize: '12px',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    borderRadius: '8px'
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(30, 30, 46, 0.5)'
  },

  footerRight: {
    display: 'flex',
    gap: '12px'
  },

  backButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer'
  },

  cancelButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    fontSize: '13px',
    cursor: 'pointer'
  },

  nextButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer'
  },

  startButton: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
  },

  // Enrollment modal styles
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100
  },

  enrollmentModal: {
    width: '400px',
    backgroundColor: 'rgba(17, 17, 27, 0.98)',
    borderRadius: '16px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    overflow: 'hidden'
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    color: '#e2e8f0',
    fontSize: '15px',
    fontWeight: '600'
  },

  modalClose: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '18px',
    cursor: 'pointer'
  },

  enrollmentBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },

  enrollmentSpeaker: {
    padding: '4px',
    borderRadius: '50%',
    border: '3px solid'
  },

  enrollmentAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  enrollmentInstructions: {
    color: '#94a3b8',
    fontSize: '13px',
    textAlign: 'center',
    lineHeight: '1.5',
    maxWidth: '300px'
  },

  progressContainer: {
    display: 'flex',
    gap: '10px'
  },

  progressDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    transition: 'all 0.3s'
  },

  progressText: {
    color: '#64748b',
    fontSize: '12px'
  },

  recordButton: {
    padding: '14px 28px',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },

  recordButtonActive: {
    backgroundColor: '#ef4444',
    animation: 'pulse 1s infinite'
  },

  recordingIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    animation: 'pulse 0.8s infinite'
  },

  completeText: {
    color: '#22c55e',
    fontSize: '13px',
    textAlign: 'center'
  }
};

export { DiarizationSessionSetup };
