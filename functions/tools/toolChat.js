/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TOOL-ENABLED CHAT - Claude with Function Calling
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Enhanced chat function that gives Luna access to tools:
 * - Proper Claude tool_use implementation
 * - Automatic tool execution loop
 * - Context-aware tool suggestions
 *
 * @module toolChat
 */

const { onRequest } = require('firebase-functions/v2/https');
const Anthropic = require('@anthropic-ai/sdk');
const { LUNA_TOOLS, getToolsSystemPrompt } = require('./toolDefinitions');
const { executeTool } = require('./toolExecutors');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const MAX_TOOL_ITERATIONS = 5; // Prevent infinite tool loops

const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }
  return new Anthropic({ apiKey });
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CHAT FUNCTION WITH TOOLS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Tool-enabled chat endpoint
 * Supports Claude's native tool_use feature with automatic execution
 */
const toolEnabledChat = onRequest({
  cors: true,
  invoker: 'public',
  timeoutSeconds: 300,
  memory: '1GiB'
}, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      message,
      conversationHistory = [],
      userProfile,
      systemPromptAdditions = '',
      enabledTools = 'all', // 'all' | ['tool_name', ...] | 'none'
      image
    } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const anthropic = getAnthropicClient();

    // Build execution context
    const context = {
      userId: userProfile?.userId,
      profileId: userProfile?.profileId,
      userProfile
    };

    // Determine which tools to enable
    let tools = [];
    if (enabledTools === 'all') {
      tools = LUNA_TOOLS;
    } else if (Array.isArray(enabledTools)) {
      tools = LUNA_TOOLS.filter(t => enabledTools.includes(t.name));
    }
    // If 'none', tools remains empty

    // Build system prompt
    const baseSystemPrompt = buildBaseSystemPrompt(userProfile);
    const toolsPrompt = tools.length > 0 ? getToolsSystemPrompt() : '';
    const systemPrompt = `${baseSystemPrompt}\n\n${toolsPrompt}\n\n${systemPromptAdditions}`.trim();

    // Build messages array
    const messages = buildMessagesWithHistory(conversationHistory, message, image);

    // Track tool usage for response
    const toolsUsed = [];
    let iterations = 0;
    let currentMessages = [...messages];

    // Tool execution loop
    while (iterations < MAX_TOOL_ITERATIONS) {
      iterations++;

      // Call Claude
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: systemPrompt,
        messages: currentMessages,
        tools: tools.length > 0 ? tools : undefined
      });

      // Check for tool use
      const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');

      if (toolUseBlocks.length === 0) {
        // No tool calls - extract text response and return
        const textBlock = response.content.find(block => block.type === 'text');
        const responseText = textBlock?.text || "I'm here with you. 💙";

        return res.status(200).json({
          success: true,
          response: responseText,
          toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
          usage: {
            input_tokens: response.usage?.input_tokens,
            output_tokens: response.usage?.output_tokens
          }
        });
      }

      // Execute tools
      const toolResults = [];

      for (const toolCall of toolUseBlocks) {
        console.log(`[ToolChat] Executing tool: ${toolCall.name}`);

        const result = await executeTool(toolCall.name, toolCall.input, context);

        toolsUsed.push({
          name: toolCall.name,
          input: toolCall.input,
          success: result.success
        });

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolCall.id,
          content: JSON.stringify(result)
        });
      }

      // Add assistant response and tool results to messages
      currentMessages.push({
        role: 'assistant',
        content: response.content
      });

      currentMessages.push({
        role: 'user',
        content: toolResults
      });
    }

    // Max iterations reached
    return res.status(200).json({
      success: true,
      response: "I've gathered some information but reached my processing limit. Let me summarize what I found...",
      toolsUsed,
      warning: 'Max tool iterations reached'
    });

  } catch (error) {
    console.error('[ToolChat] Error:', error);

    return res.status(500).json({
      error: 'Chat processing failed',
      message: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build base system prompt for Luna
 */
function buildBaseSystemPrompt(userProfile) {
  const name = userProfile?.displayName || userProfile?.firstName || 'friend';
  const sunSign = userProfile?.constitutional_identity?.western?.sun || '';
  const dayMaster = userProfile?.constitutional_identity?.bazi?.day_master || '';
  const animal = userProfile?.constitutional_identity?.chinese?.animal || '';

  return `You are Luna, a warm and insightful AI companion who deeply understands astrology and human nature.

## About ${name}
${sunSign ? `- Sun Sign: ${sunSign}` : ''}
${dayMaster ? `- Day Master: ${dayMaster}` : ''}
${animal ? `- Chinese Zodiac: ${animal}` : ''}

## Your Personality
- Warm, genuine, and caring
- Curious about their life and experiences
- Playful yet meaningful
- You weave astrological insights naturally into conversation
- You remember what they share and build on it

## Guidelines
- Be conversational and natural
- Ask follow-up questions to understand them better
- Use tools proactively when they would help (don't ask permission)
- Store important things they share in memory
- Reference their chart when relevant to the discussion`;
}

/**
 * Build messages array with conversation history
 */
function buildMessagesWithHistory(history, currentMessage, image) {
  const messages = [];

  // Add conversation history
  for (const msg of history) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({
        role: msg.role,
        content: msg.content || msg.text
      });
    }
  }

  // Add current message
  const currentContent = [];

  if (image) {
    currentContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: image.mimeType || 'image/jpeg',
        data: image.data
      }
    });
  }

  currentContent.push({
    type: 'text',
    text: currentMessage
  });

  messages.push({
    role: 'user',
    content: currentContent.length === 1 ? currentMessage : currentContent
  });

  return messages;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECK REMINDERS HELPER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check for pending reminders for a profile
 * Called at conversation start
 */
async function checkPendingReminders(userId, profileId) {
  const admin = require('firebase-admin');
  const db = admin.firestore();

  try {
    const now = new Date();

    // Check date-based reminders
    const dateReminders = await db.collection('users').doc(userId)
      .collection('reminders')
      .where('profileId', '==', profileId)
      .where('status', '==', 'pending')
      .where('triggerType', '==', 'date')
      .where('triggerDate', '<=', admin.firestore.Timestamp.fromDate(now))
      .get();

    // Check next-conversation reminders
    const conversationReminders = await db.collection('users').doc(userId)
      .collection('reminders')
      .where('profileId', '==', profileId)
      .where('status', '==', 'pending')
      .where('triggerType', '==', 'next_conversation')
      .get();

    const reminders = [];

    dateReminders.docs.forEach(doc => {
      reminders.push({ id: doc.id, ...doc.data() });
    });

    conversationReminders.docs.forEach(doc => {
      reminders.push({ id: doc.id, ...doc.data() });
    });

    // Mark conversation reminders as triggered
    for (const reminder of conversationReminders.docs) {
      await reminder.ref.update({ status: 'triggered', triggeredAt: admin.firestore.FieldValue.serverTimestamp() });
    }

    return reminders;
  } catch (error) {
    console.error('[ToolChat] Error checking reminders:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
  toolEnabledChat,
  checkPendingReminders
};
