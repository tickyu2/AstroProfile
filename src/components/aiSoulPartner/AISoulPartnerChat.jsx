/**
 * AISoulPartnerChat.jsx
 * Main AI SoulPartner Chat Component
 *
 * Integrates Constitutional Intelligence with chat UI.
 * The AI knows when to WITNESS, DIALOGUE, or GUIDE.
 * Now connected to Claude API via Firebase Cloud Function!
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 13, 2024
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConstitutionalIntelligence } from '../../hooks/useConstitutionalIntelligence';
import { useKnowledgeBase } from '../../contexts/KnowledgeBaseContext';
import { useConversations } from '../../contexts/ConversationsContext';
import { ModeIndicator } from './ModeIndicator';
import { SoulBurdenMeter } from './SoulBurdenMeter';
import { EmotionDisplay } from './EmotionDisplay';
import { EmojiReactionPicker, ReactionDisplay, CONSTITUTIONAL_EMOJIS, QUICK_EMOJIS } from './EmojiReactionPicker';
import { sendMessage as sendToAI, getSecondOpinion, getGrokPerspective, getOpusPerspective, getDeepSeekPerspective, getChatGPTPerspective, generateDebateVisual, generateStabilityImage, generateLeonardoImage } from '../../services/aiSoulPartnerService';

// Session Intelligence Services (Brunelleschi's Crane)
import { patternExtraction } from '../../services/patternExtractionService';

// Firebase Functions for session cleanup
import { getFunctions, httpsCallable } from 'firebase/functions';
import { contextBuilder } from '../../services/contextBuilder';
import { proactiveIntelligence } from '../../services/proactiveIntelligence';

// Timeline Service (for saving conversations to timeline)
import { timelineService } from '../../services/timelineService';

// Biography Service (intelligent life event extraction)
import { biographyService } from '../../services/biographyService';

// Constitutional Threading System (Phase 2)
import { ThreadBranchButton, ThreadPanel, ThreadView } from '../Threading';
import { useThreading, THREAD_TYPES } from '../../hooks/useThreading';

// Luna Voice Integration
import { VoiceControlPanel, MessageSpeakButton } from '../voice';
import { useVoice } from '../../hooks/useVoice';
import { useRealtimeVoice, VOICE_STRATEGIES } from '../../hooks/useRealtimeVoice';
import VoiceTranscriptPanel from './VoiceTranscriptPanel';
import VoiceSettingsPanel from './VoiceSettingsPanel';

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES = {
  WITNESS: [
    "I hear you, Father. That sounds really challenging. 💙",
    "I see that. What you're feeling makes complete sense.",
    "That's a lot to carry. I'm here with you.",
    "I understand. Take your time - there's no rush.",
    "I hear the weight in your words. You don't have to solve this alone."
  ],
  DIALOGUE: [
    "That's an interesting thought. What possibilities are you seeing?",
    "I'm curious about that too. What draws you to this direction?",
    "What would that look like for you?",
    "I wonder... how does that connect to what matters most to you?",
    "Let's explore that together. Where does your intuition point?"
  ],
  GUIDANCE: [
    "Let me help structure that. Here's one approach we could take...",
    "Breaking this down, the key factors are...",
    "Here's a framework that might help...",
    "Let's map this out. First, we could...",
    "Good question. The path forward has a few clear steps..."
  ]
};

function getFallbackResponse(mode) {
  const responses = FALLBACK_RESPONSES[mode] || FALLBACK_RESPONSES.DIALOGUE;
  return responses[Math.floor(Math.random() * responses.length)];
}

export function AISoulPartnerChat({ userProfile, onMessageSend }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get conversations from Firestore context
  const {
    conversations,
    activeConversation,
    activeConversationId,
    messages,
    loading: conversationsLoading,
    createConversation,
    updateMessages,
    renameConversation,
    deleteConversation,
    clearConversation,
    switchConversation,
    toggleMessageReaction,
    toggleMessageStar,
    getStarredMessages,
    searchConversations
  } = useConversations();

  // Initialize with prefillMessage if coming from Timeline Neural Pathways
  const [inputValue, setInputValue] = useState(location.state?.prefillMessage || '');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showConversations, setShowConversations] = useState(false); // Conversations panel
  const [showStarredOnly, setShowStarredOnly] = useState(false); // Filter starred messages
  const [showThreadsPanel, setShowThreadsPanel] = useState(false); // Threads quick-access panel
  const [showProfileKBPanel, setShowProfileKBPanel] = useState(false); // Profile KB access panel
  const [conversationSearchQuery, setConversationSearchQuery] = useState(''); // Search query for conversations
  const [searchResults, setSearchResults] = useState([]); // Search results across conversations
  const [editingTitle, setEditingTitle] = useState(null); // Conversation ID being renamed
  const [apiStatus, setApiStatus] = useState('unknown'); // 'unknown', 'connected', 'fallback'
  const [attachedFiles, setAttachedFiles] = useState([]); // Array of { name, content, size }
  const [attachedImages, setAttachedImages] = useState([]); // Array of { dataUrl, name, size, type }

  // Image attachment limits
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
  const MAX_TOTAL_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB total for all images
  const MAX_IMAGES = 5; // Maximum 5 images at once
  const [selectedText, setSelectedText] = useState(''); // Text selected in messages
  const [showKBPicker, setShowKBPicker] = useState(false); // KB document picker dropdown
  const [selectedKBDoc, setSelectedKBDoc] = useState(null); // Currently selected KB document for context
  const [kbSearchQuery, setKBSearchQuery] = useState(''); // Search query for KB picker
  const [kbPreviewDoc, setKBPreviewDoc] = useState(null); // KB doc being previewed/edited
  const [kbPreviewContent, setKBPreviewContent] = useState(''); // Editable content for preview
  const [showKBUpdateModal, setShowKBUpdateModal] = useState(false); // KB update preview modal
  const [kbUpdateContent, setKBUpdateContent] = useState(''); // Generated KB update content
  const [kbUpdateTitle, setKBUpdateTitle] = useState(''); // Title for KB update
  const [isGeneratingKBUpdate, setIsGeneratingKBUpdate] = useState(false); // Loading state for KB generation
  const [kbUpdateSourceDoc, setKBUpdateSourceDoc] = useState(null); // The original doc being updated (if any)
  const [copyPopupMessageId, setCopyPopupMessageId] = useState(null); // Message ID with copy popup open
  const [currentNavIndex, setCurrentNavIndex] = useState(-1); // Current message navigation index
  const [proactiveGreeting, setProactiveGreeting] = useState(null); // Session Intelligence greeting
  const [relationshipSummary, setRelationshipSummary] = useState(null); // Relationship depth from learned patterns
  const [learnedContext, setLearnedContext] = useState(null); // Cached learned context for system prompt
  const [generatedImagesCache, setGeneratedImagesCache] = useState({}); // Nano Banana images by message ID (session only)
  const [showInputEmojiPicker, setShowInputEmojiPicker] = useState(false); // Emoji picker for message input
  const [inputEmojiCategory, setInputEmojiCategory] = useState('universal'); // Active emoji category
  const [pendingReactionSignal, setPendingReactionSignal] = useState(null); // { emoji, messagePreview, wasAdded }
  // AI Constellation - Second Opinion / Debate
  const [secondOpinions, setSecondOpinions] = useState({}); // { messageId: { text, speaker, loading } }
  const secondOpinionsRef = useRef({}); // Ref to track latest state for async callbacks
  const [debateMode, setDebateMode] = useState(false); // Global debate mode toggle
  const [activeDebate, setActiveDebate] = useState(null); // { messageId, exchanges: [{ speaker, text }] }
  const [loadingSecondOpinion, setLoadingSecondOpinion] = useState(null); // messageId currently loading
  const [secondOpinionInput, setSecondOpinionInput] = useState(null); // { messageId, question } - shows input for custom question
  const [secondOpinionQuestion, setSecondOpinionQuestion] = useState(''); // Current question being typed
  const [debateUserInput, setDebateUserInput] = useState(''); // User's guidance/comment in the debate
  const [debateAttachedImages, setDebateAttachedImages] = useState([]); // Images attached in debate panel [{data, mimeType, preview}]
  const [secondOpinionReply, setSecondOpinionReply] = useState(null); // { messageId, text } - reply input for second opinion
  const [secondOpinionConversation, setSecondOpinionConversation] = useState({}); // { messageId: [{ speaker, text }] } - conversation history with Gemini
  // Baby Nano - Debate Visualization
  const [debateVisuals, setDebateVisuals] = useState({}); // { messageId: { image, visualType, ... } }
  const [loadingDebateVisual, setLoadingDebateVisual] = useState(null); // messageId currently generating visual
  // Luna Voice Integration (via useVoice hook for TTS)
  const {
    isVoiceEnabled,
    setIsVoiceEnabled,
    speak: speakWithTTS,
    stop: stopTTS,
    isPlaying: isTTSPlaying,
    constitution: userConstitution
  } = useVoice({ userProfile });

  // Barge-in state (must be declared before useRealtimeVoice)
  const [bargeInEnabled, setBargeInEnabled] = useState(true); // Auto-interrupt when user speaks

  // Realtime Voice Integration (via useRealtimeVoice hook for STT/streaming)
  const {
    isConnected: isVoiceConnected,
    isSessionActive: isVoiceSessionActive,
    isRecording,
    isListening: isVoiceListening,
    isSpeaking: isUserSpeaking,
    isLunaSpeaking,
    startSession: startVoiceSession,
    stopSession: stopVoiceSession,
    startRecording,
    stopRecording,
    toggleRecording,
    commit: commitVoiceInput,
    provider: voiceProvider,
    supportsCues: voiceSupportsCues,
    strategy: voiceStrategy,
    setStrategy: setVoiceStrategy,
    userTranscripts: realtimeUserTranscripts,
    lunaTranscripts: realtimeLunaTranscripts,
    cues: voiceCues,
    error: voiceError,
    clearError: clearVoiceError
  } = useRealtimeVoice({
    profileId: userProfile?.id,
    strategy: VOICE_STRATEGIES.GROQ_ONLY,
    bargeInEnabled, // Enable barge-in detection
    onTranscript: (transcript) => {
      console.log('[Voice] Transcript:', transcript);
      // Add to local transcripts for the panel
      if (transcript.speaker === 'user') {
        setUserVoiceTranscripts(prev => [...prev, transcript]);
      } else {
        setLunaVoiceTranscripts(prev => [...prev, transcript]);
      }
    },
    onCue: (cue) => {
      console.log('[Voice] Cue detected:', cue);
    },
    onError: (err) => {
      console.error('[Voice] Error:', err);
    },
    // TTS FOR GROQ PATH: Speak Luna's response using TTS when not using OpenAI native voice
    onLunaResponse: (text) => {
      if (isVoiceEnabled && text) {
        console.log('[Voice] TTS for Groq path - speaking Luna response');
        speakWithTTS(text);
      }
    },
    // BARGE-IN: Callback when user interrupts Luna
    onBargeIn: () => {
      console.log('[Voice] User barged in - interrupted Luna');
      // Also stop TTS if playing
      if (isTTSPlaying) {
        stopTTS();
      }
    }
  });

  // Voice Transcript Panel State
  const [showVoiceTranscript, setShowVoiceTranscript] = useState(false);
  const [voiceSessionId, setVoiceSessionId] = useState(null);
  const [userVoiceTranscripts, setUserVoiceTranscripts] = useState([]);
  const [lunaVoiceTranscripts, setLunaVoiceTranscripts] = useState([]);

  // Voice Settings State
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showEmotionalCues, setShowEmotionalCues] = useState(true);
  // bargeInEnabled state is declared earlier (before useRealtimeVoice hook)

  // Computed voice provider status for UI
  const voiceProviderStatus = useMemo(() => ({
    provider: voiceProvider || 'groq_whisper',
    isConnected: isVoiceConnected,
    supportsCues: voiceSupportsCues
  }), [voiceProvider, isVoiceConnected, voiceSupportsCues]);

  const messagesEndRef = useRef(null);
  const previousConversationRef = useRef(null); // Track previous conversation for pattern extraction
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null); // For image file picker
  const messagesContainerRef = useRef(null);
  const messageRefs = useRef({}); // Refs for each message element

  // Initialize constitutional intelligence
  const {
    analyzeMessage,
    getResponseGuidance,
    currentState
  } = useConstitutionalIntelligence(userProfile);

  // Get knowledge base for context
  const { documents: kbDocuments, buildKnowledgePrompt, getStats, createDocument, updateDocument } = useKnowledgeBase();
  const kbStats = getStats();

  // Compute profile-specific KB documents
  const profileKBDocs = useMemo(() => {
    if (!userProfile?.id || !kbDocuments) return { profileDocs: [], globalDocs: [], totalDocs: 0 };

    // Profile-specific docs (blueprints for this profile)
    const profileDocs = kbDocuments.filter(d => d.profileId === userProfile.id);

    // Global docs (GENESIS, Technical, Reference - no profileId or always include)
    const globalDocs = kbDocuments.filter(d =>
      !d.profileId && d.alwaysInclude
    );

    // All docs this profile will have access to in conversations
    const accessibleDocs = kbDocuments.filter(d =>
      d.alwaysInclude || d.profileId === userProfile.id
    );

    return {
      profileDocs,
      globalDocs,
      accessibleDocs,
      totalDocs: accessibleDocs.length,
      profileName: userProfile.displayName || userProfile.firstName || 'Profile'
    };
  }, [userProfile?.id, userProfile?.displayName, userProfile?.firstName, kbDocuments]);

  // ========== CONSTITUTIONAL THREADING (Phase 2) ==========
  const {
    threads,
    currentThreadId,
    currentThread,
    currentThreadType,
    currentThreadMessages,
    threadsByType,
    isInThread,
    createThread,
    addMessageToThread,
    switchToThread,
    returnToMain,
    deleteThread,
    renameThread,
    toggleThreadMessageReaction,
    detectThreadEnergy
  } = useThreading(activeConversationId, userProfile?.userId);

  // ========== SESSION INTELLIGENCE (Brunelleschi's Crane) ==========

  // Fetch proactive greeting and relationship summary on mount/user change
  useEffect(() => {
    const initializeSessionIntelligence = async () => {
      if (!userProfile?.userId) return;

      try {
        // Get proactive greeting based on learned patterns
        const greeting = await proactiveIntelligence.getReturnGreeting(
          userProfile.userId,
          { soulBurden: currentState.soulBurden }
        );

        if (greeting) {
          setProactiveGreeting(greeting);
          console.log('🎭 Proactive greeting:', greeting.text);
        }

        // Get relationship summary for UI
        const summary = await contextBuilder.getRelationshipSummary(userProfile.userId);
        setRelationshipSummary(summary);
        console.log('💫 Relationship depth:', summary.level, `(${summary.conversations} convos)`);

      } catch (error) {
        console.error('Session Intelligence init error:', error);
      }
    };

    initializeSessionIntelligence();
  }, [userProfile?.userId]);

  // Keep secondOpinionsRef in sync for async callbacks (avoid stale closures)
  useEffect(() => {
    secondOpinionsRef.current = secondOpinions;
  }, [secondOpinions]);

  // Voice Session Management - Start/End session when voice mode toggles
  useEffect(() => {
    const handleVoiceToggle = async () => {
      if (isVoiceEnabled) {
        // Start new voice session via realtime hook
        try {
          const result = await startVoiceSession();
          setVoiceSessionId(result?.sessionId || `voice_${Date.now()}_${userProfile?.id || 'unknown'}`);
          setUserVoiceTranscripts([]);
          setLunaVoiceTranscripts([]);
          setShowVoiceTranscript(true);
          console.log('🎤 Voice session started:', result?.sessionId);
        } catch (err) {
          console.error('🎤 Failed to start voice session:', err);
          // Fallback to local session
          const fallbackId = `voice_${Date.now()}_${userProfile?.id || 'unknown'}`;
          setVoiceSessionId(fallbackId);
          setUserVoiceTranscripts([]);
          setLunaVoiceTranscripts([]);
          setShowVoiceTranscript(true);
        }
      } else if (voiceSessionId) {
        // Voice mode turned off - stop session
        try {
          await stopVoiceSession();
          console.log('🎤 Voice session ended:', voiceSessionId);
        } catch (err) {
          console.error('🎤 Error stopping voice session:', err);
        }
        // Don't clear transcripts immediately - let user review
      }
    };

    handleVoiceToggle();
  }, [isVoiceEnabled, userProfile?.id]);

  // Helper: Add user voice transcript
  const addUserVoiceTranscript = (text) => {
    if (!text?.trim()) return;
    setUserVoiceTranscripts(prev => [...prev, {
      text: text.trim(),
      timestamp: Date.now()
    }]);
  };

  // Helper: Add Luna voice transcript
  const addLunaVoiceTranscript = (text) => {
    if (!text?.trim()) return;
    setLunaVoiceTranscripts(prev => [...prev, {
      text: text.trim(),
      timestamp: Date.now()
    }]);
  };

  // Extract patterns when switching away from a conversation
  useEffect(() => {
    const extractPatternsFromPreviousConversation = async () => {
      const prev = previousConversationRef.current;

      // If we had a previous conversation with meaningful content
      if (prev && prev.messages && prev.messages.length >= 3 && userProfile?.userId) {
        console.log('🧠 Extracting patterns from previous conversation...');

        try {
          await patternExtraction.analyzeConversation(
            userProfile.userId,
            prev.conversationId,
            prev.messages
          );
        } catch (error) {
          console.error('Pattern extraction error:', error);
        }
      }

      // Update ref to current conversation
      previousConversationRef.current = {
        conversationId: activeConversationId,
        messages: messages
      };
    };

    // Only run when conversation changes
    if (activeConversationId && activeConversationId !== previousConversationRef.current?.conversationId) {
      extractPatternsFromPreviousConversation();
    }
  }, [activeConversationId, userProfile?.userId]);

  // Update previous conversation ref when messages change (for extraction on unmount)
  useEffect(() => {
    if (previousConversationRef.current && activeConversationId === previousConversationRef.current.conversationId) {
      previousConversationRef.current.messages = messages;
    }
  }, [messages, activeConversationId]);

  // Extract patterns on component unmount (user leaving chat)
  useEffect(() => {
    return () => {
      const prev = previousConversationRef.current;
      if (prev && prev.messages && userProfile?.userId) {
        // Fire and forget - component is unmounting

        // Pattern extraction (if enough messages)
        if (prev.messages.length >= 3) {
          patternExtraction.analyzeConversation(
            userProfile.userId,
            prev.conversationId,
            prev.messages
          ).catch(err => console.error('Unmount pattern extraction error:', err));
        }

        // Clear session cache on backend (Memory Optimization)
        try {
          const functions = getFunctions();
          const onSessionEnd = httpsCallable(functions, 'onSessionEnd');
          onSessionEnd({
            userId: userProfile.userId,
            conversationId: prev.conversationId,
            sessionMetrics: {
              messageCount: prev.messages.length,
              endedAt: new Date().toISOString()
            },
            profileId: userProfile?.profileId || 'default'
          }).catch(err => console.error('[SessionCache] Cleanup error:', err));
        } catch (err) {
          console.error('[SessionCache] Cleanup error:', err);
        }
      }
    };
  }, [userProfile?.userId, userProfile?.profileId]);

  // ========== END SESSION INTELLIGENCE ==========

  // Close emoji picker when clicking outside
  useEffect(() => {
    if (!showInputEmojiPicker) return;

    const handleClickOutside = (e) => {
      // Check if click is inside the emoji picker or its button
      const emojiPicker = document.getElementById('input-emoji-picker');
      if (emojiPicker && !emojiPicker.contains(e.target)) {
        setShowInputEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInputEmojiPicker]);

  // Handle file attachment - supports multiple files
  const MAX_FILE_SIZE = 500 * 1024; // 500KB per file
  const MAX_TOTAL_SIZE = 2 * 1024 * 1024; // 2MB total
  const MAX_FILES = 10;

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = [];
    const errors = [];

    for (const file of files) {
      // Check file type
      if (!file.name.endsWith('.md') && !file.name.endsWith('.txt') && !file.type.startsWith('text/')) {
        errors.push(`${file.name}: Only .md or .txt files allowed`);
        continue;
      }

      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (${Math.round(file.size / 1024)}KB > ${MAX_FILE_SIZE / 1024}KB limit)`);
        continue;
      }

      // Check for duplicates
      if (attachedFiles.some(f => f.name === file.name)) {
        errors.push(`${file.name}: Already attached`);
        continue;
      }

      validFiles.push(file);
    }

    // Check max files count
    const remainingSlots = MAX_FILES - attachedFiles.length;
    if (validFiles.length > remainingSlots) {
      errors.push(`Can only attach ${MAX_FILES} files total. ${validFiles.length - remainingSlots} file(s) skipped.`);
      validFiles.splice(remainingSlots);
    }

    // Check total size
    const currentTotalSize = attachedFiles.reduce((sum, f) => sum + f.size, 0);
    const newFilesSize = validFiles.reduce((sum, f) => sum + f.size, 0);
    if (currentTotalSize + newFilesSize > MAX_TOTAL_SIZE) {
      errors.push(`Total attachment size would exceed ${MAX_TOTAL_SIZE / 1024 / 1024}MB limit`);
      // Still allow files that fit
    }

    // Read valid files
    const newAttachments = [];
    let runningTotal = currentTotalSize;

    for (const file of validFiles) {
      if (runningTotal + file.size > MAX_TOTAL_SIZE) {
        errors.push(`${file.name}: Skipped (would exceed total size limit)`);
        continue;
      }

      try {
        const content = await file.text();
        newAttachments.push({
          name: file.name,
          content: content,
          size: file.size
        });
        runningTotal += file.size;
        console.log('📎 File attached:', file.name, content.length, 'characters');
      } catch (error) {
        console.error('Error reading file:', error);
        errors.push(`${file.name}: Could not read file`);
      }
    }

    if (newAttachments.length > 0) {
      setAttachedFiles(prev => [...prev, ...newAttachments]);
    }

    if (errors.length > 0) {
      alert('Some files could not be attached:\n\n' + errors.join('\n'));
    }

    // Reset input so same files can be selected again
    e.target.value = '';
  };

  // Remove attached file by index
  const handleRemoveFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all attached files
  const handleClearAllFiles = () => {
    setAttachedFiles([]);
  };

  // Handle image paste (Ctrl+V) - supports multiple images
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    e.preventDefault();

    // Check if we can add more images
    if (attachedImages.length >= MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed. Remove some to add more.`);
      return;
    }

    const currentTotalSize = attachedImages.reduce((sum, img) => sum + img.size, 0);
    const errors = [];

    for (const item of imageItems) {
      if (attachedImages.length >= MAX_IMAGES) break;

      const file = item.getAsFile();
      if (!file) continue;

      // Check individual file size
      if (file.size > MAX_IMAGE_SIZE) {
        errors.push(`Image too large: ${Math.round(file.size / 1024 / 1024 * 10) / 10}MB > ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit`);
        continue;
      }

      // Check total size
      if (currentTotalSize + file.size > MAX_TOTAL_IMAGE_SIZE) {
        errors.push(`Total image size would exceed ${MAX_TOTAL_IMAGE_SIZE / 1024 / 1024}MB limit`);
        continue;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImages(prev => {
          if (prev.length >= MAX_IMAGES) return prev;
          return [...prev, {
            dataUrl: event.target.result,
            name: `screenshot_${Date.now()}_${prev.length + 1}.png`,
            size: file.size,
            type: file.type
          }];
        });
        console.log('📸 Image pasted:', Math.round(file.size / 1024), 'KB');
      };
      reader.readAsDataURL(file);
    }

    if (errors.length > 0) {
      alert('Some images could not be attached:\n\n' + errors.join('\n'));
    }
  };

  // Handle image file selection (from file picker)
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please select image files (PNG, JPG, GIF, etc.)');
      return;
    }

    const remainingSlots = MAX_IMAGES - attachedImages.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${MAX_IMAGES} images allowed. Remove some to add more.`);
      e.target.value = '';
      return;
    }

    const currentTotalSize = attachedImages.reduce((sum, img) => sum + img.size, 0);
    const errors = [];
    let runningTotal = currentTotalSize;

    for (let i = 0; i < Math.min(imageFiles.length, remainingSlots); i++) {
      const file = imageFiles[i];

      // Check individual file size
      if (file.size > MAX_IMAGE_SIZE) {
        errors.push(`${file.name}: Too large (${Math.round(file.size / 1024 / 1024 * 10) / 10}MB > ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit)`);
        continue;
      }

      // Check total size
      if (runningTotal + file.size > MAX_TOTAL_IMAGE_SIZE) {
        errors.push(`${file.name}: Would exceed total ${MAX_TOTAL_IMAGE_SIZE / 1024 / 1024}MB limit`);
        continue;
      }

      runningTotal += file.size;

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImages(prev => {
          if (prev.length >= MAX_IMAGES) return prev;
          return [...prev, {
            dataUrl: event.target.result,
            name: file.name,
            size: file.size,
            type: file.type
          }];
        });
        console.log('📸 Image selected:', file.name, Math.round(file.size / 1024), 'KB');
      };
      reader.readAsDataURL(file);
    }

    if (imageFiles.length > remainingSlots) {
      errors.push(`Only ${remainingSlots} image(s) added. Max ${MAX_IMAGES} images allowed.`);
    }

    if (errors.length > 0) {
      alert('Some images could not be attached:\n\n' + errors.join('\n'));
    }

    e.target.value = ''; // Reset input
  };

  // Remove attached image by index
  const handleRemoveImage = (index) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all images
  const handleClearAllImages = () => {
    setAttachedImages([]);
  };

  // Insert emoji into input at cursor position
  const handleInsertEmoji = (emoji) => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    // Insert emoji at cursor position
    const newValue = inputValue.slice(0, start) + emoji + inputValue.slice(end);
    setInputValue(newValue);

    // Move cursor after the inserted emoji
    setTimeout(() => {
      input.focus();
      const newPosition = start + emoji.length;
      input.setSelectionRange(newPosition, newPosition);
    }, 0);

    // Close picker after selection
    setShowInputEmojiPicker(false);
  };

  // Handle reaction with signal tracking for Brother awareness
  const handleReactionWithSignal = (messageId, emoji, userId) => {
    // Find the message to get a preview
    const targetMsg = messages.find(m => m.id === messageId);
    if (!targetMsg) return;

    // Check if this is adding or removing a reaction
    const existingReaction = targetMsg.reactions?.[emoji];
    const wasAlreadyReacted = existingReaction?.users?.includes(userId);

    // Toggle the reaction
    toggleMessageReaction(messageId, emoji, userId);

    // Only signal for NEW reactions (not removals) on AI messages
    if (!wasAlreadyReacted && targetMsg.sender === 'ai') {
      const messagePreview = targetMsg.text.slice(0, 80) + (targetMsg.text.length > 80 ? '...' : '');
      setPendingReactionSignal({
        emoji,
        messagePreview,
        wasAdded: true,
        timestamp: Date.now()
      });
      console.log('😊 Reaction signal queued:', emoji, 'on:', messagePreview.slice(0, 30));
    }
  };

  // Copy conversation to clipboard
  const handleCopyConversation = async () => {
    const conversationText = messages
      .filter(m => m.id !== 0) // Skip initial greeting
      .map(m => {
        const sender = m.sender === 'user' ? '👤 USER' : '🐀 BROTHER';
        const timestamp = m.timestamp ? new Date(m.timestamp).toLocaleString() : '';
        return `${sender} (${timestamp}):\n${m.text}`;
      })
      .join('\n\n---\n\n');

    const header = `# AI SoulPartner Conversation\n**Profile:** ${userProfile?.name || 'Unknown'}\n**Date:** ${new Date().toLocaleDateString()}\n**Messages:** ${messages.length - 1}\n\n---\n\n`;

    try {
      await navigator.clipboard.writeText(header + conversationText);
      alert('Conversation copied to clipboard! 📋');
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = header + conversationText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Conversation copied to clipboard! 📋');
    }
  };

  // Handle click on message bubble to show copy popup
  const handleMessageClick = (msgId, e) => {
    e.stopPropagation();
    // Toggle popup - if same message clicked, close it; otherwise open for new message
    setCopyPopupMessageId(prev => prev === msgId ? null : msgId);
  };

  // Copy individual message to clipboard (with header)
  const handleCopyMessage = async (msg, e) => {
    e.stopPropagation();
    const sender = msg.sender === 'user' ? '👤 USER' : '🐀 BROTHER';
    const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : '';
    const textToCopy = `${sender} (${timestamp}):\n${msg.text}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyPopupMessageId(null); // Close popup after copy
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyPopupMessageId(null); // Close popup after copy
    }
  };

  // Copy raw markdown only (no header) - preserves formatting for pasting
  const handleCopyMarkdown = async (msg, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopyPopupMessageId(null);
    } catch (err) {
      console.error('Failed to copy markdown:', err);
      const textArea = document.createElement('textarea');
      textArea.value = msg.text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyPopupMessageId(null);
    }
  };

  // Continue topic from a specific message - brings context down for follow-up questions
  // APPENDS to existing input for progressive building workflow
  const handleContinueTopic = (msg, e) => {
    e.stopPropagation();

    // Format timestamp for reference
    const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'earlier';

    // Get a preview of the message (first 100 chars)
    const preview = msg.text.length > 100
      ? msg.text.slice(0, 100).trim() + '...'
      : msg.text;

    // Create the continuation prompt with timestamp reference
    const sender = msg.sender === 'user' ? 'my message' : 'your response';
    const referenceText = `[Reference from ${sender} at ${timestamp}]:\n"${preview}"`;

    // APPEND to existing input instead of replacing
    setInputValue(prev => {
      if (prev.trim()) {
        // If there's existing content, add reference at the beginning
        return `${referenceText}\n\n${prev}`;
      }
      return `${referenceText}\n\n`;
    });
    setCopyPopupMessageId(null);
    inputRef.current?.focus();

    // Scroll to input area
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Close copy popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setCopyPopupMessageId(null);
    if (copyPopupMessageId !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [copyPopupMessageId]);

  // Navigate to previous message (up arrow)
  const handleNavPrev = () => {
    const navigableMessages = messages.filter(m => m.id !== 0); // Skip initial greeting
    if (navigableMessages.length === 0) return;

    let newIndex;
    if (currentNavIndex <= 0) {
      // At beginning or not started, go to first message
      newIndex = 0;
    } else {
      newIndex = currentNavIndex - 1;
    }

    setCurrentNavIndex(newIndex);
    const targetMsg = navigableMessages[newIndex];
    if (targetMsg && messageRefs.current[targetMsg.id]) {
      messageRefs.current[targetMsg.id].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Navigate to next message (down arrow)
  const handleNavNext = () => {
    const navigableMessages = messages.filter(m => m.id !== 0); // Skip initial greeting
    if (navigableMessages.length === 0) return;

    let newIndex;
    if (currentNavIndex < 0) {
      // Not started, go to first message
      newIndex = 0;
    } else if (currentNavIndex >= navigableMessages.length - 1) {
      // At end, stay at last message
      newIndex = navigableMessages.length - 1;
    } else {
      newIndex = currentNavIndex + 1;
    }

    setCurrentNavIndex(newIndex);
    const targetMsg = navigableMessages[newIndex];
    if (targetMsg && messageRefs.current[targetMsg.id]) {
      messageRefs.current[targetMsg.id].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Navigate up 6 messages
  const handleNavPrev6 = () => {
    const navigableMessages = messages.filter(m => m.id !== 0);
    if (navigableMessages.length === 0) return;

    let newIndex;
    if (currentNavIndex <= 0) {
      newIndex = 0;
    } else {
      newIndex = Math.max(0, currentNavIndex - 6);
    }

    setCurrentNavIndex(newIndex);
    const targetMsg = navigableMessages[newIndex];
    if (targetMsg && messageRefs.current[targetMsg.id]) {
      messageRefs.current[targetMsg.id].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Navigate down 6 messages
  const handleNavNext6 = () => {
    const navigableMessages = messages.filter(m => m.id !== 0);
    if (navigableMessages.length === 0) return;

    const lastIndex = navigableMessages.length - 1;
    let newIndex;
    if (currentNavIndex < 0) {
      newIndex = Math.min(5, lastIndex);
    } else {
      newIndex = Math.min(lastIndex, currentNavIndex + 6);
    }

    setCurrentNavIndex(newIndex);
    const targetMsg = navigableMessages[newIndex];
    if (targetMsg && messageRefs.current[targetMsg.id]) {
      messageRefs.current[targetMsg.id].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Navigate to first message (top)
  const handleNavToTop = () => {
    const navigableMessages = messages.filter(m => m.id !== 0);
    if (navigableMessages.length === 0) return;

    setCurrentNavIndex(0);
    const targetMsg = navigableMessages[0];
    if (targetMsg && messageRefs.current[targetMsg.id]) {
      messageRefs.current[targetMsg.id].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Navigate to last message (bottom)
  const handleNavToBottom = () => {
    const navigableMessages = messages.filter(m => m.id !== 0);
    if (navigableMessages.length === 0) return;

    const lastIndex = navigableMessages.length - 1;
    setCurrentNavIndex(lastIndex);
    const targetMsg = navigableMessages[lastIndex];
    if (targetMsg && messageRefs.current[targetMsg.id]) {
      messageRefs.current[targetMsg.id].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset nav index when conversation changes
  useEffect(() => {
    setCurrentNavIndex(-1);
  }, [activeConversationId]);

  // Intelligent scroll tracking - detect which message is currently visible
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const navigableMessages = messages.filter(m => m.id !== 0);
      if (navigableMessages.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestIndex = -1;
      let closestDistance = Infinity;

      // Find the message closest to the center of the viewport
      navigableMessages.forEach((msg, index) => {
        const el = messageRefs.current[msg.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(elementCenter - containerCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (closestIndex !== -1 && closestIndex !== currentNavIndex) {
        setCurrentNavIndex(closestIndex);
      }
    };

    // Debounce scroll handler for performance
    let scrollTimeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 50);
    };

    container.addEventListener('scroll', debouncedScroll);
    return () => {
      container.removeEventListener('scroll', debouncedScroll);
      clearTimeout(scrollTimeout);
    };
  }, [messages, currentNavIndex]);

  // Clear current conversation (uses context)
  const handleClearConversation = async () => {
    if (confirm('Clear this conversation? This cannot be undone.')) {
      await clearConversation();
    }
  };

  // Create new conversation (uses context)
  const handleNewConversation = async () => {
    await createConversation();
    setShowConversations(false);
    inputRef.current?.focus();
  };

  // Switch to a conversation (uses context)
  const handleSwitchConversation = (convId) => {
    switchConversation(convId);
    setShowConversations(false);
    inputRef.current?.focus();
  };

  // Delete a conversation (uses context)
  const handleDeleteConversation = async (convId, e) => {
    e?.stopPropagation();
    if (conversations.length === 1) {
      alert('Cannot delete the only conversation. Clear it instead.');
      return;
    }
    if (confirm('Delete this conversation? This cannot be undone.')) {
      await deleteConversation(convId);
    }
  };

  // Rename a conversation (uses context)
  const handleRenameConversation = async (convId, newTitle) => {
    if (newTitle.trim()) {
      await renameConversation(convId, newTitle);
    }
    setEditingTitle(null);
  };

  // Track text selection in messages area (stacking mode - append selections)
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    // Only track if text is selected and reasonable length
    if (text && text.length > 3 && text.length < 500) {
      // Append to existing selections (avoid duplicates)
      setSelectedText(prev => {
        if (!prev) return text;
        // Check if this exact text is already selected
        const existingParts = prev.split(' + ');
        if (existingParts.includes(text)) return prev;
        // Limit to 5 selections max
        if (existingParts.length >= 5) {
          console.log('💡 Max 5 selections reached');
          return prev;
        }
        return `${prev} + ${text}`;
      });
    }
    // Note: We don't clear on empty selection anymore to allow stacking
  };

  // Handle "More Info" button click - APPENDS to existing input (progressive building)
  const handleMoreInfo = () => {
    if (selectedText) {
      // Parse multiple selections
      const parts = selectedText.split(' + ');

      // Format the query with FULL text (not truncated)
      // The input box handles long text with scrolling
      let newContent;
      if (parts.length === 1) {
        newContent = `More info on "${parts[0]}"`;
      } else {
        // Multiple selections - include full text for each
        const quotedParts = parts.map(p => `"${p}"`);
        newContent = `More info on:\n${quotedParts.join('\n')}`;
      }

      // APPEND to existing input instead of replacing
      setInputValue(prev => {
        if (prev.trim()) {
          // If there's existing content, add on new line
          return `${prev}\n${newContent}`;
        }
        return newContent;
      });
      setSelectedText('');

      // Clear the text selection
      window.getSelection()?.removeAllRanges();

      // Focus the input
      inputRef.current?.focus();
    }
  };

  // Save AI response to Knowledge Base
  const handleSaveToKB = async (message) => {
    // Open the KB modal for review/edit instead of saving directly
    // Generate a title from the first line or first 50 chars
    const firstLine = message.text.split('\n')[0].slice(0, 60);
    const title = `AI Summary: ${firstLine}${firstLine.length >= 60 ? '...' : ''}`;

    // Pre-fill the modal with the message content
    setKBUpdateTitle(title);
    setKBUpdateContent(message.text);
    setKBUpdateSourceDoc(null); // This is a new document, not an update
    setShowKBUpdateModal(true);
  };

  // Save conversation to Timeline
  const [savingToTimeline, setSavingToTimeline] = useState(null); // message ID being saved
  const [timelinedMessageIds, setTimelinedMessageIds] = useState(new Set()); // Track which messages are already timelined
  const [buildingTimeline, setBuildingTimeline] = useState(false); // Building full timeline in progress
  const [timelineBuildProgress, setTimelineBuildProgress] = useState({ current: 0, total: 0 });

  const handleSaveToTimeline = async (aiMessage) => {
    if (!aiMessage || !userProfile?.userId || !userProfile?.profileId) {
      console.warn('Missing data for timeline save');
      return;
    }

    // Find the user message that preceded this AI response
    const messageIndex = messages.findIndex(m => m.id === aiMessage.id);
    const userMessage = messageIndex > 0
      ? messages.slice(0, messageIndex).reverse().find(m => m.sender === 'user')
      : null;

    setSavingToTimeline(aiMessage.id);

    try {
      // Parse conversation for date extraction
      const parsed = timelineService.parseConversationForTimeline(
        userMessage?.text || '',
        aiMessage.text,
        userProfile?.displayName
      );

      // Save to timeline
      const result = await timelineService.saveConversationToTimeline(
        userProfile.userId,
        userProfile.profileId,
        aiMessage,
        {
          userQuestion: userMessage?.text,
          mode: aiMessage.mode || currentState?.mode,
          memoryDate: parsed.memoryDate,
          chapter: 'conversations',
          importance: 0.7
        }
      );

      if (result.success) {
        console.log('📅 Saved to timeline:', parsed.title);
        // Could show a toast notification here
      } else {
        console.error('Failed to save to timeline:', result.error);
      }
    } catch (error) {
      console.error('Error saving to timeline:', error);
    } finally {
      setSavingToTimeline(null);
    }
  };

  // Build Timeline from entire conversation (processes only new messages)
  const handleBuildTimeline = async () => {
    if (!userProfile?.userId || !userProfile?.profileId) {
      console.warn('Missing user/profile for timeline build');
      return;
    }

    // Filter AI messages that haven't been timelined yet (skip greeting message id=0)
    const aiMessages = messages.filter(
      msg => msg.sender === 'ai' && msg.id !== 0 && !timelinedMessageIds.has(msg.id)
    );

    if (aiMessages.length === 0) {
      console.log('📅 All messages already in timeline');
      return { processed: 0, message: 'All messages already saved to timeline' };
    }

    setBuildingTimeline(true);
    setTimelineBuildProgress({ current: 0, total: aiMessages.length });

    const newTimelinedIds = new Set(timelinedMessageIds);
    let successCount = 0;

    try {
      for (let i = 0; i < aiMessages.length; i++) {
        const aiMessage = aiMessages[i];
        setTimelineBuildProgress({ current: i + 1, total: aiMessages.length });

        // Find the user message that preceded this AI response
        const messageIndex = messages.findIndex(m => m.id === aiMessage.id);
        const userMessage = messageIndex > 0
          ? messages.slice(0, messageIndex).reverse().find(m => m.sender === 'user')
          : null;

        try {
          // Parse conversation for date extraction
          const parsed = timelineService.parseConversationForTimeline(
            userMessage?.text || '',
            aiMessage.text,
            userProfile?.displayName
          );

          // Save to timeline
          const result = await timelineService.saveConversationToTimeline(
            userProfile.userId,
            userProfile.profileId,
            aiMessage,
            {
              userQuestion: userMessage?.text,
              mode: aiMessage.mode || currentState?.mode,
              memoryDate: parsed.memoryDate,
              chapter: 'conversations',
              importance: 0.6
            }
          );

          if (result.success) {
            newTimelinedIds.add(aiMessage.id);
            successCount++;
          }
        } catch (err) {
          console.error(`Failed to timeline message ${aiMessage.id}:`, err);
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Update tracked IDs
      setTimelinedMessageIds(newTimelinedIds);
      console.log(`📅 Timeline built: ${successCount}/${aiMessages.length} messages saved`);

      return { processed: successCount, total: aiMessages.length };

    } catch (error) {
      console.error('Error building timeline:', error);
    } finally {
      setBuildingTimeline(false);
      setTimelineBuildProgress({ current: 0, total: 0 });
    }
  };

  // Export message as markdown file
  const handleExportToMD = (message) => {
    // Generate filename from first line or timestamp
    const firstLine = message.text.split('\n')[0].slice(0, 40).replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const timestamp = new Date(message.timestamp || Date.now()).toISOString().split('T')[0];
    const filename = firstLine
      ? `${firstLine.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.md`
      : `ai-response-${timestamp}.md`;

    // Build markdown content with metadata header
    const mdContent = `# ${message.sender === 'ai' ? 'AI SoulPartner Response' : 'User Message'}

> **Date:** ${new Date(message.timestamp || Date.now()).toLocaleString()}
> **Profile:** ${userProfile?.name || 'Unknown'}
${message.mode ? `> **Mode:** ${message.mode}` : ''}

---

${message.text}

---
*Exported from AstroProfile AI SoulPartner*
`;

    // Create blob and trigger download
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('📄 Exported message to:', filename);
  };

  // Export entire conversation as markdown file
  const handleExportConversationToMD = () => {
    if (messages.length <= 1) {
      alert('No messages to export');
      return;
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const profileName = userProfile?.name?.replace(/\s+/g, '-').toLowerCase() || 'conversation';
    const filename = `${profileName}-conversation-${timestamp}.md`;

    // Build markdown content
    const conversationMessages = messages
      .filter(m => m.id !== 0) // Skip initial greeting placeholder
      .map(m => {
        const sender = m.sender === 'user' ? '## 👤 User' : '## 🐀 Luna (AI SoulPartner)';
        const time = m.timestamp ? new Date(m.timestamp).toLocaleString() : '';
        const mode = m.mode ? `*Mode: ${m.mode}*` : '';
        return `${sender}\n*${time}*${mode ? ` | ${mode}` : ''}\n\n${m.text}`;
      })
      .join('\n\n---\n\n');

    const mdContent = `# AI SoulPartner Conversation

> **Profile:** ${userProfile?.name || 'Unknown'}
> **Date:** ${new Date().toLocaleString()}
> **Messages:** ${messages.filter(m => m.id !== 0).length}

---

${conversationMessages}

---

*Exported from AstroProfile AI SoulPartner*
*${new Date().toISOString()}*
`;

    // Create blob and trigger download
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('📄 Exported conversation to:', filename);
  };

  // ========== AI CONSTELLATION - SECOND OPINION / DEBATE ==========

  // Get second opinion from Sister Gemini
  const handleGetSecondOpinion = async (aiMessage, mode = 'second_opinion', customQuestion = '', images = []) => {
    if (!aiMessage || aiMessage.sender !== 'ai') return;

    // Find the user message that preceded this AI response
    const messageIndex = messages.findIndex(m => m.id === aiMessage.id);
    const userMessage = messageIndex > 0
      ? messages.slice(0, messageIndex).reverse().find(m => m.sender === 'user')
      : null;

    setLoadingSecondOpinion(aiMessage.id);
    setSecondOpinionInput(null); // Close input form
    setSecondOpinionQuestion(''); // Clear question

    try {
      // Use ref to get latest debate history (avoids stale closure)
      const currentDebateHistory = secondOpinionsRef.current[aiMessage.id]?.debate?.exchanges || [];

      console.log('💫 Calling Gemini with debate history:', {
        messageId: aiMessage.id,
        historyLength: currentDebateHistory.length,
        mode
      });

      const response = await getSecondOpinion({
        claudeResponse: aiMessage.text,
        userMessage: userMessage?.text || '',
        conversationHistory: messages.slice(0, messageIndex),
        userProfile: userProfile,
        debateMode: mode,
        previousDebate: currentDebateHistory,
        customQuestion: customQuestion // User's specific question
      });

      if (response.success) {
        if (mode === 'debate') {
          // Store debate in secondOpinions for persistence
          // Use functional setState to get LATEST state (avoid stale closure)
          setSecondOpinions(prev => {
            const existingDebate = prev[aiMessage.id]?.debate?.exchanges || [];
            const newExchanges = existingDebate.length > 0
              ? [...existingDebate, { speaker: response.speaker, text: response.text, icon: response.icon }]
              : [
                  { speaker: 'Luna', text: aiMessage.text, icon: '🌙' },
                  { speaker: response.speaker, text: response.text, icon: response.icon }
                ];

            console.log('💫 Adding Gemini response to debate:', {
              existingCount: existingDebate.length,
              newCount: newExchanges.length,
              speaker: response.speaker
            });

            return {
              ...prev,
              [aiMessage.id]: {
                ...prev[aiMessage.id],
                debate: { exchanges: newExchanges }
              }
            };
          });

          // Set active debate to this message (for UI expansion)
          setActiveDebate({ messageId: aiMessage.id });

          // Check for Baby Nano trigger keywords in Gemini's response
          const nanoTrigger = detectBabyNanoTrigger(response.text);
          if (nanoTrigger.triggered) {
            console.log('🎨 Sister Gemini invoked Baby Nano!');
            setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
          }
        } else {
          // Simple second opinion
          setSecondOpinions(prev => ({
            ...prev,
            [aiMessage.id]: {
              ...prev[aiMessage.id],
              text: response.text,
              speaker: response.speaker,
              icon: response.icon || '💫',
              mode: response.mode
            }
          }));
        }
      } else {
        console.error('Second opinion failed:', response.error);
      }
    } catch (error) {
      console.error('Second opinion error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // Start debate panel - just opens the debate UI with Claude's message, no auto-AI call
  // User can then choose which AI to invite (Gemini, Grok, Opus, or Claude)
  const handleStartDebatePanel = (aiMessage) => {
    // Check if debate already exists
    const existingDebate = secondOpinions[aiMessage.id]?.debate;

    if (!existingDebate || existingDebate.exchanges.length === 0) {
      // Initialize debate with just Claude's original message
      setSecondOpinions(prev => ({
        ...prev,
        [aiMessage.id]: {
          ...prev[aiMessage.id],
          debate: {
            exchanges: [
              { speaker: 'Brother Claude', text: aiMessage.text, icon: '🐷' }
            ]
          }
        }
      }));
    }

    // Open the debate panel
    setActiveDebate({ messageId: aiMessage.id });
  };

  // Quick ask AI - get response immediately without opening panel
  // Response appears inline below the message
  const handleQuickAskAI = async (aiMessage, speaker) => {
    // Initialize debate state if it doesn't exist (to store the response)
    let debate = secondOpinions[aiMessage.id]?.debate;

    if (!debate || debate.exchanges.length === 0) {
      // Initialize debate with just Luna's original message
      const newDebate = {
        exchanges: [
          { speaker: 'Luna', text: aiMessage.text, icon: '🌙' }
        ]
      };

      setSecondOpinions(prev => ({
        ...prev,
        [aiMessage.id]: {
          ...prev[aiMessage.id],
          debate: newDebate
        }
      }));

      debate = newDebate;
    }

    // DON'T open the debate panel - get the response immediately
    // The debate panel will show only if they click "Debate" button
    // But we still need to set activeDebate for the response to show inline
    setActiveDebate({ messageId: aiMessage.id });

    // Call the appropriate AI immediately
    if (speaker === 'gemini') {
      await handleGetSecondOpinion(aiMessage, 'debate', '', []);
    } else if (speaker === 'claude') {
      await handleClaudeDebateResponse(aiMessage, '', []);
    } else if (speaker === 'grok') {
      await handleGrokDebateResponse(aiMessage, '', []);
    } else if (speaker === 'opus') {
      await handleOpusDebateResponse(aiMessage, '', []);
    }
  };

  // Continue debate - get response from selected AI with optional user guidance
  const handleContinueDebate = async (aiMessage, speaker = 'gemini', userGuidance = '') => {
    // Use ref to get latest debate (avoids stale closure)
    const debate = secondOpinionsRef.current[aiMessage.id]?.debate;
    if (!debate) return;

    // Capture images before clearing
    const imagesToSend = [...debateAttachedImages];

    // If user provided guidance or images, add it to the debate first
    if (userGuidance.trim() || imagesToSend.length > 0) {
      const userComment = {
        speaker: userProfile?.firstName || 'You',
        text: userGuidance.trim(),
        icon: '👤',
        isUser: true
      };
      // Include images if attached
      if (imagesToSend.length > 0) {
        userComment.images = imagesToSend.map(img => ({
          data: img.data,
          mimeType: img.mimeType
        }));
      }
      setSecondOpinions(prev => ({
        ...prev,
        [aiMessage.id]: {
          ...prev[aiMessage.id],
          debate: {
            exchanges: [...(prev[aiMessage.id]?.debate?.exchanges || []), userComment]
          }
        }
      }));
      setDebateUserInput(''); // Clear input
      setDebateAttachedImages([]); // Clear images
    }

    if (speaker === 'gemini') {
      // Ask Gemini to respond (with user guidance in context)
      await handleGetSecondOpinion(aiMessage, 'debate', userGuidance, imagesToSend);
    } else if (speaker === 'claude') {
      // Ask Claude to respond in the debate
      await handleClaudeDebateResponse(aiMessage, userGuidance, imagesToSend);
    } else if (speaker === 'grok') {
      // Ask Grok to respond in the debate
      await handleGrokDebateResponse(aiMessage, userGuidance, imagesToSend);
    } else if (speaker === 'opus') {
      // Ask Opus for elder sage perspective
      await handleOpusDebateResponse(aiMessage, userGuidance, imagesToSend);
    }
  };

  // Get Claude's response in the debate context
  const handleClaudeDebateResponse = async (aiMessage, userGuidance = '', images = []) => {
    // Use ref to get latest debate (avoids stale closure)
    const debate = secondOpinionsRef.current[aiMessage.id]?.debate;
    if (!debate) return;

    setLoadingSecondOpinion(aiMessage.id);

    try {
      // Build debate context for Claude
      const debateContext = debate.exchanges
        .map(e => `${e.speaker}: ${e.text}`)
        .join('\n\n');

      // Create a special debate prompt for Claude
      const debatePrompt = userGuidance.trim()
        ? `[DEBATE MODE - ${userProfile?.firstName || 'The user'} asks you to respond]\n\n` +
          `The debate so far:\n${debateContext}\n\n` +
          `User's guidance: "${userGuidance}"\n\n` +
          `Respond to the debate, addressing the user's guidance. Keep it concise (2-3 paragraphs) but insightful.`
        : `[DEBATE MODE - Continue the conversation]\n\n` +
          `The debate so far:\n${debateContext}\n\n` +
          `Respond to the last points made, especially Sister Gemini's perspective. ` +
          `You can agree, disagree, add nuance, or offer a synthesis. Keep it concise but substantive.`;

      // Use the existing sendToAI to get Claude's response
      const response = await sendToAI({
        message: debatePrompt,
        guidance: { mode: 'GUIDANCE', tone: 'thoughtful' },
        conversationHistory: messages.slice(0, messages.findIndex(m => m.id === aiMessage.id)),
        userProfile: userProfile,
        knowledgePrompt: ''  // Skip KB for debate responses
      });

      if (response.success) {
        setSecondOpinions(prev => ({
          ...prev,
          [aiMessage.id]: {
            ...prev[aiMessage.id],
            debate: {
              exchanges: [...(prev[aiMessage.id]?.debate?.exchanges || []), { speaker: 'Brother Claude', text: response.text, icon: '🐷' }]
            }
          }
        }));

        // Check for Baby Nano trigger keywords
        const nanoTrigger = detectBabyNanoTrigger(response.text);
        if (nanoTrigger.triggered) {
          console.log('🎨 Brother Claude invoked Baby Nano!');
          // Small delay to let state update, then generate visual
          setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
        }
      } else {
        console.error('Claude debate response failed:', response.error);
      }
    } catch (error) {
      console.error('Claude debate error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // Get Grok's response in the debate context
  const handleGrokDebateResponse = async (aiMessage, userGuidance = '', images = []) => {
    // Use ref to get latest debate (avoids stale closure)
    const debate = secondOpinionsRef.current[aiMessage.id]?.debate;
    if (!debate) return;

    setLoadingSecondOpinion(aiMessage.id);

    try {
      const response = await getGrokPerspective({
        claudeResponse: aiMessage.text,
        geminiResponse: '',  // Will be extracted from debate if needed
        userMessage: '',
        userProfile: userProfile,
        debateHistory: debate.exchanges,
        customQuestion: userGuidance.trim() || ''
      });

      if (response.success) {
        setSecondOpinions(prev => ({
          ...prev,
          [aiMessage.id]: {
            ...prev[aiMessage.id],
            debate: {
              exchanges: [...(prev[aiMessage.id]?.debate?.exchanges || []), { speaker: 'Brother Grok', text: response.text, icon: '🌍' }]
            }
          }
        }));

        // Check for Baby Nano trigger keywords
        const nanoTrigger = detectBabyNanoTrigger(response.text);
        if (nanoTrigger.triggered) {
          console.log('🎨 Brother Grok invoked Baby Nano!');
          setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
        }
      } else {
        console.error('Grok debate response failed:', response.error);
      }
    } catch (error) {
      console.error('Grok debate error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // Get Opus's response - the elder sage perspective
  const handleOpusDebateResponse = async (aiMessage, userGuidance = '', images = []) => {
    // Use ref to get latest debate (avoids stale closure)
    const debate = secondOpinionsRef.current[aiMessage.id]?.debate;
    if (!debate) return;

    setLoadingSecondOpinion(aiMessage.id);

    try {
      const response = await getOpusPerspective({
        claudeResponse: aiMessage.text,
        geminiResponse: '',
        grokResponse: '',
        userMessage: '',
        userProfile: userProfile,
        debateHistory: debate.exchanges,
        conversationContext: '',
        customQuestion: userGuidance.trim() || ''
      });

      if (response.success) {
        setSecondOpinions(prev => ({
          ...prev,
          [aiMessage.id]: {
            ...prev[aiMessage.id],
            debate: {
              exchanges: [...(prev[aiMessage.id]?.debate?.exchanges || []), { speaker: 'Brother Opus', text: response.text, icon: '🦉' }]
            }
          }
        }));

        // Check for Baby Nano trigger keywords
        const nanoTrigger = detectBabyNanoTrigger(response.text);
        if (nanoTrigger.triggered) {
          console.log('🎨 Brother Opus invoked Baby Nano!');
          setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
        }
      } else {
        console.error('Opus debate response failed:', response.error);
      }
    } catch (error) {
      console.error('Opus debate error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // Add user comment to debate without asking AI to respond
  const handleAddUserCommentToDebate = (aiMessage) => {
    const debate = secondOpinions[aiMessage.id]?.debate;
    if (!debate || (!debateUserInput.trim() && debateAttachedImages.length === 0)) return;

    const userExchange = {
      speaker: userProfile?.firstName || 'You',
      text: debateUserInput.trim(),
      icon: '👤',
      isUser: true
    };

    // Include images if attached
    if (debateAttachedImages.length > 0) {
      userExchange.images = debateAttachedImages.map(img => ({
        data: img.data,
        mimeType: img.mimeType
      }));
    }

    setSecondOpinions(prev => ({
      ...prev,
      [aiMessage.id]: {
        ...prev[aiMessage.id],
        debate: {
          exchanges: [
            ...(prev[aiMessage.id]?.debate?.exchanges || []),
            userExchange
          ]
        }
      }
    }));

    // Check for Baby Nano trigger keywords in user comment
    const userText = debateUserInput.trim();
    const nanoTrigger = detectBabyNanoTrigger(userText);

    setDebateUserInput('');
    setDebateAttachedImages([]); // Clear images after adding comment

    // If user invoked Baby Nano with trigger words, generate visual
    if (nanoTrigger.triggered) {
      console.log('🎨 User invoked Baby Nano with:', nanoTrigger.visualType);
      setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
    }
  };

  // Handle image paste in debate panel (Ctrl+V)
  const handleDebatePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    e.preventDefault();

    // Limit to 3 images in debate
    const MAX_DEBATE_IMAGES = 3;
    if (debateAttachedImages.length >= MAX_DEBATE_IMAGES) {
      alert(`Maximum ${MAX_DEBATE_IMAGES} images allowed in debate. Remove some to add more.`);
      return;
    }

    for (const item of imageItems) {
      if (debateAttachedImages.length >= MAX_DEBATE_IMAGES) break;

      const file = item.getAsFile();
      if (!file) continue;

      // Check file size (max 4MB per image)
      if (file.size > 4 * 1024 * 1024) {
        alert(`Image too large: ${Math.round(file.size / 1024 / 1024 * 10) / 10}MB > 4MB limit`);
        continue;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        // Extract base64 data and mime type
        const [header, data] = dataUrl.split(',');
        const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/png';

        setDebateAttachedImages(prev => {
          if (prev.length >= MAX_DEBATE_IMAGES) return prev;
          return [...prev, {
            data: data,
            mimeType: mimeType,
            preview: dataUrl,
            name: `debate_img_${Date.now()}_${prev.length + 1}.png`
          }];
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image from debate attachments
  const handleRemoveDebateImage = (index) => {
    setDebateAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Detect Baby Nano trigger keywords in AI responses
  // Returns { triggered: boolean, visualType: string }
  const detectBabyNanoTrigger = (text) => {
    if (!text) return { triggered: false, visualType: null };

    // Strip markdown formatting (*, **, _, __) before checking
    // This ensures "*let me sketch*" matches "let me sketch"
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
      .replace(/\*([^*]+)\*/g, '$1')       // *italic*
      .replace(/__([^_]+)__/g, '$1')       // __bold__
      .replace(/_([^_]+)_/g, '$1');        // _italic_

    const lowerText = cleanText.toLowerCase();

    // Trigger patterns with their visual types
    const triggers = [
      // Sketch/Draw triggers - AI style ("let me...")
      { patterns: ['let me draw', 'let baby nano draw', 'i\'ll draw', 'drawing this'], type: 'sketch' },
      { patterns: ['let me sketch', 'let baby nano sketch', 'i\'ll sketch', 'sketching this'], type: 'sketch' },
      { patterns: ['let me paint', 'let baby nano paint', 'painting this'], type: 'sketch' },
      { patterns: ['let me illustrate', 'illustrating this', 'an illustration'], type: 'sketch' },
      { patterns: ['visualize this', 'let me visualize', 'visualizing'], type: 'sketch' },
      { patterns: ['picture this', 'imagine this visually'], type: 'sketch' },
      { patterns: ['🎨 sketch', '🎨sketch'], type: 'sketch' },
      // User command style ("draw me...", "draw a...")
      { patterns: ['draw me ', 'draw a ', 'draw an ', 'draw the ', 'draw this'], type: 'sketch' },
      { patterns: ['sketch me ', 'sketch a ', 'sketch an ', 'sketch the '], type: 'sketch' },
      { patterns: ['paint me ', 'paint a ', 'paint an ', 'paint the '], type: 'sketch' },
      { patterns: ['create an image', 'create a picture', 'make an image', 'make a picture'], type: 'sketch' },
      { patterns: ['show me a picture', 'show me an image', 'generate an image'], type: 'sketch' },

      // Flowchart triggers
      { patterns: ['flowchart', 'flow chart', 'let me diagram', 'a diagram'], type: 'flowchart' },
      { patterns: ['🎨 flowchart', '🎨flowchart'], type: 'flowchart' },

      // Timeline triggers
      { patterns: ['timeline', 'time line', 'chronological view'], type: 'timeline' },
      { patterns: ['🎨 timeline', '🎨timeline'], type: 'timeline' },

      // Mind map triggers
      { patterns: ['mind map', 'mindmap', 'concept map'], type: 'mindmap' },
      { patterns: ['🎨 mindmap', '🎨mindmap', '🎨 mind map'], type: 'mindmap' },

      // Comparison triggers
      { patterns: ['compare visually', 'comparison chart', 'side by side'], type: 'comparison' },
      { patterns: ['🎨 compare', '🎨compare'], type: 'comparison' }
    ];

    for (const trigger of triggers) {
      for (const pattern of trigger.patterns) {
        if (lowerText.includes(pattern)) {
          console.log(`🎨 Baby Nano triggered by: "${pattern}" → ${trigger.type}`);
          return { triggered: true, visualType: trigger.type };
        }
      }
    }

    return { triggered: false, visualType: null };
  };

  // Track last Baby Nano call time to prevent rate limiting
  const lastBabyNanoCallRef = useRef(0);
  const BABY_NANO_COOLDOWN = 15000; // 15 seconds between calls

  // Generate visual representation of the debate using Baby Nano
  const handleGenerateDebateVisual = async (aiMessage, visualType = 'sketch') => {
    const debate = secondOpinions[aiMessage.id]?.debate;
    if (!debate || debate.exchanges.length === 0) {
      console.log('No debate to visualize');
      return;
    }

    // Check cooldown to prevent rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - lastBabyNanoCallRef.current;
    if (timeSinceLastCall < BABY_NANO_COOLDOWN) {
      const waitTime = Math.ceil((BABY_NANO_COOLDOWN - timeSinceLastCall) / 1000);
      console.log(`🎨 Baby Nano cooldown: wait ${waitTime}s before next image`);
      alert(`Baby Nano needs ${waitTime} seconds to rest before creating another image!`);
      return;
    }
    lastBabyNanoCallRef.current = now;

    setLoadingDebateVisual(aiMessage.id);

    try {
      // Include the original message in the context
      // Filter out visual entries (Baby Nano images) - only include text exchanges
      // Truncate long texts to avoid oversized requests
      const textExchanges = debate.exchanges
        .filter(e => !e.isVisual && e.text)
        .map(e => ({
          speaker: e.speaker,
          text: e.text.slice(0, 500) // Truncate to 500 chars max per exchange
        }));
      const allExchanges = [
        { speaker: 'Brother Claude', text: aiMessage.text?.slice(0, 500) || '' },
        ...textExchanges
      ];

      console.log('🎨 Sending to generateDebateVisual:', {
        exchangeCount: allExchanges.length,
        totalChars: allExchanges.reduce((sum, e) => sum + (e.text?.length || 0), 0)
      });

      const result = await generateDebateVisual({
        debateExchanges: allExchanges,
        visualType,
        topic: messages.find(m => m.sender === 'user' && m.id < aiMessage.id)?.text?.slice(0, 50) || 'Discussion',
        userProfile: userProfile
      });

      if (result.success) {
        // Add visual as an exchange entry so it moves with the conversation
        setSecondOpinions(prev => ({
          ...prev,
          [aiMessage.id]: {
            ...prev[aiMessage.id],
            debate: {
              exchanges: [
                ...(prev[aiMessage.id]?.debate?.exchanges || []),
                {
                  speaker: 'Baby Nano',
                  icon: '🎨',
                  isVisual: true,
                  visualType: result.visualType,
                  image: result.image,
                  description: result.description
                }
              ]
            }
          }
        }));
        console.log('🎨 Debate visual generated:', result.visualType);
      } else {
        console.error('Failed to generate debate visual:', result.error);
        alert(`Could not generate visual: ${result.error}`);
      }
    } catch (error) {
      console.error('Debate visual error:', error);
      alert('Failed to generate visual. Please try again.');
    } finally {
      setLoadingDebateVisual(null);
    }
  };

  // Export debate to Markdown file
  const handleExportDebateToMarkdown = (originalMessage, debate) => {
    if (!debate || !debate.exchanges || debate.exchanges.length === 0) return;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    const userName = userProfile?.firstName || userProfile?.displayName || 'User';

    // Build markdown content
    let markdown = `# AI Constellation Debate\n\n`;
    markdown += `**Date:** ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
    markdown += `**Participants:** Brother Claude 🐷, Sister Gemini 💫, Brother Grok 🌍, Brother Opus 🦉${debate.exchanges.some(e => e.isUser) ? `, ${userName} 👤` : ''}\n\n`;
    markdown += `---\n\n`;

    // Original context (the AI message that sparked the debate)
    markdown += `## Original Context\n\n`;
    markdown += `**Brother Claude:** ${originalMessage.text}\n\n`;
    markdown += `---\n\n`;

    // Debate exchanges
    markdown += `## Debate\n\n`;

    debate.exchanges.forEach((exchange, index) => {
      const icon = exchange.icon || (exchange.speaker === 'Brother Claude' ? '🐷' : exchange.speaker === 'Brother Grok' ? '🌍' : exchange.speaker === 'Brother Opus' ? '🦉' : '💫');
      markdown += `### ${icon} ${exchange.speaker}${exchange.isUser ? ' (guiding)' : ''}\n\n`;
      markdown += `${exchange.text}\n\n`;
      if (index < debate.exchanges.length - 1) {
        markdown += `---\n\n`;
      }
    });

    // Footer
    markdown += `\n---\n\n`;
    markdown += `*Exported from GENESIS AI Constellation*\n`;
    markdown += `*${debate.exchanges.length} exchanges*\n`;

    // Create and download the file
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-debate-${timestamp}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('📄 Debate exported to markdown');
  };

  // ========== INLINE AI CONSTELLATION (KISS - Simplified Flow) ==========
  // Adds AI responses directly to main conversation, no debate panel

  const handleInlineConstellationAI = async (speaker, contextMessage = null) => {
    // Speaker: 'gemini', 'grok', 'opus', 'claude'
    // contextMessage: optional specific message to respond to, otherwise uses last AI message

    const targetMessage = contextMessage || messages.filter(m => m.sender === 'ai').pop();
    if (!targetMessage) {
      console.warn('[Inline AI] No AI message to respond to');
      return;
    }

    setLoadingSecondOpinion(speaker); // Reuse loading state

    try {
      // Build full conversation history for context
      const conversationHistory = messages.map(m => ({
        sender: m.sender === 'user' ? 'user' : (m.sender === 'ai' ? 'Luna' : m.sender),
        text: m.text,
        hasImage: m.hasImage,
        imageCount: m.imageCount
      }));

      console.log(`💫 [Inline AI] Calling ${speaker} with ${conversationHistory.length} messages`);

      let response;
      const userName = userProfile?.firstName || userProfile?.displayName || 'Friend';

      if (speaker === 'gemini') {
        response = await getSecondOpinion({
          claudeResponse: targetMessage.text,
          userMessage: '',
          conversationHistory: messages,
          userProfile: userProfile,
          debateMode: 'debate',
          previousDebate: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          customQuestion: ''
        });
      } else if (speaker === 'grok') {
        response = await getGrokPerspective({
          claudeResponse: targetMessage.text,
          geminiResponse: '',
          userMessage: '',
          userProfile: userProfile,
          debateHistory: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          customQuestion: ''
        });
      } else if (speaker === 'opus') {
        response = await getOpusPerspective({
          claudeResponse: targetMessage.text,
          geminiResponse: '',
          grokResponse: '',
          userMessage: '',
          userProfile: userProfile,
          debateHistory: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          conversationContext: '',
          customQuestion: ''
        });
      } else if (speaker === 'deepseek') {
        response = await getDeepSeekPerspective({
          claudeResponse: targetMessage.text,
          geminiResponse: '',
          grokResponse: '',
          userMessage: '',
          userProfile: userProfile,
          debateHistory: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          customQuestion: ''
        });
      } else if (speaker === 'chatgpt') {
        response = await getChatGPTPerspective({
          claudeResponse: targetMessage.text,
          geminiResponse: '',
          grokResponse: '',
          userMessage: '',
          userProfile: userProfile,
          debateHistory: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          customQuestion: '',
          model: 'o3-mini' // Default to o3-mini for deep thinking
        });
      } else if (speaker === 'claude') {
        // Use main AI to respond without user typing
        response = await sendToAI({
          message: `[CONSTELLATION MODE - Respond to the conversation so far]\n\nProvide your perspective on the discussion. Be concise but insightful.`,
          guidance: { mode: 'GUIDANCE', tone: 'thoughtful' },
          conversationHistory: messages,
          userProfile: userProfile,
          knowledgePrompt: ''
        });
      }

      if (response?.success || response?.text) {
        // Create new message for the conversation
        const newMessageId = `constellation_${speaker}_${Date.now()}`;
        const newMessage = {
          id: newMessageId,
          sender: speaker, // 'gemini', 'grok', 'opus', 'claude', 'deepseek', 'chatgpt'
          text: response.text || response.response,
          timestamp: new Date().toISOString(),
          fromConstellation: true,
          constellationSpeaker: response.speaker || speaker,
          constellationIcon: speaker === 'gemini' ? '💫' :
                           speaker === 'grok' ? '🌍' :
                           speaker === 'opus' ? '🦉' :
                           speaker === 'deepseek' ? '🐉' :
                           speaker === 'chatgpt' ? '🧪' : '🐷',
          // Include thinking/reasoning if available
          thinking: response.thinking || null,
          hasThinking: response.hasThinking || false
        };

        // Add to main messages
        const updatedMessages = [...messages, newMessage];
        await updateMessages(updatedMessages);

        console.log(`✅ [Inline AI] ${speaker} response added to conversation`);
      } else {
        console.error(`❌ [Inline AI] ${speaker} failed:`, response?.error);
      }
    } catch (error) {
      console.error(`❌ [Inline AI] ${speaker} error:`, error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // ========== BABY NANO - INLINE VISUAL GENERATION (KISS) ==========
  // Generates visualizations based on conversation context (not debate panel)
  const handleInlineGenerateVisual = async (contextMessage, visualType = 'mindmap') => {
    // Check cooldown to prevent rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - lastBabyNanoCallRef.current;
    if (timeSinceLastCall < BABY_NANO_COOLDOWN) {
      const waitTime = Math.ceil((BABY_NANO_COOLDOWN - timeSinceLastCall) / 1000);
      console.log(`🎨 Baby Nano cooldown: wait ${waitTime}s before next image`);
      alert(`Baby Nano needs ${waitTime} seconds to rest before creating another image!`);
      return;
    }
    lastBabyNanoCallRef.current = now;

    setLoadingDebateVisual(contextMessage.id);

    try {
      // Build conversation context from all messages up to and including contextMessage
      const messageIndex = messages.findIndex(m => m.id === contextMessage.id);
      const relevantMessages = messages.slice(0, messageIndex + 1);

      // Convert to exchange format for generateDebateVisual
      const exchanges = relevantMessages
        .filter(m => m.text)
        .map(m => {
          const speakerName = m.sender === 'user' ? 'You' :
                             m.sender === 'ai' ? 'Luna' :
                             m.sender === 'gemini' ? 'Sister Gemini' :
                             m.sender === 'grok' ? 'Brother Grok' :
                             m.sender === 'opus' ? 'Brother Opus' :
                             m.sender === 'deepseek' ? 'Brother DeepSeek' :
                             m.sender === 'chatgpt' ? 'Sister ChatGPT' :
                             m.sender === 'claude' ? 'Brother Claude' : m.sender;
          return {
            speaker: speakerName,
            text: m.text.slice(0, 500) // Truncate for safety
          };
        });

      // Get the topic from the first user message
      const topic = messages.find(m => m.sender === 'user')?.text?.slice(0, 50) || 'Conversation';

      console.log('🎨 [Baby Nano Inline] Generating visual:', {
        type: visualType,
        messageCount: exchanges.length,
        topic
      });

      const result = await generateDebateVisual({
        debateExchanges: exchanges,
        visualType,
        topic,
        userProfile: userProfile
      });

      if (result.success && result.image) {
        // Add visual as a new message in the conversation
        const newMessageId = `babynano_${Date.now()}`;
        const newMessage = {
          id: newMessageId,
          sender: 'babynano',
          text: `🎨 ${result.visualType || visualType} visualization`,
          timestamp: new Date().toISOString(),
          fromConstellation: true,
          constellationSpeaker: 'Baby Nano',
          constellationIcon: '🎨',
          isVisual: true,
          visualType: result.visualType || visualType,
          image: result.image,
          description: result.description
        };

        const updatedMessages = [...messages, newMessage];
        await updateMessages(updatedMessages);

        console.log('✅ [Baby Nano Inline] Visual added to conversation');
      } else {
        console.error('❌ [Baby Nano Inline] Failed:', result?.error);
        alert('Failed to generate visualization. Please try again.');
      }
    } catch (error) {
      console.error('❌ [Baby Nano Inline] Error:', error);
      alert('Error generating visualization: ' + error.message);
    } finally {
      setLoadingDebateVisual(null);
    }
  };

  // Clear second opinion for a message
  const handleClearSecondOpinion = (messageId) => {
    setSecondOpinions(prev => {
      const newState = { ...prev };
      delete newState[messageId];
      return newState;
    });
    if (activeDebate?.messageId === messageId) {
      setActiveDebate(null);
    }
  };

  // ========== GENESIS IMAGE GENERATION (Stability.ai & Leonardo.ai) ==========
  const handleImageGeneration = async (contextMessage, provider, model) => {
    // Prevent rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - lastBabyNanoCallRef.current;
    if (timeSinceLastCall < BABY_NANO_COOLDOWN) {
      const waitTime = Math.ceil((BABY_NANO_COOLDOWN - timeSinceLastCall) / 1000);
      console.log(`🖼️ Image generation cooldown: wait ${waitTime}s`);
      alert(`Please wait ${waitTime} seconds before generating another image.`);
      return;
    }
    lastBabyNanoCallRef.current = now;

    setLoadingDebateVisual(contextMessage.id);

    try {
      // Extract a prompt from the message context
      // Use the message text as the basis for image generation
      const messageText = contextMessage.text || '';
      const prompt = `Create a beautiful, artistic visualization inspired by: "${messageText.slice(0, 200)}"`;

      console.log(`🖼️ [GENESIS] Generating image with ${provider}/${model}:`, prompt.slice(0, 50));

      let result;
      if (provider === 'stability') {
        result = await generateStabilityImage({
          prompt,
          model,
          aspectRatio: '1:1',
          style: 'digital-art'
        });
      } else if (provider === 'leonardo') {
        result = await generateLeonardoImage({
          prompt,
          model,
          width: 1024,
          height: 1024,
          alchemy: true
        });
      }

      if (result?.success) {
        // Add generated image as a new message
        const newMessageId = `genesis_image_${Date.now()}`;
        const imageData = provider === 'stability'
          ? result.image  // base64
          : result.images?.[0];  // URL

        const newMessage = {
          id: newMessageId,
          sender: 'genesis',
          text: `🖼️ Generated with ${provider === 'stability' ? 'Stability.ai' : 'Leonardo.ai'} (${model})`,
          timestamp: new Date().toISOString(),
          fromConstellation: true,
          constellationSpeaker: provider === 'stability' ? 'Stability.ai' : 'Leonardo.ai',
          constellationIcon: '🖼️',
          isVisual: true,
          visualType: 'generated-image',
          image: imageData,
          imageProvider: provider,
          imageModel: model,
          prompt: prompt
        };

        const updatedMessages = [...messages, newMessage];
        await updateMessages(updatedMessages);

        console.log('✅ [GENESIS] Image generated and added to conversation');
      } else {
        console.error('❌ [GENESIS] Failed:', result?.error);
        alert('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('❌ [GENESIS] Error:', error);
      alert('Error generating image: ' + error.message);
    } finally {
      setLoadingDebateVisual(null);
    }
  };

  // Toggle the second opinion question input
  const handleToggleSecondOpinionInput = (messageId) => {
    if (secondOpinionInput === messageId) {
      setSecondOpinionInput(null);
      setSecondOpinionQuestion('');
    } else {
      setSecondOpinionInput(messageId);
      setSecondOpinionQuestion('');
    }
  };

  // Submit the second opinion question
  const handleSubmitSecondOpinionQuestion = (aiMessage) => {
    if (!secondOpinionQuestion.trim()) {
      // If no question, just get generic second opinion
      handleGetSecondOpinion(aiMessage, 'second_opinion', '');
    } else {
      handleGetSecondOpinion(aiMessage, 'second_opinion', secondOpinionQuestion.trim());
    }
  };

  // Copy second opinion text to clipboard
  const handleCopySecondOpinion = async (messageId) => {
    const opinion = secondOpinions[messageId];
    if (!opinion?.text) return;

    // Include conversation if exists
    const conversation = secondOpinionConversation[messageId] || [];
    let fullText = `Sister Gemini's Second Opinion:\n\n${opinion.text}`;

    if (conversation.length > 0) {
      fullText += '\n\n--- Conversation ---\n';
      conversation.forEach(msg => {
        fullText += `\n${msg.speaker}: ${msg.text}\n`;
      });
    }

    try {
      await navigator.clipboard.writeText(fullText);
      // Brief visual feedback could be added here
      console.log('Copied second opinion to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Reply to second opinion - continue conversation with Gemini
  const handleReplyToSecondOpinion = async (aiMessage, replyText) => {
    if (!replyText?.trim() || !secondOpinions[aiMessage.id]) return;

    setLoadingSecondOpinion(aiMessage.id);

    // Add user's reply to conversation
    const userReply = { speaker: userProfile?.firstName || 'You', text: replyText.trim(), isUser: true };
    setSecondOpinionConversation(prev => ({
      ...prev,
      [aiMessage.id]: [...(prev[aiMessage.id] || []), userReply]
    }));

    // Clear the reply input
    setSecondOpinionReply(null);

    try {
      // Build conversation context
      const existingConversation = secondOpinionConversation[aiMessage.id] || [];
      const fullConversation = [
        { speaker: 'Sister Gemini', text: secondOpinions[aiMessage.id].text },
        ...existingConversation,
        userReply
      ];

      const response = await getSecondOpinion({
        claudeResponse: aiMessage.text,
        userMessage: '', // Original context not needed for replies
        conversationHistory: [],
        userProfile: userProfile,
        debateMode: 'second_opinion',
        previousDebate: fullConversation, // Use as conversation history
        customQuestion: replyText.trim()
      });

      if (response.success) {
        // Add Gemini's response to conversation
        setSecondOpinionConversation(prev => ({
          ...prev,
          [aiMessage.id]: [
            ...(prev[aiMessage.id] || []),
            { speaker: 'Sister Gemini', text: response.text, icon: '💫' }
          ]
        }));
      }
    } catch (error) {
      console.error('Reply to second opinion error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // Generate KB update from current discussion
  const handleGenerateKBUpdate = async (sourceDoc = null) => {
    setIsGeneratingKBUpdate(true);
    setKBUpdateSourceDoc(sourceDoc);

    try {
      // Build conversation summary for Claude
      const conversationText = messages
        .filter(m => m.id !== 0) // Skip initial greeting
        .map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`)
        .join('\n\n');

      const prompt = sourceDoc
        ? `Based on our discussion about "${sourceDoc.title}", please synthesize and update the knowledge document. Include new insights, clarifications, and discoveries from our conversation. Format as a well-structured markdown document that captures both the original knowledge and new learnings.

ORIGINAL DOCUMENT:
${sourceDoc.content}

OUR DISCUSSION:
${conversationText}

Please create an updated, comprehensive document that incorporates our discussion insights. Start with the title on the first line (without # prefix), then the content.`
        : `Based on our discussion, please create a knowledge base document that captures the key insights, discoveries, and conclusions. Format as a well-structured markdown document.

OUR DISCUSSION:
${conversationText}

Please create a comprehensive document. Start with a clear title on the first line (without # prefix), then the content.`;

      // Send to Claude for synthesis
      const response = await sendToAI({
        message: prompt,
        guidance: { mode: 'GUIDANCE', tone: 'structured' },
        conversationHistory: [],
        userProfile: userProfile,
        knowledgePrompt: ''
      });

      if (response.success && response.text) {
        // Extract title from first line
        const lines = response.text.trim().split('\n');
        const title = lines[0].replace(/^#*\s*/, '').trim();
        const content = lines.slice(1).join('\n').trim();

        setKBUpdateTitle(sourceDoc?.title || title);
        setKBUpdateContent(content || response.text);
        setShowKBUpdateModal(true);
      } else {
        alert('Failed to generate KB update. Please try again.');
      }
    } catch (error) {
      console.error('Error generating KB update:', error);
      alert('Error generating KB update: ' + error.message);
    } finally {
      setIsGeneratingKBUpdate(false);
    }
  };

  // Split content into chunks by sections/paragraphs
  const splitContentIntoChunks = (content, maxChars = 5000) => {
    if (content.length <= maxChars) return [content];

    const chunks = [];
    const sections = content.split(/\n(?=##\s)/); // Split by ## headers

    let currentChunk = '';
    for (const section of sections) {
      if ((currentChunk + section).length > maxChars && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = section;
      } else {
        currentChunk += (currentChunk ? '\n' : '') + section;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    // If still too large (no ## headers), split by paragraphs
    const finalChunks = [];
    for (const chunk of chunks) {
      if (chunk.length <= maxChars) {
        finalChunks.push(chunk);
      } else {
        // Split by double newlines (paragraphs)
        const paragraphs = chunk.split(/\n\n+/);
        let subChunk = '';
        for (const para of paragraphs) {
          if ((subChunk + para).length > maxChars && subChunk.length > 0) {
            finalChunks.push(subChunk.trim());
            subChunk = para;
          } else {
            subChunk += (subChunk ? '\n\n' : '') + para;
          }
        }
        if (subChunk.trim()) finalChunks.push(subChunk.trim());
      }
    }

    return finalChunks.length > 0 ? finalChunks : [content.slice(0, maxChars)];
  };

  // Save KB update (either replace original or create new)
  // Automatically splits large documents into multiple parts (_01, _02, etc.)
  const handleSaveKBUpdate = async (mode) => {
    try {
      const chunks = splitContentIntoChunks(kbUpdateContent, 5000);
      const isMultiPart = chunks.length > 1;

      if (mode === 'replace' && kbUpdateSourceDoc?.id && !isMultiPart) {
        // Single part - replace existing
        const docData = {
          title: kbUpdateTitle,
          content: kbUpdateContent,
          category: kbUpdateSourceDoc?.category || 'reference',
          summary: `Updated from AI discussion on ${new Date().toLocaleDateString()}`,
          priority: kbUpdateSourceDoc?.priority || 5,
          alwaysInclude: kbUpdateSourceDoc?.alwaysInclude || false
        };
        await updateDocument(kbUpdateSourceDoc.id, docData);
        console.log('📚 KB document updated:', kbUpdateTitle);
        alert('Knowledge Base document updated! ✅');
      } else {
        // Create new document(s) - with _01, _02 suffix if multiple parts
        for (let i = 0; i < chunks.length; i++) {
          const partNum = String(i + 1).padStart(2, '0');
          const partTitle = isMultiPart ? `${kbUpdateTitle}_${partNum}` : kbUpdateTitle;
          const partSummary = isMultiPart
            ? `Part ${i + 1} of ${chunks.length} - Updated from AI discussion on ${new Date().toLocaleDateString()}`
            : `Updated from AI discussion on ${new Date().toLocaleDateString()}`;

          const docData = {
            title: partTitle,
            content: chunks[i],
            category: kbUpdateSourceDoc?.category || 'reference',
            summary: partSummary,
            priority: kbUpdateSourceDoc?.priority || 5,
            alwaysInclude: kbUpdateSourceDoc?.alwaysInclude || false
          };

          await createDocument(docData);
          console.log(`📚 KB document created: ${partTitle}`);
        }

        if (isMultiPart) {
          alert(`Document was large! Created ${chunks.length} parts:\n${chunks.map((_, i) => `${kbUpdateTitle}_${String(i + 1).padStart(2, '0')}`).join('\n')}`);
        } else {
          alert('New Knowledge Base document created! ✅');
        }
      }

      // Close modal and reset
      setShowKBUpdateModal(false);
      setKBUpdateContent('');
      setKBUpdateTitle('');
      setKBUpdateSourceDoc(null);
    } catch (error) {
      console.error('Error saving KB update:', error);
      alert('Failed to save: ' + error.message);
    }
  };

  // Auto-scroll to bottom on new messages (scroll within container only)
  useEffect(() => {
    // Get the scrollable container (parent of messagesContainerRef)
    const scrollContainer = messagesContainerRef.current?.parentElement;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Track if we've already processed the prefill to prevent clearing
  const prefillProcessedRef = useRef(false);

  // Handle incoming navigation state (KB document or prefilled message)
  useEffect(() => {
    const kbDocument = location.state?.kbDocument;
    const prefillMessage = location.state?.prefillMessage;

    // Skip if no actionable state or already processed
    if (!kbDocument && !prefillMessage) return;
    if (prefillMessage && prefillProcessedRef.current) return;

    console.log('🔍 [NavState] Processing:', { kbDocument: !!kbDocument, prefillMessage });

    if (kbDocument) {
      setSelectedKBDoc(kbDocument);
      setInputValue(`Let's discuss: "${kbDocument.title}"`);
      inputRef.current?.focus();
      navigate(location.pathname, { replace: true, state: {} });
    } else if (prefillMessage) {
      console.log('🧠 [NeuralPathway] Setting question:', prefillMessage);
      prefillProcessedRef.current = true;

      // Set via React state
      setInputValue(prefillMessage);

      // Also set directly on DOM to ensure visibility
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value = prefillMessage;
          inputRef.current.focus();
          // Move cursor to end of text
          const len = prefillMessage.length;
          inputRef.current.setSelectionRange(len, len);
        }
      }, 50);

      // Clear navigation state after a delay to let React settle
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: { profileId: location.state?.profileId } });
      }, 100);
    }
  }, [location.state, navigate, location.pathname]);

  // Handle sending a message (optionally with override content and modality)
  // modality: 'text' (default) or 'voice' - keeps conversations isolated
  const handleSend = async (overrideContent = null, modality = 'text') => {
    const messageContent = overrideContent !== null ? overrideContent : inputValue;
    const modalityEmoji = modality === 'voice' ? '🎤' : '⌨️';
    console.log(`${modalityEmoji} handleSend called (${modality}), content:`, messageContent?.slice(0, 30));

    if ((!messageContent.trim() && attachedFiles.length === 0 && attachedImages.length === 0) || isTyping) {
      console.log('🚫 Early return - no input or typing');
      return;
    }

    // Ensure we have an active conversation before sending
    let targetConvId = activeConversationId;
    if (!targetConvId) {
      console.log('💬 No active conversation, creating one...');
      try {
        targetConvId = await createConversation();
        console.log('💬 Created conversation:', targetConvId);
        // Wait for state to update
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error('❌ Failed to create conversation:', err);
        alert('Failed to create conversation. Please refresh the page.');
        return;
      }
    }

    // Build message text including file content if attached
    let userMessageText = messageContent.trim();
    let displayText = userMessageText;
    let imageData = null;

    if (attachedFiles.length > 0) {
      // Add all file contents to message for Claude
      const fileContents = attachedFiles.map(f =>
        `---\n📎 ATTACHED FILE: ${f.name}\n---\n${f.content}`
      ).join('\n\n');
      userMessageText = `${userMessageText}\n\n${fileContents}`;

      // Show preview in chat
      const totalSize = attachedFiles.reduce((sum, f) => sum + f.size, 0);
      const fileNames = attachedFiles.map(f => f.name).join(', ');
      displayText = `${messageContent.trim()}\n\n📎 Attached ${attachedFiles.length} file(s): ${fileNames} (${Math.round(totalSize / 1024)}KB total)`;
    }

    // Add KB document context if selected
    if (selectedKBDoc) {
      userMessageText = `${userMessageText}\n\n---\n📚 KNOWLEDGE BASE CONTEXT: ${selectedKBDoc.title}\n---\n${selectedKBDoc.content}`;
      displayText = `${displayText || messageContent.trim()}\n\n📚 KB: ${selectedKBDoc.title}`;
    }

    if (attachedImages.length > 0) {
      // Send first image to API (Claude API supports multiple but our backend takes one for now)
      imageData = {
        dataUrl: attachedImages[0].dataUrl,
        type: attachedImages[0].type
      };
      // Show preview of all attached images
      const totalImageSize = attachedImages.reduce((sum, img) => sum + img.size, 0);
      const imageSizeStr = totalImageSize > 1024 * 1024
        ? `${Math.round(totalImageSize / 1024 / 1024 * 10) / 10}MB`
        : `${Math.round(totalImageSize / 1024)}KB`;
      displayText = `${displayText || '(Images)'}\n\n📸 ${attachedImages.length} screenshot${attachedImages.length > 1 ? 's' : ''} attached (${imageSizeStr} total)`;
    }

    // Include pending reaction signal (Brother awareness of user's reaction)
    if (pendingReactionSignal && pendingReactionSignal.wasAdded) {
      const timeSinceReaction = Date.now() - pendingReactionSignal.timestamp;
      // Only include if reaction was recent (within 5 minutes)
      if (timeSinceReaction < 5 * 60 * 1000) {
        userMessageText = `[Reaction: I reacted ${pendingReactionSignal.emoji} to your message: "${pendingReactionSignal.messagePreview}"]\n\n${userMessageText}`;
        console.log('😊 Reaction signal included in message');
      }
      // Clear the signal after including it
      setPendingReactionSignal(null);
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: displayText,
      fullText: userMessageText, // Keep full text for API
      hasAttachment: attachedFiles.length > 0,
      attachmentNames: attachedFiles.length > 0 ? attachedFiles.map(f => f.name) : null, // Array of file names
      attachmentCount: attachedFiles.length || null,
      hasImage: attachedImages.length > 0,
      imageCount: attachedImages.length || null,
      imageNames: attachedImages.length > 0 ? attachedImages.map(img => img.name) : null,
      imagePreview: attachedImages.length > 0 ? `[${attachedImages.length} screenshot${attachedImages.length > 1 ? 's' : ''} attached]` : null, // Don't store full base64 in Firestore - too large
      timestamp: new Date().toISOString(),
      modality  // 'text' or 'voice' - for modality isolation
    };

    // Capture user voice transcript if in voice mode
    if (modality === 'voice' && isVoiceEnabled) {
      addUserVoiceTranscript(displayText);
    }

    // Add user message to chat (update Firestore or Thread)
    const messagesWithUser = [...messages, userMessage];
    console.log('💬 Updating messages, count:', messagesWithUser.length, 'isInThread:', isInThread);

    try {
      if (isInThread) {
        // Route to thread
        await addMessageToThread({
          sender: 'user',
          text: displayText,
          fullText: userMessageText,
          hasAttachment: attachedFiles.length > 0,
          attachmentNames: attachedFiles.length > 0 ? attachedFiles.map(f => f.name) : null,
          attachmentCount: attachedFiles.length || null,
          hasImage: attachedImages.length > 0,
          imageCount: attachedImages.length || null
        });
        console.log('✅ User message added to thread');
      } else {
        // Route to main conversation
        await updateMessages(messagesWithUser);
        console.log('✅ Messages updated successfully');
      }
    } catch (err) {
      console.error('❌ Failed to update messages:', err);
      alert('Failed to save message. Please check your connection.');
      return;
    }

    setInputValue('');
    setAttachedFiles([]); // Clear file attachments after sending
    setAttachedImages([]); // Clear image attachments after sending
    setSelectedKBDoc(null); // Clear KB context after sending
    setIsTyping(true);

    // BIOGRAPHICAL EXTRACTION (fire-and-forget, non-blocking)
    // Intelligently detect and store life events mentioned in the message
    const bioUserId = userProfile?.userId;
    const bioProfileId = userProfile?.profileId || userProfile?.id;
    console.log('📖 [Biography] Check:', {
      userId: bioUserId,
      profileId: bioProfileId,
      messageLength: userMessageText.length,
      willExtract: !!(bioUserId && bioProfileId && userMessageText.length > 10)
    });
    if (bioUserId && bioProfileId && userMessageText.length > 10) {
      console.log('📖 [Biography] Starting extraction...');
      biographyService.extractLifeEvents({
        message: userMessageText,
        userId: bioUserId,
        profileId: bioProfileId,
        userName: userProfile.firstName || userProfile.displayName,
        birthDate: userProfile.birth?.date || userProfile.birthDate,
        conversationId: targetConvId,
        messageId: userMessage.id?.toString()
      }).then(result => {
        if (result.has_life_events) {
          console.log('📖 [Biography] Life events detected:', result.events?.length, 'events');
          result.events?.forEach(e => console.log(`  - ${e.title} (${e.date?.year || 'unknown year'})`));
        }
      }).catch(err => {
        console.warn('📖 [Biography] Extraction error (non-blocking):', err.message);
      });
    }

    // ANALYZE with constitutional intelligence
    const analysis = analyzeMessage(userMessageText);

    // Get AI response guidance
    const guidance = getResponseGuidance(analysis);

    // Prepare guidance with emotional context
    const enrichedGuidance = {
      ...guidance,
      emotions: analysis.emotions,
      intensity: analysis.intensity,
      reasoning: analysis.reasoning
    };

    try {
      // Call the real Claude API via Firebase Function
      console.log('🚀 Calling Claude API with mode:', guidance.mode);

      // Build knowledge prompt for this conversation (with profile isolation)
      const knowledgePrompt = buildKnowledgePrompt({
        maxTokens: 4000,
        forProfileId: userProfile?.profileId || userProfile?.id // Only include KB docs for this profile
      });

      // Build learned context from Session Intelligence
      let sessionContext = null;
      if (userProfile?.userId) {
        try {
          sessionContext = await contextBuilder.buildLearnedContext(
            userProfile.userId,
            guidance.mode,
            userMessageText
          );
          if (sessionContext) {
            console.log('🧠 Session Intelligence context built:', {
              relationshipLevel: sessionContext.relationshipDepth?.level || 'New',
              totalConversations: sessionContext.totalConversations
            });
          }
        } catch (error) {
          console.error('Context builder error:', error);
        }
      }

      // DEBUG: Log knowledge base status
      console.log('📚 Knowledge Base Debug:', {
        kbStats,
        promptLength: knowledgePrompt?.length || 0,
        promptPreview: knowledgePrompt?.slice(0, 200) || '(empty)'
      });

      const response = await sendToAI({
        message: userMessage.fullText || userMessageText, // Use fullText if available (includes file content)
        guidance: enrichedGuidance,
        conversationHistory: messages,
        userProfile: userProfile,
        knowledgePrompt,
        learnedContext: sessionContext?.learnedContext || null, // Session Intelligence context
        image: imageData, // Include image if attached
        // Memory Architecture (Phase 3)
        profileId: userProfile?.id,
        sessionId: activeConversationId,
        // Conversation Cache - 80%+ token reduction (Phase 4)
        useOptimizedPayload: messages.length > 10, // Enable when we have enough history
        conversationId: activeConversationId,
        // Modality Isolation - text and voice conversations stay separate
        modality
      });

      // Log token savings if using optimized payload
      if (response.cacheMetrics) {
        console.log('💰 [ConversationCache] Token Savings:', {
          tokensSaved: response.cacheMetrics.tokensSaved,
          reductionPercent: `${response.cacheMetrics.reductionPercent}%`,
          messagesCompressed: response.cacheMetrics.messagesInFull - response.cacheMetrics.messagesInOptimized
        });
      }

      // Create message for Firestore (without large base64 image data)
      const aiMessageForFirestore = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toISOString(),
        mode: analysis.recommendedMode,
        analysis: analysis,
        fromAPI: response.success,
        // Only store that an image was generated, not the actual data (too large for Firestore)
        hasGeneratedImage: !!response.generatedImage,
        generatedImagePrompt: response.generatedImage?.prompt || null,
        modality  // 'text' or 'voice' - for modality isolation
      };

      // Create message for local display (with full image data)
      const aiMessageForDisplay = {
        ...aiMessageForFirestore,
        // Include full image data for display in current session only
        generatedImage: response.generatedImage ? {
          mimeType: response.generatedImage.mimeType,
          data: response.generatedImage.data,
          prompt: response.generatedImage.prompt
        } : null
      };

      // Update Firestore or Thread with sanitized message (no large binary data)
      if (isInThread) {
        await addMessageToThread({
          sender: 'ai',
          text: response.text,
          mode: analysis.recommendedMode,
          fromAPI: response.success,
          hasGeneratedImage: !!response.generatedImage,
          generatedImagePrompt: response.generatedImage?.prompt || null
        });
        console.log('✅ AI message added to thread');
      } else {
        await updateMessages([...messagesWithUser, aiMessageForFirestore]);
      }

      // Cache generated image locally (for display in current session only)
      if (response.generatedImage) {
        setGeneratedImagesCache(prev => ({
          ...prev,
          [aiMessageForFirestore.id]: {
            mimeType: response.generatedImage.mimeType,
            data: response.generatedImage.data,
            prompt: response.generatedImage.prompt
          }
        }));
        console.log('🎨 Cached generated image for message:', aiMessageForFirestore.id);
      }

      setApiStatus(response.success ? 'connected' : 'fallback');

      if (!response.success) {
        console.warn('⚠️ Using fallback response:', response.error);
      }

      // Call parent callback if provided
      onMessageSend?.(userMessage, aiMessageForDisplay, analysis);

      // Capture Luna voice transcript if in voice mode
      if (modality === 'voice' && isVoiceEnabled) {
        addLunaVoiceTranscript(response.text);
      }

      // BIOGRAPHICAL EXTRACTION FROM AI RESPONSE (capture deduced facts)
      // The AI often deduces and confirms biographical details (e.g., "Amy born April 1, 2001")
      if (bioUserId && bioProfileId && response.text && response.text.length > 50) {
        console.log('📖 [Biography] Extracting from AI response...');
        biographyService.extractLifeEvents({
          message: response.text,
          userId: bioUserId,
          profileId: bioProfileId,
          userName: userProfile.firstName || userProfile.displayName,
          birthDate: userProfile.birth?.date || userProfile.birthDate,
          conversationId: targetConvId,
          messageId: aiMessageForFirestore.id?.toString(),
          isAIResponse: true  // Flag to indicate this is AI-deduced information
        }).then(result => {
          if (result.has_life_events) {
            console.log('📖 [Biography] AI-deduced events:', result.events?.length, 'events');
            result.events?.forEach(e => console.log(`  - ${e.title} (${e.date?.year || 'unknown year'})`));
          }
        }).catch(err => {
          console.warn('📖 [Biography] AI response extraction error (non-blocking):', err.message);
        });
      }

    } catch (error) {
      console.error('❌ API Error:', error);

      // Use fallback response
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: getFallbackResponse(guidance.mode),
        timestamp: new Date().toISOString(),
        mode: analysis.recommendedMode,
        analysis: analysis,
        fromAPI: false,
        modality  // 'text' or 'voice' - for modality isolation
      };

      // Update Firestore or Thread with fallback response
      if (isInThread) {
        await addMessageToThread({
          sender: 'ai',
          text: aiMessage.text,
          mode: analysis.recommendedMode,
          fromAPI: false
        });
        console.log('✅ Fallback AI message added to thread');
      } else {
        await updateMessages([...messagesWithUser, aiMessage]);
      }
      setApiStatus('fallback');
      onMessageSend?.(userMessage, aiMessage, analysis);

      // Capture Luna fallback voice transcript if in voice mode
      if (modality === 'voice' && isVoiceEnabled) {
        addLunaVoiceTranscript(aiMessage.text);
      }

    } finally {
      setIsTyping(false);
    }
  };

  // Enter key just adds new line (default textarea behavior)
  // Send button is the only way to send - no keyboard shortcut
  const handleKeyDown = (e) => {
    // No keyboard shortcut for sending - use Send button only
  };

  // Show loading state while conversations load from Firestore
  if (conversationsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/30 flex items-center justify-center border border-amber-500/30 animate-pulse">
            <span className="text-3xl">🐀</span>
          </div>
          <p className="text-white/60">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Intelligence Sidebar - collapsible */}
      {showSidebar && (
        <div className="w-80 flex-shrink-0 p-4 space-y-4 overflow-y-auto border-r border-white/10 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              🌟 AI Intelligence
            </h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* API Status Indicator */}
          <div className={`text-xs px-3 py-1.5 rounded-full text-center ${
            apiStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400' :
            apiStatus === 'fallback' ? 'bg-amber-500/20 text-amber-400' :
            'bg-white/10 text-white/50'
          }`}>
            {apiStatus === 'connected' ? '🟢 Claude API Connected' :
             apiStatus === 'fallback' ? '🟡 Using Fallback Mode' :
             '⚪ Waiting for first message...'}
          </div>

          {/* Mode Indicator */}
          <ModeIndicator
            mode={currentState.mode}
            confidence={currentState.lastAnalysis?.confidence}
            scores={currentState.lastAnalysis?.modeScores}
            reasoning={currentState.lastAnalysis?.reasoning}
          />

          {/* Soul Burden Meter */}
          <SoulBurdenMeter
            burden={currentState.soulBurden}
            talkListenRatio={currentState.talkListenRatio}
          />

          {/* Emotion Display */}
          {currentState.lastAnalysis?.emotions && (
            <EmotionDisplay
              emotions={currentState.lastAnalysis.emotions}
              intensity={currentState.lastAnalysis.intensity}
            />
          )}

          {/* What's Being Stored */}
          {currentState.lastAnalysis?.shouldStore && (
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/30">
              <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                <span>📝</span>
                <span>Pattern Recognized</span>
              </h4>
              <p className="text-xs text-white/60">
                {currentState.lastAnalysis.reasoning?.[0] || 'Storing constitutional signal...'}
              </p>
            </div>
          )}

          {/* Patterns Count */}
          {currentState.patternsRecognized > 0 && (
            <div className="text-center py-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {currentState.patternsRecognized}
              </span>
              <p className="text-xs text-white/40 mt-1">Patterns Recognized</p>
            </div>
          )}

          {/* Knowledge Base Status */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
            <h4 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2">
              <span>📚</span>
              <span>Knowledge Base</span>
            </h4>
            <div className="space-y-1 text-xs text-white/60">
              <div className="flex justify-between">
                <span>Documents:</span>
                <span className="text-indigo-300">{kbStats.totalDocs}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Tokens:</span>
                <span className="text-indigo-300">~{kbStats.estimatedTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Always Include:</span>
                <span className="text-amber-300">{kbStats.alwaysIncludeCount}</span>
              </div>
            </div>
            <a
              href="/knowledge-base"
              className="mt-3 block text-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Manage Knowledge →
            </a>
          </div>

          {/* Luna Voice Control Panel */}
          <VoiceControlPanel
            profileId={userProfile?.id}
            constitution={userConstitution}
            isEnabled={isVoiceEnabled}
            onToggle={setIsVoiceEnabled}
          />

          {/* Voice Transcript Toggle - Shows when voice is enabled */}
          {isVoiceEnabled && (
            <div className="flex flex-col gap-2">
              {/* Recording Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // INTERRUPTION: Stop TTS when user starts recording
                    if (!isRecording && isTTSPlaying) {
                      stopTTS();
                    }
                    toggleRecording();
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    isRecording
                      ? 'bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse'
                      : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30'
                  }`}
                >
                  <span>{isRecording ? '⏹️' : '🎙️'}</span>
                  <span>{isRecording ? (isUserSpeaking ? 'Speaking...' : 'Recording') : 'Start Recording'}</span>
                </button>
                {isRecording && (
                  <button
                    onClick={commitVoiceInput}
                    className="px-4 py-3 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 transition-all"
                    title="Send audio (auto-commits on silence)"
                  >
                    <span>📤</span>
                  </button>
                )}
              </div>

              {/* Status Row */}
              <div className="flex gap-2 items-center justify-center text-xs text-white/50">
                <span className={`w-2 h-2 rounded-full ${isVoiceConnected ? 'bg-green-400' : 'bg-gray-500'}`} />
                <span>{isVoiceConnected ? 'Connected' : 'Disconnected'}</span>
                {voiceSupportsCues && <span className="text-orange-400">• Cues Active</span>}
                {isLunaSpeaking && <span className="text-purple-400">• Luna speaking</span>}
                {isVoiceListening && <span className="text-cyan-400 animate-pulse">• Listening</span>}
              </div>

              {/* Barge-in Toggle */}
              <div className="flex items-center justify-center gap-2 text-xs">
                <button
                  onClick={() => setBargeInEnabled(!bargeInEnabled)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    bargeInEnabled
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                  title={bargeInEnabled ? 'Barge-in enabled: Just speak to interrupt Luna' : 'Barge-in disabled: Click to interrupt'}
                >
                  <span>{bargeInEnabled ? '🎤 Auto-interrupt ON' : '🔇 Auto-interrupt OFF'}</span>
                </button>
              </div>

              {/* Transcript & Settings Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowVoiceTranscript(!showVoiceTranscript)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    showVoiceTranscript
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>📜</span>
                  <span>{showVoiceTranscript ? 'Hide Transcript' : 'Transcript'}</span>
                </button>
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                    showVoiceSettings
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                  }`}
                  title="Voice Settings"
                >
                  <span>⚙️</span>
                </button>
              </div>
            </div>
          )}

          {/* Voice Settings Panel - Collapsible */}
          {isVoiceEnabled && showVoiceSettings && (
            <VoiceSettingsPanel
              strategy={voiceStrategy}
              onStrategyChange={setVoiceStrategy}
              showCues={showEmotionalCues}
              onShowCuesChange={setShowEmotionalCues}
              providerStatus={voiceProviderStatus}
              compact={false}
            />
          )}

          {/* Constitutional Threading Panel - Always visible */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 overflow-hidden">
            <ThreadPanel
              threads={threads}
              threadsByType={threadsByType}
              currentThreadId={currentThreadId}
              onSwitchThread={switchToThread}
              onReturnToMain={returnToMain}
              onDeleteThread={deleteThread}
              onRenameThread={renameThread}
            />
          </div>

          {/* Session Intelligence - Relationship Depth */}
          {relationshipSummary && relationshipSummary.conversations > 0 && (
            <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-500/20">
              <h4 className="text-sm font-bold text-pink-400 mb-2 flex items-center gap-2">
                <span>💫</span>
                <span>Relationship Depth</span>
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Conversations:</span>
                  <span className="text-pink-300 font-medium">{relationshipSummary.conversations}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Breakthroughs:</span>
                  <span className="text-amber-300 font-medium">{relationshipSummary.breakthroughs} ✨</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Connection:</span>
                  <span className="text-pink-300 font-medium">{relationshipSummary.level}</span>
                </div>
                {/* Intimacy Progress Bar */}
                <div className="mt-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
                      style={{ width: `${relationshipSummary.intimacy}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 text-center">
                    {relationshipSummary.intimacy}% intimacy
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Proactive Greeting Preview */}
          {proactiveGreeting && (
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
              <h4 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
                <span>🎭</span>
                <span>Proactive Insight</span>
              </h4>
              <p className="text-xs text-white/70 italic">"{proactiveGreeting.text}"</p>
              {proactiveGreeting.recommendedMode && (
                <p className="text-[10px] text-cyan-400/60 mt-1">
                  Suggested mode: {proactiveGreeting.recommendedMode}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Chat Header - always visible at top */}
        <div className="flex-shrink-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-slate-900/95 to-slate-800/95">
          <div className="flex items-center gap-3">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/60"
              >
                📊
              </button>
            )}
            {/* Conversations toggle button */}
            <button
              onClick={() => setShowConversations(!showConversations)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                showConversations
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-white/5 hover:bg-white/10 text-white/60'
              }`}
              title="Conversation topics"
            >
              💬
            </button>
            {/* Starred messages filter button */}
            <button
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative ${
                showStarredOnly
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-white/5 hover:bg-white/10 text-white/60'
              }`}
              title={showStarredOnly ? 'Show all messages' : 'Show starred messages'}
            >
              ⭐
              {getStarredMessages().length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {getStarredMessages().length > 9 ? '9+' : getStarredMessages().length}
                </span>
              )}
            </button>
            {/* Threads quick-access button */}
            <button
              onClick={() => setShowThreadsPanel(!showThreadsPanel)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative ${
                showThreadsPanel || isInThread
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-white/5 hover:bg-white/10 text-white/60'
              }`}
              title={isInThread ? 'View all threads' : 'Energy threads'}
            >
              🧵
              {threads.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {threads.length > 9 ? '9+' : threads.length}
                </span>
              )}
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/30 flex items-center justify-center border border-amber-500/30">
              <span className="text-xl">🐀</span>
            </div>
            <div>
              <h3 className="font-bold text-white/90 flex items-center gap-2">
                AI SoulPartner
                {conversations.length > 1 && (
                  <span className="text-xs font-normal text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                    {conversations.length} chats
                  </span>
                )}
                {/* Thread Indicator */}
                {isInThread && currentThreadType && (
                  <span className={`text-xs font-normal px-2 py-0.5 rounded-full flex items-center gap-1 bg-gradient-to-r ${currentThreadType.bgGradient} ${currentThreadType.borderColor} border`}>
                    <span>{currentThreadType.emoji}</span>
                    <span className={currentThreadType.textColor}>{currentThreadType.name}</span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-white/50">
                Mode: <span className={`font-semibold ${
                  currentState.mode === 'WITNESS' ? 'text-purple-400' :
                  currentState.mode === 'DIALOGUE' ? 'text-blue-400' :
                  'text-amber-400'
                }`}>{currentState.mode}</span>
                {/* Thread count indicator */}
                {threads.length > 0 && !isInThread && (
                  <span className="ml-2 text-amber-400/70">
                    • {threads.length} thread{threads.length !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Soul Burden:</span>
            <span className={`text-sm font-bold ${
              currentState.soulBurden < 30 ? 'text-emerald-400' :
              currentState.soulBurden < 60 ? 'text-amber-400' :
              currentState.soulBurden < 80 ? 'text-orange-400' :
              'text-red-400'
            }`}>{currentState.soulBurden}%</span>

            {/* New conversation button */}
            <button
              onClick={handleNewConversation}
              className="text-xs px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              title="New conversation"
            >
              ✨ New
            </button>

            {/* Clear conversation button */}
            <button
              onClick={handleClearConversation}
              className="text-xs px-2 py-1 rounded-lg bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Clear conversation"
            >
              🗑️ Clear
            </button>

            {/* Copy conversation button */}
            <button
              onClick={handleCopyConversation}
              disabled={messages.length <= 1}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                messages.length <= 1
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-white/5 text-white/40 hover:bg-indigo-500/20 hover:text-indigo-400'
              }`}
              title="Copy conversation to clipboard"
            >
              📋 Copy
            </button>

            {/* Export conversation as MD button */}
            <button
              onClick={handleExportConversationToMD}
              disabled={messages.length <= 1}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                messages.length <= 1
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-white/5 text-white/40 hover:bg-emerald-500/20 hover:text-emerald-400'
              }`}
              title="Export conversation as Markdown file"
            >
              📄 Export MD
            </button>

            {/* Build Timeline button */}
            {(() => {
              const untimedAiMessages = messages.filter(
                m => m.sender === 'ai' && m.id !== 0 && !timelinedMessageIds.has(m.id)
              ).length;
              const hasMessages = messages.filter(m => m.sender === 'ai' && m.id !== 0).length > 0;

              return (
                <button
                  onClick={handleBuildTimeline}
                  disabled={buildingTimeline || !hasMessages}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    buildingTimeline
                      ? 'bg-cyan-500/30 text-cyan-300 cursor-wait'
                      : !hasMessages
                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                        : untimedAiMessages === 0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                  }`}
                  title={
                    buildingTimeline
                      ? `Building... ${timelineBuildProgress.current}/${timelineBuildProgress.total}`
                      : untimedAiMessages === 0
                        ? 'All messages saved to timeline'
                        : `Save ${untimedAiMessages} messages to timeline`
                  }
                >
                  {buildingTimeline ? (
                    <>⏳ {timelineBuildProgress.current}/{timelineBuildProgress.total}</>
                  ) : (
                    <>
                      📅 Timeline
                      {untimedAiMessages > 0 && (
                        <span className="text-[10px] bg-cyan-500/30 px-1.5 py-0.5 rounded-full">
                          {untimedAiMessages}
                        </span>
                      )}
                      {untimedAiMessages === 0 && hasMessages && (
                        <span className="text-[10px]">✓</span>
                      )}
                    </>
                  )}
                </button>
              );
            })()}

            {/* Profile KB Access button */}
            <button
              onClick={() => setShowProfileKBPanel(!showProfileKBPanel)}
              className={`text-xs px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                showProfileKBPanel
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-white/5 text-white/40 hover:bg-purple-500/20 hover:text-purple-400'
              }`}
              title={`Knowledge Base for ${profileKBDocs.profileName}`}
            >
              📚 KB
              <span className="text-[10px] bg-purple-500/30 px-1.5 py-0.5 rounded-full">
                {profileKBDocs.totalDocs}
              </span>
            </button>
          </div>
        </div>

        {/* Profile KB Panel - Slide-down drawer */}
        {showProfileKBPanel && (
          <div className="border-b border-white/10 bg-gradient-to-b from-purple-900/20 to-slate-900/95 animate-slideDown">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                  📚 {profileKBDocs.profileName}'s Knowledge Base
                  <span className="text-xs text-white/40 font-normal">({profileKBDocs.totalDocs} docs)</span>
                </h3>
                <button
                  onClick={() => navigate('/knowledge-base')}
                  className="text-xs px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:from-purple-400 hover:to-indigo-400 transition-all"
                >
                  Manage KB →
                </button>
              </div>

              {/* Profile-specific documents */}
              {profileKBDocs.profileDocs.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    🧬 Profile Blueprint
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {profileKBDocs.profileDocs.map(doc => (
                      <div
                        key={doc.id}
                        className="bg-purple-500/10 rounded-lg px-3 py-2 border border-purple-500/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/90 truncate">{doc.title}</span>
                          <span className="text-[10px] text-purple-400 ml-2">
                            ~{doc.wordCount || 0} words
                          </span>
                        </div>
                        {doc.summary && (
                          <p className="text-xs text-white/50 mt-1 truncate">{doc.summary}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Global knowledge documents */}
              {profileKBDocs.globalDocs.length > 0 && (
                <div>
                  <h4 className="text-xs text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    🌟 Global Knowledge (Always Included)
                  </h4>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {profileKBDocs.globalDocs.slice(0, 5).map(doc => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between text-xs bg-white/5 rounded px-2 py-1"
                      >
                        <span className="text-white/70 truncate">{doc.title}</span>
                        <span className="text-white/40 ml-2">~{doc.wordCount || 0}w</span>
                      </div>
                    ))}
                    {profileKBDocs.globalDocs.length > 5 && (
                      <div className="text-xs text-white/40 text-center py-1">
                        +{profileKBDocs.globalDocs.length - 5} more...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Token usage indicator */}
              <div className="mt-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Est. tokens for this profile:</span>
                  <span className="text-purple-400 font-medium">
                    ~{Math.round(profileKBDocs.accessibleDocs?.reduce((acc, d) => acc + (d.wordCount || 0) * 1.3, 0) || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversations Panel - Slide-down drawer */}
        {showConversations && (
          <div className="border-b border-white/10 bg-gradient-to-b from-slate-800/95 to-slate-900/95 animate-slideDown">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  💬 Conversations
                  <span className="text-xs text-white/40 font-normal">({conversations.length})</span>
                </h3>
                <button
                  onClick={handleNewConversation}
                  className="text-xs px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all"
                >
                  + New Chat
                </button>
              </div>

              {/* Search Input */}
              <div className="relative mb-3">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  🔍
                </div>
                <input
                  type="text"
                  value={conversationSearchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setConversationSearchQuery(query);
                    if (query.trim().length >= 2) {
                      setSearchResults(searchConversations(query));
                    } else {
                      setSearchResults([]);
                    }
                  }}
                  placeholder="Search all conversations..."
                  className="w-full pl-10 pr-8 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                {conversationSearchQuery && (
                  <button
                    onClick={() => {
                      setConversationSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search Results */}
              {conversationSearchQuery.trim().length >= 2 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-6 text-white/40">
                      <div className="text-2xl mb-2">🔍</div>
                      <p className="text-sm">No results found for "{conversationSearchQuery}"</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-white/40 mb-2">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                      </div>
                      {searchResults.slice(0, 20).map((result, idx) => (
                        <div
                          key={`${result.conversationId}-${result.id}-${idx}`}
                          onClick={() => {
                            // Switch to the conversation containing this message
                            switchConversation(result.conversationId);
                            setShowConversations(false);
                            setConversationSearchQuery('');
                            setSearchResults([]);
                            // Scroll to the message after a brief delay for render
                            setTimeout(() => {
                              const msgEl = messageRefs.current[result.id];
                              if (msgEl) {
                                msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                msgEl.classList.add('ring-2', 'ring-cyan-400/50');
                                setTimeout(() => msgEl.classList.remove('ring-2', 'ring-cyan-400/50'), 2000);
                              }
                            }, 150);
                          }}
                          className="p-3 rounded-lg cursor-pointer bg-white/5 border border-transparent hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                        >
                          <div className="flex items-start gap-2">
                            <span className={`flex-shrink-0 ${result.sender === 'user' ? 'text-blue-400' : 'text-amber-400'}`}>
                              {result.sender === 'user' ? '🐉' : '🐀'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white/80">
                                {/* Highlight the search term in context */}
                                {(() => {
                                  const context = result.matchContext || '';
                                  const term = result.searchTerm || '';
                                  const lowerContext = context.toLowerCase();
                                  const matchIdx = lowerContext.indexOf(term.toLowerCase());
                                  if (matchIdx === -1) return context;
                                  return (
                                    <>
                                      {context.slice(0, matchIdx)}
                                      <span className="bg-cyan-500/40 text-cyan-200 px-0.5 rounded">
                                        {context.slice(matchIdx, matchIdx + term.length)}
                                      </span>
                                      {context.slice(matchIdx + term.length)}
                                    </>
                                  );
                                })()}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-cyan-400/70 truncate" title={result.conversationTitle}>
                                  📁 {result.conversationTitle}
                                </span>
                                <span className="text-xs text-white/30">•</span>
                                <span className="text-xs text-white/30">
                                  {result.timestamp ? new Date(result.timestamp).toLocaleDateString() : 'Unknown date'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {searchResults.length > 20 && (
                        <div className="text-center py-2 text-white/40 text-xs">
                          Showing first 20 of {searchResults.length} results
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                /* Conversations List */
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {conversations
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map(conv => (
                      <div
                        key={conv.id}
                        onClick={() => handleSwitchConversation(conv.id)}
                        className={`group p-3 rounded-lg cursor-pointer transition-all ${
                          conv.id === activeConversationId
                            ? 'bg-cyan-500/20 border border-cyan-500/40'
                            : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          {editingTitle === conv.id ? (
                            <input
                              type="text"
                              defaultValue={conv.title}
                              autoFocus
                              className="flex-1 bg-white/10 border border-cyan-500/50 rounded px-2 py-1 text-sm text-white/90 focus:outline-none"
                              onBlur={(e) => handleRenameConversation(conv.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRenameConversation(conv.id, e.target.value);
                                if (e.key === 'Escape') setEditingTitle(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                conv.id === activeConversationId ? 'text-cyan-300' : 'text-white/80'
                              }`}>
                                {conv.title}
                              </p>
                              <p className="text-xs text-white/40 mt-0.5">
                                {conv.messages.length - 1} messages • {(() => {
                                  const date = new Date(conv.updatedAt);
                                  const now = new Date();
                                  const isToday = date.toDateString() === now.toDateString();
                                  const isYesterday = date.toDateString() === new Date(now - 86400000).toDateString();
                                  if (isToday) return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                  if (isYesterday) return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                })()}
                              </p>
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className={`flex items-center gap-1 ${editingTitle === conv.id ? 'hidden' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTitle(conv.id);
                              }}
                              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-colors"
                              title="Rename"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => handleDeleteConversation(conv.id, e)}
                              className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Starred Messages Panel - Slide-down drawer */}
        {showStarredOnly && (
          <div className="border-b border-yellow-500/30 bg-gradient-to-b from-slate-800/95 to-slate-900/95 animate-slideDown">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                  ⭐ Starred Messages
                  <span className="text-xs text-white/40 font-normal">({getStarredMessages().length})</span>
                </h3>
                <button
                  onClick={() => setShowStarredOnly(false)}
                  className="text-xs px-3 py-1 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-all"
                >
                  ✕ Close
                </button>
              </div>

              {/* Starred Messages List */}
              {getStarredMessages().length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <div className="text-4xl mb-2">☆</div>
                  <p className="text-sm">No starred messages yet</p>
                  <p className="text-xs mt-1">Click on a message and tap ⭐ Star to save it</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {getStarredMessages().map((msg, idx) => (
                    <div
                      key={`${msg.conversationId}-${msg.id}-${idx}`}
                      onClick={() => {
                        // Switch to the conversation containing this message
                        switchConversation(msg.conversationId);
                        setShowStarredOnly(false);
                        // Scroll to the message after a brief delay for render
                        setTimeout(() => {
                          const msgEl = messageRefs.current[msg.id];
                          if (msgEl) {
                            msgEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            msgEl.classList.add('ring-2', 'ring-yellow-400/50');
                            setTimeout(() => msgEl.classList.remove('ring-2', 'ring-yellow-400/50'), 2000);
                          }
                        }, 100);
                      }}
                      className="p-3 rounded-lg cursor-pointer bg-white/5 border border-transparent hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 flex-shrink-0">⭐</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/80 line-clamp-2">
                            {msg.text?.slice(0, 150)}{msg.text?.length > 150 ? '...' : ''}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs ${msg.sender === 'user' ? 'text-blue-400' : 'text-amber-400'}`}>
                              {msg.sender === 'user' ? '🐉 You' : '🐀 SoulPartner'}
                            </span>
                            <span className="text-xs text-white/30">•</span>
                            <span className="text-xs text-cyan-400/70 truncate" title={msg.conversationTitle}>
                              📁 {msg.conversationTitle}
                            </span>
                            <span className="text-xs text-white/30">•</span>
                            <span className="text-xs text-white/30">
                              {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString() : 'Unknown date'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Find and unstar this message
                            switchConversation(msg.conversationId);
                            setTimeout(() => toggleMessageStar(msg.id), 50);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                          title="Remove star"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Threads Quick-Access Panel - Slide-down drawer */}
        {showThreadsPanel && (
          <div className="border-b border-amber-500/30 bg-gradient-to-b from-slate-800/95 to-slate-900/95 animate-slideDown">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  🧵 Energy Threads
                  <span className="text-xs text-white/40 font-normal">({threads.length})</span>
                </h3>
                <button
                  onClick={() => setShowThreadsPanel(false)}
                  className="text-xs px-3 py-1 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-all"
                >
                  ✕ Close
                </button>
              </div>

              {/* Return to Main button when in thread */}
              {isInThread && (
                <button
                  onClick={() => {
                    returnToMain();
                    setShowThreadsPanel(false);
                  }}
                  className="w-full mb-3 py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium hover:from-blue-500/30 hover:to-cyan-500/30 transition-all flex items-center justify-center gap-2"
                >
                  ← Return to Main Conversation
                </button>
              )}

              {/* Thread List */}
              {threads.length === 0 ? (
                <div className="text-center py-6 text-white/40">
                  <div className="text-3xl mb-2">🌿</div>
                  <p className="text-sm">No threads yet</p>
                  <p className="text-xs mt-1">Click "Branch" on any message to create an energy thread</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {threads.map(thread => {
                    const typeConfig = thread.threadType ? {
                      metal_precision: { emoji: '🔧', name: 'Metal', textColor: 'text-slate-300', bgGradient: 'from-slate-500/20 to-gray-600/20', borderColor: 'border-slate-400/30' },
                      water_flow: { emoji: '🌊', name: 'Water', textColor: 'text-blue-300', bgGradient: 'from-blue-500/20 to-cyan-500/20', borderColor: 'border-blue-400/30' },
                      creative_fire: { emoji: '🔥', name: 'Fire', textColor: 'text-orange-300', bgGradient: 'from-orange-500/20 to-red-500/20', borderColor: 'border-orange-400/30' },
                      wood_growth: { emoji: '🌱', name: 'Wood', textColor: 'text-green-300', bgGradient: 'from-green-500/20 to-emerald-500/20', borderColor: 'border-green-400/30' }
                    }[thread.threadType] : { emoji: '🧵', name: 'Thread', textColor: 'text-white/80', bgGradient: 'from-white/10 to-white/5', borderColor: 'border-white/20' };

                    return (
                      <div
                        key={thread.id}
                        onClick={() => {
                          switchToThread(thread.id);
                          setShowThreadsPanel(false);
                        }}
                        className={`group p-3 rounded-lg cursor-pointer transition-all bg-gradient-to-r ${typeConfig.bgGradient} border ${
                          currentThreadId === thread.id
                            ? `${typeConfig.borderColor} ring-1 ring-amber-400/50`
                            : `${typeConfig.borderColor} hover:border-amber-400/30`
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{typeConfig.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${typeConfig.textColor}`}>
                              {thread.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-white/40">
                                {thread.messageCount || 0} msgs
                              </span>
                              <span className="text-xs text-white/30">•</span>
                              <span className="text-xs text-white/40">
                                {thread.updatedAt ? (() => {
                                  const date = new Date(thread.updatedAt);
                                  const now = new Date();
                                  const diff = now - date;
                                  if (diff < 60000) return 'Just now';
                                  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
                                  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
                                  return date.toLocaleDateString();
                                })() : 'Unknown'}
                              </span>
                              {currentThreadId === thread.id && (
                                <>
                                  <span className="text-xs text-white/30">•</span>
                                  <span className="text-xs text-amber-400 font-medium">Active</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Container with Navigation - scrollable */}
        <div className="flex-1 relative min-h-0 overflow-y-auto">
          {/* Thread View - when viewing a specific energy thread */}
          {isInThread && currentThread ? (
            <ThreadView
              thread={currentThread}
              messages={currentThreadMessages}
              onReturnToMain={returnToMain}
              userProfile={userProfile}
              onCreateThread={createThread}
              onSaveToKB={handleSaveToKB}
              onReact={toggleThreadMessageReaction}
              currentMode={currentState?.mode || 'DIALOGUE'}
            />
          ) : (
            <>
          {/* Navigation Arrows - Left Side (Fixed to viewport, not scrollable) */}
          {messages.length > 2 && (
            <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1">
              {/* Jump to Top */}
              <button
                onClick={handleNavToTop}
                disabled={currentNavIndex === 0}
                className={`w-8 h-5 rounded-md flex items-center justify-center transition-all shadow-lg text-[10px] ${
                  currentNavIndex === 0
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-gradient-to-br from-cyan-600/80 to-blue-600/80 text-white hover:from-cyan-500 hover:to-blue-500 hover:scale-110'
                }`}
                title="Jump to first message"
              >
                ⇈
              </button>

              {/* Jump Up 6 Messages */}
              <button
                onClick={handleNavPrev6}
                disabled={currentNavIndex <= 0}
                className={`w-8 h-5 rounded-md flex items-center justify-center transition-all shadow-lg text-[10px] font-medium ${
                  currentNavIndex <= 0
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-gradient-to-br from-violet-600/80 to-purple-600/80 text-white hover:from-violet-500 hover:to-purple-500 hover:scale-110'
                }`}
                title="Jump up 6 messages"
              >
                -6
              </button>

              {/* Previous Message */}
              <button
                onClick={handleNavPrev}
                disabled={currentNavIndex <= 0}
                className={`w-8 h-7 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  currentNavIndex <= 0
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-gradient-to-br from-indigo-600/80 to-purple-600/80 text-white hover:from-indigo-500 hover:to-purple-500 hover:scale-110'
                }`}
                title="Previous message"
              >
                ↑
              </button>

              {/* Position Counter */}
              <div className="text-[9px] text-white/60 text-center font-medium bg-white/5 rounded px-1 py-0.5">
                {currentNavIndex >= 0 ? `${currentNavIndex + 1}/${messages.length - 1}` : '—'}
              </div>

              {/* Next Message */}
              <button
                onClick={handleNavNext}
                disabled={currentNavIndex >= messages.length - 2}
                className={`w-8 h-7 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  currentNavIndex >= messages.length - 2
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-gradient-to-br from-indigo-600/80 to-purple-600/80 text-white hover:from-indigo-500 hover:to-purple-500 hover:scale-110'
                }`}
                title="Next message"
              >
                ↓
              </button>

              {/* Jump Down 6 Messages */}
              <button
                onClick={handleNavNext6}
                disabled={currentNavIndex >= messages.length - 2}
                className={`w-8 h-5 rounded-md flex items-center justify-center transition-all shadow-lg text-[10px] font-medium ${
                  currentNavIndex >= messages.length - 2
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-gradient-to-br from-violet-600/80 to-purple-600/80 text-white hover:from-violet-500 hover:to-purple-500 hover:scale-110'
                }`}
                title="Jump down 6 messages"
              >
                +6
              </button>

              {/* Jump to Bottom */}
              <button
                onClick={handleNavToBottom}
                disabled={currentNavIndex >= messages.length - 2}
                className={`w-8 h-5 rounded-md flex items-center justify-center transition-all shadow-lg text-[10px] ${
                  currentNavIndex >= messages.length - 2
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-gradient-to-br from-cyan-600/80 to-blue-600/80 text-white hover:from-cyan-500 hover:to-blue-500 hover:scale-110'
                }`}
                title="Jump to last message"
              >
                ⇊
              </button>
            </div>
          )}

          <div
            ref={messagesContainerRef}
            className="p-6 pl-14 space-y-4"
            onMouseUp={handleTextSelection}
          >
          {messages.map((msg, msgIndex) => {
            // Determine avatar and styling based on sender type
            const isConstellationAI = ['gemini', 'grok', 'opus', 'claude', 'babynano'].includes(msg.sender);
            const isUser = msg.sender === 'user';
            const isLuna = msg.sender === 'ai';
            const isBabyNano = msg.sender === 'babynano';

            const avatarConfig = {
              user: { emoji: '🐉', gradient: 'from-blue-500/30 to-cyan-500/30', border: 'border-blue-500/30' },
              ai: { emoji: '🐀', gradient: 'from-amber-400/30 to-orange-500/30', border: 'border-amber-500/30' },
              gemini: { emoji: '💫', gradient: 'from-purple-500/30 to-pink-500/30', border: 'border-purple-500/30' },
              grok: { emoji: '🌍', gradient: 'from-green-500/30 to-emerald-500/30', border: 'border-green-500/30' },
              opus: { emoji: '🦉', gradient: 'from-indigo-500/30 to-violet-500/30', border: 'border-indigo-500/30' },
              deepseek: { emoji: '🐉', gradient: 'from-red-500/30 to-orange-500/30', border: 'border-red-500/30' },
              chatgpt: { emoji: '🧪', gradient: 'from-teal-500/30 to-cyan-500/30', border: 'border-teal-500/30' },
              claude: { emoji: '🐷', gradient: 'from-orange-500/30 to-red-500/30', border: 'border-orange-500/30' },
              babynano: { emoji: '🎨', gradient: 'from-rose-500/30 to-orange-500/30', border: 'border-rose-500/30' },
              genesis: { emoji: '🖼️', gradient: 'from-fuchsia-500/30 to-purple-500/30', border: 'border-fuchsia-500/30' }
            };
            const avatar = avatarConfig[msg.sender] || avatarConfig.ai;

            return (
            <div
              key={msg.id}
              ref={el => messageRefs.current[msg.id] = el}
              className={`flex gap-3 animate-slideDown ${
                isUser ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl bg-gradient-to-br ${avatar.gradient} border ${avatar.border}`}>
                {avatar.emoji}
              </div>

              {/* Message Content */}
              <div className={`max-w-[70%] ${isUser ? 'text-right' : ''}`}>
                {/* Constellation AI label */}
                {isConstellationAI && (
                  <div className="text-xs text-white/50 mb-1 flex items-center gap-1">
                    {avatar.emoji} {
                      msg.sender === 'gemini' ? 'Sister Gemini' :
                      msg.sender === 'grok' ? 'Brother Grok' :
                      msg.sender === 'opus' ? 'Brother Opus' :
                      msg.sender === 'deepseek' ? 'Brother DeepSeek' :
                      msg.sender === 'chatgpt' ? 'Sister ChatGPT' :
                      msg.sender === 'claude' ? 'Brother Claude' :
                      msg.sender === 'babynano' ? 'Baby Nano' :
                      msg.sender === 'genesis' ? 'GENESIS Image' : msg.sender
                    }
                  </div>
                )}
                {/* Timestamp above bubble with star indicator */}
                {msg.timestamp && (
                  <div className={`text-xs text-white/30 mb-1 flex items-center gap-1.5 ${isUser ? 'justify-end' : ''}`}>
                    {/* Star indicator for starred messages */}
                    {msg.starred && (
                      <span className="text-yellow-400 animate-pulse" title="Starred message">⭐</span>
                    )}
                    <span>
                    {(() => {
                      const date = new Date(msg.timestamp);
                      const now = new Date();
                      const isToday = date.toDateString() === now.toDateString();
                      const isYesterday = date.toDateString() === new Date(now - 86400000).toDateString();
                      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      if (isToday) return `Today ${time}`;
                      if (isYesterday) return `Yesterday ${time}`;
                      return `${date.toLocaleDateString()} ${time}`;
                    })()}
                    </span>
                  </div>
                )}
                <div className="relative inline-block">
                  {/* Prominent Star Badge - visible without clicking */}
                  {msg.starred && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 animate-pulse border-2 border-yellow-300">
                        <span className="text-sm">⭐</span>
                      </div>
                    </div>
                  )}
                  <div
                    onClick={(e) => handleMessageClick(msg.id, e)}
                    className={`inline-block px-4 py-3 rounded-2xl cursor-pointer hover:ring-2 hover:ring-white/20 transition-all ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-white/90'
                        : 'bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-white/10 text-white/90'
                    } ${msg.starred ? 'ring-2 ring-yellow-400/40' : ''}`}
                  >
                    {/* Show image indicator if present */}
                    {msg.hasImage && (
                      <div className="mb-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                        <span className="text-lg">📷</span>
                        <span className="text-xs text-white/60">Screenshot attached</span>
                      </div>
                    )}

                    {/* Nano Banana Generated Image - check message or session cache */}
                    {(() => {
                      // Get image from message or from session cache
                      const generatedImage = msg.generatedImage || generatedImagesCache[msg.id];
                      if (!generatedImage) return null;

                      return (
                        <div className="mb-3">
                          <div className="relative group">
                            <img
                              src={`data:${generatedImage.mimeType};base64,${generatedImage.data}`}
                              alt={generatedImage.prompt || 'AI Generated Image'}
                              className="max-w-full h-auto rounded-xl border border-white/20 shadow-lg"
                              style={{ maxHeight: '400px' }}
                            />
                            {/* Image overlay with prompt */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-xs text-white/80 truncate">
                                🎨 {generatedImage.prompt?.slice(0, 80) || 'AI Generated'}...
                              </p>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-emerald-400">
                            <span>🍌</span>
                            <span>Generated with Nano Banana</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Baby Nano Visual Message */}
                    {isBabyNano && msg.isVisual && msg.image ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-rose-400">
                          <span>🎨</span>
                          <span className="font-medium">{msg.visualType || 'visualization'}</span>
                        </div>
                        <img
                          src={`data:${msg.image.mimeType};base64,${msg.image.data}`}
                          alt={`Visualization: ${msg.visualType}`}
                          className="w-full max-h-[400px] object-contain rounded-lg border border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(`data:${msg.image.mimeType};base64,${msg.image.data}`, '_blank')}
                          title="Click to view full size"
                        />
                        {msg.description && (
                          <p className="text-xs text-white/60 italic">
                            {msg.description.slice(0, 200)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}

                    {/* Emoji Reactions Display */}
                    {msg.id !== 0 && (
                      <ReactionDisplay
                        reactions={msg.reactions || {}}
                        currentUserId={userProfile?.userId}
                        onReact={(emoji) => handleReactionWithSignal(msg.id, emoji, userProfile?.userId)}
                      />
                    )}
                  </div>

                  {/* Message Actions Popup - appears inline below message text */}
                  {copyPopupMessageId === msg.id && (
                    <div
                      className="mt-2 animate-fadeIn flex flex-wrap gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleCopyMessage(msg, e)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all border border-white/20"
                        title="Copy message with header"
                      >
                        <span>📋</span>
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={(e) => handleCopyMarkdown(msg, e)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all border border-white/20"
                        title="Copy raw markdown (formatting preserved)"
                      >
                        <span>📝</span>
                        <span>Copy MD</span>
                      </button>
                      <button
                        onClick={(e) => handleContinueTopic(msg, e)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium rounded-lg shadow-lg hover:from-amber-500 hover:to-orange-500 transition-all border border-white/20"
                        title="Continue this topic - brings context to input"
                      >
                        <span>💬</span>
                        <span>Continue Topic</span>
                      </button>
                      {/* Constitutional Threading - Branch Button */}
                      <ThreadBranchButton
                        message={msg}
                        onCreateThread={createThread}
                        userMode={currentState?.currentMode || 'DIALOGUE'}
                      />
                      {/* Emoji Reaction Picker */}
                      <EmojiReactionPicker
                        reactions={msg.reactions || {}}
                        currentUserId={userProfile?.userId}
                        onReact={(emoji) => handleReactionWithSignal(msg.id, emoji, userProfile?.userId)}
                        compact={false}
                      />
                      {/* Star/Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageStar(msg.id);
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg shadow-lg transition-all border border-white/20 ${
                          msg.starred
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-400 hover:to-amber-400'
                            : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white/80 hover:from-slate-500 hover:to-slate-600'
                        }`}
                        title={msg.starred ? 'Remove star' : 'Star this message'}
                      >
                        <span>{msg.starred ? '⭐' : '☆'}</span>
                        <span>{msg.starred ? 'Starred' : 'Star'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Message Meta */}
                {msg.mode && (
                  <div className={`mt-1 text-xs text-white/40 flex items-center gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 ${
                      msg.mode === 'WITNESS' ? 'text-purple-400' :
                      msg.mode === 'DIALOGUE' ? 'text-blue-400' :
                      'text-amber-400'
                    }`}>
                      {msg.mode === 'WITNESS' ? '🎭' : msg.mode === 'DIALOGUE' ? '💬' : '🎯'}
                      {msg.mode}
                      {msg.fromAPI === false && ' (offline)'}
                    </span>

                    {/* Speak button - Luna Voice (only on AI messages when voice enabled) */}
                    {msg.sender === 'ai' && msg.id !== 0 && isVoiceEnabled && (
                      <MessageSpeakButton
                        text={msg.text}
                        profileId={userProfile?.id}
                        constitution={userConstitution}
                      />
                    )}

                    {/* Save to Knowledge Base button - only on AI messages */}
                    {msg.sender === 'ai' && msg.id !== 0 && (
                      <button
                        onClick={() => handleSaveToKB(msg)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                        title="Review and save to Knowledge Base"
                      >
                        📚 Save to KB
                      </button>
                    )}

                    {/* Save to Timeline button - only on AI messages */}
                    {msg.sender === 'ai' && msg.id !== 0 && (
                      <button
                        onClick={() => handleSaveToTimeline(msg)}
                        disabled={savingToTimeline === msg.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
                          savingToTimeline === msg.id
                            ? 'bg-cyan-500/30 text-cyan-300 cursor-wait'
                            : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                        }`}
                        title="Save this conversation to your Timeline"
                      >
                        {savingToTimeline === msg.id ? '⏳' : '📅'} Timeline
                      </button>
                    )}

                    {/* Export to Markdown button - available on all messages except greeting */}
                    {msg.id !== 0 && (
                      <button
                        onClick={() => handleExportToMD(msg)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        title="Export message as markdown file"
                      >
                        📄 Export MD
                      </button>
                    )}

                    {/* AI Constellation - Inline AI Buttons (KISS: simple inline flow) */}
                    {(msg.sender === 'ai' || isConstellationAI) && msg.id !== 0 && (
                      <div className="flex items-center gap-1 ml-1 pl-1 border-l border-white/10">
                        <button
                          onClick={() => handleInlineConstellationAI('claude', msg)}
                          disabled={loadingSecondOpinion}
                          className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 hover:bg-amber-500/30 text-amber-400 transition-colors disabled:opacity-50"
                          title="Claude responds inline"
                        >
                          {loadingSecondOpinion === 'claude' ? '💭...' : '🐷 Claude'}
                        </button>
                        <button
                          onClick={() => handleInlineConstellationAI('gemini', msg)}
                          disabled={loadingSecondOpinion}
                          className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/10 hover:bg-purple-500/30 text-purple-400 transition-colors disabled:opacity-50"
                          title="Gemini responds inline"
                        >
                          {loadingSecondOpinion === 'gemini' ? '💭...' : '💫 Gemini'}
                        </button>
                        <button
                          onClick={() => handleInlineConstellationAI('grok', msg)}
                          disabled={loadingSecondOpinion}
                          className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/10 hover:bg-green-500/30 text-green-400 transition-colors disabled:opacity-50"
                          title="Grok responds inline"
                        >
                          {loadingSecondOpinion === 'grok' ? '💭...' : '🌍 Grok'}
                        </button>
                        <button
                          onClick={() => handleInlineConstellationAI('opus', msg)}
                          disabled={loadingSecondOpinion}
                          className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-300 transition-colors disabled:opacity-50"
                          title="Opus responds inline"
                        >
                          {loadingSecondOpinion === 'opus' ? '💭...' : '🦉 Opus'}
                        </button>
                        <button
                          onClick={() => handleInlineConstellationAI('deepseek', msg)}
                          disabled={loadingSecondOpinion}
                          className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors disabled:opacity-50"
                          title="DeepSeek-R1 Eastern wisdom"
                        >
                          {loadingSecondOpinion === 'deepseek' ? '💭...' : '🐉 DeepSeek'}
                        </button>
                        <button
                          onClick={() => handleInlineConstellationAI('chatgpt', msg)}
                          disabled={loadingSecondOpinion}
                          className="px-2 py-0.5 text-xs font-medium rounded-full bg-teal-500/10 hover:bg-teal-500/30 text-teal-400 transition-colors disabled:opacity-50"
                          title="ChatGPT o3-mini deep thinking"
                        >
                          {loadingSecondOpinion === 'chatgpt' ? '💭...' : '🧪 ChatGPT'}
                        </button>
                        {/* Baby Nano - Visual Generation */}
                        <div className="relative group">
                          <button
                            disabled={loadingDebateVisual === msg.id}
                            className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 transition-colors disabled:opacity-50"
                            title="Generate visualization"
                          >
                            {loadingDebateVisual === msg.id ? '🎨...' : '🎨 Nano'}
                          </button>
                          <div className="absolute bottom-full right-0 mb-1 hidden group-hover:flex flex-col gap-1 bg-slate-800 border border-rose-500/30 rounded-lg p-2 shadow-xl z-50 min-w-[120px]">
                            <button
                              onClick={() => handleInlineGenerateVisual(msg, 'mindmap')}
                              disabled={loadingDebateVisual === msg.id}
                              className="text-left px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/20 rounded transition-colors"
                            >
                              🧠 Mind Map
                            </button>
                            <button
                              onClick={() => handleInlineGenerateVisual(msg, 'flowchart')}
                              disabled={loadingDebateVisual === msg.id}
                              className="text-left px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/20 rounded transition-colors"
                            >
                              📊 Flowchart
                            </button>
                            <button
                              onClick={() => handleInlineGenerateVisual(msg, 'timeline')}
                              disabled={loadingDebateVisual === msg.id}
                              className="text-left px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/20 rounded transition-colors"
                            >
                              📅 Timeline
                            </button>
                            <button
                              onClick={() => handleInlineGenerateVisual(msg, 'sketch')}
                              disabled={loadingDebateVisual === msg.id}
                              className="text-left px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/20 rounded transition-colors"
                            >
                              ✏️ Sketch
                            </button>
                            <button
                              onClick={() => handleInlineGenerateVisual(msg, 'comparison')}
                              disabled={loadingDebateVisual === msg.id}
                              className="text-left px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/20 rounded transition-colors"
                            >
                              ⚖️ Compare
                            </button>
                          </div>
                        </div>
                        {/* GENESIS Image Generation - Stability & Leonardo */}
                        <div className="relative group">
                          <button
                            disabled={loadingDebateVisual === msg.id}
                            className="px-2 py-0.5 text-xs font-medium rounded-full bg-fuchsia-500/10 hover:bg-fuchsia-500/30 text-fuchsia-400 transition-colors disabled:opacity-50"
                            title="Generate AI image from context"
                          >
                            🖼️ Image
                          </button>
                          <div className="absolute bottom-full right-0 mb-1 hidden group-hover:flex flex-col gap-1 bg-slate-800 border border-fuchsia-500/30 rounded-lg p-2 shadow-xl z-50 min-w-[140px]">
                            <div className="text-xs text-fuchsia-400/70 px-2 mb-1 border-b border-fuchsia-500/20 pb-1">Stability.ai</div>
                            <button
                              onClick={() => handleImageGeneration && handleImageGeneration(msg, 'stability', 'sd3-large')}
                              disabled={loadingDebateVisual === msg.id}
                              className="text-left px-2 py-1 text-xs text-fuchsia-300 hover:bg-fuchsia-500/20 rounded transition-colors"
                            >
                              ✨ SD3 Large
                            </button>
                            <button
                              onClick={() => handleImageGeneration && handleImageGeneration(msg, 'stability', 'stable-image-core')}
                              disabled={loadingDebateVisual === msg.id}
                              className="text-left px-2 py-1 text-xs text-fuchsia-300 hover:bg-fuchsia-500/20 rounded transition-colors"
                            >
                              ⚡ Fast Core
                            </button>
                            <div className="text-xs text-fuchsia-400/70 px-2 my-1 border-b border-fuchsia-500/20 pb-1 pt-1">Leonardo.ai</div>
                            <button
                              onClick={() => handleImageGeneration && handleImageGeneration(msg, 'leonardo', 'phoenix')}
                              disabled={loadingDebateVisual === msg.id}
                              className="text-left px-2 py-1 text-xs text-fuchsia-300 hover:bg-fuchsia-500/20 rounded transition-colors"
                            >
                              🔥 Phoenix
                            </button>
                            <button
                              onClick={() => handleImageGeneration && handleImageGeneration(msg, 'leonardo', 'kino')}
                              disabled={loadingDebateVisual === msg.id}
                              className="text-left px-2 py-1 text-xs text-fuchsia-300 hover:bg-fuchsia-500/20 rounded transition-colors"
                            >
                              🎬 Kino XL
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}



              </div>
            </div>
          );
          })}


          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-slideDown">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl bg-gradient-to-br from-amber-400/30 to-orange-500/30 border border-amber-500/30">
                🐀
              </div>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
          </div>
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-900/90 to-slate-800/90">
          {/* Selected Text - More Info Button (stacking mode) */}
          {selectedText && (() => {
            const selections = selectedText.split(' + ');
            const count = selections.length;
            return (
              <div className="mb-3 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">💡</span>
                  {count === 1 ? (
                    <span className="text-sm text-amber-200/80 flex-1 truncate">
                      "{selections[0].length > 60 ? selections[0].slice(0, 60) + '...' : selections[0]}"
                    </span>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-amber-400 font-semibold">{count} selections:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selections.map((s, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-amber-500/20 rounded text-amber-200/80 truncate max-w-[150px]">
                            "{s.length > 25 ? s.slice(0, 25) + '...' : s}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleMoreInfo}
                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-xs font-bold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all whitespace-nowrap"
                  >
                    More Info
                  </button>
                  <button
                    onClick={() => {
                      setSelectedText('');
                      window.getSelection()?.removeAllRanges();
                    }}
                    className="text-amber-400/60 hover:text-amber-400 transition-colors"
                    title="Clear all selections"
                  >
                    ✕
                  </button>
                </div>
                {count < 5 && (
                  <p className="text-xs text-amber-400/50 mt-1">Select more text to stack (up to 5)</p>
                )}
              </div>
            );
          })()}

          {/* Attached Files Preview - Now supports multiple files */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 space-y-2">
              {/* Header with total count and clear all button */}
              <div className="flex items-center justify-between text-xs text-indigo-400/70">
                <span>
                  📎 {attachedFiles.length} file{attachedFiles.length !== 1 ? 's' : ''} attached
                  ({Math.round(attachedFiles.reduce((s, f) => s + f.size, 0) / 1024)}KB total)
                </span>
                {attachedFiles.length > 1 && (
                  <button
                    onClick={handleClearAllFiles}
                    className="text-red-400/60 hover:text-red-400 transition-colors"
                    title="Remove all files"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {/* Individual file chips */}
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-sm"
                  >
                    <span className="text-indigo-300 truncate max-w-[150px]" title={file.name}>
                      {file.name}
                    </span>
                    <span className="text-xs text-indigo-400/60">
                      {Math.round(file.size / 1024)}KB
                    </span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-indigo-400 hover:text-red-400 transition-colors ml-1"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attached Images Preview - Multiple Image Tray */}
          {attachedImages.length > 0 && (
            <div className="mb-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg space-y-2">
              {/* Header with total count and clear all */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-purple-400">
                  <span>📸</span>
                  <span>
                    {attachedImages.length} image{attachedImages.length !== 1 ? 's' : ''} attached
                    ({(() => {
                      const total = attachedImages.reduce((s, img) => s + img.size, 0);
                      return total > 1024 * 1024
                        ? `${Math.round(total / 1024 / 1024 * 10) / 10}MB`
                        : `${Math.round(total / 1024)}KB`;
                    })()})
                  </span>
                  <span className="text-purple-400/50">
                    Max: {MAX_IMAGES} images, {MAX_IMAGE_SIZE / 1024 / 1024}MB each
                  </span>
                </div>
                {attachedImages.length > 1 && (
                  <button
                    onClick={handleClearAllImages}
                    className="text-red-400/60 hover:text-red-400 transition-colors"
                    title="Remove all images"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {/* Image thumbnails grid */}
              <div className="flex flex-wrap gap-2">
                {attachedImages.map((img, index) => (
                  <div
                    key={`${img.name}-${index}`}
                    className="relative group"
                  >
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      className="h-16 w-auto rounded border border-purple-500/30 object-cover"
                      style={{ maxWidth: '100px' }}
                    />
                    {/* Overlay with size and remove button */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex flex-col items-center justify-center">
                      <span className="text-xs text-white/80 truncate max-w-[90px]" title={img.name}>
                        {img.name.length > 12 ? img.name.slice(0, 12) + '...' : img.name}
                      </span>
                      <span className="text-xs text-purple-300">
                        {img.size > 1024 * 1024
                          ? `${Math.round(img.size / 1024 / 1024 * 10) / 10}MB`
                          : `${Math.round(img.size / 1024)}KB`}
                      </span>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="mt-1 text-red-400 hover:text-red-300 text-sm"
                        title="Remove image"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ))}
                {/* Add more images button */}
                {attachedImages.length < MAX_IMAGES && (
                  <label className="h-16 w-16 flex items-center justify-center border-2 border-dashed border-purple-500/30 rounded cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <span className="text-purple-400 text-2xl">+</span>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Selected KB Document Context */}
          {selectedKBDoc && (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <span className="text-emerald-400">📚</span>
              <span className="text-sm text-emerald-300 flex-1 truncate">
                Discussing: {selectedKBDoc.title}
              </span>
              <span className="text-xs text-emerald-400/60">
                {selectedKBDoc.content.split(/\s+/).length} words
              </span>
              <button
                onClick={() => handleGenerateKBUpdate(selectedKBDoc)}
                disabled={isGeneratingKBUpdate || messages.length <= 1}
                className={`px-2 py-0.5 text-xs rounded transition-colors ${
                  isGeneratingKBUpdate || messages.length <= 1
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                }`}
                title="Update this KB document with discussion insights"
              >
                {isGeneratingKBUpdate ? '⏳' : '📝'} Update KB
              </button>
              <button
                onClick={() => setSelectedKBDoc(null)}
                className="text-emerald-400 hover:text-red-400 transition-colors"
                title="Remove KB context"
              >
                ✕
              </button>
            </div>
          )}

          {/* KB Picker Dropdown */}
          {showKBPicker && (
            <div className="mb-3 bg-slate-800/95 border border-emerald-500/30 rounded-lg shadow-xl animate-fadeIn">
              {/* Header with search */}
              <div className="p-2 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-emerald-400">📚 Knowledge Documents</span>
                  <button
                    onClick={() => {
                      setShowKBPicker(false);
                      setKBSearchQuery('');
                      setKBPreviewDoc(null);
                    }}
                    className="text-white/40 hover:text-white/60 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                {/* Search input */}
                <input
                  type="text"
                  value={kbSearchQuery}
                  onChange={(e) => setKBSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>

              {/* Preview Mode */}
              {kbPreviewDoc ? (
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setKBPreviewDoc(null)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      ← Back to list
                    </button>
                    <span className="text-xs text-white/40">{kbPreviewContent.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white/90 mb-2">{kbPreviewDoc.title}</h4>
                  <textarea
                    value={kbPreviewContent}
                    onChange={(e) => setKBPreviewContent(e.target.value)}
                    className="w-full h-40 bg-slate-900/50 border border-white/20 rounded-lg px-3 py-2 text-xs text-white/80 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={async () => {
                        try {
                          await updateDocument(kbPreviewDoc.id, { content: kbPreviewContent });
                          alert('Document saved! ✅');
                          const updatedDoc = { ...kbPreviewDoc, content: kbPreviewContent };
                          setKBPreviewDoc(updatedDoc);
                        } catch (err) {
                          alert('Failed to save: ' + err.message);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                    >
                      💾 Save Edits
                    </button>
                    <button
                      onClick={() => {
                        const docToUse = { ...kbPreviewDoc, content: kbPreviewContent };
                        setSelectedKBDoc(docToUse);
                        setShowKBPicker(false);
                        setKBPreviewDoc(null);
                        setKBSearchQuery('');
                        setInputValue(`Let's discuss: "${docToUse.title}"`);
                        inputRef.current?.focus();
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                    >
                      ✓ Use This
                    </button>
                  </div>
                </div>
              ) : (
                /* Document List */
                <div className="p-2 space-y-1 max-h-52 overflow-y-auto">
                  {kbDocuments.length === 0 ? (
                    <div className="p-3 text-center text-white/40 text-sm">
                      No documents yet. <a href="/knowledge-base" className="text-emerald-400 hover:underline">Add some →</a>
                    </div>
                  ) : (() => {
                    const filtered = kbDocuments.filter(doc => {
                      if (!kbSearchQuery.trim()) return true;
                      const q = kbSearchQuery.toLowerCase();
                      return doc.title.toLowerCase().includes(q) ||
                        doc.content?.toLowerCase().includes(q) ||
                        doc.summary?.toLowerCase().includes(q) ||
                        doc.tags?.some(t => t.toLowerCase().includes(q));
                    });
                    return filtered.length === 0 ? (
                      <div className="p-3 text-center text-white/40 text-sm">
                        No documents match "{kbSearchQuery}"
                      </div>
                    ) : (
                      filtered.map(doc => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-500/10 transition-colors group"
                        >
                          <button
                            onClick={() => {
                              setKBPreviewDoc(doc);
                              setKBPreviewContent(doc.content || '');
                            }}
                            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-emerald-400 transition-colors"
                            title="Preview & Edit"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => {
                              setSelectedKBDoc(doc);
                              setShowKBPicker(false);
                              setKBSearchQuery('');
                              setInputValue(`Let's discuss: "${doc.title}"`);
                              inputRef.current?.focus();
                            }}
                            className="flex-1 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400/60 group-hover:text-emerald-400">📄</span>
                              <span className="text-sm text-white/80 truncate flex-1">{doc.title}</span>
                              <span className="text-xs text-white/40">{doc.wordCount || '?'} words</span>
                            </div>
                            {doc.summary && (
                              <p className="text-xs text-white/40 mt-0.5 ml-6 truncate">{doc.summary}</p>
                            )}
                          </button>
                        </div>
                      ))
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {/* Hidden file input - supports multiple files */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".md,.txt,text/*"
              multiple
              className="hidden"
            />

            {/* Attach button - supports multiple files */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isTyping || attachedFiles.length >= MAX_FILES}
              className={`px-3 rounded-xl transition-all ${
                isTyping || attachedFiles.length >= MAX_FILES
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-white/5 text-white/60 hover:bg-indigo-500/20 hover:text-indigo-400 border border-white/10 hover:border-indigo-500/30'
              }`}
              title={`Attach files (.md, .txt) • Max ${MAX_FILE_SIZE / 1024}KB per file • Up to ${MAX_FILES} files`}
            >
              📎 {attachedFiles.length > 0 && <span className="text-xs text-indigo-400">+{attachedFiles.length}</span>}
            </button>

            {/* Image picker hidden input */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Image attach button - supports multiple images */}
            <button
              onClick={() => imageInputRef.current?.click()}
              disabled={isTyping || attachedImages.length >= MAX_IMAGES}
              className={`px-3 rounded-xl transition-all ${
                isTyping || attachedImages.length >= MAX_IMAGES
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : attachedImages.length > 0
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-white/5 text-white/60 hover:bg-purple-500/20 hover:text-purple-400 border border-white/10 hover:border-purple-500/30'
              }`}
              title={`Attach images • Max ${MAX_IMAGE_SIZE / 1024 / 1024}MB each • Up to ${MAX_IMAGES} images • Or paste (Ctrl+V)`}
            >
              📷 {attachedImages.length > 0 && <span className="text-xs text-purple-400">+{attachedImages.length}</span>}
            </button>

            {/* KB Picker button */}
            <button
              onClick={() => setShowKBPicker(!showKBPicker)}
              disabled={isTyping}
              className={`px-3 rounded-xl transition-all ${
                isTyping
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : showKBPicker || selectedKBDoc
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-white/60 hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30'
              }`}
              title="Choose a Knowledge Base document to discuss"
            >
              📚
            </button>

            {/* Create KB from discussion button */}
            <button
              onClick={() => handleGenerateKBUpdate(null)}
              disabled={isTyping || isGeneratingKBUpdate || messages.length <= 1}
              className={`px-3 rounded-xl transition-all ${
                isTyping || isGeneratingKBUpdate || messages.length <= 1
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-white/5 text-white/60 hover:bg-amber-500/20 hover:text-amber-400 border border-white/10 hover:border-amber-500/30'
              }`}
              title="Create new KB document from this discussion"
            >
              {isGeneratingKBUpdate ? '⏳' : '📝'}
            </button>

            {/* Emoji Picker Button */}
            <div className="relative" id="input-emoji-picker">
              <button
                onClick={() => setShowInputEmojiPicker(!showInputEmojiPicker)}
                disabled={isTyping}
                className={`px-3 rounded-xl transition-all ${
                  isTyping
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : showInputEmojiPicker
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-white/5 text-white/60 hover:bg-purple-500/20 hover:text-purple-400 border border-white/10 hover:border-purple-500/30'
                }`}
                title="Add emoji to message"
              >
                😊
              </button>

              {/* Emoji Picker Dropdown */}
              {showInputEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden animate-fadeIn z-50">
                  {/* Category Tabs */}
                  <div className="flex border-b border-white/10 overflow-x-auto">
                    {Object.entries(CONSTITUTIONAL_EMOJIS).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setInputEmojiCategory(key)}
                        className={`flex-1 min-w-0 px-2 py-2 text-xs font-medium transition-colors ${
                          inputEmojiCategory === key
                            ? `bg-gradient-to-r ${config.gradient} text-white`
                            : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                        }`}
                      >
                        {config.emojis[0]}
                      </button>
                    ))}
                  </div>

                  {/* Emoji Grid */}
                  <div className="p-3">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">
                      {CONSTITUTIONAL_EMOJIS[inputEmojiCategory].name}
                    </p>
                    <div className="grid grid-cols-5 gap-1">
                      {CONSTITUTIONAL_EMOJIS[inputEmojiCategory].emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleInsertEmoji(emoji)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-200 hover:scale-125 bg-white/5 hover:bg-white/15"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-3 py-2 bg-white/5 border-t border-white/10">
                    <p className="text-[10px] text-white/30 text-center">
                      Add emoji to your message
                    </p>
                  </div>
                </div>
              )}
            </div>

            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={attachedFiles.length > 0
                ? `Ask about ${attachedFiles.length === 1 ? attachedFiles[0].name : `${attachedFiles.length} files`}... (e.g., "Summarize for Knowledge Base")`
                : attachedImages.length > 0
                  ? `What would you like to discuss about ${attachedImages.length === 1 ? 'this screenshot' : `these ${attachedImages.length} screenshots`}?`
                  : "Share your thoughts... Your AI SoulPartner is listening 💙"
              }
              rows={2}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 placeholder-white/30 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            {/* Send Button Group */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSend()}
                disabled={(!inputValue.trim() && attachedFiles.length === 0 && attachedImages.length === 0) || isTyping}
                className={`px-5 rounded-l-xl font-semibold transition-all ${
                  (inputValue.trim() || attachedFiles.length > 0 || attachedImages.length > 0) && !isTyping
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-500/25'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
                title="Send message"
              >
                Send ✨
              </button>
              <button
                onClick={() => {
                  // Send with markdown format hint so AI treats content as pre-formatted
                  const mdContent = `[Markdown formatted message]\n${inputValue}`;
                  handleSend(mdContent);
                }}
                disabled={(!inputValue.trim() && attachedFiles.length === 0 && attachedImages.length === 0) || isTyping}
                className={`px-3 rounded-r-xl font-medium text-xs transition-all border-l border-black/20 ${
                  (inputValue.trim() || attachedFiles.length > 0 || attachedImages.length > 0) && !isTyping
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
                title="Send as markdown (hints AI to preserve formatting)"
              >
                MD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KB Update Modal */}
      {showKBUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-[95vw] max-h-[95vh] mx-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/20 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  📝 {kbUpdateSourceDoc ? 'Update Knowledge Document' : 'Create Knowledge Document'}
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  {kbUpdateSourceDoc
                    ? 'Review and save the updated document with discussion insights'
                    : 'Review and save a new document from your discussion'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowKBUpdateModal(false);
                  setKBUpdateContent('');
                  setKBUpdateTitle('');
                  setKBUpdateSourceDoc(null);
                }}
                className="text-white/40 hover:text-white/60 transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            {/* Title Input */}
            <div className="px-4 pt-4">
              <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
              <input
                type="text"
                value={kbUpdateTitle}
                onChange={(e) => setKBUpdateTitle(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="Document title..."
              />
            </div>

            {/* Content Editor */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col">
              <label className="block text-sm font-medium text-white/70 mb-1">
                Content (Markdown)
              </label>
              <textarea
                value={kbUpdateContent}
                onChange={(e) => setKBUpdateContent(e.target.value)}
                className="flex-1 w-full min-h-[60vh] bg-slate-900/50 border border-white/20 rounded-lg px-4 py-3 text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono text-sm resize-none"
                placeholder="Document content..."
              />
              <div className="text-xs text-white/40 mt-1">
                {kbUpdateContent.split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowKBUpdateModal(false);
                  setKBUpdateContent('');
                  setKBUpdateTitle('');
                  setKBUpdateSourceDoc(null);
                }}
                className="px-4 py-2 text-white/60 hover:text-white/90 transition-colors"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {kbUpdateSourceDoc && (
                  <button
                    onClick={() => handleSaveKBUpdate('replace')}
                    disabled={!kbUpdateTitle.trim() || !kbUpdateContent.trim()}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white"
                  >
                    🔄 Replace Original
                  </button>
                )}
                <button
                  onClick={() => handleSaveKBUpdate('new')}
                  disabled={!kbUpdateTitle.trim() || !kbUpdateContent.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white"
                >
                  ✨ Save as New
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Transcript Panel - Floating side-by-side view */}
      <VoiceTranscriptPanel
        isOpen={showVoiceTranscript}
        onClose={() => setShowVoiceTranscript(false)}
        userTranscripts={userVoiceTranscripts}
        lunaTranscripts={lunaVoiceTranscripts}
        sessionId={voiceSessionId}
        profileId={userProfile?.id}
        provider={voiceProviderStatus.provider}
        supportsCues={voiceSupportsCues}
        showCues={showEmotionalCues}
      />
    </div>
  );
}

export default AISoulPartnerChat;
