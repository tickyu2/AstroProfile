/**
 * LOVE GUIDANCE SERVICE
 *
 * "Nancy and I understood each other's needs constitutionally.
 *  She knew what I needed before I did. I learned to love her
 *  the way SHE needed, not just the way I wanted to give."
 *  - Ronald Reagan
 *
 * This service generates constitutional love guidance based on profile.
 * Not compatibility scores - ACTIONABLE love guidance.
 */

/**
 * Get constitutional needs based on profile
 * @param {Object} profile - User profile with bazi, western, numerology data
 * @returns {Array} Array of constitutional needs with actions
 */
export function getConstitutionalNeeds(profile) {
  const needs = [];

  // =============================================================================
  // BAZI ELEMENT-BASED NEEDS
  // =============================================================================

  const element = profile?.bazi?.dayMasterElement || profile?.bazi?.primaryElement;

  if (element === 'Water' || element === 'water') {
    needs.push({
      title: "Flow and Flexibility",
      icon: "🌊",
      category: "bazi",
      explanation: "Water element needs to flow, not be blocked. They feel trapped by rigidity and forced decisions.",
      actions: [
        "Don't force decisions - let them process and arrive naturally",
        "Give options, not ultimatums",
        "Be flexible with plans - spontaneity energizes them",
        "Create calm, peaceful environments",
        "Don't dam their emotional flow - let feelings move"
      ],
      example: "Instead of 'We need to decide NOW,' say 'Take the time you need, let's talk when you're ready.'",
      howTheyShow: {
        title: "Emotional Availability",
        description: "They show love through deep listening and emotional presence",
        action: "sit with you in silence or listen to your feelings without fixing"
      }
    });
  }

  if (element === 'Wood' || element === 'wood') {
    needs.push({
      title: "Growth and Direction",
      icon: "🌳",
      category: "bazi",
      explanation: "Wood element needs room to grow and expand. They feel stifled by limitations and micromanagement.",
      actions: [
        "Support their ambitions and goals",
        "Give them space to pursue projects independently",
        "Encourage their growth, even when it's uncomfortable",
        "Don't hold them back with excessive worry",
        "Be their cheerleader, not their critic"
      ],
      example: "Instead of 'That's too risky,' say 'How can I support you in pursuing this?'",
      howTheyShow: {
        title: "Planning and Providing",
        description: "They show love through helping you grow and planning for the future",
        action: "make plans together or push you to be your best self"
      }
    });
  }

  if (element === 'Fire' || element === 'fire') {
    needs.push({
      title: "Passion and Expression",
      icon: "🔥",
      category: "bazi",
      explanation: "Fire element needs to shine and express. They feel diminished when ignored or dampened.",
      actions: [
        "Show enthusiasm and excitement with them",
        "Give them attention and appreciation openly",
        "Let them express emotions fully without judgment",
        "Create exciting experiences together",
        "Never dismiss their passion as 'too much'"
      ],
      example: "When they're excited about something, match their energy: 'That's amazing! Tell me more!'",
      howTheyShow: {
        title: "Warmth and Enthusiasm",
        description: "They show love through excitement, affection, and making things special",
        action: "celebrate you, create surprise moments, or express love dramatically"
      }
    });
  }

  if (element === 'Earth' || element === 'earth') {
    needs.push({
      title: "Stability and Security",
      icon: "🏔️",
      category: "bazi",
      explanation: "Earth element needs stability and grounding. Chaos and uncertainty drain them deeply.",
      actions: [
        "Create predictable routines together",
        "Be consistent in your words and actions",
        "Don't spring major changes without discussion",
        "Provide emotional and financial stability",
        "Be the rock they can depend on"
      ],
      example: "Create weekly rituals: 'Sunday mornings are always ours for coffee and talking.'",
      howTheyShow: {
        title: "Reliability and Support",
        description: "They show love through being there, consistently, no matter what",
        action: "show up every time, remember details, or create stable environments"
      }
    });
  }

  if (element === 'Metal' || element === 'metal') {
    needs.push({
      title: "Quality and Refinement",
      icon: "⚔️",
      category: "bazi",
      explanation: "Metal element needs precision and quality. They feel disrespected by sloppiness or broken promises.",
      actions: [
        "Keep your promises - every single one",
        "Pay attention to details and quality",
        "Be direct and honest, not vague",
        "Respect their standards without mocking",
        "Give them space to process and decide"
      ],
      example: "If you say you'll call at 7pm, call at 7pm. Not 7:15. Not 7:30.",
      howTheyShow: {
        title: "Precision and Loyalty",
        description: "They show love through attention to detail and unwavering loyalty",
        action: "remember exact preferences, defend you fiercely, or improve things for you"
      }
    });
  }

  // =============================================================================
  // NUMEROLOGY LIFE PATH NEEDS
  // =============================================================================

  const lifePath = profile?.numerology?.lifePath;

  if (lifePath === 1) {
    needs.push({
      title: "Independence and Leadership",
      icon: "👑",
      category: "numerology",
      explanation: "Life Path 1 needs to lead and feel capable. Being controlled or overlooked hurts them deeply.",
      actions: [
        "Let them take the lead on decisions sometimes",
        "Never undermine them in public",
        "Ask their opinion and respect it",
        "Give them challenges, not hand-holding",
        "Celebrate their achievements enthusiastically"
      ],
      example: "Say 'What do you think we should do?' and actually follow their lead sometimes.",
      howTheyShow: {
        title: "Taking Charge and Protecting",
        description: "They show love by taking initiative and solving problems for you",
        action: "handle difficult situations or make things happen without being asked"
      }
    });
  }

  if (lifePath === 2) {
    needs.push({
      title: "Partnership and Peace",
      icon: "🤝",
      category: "numerology",
      explanation: "Life Path 2 needs harmony and partnership above all. Conflict and disconnection wound them.",
      actions: [
        "Approach disagreements with extreme gentleness",
        "Use 'we' language - they need to feel like a team",
        "Never raise your voice - they'll shut down",
        "Create peaceful home environment",
        "Include them in all decisions"
      ],
      example: "Before hard conversations: 'I love you. Let's figure this out together calmly.'",
      howTheyShow: {
        title: "Creating Harmony",
        description: "They show love by supporting you and maintaining peace",
        action: "mediate conflicts, support behind the scenes, or sacrifice for harmony"
      }
    });
  }

  if (lifePath === 3) {
    needs.push({
      title: "Expression and Joy",
      icon: "🎨",
      category: "numerology",
      explanation: "Life Path 3 needs creative expression and joy. Being silenced or criticized crushes their spirit.",
      actions: [
        "Encourage their creative expression always",
        "Laugh together often - they need levity",
        "Let them talk and express without interrupting",
        "Appreciate their humor and creativity",
        "Never call them 'too much' or 'too loud'"
      ],
      example: "When they want to share a story or idea, give full attention and enthusiasm.",
      howTheyShow: {
        title: "Making Life Fun",
        description: "They show love through humor, creativity, and making things special",
        action: "write something for you, plan fun surprises, or make you laugh"
      }
    });
  }

  if (lifePath === 4) {
    needs.push({
      title: "Structure and Dependability",
      icon: "🏛️",
      category: "numerology",
      explanation: "Life Path 4 needs order and reliability. Chaos and broken promises deeply unsettle them.",
      actions: [
        "Be reliable - do what you say you'll do",
        "Respect their routines and systems",
        "Help them relax without criticizing their discipline",
        "Plan ahead - spontaneity stresses them",
        "Appreciate their hard work openly"
      ],
      example: "Create shared calendars and routines: 'Let's plan our week together on Sunday nights.'",
      howTheyShow: {
        title: "Building and Providing",
        description: "They show love through hard work and creating security",
        action: "work hard for the family, organize things, or build something for you"
      }
    });
  }

  if (lifePath === 5) {
    needs.push({
      title: "Freedom and Adventure",
      icon: "🦅",
      category: "numerology",
      explanation: "Life Path 5 needs freedom and variety. Feeling trapped or bored is unbearable for them.",
      actions: [
        "Give them space to be independent",
        "Plan adventures and try new things together",
        "Don't try to control or limit them",
        "Be flexible with plans and routines",
        "Support their need for variety"
      ],
      example: "Say 'Let's go somewhere we've never been this weekend' instead of the usual routine.",
      howTheyShow: {
        title: "Exciting Adventures",
        description: "They show love by keeping things exciting and new",
        action: "surprise you with adventures, try new things with you, or keep life interesting"
      }
    });
  }

  if (lifePath === 6) {
    needs.push({
      title: "Nurturing and Appreciation",
      icon: "💕",
      category: "numerology",
      explanation: "Life Path 6 needs to nurture and be appreciated for it. Feeling taken for granted devastates them.",
      actions: [
        "Express gratitude for everything they do",
        "Let them take care of you (don't refuse help)",
        "Create beautiful home environment together",
        "Remember important dates and traditions",
        "Tell them 'I couldn't do this without you'"
      ],
      example: "Regularly say: 'I notice everything you do for us. Thank you for making our home special.'",
      howTheyShow: {
        title: "Taking Care of Everything",
        description: "They show love through nurturing and creating beauty",
        action: "cook your favorite meal, remember your needs, or beautify your space"
      }
    });
  }

  if (lifePath === 7) {
    needs.push({
      title: "Solitude and Mental Space",
      icon: "🔍",
      category: "numerology",
      explanation: "Life Path 7 NEEDS alone time to process. It's not rejection - it's how they function.",
      actions: [
        "Give 2-3 hours of uninterrupted alone time daily",
        "Don't take silence personally - they're thinking",
        "Ask 'Do you want to talk or think first?' after big events",
        "Respect closed doors - they'll emerge when ready",
        "Engage intellectually - discuss ideas, not just feelings"
      ],
      example: "When they withdraw: 'Take your time, I'm here when you're ready' instead of 'Why are you being distant?'",
      howTheyShow: {
        title: "Deep Analysis",
        description: "They show love by trying to understand you deeply",
        action: "ask probing questions or analyze your situation to help you"
      }
    });
  }

  if (lifePath === 8) {
    needs.push({
      title: "Respect and Achievement",
      icon: "💎",
      category: "numerology",
      explanation: "Life Path 8 needs respect for their achievements and support for their ambitions.",
      actions: [
        "Respect their career and ambitions",
        "Be their partner in success, not a hindrance",
        "Let them lead financial decisions (while participating)",
        "Celebrate their wins with genuine pride",
        "Support their drive without calling it workaholism"
      ],
      example: "Say 'I'm proud of what you've built' and mean it. Celebrate their successes publicly.",
      howTheyShow: {
        title: "Providing and Achieving",
        description: "They show love through success and providing abundance",
        action: "work hard for the family's security or make things happen with their power"
      }
    });
  }

  if (lifePath === 9) {
    needs.push({
      title: "Purpose and Compassion",
      icon: "🌍",
      category: "numerology",
      explanation: "Life Path 9 needs to feel they're contributing to something larger. Selfishness disturbs them deeply.",
      actions: [
        "Support their humanitarian interests",
        "Be generous with others together",
        "Don't be petty or small-minded",
        "Help them give back to the world",
        "Understand their need to help everyone, not just family"
      ],
      example: "Volunteer together, support causes they care about, and discuss how to make a difference.",
      howTheyShow: {
        title: "Universal Love",
        description: "They show love through compassion and giving to all",
        action: "give generously, forgive easily, or help others through you"
      }
    });
  }

  // =============================================================================
  // SOUL URGE NEEDS
  // =============================================================================

  const soulUrge = profile?.numerology?.soulUrge;

  if (soulUrge === 2) {
    needs.push({
      title: "Deep Partnership Bond",
      icon: "💙",
      category: "soulUrge",
      explanation: "Soul Urge 2 craves harmony and partnership. Discord physically hurts them.",
      actions: [
        "Approach disagreements with extreme gentleness",
        "Say 'Can we talk?' not 'We need to talk'",
        "Create peaceful home environment (soft music, calm energy)",
        "Don't raise voice - they'll shut down immediately",
        "Make decisions together, ask their input on everything"
      ],
      example: "Before a hard conversation, set peaceful tone: 'I love you. Let's figure this out together calmly.'",
      howTheyShow: {
        title: "Creating Peace",
        description: "They show love through creating harmony and supporting your dreams",
        action: "mediate conflicts, create peaceful spaces, or support you behind the scenes"
      }
    });
  }

  if (soulUrge === 6) {
    needs.push({
      title: "Family and Home Connection",
      icon: "🏡",
      category: "soulUrge",
      explanation: "Soul Urge 6 yearns for family harmony and a beautiful home. They need to feel needed.",
      actions: [
        "Let them take care of you and the home",
        "Express appreciation for domestic efforts",
        "Prioritize family time and traditions",
        "Create a beautiful living space together",
        "Never take their nurturing for granted"
      ],
      example: "Say 'Our home feels so special because of you. Thank you for making it our sanctuary.'",
      howTheyShow: {
        title: "Nurturing Everything",
        description: "They show love through care, cooking, and creating home",
        action: "cook your favorites, remember your needs, or make your space beautiful"
      }
    });
  }

  // =============================================================================
  // WESTERN ASTROLOGY SUN SIGN NEEDS
  // =============================================================================

  const sunSign = profile?.western?.sun || profile?.sunSign;

  if (sunSign === 'Aries') {
    needs.push({
      title: "Action and Challenge",
      icon: "🔥",
      category: "western",
      explanation: "Aries Sun needs excitement and challenge. Boredom and passivity deflate them.",
      actions: [
        "Keep things exciting and challenging",
        "Let them take the lead sometimes",
        "Be direct and honest, not passive-aggressive",
        "Support their competitive spirit",
        "Don't slow them down - run with them"
      ],
      example: "Propose adventures: 'Let's try that new hiking trail this weekend' instead of Netflix again.",
      howTheyShow: {
        title: "Taking Action For You",
        description: "They show love through doing things and solving problems",
        action: "jump into action to help you or challenge you to grow"
      }
    });
  }

  if (sunSign === 'Cancer') {
    needs.push({
      title: "Emotional Security and Home",
      icon: "🦀",
      category: "western",
      explanation: "Cancer Sun needs emotional safety and a sanctuary home. They're deeply sensitive.",
      actions: [
        "Create stable, predictable home environment",
        "Share your feelings openly - emotional honesty = safety",
        "Never mock their sensitivity - it's their gift",
        "Make home a priority (cozy, comfortable, theirs)",
        "Physical affection - they're very touch-oriented"
      ],
      example: "When they're upset, offer physical comfort: 'Come here, let me hold you' works better than logic.",
      howTheyShow: {
        title: "Nurturing and Creating Home",
        description: "They show love through caring for you and making home special",
        action: "cook for you, remember your favorite things, or create cozy spaces"
      }
    });
  }

  if (sunSign === 'Leo') {
    needs.push({
      title: "Admiration and Loyalty",
      icon: "🦁",
      category: "western",
      explanation: "Leo Sun needs to feel admired and valued. Being ignored or criticized publicly wounds them.",
      actions: [
        "Express admiration and appreciation openly",
        "Never criticize them in public - ever",
        "Let them shine - support their spotlight moments",
        "Be loyal and proud of them",
        "Celebrate their achievements enthusiastically"
      ],
      example: "Say 'I'm so proud to be with you' in front of others. Public appreciation matters.",
      howTheyShow: {
        title: "Generous Protection",
        description: "They show love through generosity and protecting your honor",
        action: "defend you, give generously, or make you feel like royalty"
      }
    });
  }

  if (sunSign === 'Virgo') {
    needs.push({
      title: "Appreciation for Service",
      icon: "💚",
      category: "western",
      explanation: "Virgo Sun shows love through service. Being criticized or taken for granted hurts deeply.",
      actions: [
        "Notice and thank them for the small things",
        "Appreciate their attention to detail",
        "Don't criticize their 'perfectionism' - it's love",
        "Keep your word and be reliable",
        "Help them relax without judgment"
      ],
      example: "Say 'I notice you organized everything for our trip. That means so much to me.'",
      howTheyShow: {
        title: "Acts of Service",
        description: "They show love by doing things to make your life better",
        action: "organize things, fix problems, or help with practical matters"
      }
    });
  }

  if (sunSign === 'Libra') {
    needs.push({
      title: "Harmony and Partnership",
      icon: "⚖️",
      category: "western",
      explanation: "Libra Sun needs balance and beautiful partnership. Conflict and ugliness disturb them.",
      actions: [
        "Create aesthetic, beautiful environments",
        "Approach conflict gently and fairly",
        "Be a true partner - equality matters",
        "Appreciate their diplomatic nature",
        "Make time for romantic, beautiful experiences"
      ],
      example: "Plan beautiful date nights: 'Let's dress up and go somewhere special tonight.'",
      howTheyShow: {
        title: "Creating Beauty Together",
        description: "They show love through creating harmony and beautiful experiences",
        action: "plan romantic moments, keep peace, or beautify your life together"
      }
    });
  }

  if (sunSign === 'Scorpio') {
    needs.push({
      title: "Depth and Loyalty",
      icon: "🦂",
      category: "western",
      explanation: "Scorpio Sun needs intense, deep connection. Superficiality and betrayal are unforgivable.",
      actions: [
        "Be completely honest - they'll know if you're not",
        "Be loyal above all else",
        "Go deep in conversations - no small talk",
        "Respect their privacy and secrets",
        "Match their intensity - don't be afraid of depth"
      ],
      example: "Have deep conversations: 'Tell me what you're really thinking. I can handle the truth.'",
      howTheyShow: {
        title: "Fierce Protection",
        description: "They show love through fierce loyalty and deep commitment",
        action: "protect you absolutely, share their deepest secrets, or commit completely"
      }
    });
  }

  if (sunSign === 'Sagittarius') {
    needs.push({
      title: "Freedom and Adventure",
      icon: "🏹",
      category: "western",
      explanation: "Sagittarius Sun needs freedom and expansion. Feeling caged or limited makes them flee.",
      actions: [
        "Give them space and freedom",
        "Travel and explore together",
        "Don't try to control or limit them",
        "Share their optimism and sense of adventure",
        "Be their fellow explorer, not their anchor"
      ],
      example: "Say 'Let's plan our next adventure' and mean it. Keep life exciting.",
      howTheyShow: {
        title: "Sharing Adventures",
        description: "They show love by sharing experiences and expanding your world",
        action: "take you on adventures, teach you new things, or expand your horizons"
      }
    });
  }

  if (sunSign === 'Capricorn') {
    needs.push({
      title: "Respect and Ambition",
      icon: "🐐",
      category: "western",
      explanation: "Capricorn Sun needs respect for their achievements. Being seen as a failure terrifies them.",
      actions: [
        "Respect their career and ambitions",
        "Be a partner in their goals",
        "Provide stability and reliability",
        "Celebrate their achievements genuinely",
        "Understand work is a form of love for them"
      ],
      example: "Say 'I respect how hard you work for us. Your dedication inspires me.'",
      howTheyShow: {
        title: "Building Security",
        description: "They show love through building security and achieving for the family",
        action: "work for family security, plan for the future, or achieve status for you"
      }
    });
  }

  if (sunSign === 'Aquarius') {
    needs.push({
      title: "Freedom and Uniqueness",
      icon: "🌊",
      category: "western",
      explanation: "Aquarius Sun needs freedom and acceptance of their uniqueness. Conformity kills them.",
      actions: [
        "Accept their quirks and uniqueness",
        "Give them intellectual stimulation",
        "Don't try to change them to fit norms",
        "Support their humanitarian causes",
        "Be their friend, not just their partner"
      ],
      example: "Say 'I love how different you are from everyone else. Never change.'",
      howTheyShow: {
        title: "Accepting All of You",
        description: "They show love by accepting you completely and being your best friend",
        action: "accept your weirdness, be your friend, or include you in their causes"
      }
    });
  }

  if (sunSign === 'Pisces') {
    needs.push({
      title: "Emotional Understanding",
      icon: "🐟",
      category: "western",
      explanation: "Pisces Sun needs deep emotional connection and understanding. Harshness wounds them deeply.",
      actions: [
        "Be gentle and emotionally present",
        "Support their dreams, even unrealistic ones",
        "Create romantic, magical moments",
        "Never mock their sensitivity",
        "Provide stability while honoring their creativity"
      ],
      example: "Hold space for their emotions: 'I see you're feeling deeply. I'm here with you.'",
      howTheyShow: {
        title: "Emotional Intuition",
        description: "They show love through deep emotional understanding and creativity",
        action: "intuit your feelings, create art for you, or transcend ordinary love"
      }
    });
  }

  return needs;
}

/**
 * Calculate the "love bridge" between two constitutional profiles
 * @param {Object} userProfile - The user's profile
 * @param {Object} partnerProfile - The partner's profile
 * @returns {Object} Bridge strategy with challenge, solutions, and example
 */
export function calculateLoveBridge(userProfile, partnerProfile) {
  const userLifePath = userProfile?.numerology?.lifePath;
  const partnerLifePath = partnerProfile?.numerology?.lifePath;
  const userSoulUrge = userProfile?.numerology?.soulUrge;
  const partnerSoulUrge = partnerProfile?.numerology?.soulUrge;

  // Life Path 7 (solitary) with Soul Urge 2 (partnership)
  if (userLifePath === 7 && partnerSoulUrge === 2) {
    return {
      challenge: `You (Life Path 7) need significant solitude to recharge. They (Soul Urge 2) need togetherness and partnership. This creates tension - you withdraw, they feel abandoned.`,
      solutions: [
        "Schedule alone time so it's predictable (they know you're coming back)",
        "Reassure: 'I'm not leaving you, I'm recharging to love you better'",
        "Return from solitude and immediately CONNECT - show it worked",
        "Quality over quantity: 2 hours of presence > 8 hours half-there",
        "Create rituals: 'After my alone time, we always have tea together'",
        "Explain your process: 'I need to think alone, then I'll share with you'"
      ],
      example: `Say: "Honey, I need 2 hours alone after work to decompress. Then at 7pm, let's have our special dinner time together where I'm 100% present. My alone time helps me love you better."`
    };
  }

  // Life Path 1 (independent) with Life Path 2 (partnership)
  if (userLifePath === 1 && partnerLifePath === 2) {
    return {
      challenge: `You (Life Path 1) need independence and leadership. They (Life Path 2) need togetherness and joint decisions. You may seem controlling; they may seem clingy.`,
      solutions: [
        "Lead in some areas, partner in others - define territories",
        "Include them in decisions even when you know the answer",
        "Say 'What do you think?' before announcing your decision",
        "Create time for togetherness AND your solo pursuits",
        "Let them support you - it's how they feel valued",
        "Appreciate their partnership style as a complement to your leadership"
      ],
      example: `Say: "I value your input. Here's what I'm thinking, but I want to know what you think before we decide together."`
    };
  }

  // Fire element with Water element
  const userElement = userProfile?.bazi?.dayMasterElement || userProfile?.bazi?.primaryElement;
  const partnerElement = partnerProfile?.bazi?.dayMasterElement || partnerProfile?.bazi?.primaryElement;

  if ((userElement === 'Fire' || userElement === 'fire') &&
      (partnerElement === 'Water' || partnerElement === 'water')) {
    return {
      challenge: `You (Fire) need passion and excitement. They (Water) need calm and flow. Your intensity can overwhelm them; their calm can seem cold to you.`,
      solutions: [
        "Let your Fire warm their Water, not boil it",
        "Create space for both excitement AND calm",
        "Express passion gently - intensity without overwhelm",
        "Appreciate their calm as balance, not rejection",
        "Let them cool you down when you need it",
        "Share your fire through warmth, not demands"
      ],
      example: `Balance excitement and peace: "Let's have an adventurous Saturday, then a calm Sunday at home together."`
    };
  }

  // Life Path 5 (freedom) with Life Path 4 (structure)
  if ((userLifePath === 5 && partnerLifePath === 4) ||
      (userLifePath === 4 && partnerLifePath === 5)) {
    const isFreedomSeeker = userLifePath === 5;
    return {
      challenge: isFreedomSeeker
        ? `You (Life Path 5) need freedom and variety. They (Life Path 4) need structure and stability. Your spontaneity stresses them; their routines bore you.`
        : `You (Life Path 4) need structure and stability. They (Life Path 5) need freedom and variety. Your routines bore them; their spontaneity stresses you.`,
      solutions: [
        "Create 'adventure time' within a predictable schedule",
        "Have routine days AND spontaneous days - both get honored",
        "Let structure create a safe base for adventure",
        "Let adventure bring excitement to stable routines",
        "Agree on non-negotiable structures and flexible areas",
        "Appreciate each other's approach as complementary, not wrong"
      ],
      example: `Say: "Let's keep our weekday routines, and Saturdays are for spontaneous adventures. Best of both worlds."`
    };
  }

  // Default bridge for any combination
  return {
    challenge: "All constitutional differences require understanding and intentional bridging. Different doesn't mean incompatible - it means you get to learn each other.",
    solutions: [
      "Study each other's profiles together",
      "Share this love guidance with them",
      "Practice loving their way, not just your way",
      "Have weekly 'How We Love' check-ins",
      "Ask: 'What do you need from me?' regularly",
      "Remember: Nancy loved Ronald HIS way. He loved her HER way."
    ],
    example: "Have weekly 'How We Love' check-ins: 'Did you feel loved this week? What can I do better?'"
  };
}

/**
 * Get weekly love assignments based on both profiles
 * @param {Object} userProfile - The user's profile
 * @param {Object} partnerProfile - The partner's profile
 * @returns {Object} Weekly and monthly assignments
 */
export function getLoveAssignments(userProfile, partnerProfile) {
  const partnerNeeds = getConstitutionalNeeds(partnerProfile);
  const userNeeds = getConstitutionalNeeds(userProfile);

  return {
    weekly: [
      {
        task: "Do 1 thing from their 'How to Love Them' list",
        category: "giving",
        icon: "💝"
      },
      {
        task: "Share 1 item from 'Teach Them to Love You'",
        category: "receiving",
        icon: "📖"
      },
      {
        task: "Observe how they show love (their way)",
        category: "observing",
        icon: "👀"
      },
      {
        task: "Appreciate their love language out loud",
        category: "appreciating",
        icon: "🗣️"
      }
    ],
    monthly: [
      {
        task: "Have 'How We Love' conversation together",
        category: "connecting",
        icon: "💬"
      },
      {
        task: "Share your constitutional profiles with each other",
        category: "learning",
        icon: "📚"
      },
      {
        task: "Create 'Our Love Agreement' based on constitutions",
        category: "building",
        icon: "📜"
      },
      {
        task: "Practice loving their way + teaching your way",
        category: "growing",
        icon: "🌱"
      }
    ],
    specificToPartner: partnerNeeds.length > 0 ? partnerNeeds[0].actions.slice(0, 2) : [],
    specificToUser: userNeeds.length > 0 ? userNeeds[0].actions.slice(0, 2) : []
  };
}

export default {
  getConstitutionalNeeds,
  calculateLoveBridge,
  getLoveAssignments
};
