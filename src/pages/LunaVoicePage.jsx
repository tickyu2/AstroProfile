/**
 * ===============================================================================
 * LUNA VOICE PAGE - Simple Voice Chat for iPhone
 * ===============================================================================
 *
 * A mobile-friendly Luna voice chat interface that works on iOS Safari.
 * Uses Web Speech API for speech recognition and synthesis.
 *
 * Features:
 * - Profile selection
 * - Voice input (speech-to-text)
 * - Text chat with Luna
 * - Voice output (text-to-speech)
 * - iOS optimized
 *
 * Created: January 2026
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfiles } from '../contexts/ProfileContext';
import { sendMessage as sendLunaMessage } from '../services/aiSoulPartnerService';

const LunaVoicePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { profiles, loading: profilesLoading } = useProfiles();

  // State
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isHoldingVoice, setIsHoldingVoice] = useState(false);

  // Refs
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);
  const selectedVoiceRef = useRef(null);

  // Platform detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Add log
  const addLog = useCallback((msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-15), `[${time}] ${msg}`]);
    console.log(`[LunaVoice] ${msg}`);
  }, []);

  // Profiles are loaded automatically by ProfileContext when user is logged in

  // Auto-select profile if name matches
  useEffect(() => {
    if (profiles.length > 0 && !selectedProfile) {
      // Try to find Surachai profile
      const surachaiProfile = profiles.find(p =>
        p.displayName?.toLowerCase().includes('surachai') ||
        p.firstName?.toLowerCase().includes('surachai')
      );
      if (surachaiProfile) {
        setSelectedProfile(surachaiProfile);
        addLog(`Auto-selected profile: ${surachaiProfile.displayName}`);
      }
    }
  }, [profiles, selectedProfile, addLog]);

  // Load messages from localStorage when profile is selected
  useEffect(() => {
    if (selectedProfile?.id) {
      const storageKey = `luna-voice-messages-${selectedProfile.id}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          setMessages(parsed);
          addLog(`Loaded ${parsed.length} messages from storage`);
        } catch (e) {
          addLog('Failed to load saved messages');
        }
      } else {
        setMessages([]); // Clear messages when switching to a profile with no history
      }
    }
  }, [selectedProfile?.id, addLog]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (selectedProfile?.id && messages.length > 0) {
      const storageKey = `luna-voice-messages-${selectedProfile.id}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, selectedProfile?.id]);

  // Clear chat history
  const clearChat = useCallback(() => {
    if (selectedProfile?.id) {
      const storageKey = `luna-voice-messages-${selectedProfile.id}`;
      localStorage.removeItem(storageKey);
      setMessages([]);
      addLog('Chat history cleared');
    }
  }, [selectedProfile?.id, addLog]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Find the best voice when voices are loaded
  useEffect(() => {
    const findBestVoice = () => {
      const voices = synthRef.current.getVoices();
      if (voices.length === 0) return;

      addLog(`Found ${voices.length} voices`);

      // Priority order for natural sounding female voices
      // iOS Safari has enhanced Siri voices that sound much better
      const voicePreferences = [
        // iOS enhanced voices (best quality)
        'Samantha (Enhanced)',
        'Samantha',
        'Karen (Enhanced)',
        'Karen',
        'Moira (Enhanced)',
        'Moira',
        // macOS voices
        'Samantha',
        'Alex',
        // Google voices (Chrome)
        'Google US English',
        'Google UK English Female',
        // Windows voices
        'Microsoft Zira',
        'Microsoft Eva',
        // Fallback
        'female',
        'Female'
      ];

      let bestVoice = null;

      // First try exact matches
      for (const pref of voicePreferences) {
        bestVoice = voices.find(v => v.name.includes(pref));
        if (bestVoice) {
          addLog(`Selected voice: ${bestVoice.name}`);
          break;
        }
      }

      // If no preferred voice found, try to find any English female voice
      if (!bestVoice) {
        bestVoice = voices.find(v =>
          v.lang.startsWith('en') &&
          (v.name.toLowerCase().includes('female') ||
           v.name.toLowerCase().includes('woman') ||
           !v.name.toLowerCase().includes('male'))
        );
      }

      // Last resort: first English voice
      if (!bestVoice) {
        bestVoice = voices.find(v => v.lang.startsWith('en'));
      }

      if (bestVoice) {
        selectedVoiceRef.current = bestVoice;
        addLog(`Using voice: ${bestVoice.name} (${bestVoice.lang})`);
      }
    };

    // Voices may not be loaded immediately
    findBestVoice();

    // Also listen for voices changed event
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = findBestVoice;
    }

    // Retry after a delay (iOS sometimes needs this)
    const timer = setTimeout(findBestVoice, 500);
    return () => clearTimeout(timer);
  }, [addLog]);

  // Unlock audio for iOS
  const unlockAudio = useCallback(async () => {
    if (audioUnlocked) return true;

    try {
      addLog('Unlocking audio...');

      // Create AudioContext
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Play silent buffer
      const buffer = audioContextRef.current.createBuffer(1, 1, 22050);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);

      // Also trigger speech synthesis to unlock it
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      synthRef.current.speak(utterance);

      setAudioUnlocked(true);
      addLog('Audio unlocked!');
      return true;
    } catch (err) {
      addLog(`Audio unlock failed: ${err.message}`);
      return false;
    }
  }, [audioUnlocked, addLog]);

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addLog('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      addLog('Listening started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      setInputText(transcript);

      if (event.results[0].isFinal) {
        addLog(`Heard: "${transcript}"`);
      }
    };

    recognition.onerror = (event) => {
      addLog(`Speech error: ${event.error}`);
      setIsListening(false);

      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow in Settings.');
      }
    };

    recognition.onend = () => {
      addLog('Listening ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    addLog('Speech recognition initialized');
  }, [addLog]);

  // Start listening
  const startListening = useCallback(async () => {
    // Unlock audio first on iOS
    if (isIOS && !audioUnlocked) {
      await unlockAudio();
    }

    if (!recognitionRef.current) {
      initSpeechRecognition();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        addLog(`Start listening error: ${err.message}`);
      }
    }
  }, [isIOS, audioUnlocked, unlockAudio, initSpeechRecognition, addLog]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Hold-to-talk voice call handlers
  const handleVoiceCallStart = useCallback(async (e) => {
    e.preventDefault();
    addLog('Hold-to-talk started');
    setIsHoldingVoice(true);
    await startListening();
  }, [startListening, addLog]);

  const handleVoiceCallEnd = useCallback((e) => {
    e.preventDefault();
    if (!isHoldingVoice) return;

    addLog('Hold-to-talk released');
    setIsHoldingVoice(false);

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }

    // Auto-send after a short delay to allow final transcript to arrive
    setTimeout(() => {
      // Check if there's text to send (inputText might have been updated)
      const textArea = document.querySelector('textarea');
      const currentText = textArea?.value?.trim();
      if (currentText) {
        addLog(`Auto-sending: "${currentText.substring(0, 30)}..."`);
        // Trigger send by clicking the send button
        document.getElementById('send-btn')?.click();
      }
    }, 500);
  }, [isHoldingVoice, isListening, addLog]);

  // Speak text using TTS
  const speak = useCallback((text) => {
    if (!ttsEnabled || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Use cached best voice
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    // Adjust rate/pitch for more natural sound
    // iOS enhanced voices sound better at slightly slower rate
    utterance.rate = isIOS ? 0.9 : 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      addLog('Luna speaking...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      addLog('Luna finished speaking');
    };

    utterance.onerror = (e) => {
      setIsSpeaking(false);
      addLog(`TTS error: ${e.error}`);
    };

    synthRef.current.speak(utterance);
  }, [ttsEnabled, isIOS, addLog]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  // Speak from a specific word position (tap-to-read)
  const speakFromPosition = useCallback((fullText, startIndex) => {
    if (!ttsEnabled || !fullText) return;

    // Get text from the clicked position onwards
    const textToSpeak = fullText.substring(startIndex).trim();
    if (!textToSpeak) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Use cached best voice
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    // Adjust rate/pitch for more natural sound
    utterance.rate = isIOS ? 0.9 : 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      addLog(`Reading from position ${startIndex}...`);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      setIsSpeaking(false);
      addLog(`TTS error: ${e.error}`);
    };

    synthRef.current.speak(utterance);
  }, [ttsEnabled, isIOS, addLog]);

  // Handle click on Luna message to read from that point
  const handleMessageClick = useCallback((e, content) => {
    if (!ttsEnabled) return;

    // Get click position within the text
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;

      // Only proceed if clicking on text content
      if (textNode.nodeType === Node.TEXT_NODE) {
        const clickOffset = range.startOffset;
        const textContent = textNode.textContent;

        // Find the start of the current word
        let wordStart = clickOffset;
        while (wordStart > 0 && textContent[wordStart - 1] !== ' ') {
          wordStart--;
        }

        // Calculate the absolute position in the full content
        // by finding where this text node starts in the full content
        const fullText = content;
        const textBeforeClick = textContent.substring(0, wordStart);
        const nodeText = textNode.textContent;

        // Find where this text appears in the full content
        const nodeStartInContent = fullText.indexOf(nodeText);
        const absolutePosition = nodeStartInContent >= 0 ? nodeStartInContent + wordStart : 0;

        addLog(`Tap to read from word at position ${absolutePosition}`);
        speakFromPosition(fullText, absolutePosition);
      }
    }
  }, [ttsEnabled, speakFromPosition, addLog]);

  // Send message to Luna
  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || !selectedProfile) return;

    const userMessage = inputText.trim();
    setInputText('');
    setError(null);

    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    addLog(`Sending: "${userMessage.substring(0, 50)}..."`);
    addLog(`History count: ${messages.length}, Profile: ${selectedProfile?.id?.slice(0,8)}`);
    setIsLoading(true);

    try {
      // Call Luna API
      const response = await sendLunaMessage({
        message: userMessage,
        guidance: {
          profileName: selectedProfile.displayName,
          mode: 'DIALOGUE'
        },
        conversationHistory: messages.slice(-6).map(m => ({
          sender: m.role === 'user' ? 'user' : 'luna',
          text: m.content
        })),
        userProfile: {
          ...selectedProfile,
          userId: currentUser?.uid
        },
        profileId: selectedProfile.id
      });

      // Log full response for debugging
      addLog(`API response: success=${response?.success}, hasText=${!!response?.text}`);
      if (response?.error) {
        addLog(`API error: ${response.error}`);
        if (response?.details) {
          addLog(`Details: ${response.details}`);
        }
      }

      const lunaResponse = response?.text || response?.reply || response?.message || 'I hear you. How can I help?';

      // Add Luna's response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lunaResponse,
        timestamp: new Date()
      }]);

      addLog(`Luna: "${lunaResponse.substring(0, 50)}..."`);

      // Speak the response
      if (ttsEnabled && audioUnlocked) {
        speak(lunaResponse);
      }

    } catch (err) {
      addLog(`Error: ${err.message}`);
      setError(`Failed to get response: ${err.message}`);

      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedProfile, messages, currentUser, ttsEnabled, audioUnlocked, speak, addLog]);

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Not logged in
  if (!currentUser) {
    return (
      <div style={styles.container}>
        <div style={styles.centerContent}>
          <h2>Please log in to chat with Luna</h2>
          <button onClick={() => navigate('/login')} style={styles.primaryBtn}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>
        <h1 style={styles.title}>Luna Voice</h1>
        <div style={styles.headerActions}>
          <button
            onClick={clearChat}
            disabled={messages.length === 0}
            style={{
              ...styles.iconBtn,
              opacity: messages.length > 0 ? 1 : 0.3
            }}
            title="Clear chat"
          >
            🗑️
          </button>
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            style={{
              ...styles.iconBtn,
              opacity: ttsEnabled ? 1 : 0.5
            }}
            title={ttsEnabled ? 'Mute Luna' : 'Unmute Luna'}
          >
            {ttsEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* iOS Audio Unlock Prompt */}
      {isIOS && !audioUnlocked && (
        <div style={styles.unlockBanner}>
          <span>📱 Tap to enable voice</span>
          <button onClick={unlockAudio} style={styles.unlockBtn}>
            Enable Audio
          </button>
        </div>
      )}

      {/* Profile Selector */}
      <div style={styles.profileSection}>
        <label style={styles.label}>Select Profile:</label>
        <select
          value={selectedProfile?.id || ''}
          onChange={(e) => {
            const profile = profiles.find(p => p.id === e.target.value);
            setSelectedProfile(profile);
            addLog(`Selected: ${profile?.displayName}`);
          }}
          style={styles.select}
          disabled={profilesLoading}
        >
          <option value="">-- Select Profile --</option>
          {profiles.map(p => (
            <option key={p.id} value={p.id}>
              {p.displayName || `${p.firstName} ${p.lastName}` || 'Unnamed Profile'}
            </option>
          ))}
        </select>
        {selectedProfile && (
          <div style={styles.profileBadge}>
            Chatting as: {selectedProfile.displayName}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.errorBox}>{error}</div>
      )}

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.lunaAvatar}>🌙</div>
            <p>Hi! I'm Luna, your cosmic guide.</p>
            <p style={styles.hint}>Say something or type a message to start.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(msg.role === 'user' ? styles.userMessage : styles.lunaMessage),
                ...(msg.isError ? styles.errorMessage : {})
              }}
            >
              {msg.role === 'assistant' ? (
                // Luna messages: clickable to read from cursor position
                <div
                  style={styles.messageContentClickable}
                  onClick={(e) => handleMessageClick(e, msg.content)}
                >
                  {msg.content}
                  {ttsEnabled && (
                    <div style={styles.tapToReadHint}>
                      Tap text to read aloud
                    </div>
                  )}
                </div>
              ) : (
                <div style={styles.messageContent}>{msg.content}</div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div style={{ ...styles.message, ...styles.lunaMessage }}>
            <div style={styles.typing}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <div style={styles.inputRow}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedProfile ? "Type or speak your message..." : "Select a profile first"}
            style={styles.textInput}
            disabled={!selectedProfile || isLoading}
            rows={1}
          />

          {/* STT Button - Tap to dictate */}
          <button
            onClick={isListening && !isHoldingVoice ? stopListening : startListening}
            disabled={!selectedProfile || isLoading || isHoldingVoice}
            style={{
              ...styles.voiceBtn,
              ...(isListening && !isHoldingVoice ? styles.voiceBtnActive : {}),
              ...(!selectedProfile || isHoldingVoice ? styles.btnDisabled : {})
            }}
            title="Tap to dictate"
          >
            {isListening && !isHoldingVoice ? '🎙️' : '🎤'}
          </button>

          {/* Voice Call Button - Hold to talk */}
          <button
            onMouseDown={handleVoiceCallStart}
            onMouseUp={handleVoiceCallEnd}
            onMouseLeave={handleVoiceCallEnd}
            onTouchStart={handleVoiceCallStart}
            onTouchEnd={handleVoiceCallEnd}
            disabled={!selectedProfile || isLoading}
            style={{
              ...styles.voiceCallBtn,
              ...(isHoldingVoice ? styles.voiceCallBtnActive : {}),
              ...(!selectedProfile ? styles.btnDisabled : {})
            }}
            title="Hold to talk"
          >
            {isHoldingVoice ? '📞' : '📱'}
          </button>

          {/* Send Button */}
          <button
            id="send-btn"
            onClick={sendMessage}
            disabled={!inputText.trim() || !selectedProfile || isLoading}
            style={{
              ...styles.sendBtn,
              ...(!inputText.trim() || !selectedProfile ? styles.btnDisabled : {})
            }}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>

        {/* Button labels */}
        <div style={styles.buttonLabels}>
          <span style={styles.buttonLabel}>🎤 Tap</span>
          <span style={styles.buttonLabel}>📱 Hold</span>
          <span style={styles.buttonLabel}>➤ Send</span>
        </div>

        {/* Holding indicator */}
        {isHoldingVoice && (
          <div style={styles.holdingIndicator}>
            <span>🎙️ Listening... Release to send</span>
          </div>
        )}

        {/* Speaking indicator */}
        {isSpeaking && (
          <div style={styles.speakingIndicator}>
            <span>🌙 Luna is speaking...</span>
            <button onClick={stopSpeaking} style={styles.stopBtn}>Stop</button>
          </div>
        )}
      </div>

      {/* Debug Log (collapsible) */}
      <details style={styles.debugSection}>
        <summary style={styles.debugSummary}>Debug Log</summary>
        <div style={styles.debugLog}>
          {logs.map((log, i) => (
            <div key={i} style={styles.logLine}>{log}</div>
          ))}
        </div>
      </details>

      {/* Typing and pulse animation styles */}
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .typing span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #a78bfa;
          border-radius: 50%;
          margin: 0 2px;
          animation: typing 1s infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.15s; }
        .typing span:nth-child(3) { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600'
  },
  headerActions: {
    display: 'flex',
    gap: '4px'
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px'
  },
  unlockBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(139, 92, 246, 0.2)',
    borderBottom: '1px solid rgba(139, 92, 246, 0.3)'
  },
  unlockBtn: {
    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  profileSection: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '8px'
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '16px'
  },
  profileBadge: {
    marginTop: '8px',
    padding: '8px 12px',
    background: 'rgba(74, 222, 128, 0.2)',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#4ade80'
  },
  errorBox: {
    margin: '8px 16px',
    padding: '12px',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '8px',
    color: '#fca5a5',
    fontSize: '14px'
  },
  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '16px'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)'
  },
  lunaAvatar: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  hint: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '8px'
  },
  message: {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '16px',
    marginBottom: '12px',
    fontSize: '15px',
    lineHeight: '1.4'
  },
  userMessage: {
    marginLeft: 'auto',
    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    borderBottomRightRadius: '4px'
  },
  lunaMessage: {
    marginRight: 'auto',
    background: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: '4px'
  },
  errorMessage: {
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  messageContent: {
    whiteSpace: 'pre-wrap'
  },
  messageContentClickable: {
    whiteSpace: 'pre-wrap',
    userSelect: 'text',
    WebkitUserSelect: 'text',
    cursor: 'text'
  },
  tapToReadHint: {
    marginTop: '8px',
    paddingTop: '6px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '10px',
    color: 'rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  typing: {
    display: 'flex',
    gap: '4px',
    padding: '4px 0'
  },
  inputArea: {
    padding: '12px 16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)'
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end'
  },
  textInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '16px',
    resize: 'none',
    outline: 'none',
    minHeight: '44px',
    maxHeight: '100px'
  },
  voiceBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  voiceBtnActive: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    animation: 'pulse 1s infinite'
  },
  voiceCallBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(34, 197, 94, 0.2)',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  voiceCallBtnActive: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    transform: 'scale(1.1)',
    boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },
  buttonLabels: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
    marginTop: '4px',
    paddingRight: '12px'
  },
  buttonLabel: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center'
  },
  holdingIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8px',
    padding: '8px 12px',
    background: 'rgba(34, 197, 94, 0.2)',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#4ade80',
    animation: 'pulse 1s infinite'
  },
  speakingIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px',
    padding: '8px 12px',
    background: 'rgba(139, 92, 246, 0.2)',
    borderRadius: '8px',
    fontSize: '13px'
  },
  stopBtn: {
    background: 'rgba(239, 68, 68, 0.3)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    color: '#fca5a5',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  debugSection: {
    padding: '8px 16px',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  debugSummary: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer'
  },
  debugLog: {
    marginTop: '8px',
    maxHeight: '120px',
    overflow: 'auto',
    fontSize: '10px',
    fontFamily: 'monospace',
    background: 'rgba(0,0,0,0.3)',
    padding: '8px',
    borderRadius: '4px'
  },
  logLine: {
    padding: '2px 0',
    color: 'rgba(255,255,255,0.5)'
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '16px'
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    border: 'none',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default LunaVoicePage;
