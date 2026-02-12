/**
 * useKnowledgeBaseActions.js
 * Custom hook for Knowledge Base operations within the chat.
 *
 * Manages KB update generation, content chunking, save/replace,
 * and KB modal state management.
 *
 * Extracted from AISoulPartnerChat.jsx - Part of GENESIS Phase 2
 */

import { useState } from 'react';
import { sendMessage as sendToAI } from '../../../services/aiSoulPartnerService';

/**
 * @param {Object} params
 * @param {Object} params.userProfile - Current user profile
 * @param {Array} params.messages - Current conversation messages
 * @param {Function} params.createDocument - KB context function to create a document
 * @param {Function} params.updateDocument - KB context function to update a document
 */
export function useKnowledgeBaseActions({ userProfile, messages, createDocument, updateDocument }) {
  const [showKBUpdateModal, setShowKBUpdateModal] = useState(false); // KB update preview modal
  const [kbUpdateContent, setKBUpdateContent] = useState(''); // Generated KB update content
  const [kbUpdateTitle, setKBUpdateTitle] = useState(''); // Title for KB update
  const [isGeneratingKBUpdate, setIsGeneratingKBUpdate] = useState(false); // Loading state for KB generation
  const [kbUpdateSourceDoc, setKBUpdateSourceDoc] = useState(null); // The original doc being updated (if any)

  // Save AI response to Knowledge Base (opens modal for review)
  const handleSaveToKB = (message) => {
    // Generate a title from the first line or first 50 chars
    const firstLine = message.text.split('\n')[0].slice(0, 60);
    const title = `AI Summary: ${firstLine}${firstLine.length >= 60 ? '...' : ''}`;

    // Pre-fill the modal with the message content
    setKBUpdateTitle(title);
    setKBUpdateContent(message.text);
    setKBUpdateSourceDoc(null); // This is a new document, not an update
    setShowKBUpdateModal(true);
  };

  // Generate KB update from current discussion
  const handleGenerateKBUpdate = async (sourceDoc = null) => {
    setIsGeneratingKBUpdate(true);
    setKBUpdateSourceDoc(sourceDoc);

    try {
      // Build conversation summary for Claude
      const conversationText = messages
        .filter(m => m.id !== 0) // Skip initial greeting
        .map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`)
        .join('\n\n');

      const prompt = sourceDoc
        ? `Based on our discussion about "${sourceDoc.title}", please synthesize and update the knowledge document. Include new insights, clarifications, and discoveries from our conversation. Format as a well-structured markdown document that captures both the original knowledge and new learnings.

ORIGINAL DOCUMENT:
${sourceDoc.content}

OUR DISCUSSION:
${conversationText}

Please create an updated, comprehensive document that incorporates our discussion insights. Start with the title on the first line (without # prefix), then the content.`
        : `Based on our discussion, please create a knowledge base document that captures the key insights, discoveries, and conclusions. Format as a well-structured markdown document.

OUR DISCUSSION:
${conversationText}

Please create a comprehensive document. Start with a clear title on the first line (without # prefix), then the content.`;

      // Send to Claude for synthesis
      const response = await sendToAI({
        message: prompt,
        guidance: { mode: 'GUIDANCE', tone: 'structured' },
        conversationHistory: [],
        userProfile: userProfile,
        knowledgePrompt: ''
      });

      if (response.success && response.text) {
        // Extract title from first line
        const lines = response.text.trim().split('\n');
        const title = lines[0].replace(/^#*\s*/, '').trim();
        const content = lines.slice(1).join('\n').trim();

        setKBUpdateTitle(sourceDoc?.title || title);
        setKBUpdateContent(content || response.text);
        setShowKBUpdateModal(true);
      } else {
        alert('Failed to generate KB update. Please try again.');
      }
    } catch (error) {
      console.error('Error generating KB update:', error);
      alert('Error generating KB update: ' + error.message);
    } finally {
      setIsGeneratingKBUpdate(false);
    }
  };

  // Split content into chunks by sections/paragraphs
  const splitContentIntoChunks = (content, maxChars = 5000) => {
    if (content.length <= maxChars) return [content];

    const chunks = [];
    const sections = content.split(/\n(?=##\s)/); // Split by ## headers

    let currentChunk = '';
    for (const section of sections) {
      if ((currentChunk + section).length > maxChars && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = section;
      } else {
        currentChunk += (currentChunk ? '\n' : '') + section;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    // If still too large (no ## headers), split by paragraphs
    const finalChunks = [];
    for (const chunk of chunks) {
      if (chunk.length <= maxChars) {
        finalChunks.push(chunk);
      } else {
        // Split by double newlines (paragraphs)
        const paragraphs = chunk.split(/\n\n+/);
        let subChunk = '';
        for (const para of paragraphs) {
          if ((subChunk + para).length > maxChars && subChunk.length > 0) {
            finalChunks.push(subChunk.trim());
            subChunk = para;
          } else {
            subChunk += (subChunk ? '\n\n' : '') + para;
          }
        }
        if (subChunk.trim()) finalChunks.push(subChunk.trim());
      }
    }

    return finalChunks.length > 0 ? finalChunks : [content.slice(0, maxChars)];
  };

  // Save KB update (either replace original or create new)
  // Automatically splits large documents into multiple parts (_01, _02, etc.)
  const handleSaveKBUpdate = async (mode) => {
    try {
      const chunks = splitContentIntoChunks(kbUpdateContent, 5000);
      const isMultiPart = chunks.length > 1;

      if (mode === 'replace' && kbUpdateSourceDoc?.id && !isMultiPart) {
        // Single part - replace existing
        const docData = {
          title: kbUpdateTitle,
          content: kbUpdateContent,
          category: kbUpdateSourceDoc?.category || 'reference',
          summary: `Updated from AI discussion on ${new Date().toLocaleDateString()}`,
          priority: kbUpdateSourceDoc?.priority || 5,
          alwaysInclude: kbUpdateSourceDoc?.alwaysInclude || false
        };
        await updateDocument(kbUpdateSourceDoc.id, docData);
        console.log('\u{1F4DA} KB document updated:', kbUpdateTitle);
        alert('Knowledge Base document updated! \u2705');
      } else {
        // Create new document(s) - with _01, _02 suffix if multiple parts
        for (let i = 0; i < chunks.length; i++) {
          const partNum = String(i + 1).padStart(2, '0');
          const partTitle = isMultiPart ? `${kbUpdateTitle}_${partNum}` : kbUpdateTitle;
          const partSummary = isMultiPart
            ? `Part ${i + 1} of ${chunks.length} - Updated from AI discussion on ${new Date().toLocaleDateString()}`
            : `Updated from AI discussion on ${new Date().toLocaleDateString()}`;

          const docData = {
            title: partTitle,
            content: chunks[i],
            category: kbUpdateSourceDoc?.category || 'reference',
            summary: partSummary,
            priority: kbUpdateSourceDoc?.priority || 5,
            alwaysInclude: kbUpdateSourceDoc?.alwaysInclude || false
          };

          await createDocument(docData);
          console.log(`\u{1F4DA} KB document created: ${partTitle}`);
        }

        if (isMultiPart) {
          alert(`Document was large! Created ${chunks.length} parts:\n${chunks.map((_, i) => `${kbUpdateTitle}_${String(i + 1).padStart(2, '0')}`).join('\n')}`);
        } else {
          alert('New Knowledge Base document created! \u2705');
        }
      }

      // Close modal and reset
      setShowKBUpdateModal(false);
      setKBUpdateContent('');
      setKBUpdateTitle('');
      setKBUpdateSourceDoc(null);
    } catch (error) {
      console.error('Error saving KB update:', error);
      alert('Failed to save: ' + error.message);
    }
  };

  return {
    // State
    showKBUpdateModal,
    setShowKBUpdateModal,
    kbUpdateContent,
    setKBUpdateContent,
    kbUpdateTitle,
    setKBUpdateTitle,
    isGeneratingKBUpdate,
    kbUpdateSourceDoc,
    setKBUpdateSourceDoc,

    // Handlers
    handleSaveToKB,
    handleGenerateKBUpdate,
    handleSaveKBUpdate
  };
}
