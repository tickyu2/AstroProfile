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
   * Validate transcript format
   */
  validate(transcript) {
    const messages = this.parse(transcript);

    if (messages.length === 0) {
      return {
        valid: false,
        error: 'No messages found. Please use format: "User: message" or "AI: message"'
      };
    }

    const hasUser = messages.some(m => m.speaker === 'user');
    if (!hasUser) {
      return {
        valid: false,
        error: 'No user messages found. Use "User:" prefix for user messages.'
      };
    }

    return {
      valid: true,
      messageCount: messages.length
    };
  }
}
