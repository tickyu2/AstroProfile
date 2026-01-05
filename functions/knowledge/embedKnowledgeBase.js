/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMBED KNOWLEDGE BASE - One-Time Vector Embedding Job
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Creates vector embeddings for personality knowledge documents and stores
 * them in Firestore for semantic search.
 *
 * Run this script once to populate the knowledge_vectors collection:
 *   node functions/knowledge/embedKnowledgeBase.js
 *
 * Or deploy as a Firebase Function and call manually to refresh embeddings.
 *
 * Firestore Index Required:
 *   gcloud firestore indexes composite create \
 *     --collection-group=knowledge_vectors \
 *     --query-scope=COLLECTION \
 *     --field-config field-path=embedding,vector-config='{"dimension":"768","flat":{}}'
 *
 * Created: December 28, 2024
 * Part of: GENESIS Conversational AI v2 - Phase 3 RAG
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const { embedText, embedTexts } = require('../llm/embeddings');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'astroprofile-391e6';

  // Check for service account key file
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, '../serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    console.log('[Firebase] Using service account:', serviceAccountPath);
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId
    });
  } else {
    console.log('[Firebase] Using application default credentials');
    admin.initializeApp({ projectId });
  }
}

const db = admin.firestore();

// Ignore undefined values in documents
db.settings({ ignoreUndefinedProperties: true });

// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE DOCUMENT BUILDERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build searchable documents from Enneagram knowledge
 */
function buildEnneagramDocuments(enneagramData) {
  const documents = [];

  for (const [typeNum, typeData] of Object.entries(enneagramData.types || {})) {
    // Main type document
    const typeText = [
      `Enneagram Type ${typeNum}: ${typeData.name}`,
      `Also known as: ${typeData.alias?.join(', ') || ''}`,
      `Core Fear: ${typeData.coreFear}`,
      `Core Desire: ${typeData.coreDesire}`,
      `Core Motivation: ${typeData.coreMotivation}`,
      `Key Strengths: ${typeData.keyStrengths?.join(', ')}`,
      `Key Weaknesses: ${typeData.keyWeaknesses?.join(', ')}`,
      `Growth Path: Move toward Type ${typeData.growthPath?.direction} - ${typeData.growthPath?.description}`,
      `Stress Path: Move toward Type ${typeData.stressPath?.direction} - ${typeData.stressPath?.description}`,
      `Communication Style: Prefers ${typeData.communicationStyle?.prefers?.join(', ')}`,
      `Luna Guidance: ${typeData.lunaGuidance?.approach}`
    ].join('\n');

    documents.push({
      id: `enneagram_type_${typeNum}`,
      type: 'enneagram',
      subtype: 'type',
      key: typeNum,
      title: `Enneagram Type ${typeNum}: ${typeData.name}`,
      searchableText: typeText,
      metadata: {
        name: typeData.name,
        alias: typeData.alias,
        triad: typeData.triad,
        growthDirection: typeData.growthPath?.direction,
        stressDirection: typeData.stressPath?.direction
      },
      lunaGuidance: typeData.lunaGuidance
    });

    // Wing documents
    if (typeData.wings) {
      for (const [wingNum, wingData] of Object.entries(typeData.wings)) {
        const wingText = [
          `Enneagram ${wingData.name}`,
          `Core Type ${typeNum} with Wing ${wingNum}`,
          `Traits: ${wingData.traits?.join(', ')}`,
          `Focus: ${wingData.focus}`
        ].join('\n');

        documents.push({
          id: `enneagram_wing_${typeNum}w${wingNum}`,
          type: 'enneagram',
          subtype: 'wing',
          key: `${typeNum}w${wingNum}`,
          title: wingData.name,
          searchableText: wingText,
          metadata: {
            coreType: typeNum,
            wing: wingNum,
            traits: wingData.traits
          }
        });
      }
    }
  }

  // Triads
  if (enneagramData.triads) {
    for (const [triadName, triadData] of Object.entries(enneagramData.triads)) {
      const triadText = [
        `Enneagram ${triadName} Triad`,
        `Center: ${triadData.center}`,
        `Core Emotion: ${triadData.coreEmotion}`,
        `Types: ${triadData.types?.join(', ')}`,
        `Theme: ${triadData.theme}`
      ].join('\n');

      documents.push({
        id: `enneagram_triad_${triadName}`,
        type: 'enneagram',
        subtype: 'triad',
        key: triadName,
        title: `${triadName.charAt(0).toUpperCase() + triadName.slice(1)} Triad`,
        searchableText: triadText,
        metadata: triadData
      });
    }
  }

  return documents;
}

/**
 * Build searchable documents from BaZi knowledge
 */
function buildBaziDocuments(baziData) {
  const documents = [];

  // Day Masters
  for (const [dmKey, dmData] of Object.entries(baziData.dayMasters || {})) {
    const dmText = [
      `BaZi Day Master: ${dmData.archetype}`,
      `Element: ${dmData.element} (${dmData.polarity})`,
      `Chinese: ${dmData.chinese}`,
      `Symbol: ${dmData.symbol}`,
      `Nature: ${dmData.nature}`,
      `Positive Characteristics: ${dmData.characteristics?.positive?.join(', ')}`,
      `Negative Characteristics: ${dmData.characteristics?.negative?.join(', ')}`,
      `Favorable Elements: ${dmData.elementalRelations?.favorable?.elements?.join(', ')}`,
      `Unfavorable Elements: ${dmData.elementalRelations?.unfavorable?.elements?.join(', ')}`,
      `Career Aptitudes: ${dmData.careerAptitudes?.join(', ')}`,
      `Health Focus: ${dmData.healthFocus?.join(', ')}`,
      `Luna Guidance: ${dmData.lunaGuidance?.approach}`,
      `Key Insight: ${dmData.lunaGuidance?.keyInsight}`
    ].join('\n');

    documents.push({
      id: `bazi_daymaster_${dmKey}`,
      type: 'bazi',
      subtype: 'dayMaster',
      key: dmKey,
      title: `${dmData.element} ${dmData.polarity}: ${dmData.archetype}`,
      searchableText: dmText,
      metadata: {
        element: dmData.element,
        polarity: dmData.polarity,
        chinese: dmData.chinese,
        symbol: dmData.symbol,
        archetype: dmData.archetype
      },
      lunaGuidance: dmData.lunaGuidance
    });
  }

  // Elements
  for (const [elementName, elementData] of Object.entries(baziData.elements || {})) {
    const elementText = [
      `BaZi Element: ${elementName}`,
      `Season: ${elementData.season}`,
      `Direction: ${elementData.direction}`,
      `Color: ${elementData.color}`,
      `Organ: ${elementData.organ}`,
      `Emotion: ${elementData.emotion}`,
      `Produces: ${elementData.produces}`,
      `Controls: ${elementData.controls}`,
      `Weakens: ${elementData.weakens}`
    ].join('\n');

    documents.push({
      id: `bazi_element_${elementName.toLowerCase()}`,
      type: 'bazi',
      subtype: 'element',
      key: elementName,
      title: `${elementName} Element`,
      searchableText: elementText,
      metadata: elementData
    });
  }

  return documents;
}

/**
 * Build searchable documents from MBTI knowledge
 */
function buildMbtiDocuments(mbtiData) {
  const documents = [];

  // Types (16 personality types)
  for (const [typeCode, typeData] of Object.entries(mbtiData.types || {})) {
    const typeText = [
      `MBTI Type: ${typeCode} - ${typeData.name}`,
      `Also known as: ${typeData.alias?.join(', ') || ''}`,
      `Cognitive Functions: ${typeData.functions?.dominant} (Dom), ${typeData.functions?.auxiliary} (Aux)`,
      `Tertiary: ${typeData.functions?.tertiary}, Inferior: ${typeData.functions?.inferior}`,
      `Core Traits: ${typeData.coreTraits?.join(', ')}`,
      `Strengths: ${typeData.strengths?.join(', ')}`,
      `Challenges: ${typeData.challenges?.join(', ')}`,
      `Communication Style: ${typeData.communication}`,
      `Stress Response: ${typeData.stressResponse}`,
      `Growth Path: ${typeData.growthPath}`,
      `Compatible Types: ${typeData.compatibleTypes?.join(', ')}`,
      `Luna Guidance: ${typeData.lunaGuidance?.approach}`,
      `Key Insight: ${typeData.lunaGuidance?.keyInsight}`,
      `Key Phrases: ${typeData.lunaGuidance?.keyPhrases?.join(', ')}`
    ].join('\n');

    documents.push({
      id: `mbti_type_${typeCode}`,
      type: 'mbti',
      subtype: 'type',
      key: typeCode,
      title: `${typeCode}: ${typeData.name}`,
      searchableText: typeText,
      metadata: {
        name: typeData.name,
        alias: typeData.alias,
        functions: typeData.functions,
        coreTraits: typeData.coreTraits,
        compatibleTypes: typeData.compatibleTypes
      },
      lunaGuidance: typeData.lunaGuidance
    });
  }

  // Cognitive Functions
  for (const [funcCode, funcData] of Object.entries(mbtiData.cognitiveFunctions || {})) {
    const funcText = [
      `MBTI Cognitive Function: ${funcCode} - ${funcData.name}`,
      `Description: ${funcData.description}`,
      `Used by types: ${funcData.users?.join(', ')}`
    ].join('\n');

    documents.push({
      id: `mbti_function_${funcCode}`,
      type: 'mbti',
      subtype: 'function',
      key: funcCode,
      title: `${funcCode}: ${funcData.name}`,
      searchableText: funcText,
      metadata: {
        name: funcData.name,
        users: funcData.users
      }
    });
  }

  // Temperaments
  for (const [tempCode, tempData] of Object.entries(mbtiData.temperaments || {})) {
    const tempText = [
      `MBTI Temperament: ${tempCode} - ${tempData.name}`,
      `Types: ${tempData.types?.join(', ')}`,
      `Description: ${tempData.description}`
    ].join('\n');

    documents.push({
      id: `mbti_temperament_${tempCode}`,
      type: 'mbti',
      subtype: 'temperament',
      key: tempCode,
      title: `${tempData.name} (${tempCode})`,
      searchableText: tempText,
      metadata: tempData
    });
  }

  return documents;
}

/**
 * Build searchable documents from Big 5 knowledge
 */
function buildBig5Documents(big5Data) {
  const documents = [];

  // Traits
  for (const [traitKey, traitData] of Object.entries(big5Data.traits || {})) {
    const traitText = [
      `Big Five Personality: ${traitData.fullName} (${traitData.abbreviation})`,
      `Description: ${traitData.description}`,
      `Facets: ${Object.keys(traitData.facets || {}).join(', ')}`,
      `High Score Traits: ${traitData.highScore?.traits?.join(', ')}`,
      `High Score Strengths: ${traitData.highScore?.strengths?.join(', ')}`,
      `High Score Challenges: ${traitData.highScore?.challenges?.join(', ')}`,
      `Low Score Traits: ${traitData.lowScore?.traits?.join(', ')}`,
      `Low Score Strengths: ${traitData.lowScore?.strengths?.join(', ')}`,
      `Low Score Challenges: ${traitData.lowScore?.challenges?.join(', ')}`
    ].join('\n');

    documents.push({
      id: `big5_trait_${traitKey}`,
      type: 'big5',
      subtype: 'trait',
      key: traitKey,
      title: traitData.fullName,
      searchableText: traitText,
      metadata: {
        abbreviation: traitData.abbreviation,
        facets: Object.keys(traitData.facets || {})
      },
      lunaGuidance: traitData.lunaGuidance
    });

    // Create separate documents for high/low guidance
    const highGuidanceKey = `high${traitKey.charAt(0).toUpperCase()}`;
    if (traitData.lunaGuidance?.[highGuidanceKey]) {
      documents.push({
        id: `big5_high_${traitKey}`,
        type: 'big5',
        subtype: 'guidance',
        key: `high_${traitKey}`,
        title: `High ${traitData.fullName}`,
        searchableText: [
          `High ${traitData.fullName} personality`,
          `Traits: ${traitData.highScore?.traits?.join(', ')}`,
          `Approach: ${traitData.lunaGuidance[highGuidanceKey]?.approach}`,
          `Key Phrases: ${traitData.lunaGuidance[highGuidanceKey]?.keyPhrases?.join(', ')}`
        ].join('\n'),
        metadata: {
          level: 'high',
          trait: traitKey
        }
      });
    }

    const lowGuidanceKey = `low${traitKey.charAt(0).toUpperCase()}`;
    if (traitData.lunaGuidance?.[lowGuidanceKey]) {
      documents.push({
        id: `big5_low_${traitKey}`,
        type: 'big5',
        subtype: 'guidance',
        key: `low_${traitKey}`,
        title: `Low ${traitData.fullName}`,
        searchableText: [
          `Low ${traitData.fullName} personality`,
          `Traits: ${traitData.lowScore?.traits?.join(', ')}`,
          `Approach: ${traitData.lunaGuidance[lowGuidanceKey]?.approach}`,
          `Key Phrases: ${traitData.lunaGuidance[lowGuidanceKey]?.keyPhrases?.join(', ')}`
        ].join('\n'),
        metadata: {
          level: 'low',
          trait: traitKey
        }
      });
    }
  }

  // Profiles
  if (big5Data.combinations?.profiles) {
    for (const [profileName, profileData] of Object.entries(big5Data.combinations.profiles)) {
      const profileText = [
        `Big 5 Profile: ${profileName}`,
        `Pattern: ${profileData.pattern}`,
        `Description: ${profileData.description}`,
        `Strengths: ${profileData.strengths?.join(', ')}`,
        `Luna Approach: ${profileData.lunaApproach}`
      ].join('\n');

      documents.push({
        id: `big5_profile_${profileName}`,
        type: 'big5',
        subtype: 'profile',
        key: profileName,
        title: `${profileName.charAt(0).toUpperCase() + profileName.slice(1)} Profile`,
        searchableText: profileText,
        metadata: profileData
      });
    }
  }

  return documents;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMBEDDING AND STORAGE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Embed a document and prepare for Firestore storage
 */
async function embedDocument(doc) {
  console.log(`  Embedding: ${doc.title}`);

  const embedding = await embedText(doc.searchableText);

  return {
    ...doc,
    embedding: admin.firestore.FieldValue.vector(embedding),
    embeddingModel: 'text-embedding-004',
    embeddedAt: admin.firestore.FieldValue.serverTimestamp()
  };
}

/**
 * Store embedded documents in Firestore
 */
async function storeDocuments(documents) {
  const batch = db.batch();
  const collection = db.collection('knowledge_vectors');

  for (const doc of documents) {
    const docRef = collection.doc(doc.id);
    batch.set(docRef, doc);
  }

  await batch.commit();
  console.log(`  Stored ${documents.length} documents`);
}

/**
 * Main embedding job
 */
async function embedKnowledgeBase() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('GENESIS Knowledge Base Embedding');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const dataPath = path.join(__dirname, '../../src/data');

  // Load knowledge files
  console.log('Loading knowledge files...');

  let enneagramData = { types: {} };
  let baziData = { dayMasters: {}, elements: {} };
  let big5Data = { traits: {} };
  let mbtiData = { types: {}, cognitiveFunctions: {}, temperaments: {} };

  try {
    enneagramData = JSON.parse(fs.readFileSync(path.join(dataPath, 'enneagramKnowledge.json'), 'utf8'));
    console.log('  ✅ Loaded enneagramKnowledge.json');
  } catch (e) {
    console.log('  ⚠️ enneagramKnowledge.json not found or invalid');
  }

  try {
    baziData = JSON.parse(fs.readFileSync(path.join(dataPath, 'baziKnowledge.json'), 'utf8'));
    console.log('  ✅ Loaded baziKnowledge.json');
  } catch (e) {
    console.log('  ⚠️ baziKnowledge.json not found or invalid');
  }

  try {
    big5Data = JSON.parse(fs.readFileSync(path.join(dataPath, 'big5Knowledge.json'), 'utf8'));
    console.log('  ✅ Loaded big5Knowledge.json');
  } catch (e) {
    console.log('  ⚠️ big5Knowledge.json not found or invalid');
  }

  try {
    mbtiData = JSON.parse(fs.readFileSync(path.join(dataPath, 'mbtiKnowledge.json'), 'utf8'));
    console.log('  ✅ Loaded mbtiKnowledge.json');
  } catch (e) {
    console.log('  ⚠️ mbtiKnowledge.json not found or invalid');
  }

  // Build documents
  console.log('\nBuilding searchable documents...');

  const enneagramDocs = buildEnneagramDocuments(enneagramData);
  console.log(`  Enneagram: ${enneagramDocs.length} documents`);

  const baziDocs = buildBaziDocuments(baziData);
  console.log(`  BaZi: ${baziDocs.length} documents`);

  const big5Docs = buildBig5Documents(big5Data);
  console.log(`  Big 5: ${big5Docs.length} documents`);

  const mbtiDocs = buildMbtiDocuments(mbtiData);
  console.log(`  MBTI: ${mbtiDocs.length} documents`);

  const allDocs = [...enneagramDocs, ...baziDocs, ...big5Docs, ...mbtiDocs];
  console.log(`  Total: ${allDocs.length} documents\n`);

  // Embed documents
  console.log('Generating embeddings (this may take a few minutes)...');

  const embeddedDocs = [];
  const batchSize = 5; // Embed 5 at a time to avoid rate limits

  for (let i = 0; i < allDocs.length; i += batchSize) {
    const batch = allDocs.slice(i, i + batchSize);
    const batchPromises = batch.map(doc => embedDocument(doc));
    const batchResults = await Promise.all(batchPromises);
    embeddedDocs.push(...batchResults);

    console.log(`  Progress: ${embeddedDocs.length}/${allDocs.length}`);

    // Small delay between batches
    if (i + batchSize < allDocs.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Store in Firestore
  console.log('\nStoring in Firestore...');

  // Store in batches of 500 (Firestore limit)
  const storageBatchSize = 500;
  for (let i = 0; i < embeddedDocs.length; i += storageBatchSize) {
    const batch = embeddedDocs.slice(i, i + storageBatchSize);
    await storeDocuments(batch);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`✅ Successfully embedded ${embeddedDocs.length} knowledge documents`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  return {
    success: true,
    documentCount: embeddedDocs.length,
    breakdown: {
      enneagram: enneagramDocs.length,
      bazi: baziDocs.length,
      big5: big5Docs.length,
      mbti: mbtiDocs.length
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIREBASE FUNCTION EXPORT (only when deployed)
// ═══════════════════════════════════════════════════════════════════════════════

// Only export Firebase function when not running as standalone script
if (require.main !== module) {
  try {
    const functions = require('firebase-functions');

    /**
     * HTTP-triggered function to refresh knowledge embeddings
     * Call manually when knowledge files are updated
     */
    exports.refreshKnowledgeEmbeddings = functions
      .runWith({ timeoutSeconds: 540, memory: '1GB' })
      .https.onRequest(async (req, res) => {
        try {
          const result = await embedKnowledgeBase();
          res.json(result);
        } catch (error) {
          console.error('Embedding failed:', error);
          res.status(500).json({ error: error.message });
        }
      });
  } catch (e) {
    // Firebase functions not available (running standalone)
  }
}

// Run directly if called as script
if (require.main === module) {
  // Load .env for local execution
  require('dotenv').config();

  embedKnowledgeBase()
    .then((result) => {
      console.log('Result:', JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

module.exports = { embedKnowledgeBase };
