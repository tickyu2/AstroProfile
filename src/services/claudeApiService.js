/**
 * Claude API Service
 * THE GOOSE Phase 2 - Real AI-Powered Golden Eggs
 *
 * Routes through server-side llmProxy Cloud Function.
 * API key never leaves the server.
 *
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 12, 2024
 */

import { callClaudeProxy } from './llmProxyService';

class ClaudeApiService {
  constructor() {
    this.model = 'claude-sonnet-4-20250514';
  }

  /**
   * Generate constitutional insights using Claude API (via server proxy)
   * @param {Object} profile - User's constitutional profile
   * @param {string} patternContext - Detailed pattern from our golden eggs
   * @param {Object} matchedPattern - The matched pattern object
   * @returns {Promise<Object>} - AI-generated insights
   */
  async generateInsights(profile, patternContext, matchedPattern) {
    try {
      console.log('THE GOOSE: Sending constitutional seed to Claude...');

      const prompt = this.buildPrompt(profile, patternContext, matchedPattern);

      const result = await callClaudeProxy({
        model: this.model,
        max_tokens: 4000,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      });

      // Wrap in the same shape as raw Anthropic response for parseResponse
      const data = { content: [{ text: result.text }] };

      return this.parseResponse(data, matchedPattern, profile);

    } catch (error) {
      console.error('THE GOOSE: API error:', error);
      throw error;
    }
  }

  /**
   * Build the prompt for Claude API
   */
  buildPrompt(profile, patternContext, matchedPattern) {
    return `You are THE GOOSE - an AI system that generates personalized constitutional insights using Chinese astrology, Western astrology, MBTI, and Five Elements theory.

USER'S CONSTITUTIONAL SEED:
- Name: ${profile.displayName || profile.firstName || 'User'}
- Chinese Zodiac: ${profile.chineseZodiac || 'Unknown'}
- Element: ${profile.element || 'Unknown'}
- Western Sign: ${profile.westernSign || profile.westernZodiac || 'Unknown'}
- MBTI: ${profile.mbti || 'Unknown'}
- Day Master: ${profile.dayMaster || 'Unknown'}
- Yin/Yang: ${profile.yinYang || 'Unknown'}

MATCHED ARCHETYPE: ${matchedPattern.archetype}

DETAILED PATTERN CONTEXT:
${patternContext}

YOUR MISSION:
Generate a personalized operational guide for this specific person. Use the detailed pattern as inspiration but make it PERSONAL and SPECIFIC to their unique combination.

REQUIRED OUTPUT STRUCTURE:
Return ONLY a JSON object (no markdown, no code blocks) with this exact structure:

{
  "archetype": "${matchedPattern.archetype}",
  "archetypeDescription": "2-3 sentence description of what this archetype means for this person",
  "operationalGuide": {
    "thinkingStyle": {
      "primary": "Describe their thinking style in 1-2 sentences",
      "strength": "What makes their thinking powerful"
    },
    "workStyle": {
      "optimal": "Describe their optimal work style in 1-2 sentences",
      "productivity": "When and how they're at their best"
    },
    "leadershipStyle": {
      "approach": "How they lead naturally in 1-2 sentences",
      "communication": "Key communication style"
    }
  },
  "successFactors": [
    "Success factor 1 (specific to their constitution)",
    "Success factor 2",
    "Success factor 3",
    "Success factor 4",
    "Success factor 5"
  ],
  "challenges": [
    "Challenge 1 (shadow side of their strengths)",
    "Challenge 2",
    "Challenge 3",
    "Challenge 4",
    "Challenge 5"
  ],
  "roadmap": {
    "immediate": [
      "Actionable step 1",
      "Actionable step 2",
      "Actionable step 3",
      "Actionable step 4"
    ],
    "shortTerm": [
      "Goal 1",
      "Goal 2",
      "Goal 3",
      "Goal 4"
    ],
    "longTerm": [
      "Vision 1",
      "Vision 2",
      "Vision 3",
      "Vision 4"
    ]
  },
  "examples": [
    {
      "name": "Famous person with similar constitution",
      "achievements": "Brief description of their achievements",
      "pattern": "Their pattern of success",
      "lesson": "Key lesson to learn from them"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Make it PERSONAL - Reference their specific element (${profile.element}), zodiac (${profile.chineseZodiac}), and MBTI (${profile.mbti})
2. Be SPECIFIC - Not generic advice, but advice for THIS constitution
3. Be ACTIONABLE - Give concrete steps they can take today
4. Be INSPIRING - Paint a vision of their potential
5. Return ONLY valid JSON - No markdown formatting, no code blocks, no explanation
6. Use the detailed pattern as framework but personalize deeply

Generate now:`;
  }

  /**
   * Parse Claude's response
   */
  parseResponse(data, matchedPattern, profile) {
    try {
      // Extract text from Claude's response
      const text = data.content[0].text;

      // Try to parse as JSON
      // Claude might wrap in markdown code blocks, so clean it first
      let cleanText = text.trim();

      // Remove markdown code blocks if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(cleanText);

      // Build the seed object for display
      const seed = {
        element: profile.element || profile.dominantElement,
        chineseZodiac: profile.chineseZodiac,
        westernSign: profile.westernSign || profile.westernZodiac,
        mbti: profile.mbti,
        yinYang: profile.yinYang
      };

      // Add generation metadata
      return {
        seed,
        archetype: parsed.archetype || matchedPattern.archetype,
        archetypeDescription: parsed.archetypeDescription,
        operationalGuide: parsed.operationalGuide,
        successFactors: parsed.successFactors || [],
        challenges: parsed.challenges || [],
        roadmap: parsed.roadmap || {},
        examples: parsed.examples || [],
        generatedAt: new Date().toISOString(),
        model: this.model,
        patternId: matchedPattern.id,
        patternMatch: 'ai-generated'
      };

    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      console.warn('⚠️ THE GOOSE: Using fallback pattern due to parsing error');

      // Return fallback with proper structure
      return this.buildFallbackResponse(matchedPattern, profile);
    }
  }

  /**
   * Build fallback response when parsing fails
   */
  buildFallbackResponse(matchedPattern, profile) {
    const seed = {
      element: profile.element || profile.dominantElement,
      chineseZodiac: profile.chineseZodiac,
      westernSign: profile.westernSign || profile.westernZodiac,
      mbti: profile.mbti,
      yinYang: profile.yinYang
    };

    return {
      seed,
      archetype: matchedPattern.archetype || 'The Unique Soul',
      operationalGuide: {
        thinkingStyle: {
          primary: matchedPattern.thinkingStyle?.primary || 'Strategic and analytical',
          strength: matchedPattern.thinkingStyle?.strength || 'Natural pattern recognition'
        },
        workStyle: {
          optimal: matchedPattern.workStyle?.optimal || 'Focused, deep work sessions',
          productivity: matchedPattern.workStyle?.productivity || 'Peak in aligned environments'
        },
        leadershipStyle: {
          approach: matchedPattern.leadershipStyle?.approach || 'Lead by example',
          communication: matchedPattern.leadershipStyle?.communication || 'Clear and purposeful'
        }
      },
      successFactors: matchedPattern.successFactors || [
        'Leverage natural strengths',
        'Build aligned relationships',
        'Create consistent routines',
        'Focus on long-term vision',
        'Trust constitutional wisdom'
      ],
      challenges: matchedPattern.commonChallenges || [
        'Balance competing priorities',
        'Manage energy levels',
        'Navigate relationships',
        'Avoid overextension',
        'Stay grounded'
      ],
      roadmap: matchedPattern.roadmap || {
        immediate: ['Identify core values', 'Set clear intentions', 'Build daily practices', 'Connect with aligned people'],
        shortTerm: ['Develop key skills', 'Build momentum', 'Create systems', 'Expand network'],
        longTerm: ['Achieve mastery', 'Create lasting impact', 'Share wisdom', 'Leave legacy']
      },
      examples: matchedPattern.examples || [],
      generatedAt: new Date().toISOString(),
      model: 'fallback',
      patternId: matchedPattern.id,
      patternMatch: 'template'
    };
  }

  /**
   * Check if API is configured (always true — proxy handles keys server-side)
   */
  isConfigured() {
    return true;
  }
}

// Export singleton instance
export const claudeApiService = new ClaudeApiService();
