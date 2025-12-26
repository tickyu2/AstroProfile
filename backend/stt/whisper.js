/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WHISPER STT - Local Speech-to-Text using Whisper.cpp
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Transcribes audio files using Whisper.cpp (local, fast, private).
 *
 * Prerequisites:
 * 1. Clone whisper.cpp: git clone https://github.com/ggerganov/whisper.cpp
 * 2. Build: cd whisper.cpp && make
 * 3. Download model: ./models/download-ggml-model.sh base.en
 *
 * Created: December 21, 2025
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFileAsync = promisify(execFile);

/**
 * Configuration - adjust paths to your whisper.cpp installation
 */
const CONFIG = {
  // Path to whisper.cpp main binary
  whisperBin: process.env.WHISPER_BIN || path.join(process.cwd(), '..', 'whisper.cpp', 'main'),

  // Path to whisper model
  whisperModel: process.env.WHISPER_MODEL || path.join(process.cwd(), '..', 'whisper.cpp', 'models', 'ggml-base.en.bin'),

  // Default language
  language: 'en',

  // Max audio duration in seconds (for safety)
  maxDuration: 30,

  // Timeout in ms
  timeout: 60000
};

/**
 * Check if whisper.cpp is available
 * @returns {Promise<boolean>}
 */
export async function isWhisperAvailable() {
  try {
    // Check if binary exists
    if (!fs.existsSync(CONFIG.whisperBin)) {
      console.warn('[Whisper] Binary not found at:', CONFIG.whisperBin);
      return false;
    }

    // Check if model exists
    if (!fs.existsSync(CONFIG.whisperModel)) {
      console.warn('[Whisper] Model not found at:', CONFIG.whisperModel);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Whisper] Availability check failed:', error);
    return false;
  }
}

/**
 * Transcribe audio file using Whisper.cpp
 *
 * @param {string} audioPath - Path to WAV file (16kHz mono recommended)
 * @param {Object} options - Optional settings
 * @returns {Promise<Object>} - { text, language, duration }
 */
export async function transcribeWithWhisper(audioPath, options = {}) {
  const startTime = Date.now();

  // Validate file exists
  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio file not found: ${audioPath}`);
  }

  // Build command args
  const args = [
    '-m', options.model || CONFIG.whisperModel,
    '-f', audioPath,
    '-l', options.language || CONFIG.language,
    '-nt',              // No timestamps
    '-np',              // No progress
    '--no-prints',      // Minimal output (if supported)
  ];

  // Add optional flags
  if (options.translate) {
    args.push('-tr');   // Translate to English
  }

  console.log('[Whisper] Transcribing:', audioPath);
  console.log('[Whisper] Command:', CONFIG.whisperBin, args.join(' '));

  try {
    const { stdout, stderr } = await execFileAsync(
      CONFIG.whisperBin,
      args,
      { timeout: options.timeout || CONFIG.timeout }
    );

    // Parse output - Whisper.cpp prints transcript to stdout
    // Format can vary, typically just the text or with timestamps
    const text = parseWhisperOutput(stdout);

    const duration = Date.now() - startTime;
    console.log(`[Whisper] Transcribed in ${duration}ms:`, text.substring(0, 100));

    return {
      text,
      language: options.language || CONFIG.language,
      duration,
      audioPath
    };

  } catch (error) {
    console.error('[Whisper] Transcription failed:', error);

    // Return empty on error rather than crashing
    return {
      text: '',
      error: error.message,
      duration: Date.now() - startTime,
      audioPath
    };
  }
}

/**
 * Parse Whisper.cpp output to extract clean transcript
 *
 * @param {string} output - Raw stdout from whisper.cpp
 * @returns {string} - Clean transcript text
 */
function parseWhisperOutput(output) {
  if (!output) return '';

  // Split into lines and clean
  const lines = output.split('\n');

  // Filter out system messages and timestamps
  const textLines = lines
    .map(line => line.trim())
    .filter(line => {
      // Skip empty lines
      if (!line) return false;

      // Skip timestamp lines like "[00:00:00.000 --> 00:00:02.000]"
      if (line.match(/^\[\d{2}:\d{2}:\d{2}/)) return false;

      // Skip whisper system messages
      if (line.startsWith('whisper_')) return false;
      if (line.startsWith('main:')) return false;
      if (line.includes('model loaded')) return false;
      if (line.includes('processing')) return false;

      return true;
    })
    // Remove any remaining timestamp prefixes
    .map(line => line.replace(/^\[\d+:\d+:\d+\.\d+ --> \d+:\d+:\d+\.\d+\]\s*/, ''))
    // Remove speaker labels like "[SPEAKER]"
    .map(line => line.replace(/^\[.*?\]\s*/, ''));

  // Join and clean up whitespace
  return textLines
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Transcribe with fallback to Web Speech API description
 * (For when Whisper isn't available)
 */
export async function transcribeWithFallback(audioPath) {
  const available = await isWhisperAvailable();

  if (available) {
    return transcribeWithWhisper(audioPath);
  }

  // Return a placeholder - frontend should use Web Speech API
  console.warn('[Whisper] Not available, frontend should use Web Speech API');
  return {
    text: '',
    error: 'Whisper not available - use browser STT',
    fallback: true
  };
}

export default {
  transcribeWithWhisper,
  transcribeWithFallback,
  isWhisperAvailable,
  CONFIG
};
