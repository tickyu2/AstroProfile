/**
 * ===============================================================================
 * VOICE WEBSOCKET SERVER
 * ===============================================================================
 *
 * WebSocket server that bridges frontend audio to the VoiceManager.
 * Handles real-time audio streaming for OpenAI Realtime integration.
 *
 * PROTOCOL:
 * Client → Server:
 *   { type: 'start_session', profileId, sessionId, strategy }
 *   { type: 'audio', data: base64AudioChunk }
 *   { type: 'commit' }  // Signal end of utterance
 *   { type: 'end_session' }
 *
 * Server → Client:
 *   { type: 'session_started', sessionId, provider, supportsCues }
 *   { type: 'transcript', speaker: 'user'|'luna', text, cues, timestamp }
 *   { type: 'audio', data: base64AudioChunk }  // Luna's voice
 *   { type: 'cue', cue: { type, confidence, context } }
 *   { type: 'error', message }
 *   { type: 'session_ended', transcripts }
 *
 * Created: December 27, 2024
 * Part of: GENESIS Voice Mode Enhancement
 */

import { WebSocketServer } from 'ws';
import { voiceManager, VOICE_STRATEGIES } from './voiceManager.js';

// Active client sessions
const clientSessions = new Map();

/**
 * Initialize WebSocket server for voice streaming
 * @param {http.Server} server - HTTP server to attach to
 * @param {string} path - WebSocket path (default: /voice)
 */
export function initVoiceWebSocket(server, path = '/voice') {
  const wss = new WebSocketServer({ server, path });

  console.log(`[VoiceWS] WebSocket server initialized on path: ${path}`);

  wss.on('connection', (ws, req) => {
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[VoiceWS] Client connected: ${clientId}`);

    // Initialize client state
    clientSessions.set(clientId, {
      ws,
      profileId: null,
      sessionId: null,
      isActive: false
    });

    // Handle incoming messages
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        await handleClientMessage(clientId, message);
      } catch (error) {
        console.error(`[VoiceWS] Error handling message:`, error);
        sendToClient(clientId, {
          type: 'error',
          message: error.message
        });
      }
    });

    // Handle disconnect
    ws.on('close', () => {
      console.log(`[VoiceWS] Client disconnected: ${clientId}`);
      cleanupClient(clientId);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`[VoiceWS] Client error:`, error);
      cleanupClient(clientId);
    });

    // Send welcome message
    sendToClient(clientId, {
      type: 'connected',
      clientId,
      availableStrategies: Object.values(VOICE_STRATEGIES)
    });
  });

  return wss;
}

/**
 * Handle incoming client messages
 */
async function handleClientMessage(clientId, message) {
  const session = clientSessions.get(clientId);
  if (!session) return;

  switch (message.type) {
    case 'start_session':
      await handleStartSession(clientId, message);
      break;

    case 'audio':
      handleAudioChunk(clientId, message);
      break;

    case 'commit':
      handleCommit(clientId);
      break;

    case 'end_session':
      await handleEndSession(clientId);
      break;

    case 'set_strategy':
      await handleSetStrategy(clientId, message);
      break;

    default:
      console.warn(`[VoiceWS] Unknown message type: ${message.type}`);
  }
}

/**
 * Start a voice session
 */
async function handleStartSession(clientId, message) {
  const session = clientSessions.get(clientId);
  const { profileId, sessionId, strategy } = message;

  console.log(`[VoiceWS] Starting session for ${clientId}:`, { profileId, strategy });

  try {
    // Set strategy if provided
    if (strategy && Object.values(VOICE_STRATEGIES).includes(strategy)) {
      await voiceManager.setStrategy(strategy);
    }

    // Initialize voice manager if needed
    if (!voiceManager.activeProvider) {
      await voiceManager.initialize();
    }

    // Start session
    const result = await voiceManager.startSession({
      profileId,
      sessionId: sessionId || `voice_${Date.now()}`
    });

    // Update client state
    session.profileId = profileId;
    session.sessionId = result.sessionId;
    session.isActive = true;

    // Wire up callbacks for this client
    wireCallbacks(clientId);

    // Send confirmation
    sendToClient(clientId, {
      type: 'session_started',
      sessionId: result.sessionId,
      provider: result.provider,
      supportsCues: result.supportsCues
    });

  } catch (error) {
    console.error(`[VoiceWS] Failed to start session:`, error);
    sendToClient(clientId, {
      type: 'error',
      message: `Failed to start session: ${error.message}`
    });
  }
}

/**
 * Handle audio chunk from client
 */
function handleAudioChunk(clientId, message) {
  const session = clientSessions.get(clientId);
  if (!session?.isActive) {
    sendToClient(clientId, {
      type: 'error',
      message: 'No active session'
    });
    return;
  }

  // Decode base64 audio
  const audioBuffer = Buffer.from(message.data, 'base64');

  // Stream to voice manager
  voiceManager.streamAudio(audioBuffer);
}

/**
 * Handle audio commit (end of utterance)
 */
function handleCommit(clientId) {
  const session = clientSessions.get(clientId);
  if (!session?.isActive) return;

  voiceManager.commitAudio();
}

/**
 * End voice session
 */
async function handleEndSession(clientId) {
  const session = clientSessions.get(clientId);
  if (!session) return;

  console.log(`[VoiceWS] Ending session for ${clientId}`);

  try {
    const transcripts = await voiceManager.endSession();

    session.isActive = false;

    sendToClient(clientId, {
      type: 'session_ended',
      transcripts
    });

  } catch (error) {
    console.error(`[VoiceWS] Error ending session:`, error);
    sendToClient(clientId, {
      type: 'error',
      message: error.message
    });
  }
}

/**
 * Change voice strategy mid-session
 */
async function handleSetStrategy(clientId, message) {
  const { strategy } = message;

  if (!Object.values(VOICE_STRATEGIES).includes(strategy)) {
    sendToClient(clientId, {
      type: 'error',
      message: `Invalid strategy: ${strategy}`
    });
    return;
  }

  try {
    await voiceManager.setStrategy(strategy);

    sendToClient(clientId, {
      type: 'strategy_changed',
      strategy,
      provider: voiceManager.getProviderInfo()
    });

  } catch (error) {
    sendToClient(clientId, {
      type: 'error',
      message: error.message
    });
  }
}

/**
 * Wire up voiceManager callbacks to send to specific client
 */
function wireCallbacks(clientId) {
  // Transcript callback
  voiceManager.onTranscript((transcript) => {
    sendToClient(clientId, {
      type: 'transcript',
      speaker: transcript.speaker,
      text: transcript.text,
      cues: transcript.cues || [],
      timestamp: transcript.timestamp,
      provider: transcript.provider
    });
  });

  // Audio callback (Luna's voice)
  voiceManager.onAudio((audioData) => {
    sendToClient(clientId, {
      type: 'audio',
      data: audioData.toString('base64')
    });
  });

  // Cue callback
  voiceManager.onCue((cue) => {
    sendToClient(clientId, {
      type: 'cue',
      cue
    });
  });
}

/**
 * Send message to client
 */
function sendToClient(clientId, message) {
  const session = clientSessions.get(clientId);
  if (!session?.ws || session.ws.readyState !== 1) return;

  try {
    session.ws.send(JSON.stringify(message));
  } catch (error) {
    console.error(`[VoiceWS] Error sending to client:`, error);
  }
}

/**
 * Cleanup client session
 */
function cleanupClient(clientId) {
  const session = clientSessions.get(clientId);
  if (!session) return;

  if (session.isActive) {
    voiceManager.endSession().catch(console.error);
  }

  clientSessions.delete(clientId);
}

/**
 * Get server stats
 */
export function getVoiceWebSocketStats() {
  return {
    activeClients: clientSessions.size,
    providerInfo: voiceManager.getProviderInfo()
  };
}

export default initVoiceWebSocket;
