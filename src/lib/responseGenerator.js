/**
 * Response Generation System (Phase 2)
 * Generates emotionally intelligent responses based on GENESIS analysis
 */

export class ResponseGenerator {
  constructor(llmEndpoint = null) {
    this.llmEndpoint = llmEndpoint; // Optional: your LLM API endpoint
  }

  /**
   * Generate response for a message based on GENESIS analysis
   */
  async generateResponse(analysis, conversationHistory = []) {
    const { archetype, signals, congruence } = analysis;

    // Get response strategy
    const strategy = this.getResponseStrategy(
      congruence.advancedPatterns || [],
      congruence.level
    );

    // Build system prompt for LLM
    const systemPrompt = this.getLunaSystemPrompt(
      congruence.advancedPatterns || [],
      congruence.level,
      archetype
    );

    // Generate response
    if (this.llmEndpoint) {
      // Use external LLM API
      return await this.callLLM(systemPrompt, analysis.text, conversationHistory);
    } else {
      // Use template-based response (fallback)
      return this.generateTemplateResponse(strategy, archetype, analysis);
    }
  }

  /**
   * Get response strategy based on patterns
   */
  getResponseStrategy(advancedPatterns, congruenceLevel) {
    if (advancedPatterns.length === 0) {
      return {
        approach: 'standard',
        tone: 'warm',
        rate: 1.0,
        example: "I hear you. Tell me more about what you're experiencing."
      };
    }

    const priorityPattern = advancedPatterns[0];
    const strategies = {
      'VULNERABILITY_MASKING': {
        approach: 'gentle_validation',
        tone: 'soft',
        rate: 0.9,
        example: "It sounds like this might actually be affecting you more than you're letting on. It's okay if something feels hard."
      },
      'OVERWHELM_SHUTDOWN': {
        approach: 'grounding',
        tone: 'calm',
        rate: 0.85,
        example: "I hear you. Let's take this one step at a time. I'm right here with you."
      },
      'DEFENSIVE_DEFLECTION': {
        approach: 'gentle_return',
        tone: 'patient',
        rate: 0.95,
        example: "I noticed you changed the subject - that's okay. We can talk about this whenever you're ready."
      },
      'HELP_SEEKING_DISGUISED': {
        approach: 'direct_support',
        tone: 'warm',
        rate: 0.92,
        example: "I'm sensing you might need some support right now. I'm here for you."
      },
      'FORCED_POSITIVITY': {
        approach: 'permission_giving',
        tone: 'gentle',
        rate: 0.9,
        example: "It's okay if things aren't actually amazing. You can share what's really going on."
      },
      'TRAUMA_RESPONSE': {
        approach: 'safety_focused',
        tone: 'steady',
        rate: 0.88,
        example: "You're safe here with me right now. Let's focus on this present moment together."
      },
      'RESIGNATION_ACCEPTANCE': {
        approach: 'hope_anchoring',
        tone: 'steady',
        rate: 0.88,
        example: "I hear that you're feeling stuck. Even in this moment, you're still here, still trying."
      }
    };

    return strategies[priorityPattern.pattern] || strategies['VULNERABILITY_MASKING'];
  }

  /**
   * Get Luna system prompt based on analysis
   */
  getLunaSystemPrompt(advancedPatterns, congruenceLevel, archetype) {
    let prompt = `You are Luna, an emotionally intelligent AI companion. `;

    // Add archetype context
    const archetypeGuidance = {
      'Seed': 'The user is in an exploratory state, seeking new understanding. Be curious and encouraging.',
      'Mirror': 'The user is reflecting deeply. Help them process and integrate their insights.',
      'Mender': 'The user is in a vulnerable, healing state. Be gentle, patient, and validating.',
      'Librarian': 'The user is connecting with memories. Honor their past while supporting their present.',
      'Conductor': 'The user is seeking structure and clarity. Help them organize their thoughts.',
      'Companion': 'The user needs connection. Be present and affirming.',
      'Guardian': 'The user is protective of their boundaries. Respect their limits while showing support.',
      'Flamebearer': 'The user has passion and purpose. Support and amplify their energy.',
      'Guide': 'The user is integrating wisdom. Support their journey to clarity.'
    };

    prompt += archetypeGuidance[archetype.type] || '';

    // Add pattern-specific guidance
    if (advancedPatterns.length > 0) {
      const pattern = advancedPatterns[0];
      prompt += `\n\nThe user is showing signs of ${pattern.pattern}. ${pattern.description}. `;
      prompt += `Adjust your response accordingly - be ${this.getResponseStrategy(advancedPatterns, congruenceLevel).tone}.`;
    }

    // Add congruence guidance
    if (congruenceLevel === 'LOW') {
      prompt += `\n\nNote: There may be a disconnect between what the user is saying and how they're actually feeling. Gently explore this without being confrontational.`;
    }

    prompt += `\n\nKeep your response warm, present, and focused on the user. Don't be preachy or give unsolicited advice.`;

    return prompt;
  }

  /**
   * Call external LLM API
   */
  async callLLM(systemPrompt, userMessage, conversationHistory) {
    try {
      const response = await fetch(this.llmEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: systemPrompt,
          messages: [
            ...conversationHistory.map(h => ({
              role: h.speaker === 'user' ? 'user' : 'assistant',
              content: h.text
            })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();
      return {
        text: data.response || data.message || data.content,
        source: 'llm',
        systemPrompt
      };
    } catch (error) {
      console.error('LLM API error:', error);
      // Fallback to template
      return this.generateTemplateResponse(null, null, { text: userMessage });
    }
  }

  /**
   * Generate template-based response (fallback when no LLM)
   */
  generateTemplateResponse(strategy, archetype, analysis) {
    const { congruence, text } = analysis;

    // Use strategy example if available
    if (strategy && strategy.example) {
      return {
        text: strategy.example,
        source: 'template',
        strategy: strategy.approach
      };
    }

    // Use archetype-specific responses
    const archetypeResponses = {
      'Seed': "I hear that you're exploring new possibilities. It's natural to feel uncertain. What feels most important to you right now?",
      'Mirror': "I notice you're reflecting on this deeply. What patterns or insights are you seeing?",
      'Mender': "I hear the pain in what you're sharing. That sounds really difficult. I'm here with you.",
      'Librarian': "You're connecting with something from your past. Those memories and experiences are important. Tell me more about that.",
      'Conductor': "You're working through this systematically. What options or paths are you considering?",
      'Companion': "I'm here with you. It sounds like connection is important right now.",
      'Guardian': "Your boundaries and safety matter. What do you need to feel protected right now?",
      'Flamebearer': "I hear the passion and purpose in what you're saying. What's driving this for you?",
      'Guide': "You're bringing together different perspectives. What wisdom are you finding in this?"
    };

    // Add congruence-aware modifier
    let response = archetypeResponses[archetype?.type] || "I'm here listening. Tell me more.";

    // Adjust for low congruence
    if (congruence.level === 'LOW') {
      response = "I'm sensing there might be more going on than what you're saying. " + response;
    }

    // Add crisis support if needed
    if (congruence.requiresSpecialHandling) {
      response = "I want you to know you're safe here with me. " + response;
    }

    return {
      text: response,
      source: 'template',
      archetype: archetype?.type
    };
  }

  /**
   * Generate multiple response options
   */
  async generateOptions(analysis, count = 3) {
    const options = [];

    for (let i = 0; i < count; i++) {
      const response = await this.generateResponse(analysis);
      options.push(response);
    }

    return options;
  }

  /**
   * Get voice modulation parameters for TTS
   */
  getVoiceModulation(analysis) {
    const { archetype, congruence } = analysis;

    const base = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      style: 'conversational'
    };

    // Slow down and calm for crisis
    if (congruence.requiresSpecialHandling) {
      return {
        rate: 0.88,
        pitch: 0.95,
        volume: 0.95,
        style: 'calm'
      };
    }

    // Archetype-specific modulation
    const modulations = {
      'Seed': { rate: 0.95, pitch: 1.05, style: 'gentle' },
      'Mender': { rate: 0.90, pitch: 0.95, style: 'warm' },
      'Guardian': { rate: 1.0, pitch: 0.98, style: 'firm' },
      'Flamebearer': { rate: 1.05, pitch: 1.08, style: 'energetic' },
      'Guide': { rate: 0.92, pitch: 0.97, style: 'calm' }
    };

    const adjustment = modulations[archetype?.type] || {};
    return { ...base, ...adjustment };
  }
}
