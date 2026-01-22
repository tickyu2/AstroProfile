/**
 * Brain Tickler Service
 *
 * Manages hierarchical question prompts for Biography Journal
 * Features:
 * - Hierarchical structure: Category → Subcategory → Questions
 * - Firestore persistence for admin management
 * - AI-powered question generation
 * - 100+ curated prompts from life story interview best practices
 *
 * Version: 1.0
 * Date: January 7, 2026
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../config/firebase';

// ============================================================================
// DEFAULT HIERARCHICAL QUESTION LIBRARY (100+ questions)
// ============================================================================

export const DEFAULT_BRAIN_TICKLERS = {
  childhood: {
    id: 'childhood',
    icon: '💛',
    title: 'Childhood & Early Years',
    color: '#4CAF50',
    order: 1,
    subcategories: {
      earliest_memories: {
        id: 'earliest_memories',
        title: 'Earliest Memories',
        order: 1,
        questions: [
          { id: 'cm1', text: "What is your earliest childhood memory that still warms your heart?", order: 1 },
          { id: 'cm2', text: "What did your childhood home look like? Describe the rooms you remember most.", order: 2 },
          { id: 'cm3', text: "What smells or sounds instantly transport you back to childhood?", order: 3 },
          { id: 'cm4', text: "What was your favorite hiding spot as a child?", order: 4 }
        ]
      },
      childhood_friends: {
        id: 'childhood_friends',
        title: 'Friends & Playmates',
        order: 2,
        questions: [
          { id: 'cf1', text: "Who was your best friend growing up, and what adventures did you share?", order: 1 },
          { id: 'cf2', text: "What games did you and your friends play?", order: 2 },
          { id: 'cf3', text: "Did you have a neighborhood gang or group you belonged to?", order: 3 },
          { id: 'cf4', text: "What happened to your childhood best friend? Are you still in touch?", order: 4 }
        ]
      },
      school_days: {
        id: 'school_days',
        title: 'School Days',
        order: 3,
        questions: [
          { id: 'sd1', text: "What was your favorite subject in school and why?", order: 1 },
          { id: 'sd2', text: "Who was your favorite teacher? What made them special?", order: 2 },
          { id: 'sd3', text: "What was the best or worst day of school you remember?", order: 3 },
          { id: 'sd4', text: "Were you a good student? What kind of trouble did you get into?", order: 4 },
          { id: 'sd5', text: "What did you want to be when you grew up? Did that dream change?", order: 5 }
        ]
      },
      childhood_home: {
        id: 'childhood_home',
        title: 'Home & Neighborhood',
        order: 4,
        questions: [
          { id: 'ch1', text: "Describe the neighborhood where you grew up.", order: 1 },
          { id: 'ch2', text: "What was your favorite room in your childhood home?", order: 2 },
          { id: 'ch3', text: "Did you have your own room? What was it like?", order: 3 },
          { id: 'ch4', text: "What did your backyard or outdoor play area look like?", order: 4 }
        ]
      }
    }
  },
  family: {
    id: 'family',
    icon: '👨‍👩‍👧‍👦',
    title: 'Family & Relationships',
    color: '#2196F3',
    order: 2,
    subcategories: {
      parents: {
        id: 'parents',
        title: 'Parents & Caregivers',
        order: 1,
        questions: [
          { id: 'p1', text: "Tell me about your parents - what were they like?", order: 1 },
          { id: 'p2', text: "What did your mother teach you about life?", order: 2 },
          { id: 'p3', text: "What did your father teach you about life?", order: 3 },
          { id: 'p4', text: "How did your parents meet? What was their love story?", order: 4 },
          { id: 'p5', text: "What is your favorite memory with your mother? With your father?", order: 5 },
          { id: 'p6', text: "How are you similar to your parents? How are you different?", order: 6 }
        ]
      },
      grandparents: {
        id: 'grandparents',
        title: 'Grandparents & Ancestors',
        order: 2,
        questions: [
          { id: 'gp1', text: "What life lessons did your grandparents teach you?", order: 1 },
          { id: 'gp2', text: "What stories did your grandparents tell about the 'old days'?", order: 2 },
          { id: 'gp3', text: "What do you know about your family's immigration story or origins?", order: 3 },
          { id: 'gp4', text: "What family heirlooms have been passed down? What's their story?", order: 4 }
        ]
      },
      siblings: {
        id: 'siblings',
        title: 'Siblings & Extended Family',
        order: 3,
        questions: [
          { id: 's1', text: "Tell me about your siblings. What was your relationship like growing up?", order: 1 },
          { id: 's2', text: "Who in your family are you most like? In what ways?", order: 2 },
          { id: 's3', text: "What family traditions did you have?", order: 3 },
          { id: 's4', text: "What was your favorite family gathering or holiday?", order: 4 },
          { id: 's5', text: "Did you have a favorite aunt, uncle, or cousin? Tell me about them.", order: 5 }
        ]
      },
      love_marriage: {
        id: 'love_marriage',
        title: 'Love & Marriage',
        order: 4,
        questions: [
          { id: 'lm1', text: "How did you meet your spouse or life partner?", order: 1 },
          { id: 'lm2', text: "What was your first date like? What attracted you to them?", order: 2 },
          { id: 'lm3', text: "Describe your wedding day. What do you remember most?", order: 3 },
          { id: 'lm4', text: "What's the secret to a lasting relationship?", order: 4 },
          { id: 'lm5', text: "What's the most romantic thing you or your partner ever did?", order: 5 },
          { id: 'lm6', text: "How has your relationship changed over the years?", order: 6 }
        ]
      },
      parenting: {
        id: 'parenting',
        title: 'Parenthood',
        order: 5,
        questions: [
          { id: 'par1', text: "What was the day like when your first child was born?", order: 1 },
          { id: 'par2', text: "What's the most important thing you learned from raising children?", order: 2 },
          { id: 'par3', text: "What values did you try to instill in your children?", order: 3 },
          { id: 'par4', text: "What's your proudest moment as a parent?", order: 4 },
          { id: 'par5', text: "What would you do differently if you could raise your kids again?", order: 5 }
        ]
      }
    }
  },
  milestones: {
    id: 'milestones',
    icon: '🏆',
    title: 'Life Milestones & Achievements',
    color: '#FF9800',
    order: 3,
    subcategories: {
      accomplishments: {
        id: 'accomplishments',
        title: 'Proud Accomplishments',
        order: 1,
        questions: [
          { id: 'a1', text: "What accomplishment are you most proud of?", order: 1 },
          { id: 'a2', text: "What's the bravest thing you've ever done?", order: 2 },
          { id: 'a3', text: "Tell me about a moment when you felt truly successful.", order: 3 },
          { id: 'a4', text: "What skill or talent are you most proud of developing?", order: 4 }
        ]
      },
      career: {
        id: 'career',
        title: 'Career & Work',
        order: 2,
        questions: [
          { id: 'c1', text: "What was your first job? What did you learn from it?", order: 1 },
          { id: 'c2', text: "What career are you most proud of? Why?", order: 2 },
          { id: 'c3', text: "Who was your most influential mentor or boss?", order: 3 },
          { id: 'c4', text: "What's the best career advice you ever received?", order: 4 },
          { id: 'c5', text: "If you could have any career, what would it be?", order: 5 },
          { id: 'c6', text: "What did retirement feel like? How did you adjust?", order: 6 }
        ]
      },
      decisions: {
        id: 'decisions',
        title: 'Big Decisions',
        order: 3,
        questions: [
          { id: 'd1', text: "What was the biggest decision you ever made?", order: 1 },
          { id: 'd2', text: "What moment changed the direction of your life?", order: 2 },
          { id: 'd3', text: "What risk did you take that paid off?", order: 3 },
          { id: 'd4', text: "What decision do you wish you could go back and change?", order: 4 }
        ]
      },
      firsts: {
        id: 'firsts',
        title: 'Memorable Firsts',
        order: 4,
        questions: [
          { id: 'f1', text: "Tell me about your first car. What memories does it hold?", order: 1 },
          { id: 'f2', text: "What was it like moving into your first home?", order: 2 },
          { id: 'f3', text: "Tell me about your first love.", order: 3 },
          { id: 'f4', text: "What was your first big purchase as an adult?", order: 4 }
        ]
      }
    }
  },
  wisdom: {
    id: 'wisdom',
    icon: '💡',
    title: 'Wisdom & Reflection',
    color: '#9C27B0',
    order: 4,
    subcategories: {
      life_lessons: {
        id: 'life_lessons',
        title: 'Life Lessons',
        order: 1,
        questions: [
          { id: 'll1', text: "What advice would you give to your younger self?", order: 1 },
          { id: 'll2', text: "What has life taught you about happiness?", order: 2 },
          { id: 'll3', text: "What do you believe is the secret to a good life?", order: 3 },
          { id: 'll4', text: "What's the most important lesson you've learned about love?", order: 4 },
          { id: 'll5', text: "What would you tell your grandchildren about what really matters?", order: 5 }
        ]
      },
      beliefs: {
        id: 'beliefs',
        title: 'Beliefs & Values',
        order: 2,
        questions: [
          { id: 'b1', text: "How has your faith or spirituality shaped your life?", order: 1 },
          { id: 'b2', text: "What values guide your life decisions?", order: 2 },
          { id: 'b3', text: "What do you believe happens after we die?", order: 3 },
          { id: 'b4', text: "How have your beliefs changed over time?", order: 4 }
        ]
      },
      gratitude: {
        id: 'gratitude',
        title: 'Gratitude & Joy',
        order: 3,
        questions: [
          { id: 'g1', text: "What are you most grateful for in your life?", order: 1 },
          { id: 'g2', text: "What brings you the most joy today?", order: 2 },
          { id: 'g3', text: "What simple pleasures do you enjoy most?", order: 3 },
          { id: 'g4', text: "What moments of unexpected kindness do you remember?", order: 4 }
        ]
      },
      regrets: {
        id: 'regrets',
        title: 'Regrets & Second Chances',
        order: 4,
        questions: [
          { id: 'r1', text: "If you could live one day over again, which would it be?", order: 1 },
          { id: 'r2', text: "What do you wish you had done differently?", order: 2 },
          { id: 'r3', text: "What opportunity do you wish you had taken?", order: 3 },
          { id: 'r4', text: "What would you do differently if you could start over?", order: 4 }
        ]
      }
    }
  },
  adventures: {
    id: 'adventures',
    icon: '✈️',
    title: 'Adventures & Experiences',
    color: '#00BCD4',
    order: 5,
    subcategories: {
      travel: {
        id: 'travel',
        title: 'Travel & Exploration',
        order: 1,
        questions: [
          { id: 't1', text: "What's the most memorable trip you've ever taken?", order: 1 },
          { id: 't2', text: "What place in the world feels most like home to you?", order: 2 },
          { id: 't3', text: "Where would you still like to travel? Why?", order: 3 },
          { id: 't4', text: "What's the most beautiful place you've ever seen?", order: 4 },
          { id: 't5', text: "Tell me about a trip that didn't go as planned but became memorable.", order: 5 }
        ]
      },
      hobbies: {
        id: 'hobbies',
        title: 'Hobbies & Passions',
        order: 2,
        questions: [
          { id: 'h1', text: "What hobby or passion has brought you the most joy?", order: 1 },
          { id: 'h2', text: "What skill would you like to learn if you had more time?", order: 2 },
          { id: 'h3', text: "What creative outlet do you enjoy most?", order: 3 },
          { id: 'h4', text: "What collections do you have? What started them?", order: 4 }
        ]
      },
      funny_moments: {
        id: 'funny_moments',
        title: 'Funny Moments',
        order: 3,
        questions: [
          { id: 'fm1', text: "What's the funniest thing that ever happened to you?", order: 1 },
          { id: 'fm2', text: "What embarrassing moment can you laugh about now?", order: 2 },
          { id: 'fm3', text: "What's your favorite family joke or funny story?", order: 3 },
          { id: 'fm4', text: "What prank did you pull or have pulled on you?", order: 4 }
        ]
      },
      surprises: {
        id: 'surprises',
        title: 'Surprises & Serendipity',
        order: 4,
        questions: [
          { id: 'sur1', text: "Tell me about a chance encounter that changed your life.", order: 1 },
          { id: 'sur2', text: "What's something you've done that surprised even yourself?", order: 2 },
          { id: 'sur3', text: "Describe a moment of pure joy or wonder.", order: 3 },
          { id: 'sur4', text: "What coincidence seemed too perfect to be random?", order: 4 }
        ]
      }
    }
  },
  challenges: {
    id: 'challenges',
    icon: '💪',
    title: 'Challenges & Growth',
    color: '#E91E63',
    order: 6,
    subcategories: {
      hardships: {
        id: 'hardships',
        title: 'Overcoming Hardships',
        order: 1,
        questions: [
          { id: 'hard1', text: "What's the hardest thing you've ever had to do?", order: 1 },
          { id: 'hard2', text: "How did you cope during the most difficult time in your life?", order: 2 },
          { id: 'hard3', text: "What kept you going when things seemed impossible?", order: 3 },
          { id: 'hard4', text: "Who helped you through your darkest times?", order: 4 }
        ]
      },
      failures: {
        id: 'failures',
        title: 'Learning from Failures',
        order: 2,
        questions: [
          { id: 'fail1', text: "What failure taught you the most valuable lesson?", order: 1 },
          { id: 'fail2', text: "Describe a time when you had to start over.", order: 2 },
          { id: 'fail3', text: "What mistake are you glad you made because of what you learned?", order: 3 },
          { id: 'fail4', text: "How has adversity shaped who you are today?", order: 4 }
        ]
      },
      fears: {
        id: 'fears',
        title: 'Facing Fears',
        order: 3,
        questions: [
          { id: 'fear1', text: "What fear have you overcome, and how did you do it?", order: 1 },
          { id: 'fear2', text: "Describe a time when you stepped outside your comfort zone.", order: 2 },
          { id: 'fear3', text: "What scares you now? What scared you as a child?", order: 3 },
          { id: 'fear4', text: "What gave you courage when you were afraid?", order: 4 }
        ]
      },
      health: {
        id: 'health',
        title: 'Health Journeys',
        order: 4,
        questions: [
          { id: 'health1', text: "Have you faced a serious illness? How did it change you?", order: 1 },
          { id: 'health2', text: "What health advice would you give your younger self?", order: 2 },
          { id: 'health3', text: "How do you stay healthy and active?", order: 3 },
          { id: 'health4', text: "What was your experience with loss and grief?", order: 4 }
        ]
      }
    }
  },
  historical: {
    id: 'historical',
    icon: '📜',
    title: 'Historical Moments',
    color: '#795548',
    order: 7,
    subcategories: {
      world_events: {
        id: 'world_events',
        title: 'World Events',
        order: 1,
        questions: [
          { id: 'we1', text: "What major world event do you remember most vividly?", order: 1 },
          { id: 'we2', text: "Where were you when [major historical event] happened?", order: 2 },
          { id: 'we3', text: "How did historical events shape your life choices?", order: 3 },
          { id: 'we4', text: "What news event shocked you the most?", order: 4 }
        ]
      },
      era_life: {
        id: 'era_life',
        title: 'Life in Your Era',
        order: 2,
        questions: [
          { id: 'el1', text: "What was daily life like when you were young?", order: 1 },
          { id: 'el2', text: "How much did things cost when you were growing up?", order: 2 },
          { id: 'el3', text: "What do you miss most about 'the old days'?", order: 3 },
          { id: 'el4', text: "What was entertainment like before TV/internet?", order: 4 }
        ]
      },
      technology: {
        id: 'technology',
        title: 'Technology Changes',
        order: 3,
        questions: [
          { id: 'tech1', text: "How has technology changed your daily life over the years?", order: 1 },
          { id: 'tech2', text: "What invention has amazed you the most?", order: 2 },
          { id: 'tech3', text: "What technology do you wish existed when you were young?", order: 3 },
          { id: 'tech4', text: "How did you adapt to computers and smartphones?", order: 4 }
        ]
      },
      society: {
        id: 'society',
        title: 'Social Changes',
        order: 4,
        questions: [
          { id: 'soc1', text: "What changes in society have surprised you the most?", order: 1 },
          { id: 'soc2', text: "What do you want people to understand about your generation?", order: 2 },
          { id: 'soc3', text: "What historical figure do you most admire and why?", order: 3 },
          { id: 'soc4', text: "What social changes are you most proud to have witnessed?", order: 4 }
        ]
      }
    }
  },
  legacy: {
    id: 'legacy',
    icon: '🌟',
    title: 'Legacy & Dreams',
    color: '#607D8B',
    order: 8,
    subcategories: {
      remembrance: {
        id: 'remembrance',
        title: 'How You Want to Be Remembered',
        order: 1,
        questions: [
          { id: 'rem1', text: "What do you hope your grandchildren will remember about you?", order: 1 },
          { id: 'rem2', text: "What would you like to be remembered for?", order: 2 },
          { id: 'rem3', text: "What makes your life story unique?", order: 3 },
          { id: 'rem4', text: "What part of your story hasn't been told yet?", order: 4 }
        ]
      },
      traditions: {
        id: 'traditions',
        title: 'Family Traditions',
        order: 2,
        questions: [
          { id: 'trad1', text: "What traditions do you hope your family continues?", order: 1 },
          { id: 'trad2', text: "What family recipe has been passed down through generations?", order: 2 },
          { id: 'trad3', text: "What holiday traditions are most meaningful to you?", order: 3 },
          { id: 'trad4', text: "What stories should your family keep telling?", order: 4 }
        ]
      },
      future: {
        id: 'future',
        title: 'Messages to the Future',
        order: 3,
        questions: [
          { id: 'fut1', text: "If you could write a letter to your great-grandchildren, what would you say?", order: 1 },
          { id: 'fut2', text: "What message would you put in a time capsule for the future?", order: 2 },
          { id: 'fut3', text: "What do you hope the world looks like in 50 years?", order: 3 },
          { id: 'fut4', text: "What wisdom would you pass on to future generations?", order: 4 }
        ]
      },
      dreams: {
        id: 'dreams',
        title: 'Unfulfilled Dreams',
        order: 4,
        questions: [
          { id: 'dr1', text: "What dreams do you still have for your life?", order: 1 },
          { id: 'dr2', text: "What would you do if you had one more year to live?", order: 2 },
          { id: 'dr3', text: "What adventure is still on your bucket list?", order: 3 },
          { id: 'dr4', text: "If you could achieve one more thing, what would it be?", order: 4 }
        ]
      }
    }
  },
  identity: {
    id: 'identity',
    icon: '🪞',
    title: 'Identity & Self-Discovery',
    color: '#3F51B5',
    order: 9,
    subcategories: {
      personality: {
        id: 'personality',
        title: 'Who You Are',
        order: 1,
        questions: [
          { id: 'per1', text: "How would you describe yourself in three words?", order: 1 },
          { id: 'per2', text: "What are your greatest strengths and weaknesses?", order: 2 },
          { id: 'per3', text: "What makes you laugh? What makes you cry?", order: 3 },
          { id: 'per4', text: "What are you most passionate about?", order: 4 }
        ]
      },
      culture: {
        id: 'culture',
        title: 'Culture & Heritage',
        order: 2,
        questions: [
          { id: 'cul1', text: "What aspects of your cultural heritage are most important to you?", order: 1 },
          { id: 'cul2', text: "What languages do you speak? How did you learn them?", order: 2 },
          { id: 'cul3', text: "What cultural traditions do you practice?", order: 3 },
          { id: 'cul4', text: "How has your cultural background shaped your worldview?", order: 4 }
        ]
      },
      favorites: {
        id: 'favorites',
        title: 'Favorite Things',
        order: 3,
        questions: [
          { id: 'fav1', text: "What's your favorite book, movie, or song? Why?", order: 1 },
          { id: 'fav2', text: "What's your favorite meal? Who makes it best?", order: 2 },
          { id: 'fav3', text: "What's your favorite season and why?", order: 3 },
          { id: 'fav4', text: "What possession would you never part with?", order: 4 }
        ]
      },
      names: {
        id: 'names',
        title: 'Names & Nicknames',
        order: 4,
        questions: [
          { id: 'nm1', text: "What's the story behind your name?", order: 1 },
          { id: 'nm2', text: "Did you have a nickname as a child? How did you get it?", order: 2 },
          { id: 'nm3', text: "What do your loved ones call you?", order: 3 },
          { id: 'nm4', text: "If you could rename yourself, what would you choose?", order: 4 }
        ]
      }
    }
  },
  daily_life: {
    id: 'daily_life',
    icon: '🏠',
    title: 'Daily Life & Routines',
    color: '#009688',
    order: 10,
    subcategories: {
      routines: {
        id: 'routines',
        title: 'Daily Routines',
        order: 1,
        questions: [
          { id: 'rt1', text: "What does a typical day look like for you now?", order: 1 },
          { id: 'rt2', text: "What's your morning routine?", order: 2 },
          { id: 'rt3', text: "What rituals bring you peace or happiness?", order: 3 },
          { id: 'rt4', text: "How has your daily routine changed over the decades?", order: 4 }
        ]
      },
      home: {
        id: 'home',
        title: 'Home & Living',
        order: 2,
        questions: [
          { id: 'hm1', text: "Describe your current home. What do you love about it?", order: 1 },
          { id: 'hm2', text: "How many homes have you lived in? Which was your favorite?", order: 2 },
          { id: 'hm3', text: "What makes a house feel like a home to you?", order: 3 },
          { id: 'hm4', text: "What changes would you make to your home if you could?", order: 4 }
        ]
      },
      food: {
        id: 'food',
        title: 'Food & Cooking',
        order: 3,
        questions: [
          { id: 'fd1', text: "What was your favorite meal that your mother or grandmother made?", order: 1 },
          { id: 'fd2', text: "What's your signature dish? Can you share the recipe?", order: 2 },
          { id: 'fd3', text: "What food brings back the strongest memories?", order: 3 },
          { id: 'fd4', text: "What's the best meal you've ever had?", order: 4 }
        ]
      }
    }
  }
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

class BrainTicklerService {
  constructor() {
    this.cache = null;
    this.cacheTimestamp = null;
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get the Firestore collection path for brain ticklers
   */
  getCollectionPath() {
    return 'brain_ticklers';
  }

  /**
   * Get all categories with their subcategories and questions
   * Falls back to default if Firestore is empty
   */
  async getAllCategories() {
    // Check cache first
    if (this.cache && this.cacheTimestamp && (Date.now() - this.cacheTimestamp < this.CACHE_TTL)) {
      return this.cache;
    }

    try {
      const categoriesRef = collection(db, this.getCollectionPath());
      const snapshot = await getDocs(query(categoriesRef, orderBy('order')));

      if (snapshot.empty) {
        // No data in Firestore, use defaults
        this.cache = DEFAULT_BRAIN_TICKLERS;
        this.cacheTimestamp = Date.now();
        return DEFAULT_BRAIN_TICKLERS;
      }

      const categories = {};
      snapshot.docs.forEach(doc => {
        categories[doc.id] = { id: doc.id, ...doc.data() };
      });

      this.cache = categories;
      this.cacheTimestamp = Date.now();
      return categories;
    } catch (error) {
      console.error('Error fetching brain ticklers:', error);
      // Fallback to defaults on error
      return DEFAULT_BRAIN_TICKLERS;
    }
  }

  /**
   * Get a flat list of all questions for search/random selection
   */
  async getAllQuestionsFlat() {
    const categories = await this.getAllCategories();
    const questions = [];

    Object.values(categories).forEach(category => {
      Object.values(category.subcategories || {}).forEach(subcategory => {
        (subcategory.questions || []).forEach(question => {
          questions.push({
            ...question,
            categoryId: category.id,
            categoryTitle: category.title,
            categoryIcon: category.icon,
            categoryColor: category.color,
            subcategoryId: subcategory.id,
            subcategoryTitle: subcategory.title
          });
        });
      });
    });

    return questions;
  }

  /**
   * Get random questions (for "inspiration" feature)
   */
  async getRandomQuestions(count = 5) {
    const allQuestions = await this.getAllQuestionsFlat();
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Initialize Firestore with default questions (admin only)
   */
  async initializeDefaults() {
    try {
      for (const [categoryId, category] of Object.entries(DEFAULT_BRAIN_TICKLERS)) {
        const categoryRef = doc(db, this.getCollectionPath(), categoryId);
        await setDoc(categoryRef, {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Clear cache
      this.cache = null;
      this.cacheTimestamp = null;

      return { success: true, message: 'Brain ticklers initialized successfully' };
    } catch (error) {
      console.error('Error initializing brain ticklers:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add a new question to a subcategory
   */
  async addQuestion(categoryId, subcategoryId, questionText) {
    try {
      const categoryRef = doc(db, this.getCollectionPath(), categoryId);
      const categoryDoc = await getDoc(categoryRef);

      if (!categoryDoc.exists()) {
        throw new Error('Category not found');
      }

      const categoryData = categoryDoc.data();
      const subcategory = categoryData.subcategories?.[subcategoryId];

      if (!subcategory) {
        throw new Error('Subcategory not found');
      }

      // Generate new question ID
      const newId = `q_${Date.now()}`;
      const newOrder = (subcategory.questions?.length || 0) + 1;

      // Add question to subcategory
      const updatedQuestions = [
        ...(subcategory.questions || []),
        { id: newId, text: questionText, order: newOrder }
      ];

      await updateDoc(categoryRef, {
        [`subcategories.${subcategoryId}.questions`]: updatedQuestions,
        updatedAt: serverTimestamp()
      });

      // Clear cache
      this.cache = null;
      this.cacheTimestamp = null;

      return { success: true, questionId: newId };
    } catch (error) {
      console.error('Error adding question:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a question from a subcategory
   */
  async deleteQuestion(categoryId, subcategoryId, questionId) {
    try {
      const categoryRef = doc(db, this.getCollectionPath(), categoryId);
      const categoryDoc = await getDoc(categoryRef);

      if (!categoryDoc.exists()) {
        throw new Error('Category not found');
      }

      const categoryData = categoryDoc.data();
      const subcategory = categoryData.subcategories?.[subcategoryId];

      if (!subcategory) {
        throw new Error('Subcategory not found');
      }

      // Filter out the question
      const updatedQuestions = (subcategory.questions || [])
        .filter(q => q.id !== questionId)
        .map((q, idx) => ({ ...q, order: idx + 1 })); // Re-order

      await updateDoc(categoryRef, {
        [`subcategories.${subcategoryId}.questions`]: updatedQuestions,
        updatedAt: serverTimestamp()
      });

      // Clear cache
      this.cache = null;
      this.cacheTimestamp = null;

      return { success: true };
    } catch (error) {
      console.error('Error deleting question:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update a question's text
   */
  async updateQuestion(categoryId, subcategoryId, questionId, newText) {
    try {
      const categoryRef = doc(db, this.getCollectionPath(), categoryId);
      const categoryDoc = await getDoc(categoryRef);

      if (!categoryDoc.exists()) {
        throw new Error('Category not found');
      }

      const categoryData = categoryDoc.data();
      const subcategory = categoryData.subcategories?.[subcategoryId];

      if (!subcategory) {
        throw new Error('Subcategory not found');
      }

      // Update the question
      const updatedQuestions = (subcategory.questions || []).map(q =>
        q.id === questionId ? { ...q, text: newText } : q
      );

      await updateDoc(categoryRef, {
        [`subcategories.${subcategoryId}.questions`]: updatedQuestions,
        updatedAt: serverTimestamp()
      });

      // Clear cache
      this.cache = null;
      this.cacheTimestamp = null;

      return { success: true };
    } catch (error) {
      console.error('Error updating question:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add a new subcategory to a category
   */
  async addSubcategory(categoryId, title) {
    try {
      const categoryRef = doc(db, this.getCollectionPath(), categoryId);
      const categoryDoc = await getDoc(categoryRef);

      if (!categoryDoc.exists()) {
        throw new Error('Category not found');
      }

      const categoryData = categoryDoc.data();
      const subcategoryId = title.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      const existingSubcategories = Object.keys(categoryData.subcategories || {});
      const newOrder = existingSubcategories.length + 1;

      await updateDoc(categoryRef, {
        [`subcategories.${subcategoryId}`]: {
          id: subcategoryId,
          title: title,
          order: newOrder,
          questions: []
        },
        updatedAt: serverTimestamp()
      });

      // Clear cache
      this.cache = null;
      this.cacheTimestamp = null;

      return { success: true, subcategoryId };
    } catch (error) {
      console.error('Error adding subcategory:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add a new category
   */
  async addCategory(title, icon = '📝', color = '#9E9E9E') {
    try {
      const categories = await this.getAllCategories();
      const categoryId = title.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      const newOrder = Object.keys(categories).length + 1;

      const categoryRef = doc(db, this.getCollectionPath(), categoryId);
      await setDoc(categoryRef, {
        id: categoryId,
        icon,
        title,
        color,
        order: newOrder,
        subcategories: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Clear cache
      this.cache = null;
      this.cacheTimestamp = null;

      return { success: true, categoryId };
    } catch (error) {
      console.error('Error adding category:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate questions using AI
   */
  async generateQuestionsWithAI(topic, count = 5) {
    try {
      // Call cloud function for AI generation
      const generateFn = httpsCallable(functions, 'generateBrainTicklerQuestions');
      const result = await generateFn({ topic, count });

      if (result.data?.questions) {
        return { success: true, questions: result.data.questions };
      } else {
        throw new Error('No questions generated');
      }
    } catch (error) {
      console.error('Error generating AI questions:', error);

      // Fallback: generate some generic questions based on topic
      const fallbackQuestions = this.generateFallbackQuestions(topic, count);
      return { success: true, questions: fallbackQuestions, fallback: true };
    }
  }

  /**
   * Fallback question generation without AI
   */
  generateFallbackQuestions(topic, count) {
    const templates = [
      `What is your earliest memory related to ${topic}?`,
      `How has ${topic} shaped your life?`,
      `What would you tell your grandchildren about ${topic}?`,
      `What's your most meaningful experience with ${topic}?`,
      `How has your perspective on ${topic} changed over the years?`,
      `What lessons have you learned from ${topic}?`,
      `Who influenced your views on ${topic}?`,
      `What story about ${topic} do you want to preserve?`
    ];

    return templates.slice(0, count);
  }

  /**
   * Search questions by keyword
   */
  async searchQuestions(keyword) {
    const allQuestions = await this.getAllQuestionsFlat();
    const lowerKeyword = keyword.toLowerCase();

    return allQuestions.filter(q =>
      q.text.toLowerCase().includes(lowerKeyword) ||
      q.categoryTitle.toLowerCase().includes(lowerKeyword) ||
      q.subcategoryTitle.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Get question statistics
   */
  async getStats() {
    const categories = await this.getAllCategories();
    let totalQuestions = 0;
    let totalSubcategories = 0;
    const categoryCount = Object.keys(categories).length;

    Object.values(categories).forEach(category => {
      const subcategories = Object.values(category.subcategories || {});
      totalSubcategories += subcategories.length;
      subcategories.forEach(sub => {
        totalQuestions += (sub.questions || []).length;
      });
    });

    return {
      categories: categoryCount,
      subcategories: totalSubcategories,
      questions: totalQuestions
    };
  }

  /**
   * Clear cache (for admin refresh)
   */
  clearCache() {
    this.cache = null;
    this.cacheTimestamp = null;
  }
}

// Export singleton instance
export const brainTicklerService = new BrainTicklerService();
export default brainTicklerService;
