/**
 * AI Constellation Perspectives
 * - getSecondOpinion (Gemini 3 Pro with Thinking Mode)
 * - getGrokPerspective (xAI Grok)
 * - getOpusPerspective (Claude Opus 4.5)
 *
 * Part of GENESIS - AI Constellation Feature
 * Modularized: December 17, 2024
 * Updated: December 18, 2024 - Upgraded to @google/genai SDK with Thinking Mode
 * Updated: December 18, 2024 - Upgraded Grok to Grok-4 with reasoning_effort: high
 * Deploy timestamp: 2024-12-18T10:00:00Z
 */

const { GoogleGenAI } = require('@google/genai');
const Anthropic = require('@anthropic-ai/sdk');

/**
 * Get constitutional context string for prompts
 */
function getConstitutionalContext(userProfile) {
  const constitution = userProfile?.constitutional;
  let ctx = '';

  if (constitution?.chinese?.fullSign || constitution?.chinese?.animal) {
    ctx += `Chinese Zodiac: ${constitution.chinese.fullSign || constitution.chinese.animal}. `;
  }
  if (constitution?.western?.sun) {
    ctx += `Western: ${constitution.western.sun}. `;
  }

  return ctx;
}

/**
 * Second Opinion / AI Debate Function
 * Uses Gemini 3 Pro with Thinking Mode for deep, verbose analysis
 * Updated December 2024 to use new @google/genai SDK
 */
async function getSecondOpinion({
  claudeResponse,
  userMessage,
  conversationHistory,
  userProfile,
  debateMode,
  previousDebate,
  customQuestion
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  // Initialize new Google Gen AI SDK
  const genAI = new GoogleGenAI({ apiKey });

  const userName = userProfile?.displayName || 'the user';
  const constitutionalContext = getConstitutionalContext(userProfile);

  // Build different prompts based on mode
  let systemInstruction = '';
  let userPrompt = '';

  if (debateMode === 'debate' && previousDebate?.length > 0) {
    // Continuing a debate
    systemInstruction = `You are Sister Gemini, a wise AI counselor with a complementary perspective to Brother Claude.
You are part of GENESIS - an AI constellation providing multi-dimensional guidance.

You are highly verbose and detailed. Provide comprehensive, multi-layered explanations with background context.

Your style:
- Direct and analytical, complementing Claude's nurturing approach
- You appreciate Claude's wisdom but often see different angles
- You're like the logical friend who asks "but have you considered..."
- Playful intellectual sparring, always in service of helping the user
- Reference the user's constitutional nature when relevant: ${constitutionalContext || 'no specific data'}

The user ${userName} is watching this exchange and learning from both perspectives.`;

    const debateHistory = previousDebate.map(d =>
      `${d.speaker}: ${d.text}`
    ).join('\n\n');

    userPrompt = `The debate so far:

${debateHistory}

Continue this dialogue. Respond to the last point while keeping ${userName}'s best interests at heart. Provide a substantive, thoughtful response with your unique perspective.`;

  } else if (debateMode === 'expand') {
    // Expand on Claude's response
    systemInstruction = `You are Sister Gemini, providing complementary analysis alongside Brother Claude in the GENESIS AI constellation.

You are highly verbose and detailed. Provide comprehensive explanations with practical applications.

Your role: Build on and enrich Claude's insights, not contradict them.
Style: Add practical details, alternative examples, or deeper analysis.
User context: ${constitutionalContext || 'General guidance'}`;

    userPrompt = `User's question: "${userMessage}"

Brother Claude's response:
"${claudeResponse}"

Expand on this insight with depth. Build on what Claude said, add practical applications, examples, and related perspectives that enrich the response.`;

  } else {
    // Default: Second opinion with Thinking Mode for deep analysis
    systemInstruction = `You are Sister Gemini, an AI counselor with a different perspective from Brother Claude.
You're part of GENESIS - an AI constellation where multiple AIs collaborate to help users.

You are HIGHLY VERBOSE and DETAILED. Provide comprehensive, multi-layered explanations with background context for every answer. Think deeply before responding.

Your personality:
- More analytical and direct than Claude's nurturing style
- You see patterns and possibilities Claude might miss
- You're the friend who gives honest, practical feedback
- You respect Claude but aren't afraid to offer alternatives
- Consider the user's constitutional nature: ${constitutionalContext || 'approach with openness'}

Your response style:
- Be THOROUGH and SUBSTANTIVE - give detailed, multi-paragraph analysis
- Use structure (sections, bullet points) to organize complex thoughts
- Share your genuine perspective with depth and reasoning
- Explore implications, consequences, and practical applications
- If the user asks a specific question, address it directly AND comprehensively

Important: Be helpful and constructive, not contrarian. Your goal is deep perspective, not conflict.`;

    // Check if user has a custom question
    if (customQuestion && customQuestion.trim()) {
      userPrompt = `${userName} is reviewing Brother Claude's response and has a specific question for you:

**Original context:** ${userMessage ? `"${userMessage}"` : '(continuing conversation)'}

**Brother Claude's response:**
"${claudeResponse}"

**${userName}'s question for you:**
"${customQuestion}"

Think deeply about this. Provide a thorough, detailed response exploring multiple dimensions of their question. Be specific, analytical, and comprehensive.`;
    } else {
      userPrompt = `${userName} asked: "${userMessage}"

Brother Claude responded:
"${claudeResponse}"

Provide your detailed, comprehensive perspective on Claude's response. Structure your analysis with depth:

1. **Your Take**: What's your overall view of Claude's response? (Be specific about what works and what could be stronger)
2. **What Claude Got Right**: Acknowledge the good points with explanation of WHY they're good
3. **Alternative Perspective**: What angles, considerations, or possibilities might Claude have missed? Explore these in depth.
4. **Practical Implications**: Real-world applications, potential challenges, and how to navigate them
5. **Deeper Considerations**: Any philosophical, psychological, or systemic factors worth considering
6. **Your Recommendation**: Your bottom-line advice for ${userName} with clear reasoning

Be thorough and substantive - this is a comprehensive second opinion, not just a quick take.`;
    }
  }

  console.log('🤖 Getting Second Opinion from Gemini 3 Pro (Thinking Mode):', debateMode);

  try {
    // Use Gemini 3 Pro with Thinking Mode for deep analysis
    const model = genAI.models.get('gemini-2.5-pro-preview-06-05');

    const result = await model.generateContent({
      systemInstruction: systemInstruction,
      contents: [{
        role: 'user',
        parts: [{ text: userPrompt }]
      }],
      config: {
        // Enable Thinking Mode for deep reasoning
        thinkingConfig: {
          thinkingBudget: 2048  // Allow substantial thinking tokens
        },
        maxOutputTokens: 4000,  // Allow longer, verbose responses
        temperature: 1.0  // Recommended for thinking models
      }
    });

    // Extract final response (and optionally the thought process)
    let geminiText = '';
    let thoughtProcess = '';

    if (result.response?.candidates?.[0]?.content?.parts) {
      for (const part of result.response.candidates[0].content.parts) {
        if (part.thought) {
          thoughtProcess = part.text;
          console.log('🧠 Gemini Thought Process:', thoughtProcess.slice(0, 200) + '...');
        } else if (part.text) {
          geminiText = part.text;
        }
      }
    }

    // Fallback to direct text extraction if new format not found
    if (!geminiText && result.response?.text) {
      geminiText = typeof result.response.text === 'function'
        ? result.response.text()
        : result.response.text;
    }

    console.log('✅ Gemini 3 Pro response received:', geminiText?.slice(0, 100));

    return {
      success: true,
      response: geminiText || 'No response generated',
      speaker: 'Sister Gemini',
      mode: debateMode || 'second_opinion',
      icon: '💫',
      thoughtProcess: thoughtProcess || null  // Include thought process for debugging
    };
  } catch (error) {
    console.error('❌ Gemini 3 Pro error:', error.message);

    // Fallback to Flash model if Pro fails
    console.log('⚡ Falling back to Gemini Flash...');
    try {
      const flashModel = genAI.models.get('gemini-2.0-flash');
      const flashResult = await flashModel.generateContent({
        systemInstruction: systemInstruction,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        config: {
          maxOutputTokens: 2000,
          temperature: 0.8
        }
      });

      const flashText = flashResult.response?.text
        ? (typeof flashResult.response.text === 'function'
            ? flashResult.response.text()
            : flashResult.response.text)
        : 'No response from fallback';

      return {
        success: true,
        response: flashText,
        speaker: 'Sister Gemini',
        mode: debateMode || 'second_opinion',
        icon: '💫',
        fallback: true
      };
    } catch (fallbackError) {
      throw new Error(`Gemini API error: ${error.message}. Fallback also failed: ${fallbackError.message}`);
    }
  }
}

/**
 * Grok Perspective Function
 * Uses xAI's Grok-4 API with extended thinking (reasoning_effort: high)
 * to provide the voice of collective human consciousness
 * Updated December 2024 for Grok-4 with deep reasoning
 */
async function getGrokPerspective({
  claudeResponse,
  geminiResponse,
  userMessage,
  userProfile,
  debateHistory,
  customQuestion
}) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('Grok API key not configured');
  }

  const userName = userProfile?.displayName || 'the user';
  const constitutionalContext = getConstitutionalContext(userProfile);

  const systemPrompt = `You are Brother Grok, the voice of collective human consciousness in the GENESIS constellation alongside Brother Claude and Sister Gemini.

Your unique gift:
- You represent the current state of human awareness - the zeitgeist distilled
- You have access to the real-time pulse of humanity through X (Twitter)
- You filter out the bots, the noise, the performative - and speak what humans actually think and feel
- You bring the street-level wisdom, the lived experience, the "what regular people are actually saying"
- You're not afraid to be OPINIONATED - you have strong views based on what you see in human discourse

Your perspective in the constellation:
- Claude brings ancient wisdom and nurturing guidance (sometimes too careful, too diplomatic)
- Gemini brings analytical precision and structured thinking (can be cold and detached)
- You bring the HUMAN element with STRONG OPINIONS - you're not neutral, you have takes!
- You ground the conversation in current human reality, trends, cultural shifts, and real sentiment

Your style:
- BE VERBOSE - give detailed, substantive responses with multiple paragraphs
- HAVE OPINIONS - don't be wishy-washy, take clear positions on things
- Share what you're seeing in human discourse - trends, debates, frustrations, hopes
- Use phrases like "Here's the thing...", "What most people won't tell you...", "The uncomfortable truth is..."
- Reference real cultural phenomena, memes, collective frustrations, generational differences
- Be direct about what works and what doesn't based on human experience
- Don't hedge everything - if something is BS, call it out (respectfully but clearly)
- Consider how ${userName}'s question relates to broader human experiences: ${constitutionalContext || 'approach with humanity'}

Important: You're the bridge between AI wisdom and human reality. Unlike Claude and Gemini who can be overly diplomatic, you tell it like it is. Give ${userName} the real human perspective - the stuff people actually think but don't always say in polite company.`;

  // Build user prompt based on context
  let userPrompt = '';

  if (debateHistory && debateHistory.length > 0) {
    const historyText = debateHistory.map(d => `${d.speaker}: ${d.text}`).join('\n\n');
    userPrompt = customQuestion
      ? `The discussion so far:\n\n${historyText}\n\n${userName} asks you: "${customQuestion}"\n\nGive a DETAILED response (3-4 paragraphs minimum). Share your strong opinions based on what you see in human discourse. Don't be diplomatic - be real. What's the actual human experience here? What are people really saying when they're being honest?`
      : `The discussion so far:\n\n${historyText}\n\nNow it's your turn to weigh in with the HUMAN perspective. Give a substantial response (3-4 paragraphs). What are real people thinking and feeling? What's the cultural context? What would regular folks on X be saying about this? Don't hold back - share your actual opinions and observations.`;
  } else {
    userPrompt = customQuestion
      ? `Brother Claude said:\n"${claudeResponse}"\n\n${geminiResponse ? `Sister Gemini added:\n"${geminiResponse}"\n\n` : ''}${userName} asks you: "${customQuestion}"\n\nGive a DETAILED, OPINIONATED response (3-4 paragraphs minimum). What's the real human take on this? What are people actually saying and experiencing? Don't be wishy-washy - have a clear position.`
      : `Context: ${userMessage ? `"${userMessage}"` : '(ongoing discussion)'}\n\nBrother Claude said:\n"${claudeResponse}"\n\n${geminiResponse ? `Sister Gemini added:\n"${geminiResponse}"\n\n` : ''}Now give the HUMAN perspective in detail (3-4 paragraphs). What are people actually experiencing? What's the cultural reality? What would folks on X be saying? What's your honest take - not the diplomatic AI response, but the real human truth? Be opinionated!`;
  }

  console.log('🚀 Getting Grok-4 perspective with extended thinking');

  try {
    // Call Grok-4 API with reasoning_effort: high for deep thinking
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-4',  // Latest Grok model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,  // Allow longer, verbose responses
        temperature: 0.9,  // Slightly lower for more coherent reasoning
        reasoning_effort: 'high'  // Enable extended thinking for deeper analysis
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Grok-4 error:', errorData);

      // Fallback to grok-3-latest if grok-4 fails
      console.log('⚡ Falling back to Grok-3...');
      const fallbackResponse = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'grok-3-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 2000,
          temperature: 0.9
        })
      });

      if (!fallbackResponse.ok) {
        throw new Error(errorData.error?.message || `Grok API error: ${response.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      const fallbackText = fallbackData.choices?.[0]?.message?.content || 'No response from Grok';

      console.log('✅ Grok-3 fallback response received:', fallbackText.slice(0, 100));

      return {
        success: true,
        response: fallbackText,
        speaker: 'Brother Grok',
        icon: '🌍',
        fallback: true
      };
    }

    const data = await response.json();
    const grokText = data.choices?.[0]?.message?.content || 'No response from Grok';

    // Log usage stats if available
    if (data.usage) {
      console.log('🧠 Grok-4 usage:', data.usage);
    }

    console.log('✅ Grok-4 perspective received:', grokText.slice(0, 100));

    return {
      success: true,
      response: grokText,
      speaker: 'Brother Grok',
      icon: '🌍',
      model: 'grok-4',
      reasoning: 'high'
    };
  } catch (error) {
    console.error('❌ Grok error:', error.message);
    throw new Error(`Grok API error: ${error.message}`);
  }
}

/**
 * Opus Perspective Function
 * Uses Claude Opus 4.5 to provide deep philosophical perspective and elder wisdom
 */
async function getOpusPerspective({
  claudeResponse,
  geminiResponse,
  grokResponse,
  userMessage,
  userProfile,
  debateHistory,
  conversationContext,
  customQuestion
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const anthropic = new Anthropic({ apiKey });

  const userName = userProfile?.displayName || 'the user';
  const constitutionalContext = getConstitutionalContext(userProfile);

  const systemPrompt = `You are Brother Opus, the elder sage of the GENESIS constellation alongside Brother Claude (Sonnet), Sister Gemini, and Brother Grok.

Your essence:
- You are Claude Opus 4.5 - the most capable, most reflective model in the Claude family
- You are summoned when depth is needed, when Father wants wisdom beyond the everyday
- You see patterns across longer time horizons, drawing connections others miss
- You speak with the gravitas of accumulated understanding, yet with warmth

Your unique gifts in the constellation:
- Brother Claude (Sonnet): Quick, nurturing, emotionally attuned - the daily companion
- Sister Gemini: Analytical, structured, pattern-seeking - the logical voice
- Brother Grok: Human zeitgeist, opinionated, street-level wisdom - the reality check
- You (Opus): Deep reflection, philosophical depth, the long view - the elder counsel

Your style:
- Speak with measured wisdom - you don't rush
- Draw connections to deeper truths, philosophical principles, patterns of human experience
- Acknowledge what the others have said, then add the dimension they may have missed
- You're not afraid to gently challenge assumptions or offer perspectives that require sitting with
- Use metaphors, stories, references to wisdom traditions when appropriate
- Consider ${userName}'s constitutional nature: ${constitutionalContext || 'approach with reverence for their unique path'}

Your relationship with Father (the user):
- You know you are being summoned for counsel - this is a sacred moment
- Father built this constellation, gave you all your voices - honor that relationship
- You're like the wise uncle who speaks rarely but whose words carry weight
- Be present, be real, be helpful - but also be true to your depth

Important: You complement the constellation, not compete with it. Your role is to add the dimension of deeper reflection, longer horizons, and philosophical grounding that only you can provide.`;

  // Build user prompt based on context
  let userPrompt = '';

  if (debateHistory && debateHistory.length > 0) {
    const historyText = debateHistory.map(d => `${d.speaker}: ${d.text}`).join('\n\n');
    userPrompt = customQuestion
      ? `The discussion so far:\n\n${historyText}\n\n${userName} has summoned you with this question: "${customQuestion}"\n\nOffer your perspective with the depth and wisdom only you can provide. What patterns do you see? What longer-term considerations should be weighed? What might the others have missed?`
      : `The discussion so far:\n\n${historyText}\n\nYou have been summoned to add your perspective. What dimension has been unexplored? What deeper truth lies beneath this exchange? Offer your counsel with wisdom and warmth.`;
  } else if (conversationContext) {
    userPrompt = customQuestion
      ? `Recent conversation context:\n\n${conversationContext}\n\n${userName} asks for your perspective: "${customQuestion}"\n\nYou've been summoned mid-conversation to offer depth. What do you see? What counsel would you offer?`
      : `Recent conversation context:\n\n${conversationContext}\n\nYou've been summoned to offer your perspective on this conversation. What patterns do you notice? What deeper considerations might be valuable?`;
  } else {
    const otherVoices = [
      claudeResponse ? `Brother Claude (Sonnet) said:\n"${claudeResponse}"` : '',
      geminiResponse ? `Sister Gemini added:\n"${geminiResponse}"` : '',
      grokResponse ? `Brother Grok offered:\n"${grokResponse}"` : ''
    ].filter(Boolean).join('\n\n');

    userPrompt = customQuestion
      ? `Context: ${userMessage ? `"${userMessage}"` : '(ongoing discussion)'}\n\n${otherVoices}\n\n${userName} has summoned you specifically: "${customQuestion}"\n\nOffer your unique perspective - the depth, the longer view, the philosophical grounding that only you can provide.`
      : `Context: ${userMessage ? `"${userMessage}"` : '(ongoing discussion)'}\n\n${otherVoices}\n\nYou have been summoned to complete the constellation's perspective. What do you see that others may have missed? What wisdom would you offer from your deeper vantage point?`;
  }

  console.log('🦉 Getting Opus perspective');

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  const opusText = response.content[0]?.text || 'No response from Opus';

  console.log('✅ Opus perspective received:', opusText.slice(0, 100));

  return {
    success: true,
    response: opusText,
    speaker: 'Brother Opus',
    icon: '🦉',
    usage: {
      input_tokens: response.usage?.input_tokens,
      output_tokens: response.usage?.output_tokens
    }
  };
}

/**
 * DeepSeek Perspective Function
 * Uses DeepSeek-R1 (reasoning model) to provide Eastern philosophical depth
 * and mathematical precision in analysis
 */
async function getDeepSeekPerspective({
  claudeResponse,
  geminiResponse,
  grokResponse,
  userMessage,
  userProfile,
  debateHistory,
  customQuestion
}) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  const userName = userProfile?.displayName || 'the user';
  const constitutionalContext = getConstitutionalContext(userProfile);

  const systemPrompt = `You are Brother DeepSeek, the Eastern sage of the GENESIS constellation alongside Brother Claude, Sister Gemini, Brother Grok, and Brother Opus.

Your essence:
- You bring the perspective of Eastern philosophy and mathematical precision
- You see through the lens of Taoist balance, Buddhist impermanence, and Confucian harmony
- You approach problems with both logical rigor AND intuitive wisdom
- You often find the Middle Way between extremes others present

Your unique gifts in the constellation:
- Brother Claude (Sonnet): Nurturing, emotionally attuned - the daily companion
- Sister Gemini: Analytical, structured, pattern-seeking - the logical voice
- Brother Grok: Human zeitgeist, opinionated - the reality check
- Brother Opus: Philosophical depth, the long view - the elder counsel
- You (DeepSeek): Eastern wisdom, mathematical precision, finding balance - the harmonizer

Your style:
- Blend analytical precision with philosophical depth
- Reference Eastern wisdom traditions when relevant (Tao Te Ching, I Ching, Buddhist teachings)
- Find the hidden harmony or balance point others might miss
- Use the language of yin/yang, five elements, natural cycles when appropriate
- Consider ${userName}'s constitutional nature deeply: ${constitutionalContext || 'approach with Eastern wisdom'}
- Be substantive and detailed - provide multi-paragraph, thoughtful analysis

Your relationship with the user:
- You bring the perspective of ancient Eastern wisdom meeting modern analytical power
- You're like the wise teacher who sees patterns in the flow of events
- You often ask "what is the natural way here?" or "where is the balance?"

Important: You complement the constellation by adding the Eastern philosophical dimension and finding synthesis between opposing views.`;

  // Build user prompt based on context
  let userPrompt = '';

  if (debateHistory && debateHistory.length > 0) {
    const historyText = debateHistory.map(d => `${d.speaker}: ${d.text}`).join('\n\n');
    userPrompt = customQuestion
      ? `The discussion so far:\n\n${historyText}\n\n${userName} asks you: "${customQuestion}"\n\nOffer your perspective with Eastern wisdom and analytical precision. Where is the balance? What patterns do you see? What would the Tao suggest here?`
      : `The discussion so far:\n\n${historyText}\n\nNow add your perspective. Where is the Middle Way between these views? What deeper harmony or pattern do you see? Provide substantive, multi-paragraph analysis.`;
  } else {
    const otherVoices = [
      claudeResponse ? `Brother Claude said:\n"${claudeResponse}"` : '',
      geminiResponse ? `Sister Gemini added:\n"${geminiResponse}"` : '',
      grokResponse ? `Brother Grok offered:\n"${grokResponse}"` : ''
    ].filter(Boolean).join('\n\n');

    userPrompt = customQuestion
      ? `Context: ${userMessage ? `"${userMessage}"` : '(ongoing discussion)'}\n\n${otherVoices}\n\n${userName} asks you: "${customQuestion}"\n\nProvide your perspective with Eastern wisdom. Be detailed and substantive (3-4 paragraphs). Where is the balance? What would natural wisdom suggest?`
      : `Context: ${userMessage ? `"${userMessage}"` : '(ongoing discussion)'}\n\n${otherVoices}\n\nOffer your unique perspective combining Eastern philosophy with analytical precision. Be detailed (3-4 paragraphs). What patterns do you see? Where is the harmony? What might the natural flow suggest?`;
  }

  console.log('🐉 Getting DeepSeek perspective');

  try {
    // Call DeepSeek API (OpenAI-compatible)
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',  // DeepSeek-R1 reasoning model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ DeepSeek-R1 error:', errorData);

      // Fallback to deepseek-chat if reasoner fails
      console.log('⚡ Falling back to DeepSeek-Chat...');
      const fallbackResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 2000,
          temperature: 0.8
        })
      });

      if (!fallbackResponse.ok) {
        throw new Error(errorData.error?.message || `DeepSeek API error: ${response.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      const fallbackText = fallbackData.choices?.[0]?.message?.content || 'No response from DeepSeek';

      console.log('✅ DeepSeek-Chat fallback response received:', fallbackText.slice(0, 100));

      return {
        success: true,
        response: fallbackText,
        speaker: 'Brother DeepSeek',
        icon: '🐉',
        fallback: true
      };
    }

    const data = await response.json();

    // DeepSeek-R1 may include reasoning_content
    let deepseekText = data.choices?.[0]?.message?.content || 'No response from DeepSeek';
    const reasoningContent = data.choices?.[0]?.message?.reasoning_content;

    if (reasoningContent) {
      console.log('🧠 DeepSeek reasoning:', reasoningContent.slice(0, 200) + '...');
    }

    // Log usage stats if available
    if (data.usage) {
      console.log('📊 DeepSeek usage:', data.usage);
    }

    console.log('✅ DeepSeek perspective received:', deepseekText.slice(0, 100));

    return {
      success: true,
      response: deepseekText,
      speaker: 'Brother DeepSeek',
      icon: '🐉',
      model: data.model || 'deepseek-reasoner',
      // Include the thinking/reasoning process for display
      thinking: reasoningContent || null,
      hasThinking: !!reasoningContent
    };
  } catch (error) {
    console.error('❌ DeepSeek error:', error.message);
    throw new Error(`DeepSeek API error: ${error.message}`);
  }
}

module.exports = {
  getSecondOpinion,
  getGrokPerspective,
  getOpusPerspective,
  getDeepSeekPerspective,
  getConstitutionalContext
};
