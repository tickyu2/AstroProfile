/**
 * ============================================================================
 * SEMANTIC CHUNKER
 * ============================================================================
 * Optimized memory chunking with semantic boundaries.
 * Preserves dialogue structure and prevents mid-sentence splits.
 *
 * Features:
 *   - Dialogue-aware separators (User:, Luna:)
 *   - Semantic boundary detection
 *   - Configurable overlap for context preservation
 *   - Recursive splitting strategy
 *
 * Based on: LangChain best practices + Grok recommendations
 * Optimal chunk size: 512 tokens (research-backed)
 *
 * Created: December 31, 2025
 * Week 11: Enhancement Week - Memory Optimization
 * ============================================================================
 */

class SemanticChunker {

  constructor(options = {}) {
    // Optimal chunk size in characters (512 tokens ≈ 2000 chars)
    this.chunkSize = options.chunkSize || 2000;

    // Overlap for context preservation
    this.chunkOverlap = options.chunkOverlap || 400;

    // Custom separators for dialogue/chat format (ordered by priority)
    this.separators = [
      '\n\n\n',          // Triple newline (major breaks)
      '\n\n',            // Paragraph breaks
      '\nUser:',         // User turns
      '\nLuna:',         // Luna turns
      '\n',              // Single newlines
      '. ',              // Sentence boundaries
      '? ',              // Question boundaries
      '! ',              // Exclamation boundaries
      '; ',              // Semi-colon
      ', ',              // Comma
      ' '                // Space (last resort)
    ];

    // Minimum chunk size (prevent tiny chunks)
    this.minChunkSize = options.minChunkSize || 100;
  }

  /**
   * Split text into semantic chunks
   * @param {string} text - Text to chunk
   * @param {Object} metadata - Metadata to attach to chunks
   * @returns {Array} Array of chunk objects
   */
  async chunkText(text, metadata = {}) {
    if (!text || text.length === 0) {
      return [];
    }

    // If text fits in one chunk, return as-is
    if (text.length <= this.chunkSize) {
      return [{
        content: text,
        chunk_index: 0,
        total_chunks: 1,
        char_count: text.length,
        token_estimate: this.estimateTokens(text),
        ...metadata
      }];
    }

    // Use recursive character text splitting
    const chunks = this.recursiveSplit(text);

    // Add overlap between chunks
    const overlappedChunks = this.addOverlap(chunks);

    // Filter out tiny chunks and add metadata
    return overlappedChunks
      .filter(chunk => chunk.length >= this.minChunkSize)
      .map((content, index, arr) => ({
        content,
        chunk_index: index,
        total_chunks: arr.length,
        char_count: content.length,
        token_estimate: this.estimateTokens(content),
        ...metadata
      }));
  }

  /**
   * Recursive splitting with semantic boundaries
   * @param {string} text - Text to split
   * @param {number} separatorIndex - Current separator index
   * @returns {Array} Array of text chunks
   */
  recursiveSplit(text, separatorIndex = 0) {
    // Base case: text fits in chunk
    if (text.length <= this.chunkSize) {
      return [text];
    }

    // No more separators: force split
    if (separatorIndex >= this.separators.length) {
      return this.forceSplit(text);
    }

    const separator = this.separators[separatorIndex];
    const splits = text.split(separator);

    // If no split happened, try next separator
    if (splits.length === 1) {
      return this.recursiveSplit(text, separatorIndex + 1);
    }

    // Merge splits into chunks
    return this.mergeSplits(splits, separator, separatorIndex);
  }

  /**
   * Merge splits into appropriately-sized chunks
   * @param {Array} splits - Split text pieces
   * @param {string} separator - Separator used
   * @param {number} separatorIndex - Current separator index
   * @returns {Array} Merged chunks
   */
  mergeSplits(splits, separator, separatorIndex) {
    const chunks = [];
    let currentChunk = '';

    for (let i = 0; i < splits.length; i++) {
      const split = splits[i];

      // Skip empty splits
      if (!split.trim()) continue;

      // Test adding to current chunk
      const testChunk = currentChunk
        ? currentChunk + separator + split
        : split;

      if (testChunk.length <= this.chunkSize) {
        // Add to current chunk
        currentChunk = testChunk;
      } else {
        // Current chunk is done
        if (currentChunk) {
          chunks.push(currentChunk);
        }

        // Check if split itself is too large
        if (split.length > this.chunkSize) {
          // Recursively split this piece
          const subChunks = this.recursiveSplit(split, separatorIndex + 1);
          chunks.push(...subChunks.slice(0, -1));
          currentChunk = subChunks[subChunks.length - 1] || '';
        } else {
          currentChunk = split;
        }
      }
    }

    // Add final chunk
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  /**
   * Add overlap between chunks for context preservation
   * @param {Array} chunks - Array of text chunks
   * @returns {Array} Chunks with overlap
   */
  addOverlap(chunks) {
    if (chunks.length <= 1 || this.chunkOverlap <= 0) {
      return chunks;
    }

    const overlappedChunks = [chunks[0]];

    for (let i = 1; i < chunks.length; i++) {
      const prevChunk = chunks[i - 1];
      const currentChunk = chunks[i];

      // Get last N characters from previous chunk
      const overlapStart = Math.max(0, prevChunk.length - this.chunkOverlap);
      const overlapText = prevChunk.slice(overlapStart);

      // Find a clean break point in overlap
      const cleanBreak = this.findCleanBreak(overlapText);
      const cleanOverlap = cleanBreak >= 0
        ? overlapText.slice(cleanBreak)
        : overlapText;

      // Prepend to current chunk with marker
      overlappedChunks.push('[...] ' + cleanOverlap.trim() + '\n\n' + currentChunk);
    }

    return overlappedChunks;
  }

  /**
   * Find a clean break point in text (sentence/paragraph boundary)
   * @param {string} text - Text to search
   * @returns {number} Index of clean break, or -1
   */
  findCleanBreak(text) {
    // Look for sentence boundaries
    const patterns = ['\n\n', '\n', '. ', '? ', '! '];

    for (const pattern of patterns) {
      const idx = text.indexOf(pattern);
      if (idx >= 0 && idx < text.length - 10) {
        return idx + pattern.length;
      }
    }

    return -1;
  }

  /**
   * Force split at chunk size (last resort)
   * @param {string} text - Text to split
   * @returns {Array} Force-split chunks
   */
  forceSplit(text) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
      let end = Math.min(start + this.chunkSize, text.length);

      // Try to find a space near the end for cleaner break
      if (end < text.length) {
        const lastSpace = text.lastIndexOf(' ', end);
        if (lastSpace > start + this.chunkSize * 0.7) {
          end = lastSpace;
        }
      }

      chunks.push(text.slice(start, end));
      start = end;

      // Skip leading whitespace
      while (start < text.length && text[start] === ' ') {
        start++;
      }
    }

    return chunks;
  }

  /**
   * Chunk conversation history (special handling for dialogue)
   * @param {Array} messages - Array of message objects { role, content }
   * @param {Object} metadata - Additional metadata
   * @returns {Array} Chunked conversation
   */
  async chunkConversation(messages, metadata = {}) {
    // Convert messages to text with role markers
    let conversationText = '';

    messages.forEach(msg => {
      const role = msg.role === 'user' ? 'User' : 'Luna';
      conversationText += `\n${role}: ${msg.content}\n`;
    });

    // Chunk with dialogue-aware separators
    return this.chunkText(conversationText, {
      type: 'conversation',
      message_count: messages.length,
      ...metadata
    });
  }

  /**
   * Chunk happiness anchor (with special fields)
   * @param {Object} anchor - Happiness anchor object
   * @returns {Array} Chunked anchor content
   */
  async chunkHappinessAnchor(anchor) {
    // Combine all text fields
    const parts = [
      anchor.event ? `Event: ${anchor.event}` : null,
      anchor.user_quote ? `Quote: "${anchor.user_quote}"` : null,
      anchor.context ? `Context: ${anchor.context}` : null,
      anchor.tags ? `Tags: ${anchor.tags}` : null
    ].filter(Boolean);

    const fullText = parts.join('\n\n');

    return this.chunkText(fullText, {
      type: 'happiness_anchor',
      anchor_id: anchor.id,
      category: anchor.category,
      intensity: anchor.intensity
    });
  }

  /**
   * Estimate token count (rough approximation)
   * 1 token ≈ 4 characters for English
   * @param {string} text - Text to estimate
   * @returns {number} Estimated token count
   */
  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }

  /**
   * Validate chunks (check for quality)
   * @param {Array} chunks - Array of chunk objects
   * @returns {Object} Validation results
   */
  validateChunks(chunks) {
    const validation = {
      total_chunks: chunks.length,
      avg_chars: 0,
      avg_tokens: 0,
      min_chars: Infinity,
      max_chars: 0,
      under_size: 0,
      over_size: 0,
      warnings: [],
      quality_score: 100
    };

    if (chunks.length === 0) {
      return { ...validation, quality_score: 0, warnings: ['No chunks generated'] };
    }

    let totalChars = 0;
    let totalTokens = 0;

    chunks.forEach((chunk, idx) => {
      const content = chunk.content || chunk;
      const charCount = content.length;
      const tokenCount = this.estimateTokens(content);

      totalChars += charCount;
      totalTokens += tokenCount;

      validation.min_chars = Math.min(validation.min_chars, charCount);
      validation.max_chars = Math.max(validation.max_chars, charCount);

      // Check for problematic chunks
      if (charCount < this.minChunkSize) {
        validation.under_size++;
        validation.quality_score -= 5;
      }

      if (charCount > this.chunkSize * 1.2) {
        validation.over_size++;
        validation.warnings.push(`Chunk ${idx} is oversized: ${charCount} chars`);
        validation.quality_score -= 10;
      }

      // Check for broken sentences (ends mid-word)
      if (content.match(/\w$/)) {
        validation.warnings.push(`Chunk ${idx} may end mid-word`);
        validation.quality_score -= 2;
      }
    });

    validation.avg_chars = Math.round(totalChars / chunks.length);
    validation.avg_tokens = Math.round(totalTokens / chunks.length);
    validation.quality_score = Math.max(0, validation.quality_score);

    return validation;
  }

  /**
   * Get optimal settings for different content types
   * @param {string} contentType - Type of content
   * @returns {Object} Recommended settings
   */
  static getRecommendedSettings(contentType) {
    const settings = {
      conversation: {
        chunkSize: 2000,
        chunkOverlap: 400,
        description: 'Optimal for chat/dialogue with turn preservation'
      },
      longform: {
        chunkSize: 3000,
        chunkOverlap: 600,
        description: 'Optimal for long-form text like articles'
      },
      dense: {
        chunkSize: 1500,
        chunkOverlap: 300,
        description: 'Optimal for dense, information-rich content'
      },
      default: {
        chunkSize: 2000,
        chunkOverlap: 400,
        description: 'General purpose settings'
      }
    };

    return settings[contentType] || settings.default;
  }

  /**
   * Update configuration
   * @param {Object} config - New configuration
   */
  configure(config) {
    if (config.chunkSize) this.chunkSize = config.chunkSize;
    if (config.chunkOverlap) this.chunkOverlap = config.chunkOverlap;
    if (config.minChunkSize) this.minChunkSize = config.minChunkSize;
    if (config.separators) this.separators = config.separators;
  }

  /**
   * Get current configuration
   * @returns {Object} Current settings
   */
  getConfig() {
    return {
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
      minChunkSize: this.minChunkSize,
      separators: [...this.separators]
    };
  }
}

module.exports = SemanticChunker;
