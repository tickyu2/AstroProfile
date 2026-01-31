// ============================================================================
// GENESIS VOICE JOURNALING - BACKEND (Firebase Functions)
// ============================================================================
// File: functions/index.js
// Version: 1.0
// Date: January 6, 2026
//
// Features:
// - AI organization after each recording (Gemini)
// - Bullet point extraction
// - Narrative generation
// - Trash management (soft delete, recovery, permanent delete)
// - Auto-delete expired items (15 days)
// - Markdown export/import
// - Text-to-speech support
// ============================================================================

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();
const db = admin.firestore();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================================================
// 1. ORGANIZE AND INSERT RECORDING (After each recording)
// ============================================================================

exports.organizeAndInsertRecording = functions.https.onCall(async (data, context) => {
  // Authenticate
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const {
    userId,
    conversationId,
    existingText,
    cursorPosition,
    rawTranscript,
    recordingMetadata
  } = data;

  try {
    // Split text at cursor
    const textBeforeCursor = existingText.substring(0, cursorPosition);
    const textAfterCursor = existingText.substring(cursorPosition);

    // AI organization prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `You are an AI writing assistant helping to insert and organize voice recordings.

EXISTING TEXT:
${existingText}

CURSOR POSITION: ${cursorPosition}
Text before cursor: "${textBeforeCursor.substring(Math.max(0, textBeforeCursor.length - 100))}"
Text after cursor: "${textAfterCursor.substring(0, 100)}"

NEW RECORDING (raw transcript):
"${rawTranscript}"

YOUR TASK:
1. Clean the recording:
   - Fix grammar
   - Add punctuation
   - Proper capitalization
   - Remove filler words (um, uh, like, you know)

2. Insert at cursor position:
   - Connect smoothly with text before cursor
   - Transition naturally to text after cursor
   - Maintain narrative flow
   - Add transition words if needed

3. Preserve user's voice:
   - Don't change meaning
   - Keep personal tone
   - Use first person
   - Maintain style

CRITICAL RULES:
- DO NOT reorganize existing text
- DO NOT change content before or after cursor
- DO NOT add information not in recording
- DO connect smoothly with surrounding text

OUTPUT JSON ONLY:
{
  "insertedText": "cleaned text to insert",
  "fullUpdatedText": "complete text with insertion",
  "changes": ["change 1", "change 2"],
  "transitionsAdded": ["transition words added"],
  "confidence": 0.95
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON response
    const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
    const aiResult = JSON.parse(cleanedResponse);

    // Save recording to Firestore
    const conversationRef = db.doc(`users/${userId}/voice_conversations/${conversationId}`);
    
    // Get current data
    const conversationSnap = await conversationRef.get();
    const conversationData = conversationSnap.data();
    
    // Calculate word count
    const wordCount = aiResult.fullUpdatedText.split(/\s+/).length;
    
    // Update conversation
    await conversationRef.update({
      currentText: aiResult.fullUpdatedText,
      fullText: aiResult.fullUpdatedText,
      lastEditedAt: admin.firestore.FieldValue.serverTimestamp(),
      wordCount: wordCount,
      recordings: admin.firestore.FieldValue.arrayUnion({
        recordingId: `rec_${Date.now()}`,
        timestamp: recordingMetadata.timestamp,
        duration: recordingMetadata.duration || 0,
        rawTranscript,
        cursorPosition,
        insertedText: aiResult.insertedText,
        aiChanges: aiResult.changes
      }),
      recordingCount: admin.firestore.FieldValue.increment(1),
      totalDuration: admin.firestore.FieldValue.increment(recordingMetadata.duration || 0)
    });

    return {
      success: true,
      fullUpdatedText: aiResult.fullUpdatedText,
      insertedText: aiResult.insertedText,
      changes: aiResult.changes,
      confidence: aiResult.confidence
    };

  } catch (error) {
    console.error('Error organizing recording:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 2. CREATE BULLET POINTS (Extract key moments)
// ============================================================================

exports.createBullets = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, conversationId, rawTranscript } = data;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `Extract key points as bullet points from this voice recording:

"${rawTranscript}"

Rules:
- Extract 3-7 key moments or facts
- Keep bullets SHORT (one sentence max)
- Be FACTUAL, don't embellish
- Use past tense
- Focus on concrete events/details

Return ONLY a JSON array:
["bullet 1", "bullet 2", "bullet 3"]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
    const bullets = JSON.parse(cleanedResponse);

    // Update conversation with new bullets
    const conversationRef = db.doc(`users/${userId}/voice_conversations/${conversationId}`);
    await conversationRef.update({
      bullets: admin.firestore.FieldValue.arrayUnion(...bullets),
      lastEditedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, bullets };

  } catch (error) {
    console.error('Error creating bullets:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 3. CREATE FINAL NARRATIVE (From bullets)
// ============================================================================

exports.createNarrative = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, conversationId, bullets } = data;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `Create a flowing narrative from these bullet points:

${bullets.map(b => `• ${b}`).join('\n')}

Requirements:
- Write in first person, past tense
- Natural storytelling flow
- Add transitions between points
- Keep the user's voice authentic
- Make it read like a journal entry
- 2-4 paragraphs

Return ONLY the narrative text (no JSON, no formatting).`;

    const result = await model.generateContent(prompt);
    const narrative = result.response.text().trim();

    // Update conversation
    const conversationRef = db.doc(`users/${userId}/voice_conversations/${conversationId}`);
    await conversationRef.update({
      fullText: narrative,
      currentText: narrative,
      aiNarrative: narrative,
      lastEditedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, narrative };

  } catch (error) {
    console.error('Error creating narrative:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 4. TRASH MANAGEMENT - Move to Trash
// ============================================================================

exports.moveToTrash = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, conversationId } = data;

  try {
    // Get original conversation
    const conversationRef = db.doc(`users/${userId}/voice_conversations/${conversationId}`);
    const conversationSnap = await conversationRef.get();
    
    if (!conversationSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Conversation not found');
    }
    
    const conversationData = conversationSnap.data();
    
    // Calculate deletion dates
    const now = admin.firestore.Timestamp.now();
    const fifteenDaysLater = new Date(now.toDate().getTime() + 15 * 24 * 60 * 60 * 1000);
    
    // Move to trash collection
    const trashRef = db.doc(`users/${userId}/trash/${conversationId}`);
    await trashRef.set({
      id: conversationId,
      originalData: conversationData,
      deletedAt: now,
      permanentDeleteAt: admin.firestore.Timestamp.fromDate(fifteenDaysLater),
      daysRemaining: 15
    });
    
    // Delete from active conversations
    await conversationRef.delete();
    
    return { 
      success: true, 
      message: `"${conversationData.title}" moved to trash. You have 15 days to recover it.`,
      title: conversationData.title
    };

  } catch (error) {
    console.error('Error moving to trash:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 5. TRASH MANAGEMENT - Recover from Trash
// ============================================================================

exports.recoverFromTrash = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, conversationId } = data;

  try {
    // Get from trash
    const trashRef = db.doc(`users/${userId}/trash/${conversationId}`);
    const trashSnap = await trashRef.get();
    
    if (!trashSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Item not found in trash');
    }
    
    const trashData = trashSnap.data();
    
    // Restore to active conversations
    const conversationRef = db.doc(`users/${userId}/voice_conversations/${conversationId}`);
    await conversationRef.set(trashData.originalData);
    
    // Remove from trash
    await trashRef.delete();
    
    return { 
      success: true, 
      message: `"${trashData.originalData.title}" has been recovered!`,
      title: trashData.originalData.title
    };

  } catch (error) {
    console.error('Error recovering from trash:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 6. TRASH MANAGEMENT - Permanent Delete
// ============================================================================

exports.permanentlyDelete = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, conversationId } = data;

  try {
    // Delete from trash (permanently)
    const trashRef = db.doc(`users/${userId}/trash/${conversationId}`);
    const trashSnap = await trashRef.get();
    
    if (!trashSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Item not found in trash');
    }
    
    const title = trashSnap.data().originalData.title;
    
    await trashRef.delete();
    
    return { 
      success: true, 
      message: `"${title}" permanently deleted.`,
      title
    };

  } catch (error) {
    console.error('Error permanently deleting:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 7. AUTO-DELETE EXPIRED TRASH (Scheduled - Daily)
// ============================================================================

exports.autoDeleteExpiredTrash = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    try {
      // Query all users
      const usersSnapshot = await db.collection('users').get();
      
      let totalDeleted = 0;
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        
        // Get trash items for this user
        const trashRef = db.collection(`users/${userId}/trash`);
        const trashSnapshot = await trashRef
          .where('permanentDeleteAt', '<=', now)
          .get();
        
        // Delete expired items
        const batch = db.batch();
        trashSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        if (!trashSnapshot.empty) {
          await batch.commit();
          totalDeleted += trashSnapshot.size;
          console.log(`Deleted ${trashSnapshot.size} expired items for user ${userId}`);
        }
      }
      
      console.log(`Total expired items deleted: ${totalDeleted}`);
      return { success: true, totalDeleted };
      
    } catch (error) {
      console.error('Error auto-deleting trash:', error);
      return { success: false, error: error.message };
    }
  });

// ============================================================================
// 8. EXPORT TO MARKDOWN
// ============================================================================

exports.exportToMarkdown = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, conversationId, options = {} } = data;

  try {
    // Get conversation
    const conversationRef = db.doc(`users/${userId}/voice_conversations/${conversationId}`);
    const conversationSnap = await conversationRef.get();
    
    if (!conversationSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Conversation not found');
    }
    
    const conversation = conversationSnap.data();
    
    // Generate markdown
    let markdown = '';
    
    // Header
    markdown += `# ${conversation.title} ${conversation.emoji || ''}\n\n`;
    
    // Metadata
    if (options.includeMetadata !== false) {
      markdown += `**Created:** ${conversation.createdAt.toDate().toLocaleDateString()}\n`;
      markdown += `**Last Updated:** ${conversation.lastEditedAt.toDate().toLocaleDateString()}\n`;
      markdown += `**Total Duration:** ${Math.floor((conversation.totalDuration || 0) / 60)} minutes\n`;
      markdown += `**Recordings:** ${conversation.recordingCount || 0}\n\n`;
      markdown += `---\n\n`;
    }
    
    // Bullets
    if (options.includeBullets !== false && conversation.bullets && conversation.bullets.length > 0) {
      markdown += `## Key Moments\n\n`;
      conversation.bullets.forEach(bullet => {
        markdown += `• ${bullet}\n`;
      });
      markdown += `\n---\n\n`;
    }
    
    // Full story
    markdown += `## Full Story\n\n`;
    markdown += conversation.fullText || conversation.currentText || '';
    markdown += `\n\n`;
    
    // Recording details
    if (options.includeRecordings !== false && conversation.recordings && conversation.recordings.length > 0) {
      markdown += `---\n\n## Recording Details\n\n`;
      conversation.recordings.forEach((recording, index) => {
        markdown += `### Recording ${index + 1}\n`;
        if (options.includeTimestamps !== false) {
          markdown += `- **Date:** ${new Date(recording.timestamp).toLocaleString()}\n`;
          markdown += `- **Duration:** ${Math.floor(recording.duration / 60)} minutes\n`;
        }
        markdown += `- **Raw Transcript:** "${recording.rawTranscript}"\n\n`;
      });
    }
    
    // User notes
    if (conversation.userNotes) {
      markdown += `---\n\n## User Notes\n\n${conversation.userNotes}\n\n`;
    }
    
    // Footer
    markdown += `---\n\n*Exported from GENESIS Voice Journal on ${new Date().toLocaleDateString()}*\n`;
    
    return { 
      success: true, 
      markdown,
      filename: `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    };

  } catch (error) {
    console.error('Export error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 9. IMPORT FROM MARKDOWN
// ============================================================================

exports.importFromMarkdown = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, markdownText, filename } = data;

  try {
    // Parse markdown
    const lines = markdownText.split('\n');
    
    let title = '';
    let emoji = '';
    let bullets = [];
    let storyText = '';
    let notes = '';
    let inStorySection = false;
    let inNotesSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extract title (first # heading)
      if (line.startsWith('# ') && !title) {
        const titleLine = line.substring(2).trim();
        // Extract emoji if present
        const emojiMatch = titleLine.match(/[\u{1F300}-\u{1F9FF}]/u);
        if (emojiMatch) {
          emoji = emojiMatch[0];
          title = titleLine.replace(emoji, '').trim();
        } else {
          title = titleLine;
        }
        continue;
      }
      
      // Detect sections
      if (line.includes('## Key Moments') || line.includes('## Bullet Points')) {
        inStorySection = false;
        continue;
      }
      
      if (line.includes('## Full Story') || line.includes('## Story')) {
        inStorySection = true;
        inNotesSection = false;
        continue;
      }
      
      if (line.includes('## User Notes') || line.includes('## Notes')) {
        inStorySection = false;
        inNotesSection = true;
        continue;
      }
      
      // Extract bullets
      if (line.startsWith('• ') || line.startsWith('- ')) {
        bullets.push(line.substring(2).trim());
        continue;
      }
      
      // Extract story text
      if (inStorySection && line && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('*')) {
        storyText += line + '\n';
      }
      
      // Extract notes
      if (inNotesSection && line && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('*')) {
        notes += line + '\n';
      }
    }
    
    // Create new conversation
    const conversationRef = db.collection(`users/${userId}/voice_conversations`).doc();
    
    const newConversation = {
      id: conversationRef.id,
      title: title || 'Imported Story',
      emoji: emoji || '📄',
      status: 'active',
      
      bullets: bullets,
      fullText: storyText.trim(),
      currentText: storyText.trim(),
      
      // Metadata
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastEditedAt: admin.firestore.FieldValue.serverTimestamp(),
      importedAt: admin.firestore.FieldValue.serverTimestamp(),
      importedFrom: filename,
      
      // Empty recordings (since imported)
      recordings: [],
      recordingCount: 0,
      totalDuration: 0,
      wordCount: storyText.trim().split(/\s+/).length,
      
      // User notes
      userNotes: notes.trim()
    };
    
    await conversationRef.set(newConversation);
    
    return { 
      success: true, 
      conversationId: conversationRef.id,
      title: title || 'Imported Story',
      message: `"${title || 'Imported Story'}" imported successfully!`
    };

  } catch (error) {
    console.error('Import error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 10. GENERATE AI SUMMARY (Before submit)
// ============================================================================

exports.generateAISummary = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, conversationId } = data;

  try {
    // Get conversation
    const conversationRef = db.doc(`users/${userId}/voice_conversations/${conversationId}`);
    const conversationSnap = await conversationRef.get();
    
    if (!conversationSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Conversation not found');
    }
    
    const conversation = conversationSnap.data();
    
    // Generate AI summary
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `Analyze this voice journal conversation:

Title: ${conversation.title}
Full transcript:
${conversation.fullText || conversation.currentText}

User notes: ${conversation.userNotes || 'None'}

Create:
1. Brief summary (2-3 sentences)
2. Key moments (5-7 bullet points)
3. Emotional tone
4. Any patterns or insights

Return as JSON:
{
  "summary": "...",
  "keyMoments": ["...", "..."],
  "emotionalTone": "...",
  "insights": "..."
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
    const summary = JSON.parse(cleanedResponse);
    
    // Update conversation
    await conversationRef.update({
      aiProcessed: true,
      aiSummary: summary.summary,
      aiKeyMoments: summary.keyMoments,
      aiEmotionalTone: summary.emotionalTone,
      aiInsights: summary.insights
    });
    
    return { success: true, summary };

  } catch (error) {
    console.error('Error generating summary:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// END OF BACKEND
// ============================================================================
