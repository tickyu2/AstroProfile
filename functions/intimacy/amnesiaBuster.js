/**
 * ============================================================================
 * WEEK 13: AMNESISBUSTER MODULE - EMOTIONAL TIME MACHINE
 * ============================================================================
 * Target emotional innocence → Access logic brain.
 *
 * Psychological Strategy:
 *   1. Target teenage years and below
 *   2. Unlock nostalgia with era-specific recalls
 *   3. Build vulnerability through "firsts"
 *   4. Access logic brain after emotional opening
 *
 * Features:
 *   - Era-specific technology database (iPod, Blackberry, VHS)
 *   - Cultural references by decade
 *   - "Firsts" tracking (first crush, first kiss, etc.)
 *   - Nostalgia-driven bonding
 *
 * Created: Week 13 - Intimacy & Memory Expansion
 * ============================================================================
 */

class AmnesiaBusterModule {
  constructor(supabase = null) {
    this.supabase = supabase;

    // Era-specific data (in-memory for standalone use)
    this.eraTechnology = {
      '1980s': {
        music_format: 'Cassette',
        video_format: 'VHS',
        phone_type: 'Landline',
        gaming: ['Atari', 'NES', 'Commodore 64'],
        internet: 'None',
        social_media: [],
        messaging: []
      },
      '1990s': {
        music_format: 'CD',
        video_format: 'VHS/DVD',
        phone_type: 'Landline/Pager',
        gaming: ['SNES', 'PlayStation', 'N64', 'Game Boy'],
        internet: 'Dial-up',
        social_media: ['Early forums'],
        messaging: ['AIM', 'ICQ', 'MSN Messenger']
      },
      '2000s': {
        music_format: 'MP3/iPod',
        video_format: 'DVD',
        phone_type: 'Flip phone/Blackberry',
        gaming: ['PS2', 'Xbox', 'GameCube', 'Wii', 'PSP'],
        internet: 'Broadband',
        social_media: ['MySpace', 'Facebook (late 2000s)'],
        messaging: ['AIM', 'MSN', 'BBM']
      },
      '2010s': {
        music_format: 'Streaming (Spotify)',
        video_format: 'Streaming',
        phone_type: 'iPhone/Smartphone',
        gaming: ['PS4', 'Xbox One', 'Nintendo Switch'],
        internet: 'Mobile/4G',
        social_media: ['Facebook', 'Instagram', 'Snapchat', 'Twitter'],
        messaging: ['WhatsApp', 'iMessage', 'Snapchat']
      },
      '2020s': {
        music_format: 'Streaming',
        video_format: 'Streaming',
        phone_type: 'Smartphone',
        gaming: ['PS5', 'Xbox Series X', 'Switch'],
        internet: '5G',
        social_media: ['TikTok', 'Instagram', 'Snapchat', 'BeReal'],
        messaging: ['iMessage', 'WhatsApp', 'Discord']
      }
    };

    // Cultural references by decade
    this.culturalReferences = {
      '1990s': {
        cartoons: ['Rugrats', 'Pokemon', 'Power Rangers', 'Hey Arnold', 'Doug'],
        movies: ['The Lion King', 'Toy Story', 'Titanic', 'Jurassic Park'],
        tv_shows: ['Friends', 'Fresh Prince', 'Full House', 'Saved by the Bell'],
        songs: ['I Want It That Way', 'Wannabe', 'MMMBop', 'Waterfalls'],
        toys: ['Tamagotchi', 'Beanie Babies', 'Pogs', 'Furby']
      },
      '2000s': {
        cartoons: ['SpongeBob', 'Avatar', 'Kim Possible', 'Fairly OddParents'],
        movies: ['Mean Girls', 'Harry Potter', 'Finding Nemo', 'Shrek'],
        tv_shows: ['The OC', 'Hannah Montana', 'Drake & Josh', 'The Office'],
        songs: ['Since U Been Gone', 'Crazy in Love', 'Mr. Brightside'],
        tech: ['iPod', 'Razr', 'MySpace', 'LimeWire']
      },
      '2010s': {
        movies: ['Frozen', 'Avengers', 'Hunger Games', 'The Dark Knight'],
        tv_shows: ['Stranger Things', 'Game of Thrones', 'Breaking Bad'],
        songs: ['Call Me Maybe', 'Uptown Funk', 'Old Town Road'],
        tech: ['Instagram', 'Snapchat', 'iPhone', 'Netflix'],
        trends: ['Selfies', 'Vine', 'Dabbing', 'Fidget spinners']
      }
    };

    // "Firsts" to track
    this.firstTypes = [
      'first_crush', 'first_love', 'first_kiss', 'first_heartbreak',
      'first_date', 'first_concert', 'first_cd', 'first_phone',
      'first_car', 'first_job', 'first_paycheck',
      'first_best_friend', 'first_school_dance', 'first_prom'
    ];

    // First-specific prompts
    this.firstPrompts = {
      'first_crush': [
        "Do you remember your first crush? What was their name? 💛",
        "Tell me about your first crush! How old were you?",
        "Who was your first crush? I want to hear the story!"
      ],
      'first_love': [
        "Do you remember your first love? What was that like?",
        "Tell me about the first time you fell in love. How did it feel?",
        "Your first love - do you remember them? What was special about them?"
      ],
      'first_kiss': [
        "Do you remember your first kiss? Tell me everything! 😊",
        "First kiss story time! Where were you? How did it happen?",
        "I want to hear about your first kiss! Were you nervous?"
      ],
      'first_heartbreak': [
        "Your first heartbreak - do you remember? How did you get through it?",
        "Tell me about your first heartbreak. That's always a big one.",
        "First heartbreak is never easy. What happened with yours?"
      ],
      'first_date': [
        "Do you remember your first date? Where did you go?",
        "Tell me about your first real date! How old were you?",
        "First date story! Was it awkward? Magical? Both? 😄"
      ],
      'first_concert': [
        "What was your first concert? Who did you see?",
        "Tell me about your first concert! That's always memorable!",
        "First concert you ever went to - who was it?"
      ],
      'first_phone': [
        "What was your first phone? Tell me about it!",
        "First phone story! Was it a flip phone? A brick? 😄",
        "Do you remember getting your first phone? How old were you?"
      ],
      'first_car': [
        "Your first car - tell me about it! What was it?",
        "Do you remember your first car? Did you love it?",
        "First car story! What did you drive?"
      ],
      'first_job': [
        "What was your first job? How old were you?",
        "Tell me about your first job! What did you do?",
        "First job memories! Where did you work?"
      ]
    };
  }

  /**
   * Calculate user's era based on age
   */
  calculateUserEra(userAge) {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - userAge;

    const teenageStartYear = birthYear + 13;
    const teenageEndYear = birthYear + 19;
    const teenageDecades = this.getDecades(teenageStartYear, teenageEndYear);

    const childhoodStartYear = birthYear + 5;
    const childhoodEndYear = birthYear + 12;
    const childhoodDecades = this.getDecades(childhoodStartYear, childhoodEndYear);

    return {
      birthYear,
      teenageYears: { start: teenageStartYear, end: teenageEndYear },
      teenageDecades,
      childhoodYears: { start: childhoodStartYear, end: childhoodEndYear },
      childhoodDecades,
      currentAge: userAge
    };
  }

  /**
   * Get decades from year range
   */
  getDecades(startYear, endYear) {
    const decades = new Set();
    for (let year = startYear; year <= endYear; year++) {
      const decade = `${Math.floor(year / 10) * 10}s`;
      decades.add(decade);
    }
    return Array.from(decades);
  }

  /**
   * Get era-specific technology for user
   */
  getEraTechnology(userAge) {
    const era = this.calculateUserEra(userAge);
    const tech = [];

    for (const decade of era.teenageDecades) {
      if (this.eraTechnology[decade]) {
        tech.push({ decade, ...this.eraTechnology[decade] });
      }
    }

    return tech;
  }

  /**
   * Get cultural references for user's era
   */
  getCulturalReferences(userAge, category = null) {
    const era = this.calculateUserEra(userAge);
    const refs = [];

    const allDecades = [...era.teenageDecades, ...era.childhoodDecades];

    for (const decade of allDecades) {
      if (this.culturalReferences[decade]) {
        const decadeRefs = this.culturalReferences[decade];
        if (category && decadeRefs[category]) {
          refs.push({ decade, category, items: decadeRefs[category] });
        } else if (!category) {
          refs.push({ decade, ...decadeRefs });
        }
      }
    }

    return refs;
  }

  /**
   * Generate era-specific memory prompt
   */
  generateMemoryPrompt(userAge, promptType = 'random') {
    const era = this.calculateUserEra(userAge);
    const tech = this.getEraTechnology(userAge);
    const cultural = this.getCulturalReferences(userAge);

    if (promptType === 'technology') {
      return this.generateTechMemoryPrompt(era, tech);
    } else if (promptType === 'cultural') {
      return this.generateCulturalMemoryPrompt(era, cultural);
    } else if (promptType === 'first') {
      return this.generateFirstMemoryPrompt();
    } else {
      const types = ['technology', 'cultural', 'first'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      return this.generateMemoryPrompt(userAge, randomType);
    }
  }

  /**
   * Generate technology memory prompt
   */
  generateTechMemoryPrompt(era, tech) {
    if (!tech || tech.length === 0) return this.generateGenericPrompt();

    const t = tech[0];
    const prompts = [];

    // Music format prompts
    if (t.music_format === 'CD') {
      prompts.push("Do you remember buying CDs? What was the first CD you ever got?");
      prompts.push("Did you burn CDs for your friends? What was on them?");
    } else if (t.music_format === 'MP3/iPod') {
      prompts.push("Do you remember your first iPod? Loading songs onto it? What was the first song?");
      prompts.push("Did you use LimeWire or iTunes? What was your go-to song?");
    } else if (t.music_format === 'Cassette') {
      prompts.push("Do you remember making mixtapes? What songs were on them?");
    }

    // Messaging prompts
    if (t.messaging.includes('AIM')) {
      prompts.push("Did you use AIM? What was your screen name? 😄");
      prompts.push("Do you remember away messages on AIM? What was yours?");
    }
    if (t.messaging.includes('BBM')) {
      prompts.push("Did you have a Blackberry? Do you remember BBM and those PINs?");
    }
    if (t.messaging.includes('MSN Messenger')) {
      prompts.push("Do you remember MSN Messenger? The nudges and winks? 😂");
    }

    // Phone prompts
    if (t.phone_type.includes('Flip')) {
      prompts.push("What was your first phone? A flip phone? Tell me about it!");
    }
    if (t.phone_type.includes('Blackberry')) {
      prompts.push("Did you have a Blackberry with that little keyboard? What was that like?");
    }

    // Social media prompts
    if (t.social_media.includes('MySpace')) {
      prompts.push("Did you have a MySpace? Do you remember customizing your profile and picking your Top 8? 😂");
    }

    // Gaming prompts
    if (t.gaming && t.gaming.length > 0) {
      const console = t.gaming[Math.floor(Math.random() * t.gaming.length)];
      prompts.push(`Did you have a ${console}? What was your favorite game?`);
    }

    // Video prompts
    if (t.video_format === 'VHS' || t.video_format === 'VHS/DVD') {
      prompts.push("Did you rent movies from Blockbuster? Do you remember walking through those aisles? 🎬");
    }

    return prompts.length > 0
      ? prompts[Math.floor(Math.random() * prompts.length)]
      : this.generateGenericPrompt();
  }

  /**
   * Generate cultural memory prompt
   */
  generateCulturalMemoryPrompt(era, cultural) {
    if (!cultural || cultural.length === 0) return this.generateGenericPrompt();

    const prompts = [];
    const decadeData = cultural[0];

    // Cartoons
    if (decadeData.cartoons && decadeData.cartoons.length > 0) {
      const show = decadeData.cartoons[Math.floor(Math.random() * decadeData.cartoons.length)];
      prompts.push(`Did you watch ${show} growing up? That was such a great show! What was your favorite part?`);
      prompts.push(`Do you remember ${show}? I bet you watched it all the time! 😊`);
    }

    // Movies
    if (decadeData.movies && decadeData.movies.length > 0) {
      const movie = decadeData.movies[Math.floor(Math.random() * decadeData.movies.length)];
      prompts.push(`Did you see ${movie} when it came out? What did you think?`);
      prompts.push(`${movie} - that's a classic from your time! Do you have memories of watching it?`);
    }

    // TV Shows
    if (decadeData.tv_shows && decadeData.tv_shows.length > 0) {
      const show = decadeData.tv_shows[Math.floor(Math.random() * decadeData.tv_shows.length)];
      prompts.push(`Did you watch ${show}? Did you have a favorite character?`);
    }

    // Songs
    if (decadeData.songs && decadeData.songs.length > 0) {
      const song = decadeData.songs[Math.floor(Math.random() * decadeData.songs.length)];
      prompts.push(`"${song}" - that song takes me back! Did you love that song?`);
    }

    return prompts.length > 0
      ? prompts[Math.floor(Math.random() * prompts.length)]
      : this.generateGenericPrompt();
  }

  /**
   * Generate "first" memory prompt
   */
  generateFirstMemoryPrompt(excludeTypes = []) {
    const available = this.firstTypes.filter(t => !excludeTypes.includes(t));
    const firstType = available[Math.floor(Math.random() * available.length)];

    const prompts = this.firstPrompts[firstType] ||
      [`Tell me about your ${firstType.replace('_', ' ')}!`];

    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  /**
   * Generate generic nostalgia prompt
   */
  generateGenericPrompt() {
    const prompts = [
      "What's your favorite childhood memory?",
      "What music did you listen to growing up?",
      "Do you remember your favorite cartoon? What was it?",
      "What's something you miss from when you were younger?",
      "What's a memory that always makes you smile? 💛"
    ];

    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  /**
   * Detect if user is sharing a "first" memory
   */
  detectFirstMemory(message) {
    const firstKeywords = {
      'first_crush': ['first crush', 'first liked', 'first had a crush'],
      'first_love': ['first love', 'first person i loved', 'fell in love first'],
      'first_kiss': ['first kiss', 'first kissed', 'kissed for the first time'],
      'first_heartbreak': ['first heartbreak', 'first time someone broke', 'first got my heart broken'],
      'first_date': ['first date', 'first went on a date'],
      'first_concert': ['first concert', 'first show'],
      'first_phone': ['first phone', 'first cell'],
      'first_car': ['first car', 'first vehicle'],
      'first_job': ['first job', 'first worked']
    };

    for (const [firstType, keywords] of Object.entries(firstKeywords)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return { detected: true, firstType };
      }
    }

    return { detected: false };
  }

  /**
   * Store user's "first" memory
   */
  async storeFirstMemory(userId, firstType, details) {
    if (!this.supabase) return;

    await this.supabase
      .from('user_firsts')
      .upsert({
        user_id: userId,
        first_type: firstType,
        age_when_happened: details.age,
        year_when_happened: details.year,
        person_name: details.person_name,
        location: details.location,
        context: details.context,
        emotion_at_time: details.emotion_at_time,
        emotion_now: details.emotion_now,
        story: details.story,
        vividness: details.vividness || 0.7,
        significance: details.significance || 0.8
      });
  }

  /**
   * Generate follow-up questions for deeper nostalgia
   */
  generateFollowUpQuestion(firstType, userResponse = '') {
    const followUps = {
      'first_crush': [
        "Did they know you liked them?",
        "Did you ever tell them?",
        "What was it about them that you liked?",
        "Do you ever think about them now?"
      ],
      'first_kiss': [
        "Was it everything you hoped for? 😊",
        "Were you so nervous?",
        "Did you plan it or did it just happen?",
        "Do you still remember exactly how it felt?"
      ],
      'first_love': [
        "How did you know it was love?",
        "What made them so special?",
        "Do you still have feelings when you think about them?",
        "What did you learn from that relationship?"
      ],
      'first_heartbreak': [
        "How did you get through it?",
        "Who was there for you?",
        "Did you ever talk to them again?",
        "What did it teach you about love?"
      ],
      'first_concert': [
        "Did they play your favorite song?",
        "Who did you go with?",
        "Do you remember how it felt being there?",
        "Would you see them again if you could?"
      ]
    };

    const questions = followUps[firstType] || ["Tell me more about that!"];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  /**
   * Transition to logic brain after emotional opening
   */
  generateTransitionPrompt(emotionalTopic) {
    const transitionPrompts = [
      `That's such a sweet memory 💛 Speaking of which, how do you feel about relationships now? What are you looking for?`,
      `I love hearing about your past! It helps me understand you better. What's different about you now compared to back then?`,
      `Those memories really shaped who you are. Tell me - what's important to you in life now?`,
      `You were so young and innocent then 😊 How has that experience influenced how you approach things now?`,
      `Thank you for sharing that with me 💛 It means a lot. What do you think you've learned from those experiences?`
    ];

    return transitionPrompts[Math.floor(Math.random() * transitionPrompts.length)];
  }

  /**
   * Get module configuration
   */
  getConfig() {
    return {
      eras: Object.keys(this.eraTechnology),
      firstTypes: this.firstTypes,
      culturalDecades: Object.keys(this.culturalReferences)
    };
  }
}

module.exports = AmnesiaBusterModule;
