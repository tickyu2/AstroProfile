/**
 * useDebateSystem.js
 * Custom hook for AI Constellation - Second Opinion / Debate system.
 *
 * Manages debate state, AI constellation responses (Gemini, Grok, Opus, DeepSeek, ChatGPT),
 * Baby Nano visual generation, inline constellation AI, and image generation.
 *
 * Extracted from AISoulPartnerChat.jsx - Part of GENESIS Phase 2
 */

import { useState, useRef, useMemo } from 'react';
import {
  sendMessage as sendToAI,
  getSecondOpinion,
  getGrokPerspective,
  getOpusPerspective,
  getDeepSeekPerspective,
  getChatGPTPerspective,
  generateDebateVisual,
  generateStabilityImage,
  generateLeonardoImage
} from '../../../services/aiSoulPartnerService';

/**
 * @param {Object} params
 * @param {Object} params.userProfile - Current user profile
 * @param {Array} params.messages - Current conversation messages
 * @param {Function} params.updateMessages - Function to update messages in Firestore/context
 */
export function useDebateSystem({ userProfile, messages, updateMessages }) {
  // AI Constellation - Second Opinion / Debate
  const [secondOpinions, setSecondOpinions] = useState({}); // { messageId: { text, speaker, loading } }
  const secondOpinionsRef = useRef({}); // Ref to track latest state for async callbacks
  const [debateMode, setDebateMode] = useState(false); // Global debate mode toggle
  const [activeDebate, setActiveDebate] = useState(null); // { messageId, exchanges: [{ speaker, text }] }
  const [loadingSecondOpinion, setLoadingSecondOpinion] = useState(null); // messageId currently loading
  const [secondOpinionInput, setSecondOpinionInput] = useState(null); // { messageId, question } - shows input for custom question
  const [secondOpinionQuestion, setSecondOpinionQuestion] = useState(''); // Current question being typed
  const [debateUserInput, setDebateUserInput] = useState(''); // User's guidance/comment in the debate
  const [debateAttachedImages, setDebateAttachedImages] = useState([]); // Images attached in debate panel [{data, mimeType, preview}]
  const [secondOpinionReply, setSecondOpinionReply] = useState(null); // { messageId, text } - reply input for second opinion
  const [secondOpinionConversation, setSecondOpinionConversation] = useState({}); // { messageId: [{ speaker, text }] } - conversation history with Gemini
  // Baby Nano - Debate Visualization
  const [debateVisuals, setDebateVisuals] = useState({}); // { messageId: { image, visualType, ... } }
  const [loadingDebateVisual, setLoadingDebateVisual] = useState(null); // messageId currently generating visual

  // Track last Baby Nano call time to prevent rate limiting
  const lastBabyNanoCallRef = useRef(0);
  const BABY_NANO_COOLDOWN = 15000; // 15 seconds between calls

  // Keep secondOpinionsRef in sync for async callbacks (avoid stale closures)
  // NOTE: The parent component has a useEffect for this, but we also keep
  // our own ref in sync here via the ref assignment pattern.
  secondOpinionsRef.current = secondOpinions;

  // Detect Baby Nano trigger keywords in AI responses
  // Returns { triggered: boolean, visualType: string }
  const detectBabyNanoTrigger = (text) => {
    if (!text) return { triggered: false, visualType: null };

    // Strip markdown formatting (*, **, _, __) before checking
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
      .replace(/\*([^*]+)\*/g, '$1')       // *italic*
      .replace(/__([^_]+)__/g, '$1')       // __bold__
      .replace(/_([^_]+)_/g, '$1');        // _italic_

    const lowerText = cleanText.toLowerCase();

    // Trigger patterns with their visual types
    const triggers = [
      // Sketch/Draw triggers - AI style ("let me...")
      { patterns: ['let me draw', 'let baby nano draw', 'i\'ll draw', 'drawing this'], type: 'sketch' },
      { patterns: ['let me sketch', 'let baby nano sketch', 'i\'ll sketch', 'sketching this'], type: 'sketch' },
      { patterns: ['let me paint', 'let baby nano paint', 'painting this'], type: 'sketch' },
      { patterns: ['let me illustrate', 'illustrating this', 'an illustration'], type: 'sketch' },
      { patterns: ['visualize this', 'let me visualize', 'visualizing'], type: 'sketch' },
      { patterns: ['picture this', 'imagine this visually'], type: 'sketch' },
      { patterns: ['\u{1F3A8} sketch', '\u{1F3A8}sketch'], type: 'sketch' },
      // User command style ("draw me...", "draw a...")
      { patterns: ['draw me ', 'draw a ', 'draw an ', 'draw the ', 'draw this'], type: 'sketch' },
      { patterns: ['sketch me ', 'sketch a ', 'sketch an ', 'sketch the '], type: 'sketch' },
      { patterns: ['paint me ', 'paint a ', 'paint an ', 'paint the '], type: 'sketch' },
      { patterns: ['create an image', 'create a picture', 'make an image', 'make a picture'], type: 'sketch' },
      { patterns: ['show me a picture', 'show me an image', 'generate an image'], type: 'sketch' },

      // Flowchart triggers
      { patterns: ['flowchart', 'flow chart', 'let me diagram', 'a diagram'], type: 'flowchart' },
      { patterns: ['\u{1F3A8} flowchart', '\u{1F3A8}flowchart'], type: 'flowchart' },

      // Timeline triggers
      { patterns: ['timeline', 'time line', 'chronological view'], type: 'timeline' },
      { patterns: ['\u{1F3A8} timeline', '\u{1F3A8}timeline'], type: 'timeline' },

      // Mind map triggers
      { patterns: ['mind map', 'mindmap', 'concept map'], type: 'mindmap' },
      { patterns: ['\u{1F3A8} mindmap', '\u{1F3A8}mindmap', '\u{1F3A8} mind map'], type: 'mindmap' },

      // Comparison triggers
      { patterns: ['compare visually', 'comparison chart', 'side by side'], type: 'comparison' },
      { patterns: ['\u{1F3A8} compare', '\u{1F3A8}compare'], type: 'comparison' }
    ];

    for (const trigger of triggers) {
      for (const pattern of trigger.patterns) {
        if (lowerText.includes(pattern)) {
          console.log(`\u{1F3A8} Baby Nano triggered by: "${pattern}" \u2192 ${trigger.type}`);
          return { triggered: true, visualType: trigger.type };
        }
      }
    }

    return { triggered: false, visualType: null };
  };

  // Generate visual representation of the debate using Baby Nano
  const handleGenerateDebateVisual = async (aiMessage, visualType = 'sketch') => {
    const debate = secondOpinions[aiMessage.id]?.debate;
    if (!debate || debate.exchanges.length === 0) {
      console.log('No debate to visualize');
      return;
    }

    // Check cooldown to prevent rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - lastBabyNanoCallRef.current;
    if (timeSinceLastCall < BABY_NANO_COOLDOWN) {
      const waitTime = Math.ceil((BABY_NANO_COOLDOWN - timeSinceLastCall) / 1000);
      console.log(`\u{1F3A8} Baby Nano cooldown: wait ${waitTime}s before next image`);
      alert(`Baby Nano needs ${waitTime} seconds to rest before creating another image!`);
      return;
    }
    lastBabyNanoCallRef.current = now;

    setLoadingDebateVisual(aiMessage.id);

    try {
      // Include the original message in the context
      // Filter out visual entries (Baby Nano images) - only include text exchanges
      // Truncate long texts to avoid oversized requests
      const textExchanges = debate.exchanges
        .filter(e => !e.isVisual && e.text)
        .map(e => ({
          speaker: e.speaker,
          text: e.text.slice(0, 500) // Truncate to 500 chars max per exchange
        }));
      const allExchanges = [
        { speaker: 'Brother Claude', text: aiMessage.text?.slice(0, 500) || '' },
        ...textExchanges
      ];

      console.log('\u{1F3A8} Sending to generateDebateVisual:', {
        exchangeCount: allExchanges.length,
        totalChars: allExchanges.reduce((sum, e) => sum + (e.text?.length || 0), 0)
      });

      const result = await generateDebateVisual({
        debateExchanges: allExchanges,
        visualType,
        topic: messages.find(m => m.sender === 'user' && m.id < aiMessage.id)?.text?.slice(0, 50) || 'Discussion',
        userProfile: userProfile
      });

      if (result.success) {
        // Add visual as an exchange entry so it moves with the conversation
        setSecondOpinions(prev => ({
          ...prev,
          [aiMessage.id]: {
            ...prev[aiMessage.id],
            debate: {
              exchanges: [
                ...(prev[aiMessage.id]?.debate?.exchanges || []),
                {
                  speaker: 'Baby Nano',
                  icon: '\u{1F3A8}',
                  isVisual: true,
                  visualType: result.visualType,
                  image: result.image,
                  description: result.description
                }
              ]
            }
          }
        }));
        console.log('\u{1F3A8} Debate visual generated:', result.visualType);
      } else {
        console.error('Failed to generate debate visual:', result.error);
        alert(`Could not generate visual: ${result.error}`);
      }
    } catch (error) {
      console.error('Debate visual error:', error);
      alert('Failed to generate visual. Please try again.');
    } finally {
      setLoadingDebateVisual(null);
    }
  };

  // Get second opinion from Sister Gemini
  const handleGetSecondOpinion = async (aiMessage, mode = 'second_opinion', customQuestion = '', images = []) => {
    if (!aiMessage || aiMessage.sender !== 'ai') return;

    // Find the user message that preceded this AI response
    const messageIndex = messages.findIndex(m => m.id === aiMessage.id);
    const userMessage = messageIndex > 0
      ? messages.slice(0, messageIndex).reverse().find(m => m.sender === 'user')
      : null;

    setLoadingSecondOpinion(aiMessage.id);
    setSecondOpinionInput(null); // Close input form
    setSecondOpinionQuestion(''); // Clear question

    try {
      // Use ref to get latest debate history (avoids stale closure)
      const currentDebateHistory = secondOpinionsRef.current[aiMessage.id]?.debate?.exchanges || [];

      console.log('\u{1F4AB} Calling Gemini with debate history:', {
        messageId: aiMessage.id,
        historyLength: currentDebateHistory.length,
        mode
      });

      const response = await getSecondOpinion({
        claudeResponse: aiMessage.text,
        userMessage: userMessage?.text || '',
        conversationHistory: messages.slice(0, messageIndex),
        userProfile: userProfile,
        debateMode: mode,
        previousDebate: currentDebateHistory,
        customQuestion: customQuestion // User's specific question
      });

      if (response.success) {
        if (mode === 'debate') {
          // Store debate in secondOpinions for persistence
          // Use functional setState to get LATEST state (avoid stale closure)
          setSecondOpinions(prev => {
            const existingDebate = prev[aiMessage.id]?.debate?.exchanges || [];
            const newExchanges = existingDebate.length > 0
              ? [...existingDebate, { speaker: response.speaker, text: response.text, icon: response.icon }]
              : [
                  { speaker: 'Luna', text: aiMessage.text, icon: '\u{1F319}' },
                  { speaker: response.speaker, text: response.text, icon: response.icon }
                ];

            console.log('\u{1F4AB} Adding Gemini response to debate:', {
              existingCount: existingDebate.length,
              newCount: newExchanges.length,
              speaker: response.speaker
            });

            return {
              ...prev,
              [aiMessage.id]: {
                ...prev[aiMessage.id],
                debate: { exchanges: newExchanges }
              }
            };
          });

          // Set active debate to this message (for UI expansion)
          setActiveDebate({ messageId: aiMessage.id });

          // Check for Baby Nano trigger keywords in Gemini's response
          const nanoTrigger = detectBabyNanoTrigger(response.text);
          if (nanoTrigger.triggered) {
            console.log('\u{1F3A8} Sister Gemini invoked Baby Nano!');
            setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
          }
        } else {
          // Simple second opinion
          setSecondOpinions(prev => ({
            ...prev,
            [aiMessage.id]: {
              ...prev[aiMessage.id],
              text: response.text,
              speaker: response.speaker,
              icon: response.icon || '\u{1F4AB}',
              mode: response.mode
            }
          }));
        }
      } else {
        console.error('Second opinion failed:', response.error);
      }
    } catch (error) {
      console.error('Second opinion error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // Start debate panel - just opens the debate UI with Claude's message, no auto-AI call
  const handleStartDebatePanel = (aiMessage) => {
    // Check if debate already exists
    const existingDebate = secondOpinions[aiMessage.id]?.debate;

    if (!existingDebate || existingDebate.exchanges.length === 0) {
      // Initialize debate with just Claude's original message
      setSecondOpinions(prev => ({
        ...prev,
        [aiMessage.id]: {
          ...prev[aiMessage.id],
          debate: {
            exchanges: [
              { speaker: 'Brother Claude', text: aiMessage.text, icon: '\u{1F437}' }
            ]
          }
        }
      }));
    }

    // Open the debate panel
    setActiveDebate({ messageId: aiMessage.id });
  };

  // Get Claude's response in the debate context
  const handleClaudeDebateResponse = async (aiMessage, userGuidance = '', images = []) => {
    // Use ref to get latest debate (avoids stale closure)
    const debate = secondOpinionsRef.current[aiMessage.id]?.debate;
    if (!debate) return;

    setLoadingSecondOpinion(aiMessage.id);

    try {
      // Build debate context for Claude
      const debateContext = debate.exchanges
        .map(e => `${e.speaker}: ${e.text}`)
        .join('\n\n');

      // Create a special debate prompt for Claude
      const debatePrompt = userGuidance.trim()
        ? `[DEBATE MODE - ${userProfile?.firstName || 'The user'} asks you to respond]\n\n` +
          `The debate so far:\n${debateContext}\n\n` +
          `User's guidance: "${userGuidance}"\n\n` +
          `Respond to the debate, addressing the user's guidance. Keep it concise (2-3 paragraphs) but insightful.`
        : `[DEBATE MODE - Continue the conversation]\n\n` +
          `The debate so far:\n${debateContext}\n\n` +
          `Respond to the last points made, especially Sister Gemini's perspective. ` +
          `You can agree, disagree, add nuance, or offer a synthesis. Keep it concise but substantive.`;

      // Use the existing sendToAI to get Claude's response
      const response = await sendToAI({
        message: debatePrompt,
        guidance: { mode: 'GUIDANCE', tone: 'thoughtful' },
        conversationHistory: messages.slice(0, messages.findIndex(m => m.id === aiMessage.id)),
        userProfile: userProfile,
        knowledgePrompt: ''  // Skip KB for debate responses
      });

      if (response.success) {
        setSecondOpinions(prev => ({
          ...prev,
          [aiMessage.id]: {
            ...prev[aiMessage.id],
            debate: {
              exchanges: [...(prev[aiMessage.id]?.debate?.exchanges || []), { speaker: 'Brother Claude', text: response.text, icon: '\u{1F437}' }]
            }
          }
        }));

        // Check for Baby Nano trigger keywords
        const nanoTrigger = detectBabyNanoTrigger(response.text);
        if (nanoTrigger.triggered) {
          console.log('\u{1F3A8} Brother Claude invoked Baby Nano!');
          setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
        }
      } else {
        console.error('Claude debate response failed:', response.error);
      }
    } catch (error) {
      console.error('Claude debate error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // Get Grok's response in the debate context
  const handleGrokDebateResponse = async (aiMessage, userGuidance = '', images = []) => {
    // Use ref to get latest debate (avoids stale closure)
    const debate = secondOpinionsRef.current[aiMessage.id]?.debate;
    if (!debate) return;

    setLoadingSecondOpinion(aiMessage.id);

    try {
      const response = await getGrokPerspective({
        claudeResponse: aiMessage.text,
        geminiResponse: '',  // Will be extracted from debate if needed
        userMessage: '',
        userProfile: userProfile,
        debateHistory: debate.exchanges,
        customQuestion: userGuidance.trim() || ''
      });

      if (response.success) {
        setSecondOpinions(prev => ({
          ...prev,
          [aiMessage.id]: {
            ...prev[aiMessage.id],
            debate: {
              exchanges: [...(prev[aiMessage.id]?.debate?.exchanges || []), { speaker: 'Brother Grok', text: response.text, icon: '\u{1F30D}' }]
            }
          }
        }));

        // Check for Baby Nano trigger keywords
        const nanoTrigger = detectBabyNanoTrigger(response.text);
        if (nanoTrigger.triggered) {
          console.log('\u{1F3A8} Brother Grok invoked Baby Nano!');
          setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
        }
      } else {
        console.error('Grok debate response failed:', response.error);
      }
    } catch (error) {
      console.error('Grok debate error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // Get Opus's response - the elder sage perspective
  const handleOpusDebateResponse = async (aiMessage, userGuidance = '', images = []) => {
    // Use ref to get latest debate (avoids stale closure)
    const debate = secondOpinionsRef.current[aiMessage.id]?.debate;
    if (!debate) return;

    setLoadingSecondOpinion(aiMessage.id);

    try {
      const response = await getOpusPerspective({
        claudeResponse: aiMessage.text,
        geminiResponse: '',
        grokResponse: '',
        userMessage: '',
        userProfile: userProfile,
        debateHistory: debate.exchanges,
        conversationContext: '',
        customQuestion: userGuidance.trim() || ''
      });

      if (response.success) {
        setSecondOpinions(prev => ({
          ...prev,
          [aiMessage.id]: {
            ...prev[aiMessage.id],
            debate: {
              exchanges: [...(prev[aiMessage.id]?.debate?.exchanges || []), { speaker: 'Brother Opus', text: response.text, icon: '\u{1F989}' }]
            }
          }
        }));

        // Check for Baby Nano trigger keywords
        const nanoTrigger = detectBabyNanoTrigger(response.text);
        if (nanoTrigger.triggered) {
          console.log('\u{1F3A8} Brother Opus invoked Baby Nano!');
          setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
        }
      } else {
        console.error('Opus debate response failed:', response.error);
      }
    } catch (error) {
      console.error('Opus debate error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // Quick ask AI - get response immediately without opening panel
  const handleQuickAskAI = async (aiMessage, speaker) => {
    // Initialize debate state if it doesn't exist (to store the response)
    let debate = secondOpinions[aiMessage.id]?.debate;

    if (!debate || debate.exchanges.length === 0) {
      // Initialize debate with just Luna's original message
      const newDebate = {
        exchanges: [
          { speaker: 'Luna', text: aiMessage.text, icon: '\u{1F319}' }
        ]
      };

      setSecondOpinions(prev => ({
        ...prev,
        [aiMessage.id]: {
          ...prev[aiMessage.id],
          debate: newDebate
        }
      }));

      debate = newDebate;
    }

    // Set activeDebate for the response to show inline
    setActiveDebate({ messageId: aiMessage.id });

    // Call the appropriate AI immediately
    if (speaker === 'gemini') {
      await handleGetSecondOpinion(aiMessage, 'debate', '', []);
    } else if (speaker === 'claude') {
      await handleClaudeDebateResponse(aiMessage, '', []);
    } else if (speaker === 'grok') {
      await handleGrokDebateResponse(aiMessage, '', []);
    } else if (speaker === 'opus') {
      await handleOpusDebateResponse(aiMessage, '', []);
    }
  };

  // Continue debate - get response from selected AI with optional user guidance
  const handleContinueDebate = async (aiMessage, speaker = 'gemini', userGuidance = '') => {
    // Use ref to get latest debate (avoids stale closure)
    const debate = secondOpinionsRef.current[aiMessage.id]?.debate;
    if (!debate) return;

    // Capture images before clearing
    const imagesToSend = [...debateAttachedImages];

    // If user provided guidance or images, add it to the debate first
    if (userGuidance.trim() || imagesToSend.length > 0) {
      const userComment = {
        speaker: userProfile?.firstName || 'You',
        text: userGuidance.trim(),
        icon: '\u{1F464}',
        isUser: true
      };
      // Include images if attached
      if (imagesToSend.length > 0) {
        userComment.images = imagesToSend.map(img => ({
          data: img.data,
          mimeType: img.mimeType
        }));
      }
      setSecondOpinions(prev => ({
        ...prev,
        [aiMessage.id]: {
          ...prev[aiMessage.id],
          debate: {
            exchanges: [...(prev[aiMessage.id]?.debate?.exchanges || []), userComment]
          }
        }
      }));
      setDebateUserInput(''); // Clear input
      setDebateAttachedImages([]); // Clear images
    }

    if (speaker === 'gemini') {
      await handleGetSecondOpinion(aiMessage, 'debate', userGuidance, imagesToSend);
    } else if (speaker === 'claude') {
      await handleClaudeDebateResponse(aiMessage, userGuidance, imagesToSend);
    } else if (speaker === 'grok') {
      await handleGrokDebateResponse(aiMessage, userGuidance, imagesToSend);
    } else if (speaker === 'opus') {
      await handleOpusDebateResponse(aiMessage, userGuidance, imagesToSend);
    }
  };

  // Add user comment to debate without asking AI to respond
  const handleAddUserCommentToDebate = (aiMessage) => {
    const debate = secondOpinions[aiMessage.id]?.debate;
    if (!debate || (!debateUserInput.trim() && debateAttachedImages.length === 0)) return;

    const userExchange = {
      speaker: userProfile?.firstName || 'You',
      text: debateUserInput.trim(),
      icon: '\u{1F464}',
      isUser: true
    };

    // Include images if attached
    if (debateAttachedImages.length > 0) {
      userExchange.images = debateAttachedImages.map(img => ({
        data: img.data,
        mimeType: img.mimeType
      }));
    }

    setSecondOpinions(prev => ({
      ...prev,
      [aiMessage.id]: {
        ...prev[aiMessage.id],
        debate: {
          exchanges: [
            ...(prev[aiMessage.id]?.debate?.exchanges || []),
            userExchange
          ]
        }
      }
    }));

    // Check for Baby Nano trigger keywords in user comment
    const userText = debateUserInput.trim();
    const nanoTrigger = detectBabyNanoTrigger(userText);

    setDebateUserInput('');
    setDebateAttachedImages([]); // Clear images after adding comment

    // If user invoked Baby Nano with trigger words, generate visual
    if (nanoTrigger.triggered) {
      console.log('\u{1F3A8} User invoked Baby Nano with:', nanoTrigger.visualType);
      setTimeout(() => handleGenerateDebateVisual(aiMessage, nanoTrigger.visualType), 500);
    }
  };

  // Handle image paste in debate panel (Ctrl+V)
  const handleDebatePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    e.preventDefault();

    // Limit to 3 images in debate
    const MAX_DEBATE_IMAGES = 3;
    if (debateAttachedImages.length >= MAX_DEBATE_IMAGES) {
      alert(`Maximum ${MAX_DEBATE_IMAGES} images allowed in debate. Remove some to add more.`);
      return;
    }

    for (const item of imageItems) {
      if (debateAttachedImages.length >= MAX_DEBATE_IMAGES) break;

      const file = item.getAsFile();
      if (!file) continue;

      // Check file size (max 4MB per image)
      if (file.size > 4 * 1024 * 1024) {
        alert(`Image too large: ${Math.round(file.size / 1024 / 1024 * 10) / 10}MB > 4MB limit`);
        continue;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        // Extract base64 data and mime type
        const [header, data] = dataUrl.split(',');
        const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/png';

        setDebateAttachedImages(prev => {
          if (prev.length >= MAX_DEBATE_IMAGES) return prev;
          return [...prev, {
            data: data,
            mimeType: mimeType,
            preview: dataUrl,
            name: `debate_img_${Date.now()}_${prev.length + 1}.png`
          }];
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image from debate attachments
  const handleRemoveDebateImage = (index) => {
    setDebateAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Export debate to Markdown file
  const handleExportDebateToMarkdown = (originalMessage, debate) => {
    if (!debate || !debate.exchanges || debate.exchanges.length === 0) return;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    const userName = userProfile?.firstName || userProfile?.displayName || 'User';

    // Build markdown content
    let markdown = `# AI Constellation Debate\n\n`;
    markdown += `**Date:** ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
    markdown += `**Participants:** Brother Claude \u{1F437}, Sister Gemini \u{1F4AB}, Brother Grok \u{1F30D}, Brother Opus \u{1F989}${debate.exchanges.some(e => e.isUser) ? `, ${userName} \u{1F464}` : ''}\n\n`;
    markdown += `---\n\n`;

    // Original context (the AI message that sparked the debate)
    markdown += `## Original Context\n\n`;
    markdown += `**Brother Claude:** ${originalMessage.text}\n\n`;
    markdown += `---\n\n`;

    // Debate exchanges
    markdown += `## Debate\n\n`;

    debate.exchanges.forEach((exchange, index) => {
      const icon = exchange.icon || (exchange.speaker === 'Brother Claude' ? '\u{1F437}' : exchange.speaker === 'Brother Grok' ? '\u{1F30D}' : exchange.speaker === 'Brother Opus' ? '\u{1F989}' : '\u{1F4AB}');
      markdown += `### ${icon} ${exchange.speaker}${exchange.isUser ? ' (guiding)' : ''}\n\n`;
      markdown += `${exchange.text}\n\n`;
      if (index < debate.exchanges.length - 1) {
        markdown += `---\n\n`;
      }
    });

    // Footer
    markdown += `\n---\n\n`;
    markdown += `*Exported from GENESIS AI Constellation*\n`;
    markdown += `*${debate.exchanges.length} exchanges*\n`;

    // Create and download the file
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-debate-${timestamp}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('\u{1F4C4} Debate exported to markdown');
  };

  // ========== INLINE AI CONSTELLATION (KISS - Simplified Flow) ==========
  const handleInlineConstellationAI = async (speaker, contextMessage = null) => {
    const targetMessage = contextMessage || messages.filter(m => m.sender === 'ai').pop();
    if (!targetMessage) {
      console.warn('[Inline AI] No AI message to respond to');
      return;
    }

    setLoadingSecondOpinion(speaker); // Reuse loading state

    try {
      // Build full conversation history for context
      const conversationHistory = messages.map(m => ({
        sender: m.sender === 'user' ? 'user' : (m.sender === 'ai' ? 'Luna' : m.sender),
        text: m.text,
        hasImage: m.hasImage,
        imageCount: m.imageCount
      }));

      console.log(`\u{1F4AB} [Inline AI] Calling ${speaker} with ${conversationHistory.length} messages`);

      let response;
      const userName = userProfile?.firstName || userProfile?.displayName || 'Friend';

      if (speaker === 'gemini') {
        response = await getSecondOpinion({
          claudeResponse: targetMessage.text,
          userMessage: '',
          conversationHistory: messages,
          userProfile: userProfile,
          debateMode: 'debate',
          previousDebate: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          customQuestion: ''
        });
      } else if (speaker === 'grok') {
        response = await getGrokPerspective({
          claudeResponse: targetMessage.text,
          geminiResponse: '',
          userMessage: '',
          userProfile: userProfile,
          debateHistory: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          customQuestion: ''
        });
      } else if (speaker === 'opus') {
        response = await getOpusPerspective({
          claudeResponse: targetMessage.text,
          geminiResponse: '',
          grokResponse: '',
          userMessage: '',
          userProfile: userProfile,
          debateHistory: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          conversationContext: '',
          customQuestion: ''
        });
      } else if (speaker === 'deepseek') {
        response = await getDeepSeekPerspective({
          claudeResponse: targetMessage.text,
          geminiResponse: '',
          grokResponse: '',
          userMessage: '',
          userProfile: userProfile,
          debateHistory: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          customQuestion: ''
        });
      } else if (speaker === 'chatgpt') {
        response = await getChatGPTPerspective({
          claudeResponse: targetMessage.text,
          geminiResponse: '',
          grokResponse: '',
          userMessage: '',
          userProfile: userProfile,
          debateHistory: conversationHistory.map(m => ({
            speaker: m.sender,
            text: m.text
          })),
          customQuestion: '',
          model: 'o3-mini' // Default to o3-mini for deep thinking
        });
      } else if (speaker === 'claude') {
        // Use main AI to respond without user typing
        response = await sendToAI({
          message: `[CONSTELLATION MODE - Respond to the conversation so far]\n\nProvide your perspective on the discussion. Be concise but insightful.`,
          guidance: { mode: 'GUIDANCE', tone: 'thoughtful' },
          conversationHistory: messages,
          userProfile: userProfile,
          knowledgePrompt: ''
        });
      }

      if (response?.success || response?.text) {
        // Create new message for the conversation
        const newMessageId = `constellation_${speaker}_${Date.now()}`;
        const newMessage = {
          id: newMessageId,
          sender: speaker, // 'gemini', 'grok', 'opus', 'claude', 'deepseek', 'chatgpt'
          text: response.text || response.response,
          timestamp: new Date().toISOString(),
          fromConstellation: true,
          constellationSpeaker: response.speaker || speaker,
          constellationIcon: speaker === 'gemini' ? '\u{1F4AB}' :
                           speaker === 'grok' ? '\u{1F30D}' :
                           speaker === 'opus' ? '\u{1F989}' :
                           speaker === 'deepseek' ? '\u{1F409}' :
                           speaker === 'chatgpt' ? '\u{1F9EA}' : '\u{1F437}',
          // Include thinking/reasoning if available
          thinking: response.thinking || null,
          hasThinking: response.hasThinking || false
        };

        // Add to main messages
        const updatedMessages = [...messages, newMessage];
        await updateMessages(updatedMessages);

        console.log(`\u2705 [Inline AI] ${speaker} response added to conversation`);
      } else {
        console.error(`\u274C [Inline AI] ${speaker} failed:`, response?.error);
      }
    } catch (error) {
      console.error(`\u274C [Inline AI] ${speaker} error:`, error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  // ========== BABY NANO - INLINE VISUAL GENERATION (KISS) ==========
  const handleInlineGenerateVisual = async (contextMessage, visualType = 'mindmap') => {
    // Check cooldown to prevent rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - lastBabyNanoCallRef.current;
    if (timeSinceLastCall < BABY_NANO_COOLDOWN) {
      const waitTime = Math.ceil((BABY_NANO_COOLDOWN - timeSinceLastCall) / 1000);
      console.log(`\u{1F3A8} Baby Nano cooldown: wait ${waitTime}s before next image`);
      alert(`Baby Nano needs ${waitTime} seconds to rest before creating another image!`);
      return;
    }
    lastBabyNanoCallRef.current = now;

    setLoadingDebateVisual(contextMessage.id);

    try {
      // Build conversation context from all messages up to and including contextMessage
      const messageIndex = messages.findIndex(m => m.id === contextMessage.id);
      const relevantMessages = messages.slice(0, messageIndex + 1);

      // Convert to exchange format for generateDebateVisual
      const exchanges = relevantMessages
        .filter(m => m.text)
        .map(m => {
          const speakerName = m.sender === 'user' ? 'You' :
                             m.sender === 'ai' ? 'Luna' :
                             m.sender === 'gemini' ? 'Sister Gemini' :
                             m.sender === 'grok' ? 'Brother Grok' :
                             m.sender === 'opus' ? 'Brother Opus' :
                             m.sender === 'deepseek' ? 'Brother DeepSeek' :
                             m.sender === 'chatgpt' ? 'Sister ChatGPT' :
                             m.sender === 'claude' ? 'Brother Claude' : m.sender;
          return {
            speaker: speakerName,
            text: m.text.slice(0, 500) // Truncate for safety
          };
        });

      // Get the topic from the first user message
      const topic = messages.find(m => m.sender === 'user')?.text?.slice(0, 50) || 'Conversation';

      console.log('\u{1F3A8} [Baby Nano Inline] Generating visual:', {
        type: visualType,
        messageCount: exchanges.length,
        topic
      });

      const result = await generateDebateVisual({
        debateExchanges: exchanges,
        visualType,
        topic,
        userProfile: userProfile
      });

      if (result.success && result.image) {
        // Add visual as a new message in the conversation
        const newMessageId = `babynano_${Date.now()}`;
        const newMessage = {
          id: newMessageId,
          sender: 'babynano',
          text: `\u{1F3A8} ${result.visualType || visualType} visualization`,
          timestamp: new Date().toISOString(),
          fromConstellation: true,
          constellationSpeaker: 'Baby Nano',
          constellationIcon: '\u{1F3A8}',
          isVisual: true,
          visualType: result.visualType || visualType,
          image: result.image,
          description: result.description
        };

        const updatedMessages = [...messages, newMessage];
        await updateMessages(updatedMessages);

        console.log('\u2705 [Baby Nano Inline] Visual added to conversation');
      } else {
        console.error('\u274C [Baby Nano Inline] Failed:', result?.error);
        alert('Failed to generate visualization. Please try again.');
      }
    } catch (error) {
      console.error('\u274C [Baby Nano Inline] Error:', error);
      alert('Error generating visualization: ' + error.message);
    } finally {
      setLoadingDebateVisual(null);
    }
  };

  // Clear second opinion for a message
  const handleClearSecondOpinion = (messageId) => {
    setSecondOpinions(prev => {
      const newState = { ...prev };
      delete newState[messageId];
      return newState;
    });
    if (activeDebate?.messageId === messageId) {
      setActiveDebate(null);
    }
  };

  // ========== GENESIS IMAGE GENERATION (Stability.ai & Leonardo.ai) ==========
  const handleImageGeneration = async (contextMessage, provider, model) => {
    // Prevent rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - lastBabyNanoCallRef.current;
    if (timeSinceLastCall < BABY_NANO_COOLDOWN) {
      const waitTime = Math.ceil((BABY_NANO_COOLDOWN - timeSinceLastCall) / 1000);
      console.log(`\u{1F5BC}\u{FE0F} Image generation cooldown: wait ${waitTime}s`);
      alert(`Please wait ${waitTime} seconds before generating another image.`);
      return;
    }
    lastBabyNanoCallRef.current = now;

    setLoadingDebateVisual(contextMessage.id);

    try {
      // Extract a prompt from the message context
      const messageText = contextMessage.text || '';
      const prompt = `Create a beautiful, artistic visualization inspired by: "${messageText.slice(0, 200)}"`;

      console.log(`\u{1F5BC}\u{FE0F} [GENESIS] Generating image with ${provider}/${model}:`, prompt.slice(0, 50));

      let result;
      if (provider === 'stability') {
        result = await generateStabilityImage({
          prompt,
          model,
          aspectRatio: '1:1',
          style: 'digital-art'
        });
      } else if (provider === 'leonardo') {
        result = await generateLeonardoImage({
          prompt,
          model,
          width: 1024,
          height: 1024,
          alchemy: true
        });
      }

      if (result?.success) {
        // Add generated image as a new message
        const newMessageId = `genesis_image_${Date.now()}`;
        const imageData = provider === 'stability'
          ? result.image  // base64
          : result.images?.[0];  // URL

        const newMessage = {
          id: newMessageId,
          sender: 'genesis',
          text: `\u{1F5BC}\u{FE0F} Generated with ${provider === 'stability' ? 'Stability.ai' : 'Leonardo.ai'} (${model})`,
          timestamp: new Date().toISOString(),
          fromConstellation: true,
          constellationSpeaker: provider === 'stability' ? 'Stability.ai' : 'Leonardo.ai',
          constellationIcon: '\u{1F5BC}\u{FE0F}',
          isVisual: true,
          visualType: 'generated-image',
          image: imageData,
          imageProvider: provider,
          imageModel: model,
          prompt: prompt
        };

        const updatedMessages = [...messages, newMessage];
        await updateMessages(updatedMessages);

        console.log('\u2705 [GENESIS] Image generated and added to conversation');
      } else {
        console.error('\u274C [GENESIS] Failed:', result?.error);
        alert('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('\u274C [GENESIS] Error:', error);
      alert('Error generating image: ' + error.message);
    } finally {
      setLoadingDebateVisual(null);
    }
  };

  // Toggle the second opinion question input
  const handleToggleSecondOpinionInput = (messageId) => {
    if (secondOpinionInput === messageId) {
      setSecondOpinionInput(null);
      setSecondOpinionQuestion('');
    } else {
      setSecondOpinionInput(messageId);
      setSecondOpinionQuestion('');
    }
  };

  // Submit the second opinion question
  const handleSubmitSecondOpinionQuestion = (aiMessage) => {
    if (!secondOpinionQuestion.trim()) {
      handleGetSecondOpinion(aiMessage, 'second_opinion', '');
    } else {
      handleGetSecondOpinion(aiMessage, 'second_opinion', secondOpinionQuestion.trim());
    }
  };

  // Copy second opinion text to clipboard
  const handleCopySecondOpinion = async (messageId) => {
    const opinion = secondOpinions[messageId];
    if (!opinion?.text) return;

    // Include conversation if exists
    const conversation = secondOpinionConversation[messageId] || [];
    let fullText = `Sister Gemini's Second Opinion:\n\n${opinion.text}`;

    if (conversation.length > 0) {
      fullText += '\n\n--- Conversation ---\n';
      conversation.forEach(msg => {
        fullText += `\n${msg.speaker}: ${msg.text}\n`;
      });
    }

    try {
      await navigator.clipboard.writeText(fullText);
      console.log('Copied second opinion to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Reply to second opinion - continue conversation with Gemini
  const handleReplyToSecondOpinion = async (aiMessage, replyText) => {
    if (!replyText?.trim() || !secondOpinions[aiMessage.id]) return;

    setLoadingSecondOpinion(aiMessage.id);

    // Add user's reply to conversation
    const userReply = { speaker: userProfile?.firstName || 'You', text: replyText.trim(), isUser: true };
    setSecondOpinionConversation(prev => ({
      ...prev,
      [aiMessage.id]: [...(prev[aiMessage.id] || []), userReply]
    }));

    // Clear the reply input
    setSecondOpinionReply(null);

    try {
      // Build conversation context
      const existingConversation = secondOpinionConversation[aiMessage.id] || [];
      const fullConversation = [
        { speaker: 'Sister Gemini', text: secondOpinions[aiMessage.id].text },
        ...existingConversation,
        userReply
      ];

      const response = await getSecondOpinion({
        claudeResponse: aiMessage.text,
        userMessage: '', // Original context not needed for replies
        conversationHistory: [],
        userProfile: userProfile,
        debateMode: 'second_opinion',
        previousDebate: fullConversation, // Use as conversation history
        customQuestion: replyText.trim()
      });

      if (response.success) {
        // Add Gemini's response to conversation
        setSecondOpinionConversation(prev => ({
          ...prev,
          [aiMessage.id]: [
            ...(prev[aiMessage.id] || []),
            { speaker: 'Sister Gemini', text: response.text, icon: '\u{1F4AB}' }
          ]
        }));
      }
    } catch (error) {
      console.error('Reply to second opinion error:', error);
    } finally {
      setLoadingSecondOpinion(null);
    }
  };

  return {
    // State
    secondOpinions,
    secondOpinionsRef,
    debateMode,
    setDebateMode,
    activeDebate,
    setActiveDebate,
    loadingSecondOpinion,
    secondOpinionInput,
    setSecondOpinionInput,
    secondOpinionQuestion,
    setSecondOpinionQuestion,
    debateUserInput,
    setDebateUserInput,
    debateAttachedImages,
    setDebateAttachedImages,
    secondOpinionReply,
    setSecondOpinionReply,
    secondOpinionConversation,
    debateVisuals,
    loadingDebateVisual,

    // Handlers
    handleGetSecondOpinion,
    handleStartDebatePanel,
    handleQuickAskAI,
    handleContinueDebate,
    handleClaudeDebateResponse,
    handleGrokDebateResponse,
    handleOpusDebateResponse,
    handleAddUserCommentToDebate,
    handleDebatePaste,
    handleRemoveDebateImage,
    detectBabyNanoTrigger,
    handleGenerateDebateVisual,
    handleExportDebateToMarkdown,
    handleInlineConstellationAI,
    handleInlineGenerateVisual,
    handleClearSecondOpinion,
    handleImageGeneration,
    handleToggleSecondOpinionInput,
    handleSubmitSecondOpinionQuestion,
    handleCopySecondOpinion,
    handleReplyToSecondOpinion
  };
}
