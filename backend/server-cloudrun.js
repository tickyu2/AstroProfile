/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LUNA VOICE BACKEND - Cloud Run Entry Point
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Production-ready WebSocket server for Cloud Run deployment.
 * Features:
 * - HTTP server with health check endpoint
 * - WebSocket upgrade for voice streaming
 * - Rate limiting integration
 * - Secrets management
 * - Audio quality presets
 * - LANGUAGE AUTO-DETECTION (v2) - Whisper detects, propagates to LLM/TTS
 *
 * Deploy: gcloud builds submit --config=deploy/cloudbuild.yaml
 *
 * Created: December 28, 2024
 * Updated: December 28, 2024 - Added language auto-detection
 * Part of: GENESIS Voice Mode - Production Deployment / Conversational AI v2
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import 'dotenv/config';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import services
import { transcribeWithGroqWhisper, isGroqWhisperAvailable } from './stt/groqWhisper.js';
import { runLLM, initRouter, getProviderStatus } from './llm/router.js';
import { speakWithElevenLabs, isElevenLabsAvailable } from './tts/elevenLabs.js';
import { initSecrets, validateSecrets, getSecret } from './config/secrets.js';
import {
  checkConnectionLimit,
  initSessionLimits,
  checkTurnLimit,
  checkSTTLimit,
  checkTTSLimit,
  cleanupSession,
  getClientIP,
  getRateLimiterStats
} from './middleware/rateLimiter.js';
import { getPreset, getAvailablePresets } from './config/audioQuality.js';
import {
  languageService,
  getLanguageConfig,
  buildLanguageInstruction,
  getSupportedLanguages
} from './services/languageService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  port: process.env.PORT || 8080,
  audioTempDir: path.join(__dirname, 'audio', 'temp'),
  maxAudioSize: 10 * 1024 * 1024, // 10MB max audio
  cleanupInterval: 60000
};

// Ensure temp directory exists
if (!fs.existsSync(CONFIG.audioTempDir)) {
  fs.mkdirSync(CONFIG.audioTempDir, { recursive: true });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

const sessions = new Map();

class VoiceSession {
  constructor(ws, sessionId, clientIP) {
    this.ws = ws;
    this.sessionId = sessionId;
    this.clientIP = clientIP;
    this.audioChunks = [];
    this.currentTurnId = 0;
    this.conversationHistory = [];
    this.createdAt = Date.now();
    this.userId = 'anonymous';
    this.audioPreset = 'balanced';

    // Language tracking (v2)
    this.detectedLanguage = 'en';
    this.languageHistory = [];

    this.stats = {
      turns: 0,
      sttCalls: 0,
      ttsCalls: 0
    };
  }

  /**
   * Update detected language and track history
   * @param {string} language - Detected language code
   */
  updateLanguage(language) {
    this.detectedLanguage = language;
    this.languageHistory.push(language);
    languageService.recordLanguage(this.sessionId, language);
  }

  /**
   * Get the most consistent language for this session
   * (handles mixed-language situations)
   */
  getSessionLanguage() {
    return languageService.getSessionLanguage(this.sessionId);
  }

  addAudioChunk(chunk) {
    this.audioChunks.push(chunk);
  }

  getAudioBuffer() {
    return Buffer.concat(this.audioChunks);
  }

  clearAudio() {
    this.audioChunks = [];
  }

  async saveAudioToFile() {
    const buffer = this.getAudioBuffer();
    if (buffer.length === 0) return null;

    this.currentTurnId++;
    const filename = `turn-${this.sessionId}-${this.currentTurnId}-${Date.now()}.wav`;
    const filepath = path.join(CONFIG.audioTempDir, filename);
    fs.writeFileSync(filepath, buffer);
    console.log(`[${this.sessionId}] Saved audio: ${filename} (${buffer.length} bytes)`);
    return filepath;
  }

  addToHistory(role, content) {
    this.conversationHistory.push({ role, content, timestamp: Date.now() });
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  send(type, payload) {
    if (this.ws.readyState === 1) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  cleanup() {
    this.audioChunks = [];
    this.conversationHistory = [];
    cleanupSession(this.sessionId);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTTP SERVER (for health checks)
// ═══════════════════════════════════════════════════════════════════════════════

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/health' && req.method === 'GET') {
    const secretStatus = validateSecrets();
    const status = {
      status: secretStatus.valid ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        groq: isGroqWhisperAvailable(),
        elevenlabs: isElevenLabsAvailable(),
        secrets: secretStatus.status
      },
      connections: sessions.size,
      rateLimiter: getRateLimiterStats()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
    return;
  }

  if (req.url === '/presets' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getAvailablePresets()));
    return;
  }

  // v2: Languages endpoint
  if (req.url === '/languages' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      supported: getSupportedLanguages(),
      autoDetect: true,
      default: 'en'
    }));
    return;
  }

  // 404 for other routes
  res.writeHead(404);
  res.end('Not Found');
});

// ═══════════════════════════════════════════════════════════════════════════════
// WEBSOCKET SERVER
// ═══════════════════════════════════════════════════════════════════════════════

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const clientIP = getClientIP(req);

  // Check connection rate limit
  const connLimit = checkConnectionLimit(clientIP);
  if (!connLimit.allowed) {
    ws.close(4029, connLimit.message);
    console.log(`[RateLimit] Connection rejected for IP ${clientIP}: ${connLimit.message}`);
    return;
  }

  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const session = new VoiceSession(ws, sessionId, clientIP);
  sessions.set(sessionId, session);
  initSessionLimits(sessionId);

  console.log(`[${sessionId}] Client connected from ${clientIP}`);
  session.send('session_started', {
    sessionId,
    presets: getAvailablePresets(),
    languages: {
      supported: getSupportedLanguages().map(l => ({ code: l.code, name: l.name })),
      autoDetect: true,
      default: 'en'
    }
  });

  ws.on('message', async (raw) => {
    let msg;

    try {
      const str = raw.toString();
      if (str.startsWith('{')) {
        msg = JSON.parse(str);
      } else {
        session.addAudioChunk(raw);
        return;
      }
    } catch (e) {
      session.addAudioChunk(raw);
      return;
    }

    switch (msg.type) {
      case 'audio_chunk':
        if (msg.payload) {
          const buffer = Buffer.from(msg.payload, 'base64');
          session.addAudioChunk(buffer);
        }
        break;

      case 'set_preset':
        if (msg.preset && ['fast', 'balanced', 'quality'].includes(msg.preset)) {
          session.audioPreset = msg.preset;
          session.send('preset_changed', { preset: msg.preset, config: getPreset(msg.preset) });
        }
        break;

      case 'end_turn':
        await processEndTurn(session, msg.emotion || {});
        break;

      case 'cancel_turn':
        session.clearAudio();
        session.send('turn_cancelled', {});
        break;

      case 'ping':
        session.send('pong', { timestamp: Date.now() });
        break;

      default:
        console.log(`[${sessionId}] Unknown message type:`, msg.type);
    }
  });

  ws.on('close', () => {
    console.log(`[${sessionId}] Client disconnected`);
    session.cleanup();
    sessions.delete(sessionId);
  });

  ws.on('error', (error) => {
    console.error(`[${sessionId}] WebSocket error:`, error.message);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TURN PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

async function processEndTurn(session, frontendEmotion) {
  const turnStartTime = Date.now();
  console.log(`[${session.sessionId}] Processing turn...`);

  // Check turn rate limit
  const turnLimit = checkTurnLimit(session.sessionId);
  if (!turnLimit.allowed) {
    session.send('turn_result', {
      transcript: '',
      reply: turnLimit.message,
      error: 'rate_limit'
    });
    return;
  }

  session.send('processing_started', { emotion: frontendEmotion });

  try {
    const audioBuffer = session.getAudioBuffer();

    if (audioBuffer.length === 0) {
      session.send('turn_result', {
        transcript: '',
        reply: "I didn't catch that. Could you say that again?",
        error: 'No audio received'
      });
      return;
    }

    // Get preset config
    const preset = getPreset(session.audioPreset);
    const emotion = {
      primary: frontendEmotion.primary || 'neutral',
      secondary: frontendEmotion.secondary || '',
      confidence: frontendEmotion.confidence || 0.5
    };

    // 1. Save audio
    const audioPath = await session.saveAudioToFile();

    // 2. STT with rate limit check
    const sttLimit = checkSTTLimit(session.sessionId);
    if (!sttLimit.allowed) {
      session.send('turn_result', {
        transcript: '',
        reply: sttLimit.message,
        error: 'rate_limit'
      });
      session.clearAudio();
      return;
    }

    session.send('stt_started', {});
    const sttResult = await transcribeWithGroqWhisper(audioPath, preset.stt);
    session.stats.sttCalls++;

    // v2: Track detected language
    const detectedLanguage = sttResult.language || 'en';
    session.updateLanguage(detectedLanguage);
    const languageConfig = getLanguageConfig(detectedLanguage);

    console.log(`[${session.sessionId}] STT [${detectedLanguage}]:`, sttResult.text);
    session.send('stt_complete', {
      transcript: sttResult.text,
      language: detectedLanguage,
      languageName: languageConfig.name,
      isAutoDetected: sttResult.isAutoDetected
    });

    if (!sttResult.text?.trim()) {
      session.send('turn_result', {
        transcript: '',
        reply: "I'm here. What would you like to talk about?",
        warning: 'Empty transcript',
        language: detectedLanguage
      });
      session.clearAudio();
      return;
    }

    session.addToHistory('user', sttResult.text);

    // 3. LLM with language instruction (v2)
    session.send('llm_started', { language: detectedLanguage });

    // Build language instruction for non-English
    const languageInstruction = buildLanguageInstruction(detectedLanguage);

    const llmResult = await runLLM(sttResult.text, emotion, {
      history: session.conversationHistory.slice(-6).map(h => ({
        role: h.role,
        text: h.content
      })),
      languageInstruction  // v2: Add language instruction
    });

    console.log(`[${session.sessionId}] LLM [${detectedLanguage}]:`, llmResult.reply);
    session.addToHistory('assistant', llmResult.reply);

    // 4. TTS with rate limit check + language (v2)
    let ttsResult = null;
    if (isElevenLabsAvailable()) {
      const ttsLimit = checkTTSLimit(session.sessionId);
      if (ttsLimit.allowed) {
        session.send('tts_started', { emotion: emotion.primary, language: detectedLanguage });
        try {
          // v2: Pass language to TTS for correct model/voice selection
          ttsResult = await speakWithElevenLabs(llmResult.reply, emotion, {
            ...preset.tts,
            language: detectedLanguage
          });
          session.stats.ttsCalls++;
          console.log(`[${session.sessionId}] TTS [${detectedLanguage}]: ${ttsResult.duration}ms`);
          session.send('tts_complete', { duration: ttsResult.duration, language: detectedLanguage });
        } catch (ttsError) {
          console.error(`[${session.sessionId}] TTS error:`, ttsError.message);
        }
      }
    }

    // 5. Send result with language info (v2)
    const totalDuration = Date.now() - turnStartTime;
    session.stats.turns++;

    session.send('turn_result', {
      transcript: sttResult.text,
      reply: llmResult.reply,
      emotion: emotion,
      sttDuration: sttResult.duration,
      llmDuration: llmResult.duration,
      llmProvider: llmResult.provider,
      ttsDuration: ttsResult?.duration || 0,
      totalDuration,
      preset: session.audioPreset,
      // v2: Language info
      language: detectedLanguage,
      languageName: languageConfig.name,
      isAutoDetected: sttResult.isAutoDetected
    });

    // 6. Send audio
    if (ttsResult?.audio) {
      session.ws.send(ttsResult.audio);
      console.log(`[${session.sessionId}] Sent audio: ${ttsResult.audio.length} bytes`);
    }

    console.log(`[${session.sessionId}] Turn complete in ${totalDuration}ms`);

    // 7. Cleanup
    session.clearAudio();
    try { fs.unlinkSync(audioPath); } catch (e) {}

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

// ═══════════════════════════════════════════════════════════════════════════════
// PERIODIC CLEANUP
// ═══════════════════════════════════════════════════════════════════════════════

setInterval(() => {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000;

  try {
    const files = fs.readdirSync(CONFIG.audioTempDir);
    for (const file of files) {
      const filepath = path.join(CONFIG.audioTempDir, file);
      const stats = fs.statSync(filepath);
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filepath);
        console.log('[Cleanup] Removed:', file);
      }
    }
  } catch (error) {}
}, CONFIG.cleanupInterval);

// ═══════════════════════════════════════════════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════════════════════════════════════════════

async function startup() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  LUNA VOICE BACKEND - Cloud Run');
  console.log('═══════════════════════════════════════════════════════════════════');

  // Initialize secrets
  const secretStatus = await initSecrets();
  console.log(`[Startup] Secrets: ${secretStatus.hasErrors ? 'ERRORS' : 'OK'}`);
  if (secretStatus.hasErrors) {
    console.warn('[Startup] Secret errors:', secretStatus.errors);
  }

  // Initialize LLM router
  await initRouter();

  // Check services
  console.log(`[Startup] Groq STT: ${isGroqWhisperAvailable() ? 'Ready' : 'Not configured'}`);
  console.log(`[Startup] ElevenLabs TTS: ${isElevenLabsAvailable() ? 'Ready' : 'Not configured'}`);

  // Start server
  server.listen(CONFIG.port, () => {
    console.log(`[Startup] HTTP/WS server listening on port ${CONFIG.port}`);
    console.log(`[Startup] Health check: http://localhost:${CONFIG.port}/health`);
    console.log('═══════════════════════════════════════════════════════════════════');
  });
}

startup().catch(console.error);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Shutdown] Closing server...');
  wss.clients.forEach(client => client.close());
  server.close(() => {
    console.log('[Shutdown] Server closed.');
    process.exit(0);
  });
});

export default server;
