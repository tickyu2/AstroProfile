#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GENESIS MCP - Firestore Initialization Script
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Creates mcp_authorizations documents for all existing users.
 * Run this ONCE after deploying the MCP server.
 * 
 * Usage:
 *   node scripts/init-firestore.js
 *   node scripts/init-firestore.js --enable-all  (enable MCP for all users)
 *   node scripts/init-firestore.js --user=USER_ID (enable for specific user)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line args
const args = process.argv.slice(2);
const enableAll = args.includes('--enable-all');
const specificUser = args.find(arg => arg.startsWith('--user='))?.split('=')[1];

console.log('═══════════════════════════════════════════════════════════════');
console.log('🔧 GENESIS MCP - Firestore Initialization');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`Mode: ${enableAll ? 'Enable All Users' : specificUser ? `Specific User (${specificUser})` : 'Disable All (Safe Mode)'}`);
console.log('═══════════════════════════════════════════════════════════════\n');

// Initialize Firebase
const serviceAccountPath = join(__dirname, '../firebase-credentials.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = getFirestore();

// Default authorization template
function createAuthTemplate(userId, enabled = false) {
  return {
    userId,
    enabled,
    permissions: enabled ? [
      'get_user_constitution',
      'get_birth_chart',
      'get_element_analysis'
    ] : [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    aiClients: enabled ? ['claude-sonnet-4', 'claude-opus-4'] : [],
    rateLimit: {
      requestsPerHour: 100,
      customLimits: {}
    },
    preferences: {
      autoApprove: false,
      notifyOnAccess: true,
      dataScope: 'full'
    }
  };
}

async function initializeForAllUsers() {
  console.log('📊 Fetching all users from Firestore...');
  
  const usersSnapshot = await db.collection('users').get();
  
  console.log(`Found ${usersSnapshot.size} users\n`);
  
  if (usersSnapshot.size === 0) {
    console.log('⚠️  No users found. Nothing to initialize.');
    return;
  }

  const batch = db.batch();
  let count = 0;
  let enabled = 0;
  
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const authRef = db.collection('mcp_authorizations').doc(userId);
    
    // Create authorization document
    const authData = createAuthTemplate(userId, enableAll);
    batch.set(authRef, authData, { merge: true });
    
    count++;
    if (enableAll) enabled++;
    
    // Firestore batch limit is 500
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`✅ Initialized ${count} users...`);
      // Create new batch
      batch = db.batch();
    }
  }
  
  // Commit remaining
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✅ Initialization Complete!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Total users:       ${count}`);
  console.log(`MCP enabled:       ${enabled}`);
  console.log(`MCP disabled:      ${count - enabled}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (!enableAll) {
    console.log('💡 TIP: To enable MCP for specific users, update their documents:');
    console.log('   db.collection("mcp_authorizations").doc(userId).update({');
    console.log('     enabled: true,');
    console.log('     permissions: ["get_user_constitution", ...]');
    console.log('   })\n');
  }
}

async function initializeForSpecificUser(userId) {
  console.log(`📊 Initializing MCP for user: ${userId}\n`);
  
  // Check if user exists
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();
  
  if (!userSnap.exists) {
    console.error(`❌ User ${userId} not found in users collection`);
    process.exit(1);
  }
  
  // Create authorization with MCP enabled
  const authRef = db.collection('mcp_authorizations').doc(userId);
  const authData = createAuthTemplate(userId, true);
  
  await authRef.set(authData, { merge: true });
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ User Initialized!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`User ID:           ${userId}`);
  console.log(`MCP Enabled:       Yes`);
  console.log(`Permissions:       3 tools`);
  console.log(`Rate Limit:        100/hour`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

async function createIndexes() {
  console.log('📝 Creating Firestore indexes...\n');
  
  console.log('⚠️  Note: Firestore indexes must be created via firestore.indexes.json');
  console.log('Add this to your firestore.indexes.json:');
  console.log(JSON.stringify({
    indexes: [
      {
        collectionGroup: 'mcp_audit_log',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'timestamp', order: 'DESCENDING' }
        ]
      },
      {
        collectionGroup: 'mcp_audit_log',
        queryScope: 'COLLECTION',
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'toolName', order: 'ASCENDING' },
          { fieldPath: 'timestamp', order: 'DESCENDING' }
        ]
      }
    ]
  }, null, 2));
  console.log('\nThen run: firebase deploy --only firestore:indexes\n');
}

async function verifySetup() {
  console.log('🔍 Verifying setup...\n');
  
  // Count authorizations
  const authSnapshot = await db.collection('mcp_authorizations').get();
  const enabled = authSnapshot.docs.filter(doc => doc.data().enabled).length;
  
  console.log(`Total authorizations: ${authSnapshot.size}`);
  console.log(`Enabled:              ${enabled}`);
  console.log(`Disabled:             ${authSnapshot.size - enabled}\n`);
  
  // Sample one
  if (authSnapshot.size > 0) {
    const sample = authSnapshot.docs[0].data();
    console.log('Sample authorization:');
    console.log(JSON.stringify(sample, null, 2));
  }
}

// Main execution
async function main() {
  try {
    if (specificUser) {
      await initializeForSpecificUser(specificUser);
    } else {
      await initializeForAllUsers();
    }
    
    await createIndexes();
    await verifySetup();
    
    console.log('🎉 All done! MCP Firestore setup complete.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Error:', error);
    process.exit(1);
  }
}

main();
