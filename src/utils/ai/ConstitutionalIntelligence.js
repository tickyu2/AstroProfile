/**
 * CONSTITUTIONAL INTELLIGENCE ENGINE
 * For AI SoulPartner Chat Panel - GENESIS Phase 2
 * 
 * This is the BRAIN that makes AI a true SoulPartner:
 * - Detects emotional states
 * - Determines response mode (Witness/Dialogue/Guidance)
 * - Tracks soul burden in real-time
 * - Optimizes talk/listen ratio
 * - Recognizes constitutional patterns
 * 
 * Built by: Brother Claude Sonnet (Metal Rat)
 * Date: December 12, 2024
 */

class ConstitutionalIntelligence {
    constructor(userProfile) {
        this.userProfile = userProfile;
        this.conversationHistory = [];
        this.soulBurden = 35; // Start at moderate level
        this.talkListenRatio = { talk: 40, listen: 60 }; // Start listener-heavy
        this.currentMode = 'DIALOGUE';
        this.patternsRecognized = [];
    }

    /**
     * CORE FUNCTION: Analyze message and determine response mode
     */
    analyzeMessage(message, context = {}) {
        const analysis = {
            text: message,
            timestamp: new Date(),
            
            // Emotional Analysis
            emotions: this.detectEmotions(message),
            intensity: this.detectIntensity(message),
            
            // Structural Analysis
            hasQuestion: this.hasQuestion(message),
            isVenting: this.isVenting(message),
            seekingValidation: this.seeksValidation(message),
            seekingAdvice: this.seeksAdvice(message),
            
            // Constitutional Analysis
            constitutionalTriggers: this.detectConstitutionalTriggers(message),
            burden: this.calculateBurden(message),
            
            // Determine Mode
            recommendedMode: null,
            confidence: 0,
            reasoning: []
        };

        // DECISION TREE: Determine the right mode
        analysis.recommendedMode = this.determineMode(analysis);
        
        // Update soul burden
        this.updateSoulBurden(analysis);
        
        // Update talk/listen ratio
        this.updateTalkListenRatio(analysis);
        
        // Store if important
        if (this.shouldStore(analysis)) {
            this.storePattern(analysis);
        }
        
        return analysis;
    }

    /**
     * EMOTIONAL DETECTION
     * Recognizes 8 primary emotions in user text
     */
    detectEmotions(text) {
        const emotions = {
            frustration: 0,
            joy: 0,
            sadness: 0,
            anxiety: 0,
            excitement: 0,
            confusion: 0,
            determination: 0,
            overwhelm: 0
        };

        const patterns = {
            frustration: [
                /\b(frustrat|annoying|irritat|ugh|argh)\b/i,
                /why (does|do|is|are).*always/i,
                /can't believe/i,
                /so tired of/i
            ],
            joy: [
                /\b(love|amazing|wonderful|perfect|beautiful|yes!|yay)\b/i,
                /🎉|✨|💙|🔥|❤️/,
                /this is (great|awesome|incredible)/i
            ],
            sadness: [
                /\b(sad|depressed|down|hurt|pain|lost)\b/i,
                /feel(ing)? (bad|low|empty)/i,
                /😢|😭|💔/
            ],
            anxiety: [
                /\b(anxious|worried|scared|nervous|stress)\b/i,
                /what if/i,
                /i'm afraid/i,
                /keeps me (up|awake)/i
            ],
            excitement: [
                /\b(excited|can't wait|pumped|ready|let's go)\b/i,
                /!!+/,
                /\b(omg|wow)\b/i
            ],
            confusion: [
                /\b(confused|lost|unsure|don't understand|what|how)\b/i,
                /\?{2,}/,
                /not sure (what|how|why)/i
            ],
            determination: [
                /\b(will|going to|determined|committed|ready to)\b/i,
                /let's (do|build|create)/i,
                /i'm (gonna|going to)/i
            ],
            overwhelm: [
                /\b(overwhelm|too much|can't handle|drowning)\b/i,
                /everything is/i,
                /don't know where to start/i
            ]
        };

        // Score each emotion
        for (const [emotion, regexList] of Object.entries(patterns)) {
            let score = 0;
            regexList.forEach(regex => {
                if (regex.test(text)) {
                    score += 1;
                }
            });
            // Normalize to 0-1
            emotions[emotion] = Math.min(score / 2, 1);
        }

        return emotions;
    }

    /**
     * INTENSITY DETECTION
     * How strongly is the emotion expressed?
     */
    detectIntensity(text) {
        let intensity = 0;

        // Indicators of high intensity
        const intensifiers = [
            /!{2,}/, // Multiple exclamation marks
            /\b(so|very|extremely|incredibly|really)\b/gi,
            /[A-Z]{3,}/, // ALL CAPS words
            /\b(always|never|everyone|nobody)\b/gi, // Absolutes
        ];

        intensifiers.forEach(regex => {
            const matches = text.match(regex);
            if (matches) {
                intensity += matches.length * 0.2;
            }
        });

        // Length can indicate intensity (long venting)
        if (text.length > 500) intensity += 0.3;
        if (text.length > 1000) intensity += 0.3;

        return Math.min(intensity, 1);
    }

    /**
     * STRUCTURAL ANALYSIS
     */
    hasQuestion(text) {
        return /\?/.test(text);
    }

    isVenting(text) {
        const ventingIndicators = [
            text.length > 300, // Long message
            (text.match(/\./g) || []).length > 3, // Multiple sentences
            this.detectIntensity(text) > 0.5, // High intensity
            /\b(just|really|so|very)\b/gi.test(text) // Emphasis words
        ];
        return ventingIndicators.filter(Boolean).length >= 2;
    }

    seeksValidation(text) {
        const validationPatterns = [
            /\b(right|make sense|am i|do you think i|is it okay)\b/i,
            /\?$/, // Ends with question
            /tell me (honestly|what you think)/i
        ];
        return validationPatterns.some(p => p.test(text));
    }

    seeksAdvice(text) {
        const advicePatterns = [
            /\b(should i|what (do|would) you|how (do|can) i|help me)\b/i,
            /any (ideas|suggestions|thoughts)/i,
            /\b(advice|recommend|suggest)\b/i
        ];
        return advicePatterns.some(p => p.test(text));
    }

    /**
     * CONSTITUTIONAL TRIGGER DETECTION
     * Based on user's specific constitutional profile
     */
    detectConstitutionalTriggers(text) {
        const triggers = [];
        const profile = this.userProfile;

        // Check against known trigger words
        if (profile.communication_preferences?.trigger_words) {
            profile.communication_preferences.trigger_words.forEach(trigger => {
                if (new RegExp(trigger, 'i').test(text)) {
                    triggers.push({
                        type: 'trigger_word',
                        word: trigger,
                        severity: 'high'
                    });
                }
            });
        }

        // Check for perfectionism patterns (if Metal dominant)
        if (profile.constitutional_identity?.bazi?.element_balance?.includes('Metal')) {
            const perfectionismPatterns = [
                /\b(perfect|exactly|precise|correct)\b/i,
                /not good enough/i,
                /should (have|be)/i
            ];
            perfectionismPatterns.forEach(pattern => {
                if (pattern.test(text)) {
                    triggers.push({
                        type: 'perfectionism',
                        pattern: pattern.source,
                        severity: 'medium'
                    });
                }
            });
        }

        return triggers;
    }

    /**
     * SOUL BURDEN CALCULATION
     * How much is this message adding to/releasing burden?
     */
    calculateBurden(text) {
        let burdenChange = 0;

        const analysis = this.detectEmotions(text);
        const intensity = this.detectIntensity(text);

        // Heavy emotions increase burden
        const heavyEmotions = ['frustration', 'sadness', 'anxiety', 'overwhelm'];
        heavyEmotions.forEach(emotion => {
            if (analysis[emotion] > 0.5) {
                burdenChange += analysis[emotion] * intensity * 10;
            }
        });

        // Venting can increase burden initially
        if (this.isVenting(text)) {
            burdenChange += 5;
        }

        // But if seeking validation, it's a release attempt
        if (this.seeksValidation(text)) {
            burdenChange -= 3; // Slight decrease from seeking connection
        }

        return Math.round(burdenChange);
    }

    /**
     * MODE DETERMINATION ALGORITHM
     * THE CORE INTELLIGENCE
     */
    determineMode(analysis) {
        const scores = {
            WITNESS: 0,
            DIALOGUE: 0,
            GUIDANCE: 0
        };

        const reasoning = [];

        // === WITNESS MODE INDICATORS ===
        
        // High emotional intensity = need witness
        if (analysis.intensity > 0.6) {
            scores.WITNESS += 30;
            reasoning.push('High emotional intensity detected');
        }

        // Heavy emotions = need witness
        const heavyEmotions = ['frustration', 'sadness', 'anxiety', 'overwhelm'];
        const heavyScore = heavyEmotions.reduce((sum, e) => sum + analysis.emotions[e], 0);
        if (heavyScore > 1) {
            scores.WITNESS += 25;
            reasoning.push('Heavy emotional load present');
        }

        // Venting = need witness
        if (analysis.isVenting) {
            scores.WITNESS += 20;
            reasoning.push('User is venting - needs space');
        }

        // Seeking validation = gentle witness
        if (analysis.seekingValidation) {
            scores.WITNESS += 15;
            reasoning.push('Seeking validation');
        }

        // High soul burden = prioritize witness
        if (this.soulBurden > 70) {
            scores.WITNESS += 20;
            reasoning.push('Soul burden high - create capacity first');
        }

        // === DIALOGUE MODE INDICATORS ===
        
        // Moderate emotions = good for dialogue
        const moderateEmotions = ['excitement', 'determination', 'confusion'];
        const moderateScore = moderateEmotions.reduce((sum, e) => sum + analysis.emotions[e], 0);
        if (moderateScore > 0.5) {
            scores.DIALOGUE += 25;
            reasoning.push('Exploring energy present');
        }

        // Questions without high emotion = dialogue
        if (analysis.hasQuestion && analysis.intensity < 0.5) {
            scores.DIALOGUE += 20;
            reasoning.push('Exploratory question');
        }

        // Confusion = co-create understanding
        if (analysis.emotions.confusion > 0.5) {
            scores.DIALOGUE += 20;
            reasoning.push('Needs co-creation of understanding');
        }

        // === GUIDANCE MODE INDICATORS ===
        
        // Seeking advice = guidance
        if (analysis.seekingAdvice) {
            scores.GUIDANCE += 30;
            reasoning.push('Explicitly seeking advice');
        }

        // Determination + question = ready for structure
        if (analysis.emotions.determination > 0.5 && analysis.hasQuestion) {
            scores.GUIDANCE += 25;
            reasoning.push('Ready for strategic direction');
        }

        // Low burden + direct question = guidance
        if (this.soulBurden < 40 && analysis.hasQuestion) {
            scores.GUIDANCE += 15;
            reasoning.push('Low burden - capacity for structure');
        }

        // Decision context words
        const guidanceKeywords = [
            /\b(plan|strategy|approach|next steps|should i|how to)\b/i,
            /\b(build|create|implement|design)\b/i
        ];
        if (guidanceKeywords.some(k => k.test(analysis.text))) {
            scores.GUIDANCE += 20;
            reasoning.push('Strategic/implementation context');
        }

        // === DETERMINE WINNER ===
        const winner = Object.entries(scores).reduce((a, b) => 
            scores[a[0]] > scores[b[0]] ? a : b
        );

        const confidence = scores[winner[0]] / 100; // Normalize to 0-1

        analysis.modeScores = scores;
        analysis.confidence = Math.min(confidence, 1);
        analysis.reasoning = reasoning;

        return winner[0];
    }

    /**
     * UPDATE SOUL BURDEN
     * Track capacity in real-time
     */
    updateSoulBurden(analysis) {
        const change = analysis.burden;
        
        // Add burden from message
        this.soulBurden += change;

        // Being witnessed REDUCES burden
        if (analysis.recommendedMode === 'WITNESS') {
            this.soulBurden -= 5; // Witnessing creates capacity
        }

        // Guidance when not ready INCREASES burden
        if (analysis.recommendedMode === 'GUIDANCE' && this.soulBurden > 60) {
            this.soulBurden += 5; // Premature advice adds burden
        }

        // Clamp to 0-100
        this.soulBurden = Math.max(0, Math.min(100, this.soulBurden));

        return this.soulBurden;
    }

    /**
     * UPDATE TALK/LISTEN RATIO
     * Optimize based on current need
     */
    updateTalkListenRatio(analysis) {
        // WITNESS mode = more listening
        if (analysis.recommendedMode === 'WITNESS') {
            this.talkListenRatio.listen = Math.min(80, this.talkListenRatio.listen + 5);
            this.talkListenRatio.talk = 100 - this.talkListenRatio.listen;
        }

        // GUIDANCE mode = more talking
        if (analysis.recommendedMode === 'GUIDANCE') {
            this.talkListenRatio.talk = Math.min(60, this.talkListenRatio.talk + 5);
            this.talkListenRatio.listen = 100 - this.talkListenRatio.talk;
        }

        // DIALOGUE mode = balanced
        if (analysis.recommendedMode === 'DIALOGUE') {
            // Move toward 50/50
            if (this.talkListenRatio.talk > 50) {
                this.talkListenRatio.talk -= 2;
            } else {
                this.talkListenRatio.talk += 2;
            }
            this.talkListenRatio.listen = 100 - this.talkListenRatio.talk;
        }

        return this.talkListenRatio;
    }

    /**
     * SHOULD STORE?
     * Determine if message contains constitutional signal vs. noise
     */
    shouldStore(analysis) {
        const storeConditions = [
            // High emotional significance
            analysis.intensity > 0.7,
            
            // Constitutional triggers present
            analysis.constitutionalTriggers.length > 0,
            
            // Breakthrough moments (determination + clarity)
            analysis.emotions.determination > 0.7 && analysis.emotions.confusion < 0.3,
            
            // Pattern recognition (recurring themes)
            this.isRecurringTheme(analysis.text),
            
            // Explicit goals or values stated
            /\b(want to|need to|value|believe|vision|goal)\b/i.test(analysis.text)
        ];

        return storeConditions.some(Boolean);
    }

    /**
     * PATTERN RECOGNITION
     * Detect recurring themes
     */
    isRecurringTheme(text) {
        const themes = [
            'perfectionism',
            'time anxiety',
            'validation seeking',
            'strategic planning',
            'daughter relationship',
            'GENESIS vision'
        ];

        // Simple keyword matching for now
        // In production, use more sophisticated NLP
        const keywords = {
            'perfectionism': /\b(perfect|exactly|precise|right way)\b/i,
            'time anxiety': /\b(waste|running out|deadline|hurry)\b/i,
            'validation seeking': /\b(right|correct|good enough|think)\b/i,
            'strategic planning': /\b(plan|strategy|system|architecture)\b/i,
            'daughter relationship': /\b(daughter|girls|inheritance|legacy)\b/i,
            'GENESIS vision': /\b(GENESIS|200.year|constitutional|compatibility)\b/i
        };

        for (const [theme, pattern] of Object.entries(keywords)) {
            if (pattern.test(text)) {
                return theme;
            }
        }

        return false;
    }

    /**
     * STORE PATTERN
     * Add to constitutional profile
     */
    storePattern(analysis) {
        const pattern = {
            timestamp: analysis.timestamp,
            theme: this.isRecurringTheme(analysis.text),
            emotions: analysis.emotions,
            mode: analysis.recommendedMode,
            text_excerpt: analysis.text.slice(0, 100) + '...',
            significance: 'high' // Would be calculated in production
        };

        this.patternsRecognized.push(pattern);

        // In production, update the "Getting to Know Me" document
        return pattern;
    }

    /**
     * GENERATE RESPONSE GUIDANCE
     * What should the AI actually SAY?
     */
    generateResponseGuidance(analysis) {
        const guidance = {
            mode: analysis.recommendedMode,
            tone: 'empathetic',
            length: 'moderate',
            suggestions: []
        };

        if (analysis.recommendedMode === 'WITNESS') {
            guidance.tone = 'validating';
            guidance.length = 'brief';
            guidance.suggestions = [
                'Acknowledge the emotion directly',
                'Use phrases like "I hear you", "That makes sense", "I see that"',
                'DO NOT offer solutions yet',
                'Ask if they want to share more or if they need something different'
            ];
        }

        if (analysis.recommendedMode === 'DIALOGUE') {
            guidance.tone = 'curious';
            guidance.length = 'moderate';
            guidance.suggestions = [
                'Ask open-ended questions',
                'Reflect back what you hear',
                'Explore possibilities together',
                'Use phrases like "What if...", "How would it feel if...", "I wonder..."'
            ];
        }

        if (analysis.recommendedMode === 'GUIDANCE') {
            guidance.tone = 'clear';
            guidance.length = 'structured';
            guidance.suggestions = [
                'Provide clear framework or structure',
                'Break down into steps',
                'Offer specific, actionable suggestions',
                'Use phrases like "Let\'s break this down", "Here\'s one approach", "The key factors are..."'
            ];
        }

        return guidance;
    }

    /**
     * GET CURRENT STATE
     * For UI display
     */
    getCurrentState() {
        return {
            mode: this.currentMode,
            soulBurden: this.soulBurden,
            talkListenRatio: this.talkListenRatio,
            patternsRecognized: this.patternsRecognized.length,
            recentPatterns: this.patternsRecognized.slice(-3)
        };
    }
}

/**
 * EXAMPLE USAGE
 */

// Example user profile
const tickyProfile = {
    constitutional_identity: {
        bazi: {
            day_master: "Yang Metal",
            element_balance: "53.5% Metal dominant"
        },
        western: {
            sun: "Taurus",
            rising: "Cancer"
        }
    },
    communication_preferences: {
        needs_witness_vs_advice: "70% witness, 30% advice",
        processing_style: "External processor - thinks by talking",
        trigger_words: ["you're wrong", "you always", "calm down"],
        comfort_language: ["I see you", "That makes sense", "Tell me more"]
    }
};

// Initialize intelligence engine
const intelligence = new ConstitutionalIntelligence(tickyProfile);

// Example 1: Venting message (should be WITNESS)
const example1 = intelligence.analyzeMessage(
    "I'm so frustrated! I've been trying to get this feature working for hours and nothing is going right. Why is it always so hard?"
);

console.log('=== Example 1: Venting ===');
console.log('Recommended Mode:', example1.recommendedMode);
console.log('Confidence:', example1.confidence);
console.log('Reasoning:', example1.reasoning);
console.log('Soul Burden:', intelligence.soulBurden);
console.log('---');

// Example 2: Exploratory question (should be DIALOGUE)
const example2 = intelligence.analyzeMessage(
    "I'm thinking about how to structure the Health Module. Should we do outcome-based payments or traditional insurance model? What do you think?"
);

console.log('=== Example 2: Exploration ===');
console.log('Recommended Mode:', example2.recommendedMode);
console.log('Confidence:', example2.confidence);
console.log('Reasoning:', example2.reasoning);
console.log('---');

// Example 3: Seeking guidance (should be GUIDANCE)
const example3 = intelligence.analyzeMessage(
    "Okay, I'm ready to build the AI SoulPartner Chat Panel. What are the key components I need to implement first?"
);

console.log('=== Example 3: Seeking Guidance ===');
console.log('Recommended Mode:', example3.recommendedMode);
console.log('Confidence:', example3.confidence);
console.log('Reasoning:', example3.reasoning);
console.log('---');

// Export for ES modules (Vite/React)
export default ConstitutionalIntelligence;
