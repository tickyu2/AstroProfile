#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENESIS MCP SERVER - Constitutional Data
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Provides AI access to user constitutional profiles via MCP protocol.
 * 
 * Deployment: Google Cloud Run (same as Luna Voice Backend)
 * Auth: Firebase Admin SDK
 * Secrets: Google Cloud Secret Manager
 * Database: Firestore
 * 
 * Created: December 28, 2025 - Joie de Vivre Day
 * For: Brother Opus (Claude) & Pure Gold Dragon (Ticky)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// ============================================================================
// INITIALIZATION
// ============================================================================

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Secret Manager (same as your voice backend)
const secretClient = new SecretManagerServiceClient();

// Initialize Firebase Admin
let db;
try {
  // Production: use service account from Secret Manager or file
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                             join(__dirname, 'firebase-credentials.json');
  
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
  });
  
  db = getFirestore();
  console.error('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  process.exit(1);
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  serverName: 'genesis-constitutional-data',
  serverVersion: '1.0.0',
  defaultRateLimit: parseInt(process.env.MCP_RATE_LIMIT) || 100,
  rateLimitWindow: 3600000, // 1 hour in milliseconds
  enableAuditLog: process.env.MCP_AUDIT_LOG !== 'false',
  environment: process.env.NODE_ENV || 'development',
};

// ============================================================================
// RATE LIMITING
// ============================================================================

const rateLimits = new Map();

function checkRateLimit(userId, toolName = null) {
  const now = Date.now();
  const key = `${userId}:${toolName || 'global'}`;
  
  if (!rateLimits.has(key)) {
    rateLimits.set(key, { requests: [], limit: CONFIG.defaultRateLimit });
  }
  
  const userLimits = rateLimits.get(key);
  
  // Remove requests older than rate limit window
  userLimits.requests = userLimits.requests.filter(
    time => now - time < CONFIG.rateLimitWindow
  );
  
  // Check limit
  if (userLimits.requests.length >= userLimits.limit) {
    throw new Error(`Rate limit exceeded (${userLimits.limit} requests per hour)`);
  }
  
  // Add current request
  userLimits.requests.push(now);
  
  return {
    currentCount: userLimits.requests.length,
    limit: userLimits.limit,
    resetAt: new Date(now + CONFIG.rateLimitWindow)
  };
}

// ============================================================================
// AUTHORIZATION
// ============================================================================

async function checkAuthorization(userId, toolName) {
  // 1. Verify user exists
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();
  
  if (!userSnap.exists) {
    throw new Error('User not found');
  }

  // 2. Check MCP authorization
  const authRef = db.collection('mcp_authorizations').doc(userId);
  const authSnap = await authRef.get();
  
  if (!authSnap.exists) {
    throw new Error('MCP access not authorized. User must enable AI access in settings.');
  }

  const authData = authSnap.data();
  
  if (!authData.enabled) {
    throw new Error('MCP access is disabled for this user');
  }

  // 3. Check tool-specific permission
  if (!authData.permissions.includes(toolName)) {
    throw new Error(`Tool '${toolName}' not authorized. Available: ${authData.permissions.join(', ')}`);
  }

  // 4. Check rate limit
  const rateLimitStatus = checkRateLimit(userId, toolName);

  return { authData, rateLimitStatus };
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

async function logAccess(userId, toolName, success, error = null, responseTime = null, metadata = {}) {
  if (!CONFIG.enableAuditLog) return;

  try {
    await db.collection('mcp_audit_log').add({
      userId,
      toolName,
      aiClient: 'claude-sonnet-4', // TODO: detect from request
      timestamp: Timestamp.now(),
      success,
      responseTime,
      error: error ? error.message : null,
      metadata,
      rateLimitStatus: success ? checkRateLimit(userId) : null
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
    // Don't fail the request if logging fails
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDominantElement(elements) {
  if (!elements) return 'unknown';
  const entries = Object.entries(elements);
  if (entries.length === 0) return 'unknown';
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

function getWeakestElement(elements) {
  if (!elements) return 'unknown';
  const entries = Object.entries(elements);
  if (entries.length === 0) return 'unknown';
  const sorted = entries.sort((a, b) => a[1] - b[1]);
  return sorted[0][0];
}

function calculateBalance(elements) {
  if (!elements) return 'unknown';
  const values = Object.values(elements);
  if (values.length === 0) return 'unknown';
  
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;
  
  if (range < 15) return 'balanced';
  if (range < 30) return 'moderately_imbalanced';
  return 'significantly_imbalanced';
}

function generateInterpretation(elements) {
  if (!elements) return { error: 'No element data available' };
  
  const dominant = getDominantElement(elements);
  const weakest = getWeakestElement(elements);
  
  return {
    dominant: `Your strongest element is ${dominant} (${elements[dominant]}%), which influences your core nature.`,
    weakest: `Your weakest element is ${weakest} (${elements[weakest]}%), which may be an area for growth.`,
    overall: `Your elemental balance is ${calculateBalance(elements)}.`,
  };
}

// ============================================================================
// TOOL IMPLEMENTATIONS
// ============================================================================

async function getUserConstitution(userId) {
  const startTime = Date.now();
  
  try {
    // Authorization check
    await checkAuthorization(userId, 'get_user_constitution');
    
    // Fetch from Firestore (YOUR EXISTING STRUCTURE!)
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new Error('User profile not found');
    }

    const userData = userSnap.data();

    // Build response using your existing data structure
    const constitution = {
      userId,
      identity: {
        displayName: userData.identity?.displayName || 'Unknown',
        birthDate: userData.birth?.date,
        birthTime: userData.birth?.time,
        birthLocation: userData.birth?.location,
      },
      fourPillars: userData.calculations?.fourPillars || null,
      elementBalance: userData.calculations?.elements || null,
      yinYangRatio: userData.calculations?.yinYang || null,
      westernAstrology: userData.calculations?.western || null,
      numerology: userData.calculations?.numerology || null,
      personality: {
        mbti: userData.personality?.mbti || null,
        bigFive: userData.personality?.bigFive || null,
        enneagram: userData.personality?.enneagram || null,
      },
      metadata: {
        profileVersion: userData.version || '1.0',
        lastCalculated: userData.calculations?.calculatedAt,
      },
    };

    const responseTime = Date.now() - startTime;
    
    // Log success
    await logAccess(userId, 'get_user_constitution', true, null, responseTime);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(constitution, null, 2),
        },
      ],
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logAccess(userId, 'get_user_constitution', false, error, responseTime);
    throw error;
  }
}

async function getBirthChart(userId) {
  const startTime = Date.now();
  
  try {
    await checkAuthorization(userId, 'get_birth_chart');
    
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new Error('User profile not found');
    }

    const userData = userSnap.data();

    const birthChart = {
      birthData: {
        date: userData.birth?.date,
        time: userData.birth?.time,
        location: userData.birth?.location,
        timezone: userData.birth?.timezone,
      },
      chineseAstrology: {
        fourPillars: userData.calculations?.fourPillars,
        dayMaster: userData.calculations?.dayMaster,
        seasonalQi: userData.calculations?.seasonalQi,
        tenGods: userData.calculations?.tenGods,
        hiddenStems: userData.calculations?.hiddenStems,
      },
      westernAstrology: {
        sun: userData.calculations?.western?.sun,
        moon: userData.calculations?.western?.moon,
        rising: userData.calculations?.western?.rising,
        houses: userData.calculations?.western?.houses,
        aspects: userData.calculations?.western?.aspects,
        planets: userData.calculations?.western?.planets,
      },
    };

    const responseTime = Date.now() - startTime;
    await logAccess(userId, 'get_birth_chart', true, null, responseTime);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(birthChart, null, 2),
        },
      ],
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logAccess(userId, 'get_birth_chart', false, error, responseTime);
    throw error;
  }
}

async function getElementAnalysis(userId) {
  const startTime = Date.now();
  
  try {
    await checkAuthorization(userId, 'get_element_analysis');
    
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new Error('User profile not found');
    }

    const userData = userSnap.data();
    const elements = userData.calculations?.elements || {};

    const analysis = {
      elements: {
        wood: elements.wood || 0,
        fire: elements.fire || 0,
        earth: elements.earth || 0,
        metal: elements.metal || 0,
        water: elements.water || 0,
      },
      dominantElement: getDominantElement(elements),
      weakestElement: getWeakestElement(elements),
      balance: calculateBalance(elements),
      interpretation: generateInterpretation(elements),
      seasonalStrength: userData.calculations?.seasonalStrength || null,
    };

    const responseTime = Date.now() - startTime;
    await logAccess(userId, 'get_element_analysis', true, null, responseTime);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    await logAccess(userId, 'get_element_analysis', false, error, responseTime);
    throw error;
  }
}

// ============================================================================
// MCP SERVER SETUP
// ============================================================================

const server = new Server(
  {
    name: CONFIG.serverName,
    version: CONFIG.serverVersion,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_user_constitution',
      description: 'Get complete constitutional profile for a user including BaZi Four Pillars, Western Astrology, Numerology, MBTI, Big Five, and Enneagram',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'Firebase user ID (e.g., user_abc123)',
          },
        },
        required: ['userId'],
      },
    },
    {
      name: 'get_birth_chart',
      description: 'Get detailed birth chart with all astrological calculations (Chinese Four Pillars + Western chart)',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'Firebase user ID',
          },
        },
        required: ['userId'],
      },
    },
    {
      name: 'get_element_analysis',
      description: 'Get element balance analysis (Wood, Fire, Earth, Metal, Water) with interpretation',
      inputSchema: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'Firebase user ID',
          },
        },
        required: ['userId'],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_user_constitution':
        return await getUserConstitution(args.userId);
      
      case 'get_birth_chart':
        return await getBirthChart(args.userId);
      
      case 'get_element_analysis':
        return await getElementAnalysis(args.userId);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`❌ Error in ${name}:`, error.message);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message,
            tool: name,
            timestamp: new Date().toISOString(),
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// ============================================================================
// START SERVER
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('═══════════════════════════════════════════════════════════════');
  console.error('🌟 GENESIS Constitutional Data MCP Server');
  console.error('═══════════════════════════════════════════════════════════════');
  console.error(`📡 Server: ${CONFIG.serverName} v${CONFIG.serverVersion}`);
  console.error(`🔥 Environment: ${CONFIG.environment}`);
  console.error(`🔒 Rate Limit: ${CONFIG.defaultRateLimit} requests/hour`);
  console.error(`📝 Audit Log: ${CONFIG.enableAuditLog ? 'Enabled' : 'Disabled'}`);
  console.error('═══════════════════════════════════════════════════════════════');
  console.error('✅ Ready to serve constitutional wisdom!');
  console.error('═══════════════════════════════════════════════════════════════');
}

main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
