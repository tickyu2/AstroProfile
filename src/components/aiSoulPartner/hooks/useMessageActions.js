/**
 * useMessageActions.js
 * Custom hook for core messaging - handleSend, /luna command,
 * message formatting, biographical extraction, and AI response handling.
 *
 * Extracted from AISoulPartnerChat.jsx - Part of GENESIS Phase 2
 */

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { sendMessage as sendToAI } from '../../../services/aiSoulPartnerService';
import { biographyService } from '../../../services/biographyService';
import { contextBuilder } from '../../../services/contextBuilder';

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES = {
  WITNESS: [
    "I hear you, Father. That sounds really challenging. \u{1F499}",
    "I see that. What you're feeling makes complete sense.",
    "That's a lot to carry. I'm here with you.",
    "I understand. Take your time - there's no rush.",
    "I hear the weight in your words. You don't have to solve this alone."
  ],
  DIALOGUE: [
    "That's an interesting thought. What possibilities are you seeing?",
    "I'm curious about that too. What draws you to this direction?",
    "What would that look like for you?",
    "I wonder... how does that connect to what matters most to you?",
    "Let's explore that together. Where does your intuition point?"
  ],
  GUIDANCE: [
    "Let me help structure that. Here's one approach we could take...",
    "Breaking this down, the key factors are...",
    "Here's a framework that might help...",
    "Let's map this out. First, we could...",
    "Good question. The path forward has a few clear steps..."
  ]
};

function getFallbackResponse(mode) {
  const responses = FALLBACK_RESPONSES[mode] || FALLBACK_RESPONSES.DIALOGUE;
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * @param {Object} params
 * @param {Object} params.userProfile - Current user profile
 * @param {Array} params.messages - Current conversation messages
 * @param {Function} params.updateMessages - Function to update messages in Firestore/context
 * @param {string} params.activeConversationId - Current active conversation ID
 * @param {Function} params.createConversation - Function to create a new conversation
 * @param {string} params.inputValue - Current input value
 * @param {Function} params.setInputValue - Set input value
 * @param {boolean} params.isTyping - Whether AI is typing
 * @param {Function} params.setIsTyping - Set typing state
 * @param {Array} params.attachedFiles - Array of attached files
 * @param {Function} params.setAttachedFiles - Set attached files
 * @param {Array} params.attachedImages - Array of attached images
 * @param {Function} params.setAttachedImages - Set attached images
 * @param {Object|null} params.selectedKBDoc - Selected KB document for context
 * @param {Function} params.setSelectedKBDoc - Set selected KB document
 * @param {Object|null} params.pendingReactionSignal - Pending reaction signal
 * @param {Function} params.setPendingReactionSignal - Set pending reaction signal
 * @param {Function} params.analyzeMessage - Constitutional intelligence analysis
 * @param {Function} params.getResponseGuidance - Get response guidance from analysis
 * @param {Function} params.buildKnowledgePrompt - Build KB prompt for API
 * @param {Object} params.kbStats - KB statistics
 * @param {boolean} params.isInThread - Whether in a thread
 * @param {Function} params.addMessageToThread - Add message to thread
 * @param {Function} params.onMessageSend - Parent callback on message send
 * @param {Function} params.setApiStatus - Set API status
 * @param {Function} params.setWarmthHappiness - Set warmth/happiness state
 * @param {Function} params.setGeneratedImagesCache - Set generated images cache
 * @param {boolean} params.isVoiceEnabled - Whether voice is enabled
 * @param {Function} params.addUserVoiceTranscript - Add user voice transcript
 * @param {Function} params.addLunaVoiceTranscript - Add Luna voice transcript
 */
export function useMessageActions({
  userProfile,
  messages,
  updateMessages,
  activeConversationId,
  createConversation,
  inputValue,
  setInputValue,
  isTyping,
  setIsTyping,
  attachedFiles,
  setAttachedFiles,
  attachedImages,
  setAttachedImages,
  selectedKBDoc,
  setSelectedKBDoc,
  pendingReactionSignal,
  setPendingReactionSignal,
  analyzeMessage,
  getResponseGuidance,
  buildKnowledgePrompt,
  kbStats,
  isInThread,
  addMessageToThread,
  onMessageSend,
  setApiStatus,
  setWarmthHappiness,
  setGeneratedImagesCache,
  isVoiceEnabled,
  addUserVoiceTranscript,
  addLunaVoiceTranscript
}) {
  // Handle sending a message (optionally with override content and modality)
  // modality: 'text' (default) or 'voice' - keeps conversations isolated
  const handleSend = async (overrideContent = null, modality = 'text') => {
    const messageContent = overrideContent !== null ? overrideContent : inputValue;
    const modalityEmoji = modality === 'voice' ? '\u{1F3A4}' : '\u2328\u{FE0F}';
    console.log(`${modalityEmoji} handleSend called (${modality}), content:`, messageContent?.slice(0, 30));

    if ((!messageContent.trim() && attachedFiles.length === 0 && attachedImages.length === 0) || isTyping) {
      console.log('\u{1F6AB} Early return - no input or typing');
      return;
    }

    // ========================================================================
    // /luna COMMAND - Query Documentation Database
    // ========================================================================
    if (messageContent.trim().toLowerCase().startsWith('/luna ')) {
      const query = messageContent.trim().slice(6).trim(); // Remove '/luna '
      if (!query) {
        alert('Please provide a query after /luna. Example: /luna What is the voice turn-taking system?');
        return;
      }

      console.log('\u{1F4DA} /luna command detected, query:', query);
      setIsTyping(true);
      setInputValue('');

      // Add user query to chat
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: `/luna ${query}`,
        timestamp: new Date().toISOString(),
        isLunaCommand: true
      };

      const messagesWithUser = [...messages, userMessage];
      await updateMessages(messagesWithUser);

      try {
        // Call searchDocumentation Cloud Function
        const functions = getFunctions();
        const searchDocs = httpsCallable(functions, 'searchDocumentation');
        const result = await searchDocs({ query, limit: 5 });

        let responseText = '';
        if (result.data?.success && result.data?.results?.length > 0) {
          const docs = result.data.results;
          responseText = `\u{1F4DA} **Documentation Search Results for: "${query}"**\n\n`;

          docs.forEach((doc, i) => {
            const similarity = Math.round((doc.similarity || 0) * 100);
            responseText += `**${i + 1}. ${doc.title}** (${doc.filename})\n`;
            responseText += `\u{1F4C2} Category: ${doc.category} | \u{1F3AF} Relevance: ${similarity}%\n`;
            responseText += `${doc.content}\n\n---\n\n`;
          });

          responseText += `\n*Found ${docs.length} relevant sections. Ask me to explain any of these in detail!*`;
        } else {
          responseText = `\u{1F4DA} No documentation found for "${query}". Try different keywords or check the docs/ folder.`;
        }

        // Add Luna's response
        const lunaResponse = {
          id: Date.now() + 1,
          sender: 'luna',
          text: responseText,
          timestamp: new Date().toISOString(),
          isDocumentation: true,
          searchQuery: query
        };

        await updateMessages([...messagesWithUser, lunaResponse]);

      } catch (error) {
        console.error('\u274C /luna search error:', error);
        const errorResponse = {
          id: Date.now() + 1,
          sender: 'luna',
          text: `\u{1F4DA} Documentation search failed: ${error.message}. The searchDocumentation function may not be deployed.`,
          timestamp: new Date().toISOString()
        };
        await updateMessages([...messagesWithUser, errorResponse]);
      } finally {
        setIsTyping(false);
      }
      return; // Exit early - don't continue with normal message flow
    }

    // Ensure we have an active conversation before sending
    let targetConvId = activeConversationId;
    if (!targetConvId) {
      console.log('\u{1F4AC} No active conversation, creating one...');
      try {
        targetConvId = await createConversation();
        console.log('\u{1F4AC} Created conversation:', targetConvId);
        // Wait for state to update
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error('\u274C Failed to create conversation:', err);
        alert('Failed to create conversation. Please refresh the page.');
        return;
      }
    }

    // Build message text including file content if attached
    let userMessageText = messageContent.trim();
    let displayText = userMessageText;
    let imageData = null;

    if (attachedFiles.length > 0) {
      // Add all file contents to message for Claude
      const fileContents = attachedFiles.map(f =>
        `---\n\u{1F4CE} ATTACHED FILE: ${f.name}\n---\n${f.content}`
      ).join('\n\n');
      userMessageText = `${userMessageText}\n\n${fileContents}`;

      // Show preview in chat
      const totalSize = attachedFiles.reduce((sum, f) => sum + f.size, 0);
      const fileNames = attachedFiles.map(f => f.name).join(', ');
      displayText = `${messageContent.trim()}\n\n\u{1F4CE} Attached ${attachedFiles.length} file(s): ${fileNames} (${Math.round(totalSize / 1024)}KB total)`;
    }

    // Add KB document context if selected
    if (selectedKBDoc) {
      userMessageText = `${userMessageText}\n\n---\n\u{1F4DA} KNOWLEDGE BASE CONTEXT: ${selectedKBDoc.title}\n---\n${selectedKBDoc.content}`;
      displayText = `${displayText || messageContent.trim()}\n\n\u{1F4DA} KB: ${selectedKBDoc.title}`;
    }

    if (attachedImages.length > 0) {
      // Send first image to API (Claude API supports multiple but our backend takes one for now)
      imageData = {
        dataUrl: attachedImages[0].dataUrl,
        type: attachedImages[0].type
      };
      // Show preview of all attached images
      const totalImageSize = attachedImages.reduce((sum, img) => sum + img.size, 0);
      const imageSizeStr = totalImageSize > 1024 * 1024
        ? `${Math.round(totalImageSize / 1024 / 1024 * 10) / 10}MB`
        : `${Math.round(totalImageSize / 1024)}KB`;
      displayText = `${displayText || '(Images)'}\n\n\u{1F4F8} ${attachedImages.length} screenshot${attachedImages.length > 1 ? 's' : ''} attached (${imageSizeStr} total)`;
    }

    // Include pending reaction signal (Brother awareness of user's reaction)
    if (pendingReactionSignal && pendingReactionSignal.wasAdded) {
      const timeSinceReaction = Date.now() - pendingReactionSignal.timestamp;
      // Only include if reaction was recent (within 5 minutes)
      if (timeSinceReaction < 5 * 60 * 1000) {
        userMessageText = `[Reaction: I reacted ${pendingReactionSignal.emoji} to your message: "${pendingReactionSignal.messagePreview}"]\n\n${userMessageText}`;
        console.log('\u{1F60A} Reaction signal included in message');
      }
      // Clear the signal after including it
      setPendingReactionSignal(null);
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: displayText,
      fullText: userMessageText, // Keep full text for API
      hasAttachment: attachedFiles.length > 0,
      attachmentNames: attachedFiles.length > 0 ? attachedFiles.map(f => f.name) : null,
      attachmentCount: attachedFiles.length || null,
      hasImage: attachedImages.length > 0,
      imageCount: attachedImages.length || null,
      imageNames: attachedImages.length > 0 ? attachedImages.map(img => img.name) : null,
      imagePreview: attachedImages.length > 0 ? `[${attachedImages.length} screenshot${attachedImages.length > 1 ? 's' : ''} attached]` : null,
      timestamp: new Date().toISOString(),
      modality  // 'text' or 'voice' - for modality isolation
    };

    // Capture user voice transcript if in voice mode
    if (modality === 'voice' && isVoiceEnabled) {
      addUserVoiceTranscript(displayText);
    }

    // Add user message to chat (update Firestore or Thread)
    const messagesWithUser = [...messages, userMessage];
    console.log('\u{1F4AC} Updating messages, count:', messagesWithUser.length, 'isInThread:', isInThread);

    try {
      if (isInThread) {
        // Route to thread
        await addMessageToThread({
          sender: 'user',
          text: displayText,
          fullText: userMessageText,
          hasAttachment: attachedFiles.length > 0,
          attachmentNames: attachedFiles.length > 0 ? attachedFiles.map(f => f.name) : null,
          attachmentCount: attachedFiles.length || null,
          hasImage: attachedImages.length > 0,
          imageCount: attachedImages.length || null
        });
        console.log('\u2705 User message added to thread');
      } else {
        // Route to main conversation
        await updateMessages(messagesWithUser);
        console.log('\u2705 Messages updated successfully');
      }
    } catch (err) {
      console.error('\u274C Failed to update messages:', err);
      alert('Failed to save message. Please check your connection.');
      return;
    }

    setInputValue('');
    setAttachedFiles([]); // Clear file attachments after sending
    setAttachedImages([]); // Clear image attachments after sending
    setSelectedKBDoc(null); // Clear KB context after sending
    setIsTyping(true);

    // BIOGRAPHICAL EXTRACTION (fire-and-forget, non-blocking)
    const bioUserId = userProfile?.userId;
    const bioProfileId = userProfile?.profileId || userProfile?.id;
    console.log('\u{1F4D6} [Biography] Check:', {
      userId: bioUserId,
      profileId: bioProfileId,
      messageLength: userMessageText.length,
      willExtract: !!(bioUserId && bioProfileId && userMessageText.length > 10)
    });
    if (bioUserId && bioProfileId && userMessageText.length > 10) {
      console.log('\u{1F4D6} [Biography] Starting extraction...');
      biographyService.extractLifeEvents({
        message: userMessageText,
        userId: bioUserId,
        profileId: bioProfileId,
        userName: userProfile.firstName || userProfile.displayName,
        birthDate: userProfile.birth?.date || userProfile.birthDate,
        conversationId: targetConvId,
        messageId: userMessage.id?.toString()
      }).then(result => {
        if (result.has_life_events) {
          console.log('\u{1F4D6} [Biography] Life events detected:', result.events?.length, 'events');
          result.events?.forEach(e => console.log(`  - ${e.title} (${e.date?.year || 'unknown year'})`));
        }
      }).catch(err => {
        console.warn('\u{1F4D6} [Biography] Extraction error (non-blocking):', err.message);
      });
    }

    // ANALYZE with constitutional intelligence
    const analysis = analyzeMessage(userMessageText);

    // Get AI response guidance
    const guidance = getResponseGuidance(analysis);

    // Prepare guidance with emotional context
    const enrichedGuidance = {
      ...guidance,
      emotions: analysis.emotions,
      intensity: analysis.intensity,
      reasoning: analysis.reasoning
    };

    try {
      // Call the real Claude API via Firebase Function
      console.log('\u{1F680} Calling Claude API with mode:', guidance.mode);

      // Build knowledge prompt for this conversation (with profile isolation)
      const knowledgePrompt = buildKnowledgePrompt({
        maxTokens: 5500,
        forProfileId: userProfile?.profileId || userProfile?.id
      });

      // Build learned context from Session Intelligence
      let sessionContext = null;
      if (userProfile?.userId) {
        try {
          sessionContext = await contextBuilder.buildLearnedContext(
            userProfile.userId,
            guidance.mode,
            userMessageText
          );
          if (sessionContext) {
            console.log('\u{1F9E0} Session Intelligence context built:', {
              relationshipLevel: sessionContext.relationshipDepth?.level || 'New',
              totalConversations: sessionContext.totalConversations
            });
          }
        } catch (error) {
          console.error('Context builder error:', error);
        }
      }

      // DEBUG: Log knowledge base status
      console.log('\u{1F4DA} Knowledge Base Debug:', {
        kbStats,
        promptLength: knowledgePrompt?.length || 0,
        promptPreview: knowledgePrompt?.slice(0, 200) || '(empty)'
      });

      const response = await sendToAI({
        message: userMessage.fullText || userMessageText,
        guidance: enrichedGuidance,
        conversationHistory: messages,
        userProfile: userProfile,
        knowledgePrompt,
        learnedContext: sessionContext?.learnedContext || null,
        image: imageData,
        // Memory Architecture (Phase 3)
        profileId: userProfile?.id,
        sessionId: activeConversationId,
        // Conversation Cache - 80%+ token reduction (Phase 4)
        useOptimizedPayload: messages.length > 10,
        conversationId: activeConversationId,
        // Modality Isolation
        modality
      });

      // Log token savings if using optimized payload
      if (response.cacheMetrics) {
        console.log('\u{1F4B0} [ConversationCache] Token Savings:', {
          tokensSaved: response.cacheMetrics.tokensSaved,
          reductionPercent: `${response.cacheMetrics.reductionPercent}%`,
          messagesCompressed: response.cacheMetrics.messagesInFull - response.cacheMetrics.messagesInOptimized
        });
      }

      // Create message for Firestore (without large base64 image data)
      const aiMessageForFirestore = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toISOString(),
        mode: analysis.recommendedMode,
        analysis: analysis,
        fromAPI: response.success,
        hasGeneratedImage: !!response.generatedImage,
        generatedImagePrompt: response.generatedImage?.prompt || null,
        modality
      };

      // Create message for local display (with full image data)
      const aiMessageForDisplay = {
        ...aiMessageForFirestore,
        generatedImage: response.generatedImage ? {
          mimeType: response.generatedImage.mimeType,
          data: response.generatedImage.data,
          prompt: response.generatedImage.prompt
        } : null
      };

      // Update Firestore or Thread with sanitized message (no large binary data)
      if (isInThread) {
        await addMessageToThread({
          sender: 'ai',
          text: response.text,
          mode: analysis.recommendedMode,
          fromAPI: response.success,
          hasGeneratedImage: !!response.generatedImage,
          generatedImagePrompt: response.generatedImage?.prompt || null
        });
        console.log('\u2705 AI message added to thread');
      } else {
        await updateMessages([...messagesWithUser, aiMessageForFirestore]);
      }

      // Cache generated image locally (for display in current session only)
      if (response.generatedImage) {
        setGeneratedImagesCache(prev => ({
          ...prev,
          [aiMessageForFirestore.id]: {
            mimeType: response.generatedImage.mimeType,
            data: response.generatedImage.data,
            prompt: response.generatedImage.prompt
          }
        }));
        console.log('\u{1F3A8} Cached generated image for message:', aiMessageForFirestore.id);
      }

      setApiStatus(response.success ? 'connected' : 'fallback');

      // Update Warmth & Happiness state (Six Laws + Mountain Climbing)
      if (response.warmthHappiness) {
        setWarmthHappiness(response.warmthHappiness);
        console.log('\u{1F49B} [Warmth] Updated:', {
          mountain: response.warmthHappiness.mountainHeight?.toFixed(1),
          warmth: response.warmthHappiness.warmthMultiplier?.toFixed(1) + 'x',
          level: response.warmthHappiness.interpretation?.level
        });
      }

      if (!response.success) {
        console.warn('\u26A0\u{FE0F} Using fallback response:', response.error);
      }

      // Call parent callback if provided
      onMessageSend?.(userMessage, aiMessageForDisplay, analysis);

      // Capture Luna voice transcript if in voice mode
      if (modality === 'voice' && isVoiceEnabled) {
        addLunaVoiceTranscript(response.text);
      }

      // BIOGRAPHICAL EXTRACTION FROM AI RESPONSE (capture deduced facts)
      if (bioUserId && bioProfileId && response.text && response.text.length > 50) {
        console.log('\u{1F4D6} [Biography] Extracting from AI response...');
        biographyService.extractLifeEvents({
          message: response.text,
          userId: bioUserId,
          profileId: bioProfileId,
          userName: userProfile.firstName || userProfile.displayName,
          birthDate: userProfile.birth?.date || userProfile.birthDate,
          conversationId: targetConvId,
          messageId: aiMessageForFirestore.id?.toString(),
          isAIResponse: true
        }).then(result => {
          if (result.has_life_events) {
            console.log('\u{1F4D6} [Biography] AI-deduced events:', result.events?.length, 'events');
            result.events?.forEach(e => console.log(`  - ${e.title} (${e.date?.year || 'unknown year'})`));
          }
        }).catch(err => {
          console.warn('\u{1F4D6} [Biography] AI response extraction error (non-blocking):', err.message);
        });
      }

    } catch (error) {
      console.error('\u274C API Error:', error);

      // Use fallback response
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: getFallbackResponse(guidance.mode),
        timestamp: new Date().toISOString(),
        mode: analysis.recommendedMode,
        analysis: analysis,
        fromAPI: false,
        modality
      };

      // Update Firestore or Thread with fallback response
      if (isInThread) {
        await addMessageToThread({
          sender: 'ai',
          text: aiMessage.text,
          mode: analysis.recommendedMode,
          fromAPI: false
        });
        console.log('\u2705 Fallback AI message added to thread');
      } else {
        await updateMessages([...messagesWithUser, aiMessage]);
      }
      setApiStatus('fallback');
      onMessageSend?.(userMessage, aiMessage, analysis);

      // Capture Luna fallback voice transcript if in voice mode
      if (modality === 'voice' && isVoiceEnabled) {
        addLunaVoiceTranscript(aiMessage.text);
      }

    } finally {
      setIsTyping(false);
    }
  };

  return {
    handleSend
  };
}
