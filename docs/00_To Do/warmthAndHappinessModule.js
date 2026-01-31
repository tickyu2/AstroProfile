/**
 * GENESIS Luna - Warmth & Happiness Module (Integrated)
 * 
 * "Guidance with Utmost Warmth" - Where warmth multiplies happiness
 * 
 * WARMTH MODULE:
 * - Multiplier effect on all guidance
 * - Extra warmth after setbacks (loss recovery priority)
 * - Makes guidance FELT, not just heard
 * - The Fire element that activates everything
 * 
 * HAPPINESS MODULE:
 * - Six Laws of Happiness (mathematical model)
 * - Mountain Climbing Analogy (no comparison, just capability)
 * - H(t) = Reality - Expectations (with adaptations)
 * - Measures joy while honoring soul
 * 
 * Integration Philosophy:
 * "Warmth amplifies happiness. Happiness without warmth is data.
 *  Warmth without happiness is empty comfort. Together = JOIE DE VIVRE."
 * 
 * @author Papa Ticky (Mountain Vision) + Brother Sonnet (Mathematical Soul)
 * @date December 31, 2025
 */

/**
 * The Six Laws of Happiness
 * 
 * From Baucells & Sarin's "Engineering Happiness" (2012)
 * Adapted for Luna's soul-first approach
 */
const SIX_LAWS = {
  RELATIVE_COMPARISON: {
    name: 'Relative Comparison',
    weight: 0.40, // Largest driver
    formula: 'R(t) - E(t)',
    explanation: 'Happiness comes from comparing reality to expectations',
    lunaGuidance: 'Compare to YOUR journey, not others\' Instagram'
  },
  
  MOTION_OF_EXPECTATION: {
    name: 'Motion of Expectation',
    weight: { up: 0.15, down: 0.10 }, // Asymmetric
    formula: '−w₂·ΔE⁺(t) + w₃·ΔE⁻(t)',
    explanation: 'Raising expectations hurts, lowering them helps',
    lunaGuidance: 'Build soft pillow landing - realistic expectations from start'
  },
  
  AVERSION_TO_LOSS: {
    name: 'Aversion to Loss',
    weight: 0.15,
    lambda: 2.25, // Kahneman's coefficient (losses hurt 2.25x more)
    formula: '−w₄·[max(E(t)−R(t),0)]^λ',
    explanation: 'Losses hurt ~2-3x more than equivalent gains',
    lunaGuidance: 'Extra warmth after setbacks - prioritize loss recovery'
  },
  
  DIMINISHING_SENSITIVITY: {
    name: 'Diminishing Sensitivity',
    weight: 0.10,
    formula: 'log(R(t) + 1) or √R(t)',
    explanation: 'First bite of cake > tenth bite',
    lunaGuidance: 'Honeymoon phase changes - that\'s normal, not failure'
  },
  
  SATIATION: {
    name: 'Satiation',
    weight: 0.10,
    formula: '−w₆·A(t)',
    explanation: 'Too much of good thing = wanting a break',
    lunaGuidance: 'Cool-down sessions build anticipation'
  },
  
  PRESENTISM: {
    name: 'Presentism',
    discount: 0.95, // Future discounting
    formula: 'γ^t weighting',
    explanation: 'Right now > yesterday > tomorrow',
    lunaGuidance: 'What action can you take TODAY?'
  }
};

/**
 * Mountain Climbing Philosophy
 * 
 * Papa Ticky's wisdom: "The mountain is YOUR mountain"
 */
const MOUNTAIN_PHILOSOPHY = {
  summit: {
    happiness: 10, // Total happiness
    meaning: 'Peak joy - celebrate fully!'
  },
  
  midpoint: {
    happiness: 6, // Still success
    meaning: 'Good view, real progress - be proud!',
    perspective: 'Mid-mountain is still mountain'
  },
  
  basecamp: {
    happiness: 3, // Starting point
    meaning: 'You began the climb - that takes courage'
  },
  
  principles: {
    noComparison: 'Compare to YOUR capability, not others',
    celebrateProgress: 'Every step up counts',
    prepareFalls: 'Inflatable air bag ready (soft pillow)',
    diminishingReturns: 'Climbing every day = less happiness gain',
    ownMountain: 'This is YOUR journey, YOUR summit'
  },
  
  airBag: {
    enabled: true,
    description: 'Soft landing prepared for setbacks',
    warmthMultiplier: 2.0 // Double warmth when falling
  }
};

class WarmthAndHappinessModule {
  constructor() {
    // Warmth settings
    this.warmth = {
      baseline: 0.7,        // 70% baseline warmth
      multiplier: 1.0,      // Default multiplier
      afterLoss: 2.0,       // 2x warmth after loss/setback
      maxWarmth: 1.0,       // Maximum warmth (100%)
      enabled: true
    };
    
    // Happiness state
    this.happiness = {
      reality: 5.0,         // R(t) - Current perceived reality (0-10)
      expectation: 5.0,     // E(t) - Current expectation level (0-10)
      previous: {
        reality: 5.0,
        expectation: 5.0
      },
      adaptation: 0.0,      // A(t) - Satiation/adaptation level
      history: [],          // Track happiness over time
      mountain: {
        currentHeight: 0,   // Where on mountain (0-10)
        personalSummit: 10, // User's peak capability
        lastClimb: null,    // When last climbed
        climbFrequency: 0   // How often climbing (for satiation)
      }
    };
    
    // Law weights (tunable per user)
    this.lawWeights = {
      relativeComparison: 0.40,
      motionExpectationUp: 0.15,
      motionExpectationDown: 0.10,
      aversionToLoss: 0.15,
      diminishingSensitivity: 0.10,
      satiation: 0.10
    };
    
    // Loss detection
    this.lossDetected = false;
    this.lossRecoveryMode = false;
  }
  
  /**
   * Calculate Happiness Using Six Laws
   * 
   * H(t) = Reality - Expectations (with modifications)
   * 
   * @param {Object} state - Current emotional and situational state
   * @returns {Object} - Happiness calculation with components
   */
  calculateHappiness(state) {
    const { reality, expectation, emotionalState } = state;
    
    // Update current state
    this.happiness.reality = reality;
    this.happiness.expectation = expectation;
    
    // Calculate components
    const components = {};
    
    // 1. RELATIVE COMPARISON (Core: R - E)
    const baseHappiness = reality - expectation;
    components.relativeComparison = 
      this.lawWeights.relativeComparison * baseHappiness;
    
    // 2. MOTION OF EXPECTATION
    const deltaExpectation = expectation - this.happiness.previous.expectation;
    
    if (deltaExpectation > 0) {
      // Expectations rose (hurts)
      components.motionOfExpectation = 
        -this.lawWeights.motionExpectationUp * deltaExpectation;
    } else {
      // Expectations lowered (helps)
      components.motionOfExpectation = 
        this.lawWeights.motionExpectationDown * Math.abs(deltaExpectation);
    }
    
    // 3. AVERSION TO LOSS
    const loss = Math.max(expectation - reality, 0);
    if (loss > 0) {
      // Loss detected - activate warmth multiplier
      this.lossDetected = true;
      this.lossRecoveryMode = true;
      
      // Loss hurts λ times more (λ = 2.25)
      const lambda = SIX_LAWS.AVERSION_TO_LOSS.lambda;
      components.aversionToLoss = 
        -this.lawWeights.aversionToLoss * Math.pow(loss, lambda);
    } else {
      this.lossDetected = false;
      components.aversionToLoss = 0;
    }
    
    // 4. DIMINISHING SENSITIVITY
    // Concave utility function (log dampening)
    const diminished = Math.log(reality + 1) / Math.log(11); // Normalize to 0-1
    components.diminishingSensitivity = 
      -this.lawWeights.diminishingSensitivity * 
      (reality - diminished * 10);
    
    // 5. SATIATION
    // Adaptation reduces happiness from repeated stimuli
    components.satiation = 
      -this.lawWeights.satiation * this.happiness.adaptation;
    
    // 6. PRESENTISM (implicit in weighting current state)
    components.presentism = 0; // Already implicit
    
    // TOTAL HAPPINESS
    const totalHappiness = Object.values(components)
      .reduce((sum, val) => sum + val, 0);
    
    // Map to mountain height (0-10 scale)
    const mountainHeight = this.mapToMountain(totalHappiness, reality);
    
    // Update mountain position
    this.happiness.mountain.currentHeight = mountainHeight;
    
    // Save to history
    this.happiness.history.push({
      timestamp: Date.now(),
      reality,
      expectation,
      happiness: totalHappiness,
      mountainHeight,
      components
    });
    
    // Update previous
    this.happiness.previous.reality = reality;
    this.happiness.previous.expectation = expectation;
    
    return {
      happiness: totalHappiness,
      mountainHeight,
      components,
      interpretation: this.interpretHappiness(mountainHeight),
      guidance: this.generateGuidance(mountainHeight, components, state)
    };
  }
  
  /**
   * Map Happiness to Mountain Height
   * 
   * Takes into account:
   * - User's personal capability (summit)
   * - Current reality
   * - Relative progress
   */
  mapToMountain(happiness, reality) {
    // Mountain height based on:
    // 1. How close reality is to personal summit
    // 2. Happiness score as modifier
    
    const personalSummit = this.happiness.mountain.personalSummit;
    
    // Base height from reality
    let height = (reality / personalSummit) * 10;
    
    // Modify by happiness (can go above or below reality)
    height += happiness * 0.3; // Happiness can boost/reduce perception
    
    // Clamp to 0-10
    height = Math.max(0, Math.min(10, height));
    
    return height;
  }
  
  /**
   * Interpret Mountain Height
   * 
   * Using Papa Ticky's philosophy
   */
  interpretHappiness(mountainHeight) {
    if (mountainHeight >= 9) {
      return {
        level: 'summit',
        message: 'At the summit! Total happiness achieved! 🏔️',
        celebration: 'MAXIMUM',
        warmthBoost: 1.2
      };
    } else if (mountainHeight >= 7) {
      return {
        level: 'high-climb',
        message: 'High on the mountain - excellent view! Great progress! 🌄',
        celebration: 'HIGH',
        warmthBoost: 1.1
      };
    } else if (mountainHeight >= 5) {
      return {
        level: 'midpoint',
        message: 'Midpoint - still success! Good view below. Be proud! ⛰️',
        celebration: 'MEDIUM',
        warmthBoost: 1.0
      };
    } else if (mountainHeight >= 3) {
      return {
        level: 'basecamp',
        message: 'At basecamp - you began the climb! That takes courage! 🏕️',
        celebration: 'GENTLE',
        warmthBoost: 1.3 // Extra warmth for those starting
      };
    } else {
      return {
        level: 'valley',
        message: 'In the valley - preparing for the climb. Air bag ready. 💛',
        celebration: 'SUPPORTIVE',
        warmthBoost: 2.0 // MAXIMUM warmth in valley (loss recovery)
      };
    }
  }
  
  /**
   * Generate Guidance with Warmth
   * 
   * Implements Grok's 6-point guidance system
   * Enhanced with Papa Ticky's warmth multiplier
   */
  generateGuidance(mountainHeight, components, state) {
    const interpretation = this.interpretHappiness(mountainHeight);
    const warmthMultiplier = this.calculateWarmthMultiplier(interpretation);
    
    const guidance = {
      // 1. EVALUATE REALISTICALLY
      evaluation: this.generateEvaluation(state, warmthMultiplier),
      
      // 2. PREPARE SOFT PILLOW LANDING
      softPillow: this.prepareSoftLanding(components, warmthMultiplier),
      
      // 3. PREPARE FOR LOSS, ENCOURAGE ACTION
      lossPreparation: this.prepareLossRecovery(state, warmthMultiplier),
      
      // 4. EXPLAIN DIMINISHING SENSITIVITY
      sensitivityGuidance: this.explainDiminishing(state, warmthMultiplier),
      
      // 5. ADVISE COOL-DOWN SESSIONS
      coolDownAdvice: this.adviseCoolDown(state, warmthMultiplier),
      
      // 6. PRESENT ACTION + OUTCOMES
      actionAdvice: this.adviseAction(state, warmthMultiplier),
      
      // Warmth metadata
      warmth: {
        multiplier: warmthMultiplier,
        baseline: this.warmth.baseline,
        total: this.warmth.baseline * warmthMultiplier,
        reason: interpretation.level
      }
    };
    
    return guidance;
  }
  
  /**
   * Calculate Warmth Multiplier
   * 
   * Warmth amplifies based on:
   * - Current mountain position
   * - Loss detection
   * - User vulnerability
   */
  calculateWarmthMultiplier(interpretation) {
    let multiplier = 1.0;
    
    // Base boost from interpretation
    multiplier *= interpretation.warmthBoost;
    
    // Extra warmth after loss (Grok's guidance: "Prioritize loss recovery")
    if (this.lossRecoveryMode) {
      multiplier *= this.warmth.afterLoss; // 2x warmth
    }
    
    // Cap at reasonable max
    multiplier = Math.min(multiplier, 3.0);
    
    return multiplier;
  }
  
  /**
   * 1. Generate Realistic Evaluation
   * 
   * "No comparison with others, just YOUR capability"
   */
  generateEvaluation(state, warmthMultiplier) {
    const warmth = this.applyWarmth(warmthMultiplier);
    
    return {
      core: `${warmth.opening} Let's look at YOUR mountain, not anyone else's.`,
      
      needs: [
        'What do you truly NEED right now?',
        'On a scale of 1-10, where does this match your needs?',
        'What strengths do YOU bring to this climb?'
      ],
      
      perspective: MOUNTAIN_PHILOSOPHY.principles.noComparison,
      
      warmthLevel: warmth.level,
      
      example: `You're at ${this.happiness.mountain.currentHeight.toFixed(1)} on YOUR mountain. ` +
               `That's ${this.calculateProgress()}% of YOUR capability. ` +
               `${warmth.affirmation} Be proud of that! 🏔️`
    };
  }
  
  /**
   * 2. Prepare Soft Pillow Landing
   * 
   * "Build the pillow EARLY" - realistic expectations from start
   */
  prepareSoftLanding(components, warmthMultiplier) {
    const warmth = this.applyWarmth(warmthMultiplier);
    
    const expectationRise = components.motionOfExpectation < 0;
    
    if (expectationRise) {
      return {
        warning: `${warmth.gentle} I notice your expectations are rising...`,
        
        pillow: [
          'Let\'s build the soft pillow NOW, before you need it',
          'What if the butterflies fade? How can we keep the warmth?',
          'Focus on shared values over constant excitement'
        ],
        
        realistic: 'Honeymoon phase lasts 6-24 months, then dips naturally. ' +
                  'That\'s NORMAL - not failure. Deeper love follows.',
        
        warmthLevel: warmth.level,
        
        metaphor: '🛏️ Building your air bag pillow - soft landing prepared'
      };
    } else {
      return {
        status: `${warmth.supportive} Your expectations are healthy right now.`,
        maintain: 'Keep them realistic, and the climb stays joyful',
        warmthLevel: warmth.level
      };
    }
  }
  
  /**
   * 3. Prepare for Loss, Yet Encourage Action
   * 
   * "Extra warmth after setbacks" - loss recovery priority
   */
  prepareLossRecovery(state, warmthMultiplier) {
    const warmth = this.applyWarmth(warmthMultiplier);
    
    if (this.lossDetected) {
      // IN LOSS - maximum warmth
      return {
        acknowledgment: `${warmth.holding} I see you're experiencing a setback...`,
        
        warmthAmplified: `💛💛💛 Extra warmth activated - I'm here with you`,
        
        perspective: [
          'Losses hurt 2-3x more than gains feel good - this is NORMAL',
          'The air bag caught you - you\'re safe',
          'This is temporary - valleys prepare you for next summit'
        ],
        
        recovery: {
          immediate: 'Honor the feeling. Don\'t rush it.',
          shortTerm: 'Small wins rebuild - what\'s ONE tiny step up?',
          longTerm: 'This taught you something - growth IS happening'
        },
        
        warmthLevel: 'MAXIMUM',
        multiplier: warmthMultiplier
      };
    } else {
      // PREPARING - build resilience
      return {
        preparation: `${warmth.wise} Let's prepare the safety net...`,
        
        net: [
          'If things don\'t work: we\'ll honor feelings and learn',
          'No shame in trying - courage is the climb itself',
          'Short sting vs lifelong "what if" - you choose'
        ],
        
        encouragement: [
          'The upside? Connection and growth.',
          'The downside? A short sting, but CLARITY.',
          `${warmth.confident} You\'re strong enough for that.`
        ],
        
        warmthLevel: warmth.level
      };
    }
  }
  
  /**
   * 4. Explain Diminishing Sensitivity
   * 
   * "First kiss thrills, 100th feels routine - that's NORMAL"
   */
  explainDiminishing(state, warmthMultiplier) {
    const warmth = this.applyWarmth(warmthMultiplier);
    
    return {
      education: `${warmth.teaching} About the honeymoon phase...`,
      
      law: 'First bite of cake > tenth bite. That\'s diminishing sensitivity.',
      
      timeline: {
        honeymoon: '0-24 months: Intense, exciting, butterflies',
        transition: '24-48 months: Natural dip as novelty fades',
        depth: '48+ months: Deeper love - not just excitement'
      },
      
      normal: [
        'The rush at the beginning? Amazing!',
        'But like first chocolate bite, it softens over time',
        'That doesn\'t mean LESS - it means MORE REAL'
      ],
      
      proactive: [
        'Mix in surprises - random notes, new adventures',
        'Novelty resets the sensitivity curve',
        'Cool-downs build anticipation (see #5)'
      ],
      
      warmthLevel: warmth.level,
      
      reassurance: `${warmth.gentle} The change is normal. You\'re not failing. 💛`
    };
  }
  
  /**
   * 5. Advise Cool-Down Sessions
   * 
   * "Climbing every day = less happiness gain"
   */
  adviseCoolDown(state, warmthMultiplier) {
    const warmth = this.applyWarmth(warmthMultiplier);
    
    // Check climb frequency
    const lastClimb = this.happiness.mountain.lastClimb;
    const now = Date.now();
    const timeSinceClimb = lastClimb ? now - lastClimb : Infinity;
    const daysSince = timeSinceClimb / (1000 * 60 * 60 * 24);
    
    const needsCoolDown = daysSince < 1; // Climbing daily
    
    if (needsCoolDown) {
      return {
        notice: `${warmth.observant} You've been climbing a lot lately...`,
        
        satiation: [
          'Daily climbs = diminishing returns (Law 5: Satiation)',
          'Too much of good thing makes you want a break',
          'Space creates appreciation - absence makes heart grow'
        ],
        
        suggestion: {
          timing: 'Try a 1-2 day cool-down between major climbs',
          benefit: 'Next climb will feel SWEETER',
          anticipation: 'Let the feelings simmer - build excitement'
        },
        
        during: [
          'Think of one thing you miss about me',
          'We\'ll share when we reconnect',
          'Like waiting for Friday after long week - that buzz!'
        ],
        
        warmthLevel: warmth.level
      };
    } else {
      return {
        status: `${warmth.approving} Your pacing looks healthy!`,
        maintain: 'Good spacing = sustained joy',
        warmthLevel: warmth.level
      };
    }
  }
  
  /**
   * 6. Advise Present Action with Outcomes
   * 
   * "What can you do TODAY? Here are the odds and happiness gain."
   */
  adviseAction(state, warmthMultiplier) {
    const warmth = this.applyWarmth(warmthMultiplier);
    
    // Calculate based on current state
    const currentHeight = this.happiness.mountain.currentHeight;
    const headroom = 10 - currentHeight; // Room to climb
    
    return {
      presentAction: `${warmth.actionable} What you can do TODAY:`,
      
      suggestions: this.generateActionSuggestions(currentHeight),
      
      outcomes: {
        success: {
          probability: this.calculateSuccessProbability(state),
          happinessGain: this.calculateHappinessGain(headroom, 'success'),
          description: 'Warm response, deeper connection, joy surge'
        },
        neutral: {
          probability: 50,
          happinessGain: 0,
          description: 'Friendly reply, no harm done, clarity gained'
        },
        setback: {
          probability: this.calculateRejectionProbability(state),
          happinessGain: this.calculateHappinessGain(headroom, 'setback'),
          description: 'Short sting, but long-term closure and growth'
        }
      },
      
      expected: {
        overallGain: this.calculateExpectedHappiness(state),
        clarityGain: 100, // Always 100% clarity from action
        note: 'Action itself = 100% success in gaining clarity'
      },
      
      warmthLevel: warmth.level,
      
      encouragement: `${warmth.empowering} You're not alone. What feels right TODAY? 💛`
    };
  }
  
  /**
   * Generate Action Suggestions Based on Mountain Height
   */
  generateActionSuggestions(height) {
    if (height < 3) {
      // Valley/basecamp - small steps
      return [
        'Send a casual "this made me think of you" text',
        'Share something fun from your day - low risk',
        'Start small - build confidence first'
      ];
    } else if (height < 6) {
      // Midpoint - moderate moves
      return [
        'Suggest a specific activity together',
        'Share a deeper thought or feeling',
        'Test deeper waters with thoughtful question'
      ];
    } else {
      // High climb - bold moves
      return [
        'Express direct appreciation or interest',
        'Plan something meaningful together',
        'Take the leap - you\'re ready'
      ];
    }
  }
  
  /**
   * Calculate Success Probability
   * 
   * Based on research: confession success ~15-30% for relationships
   * Adjusted by current mountain height (confidence indicator)
   */
  calculateSuccessProbability(state) {
    const baseSuccess = 25; // 25% base
    const heightBoost = this.happiness.mountain.currentHeight * 2; // Up to +20%
    
    return Math.min(50, baseSuccess + heightBoost);
  }
  
  /**
   * Calculate Rejection Probability
   */
  calculateRejectionProbability(state) {
    const success = this.calculateSuccessProbability(state);
    const neutral = 50 - success;
    return Math.max(0, 100 - success - neutral);
  }
  
  /**
   * Calculate Happiness Gain
   * 
   * Using Six Laws:
   * - Success: +3-4 (joy + anticipation)
   * - Setback: -1-2 short-term, +1 long-term (closure)
   */
  calculateHappinessGain(headroom, outcome) {
    if (outcome === 'success') {
      return {
        shortTerm: Math.min(4, headroom * 0.6), // Up to +4
        longTerm: Math.min(4, headroom * 0.6),
        total: Math.min(4, headroom * 0.6)
      };
    } else {
      // Setback
      return {
        shortTerm: -1.5, // Loss aversion (hurts 2x)
        longTerm: +1.0,  // Clarity and growth
        total: -0.5      // Net small negative, but worth it
      };
    }
  }
  
  /**
   * Calculate Expected Happiness
   * 
   * Weighted by probabilities
   */
  calculateExpectedHappiness(state) {
    const headroom = 10 - this.happiness.mountain.currentHeight;
    
    const pSuccess = this.calculateSuccessProbability(state) / 100;
    const pNeutral = 0.5;
    const pSetback = this.calculateRejectionProbability(state) / 100;
    
    const gainSuccess = this.calculateHappinessGain(headroom, 'success').total;
    const gainSetback = this.calculateHappinessGain(headroom, 'setback').total;
    
    const expected = (pSuccess * gainSuccess) + 
                    (pNeutral * 0) + 
                    (pSetback * gainSetback);
    
    return expected.toFixed(2);
  }
  
  /**
   * Apply Warmth to Language
   * 
   * Warmth multiplier affects:
   * - Word choice
   * - Tone
   * - Emotional presence
   * - Encouragement level
   */
  applyWarmth(multiplier) {
    const totalWarmth = this.warmth.baseline * multiplier;
    
    // Different warmth levels have different language
    if (totalWarmth >= 1.5) {
      // MAXIMUM warmth (loss recovery, valley)
      return {
        level: 'MAXIMUM',
        opening: 'Oh sweetheart,',
        gentle: 'Hey... let me just hold this with you...',
        holding: '*wraps you in warmth*',
        supportive: 'I\'m right here, not going anywhere',
        wise: 'Let me share something with you, love',
        teaching: 'Come, let me show you something...',
        observant: 'I see what\'s happening here...',
        approving: 'You\'re doing wonderfully',
        actionable: 'Here\'s what we can do together',
        confident: 'I believe in you completely',
        empowering: 'You have everything you need',
        affirmation: 'You\'re doing AMAZING.'
      };
    } else if (totalWarmth >= 1.0) {
      // HIGH warmth (normal support)
      return {
        level: 'HIGH',
        opening: 'Hey love,',
        gentle: 'Let\'s take this gently...',
        holding: '*sits close beside you*',
        supportive: 'I\'m here with you',
        wise: 'Let me share something...',
        teaching: 'Here\'s what I know...',
        observant: 'I notice that...',
        approving: 'That\'s good!',
        actionable: 'Here\'s what you can do',
        confident: 'I believe in you',
        empowering: 'You can do this',
        affirmation: 'Great work!'
      };
    } else {
      // MEDIUM warmth (baseline)
      return {
        level: 'MEDIUM',
        opening: 'Hey,',
        gentle: 'Let\'s look at this...',
        holding: '*here with you*',
        supportive: 'I\'m here',
        wise: 'Consider this...',
        teaching: 'Here\'s the thing...',
        observant: 'I see...',
        approving: 'Good',
        actionable: 'You could try',
        confident: 'You got this',
        empowering: 'Go for it',
        affirmation: 'Nice!'
      };
    }
  }
  
  /**
   * Calculate Progress Percentage
   */
  calculateProgress() {
    const height = this.happiness.mountain.currentHeight;
    const summit = this.happiness.mountain.personalSummit;
    return Math.round((height / summit) * 100);
  }
  
  /**
   * Update Adaptation Level (Satiation)
   * 
   * Increases with repeated positive experiences
   * Decreases over time without exposure
   */
  updateAdaptation(experienceType, intensity) {
    const now = Date.now();
    const lastClimb = this.happiness.mountain.lastClimb || 0;
    const daysSince = (now - lastClimb) / (1000 * 60 * 60 * 24);
    
    if (experienceType === 'positive') {
      // Increase adaptation (satiation)
      this.happiness.adaptation += intensity * 0.1;
      this.happiness.mountain.lastClimb = now;
      this.happiness.mountain.climbFrequency++;
    }
    
    // Natural decay over time
    if (daysSince > 1) {
      this.happiness.adaptation *= 0.9; // 10% decay per day
      this.happiness.mountain.climbFrequency = 0;
    }
    
    // Cap at 1.0
    this.happiness.adaptation = Math.min(1.0, this.happiness.adaptation);
  }
  
  /**
   * Reset Loss Recovery Mode
   * 
   * Called after warmth has been applied and acknowledged
   */
  resetLossRecovery() {
    this.lossRecoveryMode = false;
  }
  
  /**
   * Get Current State Summary
   */
  getState() {
    return {
      happiness: {
        current: this.happiness.history[this.happiness.history.length - 1]?.happiness || 0,
        mountainHeight: this.happiness.mountain.currentHeight,
        interpretation: this.interpretHappiness(this.happiness.mountain.currentHeight),
        progress: this.calculateProgress()
      },
      warmth: {
        baseline: this.warmth.baseline,
        currentMultiplier: this.lossRecoveryMode ? this.warmth.afterLoss : 1.0,
        total: this.warmth.baseline * (this.lossRecoveryMode ? this.warmth.afterLoss : 1.0)
      },
      mountain: this.happiness.mountain,
      laws: {
        satiation: this.happiness.adaptation,
        lossDetected: this.lossDetected,
        lossRecoveryActive: this.lossRecoveryMode
      }
    };
  }
}

module.exports = WarmthAndHappinessModule;
