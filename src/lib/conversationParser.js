/**
 * Conversation Parser
 * Parses transcript text into structured messages
 */

export class ConversationParser {
  constructor() {
    this.userPatterns = /^(User|Human|Customer|Person):\s*/i;
    this.aiPatterns = /^(AI|Assistant|Bot|Luna|System):\s*/i;
  }

  /**
   * Parse transcript text into structured messages
   */
  parse(transcript) {
    const lines = transcript
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Check if ANY line has a speaker pattern
    const hasAnyPattern = lines.some(line =>
      this.userPatterns.test(line) || this.aiPatterns.test(line)
    );

    // If no patterns found, treat entire text as user input
    // Split by paragraph (double newline) or sentence-like breaks
    if (!hasAnyPattern && lines.length > 0) {
      return this.parseAsUserText(transcript);
    }

    const messages = [];
    let currentSpeaker = null;
    let currentText = '';

    for (const line of lines) {
      // Check if line starts with speaker indicator
      const isUser = this.userPatterns.test(line);
      const isAI = this.aiPatterns.test(line);

      if (isUser || isAI) {
        // Save previous message if exists
        if (currentSpeaker && currentText.trim()) {
          messages.push({
            speaker: currentSpeaker,
            text: currentText.trim(),
            timestamp: Date.now() + messages.length * 1000
          });
        }

        // Start new message
        currentSpeaker = isUser ? 'user' : 'ai';
        currentText = line.replace(this.userPatterns, '').replace(this.aiPatterns, '');
      } else {
        // Continue current message
        currentText += ' ' + line;
      }
    }

    // Add final message
    if (currentSpeaker && currentText.trim()) {
      messages.push({
        speaker: currentSpeaker,
        text: currentText.trim(),
        timestamp: Date.now() + messages.length * 1000
      });
    }

    return messages;
  }

  /**
   * Parse plain text as user messages
   * Splits by paragraphs (blank lines) or treats as single message
   */
  parseAsUserText(transcript) {
    const messages = [];

    // Split by double newlines (paragraphs)
    const paragraphs = transcript
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (paragraphs.length > 1) {
      // Multiple paragraphs = multiple user messages
      paragraphs.forEach((text, index) => {
        messages.push({
          speaker: 'user',
          text: text.replace(/\n/g, ' ').trim(),
          timestamp: Date.now() + index * 1000
        });
      });
    } else {
      // Single block of text - could be multiple lines
      const lines = transcript.split('\n').map(l => l.trim()).filter(l => l);

      if (lines.length > 1) {
        // Treat each line as a separate user message
        lines.forEach((text, index) => {
          messages.push({
            speaker: 'user',
            text: text.trim(),
            timestamp: Date.now() + index * 1000
          });
        });
      } else {
        // Single line
        messages.push({
          speaker: 'user',
          text: transcript.trim(),
          timestamp: Date.now()
        });
      }
    }

    return messages;
  }

  /**
   * Validate transcript format
   */
  validate(transcript) {
    const messages = this.parse(transcript);

    if (messages.length === 0) {
      return {
        valid: false,
        error: 'No text found. Please enter some text or use format: "User: message"'
      };
    }

    const hasUser = messages.some(m => m.speaker === 'user');
    if (!hasUser) {
      return {
        valid: false,
        error: 'No user messages found.'
      };
    }

    return {
      valid: true,
      messageCount: messages.length
    };
  }
}
