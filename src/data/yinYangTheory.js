// =============================================================================
// YIN/YANG THEORY DATABASE
// =============================================================================
// "Course 3 (SALAD)" - Educational theory for each Yin/Yang factor
// Created: November 25, 2025
// Purpose: Build GENESIS as THE authoritative source on constitutional analysis
// =============================================================================

export const yinYangTheory = {
  // ===========================================================================
  // CHINESE ANIMALS (12 animals)
  // ===========================================================================
  chineseAnimals: {
    Rat: {
      name: "Rat",
      energy: "Yang",
      element: "Water",
      icon: "🐀",
      tagline: "The Clever Survivor",
      summary: "Quick-witted, resourceful, and adaptable. Despite being Water element (Yin), the Rat's active, opportunistic nature makes it Yang overall.",
      
      origin: `The Chinese zodiac originated over 2,600 years ago during the Zhou Dynasty. Legend tells of the Jade Emperor's Great Race, where the clever Rat rode on the Ox's back and jumped ahead at the finish line, securing first place. Historically, rats were revered for their ability to find food and water during famines - a survival skill that saved countless lives.`,
      
      whyYinYang: `The Rat is classified as YANG despite being a Water element (typically Yin) because:
      
• **Active Intelligence**: Rats are constantly moving, exploring, seeking opportunities - Yang initiative
• **Competitive Nature**: The Rat won the zodiac race through cunning competition - Yang assertiveness  
• **Social Dominance**: Rats establish hierarchies and fight for position - Yang leadership
• **Resourceful Action**: They don't wait passively but actively seek solutions - Yang problem-solving`,
      
      crossCultural: `**Chinese Tradition:** Associated with the beginning of creation, clever intelligence, and wealth accumulation (北 North direction, 子 Zi hour: 11pm-1am)

**Vedic Parallel:** Correlates to Moola nakshatra (Mūla), ruled by Ketu, representing roots, foundations, and primal intelligence

**Western Correlation:** Gemini and Virgo energy (Mercury-ruled) - quick-thinking, adaptable, analytical`,
      
      inYourProfile: (name, points) => `You have the Rat in your Chinese zodiac, contributing +${points} Yang points. This gives you sharp intelligence, adaptability, and resourceful problem-solving. Your Rat energy helps you spot opportunities others miss and navigate challenges with cleverness. Balance this active mental energy with moments of stillness and deep rest.`
    },

    Ox: {
      name: "Ox",
      energy: "Yin",
      element: "Earth",
      icon: "🐂",
      tagline: "The Steadfast Builder",
      summary: "Patient, reliable, and determined. The Ox embodies Yin stability through persistent effort and methodical work.",
      
      origin: `The Ox came second in the Jade Emperor's Great Race, carrying the Rat on its back. In ancient agricultural China, oxen were essential for plowing fields and represented the foundation of civilization. The Ox symbolizes the steady, patient work that builds empires.`,
      
      whyYinYang: `The Ox is classified as YIN because:
      
• **Patient Endurance**: Oxen work steadily without rushing - Yin persistence
• **Receptive Service**: They respond to guidance and serve loyally - Yin responsiveness
• **Grounded Stability**: Heavy, earthbound, stable foundation - Yin rootedness
• **Conservative Nature**: Prefers proven methods over risky innovation - Yin caution`,
      
      crossCultural: `**Chinese Tradition:** Associated with Earth element, stability, and agricultural prosperity (丑 Chou hour: 1am-3am, Northeast direction)

**Vedic Parallel:** Rohini nakshatra, ruled by Moon, representing fertility, growth, and material abundance

**Western Correlation:** Taurus energy (Venus-ruled) - earthy, stable, sensual, patient, values security`,
      
      inYourProfile: (name, points) => `You have the Ox in your Chinese zodiac, contributing +${points} Yin points. This gives you patient determination, reliable strength, and methodical perseverance. Your Ox energy helps you build lasting foundations through steady effort. Balance this grounded stability with occasional spontaneity and flexibility.`
    },

    Tiger: {
      name: "Tiger",
      energy: "Yang",
      element: "Wood",
      icon: "🐅",
      tagline: "The Courageous Leader",
      summary: "Bold, adventurous, and charismatic. The Tiger embodies Yang courage through fearless action and natural leadership.",
      
      origin: `The Tiger finished third in the Great Race, swimming powerfully across the river despite the current. In Chinese culture, tigers were considered the king of animals (before lions became more known), representing royal authority and protective power. Tiger talismans ward off evil spirits.`,
      
      whyYinYang: `The Tiger is classified as YANG because:
      
• **Courageous Initiative**: Tigers attack boldly and take risks - Yang bravery
• **Dominant Leadership**: Natural authority and commanding presence - Yang power
• **Assertive Action**: Pounces decisively without hesitation - Yang aggression
• **Outward Expression**: Roars loudly and displays strength - Yang exhibition`,
      
      crossCultural: `**Chinese Tradition:** Associated with Wood element, spring energy, and military courage (寅 Yin hour: 3am-5am, East-Northeast direction)

**Vedic Parallel:** Magha nakshatra, ruled by Ketu, representing royal authority, ancestral power, and leadership

**Western Correlation:** Leo energy (Sun-ruled) - bold, courageous, charismatic, natural leader, dramatic`,
      
      inYourProfile: (name, points) => `You have the Tiger in your Chinese zodiac, contributing +${points} Yang points. This gives you courageous leadership, bold initiative, and charismatic confidence. Your Tiger energy helps you face challenges fearlessly and inspire others. Balance this fierce courage with patience and strategic thinking.`
    },

    Rabbit: {
      name: "Rabbit",
      energy: "Yin",
      element: "Wood",
      icon: "🐰",
      tagline: "The Gentle Diplomat",
      summary: "Graceful, peaceful, and refined. The Rabbit embodies Yin gentleness through diplomatic grace and aesthetic sensitivity.",
      
      origin: `The Rabbit finished fourth in the Great Race by hopping across stones and logs, using cleverness and grace rather than brute force. In Chinese culture, rabbits represent the Moon goddess Chang'e's companion, symbolizing lunar receptivity, gentleness, and refinement.`,
      
      whyYinYang: `The Rabbit is classified as YIN because:
      
• **Gentle Nature**: Rabbits avoid conflict and seek peace - Yin harmony
• **Receptive Sensitivity**: Highly aware of environment and emotions - Yin receptivity
• **Nocturnal Activity**: Most active at dusk/dawn (liminal times) - Yin timing
• **Evasive Strategy**: Survives through hiding, not fighting - Yin protection`,
      
      crossCultural: `**Chinese Tradition:** Associated with Wood element, moon energy, and artistic refinement (卯 Mao hour: 5am-7am, East direction)

**Vedic Parallel:** Mrigashira nakshatra, ruled by Mars (paradoxically), representing seeking, gentleness, and refinement

**Western Correlation:** Libra/Pisces energy - graceful, peace-seeking, artistic, diplomatic, sensitive`,
      
      inYourProfile: (name, points) => `You have the Rabbit in your Chinese zodiac, contributing +${points} Yin points. This gives you diplomatic grace, refined sensitivity, and peaceful wisdom. Your Rabbit energy helps you navigate conflicts with tact and create harmony through understanding. Balance this gentle nature with moments of assertive courage when needed.`
    },

    Dragon: {
      name: "Dragon",
      energy: "Yang",
      element: "Earth",
      icon: "🐉",
      tagline: "The Visionary Emperor",
      summary: "Charismatic, powerful, and visionary. The Dragon embodies Yang majesty through imperial authority and transformative power.",
      
      origin: `The Dragon finished fifth in the Great Race, delayed because it stopped to make rain for thirsty villages. In Chinese culture, dragons are the most auspicious symbol, representing the Emperor himself. Unlike Western dragons (evil), Chinese dragons are benevolent, bringing rain, prosperity, and cosmic blessing.`,
      
      whyYinYang: `The Dragon is classified as YANG because:
      
• **Imperial Authority**: Commands respect and wields power - Yang dominance
• **Visionary Initiative**: Creates new possibilities and futures - Yang innovation
• **Outward Magnificence**: Displays splendor and grandeur - Yang exhibition
• **Transformative Force**: Changes weather and fate itself - Yang power`,
      
      crossCultural: `**Chinese Tradition:** Associated with Earth element (surprisingly), spring thunder, and imperial power (辰 Chen hour: 7am-9am, East-Southeast direction)

**Vedic Parallel:** Pushya nakshatra, ruled by Saturn, representing nourishment, protection, and spiritual power

**Western Correlation:** Aries/Sagittarius energy - bold, visionary, optimistic, charismatic, leader`,
      
      inYourProfile: (name, points) => `You have the Dragon in your Chinese zodiac, contributing +${points} Yang points. This gives you visionary leadership, charismatic presence, and transformative power. Your Dragon energy helps you inspire others and create magnificent outcomes. Balance this powerful presence with humility and grounded practicality.`
    },

    Snake: {
      name: "Snake",
      energy: "Yin",
      element: "Fire",
      icon: "🐍",
      tagline: "The Wise Philosopher",
      summary: "Intuitive, mysterious, and wise. The Snake embodies Yin depth through profound insight and hidden knowledge.",
      
      origin: `The Snake finished sixth in the Great Race by hiding in the Horse's hoof, then slithering ahead at the finish. In Chinese culture, snakes represent wisdom, intuition, and esoteric knowledge. They shed their skin, symbolizing transformation and renewal.`,
      
      whyYinYang: `The Snake is classified as YIN despite being Fire element because:
      
• **Mysterious Depth**: Snakes work in hidden, subtle ways - Yin secrecy
• **Receptive Intuition**: Senses vibrations and unseen patterns - Yin perception
• **Inward Reflection**: Contemplative, philosophical nature - Yin introspection
• **Cool Intelligence**: Despite Fire element, has cold-blooded wisdom - Yin calculation`,
      
      crossCultural: `**Chinese Tradition:** Associated with Fire element, wisdom, and esoteric knowledge (巳 Si hour: 9am-11am, South-Southeast direction)

**Vedic Parallel:** Ashlesha nakshatra, ruled by Mercury, representing coiling energy, kundalini, mysticism

**Western Correlation:** Scorpio energy (Mars/Pluto-ruled) - deep, mysterious, transformative, intuitive`,
      
      inYourProfile: (name, points) => `You have the Snake in your Chinese zodiac, contributing +${points} Yin points. This gives you profound intuition, mysterious wisdom, and deep insight. Your Snake energy helps you perceive hidden truths and understand complex mysteries. Balance this inward depth with outward communication and social connection.`
    },

    Horse: {
      name: "Horse",
      energy: "Yang",
      element: "Fire",
      icon: "🐴",
      tagline: "The Free Spirit",
      summary: "Energetic, independent, and adventurous. The Horse embodies Yang freedom through spirited action and unbounded energy.",
      
      origin: `The Horse finished seventh in the Great Race, galloping powerfully but startled by the Snake at the finish line. In Chinese nomadic history, horses represented freedom, speed, and military might. The Horse symbolizes the untamed spirit of the steppes.`,
      
      whyYinYang: `The Horse is classified as YANG because:
      
• **Dynamic Energy**: Horses run, leap, and move constantly - Yang vitality
• **Independent Spirit**: Resists control and seeks freedom - Yang autonomy
• **Outward Adventure**: Explores widely and travels far - Yang expansion
• **Passionate Expression**: Shows emotions openly and intensely - Yang emotion`,
      
      crossCultural: `**Chinese Tradition:** Associated with Fire element, summer heat, and military speed (午 Wu hour: 11am-1pm, South direction)

**Vedic Parallel:** Uttara Phalguni nakshatra, ruled by Sun, representing patronage, generosity, partnership

**Western Correlation:** Sagittarius energy (Jupiter-ruled) - freedom-loving, adventurous, optimistic, philosophical`,
      
      inYourProfile: (name, points) => `You have the Horse in your Chinese zodiac, contributing +${points} Yang points. This gives you spirited independence, dynamic energy, and adventurous freedom. Your Horse energy helps you pursue passions boldly and explore new horizons. Balance this restless spirit with grounding and commitment.`
    },

    Goat: {
      name: "Goat",
      energy: "Yin",
      element: "Earth",
      icon: "🐐",
      tagline: "The Gentle Artist",
      summary: "Creative, empathetic, and peace-loving. The Goat embodies Yin nurturing through artistic sensitivity and compassionate care.",
      
      origin: `The Goat (also called Sheep or Ram) finished eighth in the Great Race, arriving in a group with the Monkey and Rooster after working together. In Chinese culture, goats represent filial piety, artistic refinement, and gentle virtue. They're associated with family harmony and creative expression.`,
      
      whyYinYang: `The Goat is classified as YIN because:
      
• **Gentle Compassion**: Goats are empathetic and nurturing - Yin care
• **Receptive Creativity**: Channels inspiration rather than forcing it - Yin artistry
• **Group Harmony**: Prefers cooperation over competition - Yin collaboration
• **Soft Approach**: Wins through gentleness, not aggression - Yin persuasion`,
      
      crossCultural: `**Chinese Tradition:** Associated with Earth element, artistic refinement, and family values (未 Wei hour: 1pm-3pm, South-Southwest direction)

**Vedic Parallel:** Purva Phalguni nakshatra, ruled by Venus, representing creativity, pleasure, arts

**Western Correlation:** Cancer/Pisces energy - nurturing, artistic, empathetic, family-oriented`,
      
      inYourProfile: (name, points) => `You have the Goat in your Chinese zodiac, contributing +${points} Yin points. This gives you artistic sensitivity, compassionate empathy, and gentle nurturing. Your Goat energy helps you create beauty and care for others deeply. Balance this soft nature with occasional assertiveness and boundaries.`
    },

    Monkey: {
      name: "Monkey",
      energy: "Yang",
      element: "Metal",
      icon: "🐒",
      tagline: "The Clever Innovator",
      summary: "Witty, ingenious, and playful. The Monkey embodies Yang cleverness through quick thinking and creative problem-solving.",
      
      origin: `The Monkey finished ninth in the Great Race, using intelligence and agility to leap across trees and rocks. In Chinese mythology, Sun Wukong (the Monkey King) represents rebellious intelligence and magical transformation. Monkeys symbolize cleverness, innovation, and playful spirit.`,
      
      whyYinYang: `The Monkey is classified as YANG because:
      
• **Active Intelligence**: Constantly thinking, scheming, creating - Yang mental energy
• **Mischievous Initiative**: Takes action playfully and boldly - Yang trickster
• **Social Dominance**: Competes for status and attention - Yang competition
• **Outward Expression**: Performs, entertains, shows off - Yang exhibition`,
      
      crossCultural: `**Chinese Tradition:** Associated with Metal element, autumn harvest, and clever wit (申 Shen hour: 3pm-5pm, West-Southwest direction)

**Vedic Parallel:** Shravana nakshatra, ruled by Moon, representing listening, learning, communication

**Western Correlation:** Gemini energy (Mercury-ruled) - witty, clever, versatile, communicative, playful`,
      
      inYourProfile: (name, points) => `You have the Monkey in your Chinese zodiac, contributing +${points} Yang points. This gives you quick intelligence, clever innovation, and playful creativity. Your Monkey energy helps you solve problems ingeniously and adapt to any situation. Balance this restless cleverness with depth and follow-through.`
    },

    Rooster: {
      name: "Rooster",
      energy: "Yin",
      element: "Metal",
      icon: "🐓",
      tagline: "The Proud Perfectionist",
      summary: "Precise, confident, and hardworking. The Rooster embodies Yin structure through meticulous attention to detail and disciplined excellence.",
      
      origin: `The Rooster finished tenth in the Great Race, arriving with the Goat and Monkey after helping navigate together. In Chinese culture, roosters herald the dawn, representing punctuality, reliability, and discipline. Their crow announces the return of Yang (day) after Yin (night).`,
      
      whyYinYang: `The Rooster is classified as YIN despite announcing the dawn because:
      
• **Structured Discipline**: Roosters follow precise routines - Yin order
• **Receptive Observation**: Notices every detail meticulously - Yin attention
• **Inward Standards**: Judges self and others by high standards - Yin perfectionism
• **Responsive Service**: Serves by announcing time faithfully - Yin duty`,
      
      crossCultural: `**Chinese Tradition:** Associated with Metal element, autumn harvest, and punctual discipline (酉 You hour: 5pm-7pm, West direction)

**Vedic Parallel:** Hasta nakshatra, ruled by Moon, representing skill, craftsmanship, precision

**Western Correlation:** Virgo energy (Mercury-ruled) - precise, perfectionistic, service-oriented, analytical`,
      
      inYourProfile: (name, points) => `You have the Rooster in your Chinese zodiac, contributing +${points} Yin points. This gives you precise discipline, meticulous attention, and high standards. Your Rooster energy helps you excel through careful preparation and dedicated work. Balance this perfectionism with self-compassion and flexibility.`
    },

    Dog: {
      name: "Dog",
      energy: "Yang",
      element: "Earth",
      icon: "🐕",
      tagline: "The Loyal Guardian",
      summary: "Faithful, protective, and honest. The Dog embodies Yang loyalty through courageous guardianship and steadfast devotion.",
      
      origin: `The Dog finished eleventh in the Great Race, delayed because it stopped to play in the water. In Chinese culture, dogs represent loyalty, protection, and honest friendship. They guard homes and detect evil, symbolizing faithful service and moral courage.`,
      
      whyYinYang: `The Dog is classified as YANG because:
      
• **Protective Action**: Dogs actively guard and defend - Yang protection
• **Loyal Initiative**: Takes responsibility and leads in service - Yang duty
• **Outward Vigilance**: Watches externally and alerts to danger - Yang awareness
• **Courageous Honesty**: Speaks truth and confronts injustice - Yang integrity`,
      
      crossCultural: `**Chinese Tradition:** Associated with Earth element, autumn evening, and loyal protection (戌 Xu hour: 7pm-9pm, West-Northwest direction)

**Vedic Parallel:** Mula nakshatra (root star), representing foundation, protection, moral courage

**Western Correlation:** Cancer/Virgo energy - protective, loyal, service-oriented, honest, caring`,
      
      inYourProfile: (name, points) => `You have the Dog in your Chinese zodiac, contributing +${points} Yang points. This gives you loyal devotion, protective courage, and honest integrity. Your Dog energy helps you serve others faithfully and stand for justice. Balance this serious duty with playfulness and lightness.`
    },

    Pig: {
      name: "Pig",
      energy: "Yin",
      element: "Water",
      icon: "🐖",
      tagline: "The Generous Enjoyer",
      summary: "Generous, peaceful, and pleasure-loving. The Pig embodies Yin abundance through receptive enjoyment and openhearted giving.",
      
      origin: `The Pig finished last (twelfth) in the Great Race because it stopped for a feast and then fell asleep. In Chinese culture, pigs represent wealth, abundance, and good fortune. Their association with harvest festivals and prosperity makes them highly auspicious.`,
      
      whyYinYang: `The Pig is classified as YIN because:
      
• **Receptive Enjoyment**: Pigs receive pleasure and abundance - Yin receptivity
• **Peaceful Nature**: Avoids conflict and seeks comfort - Yin harmony
• **Inward Satisfaction**: Finds contentment in simple pleasures - Yin fulfillment
• **Generous Giving**: Shares resources openhearted­ly - Yin abundance`,
      
      crossCultural: `**Chinese Tradition:** Associated with Water element, winter rest, and abundant prosperity (亥 Hai hour: 9pm-11pm, North-Northwest direction)

**Vedic Parallel:** Revati nakshatra, ruled by Mercury, representing completion, nourishment, generosity

**Western Correlation:** Taurus/Libra energy - pleasure-loving, peaceful, generous, artistic, abundant`,
      
      inYourProfile: (name, points) => `You have the Pig in your Chinese zodiac, contributing +${points} Yin points. This gives you generous abundance, peaceful contentment, and openhearted giving. Your Pig energy helps you enjoy life's pleasures and share prosperity with others. Balance this receptive enjoyment with disciplined effort and boundaries.`
    }
  },

  // ===========================================================================
  // CHINESE ELEMENTS (5 elements)
  // ===========================================================================
  chineseElements: {
    Wood: {
      name: "Wood",
      energy: "Yang",
      icon: "🌳",
      tagline: "The Growing Pioneer",
      summary: "Expansive, creative, and growth-oriented. Wood embodies Yang initiative through upward expansion and creative development.",
      
      origin: `The Five Elements (五行 Wǔxíng) theory emerged during the Warring States period (475-221 BCE), though its roots trace back to Shang Dynasty oracle bones (1600 BCE). Unlike Western four elements (static substances), Chinese five elements represent dynamic processes and transformations. Wood (木 Mù) represents the spring season and birth stage of all cycles.`,
      
      whyYinYang: `Wood is classified as YANG because:
      
• **Upward Growth**: Trees grow upward toward sky/sun - Yang ascension
• **Outward Expansion**: Wood spreads, branches, extends - Yang expansion
• **Initiating Force**: Spring begins new growth cycles - Yang initiation
• **Creative Expression**: Wood creates and generates - Yang generation`,
      
      crossCultural: `**Chinese Tradition:** Spring season, East direction, morning time, color green, sour taste, liver/gallbladder organs, anger emotion

**Vedic Parallel:** Vayu (Air) element shares Wood's upward, mobile, creative qualities - both represent prana (life force) and expansion

**Western Correlation:** Fire/Air elements - both are active, ascending, light, creative forces (though Western splits what Chinese unifies as Wood)`,
      
      inYourProfile: (name, points) => `You have Wood element in your Chinese zodiac, contributing +${points} Yang points. This gives you pioneering initiative, creative growth, and expansive vision. Your Wood energy helps you start new projects and develop ideas into reality. Balance this growing yang with Earth's stability and Metal's refinement.`
    },

    Fire: {
      name: "Fire",
      energy: "Yang",
      icon: "🔥",
      tagline: "The Passionate Transformer",
      summary: "Intense, warm, and transformative. Fire embodies Yang climax through maximum heat and peak expression.",
      
      origin: `Fire (火 Huǒ) in Five Elements theory represents the peak of Yang energy - the summer solstice when Yang reaches its maximum before beginning to wane. Ancient Chinese observed how fire transforms matter completely, makes things visible, and radiates outward in all directions.`,
      
      whyYinYang: `Fire is classified as YANG (maximum) because:
      
• **Intense Heat**: Fire is the hottest element - peak Yang
• **Upward/Outward**: Flames rise and radiate in all directions - Yang expansion
• **Transformative Action**: Fire changes matter fundamentally - Yang transformation
• **Visible Expression**: Fire illuminates and makes things seen - Yang exhibition`,
      
      crossCultural: `**Chinese Tradition:** Summer season, South direction, noon time, color red, bitter taste, heart/small intestine organs, joy emotion (or mania when excessive)

**Vedic Parallel:** Agni (Fire) - identical correspondence. Both traditions see fire as transformative heat, digestion, passion, and consciousness

**Western Correlation:** Fire element - direct correspondence. Both systems recognize fire as hot, dry, ascending, active, masculine`,
      
      inYourProfile: (name, points) => `You have Fire element in your Chinese zodiac, contributing +${points} Yang points. This gives you passionate intensity, transformative power, and radiant warmth. Your Fire energy helps you inspire others and create dramatic change. Balance this intense yang with Water's cooling and rest.`
    },

    Earth: {
      name: "Earth",
      energy: "Balanced",
      icon: "🌍",
      tagline: "The Nurturing Center",
      summary: "Stable, grounding, and transitional. Earth embodies Balance as the center point between Yin and Yang, the harvest that comes between growth and rest.",
      
      origin: `Earth (土 Tǔ) is unique in Five Elements - it represents the center, the balance point, and the transitions between seasons (late summer/early autumn). Unlike other elements which peak in one season, Earth governs the 18-day transition between each season, acting as the stabilizing mediator.`,
      
      whyYinYang: `Earth is classified as BALANCED because:
      
• **Central Position**: Earth occupies the center of the five elements - neither Yin nor Yang extreme
• **Mediating Force**: Earth transitions between other elements - balancing role
• **Receptive + Productive**: Earth both receives seeds (Yin) and produces crops (Yang)
• **Stable Foundation**: Neither rising (Yang) nor sinking (Yin) - stable`,
      
      crossCultural: `**Chinese Tradition:** Late summer/transitions, Center direction, afternoon time, color yellow, sweet taste, spleen/stomach organs, pensiveness emotion

**Vedic Parallel:** Prithvi (Earth) - but Ayurveda classifies Earth as heavy/grounding/Yin (Kapha), while Chinese sees it as balanced. Both agree on its stabilizing, nourishing function

**Western Correlation:** Earth element - both traditions see earth as stable, material, practical, nourishing. Western leans Yin (feminine, receptive), Chinese sees balanced`,
      
      inYourProfile: (name, points) => `You have Earth element in your Chinese zodiac, contributing +${points} Balanced points. This gives you stable grounding, practical wisdom, and mediating balance. Your Earth energy helps you center extremes and create foundations. Earth adds ${points} points to your dominant energy (Yin or Yang).`
    },

    Metal: {
      name: "Metal",
      energy: "Yin",
      icon: "🥈",
      tagline: "The Refining Judge",
      summary: "Precise, structured, and inward-focusing. Metal embodies Yin contraction through refinement, purification, and letting go.",
      
      origin: `Metal (金 Jīn) represents autumn, harvest, and the contraction phase where Yang diminishes and Yin begins to dominate. Ancient metallurgy required cooling (Yin) and refining (concentrating essence by removing impurities). Metal's association with weapons and cutting tools represents the ability to separate and define boundaries.`,
      
      whyYinYang: `Metal is classified as YIN because:
      
• **Inward Concentration**: Metal refines by removing excess - Yin distillation
• **Cooling Process**: Metallurgy requires cooling molten metal - Yin temperature
• **Downward Energy**: Unlike Wood's upward growth, Metal contracts and condenses - Yin direction
• **Autumn Association**: Season of dying back, letting go, preparing for winter Yin`,
      
      crossCultural: `**Chinese Tradition:** Autumn season, West direction, evening time, color white, pungent taste, lung/large intestine organs, grief emotion (letting go)

**Vedic Parallel:** No direct element equivalent, but relates to Vata (air/space) in its quality of boundaries, space, and separation

**Western Correlation:** Air element shares some Metal qualities (mental clarity, communication, boundaries), though Western Air is more Yang in nature`,
      
      inYourProfile: (name, points) => `You have Metal element in your Chinese zodiac, contributing +${points} Yin points. This gives you precise refinement, structured discipline, and clear boundaries. Your Metal energy helps you focus essence and release what no longer serves. Balance this contracting yin with Wood's expansive growth.`
    },

    Water: {
      name: "Water",
      energy: "Yin",
      icon: "💧",
      tagline: "The Flowing Wisdom",
      summary: "Deep, intuitive, and adaptive. Water embodies Yin minimum through maximum receptivity and profound stillness.",
      
      origin: `Water (水 Shuǐ) represents winter, the time of maximum Yin energy when nature rests deeply. The ancient Chinese observed water's unique properties: it flows downward (Yin direction), takes the shape of any container (ultimate receptivity), reflects like a mirror (Yin quality), and reaches the depths (Yin tendency). The I Ching's Water trigram (☵ Kan) represents danger, depth, and wisdom gained through falling into the abyss.`,
      
      whyYinYang: `Water is classified as YIN (maximum) because:
      
• **Downward Flow**: Water always flows downward to the lowest point - maximum Yin direction
• **Perfect Receptivity**: Water takes any shape without resistance - ultimate Yin adaptation
• **Deep Storage**: Water collects in depths and hidden places - Yin secrecy
• **Cool Nature**: Water cools and moistens - Yin temperature`,
      
      crossCultural: `**Chinese Tradition:** Winter season, North direction, night time, color black/dark blue, salty taste, kidney/bladder organs, fear emotion (primal survival)

**Vedic Parallel:** Jala/Ap (Water) - identical correspondence. Both traditions see water as deep, cooling, flowing, emotional, wisdom through stillness

**Western Correlation:** Water element - direct correspondence. Both systems see water as feminine, receptive, emotional, intuitive, depth`,
      
      inYourProfile: (name, points) => `You have Water element in your Chinese zodiac, contributing +${points} Yin points. This gives you profound depth, intuitive wisdom, and adaptive flow. Your Water energy helps you navigate emotions deeply and adapt with graceful flexibility. Balance this deep yin with Fire's warmth and activity.`
    }
  },

  // ===========================================================================
  // PLANETARY DAYS (7 days of week)
  // ===========================================================================
  planetaryDays: {
    Sunday: {
      name: "Sunday",
      energy: "Yang",
      planet: "Sun",
      icon: "☀️",
      tagline: "The Day of Radiance",
      summary: "Confident, vital, and illuminating. Sunday embodies Yang vitality through solar radiance and life-giving warmth.",
      
      origin: `The seven-day week originated with Babylonian astronomers around 600 BCE, who identified seven visible "wandering stars" (planets). Sunday was consecrated to the Sun (Shamash in Babylonian), the most obviously Yang celestial body. Romans called it Dies Solis (Day of the Sun), and the English name Sunday comes directly from this solar association.`,
      
      whyYinYang: `Sunday is classified as YANG (maximum) because:
      
• **Solar Radiance**: The Sun radiates light and heat outward - peak Yang
• **Life-Giving Force**: All life depends on Sun's Yang energy - Yang vitality
• **Illuminating Power**: Sun makes everything visible - Yang revelation
• **Central Authority**: Sun is the center, everything orbits it - Yang dominance`,
      
      inYourProfile: (name, points) => `You were born on Sunday, contributing +${points} Yang points. This gives you natural confidence, radiant vitality, and illuminating presence. Your Sunday energy helps you shine brightly and inspire others with your warmth. Balance this solar yang with lunar rest and introspection.`
    },

    Monday: {
      name: "Monday",
      energy: "Yin",
      planet: "Moon",
      icon: "🌙",
      tagline: "The Day of Reflection",
      summary: "Intuitive, emotional, and receptive. Monday embodies Yin receptivity through lunar reflection and emotional depth.",
      
      origin: `Monday was consecrated to the Moon (Sin in Babylonian), the most obviously Yin celestial body. Romans called it Dies Lunae (Day of the Moon), and the English "Monday" comes from "Moon's day." The Moon governs tides, menstruation, and emotional rhythms - all Yin cycles.`,
      
      whyYinYang: `Monday is classified as YIN (maximum) because:
      
• **Reflected Light**: Moon doesn't generate light, only reflects - Yin receptivity
• **Emotional Tides**: Moon governs cycles and emotions - Yin rhythm
• **Night Association**: Moon rules the night (Yin time) - Yin dominance
• **Changing Phases**: Moon waxes and wanes, never constant - Yin transformation`,
      
      inYourProfile: (name, points) => `You were born on Monday, contributing +${points} Yin points. This gives you deep intuition, emotional sensitivity, and receptive wisdom. Your Monday energy helps you understand feelings deeply and flow with natural cycles. Balance this lunar yin with solar confidence and outward expression.`
    },

    Tuesday: {
      name: "Tuesday",
      energy: "Yang",
      planet: "Mars",
      icon: "♂",
      tagline: "The Day of the Warrior",
      summary: "Courageous, passionate, and assertive. Tuesday embodies Yang force through martial courage and competitive drive.",
      
      origin: `Tuesday was consecrated to Mars, the red planet (Nergal in Babylonian). Romans named it Dies Martis (Day of Mars), their god of war. The English "Tuesday" comes from Týr/Tiw, the Germanic war god, showing how deeply martial energy is embedded in this day across cultures.`,
      
      whyYinYang: `Tuesday is classified as YANG because:
      
• **Martial Courage**: Mars governs war, courage, action - Yang force
• **Assertive Initiative**: Mars initiates, attacks, conquers - Yang aggression
• **Hot Energy**: Mars (Fire element in Chinese system) burns hot - Yang heat
• **Competitive Drive**: Mars competes to win and dominate - Yang competition`,
      
      inYourProfile: (name, points) => `You were born on Tuesday, contributing +${points} Yang points. This gives you courageous action, passionate intensity, and competitive drive. Your Tuesday/Mars energy helps you face challenges boldly and fight for what you believe in. Balance this martial yang with patience and compassion.`
    },

    Wednesday: {
      name: "Wednesday",
      energy: "Balanced",
      planet: "Mercury",
      icon: "☿",
      tagline: "The Day of the Messenger",
      summary: "Quick-witted, adaptable, and communicative. Wednesday embodies Balance through mercurial versatility and neutral mediation.",
      
      origin: `Wednesday was consecrated to Mercury, the swift messenger planet (Nabu in Babylonian). Romans named it Dies Mercurii (Day of Mercury). The English "Wednesday" comes from Woden (Odin), who like Mercury was a god of wisdom, communication, and magic.`,
      
      whyYinYang: `Wednesday is classified as BALANCED because:
      
• **Mediating Function**: Mercury carries messages between opposites - balanced mediation
• **Dual Nature**: Mercury is both masculine and feminine in mythology - androgynous balance
• **Mutable Quality**: Mercury adapts to any situation - neutral flexibility
• **Neither Hot Nor Cold**: Mercury is neither fire (Yang) nor water (Yin) - balanced temperature`,
      
      inYourProfile: (name, points) => `You were born on Wednesday, contributing +${points} Balanced points. This gives you adaptable versatility, communicative skill, and neutral mediation. Your Wednesday/Mercury energy helps you bridge opposites and communicate effectively. Wednesday adds ${points} points to your dominant energy.`
    },

    Thursday: {
      name: "Thursday",
      energy: "Yang",
      planet: "Jupiter",
      icon: "♃",
      tagline: "The Day of Expansion",
      summary: "Optimistic, abundant, and philosophical. Thursday embodies Yang growth through jovial expansion and generous wisdom.",
      
      origin: `Thursday was consecrated to Jupiter, the largest planet (Marduk in Babylonian). Romans named it Dies Iovis (Day of Jove/Jupiter). The English "Thursday" comes from Thor, the thunder god, who like Jupiter wields lightning and protects with might.`,
      
      whyYinYang: `Thursday is classified as YANG because:
      
• **Expansive Growth**: Jupiter expands, grows, increases - Yang expansion
• **Outward Generosity**: Jupiter gives abundantly and openly - Yang giving
• **Hot/Moist Quality**: Jupiter is warm and fertile - Yang warmth
• **Leadership Authority**: Jupiter (king of gods) rules with benevolent power - Yang authority`,
      
      inYourProfile: (name, points) => `You were born on Thursday, contributing +${points} Yang points. This gives you expansive optimism, generous abundance, and philosophical wisdom. Your Thursday/Jupiter energy helps you grow, teach, and inspire with benevolent leadership. Balance this expansive yang with focus and restraint.`
    },

    Friday: {
      name: "Friday",
      energy: "Yin",
      planet: "Venus",
      icon: "♀",
      tagline: "The Day of Beauty",
      summary: "Harmonious, beautiful, and relational. Friday embodies Yin grace through venusian beauty and peaceful connection.",
      
      origin: `Friday was consecrated to Venus, the planet of love and beauty (Ishtar in Babylonian). Romans named it Dies Veneris (Day of Venus). The English "Friday" comes from Frigg/Freya, Germanic goddesses of love, beauty, and fertility.`,
      
      whyYinYang: `Friday is classified as YIN because:
      
• **Receptive Beauty**: Venus attracts through beauty, not force - Yin attraction
• **Harmonious Peace**: Venus seeks balance and avoids conflict - Yin peace
• **Relational Connection**: Venus connects through relationship - Yin bonding
• **Gentle Grace**: Venus moves with elegance and softness - Yin gentleness`,
      
      inYourProfile: (name, points) => `You were born on Friday, contributing +${points} Yin points. This gives you harmonious grace, aesthetic beauty, and relational wisdom. Your Friday/Venus energy helps you create beauty and build peaceful connections. Balance this gentle yin with assertive action when needed.`
    },

    Saturday: {
      name: "Saturday",
      energy: "Yin",
      planet: "Saturn",
      icon: "♄",
      tagline: "The Day of Structure",
      summary: "Disciplined, patient, and wise. Saturday embodies Yin structure through saturnine patience and earned wisdom.",
      
      origin: `Saturday was consecrated to Saturn, the slowest visible planet (Ninurta in Babylonian). Romans named it Dies Saturni (Day of Saturn), and this is the only day that kept its Roman name in English. Saturn represents time, limits, wisdom, and the patience required for mastery.`,
      
      whyYinYang: `Saturday is classified as YIN because:
      
• **Inward Discipline**: Saturn structures through inner restraint - Yin control
• **Slow Patience**: Saturn moves slowly and waits - Yin patience
• **Cold/Dry Quality**: Saturn is cold and contracting - Yin temperature
• **Earned Wisdom**: Saturn teaches through limitation and time - Yin wisdom`,
      
      inYourProfile: (name, points) => `You were born on Saturday, contributing +${points} Yin points. This gives you disciplined patience, structured wisdom, and earned authority. Your Saturday/Saturn energy helps you build lasting foundations through perseverance. Balance this serious yin with play and spontaneity.`
    }
  },

  // ===========================================================================
  // WESTERN ZODIAC SIGNS (12 signs)
  // ===========================================================================
  westernSigns: {
    Aries: {
      name: "Aries",
      energy: "Yang",
      element: "Fire",
      modality: "Cardinal",
      icon: "♈",
      ruler: "Mars",
      tagline: "The Pioneering Warrior",
      summary: "Bold, initiating, and courageous. Aries embodies Yang initiative as the first sign that begins the zodiacal year.",
      
      whyYinYang: `Aries is classified as YANG because:
      
• **Cardinal Fire**: Initiates action with fiery courage - maximum Yang
• **Mars Ruled**: Governed by the warrior planet - Yang aggression
• **Spring Equinox**: Begins at the moment Yang equals Yin (then grows) - Yang initiation
• **First Sign**: Starts the zodiac, pioneers new cycles - Yang leadership`,
      
      inYourProfile: (name, points) => `You are an Aries (${name}'s Sun sign), contributing +${points} Yang points. This gives you pioneering courage, initiating boldness, and warrior spirit. Your Aries energy helps you start new ventures fearlessly and lead with confidence.`
    },

    Taurus: {
      name: "Taurus",
      energy: "Yin",
      element: "Earth",
      modality: "Fixed",
      icon: "♉",
      ruler: "Venus",
      tagline: "The Grounded Builder",
      summary: "Stable, sensual, and patient. Taurus embodies Yin receptivity through earthy groundedness and material stability.",
      
      whyYinYang: `Taurus is classified as YIN because:
      
• **Fixed Earth**: Stays grounded and stable - Yin rootedness
• **Venus Ruled**: Governed by beauty and reception - Yin attraction
• **Material Focus**: Values tangible substance - Yin materiality
• **Patient Nature**: Waits, persists, endures - Yin patience`,
      
      inYourProfile: (name, points) => `You are a Taurus (${name}'s Sun sign), contributing +${points} Yin points. This gives you grounded stability, sensual appreciation, and patient perseverance. Your Taurus energy helps you build lasting foundations with steady determination.`
    },

    Gemini: {
      name: "Gemini",
      energy: "Yang",
      element: "Air",
      modality: "Mutable",
      icon: "♊",
      ruler: "Mercury",
      tagline: "The Curious Communicator",
      summary: "Quick-witted, versatile, and sociable. Gemini embodies Yang expression through mental agility and outward communication.",
      
      whyYinYang: `Gemini is classified as YANG because:
      
• **Mutable Air**: Moves thoughts outward and spreads ideas - Yang dissemination
• **Mercury Ruled**: Quick, active mind - Yang mental activity
• **Outward Communication**: Shares, talks, connects externally - Yang expression
• **Dual Nature**: Though balanced internally, expresses outwardly - Yang exhibition`,
      
      inYourProfile: (name, points) => `You are a Gemini (${name}'s Sun sign), contributing +${points} Yang points. This gives you quick intelligence, versatile adaptability, and communicative skill. Your Gemini energy helps you connect ideas and people with mental agility.`
    },

    Cancer: {
      name: "Cancer",
      energy: "Yin",
      element: "Water",
      modality: "Cardinal",
      icon: "♋",
      ruler: "Moon",
      tagline: "The Nurturing Protector",
      summary: "Emotional, protective, and intuitive. Cancer embodies Yin nurturing through lunar receptivity and maternal care.",
      
      whyYinYang: `Cancer is classified as YIN because:
      
• **Cardinal Water**: Initiates through emotion and care - Yin nurturing
• **Moon Ruled**: Governed by the most Yin planet - Yin receptivity
• **Inward Protection**: Protects by sheltering within - Yin containment
• **Emotional Depth**: Feels deeply and internally - Yin interiority`,
      
      inYourProfile: (name, points) => `You are a Cancer (${name}'s Sun sign), contributing +${points} Yin points. This gives you emotional depth, nurturing care, and intuitive sensitivity. Your Cancer energy helps you create safe spaces and deeply understand feelings.`
    },

    Leo: {
      name: "Leo",
      energy: "Yang",
      element: "Fire",
      modality: "Fixed",
      icon: "♌",
      ruler: "Sun",
      tagline: "The Radiant King",
      summary: "Confident, generous, and charismatic. Leo embodies Yang radiance through solar vitality and royal presence.",
      
      whyYinYang: `Leo is classified as YANG because:
      
• **Fixed Fire**: Burns steadily and radiates constantly - Yang radiance
• **Sun Ruled**: Governed by the most Yang celestial body - maximum Yang
• **Outward Expression**: Performs, displays, shines - Yang exhibition
• **Royal Presence**: Commands attention and leads - Yang authority`,
      
      inYourProfile: (name, points) => `You are a Leo (${name}'s Sun sign), contributing +${points} Yang points. This gives you confident radiance, generous warmth, and charismatic presence. Your Leo energy helps you inspire others and lead with heart-centered power.`
    },

    Virgo: {
      name: "Virgo",
      energy: "Yin",
      element: "Earth",
      modality: "Mutable",
      icon: "♍",
      ruler: "Mercury",
      tagline: "The Analytical Healer",
      summary: "Precise, helpful, and discerning. Virgo embodies Yin refinement through analytical precision and humble service.",
      
      whyYinYang: `Virgo is classified as YIN because:
      
• **Mutable Earth**: Adapts practically and grounds details - Yin practicality
• **Mercury Ruled**: Analyzes inwardly and refines - Yin discernment
• **Service Orientation**: Helps others through support - Yin assistance
• **Humble Precision**: Works behind scenes perfecting - Yin modesty`,
      
      inYourProfile: (name, points) => `You are a Virgo (${name}'s Sun sign), contributing +${points} Yin points. This gives you analytical precision, helpful service, and discerning wisdom. Your Virgo energy helps you improve and refine with meticulous care.`
    },

    Libra: {
      name: "Libra",
      energy: "Yang",
      element: "Air",
      modality: "Cardinal",
      icon: "♎",
      ruler: "Venus",
      tagline: "The Harmonious Diplomat",
      summary: "Balanced, social, and aesthetic. Libra embodies Yang connection through active relationship-building and social grace.",
      
      whyYinYang: `Libra is classified as YANG because:
      
• **Cardinal Air**: Initiates social connections actively - Yang initiative
• **Venus Ruled**: Though Venus is Yin, Libra expresses her outwardly - Yang social expression
• **Outward Focus**: Seeks balance through external relationships - Yang connection
• **Active Mediation**: Balances by actively creating harmony - Yang diplomacy`,
      
      inYourProfile: (name, points) => `You are a Libra (${name}'s Sun sign), contributing +${points} Yang points. This gives you diplomatic grace, social harmony, and aesthetic balance. Your Libra energy helps you build beautiful relationships and create peace actively.`
    },

    Scorpio: {
      name: "Scorpio",
      energy: "Yin",
      element: "Water",
      modality: "Fixed",
      icon: "♏",
      ruler: "Mars/Pluto",
      tagline: "The Deep Transformer",
      summary: "Intense, mysterious, and transformative. Scorpio embodies Yin depth through profound interiority and hidden power.",
      
      whyYinYang: `Scorpio is classified as YIN because:
      
• **Fixed Water**: Holds depth and intensity internally - Yin containment
• **Mars/Pluto Ruled**: Though Mars is Yang, Scorpio internalizes its power - Yin hidden strength
• **Inward Mystery**: Keeps secrets and explores hidden realms - Yin secrecy
• **Transformative Depth**: Changes from within, like internal alchemy - Yin transformation`,
      
      inYourProfile: (name, points) => `You are a Scorpio (${name}'s Sun sign), contributing +${points} Yin points. This gives you intense depth, mysterious power, and transformative insight. Your Scorpio energy helps you understand hidden truths and transform deeply.`
    },

    Sagittarius: {
      name: "Sagittarius",
      energy: "Yang",
      element: "Fire",
      modality: "Mutable",
      icon: "♐",
      ruler: "Jupiter",
      tagline: "The Philosophical Explorer",
      summary: "Optimistic, adventurous, and philosophical. Sagittarius embodies Yang expansion through enthusiastic exploration and teaching.",
      
      whyYinYang: `Sagittarius is classified as YANG because:
      
• **Mutable Fire**: Spreads enthusiasm and explores widely - Yang expansion
• **Jupiter Ruled**: Governed by the planet of growth - Yang abundance
• **Outward Adventure**: Travels, explores, expands horizons - Yang exploration
• **Teaching Expression**: Shares wisdom openly - Yang generosity`,
      
      inYourProfile: (name, points) => `You are a Sagittarius (${name}'s Sun sign), contributing +${points} Yang points. This gives you adventurous spirit, philosophical wisdom, and optimistic expansion. Your Sagittarius energy helps you explore widely and teach generously.`
    },

    Capricorn: {
      name: "Capricorn",
      energy: "Yin",
      element: "Earth",
      modality: "Cardinal",
      icon: "♑",
      ruler: "Saturn",
      tagline: "The Ambitious Builder",
      summary: "Disciplined, ambitious, and responsible. Capricorn embodies Yin structure through patient mastery and earned authority.",
      
      whyYinYang: `Capricorn is classified as YIN because:
      
• **Cardinal Earth**: Initiates through practical structure - Yin foundation
• **Saturn Ruled**: Governed by the most Yin planet - Yin discipline
• **Inward Ambition**: Climbs through inner determination - Yin perseverance
• **Earned Authority**: Gains power through patience and time - Yin mastery`,
      
      inYourProfile: (name, points) => `You are a Capricorn (${name}'s Sun sign), contributing +${points} Yin points. This gives you disciplined ambition, responsible leadership, and patient mastery. Your Capricorn energy helps you build lasting success through structured effort.`
    },

    Aquarius: {
      name: "Aquarius",
      energy: "Yang",
      element: "Air",
      modality: "Fixed",
      icon: "♒",
      ruler: "Saturn/Uranus",
      tagline: "The Revolutionary Visionary",
      summary: "Innovative, humanitarian, and independent. Aquarius embodies Yang vision through progressive ideas and social revolution.",
      
      whyYinYang: `Aquarius is classified as YANG because:
      
• **Fixed Air**: Holds ideas and broadcasts them outward - Yang dissemination
• **Uranus Ruled**: Governed by the planet of revolution - Yang innovation
• **Outward Vision**: Sees future and shares it socially - Yang projection
• **Social Action**: Changes society through active reform - Yang activism`,
      
      inYourProfile: (name, points) => `You are an Aquarius (${name}'s Sun sign), contributing +${points} Yang points. This gives you innovative vision, humanitarian ideals, and independent thinking. Your Aquarius energy helps you revolutionize systems and improve humanity.`
    },

    Pisces: {
      name: "Pisces",
      energy: "Yin",
      element: "Water",
      modality: "Mutable",
      icon: "♓",
      ruler: "Jupiter/Neptune",
      tagline: "The Mystic Dreamer",
      summary: "Compassionate, intuitive, and transcendent. Pisces embodies Yin dissolution through spiritual receptivity and universal love.",
      
      whyYinYang: `Pisces is classified as YIN because:
      
• **Mutable Water**: Flows adaptively and dissolves boundaries - Yin fluidity
• **Neptune Ruled**: Governed by the planet of dissolution - Yin transcendence
• **Inward Spirituality**: Connects to divine through receptivity - Yin mysticism
• **Compassionate Surrender**: Lets go and accepts - Yin release`,
      
      inYourProfile: (name, points) => `You are a Pisces (${name}'s Sun sign), contributing +${points} Yin points. This gives you compassionate sensitivity, intuitive wisdom, and spiritual depth. Your Pisces energy helps you understand suffering and connect to universal love.`
    }
  },

  // ===========================================================================
  // WESTERN ELEMENTS (4 elements)
  // ===========================================================================
  westernElements: {
    Fire: {
      name: "Fire",
      energy: "Yang",
      icon: "🔥",
      tagline: "Hot, Dry, Ascending",
      summary: "Passionate, energetic, and initiating. Fire embodies Yang warmth through active transformation and upward movement.",
      
      whyYinYang: `Western Fire is YANG because it is hot (Yang temperature), dry (Yang quality), ascending (Yang direction), and active (Yang mode). Fire initiates, transforms, and radiates outward - all Yang characteristics.`,
      
      inYourProfile: (name, points) => `Your Western sun sign is Fire element, contributing +${points} Yang points. This amplifies your passionate nature, energetic drive, and transformative power. Fire warms your personality and adds enthusiasm to your actions.`
    },

    Earth: {
      name: "Earth",
      energy: "Yin",
      element: "Earth",
      icon: "🌍",
      tagline: "Cold, Dry, Grounding",
      summary: "Stable, practical, and material. Earth embodies Yin stability through grounded receptivity and tangible form.",
      
      whyYinYang: `Western Earth is YIN because it is cold (Yin temperature), dry (balanced but leaning Yin), grounding (Yin direction), and receptive (Yin mode). Earth receives, stabilizes, and materializes - all Yin characteristics.`,
      
      inYourProfile: (name, points) => `Your Western sun sign is Earth element, contributing +${points} Yin points. This gives you grounded stability, practical wisdom, and material focus. Earth steadies your nature and adds reliable perseverance.`
    },

    Air: {
      name: "Air",
      energy: "Yang",
      icon: "💨",
      tagline: "Hot, Moist, Dispersing",
      summary: "Mental, communicative, and social. Air embodies Yang expression through thought dissemination and social connection.",
      
      whyYinYang: `Western Air is YANG because it is hot (Yang temperature), moist (Yang quality in this context), dispersing (Yang direction), and active (Yang mode). Air spreads ideas, connects socially, and moves constantly - all Yang characteristics.`,
      
      inYourProfile: (name, points) => `Your Western sun sign is Air element, contributing +${points} Yang points. This gives you mental agility, social connection, and communicative skill. Air lifts your spirit and adds intellectual versatility.`
    },

    Water: {
      name: "Water",
      energy: "Yin",
      icon: "💧",
      tagline: "Cold, Moist, Flowing",
      summary: "Emotional, intuitive, and adaptive. Water embodies Yin depth through feeling receptivity and flowing adaptation.",
      
      whyYinYang: `Western Water is YIN because it is cold (Yin temperature), moist (Yin quality), flowing downward (Yin direction), and receptive (Yin mode). Water feels, adapts, and flows - all Yin characteristics.`,
      
      inYourProfile: (name, points) => `Your Western sun sign is Water element, contributing +${points} Yin points. This gives you emotional depth, intuitive sensitivity, and adaptive flow. Water deepens your feelings and adds profound empathy.`
    }
  },

  // ===========================================================================
  // BIRTH TIME (Day/Night/Transition)
  // ===========================================================================
  birthTime: {
    Day: {
      name: "Day Birth",
      energy: "Yang",
      icon: "☀️",
      timeRange: "6:00 AM - 6:00 PM",
      tagline: "The Active Hours",
      summary: "Born during sunlight hours when Yang energy dominates. Day births carry active, outward, visible energy.",
      
      whyYinYang: `Day birth is YANG because the sun is above the horizon (Yang position), light is visible (Yang quality), and most human/animal activity occurs during day (Yang time). Daylight represents consciousness, activity, and outward engagement.`,
      
      inYourProfile: (name, points, time) => `You were born during daylight hours (${time}), contributing +${points} Yang points. This gives you active energy, outward focus, and visible expression. Your day birth adds vitality and sociability to your nature.`
    },

    Night: {
      name: "Night Birth",
      energy: "Yin",
      icon: "🌙",
      timeRange: "6:00 PM - 6:00 AM",
      tagline: "The Receptive Hours",
      summary: "Born during dark hours when Yin energy dominates. Night births carry receptive, inward, mysterious energy.",
      
      whyYinYang: `Night birth is YIN because the sun is below the horizon (Yin position), darkness prevails (Yin quality), and rest/sleep occurs at night (Yin activity). Nighttime represents the unconscious, receptivity, and inward processing.`,
      
      inYourProfile: (name, points, time) => `You were born during night hours (${time}), contributing +${points} Yin points. This gives you receptive energy, inward depth, and intuitive wisdom. Your night birth adds mystery and introspection to your nature.`
    },

    Transition: {
      name: "Transitional Birth",
      energy: "Balanced",
      icon: "🌅",
      timeRange: "Near sunrise/sunset (±30 min)",
      tagline: "The Liminal Hours",
      summary: "Born during twilight hours when Yin and Yang are balanced. Transition births carry adaptable, mediating energy.",
      
      whyYinYang: `Transitional birth is BALANCED because it occurs during dawn or dusk when day and night meet equally. These liminal times represent the balance point between Yin and Yang, the threshold between opposites. Those born at these times can navigate both realms.`,
      
      inYourProfile: (name, points, time) => `You were born during transitional hours (${time}), contributing +${points} Balanced points. This gives you adaptable energy, mediating wisdom, and ability to bridge opposites. Your twilight birth adds versatility and threshold perception.`
    }
  },

  // ===========================================================================
  // GENDER (Male/Female)
  // ===========================================================================
  gender: {
    Male: {
      name: "Male",
      energy: "Yang",
      icon: "♂",
      tagline: "The Masculine Force",
      summary: "Blessed with biological Yang energy - the initiating, protective, outward-moving force that has built civilizations and conquered challenges throughout human history.",
      
      origin: `In traditional Chinese medicine (TCM), which has observed human health for over 3,000 years, biological sex is considered one of the fundamental constitutional factors. Ancient physicians noticed that male bodies naturally expressed Yang characteristics: external energy, heat production, muscular action, and outward expression. The Nei Jing (Inner Canon of Medicine, 2,600 years old) describes how male biology aligns with Yang cycles - growing strong in youth, peaking in maturity, guided by solar rhythms.

Across virtually ALL traditional medicine systems worldwide - Chinese, Ayurvedic, Unani, Tibetan - male biology has been associated with Yang/Pitta/Hot/Dry qualities. This isn't cultural stereotype; it's biological observation spanning millennia and continents.`,
      
      whyYinYang: `Male is classified as YANG in constitutional analysis because of these biological realities:

• **Testosterone Dominance**: This primary hormone drives action-orientation, muscle building, competitive drive, risk-taking, and outward assertion - all Yang qualities
• **External Anatomy**: Yang energy moves outward and upward; male genitalia are external and projecting - physical manifestation of Yang direction  
• **Higher Metabolic Heat**: Male bodies typically run 0.5-1°F warmer than female bodies - Yang is warm energy
• **Solar Rhythm**: Male energy peaks during daylight hours (Yang time), with testosterone highest in morning
• **Muscle:Fat Ratio**: Greater muscle mass (Yang) versus fat storage (Yin) - built for action and exertion
• **Aggressive Protection**: Biological drive to protect, defend, and provide - Yang guardian energy

**CRITICAL UNDERSTANDING:** This is about BIOLOGICAL energy patterns, not personality or behavior! Many men are gentle, nurturing, intuitive, and receptive (all Yin traits) - and that's PERFECT. Your overall constitution comes from all 7 battles. Gender is only +10 points out of 100. A Yang-gendered person can absolutely be Yin-dominant overall!`,
      
      crossCultural: `**Chinese Medicine (TCM):** Yang (陽) energy - associated with Heaven, Sun, heat, exterior, ascending, expanding

**Ayurvedic Medicine (India):** Pitta dosha predominance (hot, sharp, penetrating energy) with Rajasic quality (action, passion, movement)

**Ancient Greek Medicine:** Hot and Dry temperament (choleric/sanguine) - Hippocrates and Galen documented this 2,400 years ago

**Tibetan Medicine:** Lung and Tripa qualities - wind (movement) and fire (heat) predominant in male constitution

**Unani Medicine (Persian/Arabic):** Hararat wa Yabusat (heat and dryness) - the masculine qualities in Mizaj (temperament)

**Western Verification:** Modern endocrinology confirms testosterone creates anabolic (building/action) physiology versus catabolic (receiving/storing)`,
      
      inYourProfile: (name, points) => `As a male, you are blessed with +${points} points of pure Yang energy! This is the masculine force that drives initiative, protects loved ones, and takes decisive action. Your Yang baseline gives you natural capacity for leadership, physical strength, and outward achievement. Remember: This is just your biological foundation - your complete personality comes from all 7 constitutional battles combined. Many men are predominantly Yin overall (and that's wonderful!) because the other 6 factors outweigh this baseline.`
    },

    Female: {
      name: "Female",
      energy: "Yin",
      icon: "♀",
      tagline: "The Feminine Power", 
      summary: "Blessed with biological Yin energy - the receptive, nurturing, life-creating power that has sustained humanity and brought forth all existence.",
      
      origin: `Traditional Chinese Medicine has recognized female biology as the ultimate expression of Yin energy for over 3,000 years. The Nei Jing (Inner Canon) describes how female bodies embody Earth's receptive power: internal creation, cyclic rhythms, blood nourishment, and the miraculous ability to create life within. Ancient physicians observed that women's health follows lunar cycles (the Moon is pure Yin), menstrual periods align with tidal rhythms, and the entire female reproductive system operates through receiving, holding, nourishing, and birthing.

Every traditional medicine system across the world - from Chinese to Ayurvedic to Native American - recognized female biology as sacred Yin/Lunar/Cool/Moist energy. This is the power that literally creates and sustains all human life.`,
      
      whyYinYang: `Female is classified as YIN in constitutional analysis because of these biological realities:

• **Estrogen Dominance**: This primary hormone promotes receptivity, relationship-building, intuition, emotional depth, and nurturing care - all Yin qualities
• **Internal Anatomy**: Yin energy moves inward and downward; female genitalia are internal and receptive - physical manifestation of Yin direction
• **Lunar Cycles**: Female biology follows Moon cycles (28 days) - menstruation, ovulation, hormonal rhythms all mirror Yin's cyclic nature
• **Body Temperature Cycling**: Temperature fluctuates through monthly cycle - Yin is cool, adaptable energy
• **Fat:Muscle Ratio**: Greater body fat percentage (Yin storage) versus muscle mass (Yang action) - built for endurance and nourishment
• **Life-Creation Capacity**: The ultimate Yin power - receiving, holding, nourishing, and birthing new life within
• **Intuitive Receptivity**: Biological sensitivity to emotional and energetic environments - Yin perception

**CRITICAL UNDERSTANDING:** This is about BIOLOGICAL energy patterns, not personality or behavior! Many women are assertive, competitive, action-driven, and leadership-oriented (all Yang traits) - and that's MAGNIFICENT. Your overall constitution comes from all 7 battles. Gender is only +10 points out of 100. A Yin-gendered person can absolutely be Yang-dominant overall!`,
      
      crossCultural: `**Chinese Medicine (TCM):** Yin (陰) energy - associated with Earth, Moon, coolness, interior, descending, contracting, blood nourishment

**Ayurvedic Medicine (India):** Kapha dosha predominance (cool, moist, nurturing energy) with Sattvic quality (harmony, peace, intuition)

**Ancient Greek Medicine:** Cold and Moist temperament (phlegmatic) - Hippocrates and Galen observed this connection to female constitution

**Tibetan Medicine:** Badkan quality - earth and water elements predominant, nourishing and stabilizing

**Unani Medicine (Persian/Arabic):** Barudat wa Ruṭūbat (coldness and moisture) - the feminine qualities in Mizaj (temperament)

**Western Verification:** Modern endocrinology confirms estrogen creates anabolic preservation (holding/storing) versus catabolic action`,
      
      inYourProfile: (name, points) => `As a female, you are blessed with +${points} points of pure Yin energy! This is the feminine power that creates life, nurtures growth, and sustains all existence. Your Yin baseline gives you natural capacity for deep intuition, emotional intelligence, and the miraculous ability to hold and nourish life. Remember: This is just your biological foundation - your complete personality comes from all 7 constitutional battles combined. Many women are predominantly Yang overall (and that's incredible!) because the other 6 factors outweigh this baseline.`
    }
  }
};

// Helper function to get theory content for a specific factor
export const getTheoryContent = (category, key) => {
  return yinYangTheory[category]?.[key] || null;
};

// Helper function to get all available categories
export const getAvailableCategories = () => {
  return Object.keys(yinYangTheory);
};
