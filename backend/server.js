/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA VOICE BACKEND - WebSocket Server for Voice Loop Orchestration
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Orchestrates the complete voice loop:
 * 1. Receives audio from React frontend via WebSocket
 * 2. Runs Speech Emotion Recognition (SER) on audio
 * 3. Transcribes with Groq Whisper (STT) - ultra-fast cloud
 * 4. Generates response with LLM (Groq primary, Ollama fallback)
 * 5. Generates emotion-aware TTS with ElevenLabs
 * 6. Returns transcript + reply + audio to frontend
 *
 * Services:
 * - SER: Local ONNX model or enhanced heuristics
 * - STT: Groq Whisper Large v3 Turbo (~200ms)
 * - LLM: Groq Llama 3.3 70B (~300ms)
 * - TTS: ElevenLabs with emotion modulation
 * - Fallback: Ollama (local) when Groq offline
 *
 * Run: node server.js
 * Connects: ws://localhost:8080
 *
 * Created: December 21, 2025
 * Updated: December 21, 2025 - Added emotion-aware TTS
 */

import 'dotenv/config';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transcribeWithGroqWhisper, isGroqWhisperAvailable } from './stt/groqWhisper.js';
import { runLLM, initRouter, getProviderStatus } from './llm/router.js';
import { initSER, runSER, getSERStatus } from './ser/inference.js';
import { speakWithElevenLabs, isElevenLabsAvailable, testElevenLabs } from './tts/elevenLabs.js';
import { getBehaviorForUserEmotion } from './behavior/behaviorEngine.js';
import {
  signalUserInterruptedLuna,
  signalBackchannelRejected,
  signalBackchannelAppreciated,
  signalUserSeemsComfortableWithSilence,
  processTextSignals,
  getUserPreferences
} from './user/learningSignals.js';
import { recordBackchannelPlayed, recordBackchannelOverSpoken } from './behavior/sessionBackchannelAdapter.js';
import { startDebugServer } from './debugServer.js';
import { startConsoleServer } from './consoleServer.js';
import { logTurnSnapshot } from './logging/turnLogger.js';
import {
  processAutoTuneSignal,
  detectEmotionChange,
  detectResponseFlow,
  isAutoTuneEnabled,
  AUTOTUNE_SIGNALS
} from './behavior/autoTuneEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration
 */
const CONFIG = {
  port: process.env.VOICE_PORT || 8080,
  audioTempDir: path.join(__dirname, 'audio', 'temp'),
  maxAudioSize: 10 * 1024 * 1024, // 10MB max audio
  cleanupInterval: 60000 // Clean temp files every minute
};

/**
 * Ensure temp directory exists
 */
if (!fs.existsSync(CONFIG.audioTempDir)) {
  fs.mkdirSync(CONFIG.audioTempDir, { recursive: true });
}

/**
 * Active sessions
 */
const sessions = new Map();

/**
 * Session class - manages a single voice conversation
 */
class VoiceSession {
  constructor(ws, sessionId) {
    this.ws = ws;
    this.sessionId = sessionId;
    this.audioChunks = [];
    this.currentTurnId = 0;
    this.conversationHistory = [];
    this.createdAt = Date.now();

    // TODO: Get userId from auth/session - using "anonymous" for now
    this.userId = 'anonymous';

    // Session stats for behavior adaptation
    this.stats = {
      backchannelsUsed: 0,
      backchannelsOverSpoken: 0,
      backchannelsAppreciated: 0,
      turns: 0,
      interruptions: 0,
      longSilences: 0
    };

    // Last emotion and behavior for debug
    this.lastEmotion = null;
    this.lastBehavior = null;
  }

  /**
   * Add audio chunk to current turn
   */
  addAudioChunk(chunk) {
    this.audioChunks.push(chunk);
  }

  /**
   * Get current audio buffer
   */
  getAudioBuffer() {
    return Buffer.concat(this.audioChunks);
  }

  /**
   * Clear audio for new turn
   */
  clearAudio() {
    this.audioChunks = [];
  }

  /**
   * Save audio to temp WAV file
   */
  async saveAudioToFile() {
    const buffer = this.getAudioBuffer();
    if (buffer.length === 0) {
      return null;
    }

    this.currentTurnId++;
    const filename = `turn-${this.sessionId}-${this.currentTurnId}-${Date.now()}.wav`;
    const filepath = path.join(CONFIG.audioTempDir, filename);

    // Write raw audio - assuming it's already WAV format from MediaRecorder
    // Note: May need ffmpeg conversion for non-WAV formats
    fs.writeFileSync(filepath, buffer);

    console.log(`[Session ${this.sessionId}] Saved audio: ${filename} (${buffer.length} bytes)`);
    return filepath;
  }

  /**
   * Add to conversation history
   */
  addToHistory(role, content) {
    this.conversationHistory.push({
      role,
      content,
      timestamp: Date.now()
    });

    // Keep last 10 exchanges
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  /**
   * Send message to client
   */
  send(type, payload) {
    if (this.ws.readyState === 1) { // WebSocket.OPEN
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  /**
   * Cleanup
   */
  cleanup() {
    this.audioChunks = [];
    this.conversationHistory = [];
  }
}

/**
 * Create WebSocket server
 */
const wss = new WebSocketServer({ port: CONFIG.port });

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  LUNA VOICE BACKEND');
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`  WebSocket: ws://localhost:${CONFIG.port}`);
console.log('═══════════════════════════════════════════════════════════════════');

/**
 * Check dependencies on startup
 */
async function checkDependencies() {
  console.log('\n[Startup] Checking dependencies...');

  // Initialize SER (Speech Emotion Recognition)
  console.log('\n[Startup] Initializing SER (Speech Emotion Recognition)...');
  const serStatus = await initSER();

  // Initialize LLM router (checks Groq + Ollama)
  console.log('\n[Startup] Initializing Groq services...');
  const llmStatus = await initRouter();

  // Check STT (uses same Groq API key)
  const sttAvailable = isGroqWhisperAvailable();

  // Check TTS (ElevenLabs)
  const ttsConfigured = isElevenLabsAvailable();
  let ttsStatus = { success: false };
  if (ttsConfigured) {
    console.log('\n[Startup] Testing ElevenLabs TTS...');
    ttsStatus = await testElevenLabs();
  }

  // Summary
  console.log('\n[Startup] Service Status:');

  // SER status
  if (serStatus.mode === 'onnx') {
    console.log('  SER (Emotion): ✓ ONNX Model loaded');
  } else {
    console.log('  SER (Emotion): ✓ Enhanced Heuristics (no ONNX model)');
  }

  // Groq status
  if (llmStatus.groq.configured) {
    console.log(`  Groq STT (Whisper v3 Turbo): ${sttAvailable ? '✓ Ready' : '✗ Unavailable'}`);
    console.log(`  Groq LLM (Llama 3.3 70B): ${llmStatus.groq.available ? '✓ Ready' : '✗ Unavailable'}`);
  } else {
    console.log('  Groq: ○ Not configured');
    console.log('      Set GROQ_API_KEY for ultra-fast STT + LLM');
    console.log('      Get free key: https://console.groq.com');
  }
  console.log(`  Ollama (LLM fallback): ${llmStatus.ollama.available ? '✓ Available' : '○ Not running'}`);

  // TTS status
  if (ttsConfigured && ttsStatus.success) {
    console.log(`  ElevenLabs TTS: ✓ Ready (${ttsStatus.voiceCount} voices)`);
  } else if (ttsConfigured) {
    console.log(`  ElevenLabs TTS: ✗ Error: ${ttsStatus.error}`);
  } else {
    console.log('  ElevenLabs TTS: ○ Not configured');
    console.log('      Set ELEVENLABS_API_KEY for Luna voice output');
    console.log('      Get key: https://elevenlabs.io');
  }

  if (!llmStatus.groq.configured) {
    console.log('\n  [!] GROQ_API_KEY required for voice loop.');
    console.log('      The same key powers both STT (Whisper) and LLM (Llama).');
  }

  console.log('\n[Startup] Ready for connections.\n');
}

checkDependencies();

// Start debug REST server for Lab Mode
startDebugServer(8090);

// Start management console server
startConsoleServer(8091);

/**
 * Handle new WebSocket connection
 */
wss.on('connection', (ws, req) => {
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const session = new VoiceSession(ws, sessionId);
  sessions.set(sessionId, session);

  console.log(`[${sessionId}] Client connected`);

  // Send session confirmation
  session.send('session_started', { sessionId });

  /**
   * Handle incoming messages
   */
  ws.on('message', async (raw) => {
    let msg;

    try {
      // Try to parse as JSON
      const str = raw.toString();
      if (str.startsWith('{')) {
        msg = JSON.parse(str);
      } else {
        // Binary audio data
        session.addAudioChunk(raw);
        return;
      }
    } catch (e) {
      // Binary audio data
      session.addAudioChunk(raw);
      return;
    }

    // Handle message types
    switch (msg.type) {
      case 'audio_chunk':
        // Base64 encoded audio chunk
        if (msg.payload) {
          const buffer = Buffer.from(msg.payload, 'base64');
          session.addAudioChunk(buffer);
        }
        break;

      case 'end_turn':
        // User finished speaking - process turn
        await processEndTurn(session, msg.emotion || {});
        break;

      case 'cancel_turn':
        // User cancelled - clear audio
        session.clearAudio();
        session.send('turn_cancelled', {});
        break;

      case 'ping':
        session.send('pong', { timestamp: Date.now() });
        break;

      case 'behavior_signal':
        // Handle behavior learning signals from frontend
        handleBehaviorSignal(session, msg.payload || {});
        break;

      case 'backchannel_played':
        // Frontend played a backchannel - track it
        session.stats.backchannelsUsed++;
        recordBackchannelPlayed(session.stats);
        break;

      case 'get_behavior':
        // Frontend requesting current behavior profile
        sendBehaviorUpdate(session);
        break;

      default:
        console.log(`[${sessionId}] Unknown message type:`, msg.type);
    }
  });

  /**
   * Handle disconnect
   */
  ws.on('close', () => {
    console.log(`[${sessionId}] Client disconnected`);
    session.cleanup();
    sessions.delete(sessionId);
  });

  /**
   * Handle errors
   */
  ws.on('error', (error) => {
    console.error(`[${sessionId}] WebSocket error:`, error.message);
  });
});

/**
 * Handle behavior learning signals from frontend
 *
 * @param {VoiceSession} session
 * @param {Object} payload - { event: string, data?: any }
 */
function handleBehaviorSignal(session, payload) {
  const { event, data } = payload;

  console.log(`[${session.sessionId}] Behavior signal: ${event}`);

  switch (event) {
    case 'user_interrupt':
      // User talked over Luna's TTS
      session.stats.interruptions++;
      signalUserInterruptedLuna(session.userId);
      // Auto-tune: this is a negative signal
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.USER_INTERRUPT, data);
      break;

    case 'user_spoke_over_backchannel':
      // User spoke right after a cue (didn't want the cue)
      session.stats.backchannelsOverSpoken++;
      recordBackchannelOverSpoken(session.stats);
      signalBackchannelRejected(session.userId);
      // Auto-tune: this is a negative signal
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.USER_SPOKE_OVER_BACKCHANNEL, data);
      break;

    case 'backchannel_appreciated':
      // User paused after cue (appreciated it)
      session.stats.backchannelsAppreciated++;
      signalBackchannelAppreciated(session.userId);
      // Auto-tune: this is a positive signal
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.BACKCHANNEL_APPRECIATED, data);
      break;

    case 'user_comfortable_with_silence':
      // User held long pause without distress
      session.stats.longSilences++;
      signalUserSeemsComfortableWithSilence(session.userId);
      // Auto-tune: calibration signal
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.USER_COMFORTABLE_WITH_SILENCE, data);
      break;

    // New auto-tune signals
    case 'positive_flow':
      // User responds smoothly after Luna
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.POSITIVE_FLOW, data);
      break;

    case 'negative_flow':
      // User responds abruptly or with tension
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.NEGATIVE_FLOW, data);
      break;

    case 'emotion_improved':
      // User's emotion improved after Luna spoke
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.EMOTION_IMPROVED, data);
      break;

    case 'emotion_worsened':
      // User's emotion worsened after Luna spoke
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.EMOTION_WORSENED, data);
      break;

    case 'short_response':
      // User gave a very short response
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.SHORT_RESPONSE, data);
      break;

    case 'long_response':
      // User elaborated naturally
      processAutoTuneSignal(session.userId, AUTOTUNE_SIGNALS.LONG_RESPONSE, data);
      break;

    default:
      console.log(`[${session.sessionId}] Unknown behavior signal: ${event}`);
  }

  // Send updated behavior profile
  sendBehaviorUpdate(session);
}

/**
 * Send current behavior profile to frontend
 *
 * @param {VoiceSession} session
 */
function sendBehaviorUpdate(session) {
  const behavior = getBehaviorForUserEmotion({
    userId: session.userId,
    emotion: session.lastEmotion || { primary: 'neutral', confidence: 0.5 },
    sessionStats: session.stats
  });

  session.lastBehavior = behavior;

  session.send('behavior_update', {
    behavior,
    sessionStats: session.stats,
    userPrefs: getUserPreferences(session.userId)
  });
}

/**
 * Process end of user turn
 *
 * @param {VoiceSession} session
 * @param {Object} frontendEmotion - Detected emotion from frontend (fallback)
 */
async function processEndTurn(session, frontendEmotion) {
  const turnStartTime = Date.now();

  console.log(`[${session.sessionId}] Processing turn...`);

  // Notify frontend we're processing
  session.send('processing_started', { emotion: frontendEmotion });

  try {
    // 1. Get raw audio buffer for SER
    const audioBuffer = session.getAudioBuffer();

    if (audioBuffer.length === 0) {
      session.send('turn_result', {
        transcript: '',
        reply: "I didn't catch that. Could you say that again?",
        error: 'No audio received'
      });
      return;
    }

    // 2. Run Speech Emotion Recognition (SER) on audio
    session.send('ser_started', {});
    let serEmotion;
    try {
      serEmotion = await runSER(audioBuffer);
      console.log(`[${session.sessionId}] SER: ${serEmotion.primary} (${(serEmotion.confidence * 100).toFixed(1)}%) [${serEmotion.mode}]`);
      session.send('ser_complete', { emotion: serEmotion });
    } catch (serError) {
      console.error(`[${session.sessionId}] SER error:`, serError.message);
      // Fallback to frontend emotion if SER fails
      serEmotion = {
        primary: frontendEmotion.primary || 'neutral',
        secondary: frontendEmotion.secondary || '',
        confidence: frontendEmotion.confidence || 0.5,
        mode: 'frontend-fallback'
      };
    }

    // Use backend SER emotion (more accurate) with frontend as fallback
    const emotion = {
      primary: serEmotion.primary,
      secondary: serEmotion.secondary || frontendEmotion.secondary || '',
      confidence: serEmotion.confidence,
      mode: serEmotion.mode,
      // Include raw features for debugging
      features: serEmotion.features
    };

    console.log(`[${session.sessionId}] Final emotion:`, emotion.primary);

    // Store emotion for behavior calculation
    session.lastEmotion = emotion;
    session.stats.turns++;

    // 2.5. Calculate behavior profile for this turn
    const behavior = getBehaviorForUserEmotion({
      userId: session.userId,
      emotion,
      sessionStats: session.stats
    });
    session.lastBehavior = behavior;
    console.log(`[${session.sessionId}] Behavior: ${behavior.style}, backchannel: ${behavior.backchannelFrequency.toFixed(2)}`);

    // 3. Save audio to temp file for STT
    const audioPath = await session.saveAudioToFile();

    // 4. Transcribe with Groq Whisper
    session.send('stt_started', {});
    const sttResult = await transcribeWithGroqWhisper(audioPath);

    console.log(`[${session.sessionId}] STT:`, sttResult.text);
    session.send('stt_complete', { transcript: sttResult.text });

    if (!sttResult.text || sttResult.text.trim() === '') {
      session.send('turn_result', {
        transcript: '',
        reply: "I'm here. What would you like to talk about?",
        emotion: emotion,
        warning: 'Empty transcript'
      });
      session.clearAudio();
      return;
    }

    // 5. Add to conversation history
    session.addToHistory('user', sttResult.text);

    // 6. Generate LLM response (now with backend-detected emotion + behavior)
    session.send('llm_started', {});
    const llmResult = await runLLM(sttResult.text, emotion, {
      behavior,
      history: session.conversationHistory.slice(-6).map(h => ({
        role: h.role,
        text: h.content
      }))
    });

    // 6.5 Process text signals for learning
    processTextSignals(session.userId, sttResult.text);

    console.log(`[${session.sessionId}] LLM:`, llmResult.reply);

    // 7. Add response to history
    session.addToHistory('assistant', llmResult.reply);

    // 8. Generate emotion-aware TTS (if ElevenLabs configured)
    let ttsResult = null;
    if (isElevenLabsAvailable()) {
      session.send('tts_started', { emotion: emotion.primary });
      try {
        ttsResult = await speakWithElevenLabs(llmResult.reply, emotion);
        console.log(`[${session.sessionId}] TTS: ${ttsResult.duration}ms (${emotion.primary})`);
        session.send('tts_complete', {
          duration: ttsResult.duration,
          profile: ttsResult.profile
        });
      } catch (ttsError) {
        console.error(`[${session.sessionId}] TTS error:`, ttsError.message);
        // Continue without TTS - frontend can use browser TTS as fallback
      }
    }

    // 9. Send result back to frontend
    const totalDuration = Date.now() - turnStartTime;
    session.send('turn_result', {
      transcript: sttResult.text,
      reply: llmResult.reply,
      emotion: emotion,
      behavior: behavior,  // Include behavior profile for frontend
      sessionStats: session.stats,
      serDuration: serEmotion.duration,
      sttDuration: sttResult.duration,
      llmDuration: llmResult.duration,
      llmProvider: llmResult.provider,
      llmModel: llmResult.model,
      ttsDuration: ttsResult?.duration || 0,
      ttsProfile: ttsResult?.profile || null,
      totalDuration
    });

    // 10. Send audio as separate binary message (if TTS succeeded)
    if (ttsResult && ttsResult.audio) {
      session.ws.send(ttsResult.audio);
      console.log(`[${session.sessionId}] Sent audio: ${ttsResult.audio.length} bytes`);
    }

    console.log(`[${session.sessionId}] Turn complete in ${totalDuration}ms (SER: ${serEmotion.duration}ms, STT: ${sttResult.duration}ms, LLM: ${llmResult.duration}ms${ttsResult ? `, TTS: ${ttsResult.duration}ms` : ''})`);

    // 11. Log turn snapshot for analysis
    logTurnSnapshot(session, {
      rawAudioPath: audioPath,
      transcript: sttResult.text,
      emotion: emotion,
      behavior: behavior,
      userPrefs: getUserPreferences(session.userId),
      llmProvider: llmResult.provider,
      llmModel: llmResult.model,
      llmPrompt: llmResult.prompt || null,  // If available from router
      reply: llmResult.reply,
      ttsProvider: ttsResult ? 'elevenlabs' : null,
      ttsProfile: ttsResult?.profile || null,
      serDuration: serEmotion.duration || 0,
      sttDuration: sttResult.duration,
      llmDuration: llmResult.duration,
      ttsDuration: ttsResult?.duration || 0,
      totalDuration
    });

    // 12. Clear audio for next turn
    session.clearAudio();

    // 10. Optionally cleanup temp file
    try {
      fs.unlinkSync(audioPath);
    } catch (e) {
      // Ignore cleanup errors
    }

  } catch (error) {
    console.error(`[${session.sessionId}] Turn processing error:`, error);

    session.send('turn_result', {
      transcript: '',
      reply: "I'm sorry, something went wrong. Let's try again.",
      error: error.message
    });

    session.clearAudio();
  }
}

/**
 * Periodic cleanup of old temp files
 */
setInterval(() => {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes

  try {
    const files = fs.readdirSync(CONFIG.audioTempDir);

    for (const file of files) {
      const filepath = path.join(CONFIG.audioTempDir, file);
      const stats = fs.statSync(filepath);

      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filepath);
        console.log('[Cleanup] Removed old temp file:', file);
      }
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}, CONFIG.cleanupInterval);

/**
 * Graceful shutdown
 */
process.on('SIGINT', () => {
  console.log('\n[Shutdown] Closing server...');

  wss.clients.forEach(client => {
    client.close();
  });

  wss.close(() => {
    console.log('[Shutdown] Server closed.');
    process.exit(0);
  });
});

export default wss;
