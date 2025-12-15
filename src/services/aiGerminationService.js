/**
 * aiGerminationService.js
 * THE GOOSE - AI Germination System Phase 2
 * "The goose that lays golden eggs forever"
 *
 * Jack and the Beanstalk Style!
 * Each "golden egg" = personalized operational insights
 *
 * Phase 2: Claude API Integration for REAL AI-powered insights
 *
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 12, 2024
 */

import constitutionalPatterns from '../data/constitutionalPatterns.json';
import { claudeApiService } from './claudeApiService';
import {
  allPatterns,
  findSimilarPatterns,
  getRelevantPatternContext,
  calculateSimilarityScore
} from '../data/detailedPatterns/index.js';

/**
 * Main AI Germination Service
 * The "Goose" that lays golden eggs
 */
class AIGerminationService {

  /**
   * Analyze a user's constitution and generate insights
   * @param {Object} profile - User's profile data
   * @param {Object} options - Options for generation
   * @param {boolean} options.useClaudeAPI - Whether to use Claude API (default: true if configured)
   * @returns {Object} AI-generated insights and roadmap (the Golden Eggs!)
   */
  async germinateConstitution(profile, options = {}) {
    try {
      console.log('🌱 THE GOOSE: Starting germination for:', profile.displayName);

      // STEP 1: Plant the seed - Extract constitutional data
      const seed = this.extractConstitutionalSeed(profile);
      console.log('🫘 Seed planted:', seed);

      // STEP 2: Find matching pattern from our detailed patterns library
      const { matchedPattern, similarPatterns, patternContext } = this.findBestPattern(seed);
      console.log('🎯 Pattern match:', matchedPattern?.archetype || 'AI-only');

      // STEP 3: Determine if we should use Claude API
      const useClaudeAPI = options.useClaudeAPI !== false && claudeApiService.isConfigured();

      // STEP 4: Generate insights (AI-powered or template-based)
      let goldenEggs;

      if (useClaudeAPI && matchedPattern) {
        console.log('🚀 THE GOOSE: Using Claude API for personalized insights...');
        try {
          goldenEggs = await this.generateWithClaudeAPI(profile, seed, matchedPattern, patternContext);
        } catch (apiError) {
          console.warn('⚠️ Claude API failed, falling back to template:', apiError.message);
          goldenEggs = this.generateFromTemplate(seed, matchedPattern, profile);
        }
      } else if (matchedPattern) {
        console.log('📝 THE GOOSE: Using template-based generation...');
        goldenEggs = this.generateFromTemplate(seed, matchedPattern, profile);
      } else {
        console.log('🌱 THE GOOSE: Generating from constitutional principles...');
        goldenEggs = this.generateFromConstitutionalPrinciples(seed, profile);
      }

      console.log('🥚 THE GOOSE: Golden eggs generated!');
      return goldenEggs;

    } catch (error) {
      console.error('❌ THE GOOSE: Germination failed:', error);
      throw error;
    }
  }

  /**
   * Extract constitutional seed from profile
   * These are the "magic beans" we plant
   */
  extractConstitutionalSeed(profile) {
    // Get Chinese zodiac from profile
    const chineseZodiac = profile.chineseAnimal || profile.yearPillar?.animal || null;

    // Get element - try various sources
    const element = profile.dominantElement ||
                   profile.dayMaster?.element ||
                   profile.yearPillar?.element ||
                   null;

    // Get Yin/Yang
    const yinYang = profile.yinYang ||
                   profile.dayMaster?.yinYang ||
                   null;

    // Get Western zodiac
    const westernSign = profile.westernSign ||
                       profile.sunSign ||
                       this.calculateWesternSign(profile.birthDate);

    // Get MBTI
    const mbti = profile.mbtiType || null;

    // Calculate age
    const age = profile.birthDate ? this.calculateAge(profile.birthDate) : null;

    return {
      chineseZodiac,
      element,
      yinYang,
      westernSign,
      mbti,
      birthYear: profile.birthDate ? new Date(profile.birthDate).getFullYear() : null,
      age,
      // Additional data for AI analysis
      dayMaster: profile.dayMaster,
      fourPillars: profile.fourPillars,
      displayName: profile.displayName || profile.firstName
    };
  }

  /**
   * Calculate Western zodiac sign from birthdate
   */
  calculateWesternSign(birthDate) {
    if (!birthDate) return null;

    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const signs = [
      { sign: 'Capricorn', start: [1, 1], end: [1, 19] },
      { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
      { sign: 'Pisces', start: [2, 19], end: [3, 20] },
      { sign: 'Aries', start: [3, 21], end: [4, 19] },
      { sign: 'Taurus', start: [4, 20], end: [5, 20] },
      { sign: 'Gemini', start: [5, 21], end: [6, 20] },
      { sign: 'Cancer', start: [6, 21], end: [7, 22] },
      { sign: 'Leo', start: [7, 23], end: [8, 22] },
      { sign: 'Virgo', start: [8, 23], end: [9, 22] },
      { sign: 'Libra', start: [9, 23], end: [10, 22] },
      { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
      { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
      { sign: 'Capricorn', start: [12, 22], end: [12, 31] }
    ];

    for (const { sign, start, end } of signs) {
      if ((month === start[0] && day >= start[1]) ||
          (month === end[0] && day <= end[1])) {
        return sign;
      }
    }

    return 'Unknown';
  }

  /**
   * Find the best matching pattern from detailed patterns library
   * Uses similarity scoring to find the closest match
   */
  findBestPattern(seed) {
    // Build user constitution object for pattern matching
    const userConstitution = {
      element: seed.element,
      animal: seed.chineseZodiac,
      mbti: seed.mbti,
      western: seed.westernSign
    };

    // Find similar patterns using similarity scoring
    const similarPatterns = findSimilarPatterns(userConstitution, 3);

    // Get the best match (highest score)
    const bestMatch = similarPatterns[0];

    if (bestMatch && bestMatch.score > 0) {
      console.log(`✅ THE GOOSE: Best pattern match: ${bestMatch.pattern.archetype} (${bestMatch.score}% similarity)`);

      // Get context for Claude API (top 2 patterns)
      const { context } = getRelevantPatternContext(userConstitution);

      return {
        matchedPattern: bestMatch.pattern,
        similarPatterns,
        patternContext: context
      };
    }

    // No good match found - try legacy patterns from JSON
    console.log('⚠️ THE GOOSE: No detailed pattern match, trying legacy patterns...');
    const legacyPattern = this.findLegacyPattern(seed);

    if (legacyPattern) {
      return {
        matchedPattern: {
          id: legacyPattern.id,
          archetype: legacyPattern.archetype,
          constitution: legacyPattern.constitution,
          coreWisdom: JSON.stringify(legacyPattern),
          keyQuotes: []
        },
        similarPatterns: [],
        patternContext: JSON.stringify(legacyPattern, null, 2)
      };
    }

    return {
      matchedPattern: null,
      similarPatterns: [],
      patternContext: ''
    };
  }

  /**
   * Find matching pattern from legacy JSON library
   */
  findLegacyPattern(seed) {
    if (!seed.element || !seed.chineseZodiac || !seed.mbti || !seed.westernSign) {
      console.log('⚠️ THE GOOSE: Incomplete seed, using partial matching');
    }

    const patternId = `${seed.element?.toLowerCase()}-${seed.chineseZodiac?.toLowerCase()}-${seed.mbti?.toLowerCase()}-${seed.westernSign?.toLowerCase()}`;

    // Try exact match first
    const exactMatch = constitutionalPatterns.patterns.find(p => p.id === patternId);

    if (exactMatch) {
      console.log('✅ THE GOOSE: Exact legacy pattern match found:', patternId);
      return exactMatch;
    }

    // Try partial matching (Chinese zodiac + MBTI)
    if (seed.chineseZodiac && seed.mbti) {
      const partialMatch = constitutionalPatterns.patterns.find(p =>
        p.constitution.chineseZodiac?.toLowerCase() === seed.chineseZodiac?.toLowerCase() &&
        p.constitution.mbti?.toLowerCase() === seed.mbti?.toLowerCase()
      );

      if (partialMatch) {
        console.log('⚠️ THE GOOSE: Partial match (animal + MBTI):', partialMatch.id);
        return partialMatch;
      }
    }

    // Try matching just by Chinese zodiac
    if (seed.chineseZodiac) {
      const animalMatch = constitutionalPatterns.patterns.find(p =>
        p.constitution.chineseZodiac?.toLowerCase() === seed.chineseZodiac?.toLowerCase()
      );

      if (animalMatch) {
        console.log('⚠️ THE GOOSE: Animal-only match:', animalMatch.id);
        return animalMatch;
      }
    }

    // Try matching just by MBTI
    if (seed.mbti) {
      const mbtiMatch = constitutionalPatterns.patterns.find(p =>
        p.constitution.mbti?.toLowerCase() === seed.mbti?.toLowerCase()
      );

      if (mbtiMatch) {
        console.log('⚠️ THE GOOSE: MBTI-only match:', mbtiMatch.id);
        return mbtiMatch;
      }
    }

    console.log('⚠️ THE GOOSE: No pattern match, will use AI-only analysis');
    return null;
  }

  /**
   * Generate insights using Claude API
   * This is the REAL magic - personalized AI-powered insights!
   */
  async generateWithClaudeAPI(profile, seed, matchedPattern, patternContext) {
    // Prepare profile data for Claude
    const profileForClaude = {
      displayName: profile.displayName || profile.firstName || 'User',
      chineseZodiac: seed.chineseZodiac,
      element: seed.element,
      westernSign: seed.westernSign,
      westernZodiac: seed.westernSign,
      mbti: seed.mbti,
      dayMaster: seed.dayMaster?.stem || `${seed.yinYang} ${seed.element}`,
      yinYang: seed.yinYang
    };

    // Call Claude API
    const aiResponse = await claudeApiService.generateInsights(
      profileForClaude,
      patternContext,
      matchedPattern
    );

    // Return the AI-generated golden eggs
    return {
      seed,
      archetype: aiResponse.archetype || matchedPattern.archetype,
      archetypeDescription: aiResponse.archetypeDescription,
      operationalGuide: aiResponse.operationalGuide,
      successFactors: aiResponse.successFactors || [],
      challenges: aiResponse.challenges || [],
      roadmap: aiResponse.roadmap || {},
      examples: aiResponse.examples || [],
      generatedAt: aiResponse.generatedAt || new Date().toISOString(),
      version: '2.0',
      model: aiResponse.model || 'claude-sonnet-4',
      patternId: matchedPattern.id,
      patternMatch: 'ai-generated'
    };
  }

  /**
   * Generate from template (when Claude API not available)
   */
  generateFromTemplate(seed, matchedPattern, profile) {
    const name = profile.displayName || profile.firstName || 'you';

    return {
      seed,
      archetype: matchedPattern.archetype || this.generateArchetype(seed),
      operationalGuide: {
        thinkingStyle: {
          primary: this.extractThinkingStyle(matchedPattern),
          strength: this.extractStrength(matchedPattern)
        },
        workStyle: {
          optimal: this.extractWorkStyle(matchedPattern),
          productivity: `${seed.element || 'Natural'} rhythms with ${seed.mbti || 'cognitive'} focus`
        },
        leadershipStyle: {
          approach: this.extractLeadershipStyle(matchedPattern),
          communication: `${seed.element || 'Balanced'} style communication`
        }
      },
      successFactors: this.extractSuccessFactors(matchedPattern, seed),
      challenges: this.extractChallenges(matchedPattern, seed),
      roadmap: this.buildPersonalizedRoadmap(matchedPattern, profile, seed),
      examples: matchedPattern.keyQuotes ? [{ quotes: matchedPattern.keyQuotes }] : [],
      generatedAt: new Date().toISOString(),
      version: '1.0',
      patternId: matchedPattern.id,
      patternMatch: 'template'
    };
  }

  /**
   * Generate from constitutional principles (no pattern match)
   */
  generateFromConstitutionalPrinciples(seed, profile) {
    // Element-based characteristics
    const elementTraits = {
      Wood: {
        thinking: 'Growth-oriented strategic thinking',
        work: 'Patient development, spring activation',
        leadership: 'Nurturing, growth-focused',
        strengths: ['Long-term vision', 'Patient development', 'Natural growth'],
        challenges: ['Needs activation', 'Can over-plan', 'Requires support']
      },
      Fire: {
        thinking: 'Passionate, vision-driven',
        work: 'High energy, inspirational',
        leadership: 'Charismatic, transformational',
        strengths: ['Inspiration', 'Transformation', 'Energy activation'],
        challenges: ['Burnout risk', 'Patience', 'Sustained focus']
      },
      Earth: {
        thinking: 'Practical, grounded analysis',
        work: 'Steady, reliable, methodical',
        leadership: 'Stable, trustworthy',
        strengths: ['Reliability', 'Practical wisdom', 'Building foundations'],
        challenges: ['Resistance to change', 'Flexibility', 'Speed']
      },
      Metal: {
        thinking: 'Precise, analytical',
        work: 'Disciplined, excellence-focused',
        leadership: 'Clear standards, precision',
        strengths: ['Precision', 'Excellence', 'Cutting clarity'],
        challenges: ['Rigidity', 'Emotional expression', 'Flexibility']
      },
      Water: {
        thinking: 'Intuitive, flowing',
        work: 'Adaptable, depth-seeking',
        leadership: 'Wisdom-based, flowing',
        strengths: ['Intuition', 'Adaptability', 'Depth'],
        challenges: ['Direction', 'Boundaries', 'Focus']
      }
    };

    // MBTI-based characteristics
    const mbtiTraits = {
      INTJ: { style: 'Strategic architect', approach: 'Systems thinking' },
      INTP: { style: 'Analytical explorer', approach: 'Deep analysis' },
      ENTJ: { style: 'Commanding leader', approach: 'Strategic execution' },
      ENTP: { style: 'Innovative debater', approach: 'Idea generation' },
      INFJ: { style: 'Mystic counselor', approach: 'Deep insight' },
      INFP: { style: 'Idealistic healer', approach: 'Values-driven' },
      ENFJ: { style: 'Charismatic teacher', approach: 'Inspirational guidance' },
      ENFP: { style: 'Creative catalyst', approach: 'Possibility explosion' },
      ISTJ: { style: 'Reliable organizer', approach: 'Systematic execution' },
      ISFJ: { style: 'Caring protector', approach: 'Nurturing support' },
      ESTJ: { style: 'Efficient executor', approach: 'Practical management' },
      ESFJ: { style: 'Supportive harmonizer', approach: 'Social coordination' },
      ISTP: { style: 'Practical analyst', approach: 'Hands-on solving' },
      ISFP: { style: 'Gentle artisan', approach: 'Aesthetic creation' },
      ESTP: { style: 'Bold entrepreneur', approach: 'Action-driven' },
      ESFP: { style: 'Energetic performer', approach: 'Engaging presence' }
    };

    const element = seed.element || 'Earth';
    const mbti = seed.mbti || 'INTJ';

    const elemTraits = elementTraits[element] || elementTraits.Earth;
    const mbtiTrait = mbtiTraits[mbti] || mbtiTraits.INTJ;

    const archetype = this.generateArchetype(seed);

    return {
      seed,
      archetype,
      operationalGuide: {
        thinkingStyle: {
          primary: `${mbtiTrait.style} with ${element} energy`,
          strength: elemTraits.thinking
        },
        workStyle: {
          optimal: elemTraits.work,
          productivity: `${element} rhythms with ${mbti} focus`
        },
        leadershipStyle: {
          approach: elemTraits.leadership,
          communication: `${element} style communication`
        }
      },
      successFactors: [
        ...elemTraits.strengths,
        `${mbti} cognitive strengths`,
        `${seed.chineseZodiac || 'Zodiac'} natural gifts`
      ],
      challenges: [
        ...elemTraits.challenges,
        `${mbti} blind spots`,
        'Integration of opposing elements'
      ],
      roadmap: {
        immediate: [
          `Optimize your environment for ${elemTraits.work}`,
          `Practice ${mbtiTrait.approach}`,
          `Set up systems honoring your ${element} nature`,
          'Document your current operational patterns'
        ],
        shortTerm: [
          `Build on your strength: ${elemTraits.strengths[0]}`,
          'Form team with complementary elements',
          `Develop your ${elemTraits.leadership} style`,
          `Address challenge: ${elemTraits.challenges[0]}`
        ],
        longTerm: [
          `Master ${elemTraits.strengths[0]}`,
          `Overcome: ${elemTraits.challenges[0]}`,
          'Create legacy through your constitutional gifts',
          'Train others in your operational wisdom'
        ]
      },
      examples: [],
      generatedAt: new Date().toISOString(),
      version: '1.0',
      patternMatch: 'constitutional-principles'
    };
  }

  /**
   * Extract thinking style from pattern
   */
  extractThinkingStyle(pattern) {
    if (pattern.coreWisdom) {
      const match = pattern.coreWisdom.match(/THINKING STYLE[^:]*:\s*([^\n]+)/);
      if (match) return match[1].trim();
    }
    return `${pattern.constitution?.mbti || 'Strategic'} analytical approach`;
  }

  /**
   * Extract strength from pattern
   */
  extractStrength(pattern) {
    if (pattern.coreWisdom) {
      const match = pattern.coreWisdom.match(/strength[s]?[^:]*:\s*([^\n]+)/i);
      if (match) return match[1].trim();
    }
    return 'Natural pattern recognition and synthesis';
  }

  /**
   * Extract work style from pattern
   */
  extractWorkStyle(pattern) {
    if (pattern.coreWisdom) {
      const match = pattern.coreWisdom.match(/WORK STYLE[^:]*:\s*([^\n]+)/);
      if (match) return match[1].trim();
    }
    return 'Focused, deep work with strategic breaks';
  }

  /**
   * Extract leadership style from pattern
   */
  extractLeadershipStyle(pattern) {
    if (pattern.coreWisdom) {
      const match = pattern.coreWisdom.match(/LEADERSHIP STYLE[^:]*:\s*([^\n]+)/);
      if (match) return match[1].trim();
    }
    return 'Lead by example and vision';
  }

  /**
   * Extract success factors from pattern
   */
  extractSuccessFactors(pattern, seed) {
    if (pattern.coreWisdom) {
      const match = pattern.coreWisdom.match(/SUCCESS FACTORS[^:]*:\s*([\s\S]*?)(?=COMMON CHALLENGES|PERSONALIZED|$)/);
      if (match) {
        const factors = match[1].match(/\d+\.\s*[^-\n]+/g);
        if (factors) {
          return factors.map(f => f.replace(/^\d+\.\s*/, '').trim()).slice(0, 6);
        }
      }
    }
    return [
      `${seed.element || 'Elemental'} mastery`,
      `${seed.mbti || 'Cognitive'} strengths leveraged`,
      `${seed.chineseZodiac || 'Zodiac'} natural gifts`,
      'Strategic patience',
      'Authentic expression'
    ];
  }

  /**
   * Extract challenges from pattern
   */
  extractChallenges(pattern, seed) {
    if (pattern.coreWisdom) {
      const match = pattern.coreWisdom.match(/COMMON CHALLENGES[^:]*:\s*([\s\S]*?)(?=PERSONALIZED|THE #1|$)/);
      if (match) {
        const challenges = match[1].match(/\d+\.\s*[^-\n]+/g);
        if (challenges) {
          return challenges.map(c => c.replace(/^\d+\.\s*/, '').trim()).slice(0, 5);
        }
      }
    }
    return [
      'Energy management',
      'Balancing vision with execution',
      `${seed.element || 'Element'} shadow integration`,
      'Relationship dynamics',
      'Sustainable growth'
    ];
  }

  /**
   * Generate archetype name for unique constitutions
   */
  generateArchetype(seed) {
    const elementPrefixes = {
      Wood: 'Growing',
      Fire: 'Blazing',
      Earth: 'Grounded',
      Metal: 'Precise',
      Water: 'Flowing'
    };

    const mbtiTypes = {
      INTJ: 'Strategist',
      INTP: 'Analyst',
      ENTJ: 'Commander',
      ENTP: 'Innovator',
      INFJ: 'Counselor',
      INFP: 'Healer',
      ENFJ: 'Teacher',
      ENFP: 'Catalyst',
      ISTJ: 'Inspector',
      ISFJ: 'Protector',
      ESTJ: 'Supervisor',
      ESFJ: 'Provider',
      ISTP: 'Craftsman',
      ISFP: 'Artisan',
      ESTP: 'Promoter',
      ESFP: 'Performer'
    };

    const prefix = elementPrefixes[seed.element] || 'Unique';
    const type = mbtiTypes[seed.mbti] || 'Soul';
    const animal = seed.chineseZodiac || '';

    return `The ${prefix} ${animal} ${type}`.trim();
  }

  /**
   * Build personalized roadmap
   */
  buildPersonalizedRoadmap(pattern, profile, seed) {
    if (pattern.coreWisdom) {
      const immediateMatch = pattern.coreWisdom.match(/IMMEDIATE[^:]*:\s*([\s\S]*?)(?=SHORT-TERM|$)/);
      const shortTermMatch = pattern.coreWisdom.match(/SHORT-TERM[^:]*:\s*([\s\S]*?)(?=LONG-TERM|$)/);
      const longTermMatch = pattern.coreWisdom.match(/LONG-TERM[^:]*:\s*([\s\S]*?)(?=THE #1|$)/);

      const extractItems = (match) => {
        if (!match) return [];
        const items = match[1].match(/-\s*[^\n]+/g);
        return items ? items.map(i => i.replace(/^-\s*/, '').trim()) : [];
      };

      const immediate = extractItems(immediateMatch);
      const shortTerm = extractItems(shortTermMatch);
      const longTerm = extractItems(longTermMatch);

      if (immediate.length || shortTerm.length || longTerm.length) {
        return {
          immediate: immediate.length ? immediate : ['Start implementing your operational wisdom'],
          shortTerm: shortTerm.length ? shortTerm : ['Build momentum with aligned actions'],
          longTerm: longTerm.length ? longTerm : ['Achieve your constitutional potential']
        };
      }
    }

    // Generic roadmap
    const name = profile.displayName || profile.firstName || 'you';

    return {
      immediate: [
        `Optimize your environment for ${seed.element || 'peak'} energy`,
        'Practice your natural thinking style',
        'Set up systems honoring your rhythms',
        'Document your current operational patterns'
      ],
      shortTerm: [
        'Build on your core strengths',
        'Form team with complementary energies',
        'Develop your leadership approach',
        'Address your primary challenge area'
      ],
      longTerm: [
        'Achieve mastery in your primary domain',
        'Create lasting impact through your gifts',
        'Share your wisdom with others',
        'Build legacy that extends beyond you'
      ]
    };
  }

  /**
   * Calculate age from birth date
   */
  calculateAge(birthDate) {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Check if Claude API is available
   */
  isClaudeAPIAvailable() {
    return claudeApiService.isConfigured();
  }
}

// Export singleton instance
export const aiGerminationService = new AIGerminationService();
export default aiGerminationService;
