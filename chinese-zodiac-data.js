// Chinese Zodiac 60-Year Cycle Data (1925-2040)
// Comprehensive Yin/Yang + Element + Animal system
// Each entry contains: Year, Start_Date, End_Date, Animal, Element, Polarity, Full_Name, Tagline, Description

const CHINESE_ZODIAC_DATA = [
  {
    "Year": 1925,
    "Start_Date": "1925-02-13",
    "End_Date": "1925-02-27",
    "Animal": "Ox",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Ox",
    "Tagline": "Steady, nurturing, deeply rooted growth",
    "Description": "The Yin Wood Ox embodies quiet persistence and organic development. Unlike the forceful Yang Wood that surges upward like a towering tree, Yin Wood spreads gently like vines or roots, weaving through obstacles with patience and adaptability. This Ox is not the charging bull of legend but a patient gardener of life—methodical, fertile, and deeply connected to long-term cultivation. People born under this sign often exhibit profound emotional resilience, absorbing setbacks like soil absorbs rain, then transforming them into future strength. They excel in roles requiring sustained effort and subtle influence: architects of systems, long-term planners, or quiet leaders who build empires one deliberate step at a time. Their ambition is not loud but inexorable—think bamboo growing through concrete. While they may appear reserved or even passive at first, their power lies in consistency and the ability to outlast challenges. Relationships with a Yin Wood Ox are built on trust earned slowly but unbreakable once given. They value harmony in their environment and often create spaces—literal or metaphorical—that foster growth in others."
  },
  {
    "Year": 1926,
    "Start_Date": "1926-02-02",
    "End_Date": "1926-02-16",
    "Animal": "Tiger",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Tiger",
    "Tagline": "Blazing, fearless, magnetic leadership",
    "Description": "The Yang Fire Tiger is a supernova of charisma and raw energy. Where Yin Fire flickers like a hearth, Yang Fire roars like a wildfire—untamed, brilliant, and impossible to ignore. This Tiger does not prowl; it charges into the spotlight with explosive confidence and infectious enthusiasm. Natural-born leaders, they inspire followers not through strategy but through sheer force of vision and passion. Their ambition burns hot and fast, often achieving breakthroughs others deem impossible. However, this intensity can lead to burnout or impulsiveness if not tempered. They thrive in high-stakes environments—startups, creative revolutions, or crisis leadership—where bold action is rewarded. In relationships, they are passionate but demand freedom; loyalty is given fiercely but never blindly. The Yang Fire Tiger teaches that true power lies not in control, but in igniting possibility in others."
  },
  {
    "Year": 1927,
    "Start_Date": "1927-02-18",
    "End_Date": "1927-03-04",
    "Animal": "Rabbit",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Rabbit",
    "Tagline": "Warm, intuitive, quietly transformative",
    "Description": "The Yin Fire Rabbit glows with inner light rather than outer blaze. This is not the leaping flame of Yang Fire but the steady ember—subtle, persistent, and deeply warming. Rabbits under this influence are masters of emotional intelligence, reading rooms and hearts with uncanny accuracy. Their creativity flows through gentle persuasion and artistic expression rather than confrontation. They excel in diplomacy, counseling, or any field requiring empathy and nuanced communication. While they avoid direct conflict, their influence reshapes environments over time, like candlelight softening shadows. Relationships with them feel safe yet inspiring; they nurture growth without overwhelming. Their ambition is to create beauty and harmony, often becoming quiet architects of cultural or emotional shifts. The Yin Fire Rabbit reminds us that true transformation often begins with a single, sustained spark of warmth."
  },
  {
    "Year": 1928,
    "Start_Date": "1928-02-05",
    "End_Date": "1928-02-19",
    "Animal": "Dragon",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Dragon",
    "Tagline": "Unstoppable, grounded, empire-building force",
    "Description": "The Yang Earth Dragon is a mountain that moves. Where other Dragons soar in ethereal realms, this one builds civilizations from the ground up with relentless, practical vision. Yang Earth combines expansive ambition with immovable stability—think tectonic plates shifting to form new continents. These Dragons are natural CEOs, urban planners, or institution builders who turn grand ideas into enduring structures. Their leadership is authoritative yet fair, commanding respect through competence rather than charisma alone. They possess an almost geological patience for long-term projects but can trigger seismic change when needed. In relationships, they are protective providers who value loyalty and legacy. While they may seem conservative, their innovations reshape societies for generations. The Yang Earth Dragon proves that true power is not in flight, but in creating foundations that outlast the builder."
  },
  {
    "Year": 1929,
    "Start_Date": "1929-02-10",
    "End_Date": "1929-02-24",
    "Animal": "Snake",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Snake",
    "Tagline": "Deep, strategic, subtly transformative wisdom",
    "Description": "The Yin Earth Snake moves beneath the surface, reshaping landscapes unseen. Unlike the flashy Metal Snake or fiery types, this one operates through quiet accumulation of knowledge and influence. Yin Earth lends a nurturing, almost maternal quality to the Snake’s natural mystique—think rich soil hiding ancient secrets. These individuals are profound thinkers, psychologists, or behind-the-scenes strategists who understand systems at their roots. Their wisdom is practical yet esoteric, often guiding others through crises with calm certainty. They excel in research, therapy, or any field requiring deep pattern recognition. Relationships evolve slowly but run deep; betrayal is rare but unforgiven. Their ambition is to understand and heal underlying structures—personal, social, or organizational. The Yin Earth Snake teaches that the most powerful changes begin in darkness, long before they break the surface."
  },
  {
    "Year": 1930,
    "Start_Date": "1930-01-30",
    "End_Date": "1930-02-13",
    "Animal": "Horse",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Horse",
    "Tagline": "Swift, precise, unstoppable momentum",
    "Description": "The Yang Metal Horse is a blade in motion—sharp, fast, and cutting through resistance with surgical precision. Where Wood Horses gallop freely, Metal Horses charge with purpose and discipline. This combination produces elite athletes, military strategists, or high-stakes performers who thrive under pressure. Their energy is focused rather than scattered; every movement serves a goal. They possess an almost mechanical efficiency paired with fierce independence. In relationships, they are passionate but require space to run; attempts to rein them in trigger rebellion. Their ambition is conquest—whether of markets, records, or personal limits. While they may seem cold, their loyalty, once earned, is forged in steel. The Yang Metal Horse embodies the truth that speed without direction is chaos, but precision at velocity changes history."
  },
  {
    "Year": 1931,
    "Start_Date": "1931-02-17",
    "End_Date": "1931-03-03",
    "Animal": "Goat",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Goat",
    "Tagline": "Refined, resilient, quietly revolutionary",
    "Description": "The Yin Metal Goat is forged steel wrapped in silk—delicate in appearance, unbreakable in essence. Unlike the soft Wood Goat, this one carries an inner core of tempered strength beneath artistic sensitivity. They are master craftspeople, designers, or performers who infuse beauty with durability. Their creativity is not whimsical but purposeful, creating works that stand the test of time. They navigate social landscapes with grace but defend their values with quiet ferocity. In relationships, they seek partners who appreciate both their refinement and resilience. Their ambition is to elevate the ordinary into art that endures. While they avoid conflict, when pushed, they reveal a spine of steel. The Yin Metal Goat proves that true strength often wears the gentlest face."
  },
  {
    "Year": 1932,
    "Start_Date": "1932-02-06",
    "End_Date": "1932-02-20",
    "Animal": "Monkey",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Monkey",
    "Tagline": "Brilliant, adaptable, socially masterful",
    "Description": "The Yang Water Monkey flows through any situation like a river around stones—never stuck, always advancing. Where Earth Monkeys build, Water Monkeys navigate, using fluid intelligence to solve complex social or technical puzzles. They are natural networkers, comedians, or entrepreneurs who turn connections into opportunities. Their mind operates like liquid circuitry, finding paths others miss. In relationships, they are charming but elusive; commitment requires intellectual stimulation. Their ambition is mastery of systems—social, digital, or economic—often becoming the indispensable link in any chain. While they may seem superficial, their adaptability masks deep strategic thinking. The Yang Water Monkey reminds us that in a changing world, the most powerful force is not strength but flow."
  },
  {
    "Year": 1933,
    "Start_Date": "1933-02-14",
    "End_Date": "1933-02-28",
    "Animal": "Rooster",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Rooster",
    "Tagline": "Perceptive, meticulous, emotionally intelligent",
    "Description": "The Yin Water Rooster observes everything, missing no detail, like morning dew catching every glint of light. Unlike the brash Fire Rooster, this one critiques with compassion and improves with care. They excel in editing, quality control, or any role requiring precision paired with emotional attunement. Their perfectionism serves others; they polish ideas and people until they shine. In relationships, they are devoted but require appreciation for their efforts. Their ambition is excellence—not for glory, but for the satisfaction of flawless execution. While they may seem nitpicky, their observations prevent disasters others overlook. The Yin Water Rooster teaches that true mastery lies in seeing what others miss and caring enough to fix it."
  },
  {
    "Year": 1934,
    "Start_Date": "1934-01-26",
    "End_Date": "1934-02-09",
    "Animal": "Dog",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Dog",
    "Tagline": "Loyal, principled, growth-oriented protector",
    "Description": "The Yang Wood Dog stands tall like an ancient oak—rooted in justice, reaching for progress. Where Metal Dogs guard with suspicion, Wood Dogs protect with proactive care, building communities that thrive. They are activists, coaches, or community leaders who combine fierce loyalty with forward-thinking vision. Their integrity is non-negotiable; they’d rather break than bend on principle. In relationships, they are steadfast partners who grow alongside their loved ones. Their ambition is to create lasting positive change—planting trees whose shade they’ll never sit under. While they may seem rigid, their growth mindset allows evolution without compromising core values. The Yang Wood Dog proves that true loyalty includes challenging those you love to become better."
  },
  {
    "Year": 1935,
    "Start_Date": "1935-02-04",
    "End_Date": "1935-02-18",
    "Animal": "Pig",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Pig",
    "Tagline": "Generous, nurturing, abundantly creative",
    "Description": "The Yin Wood Pig is a fertile garden of generosity, growing joy and sustenance for all. Unlike the flashy Fire Pig, this one shares quietly but abundantly, like roots spreading nutrients underground. They are artists, chefs, or caregivers whose creations nourish body and soul. Their empathy runs deep; they absorb others’ pain and transform it into beauty or comfort. In relationships, they are unconditional lovers who create homes filled with warmth and plenty. Their ambition is to make life richer for everyone they touch. While they may overgive, their boundaries, once set, are rooted deep. The Yin Wood Pig reminds us that true wealth is measured by what we give, not what we keep."
  },
  {
    "Year": 1936,
    "Start_Date": "1936-02-11",
    "End_Date": "1936-02-25",
    "Animal": "Rat",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Rat",
    "Tagline": "Dynamic, innovative, opportunity-igniting",
    "Description": "The Yang Fire Rat is a spark in a powder keg—small but capable of massive chain reactions. Where Water Rats calculate, Fire Rats intuit and act, turning hunches into empires overnight. They are startup founders, trendsetters, or crisis innovators who thrive in chaos. Their mind moves at light speed, connecting disparate ideas into brilliant solutions. In relationships, they are exciting but restless; stagnation is their kryptonite. Their ambition is to be first—first to market, first to insight, first to change the game. While they may burn bridges, they also light paths for others. The Yang Fire Rat proves that sometimes genius is 1% inspiration and 99% ignition."
  },
  {
    "Year": 1937,
    "Start_Date": "1937-01-24",
    "End_Date": "1937-02-07",
    "Animal": "Ox",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Ox",
    "Tagline": "Warm, determined, quietly revolutionary",
    "Description": "The Yin Fire Ox smolders with inner passion beneath a calm exterior. Unlike the explosive Yang Fire, this is controlled burn—sustained, purposeful, and transformative. They are reformers, labor leaders, or patient innovators who change systems from within. Their determination is legendary; obstacles are fuel, not barriers. In relationships, they are devoted partners whose love deepens slowly but burns forever. Their ambition is to improve the world through steady, practical progress. While they may seem traditional, their methods often upend the status quo. The Yin Fire Ox teaches that revolutions don’t always roar—they can simmer until the old order melts away."
  },
  {
    "Year": 1938,
    "Start_Date": "1938-02-08",
    "End_Date": "1938-02-22",
    "Animal": "Tiger",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Tiger",
    "Tagline": "Grounded, powerful, territory-expanding",
    "Description": "The Yang Earth Tiger is a lion on the savanna—majestic, territorial, and undeniably dominant. Where Fire Tigers blaze trails, Earth Tigers claim and cultivate them, building lasting domains. They are real estate moguls, tribal leaders, or family patriarchs who expand influence through strategic control. Their power is physical and practical; they shape landscapes and legacies. In relationships, they are protective but possessive; their love is a fortress. Their ambition is dominion—not just to win, but to own the board itself. While they may seem conservative, their expansions reshape maps. The Yang Earth Tiger proves that true conquest is not taking land, but making it yours forever."
  },
  {
    "Year": 1939,
    "Start_Date": "1939-02-19",
    "End_Date": "1939-03-05",
    "Animal": "Rabbit",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Rabbit",
    "Tagline": "Nurturing, intuitive, home-building harmony",
    "Description": "The Yin Earth Rabbit creates sanctuaries—emotional, physical, and social. Unlike the social Fire Rabbit, this one builds quiet nests of safety and abundance. They are therapists, interior designers, or community organizers who make spaces where people flourish. Their intuition reads the emotional climate like a farmer reads soil. In relationships, they are gentle partners who prioritize harmony and mutual growth. Their ambition is to cultivate environments where everyone thrives. While they avoid conflict, their influence reshapes group dynamics subtly but profoundly. The Yin Earth Rabbit reminds us that the most revolutionary act is often creating a place where people feel truly at home."
  },
  {
    "Year": 1940,
    "Start_Date": "1940-02-08",
    "End_Date": "1940-02-22",
    "Animal": "Dragon",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Dragon",
    "Tagline": "Forged, commanding, legacy-defining",
    "Description": "The Yang Metal Dragon is a sword of destiny—sharp, unbreakable, and etched with purpose. Where Wood Dragons dream, Metal Dragons execute with precision and authority. They are generals, surgeons, or tech titans who wield power with surgical accuracy. Their vision is grand but grounded in flawless execution. In relationships, they are intense partners who demand excellence but offer unwavering protection. Their ambition is to leave monuments—companies, inventions, or institutions that define eras. While they may seem cold, their passion is channeled into mastery. The Yang Metal Dragon proves that true greatness is not in scale, but in the perfection of the cut."
  },
  {
    "Year": 1941,
    "Start_Date": "1941-01-27",
    "End_Date": "1941-02-10",
    "Animal": "Snake",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Snake",
    "Tagline": "Precise, enigmatic, surgically insightful",
    "Description": "The Yin Metal Snake strikes with diamond precision—lethal in insight, elegant in execution. Unlike the transformative Earth Snake, this one dissects truth with cold brilliance. They are detectives, surgeons, or analysts who see through deception like X-rays. Their mind is a scalpel, cutting to the core of any problem. In relationships, they are intense but private; intimacy is rare but profound. Their ambition is mastery of hidden truths—whether in science, psychology, or strategy. While they may seem aloof, their observations save lives and fortunes. The Yin Metal Snake teaches that the sharpest blade is not the loudest, but the one that never misses."
  },
  {
    "Year": 1942,
    "Start_Date": "1942-02-15",
    "End_Date": "1942-03-01",
    "Animal": "Horse",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Horse",
    "Tagline": "Free-spirited, intuitive, boundary-breaking",
    "Description": "The Yang Water Horse gallops across oceans of possibility, unbound by convention. Where Metal Horses charge with discipline, Water Horses flow with inspired freedom. They are explorers, artists, or entrepreneurs who follow intuition over maps. Their energy is tidal—sometimes gentle, sometimes tsunami-level creative floods. In relationships, they are passionate but allergic to cages; true love means riding side by side. Their ambition is discovery—of new lands, ideas, or expressions. While they may seem unreliable, their breakthroughs redefine what’s possible. The Yang Water Horse proves that sometimes the greatest journeys begin with a leap into the unknown."
  },
  {
    "Year": 1943,
    "Start_Date": "1943-02-05",
    "End_Date": "1943-02-19",
    "Animal": "Goat",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Goat",
    "Tagline": "Empathic, fluid, emotionally nourishing",
    "Description": "The Yin Water Goat is a healing spring—gentle, restorative, and deeply attuned to emotional currents. Unlike the structured Earth Goat, this one flows with compassion, absorbing and soothing pain. They are counselors, nurses, or artists who translate feeling into form. Their empathy is oceanic; they feel the room’s mood like tides. In relationships, they are nurturing partners who create emotional safety. Their ambition is to heal—individuals, communities, or cultures through understanding. While they may drown in others’ emotions, their boundaries, once learned, are fluid but firm. The Yin Water Goat reminds us that sometimes the greatest strength is the capacity to hold space for another’s storm."
  },
  {
    "Year": 1944,
    "Start_Date": "1944-01-25",
    "End_Date": "1944-02-08",
    "Animal": "Monkey",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Monkey",
    "Tagline": "Inventive, expansive, system-growing genius",
    "Description": "The Yang Wood Monkey climbs every tree of knowledge, building networks in the canopy. Where Metal Monkeys refine, Wood Monkeys innovate and expand. They are inventors, networkers, or platform creators who connect ideas into ecosystems. Their mind branches in all directions, seeing opportunities where others see dead ends. In relationships, they are stimulating but restless; growth is their love language. Their ambition is to build frameworks—technical, social, or conceptual—that scale. While they may overextend, their creations often outlive them. The Yang Wood Monkey proves that genius is not a single idea, but the forest grown from many seeds."
  },
  {
    "Year": 1945,
    "Start_Date": "1945-02-13",
    "End_Date": "1945-02-27",
    "Animal": "Rooster",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Rooster",
    "Tagline": "Meticulous, artistic, perfection-growing",
    "Description": "The Yin Wood Rooster tends the garden of detail, pruning for beauty and function. Unlike the flashy Fire Rooster, this one crafts excellence through patient refinement. They are editors, designers, or horticulturists who elevate the ordinary into art. Their perfectionism serves growth; every critique nurtures potential. In relationships, they are devoted partners who help loved ones bloom. Their ambition is mastery through iteration—version 1.0 is just the seed. While they may obsess over flaws, their vision creates lasting beauty. The Yin Wood Rooster teaches that true excellence is cultivated, not declared."
  },
  {
    "Year": 1946,
    "Start_Date": "1946-02-02",
    "End_Date": "1946-02-16",
    "Animal": "Dog",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Dog",
    "Tagline": "Passionate, protective, justice-driven",
    "Description": "The Yang Fire Dog guards with blazing loyalty and fierce moral clarity. Where Earth Dogs build walls, Fire Dogs light beacons, rallying others to causes. They are activists, first responders, or whistleblowers who risk everything for what’s right. Their sense of justice burns hot; hypocrisy is their enemy. In relationships, they are intense partners whose love is both shield and sword. Their ambition is to defend the vulnerable and ignite change. While they may burn out, their passion inspires movements. The Yang Fire Dog proves that true protection sometimes requires setting the world on fire to save it."
  },
  {
    "Year": 1947,
    "Start_Date": "1947-01-22",
    "End_Date": "1947-02-05",
    "Animal": "Pig",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Pig",
    "Tagline": "Warm, generous, joy-spreading",
    "Description": "The Yin Fire Pig is a hearth of abundance—sharing warmth, food, and laughter with all. Unlike the reserved Water Pig, this one celebrates life with open-hearted enthusiasm. They are hosts, performers, or philanthropists who make everyone feel included. Their generosity is legendary; they give until it hurts, then give more. In relationships, they are affectionate partners who create traditions of joy. Their ambition is to spread happiness—through art, community, or simple acts of kindness. While they may overindulge, their light lifts spirits in dark times. The Yin Fire Pig reminds us that true wealth is measured in smiles shared around the table."
  },
  {
    "Year": 1948,
    "Start_Date": "1948-02-10",
    "End_Date": "1948-02-24",
    "Animal": "Rat",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Rat",
    "Tagline": "Resourceful, strategic, empire-building",
    "Description": "The Yang Earth Rat hoards opportunity like grain for winter, then builds granaries that feed nations. Where Fire Rats ignite, Earth Rats accumulate and organize. They are investors, logisticians, or family business heads who turn small advantages into lasting wealth. Their mind is a vault of practical wisdom. In relationships, they are providers who plan for generations. Their ambition is security—not just financial, but systemic and familial. While they may seem paranoid, their preparations save lives in crises. The Yang Earth Rat proves that survival is not luck, but strategy compounded over time."
  },
  {
    "Year": 1949,
    "Start_Date": "1949-01-29",
    "End_Date": "1949-02-12",
    "Animal": "Ox",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Ox",
    "Tagline": "Patient, fertile, foundation-laying",
    "Description": "The Yin Earth Ox is the quiet farmer of destiny—plowing deep furrows for future harvests. Unlike the charging Wood Ox, this one builds slowly but unbreakably. They are architects, historians, or elders who lay cornerstones for civilizations. Their patience is geological; they think in decades, not days. In relationships, they are steady partners who grow love like vintage wine. Their ambition is legacy—creating systems, families, or knowledge that endure. While they may seem stuck in the past, their work enables the future. The Yin Earth Ox teaches that the mightiest structures rise from the humblest, most deliberate beginnings."
  },
  {
    "Year": 1950,
    "Start_Date": "1950-02-17",
    "End_Date": "1950-03-03",
    "Animal": "Tiger",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Tiger",
    "Tagline": "Fierce, disciplined, conquest-driven",
    "Description": "The Yang Metal Tiger is a samurai of the jungle—honor-bound, lethal, and magnificent. Where Fire Tigers inspire, Metal Tigers conquer with precision and code. They are martial artists, executives, or athletes who blend raw power with iron discipline. Their roar is rare but earthquake-level when unleashed. In relationships, they are passionate but demand mutual respect; betrayal ends in swift severance. Their ambition is mastery—of self, opponent, or market. While they may seem ruthless, their actions follow a strict moral code. The Yang Metal Tiger proves that true strength is not wildness, but power perfectly controlled."
  },
  {
    "Year": 1951,
    "Start_Date": "1951-02-06",
    "End_Date": "1951-02-20",
    "Animal": "Rabbit",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Rabbit",
    "Tagline": "Elegant, precise, harmony-forging",
    "Description": "The Yin Metal Rabbit is a diplomat’s blade sheathed in silk—sharp but used only for peace. Unlike the nurturing Earth Rabbit, this one resolves conflict with surgical grace. They are negotiators, designers, or etiquette masters who maintain beauty under pressure. Their intuition is razor-sharp, reading subtext like sheet music. In relationships, they are refined partners who elevate both parties. Their ambition is perfect harmony—social, aesthetic, or emotional. While they may seem fragile, their resilience is forged steel. The Yin Metal Rabbit teaches that true power often prevents the fight, not wins it."
  },
  {
    "Year": 1952,
    "Start_Date": "1952-01-27",
    "End_Date": "1952-02-10",
    "Animal": "Dragon",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Dragon",
    "Tagline": "Visionary, fluid, world-shaping",
    "Description": "The Yang Water Dragon rides waves of change, surfing chaos into new realities. Where Metal Dragons command, Water Dragons adapt and overwhelm. They are futurists, sailors, or media moguls who shape culture through flow. Their vision is oceanic—vast, deep, and ever-shifting. In relationships, they are exciting but elusive; love must evolve with them. Their ambition is to redefine possibility—geographic, technological, or philosophical. While they may seem directionless, their currents carve canyons over time. The Yang Water Dragon proves that the most powerful force is not resistance, but relentless adaptation."
  },
  {
    "Year": 1953,
    "Start_Date": "1953-02-14",
    "End_Date": "1953-02-28",
    "Animal": "Snake",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Snake",
    "Tagline": "Mystical, intuitive, depth-plumbing",
    "Description": "The Yin Water Snake dives into the subconscious, emerging with pearls of wisdom. Unlike the analytical Metal Snake, this one navigates by feeling and instinct. They are psychologists, divers, or spiritual teachers who explore inner oceans. Their knowing is pre-verbal, sensing truth like pressure changes underwater. In relationships, they are intense partners who merge souls. Their ambition is to reveal hidden depths—personal or collective. While they may seem secretive, their revelations heal ancient wounds. The Yin Water Snake teaches that the greatest mysteries are not solved, but submerged into."
  },
  {
    "Year": 1954,
    "Start_Date": "1954-02-03",
    "End_Date": "1954-02-17",
    "Animal": "Horse",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Horse",
    "Tagline": "Adventurous, expansive, freedom-pursuing",
    "Description": "The Yang Wood Horse gallops through open plains, seeking horizons without end. Where Water Horses flow, Wood Horses grow—exploring to expand, not escape. They are travelers, writers, or pioneers who map new territories of experience. Their energy is renewable, fueled by discovery and challenge. In relationships, they are passionate but need space to roam; true love is a shared journey. Their ambition is to live fully—collecting stories, skills, and stamps in their passport of life. While they may seem restless, their paths inspire others to move. The Yang Wood Horse proves that freedom is not the absence of roots, but the courage to grow beyond them."
  },
  {
    "Year": 1955,
    "Start_Date": "1955-01-24",
    "End_Date": "1955-02-07",
    "Animal": "Goat",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Goat",
    "Tagline": "Artistic, empathetic, beauty-cultivating",
    "Description": "The Yin Wood Goat tends an inner garden of imagination, growing beauty from feeling. Unlike the structured Metal Goat, this one creates through emotional resonance. They are poets, gardeners, or therapists who heal through art and nature. Their sensitivity is their superpower, translating pain into petals. In relationships, they are gentle partners who nurture mutual growth. Their ambition is to make the world more beautiful—one painting, one kindness, one listener at a time. While they may wilt under harshness, their resilience is in their roots. The Yin Wood Goat reminds us that art is not decoration, but oxygen for the soul."
  },
  {
    "Year": 1956,
    "Start_Date": "1956-02-12",
    "End_Date": "1956-02-26",
    "Animal": "Monkey",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Monkey",
    "Tagline": "Charismatic, inventive, spotlight-stealing",
    "Description": "The Yang Fire Monkey is a fireworks display of genius—brilliant, loud, and unforgettable. Where Water Monkeys flow, Fire Monkeys explode with ideas and performance. They are comedians, influencers, or showrunners who command attention and adoration. Their mind is a sparkler, connecting concepts with dazzling speed. In relationships, they are exciting but high-maintenance; love must be a standing ovation. Their ambition is fame—not for ego, but for the platform to share their vision. While they may burn out spectators, their light reveals new possibilities. The Yang Fire Monkey proves that sometimes you must dazzle to be heard."
  },
  {
    "Year": 1957,
    "Start_Date": "1957-01-31",
    "End_Date": "1957-02-14",
    "Animal": "Rooster",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Rooster",
    "Tagline": "Passionate, precise, performance-perfecting",
    "Description": "The Yin Fire Rooster struts with controlled flamboyance—every feather in place, every note on pitch. Unlike the chaotic Yang Fire, this one channels passion into flawless execution. They are directors, conductors, or perfectionist chefs who demand and deliver excellence. Their critique is constructive fire, burning away weakness to reveal strength. In relationships, they are dramatic partners who script epic romances. Their ambition is to be unforgettable—in art, craft, or reputation. While they may seem vain, their standards elevate everyone around them. The Yin Fire Rooster teaches that true brilliance is not raw talent, but talent refined to a cutting edge."
  },
  {
    "Year": 1958,
    "Start_Date": "1958-02-18",
    "End_Date": "1958-03-04",
    "Animal": "Dog",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Dog",
    "Tagline": "Loyal, practical, community-building",
    "Description": "The Yang Earth Dog is the cornerstone of any pack—reliable, protective, and deeply rooted in duty. Where Fire Dogs fight injustice, Earth Dogs build the villages worth defending. They are contractors, mayors, or family anchors who create stability for generations. Their loyalty is geological—once given, it weathers any storm. In relationships, they are providers whose love language is service and security. Their ambition is to leave a safer, stronger world behind. While they may resist change, their foundations enable progress. The Yang Earth Dog proves that true heroism is often the quiet work of holding the line."
  },
  {
    "Year": 1959,
    "Start_Date": "1959-02-08",
    "End_Date": "1959-02-22",
    "Animal": "Pig",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Pig",
    "Tagline": "Generous, grounded, abundance-sharing",
    "Description": "The Yin Earth Pig is a bountiful harvest shared with all—rich, warm, and deeply satisfying. Unlike the flashy Fire Pig, this one gives quietly but substantially. They are farmers, cooks, or philanthropists who feed bodies and souls. Their generosity is rooted in gratitude for life’s abundance. In relationships, they are nurturing partners who create homes of plenty and peace. Their ambition is to ensure no one at their table goes hungry—physically or emotionally. While they may overindulge, their hearts are pure soil for kindness. The Yin Earth Pig reminds us that true wealth is grown, not hoarded, and shared, not displayed."
  },
  {
    "Year": 1960,
    "Start_Date": "1960-01-28",
    "End_Date": "1960-02-11",
    "Animal": "Rat",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Rat",
    "Tagline": "Strategic, precise, opportunity-seizing",
    "Description": "The Yang Metal Rat is a master thief of opportunity—slipping through cracks with diamond-cut precision. Where Earth Rats hoard, Metal Rats invest and multiply. They are traders, coders, or negotiators who turn information into gold. Their mind is a vault of calculated risks. In relationships, they are stimulating but guarded; trust is earned through competence. Their ambition is wealth—not just money, but networks, knowledge, and influence. While they may seem ruthless, their moves follow a strict code. The Yang Metal Rat proves that in a world of chaos, the sharpest mind wins."
  },
  {
    "Year": 1961,
    "Start_Date": "1961-02-15",
    "End_Date": "1961-03-01",
    "Animal": "Ox",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Ox",
    "Tagline": "Disciplined, refined, legacy-crafting",
    "Description": "The Yin Metal Ox is a master swordsmith of destiny—forging enduring works with quiet precision. Unlike the charging Wood Ox, this one builds with meticulous craftsmanship. They are engineers, historians, or artisans who create tools and traditions that last centuries. Their work ethic is monastic; perfection is prayer. In relationships, they are devoted partners whose love is shown through acts of service. Their ambition is to leave a mark that time cannot erase. While they may seem rigid, their flexibility is in the tempering process. The Yin Metal Ox teaches that true strength is not in force, but in the quality of the steel."
  },
  {
    "Year": 1962,
    "Start_Date": "1962-02-05",
    "End_Date": "1962-02-19",
    "Animal": "Tiger",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Tiger",
    "Tagline": "Intuitive, powerful, current-riding",
    "Description": "The Yang Water Tiger is a tsunami of instinct—overwhelming, beautiful, and unstoppable. Where Metal Tigers strike with precision, Water Tigers flow with primal knowing. They are surfers, generals, or shamans who ride the waves of chaos. Their power is fluid; they adapt faster than opponents can react. In relationships, they are intense but elusive; love must match their rhythm. Their ambition is to master the unseen forces—market tides, emotional currents, or spiritual energies. While they may seem wild, their navigation is flawless. The Yang Water Tiger proves that true dominance is not control, but perfect attunement to the flow."
  },
  {
    "Year": 1963,
    "Start_Date": "1963-01-25",
    "End_Date": "1963-02-08",
    "Animal": "Rabbit",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Rabbit",
    "Tagline": "Empathic, fluid, connection-weaving",
    "Description": "The Yin Water Rabbit is a gentle current linking isolated ponds into a living river. Unlike the social Fire Rabbit, this one connects through deep emotional resonance. They are matchmakers, counselors, or networkers who see the hidden threads between souls. Their intuition is liquid, flowing into others’ feelings effortlessly. In relationships, they are nurturing partners who create emotional ecosystems. Their ambition is to heal divisions—personal, social, or cultural. While they may absorb too much, their boundaries are learned through immersion. The Yin Water Rabbit reminds us that true connection is not in words, but in the silent flow between hearts."
  },
  {
    "Year": 1964,
    "Start_Date": "1964-02-13",
    "End_Date": "1964-02-27",
    "Animal": "Dragon",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Dragon",
    "Tagline": "Visionary, expansive, world-building",
    "Description": "The Yang Wood Dragon is a sky-reaching redwood of ambition—rooted in earth, crowned in clouds. Where Metal Dragons command, Wood Dragons grow, building living empires. They are architects, filmmakers, or nation-builders who scale vision into reality. Their creativity is organic, branching in unexpected but fruitful directions. In relationships, they are inspiring partners who help loved ones reach new heights. Their ambition is to leave forests, not monuments—systems that self-perpetuate. While they may overreach, their failures fertilize future success. The Yang Wood Dragon proves that true legacy is not stone, but living growth."
  },
  {
    "Year": 1965,
    "Start_Date": "1965-02-02",
    "End_Date": "1965-02-16",
    "Animal": "Snake",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Snake",
    "Tagline": "Subtle, adaptive, wisdom-growing",
    "Description": "The Yin Wood Snake is a vine of quiet knowing, wrapping around truth with patient persistence. Unlike the cutting Metal Snake, this one grows through and around obstacles. They are herbalists, strategists, or elders who accumulate wisdom like rings in a tree. Their insight deepens with time, revealing patterns decades in the making. In relationships, they are slow to trust but lifelong in loyalty. Their ambition is to understand life’s cycles—biological, social, or spiritual. While they may seem passive, their influence reshapes landscapes over generations. The Yin Wood Snake teaches that the most profound changes are organic, not forced."
  },
  {
    "Year": 1966,
    "Start_Date": "1966-01-21",
    "End_Date": "1966-02-04",
    "Animal": "Horse",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Horse",
    "Tagline": "Passionate, free, trail-blazing",
    "Description": "The Yang Fire Horse is a comet across the sky—brilliant, fast, and leaving sparks in its wake. Where Wood Horses explore, Fire Horses ignite, turning paths into legends. They are rock stars, revolutionaries, or athletes who live at full throttle. Their energy is contagious, inspiring crowds to follow their blaze. In relationships, they are intense but fleeting; love must burn as bright as they do. Their ambition is to be unforgettable—records broken, rules rewritten, hearts set aflame. While they may crash and burn, their light guides others forward. The Yang Fire Horse proves that sometimes you must risk explosion to achieve escape velocity."
  },
  {
    "Year": 1967,
    "Start_Date": "1967-02-09",
    "End_Date": "1967-02-23",
    "Animal": "Goat",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Goat",
    "Tagline": "Creative, warm, inspiration-spreading",
    "Description": "The Yin Fire Goat is a hearth of imagination, warming and illuminating all who gather. Unlike the structured Earth Goat, this one creates through passionate expression. They are musicians, storytellers, or teachers who ignite creativity in others. Their art is emotional fuel, transforming pain into beauty. In relationships, they are affectionate partners who keep the home fires burning. Their ambition is to inspire—movements, children, or cultural shifts through shared feeling. While they may burn low at times, their embers reignite easily. The Yin Fire Goat reminds us that true art is not product, but the spark passed from soul to soul."
  },
  {
    "Year": 1968,
    "Start_Date": "1968-01-30",
    "End_Date": "1968-02-13",
    "Animal": "Monkey",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Monkey",
    "Tagline": "Practical, resourceful, system-building",
    "Description": "The Yang Earth Monkey is a master engineer of chaos, turning disorder into functioning order. Where Fire Monkeys dazzle, Earth Monkeys construct—practical, scalable, and durable. They are project managers, farmers, or politicians who build infrastructure for ideas. Their cleverness is grounded, solving real-world problems with ingenious simplicity. In relationships, they are reliable partners who plan for the long haul. Their ambition is to create systems that work for everyone—efficient, fair, and resilient. While they may lack glamour, their work enables progress. The Yang Earth Monkey proves that true innovation is not flashy, but functional."
  },
  {
    "Year": 1969,
    "Start_Date": "1969-02-17",
    "End_Date": "1969-03-03",
    "Animal": "Rooster",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Rooster",
    "Tagline": "Meticulous, nurturing, quality-grounding",
    "Description": "The Yin Earth Rooster tends the details like a farmer tends crops—patient, precise, and deeply invested. Unlike the performative Fire Rooster, this one perfects through quiet care. They are editors, inspectors, or master gardeners who ensure excellence at the root level. Their standards are high but fair, improving without ego. In relationships, they are devoted partners who build love brick by brick. Their ambition is to create work that endures—flawless, useful, and beautiful in its simplicity. While they may obsess over minutiae, their attention prevents collapse. The Yin Earth Rooster teaches that perfection is not obsession, but love made visible."
  },
  {
    "Year": 1970,
    "Start_Date": "1970-02-06",
    "End_Date": "1970-02-20",
    "Animal": "Dog",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Dog",
    "Tagline": "Honorable, protective, justice-enforcing",
    "Description": "The Yang Metal Dog is a knight in shining armor—unyielding in principle, fierce in defense. Where Earth Dogs build communities, Metal Dogs enforce the codes that hold them together. They are police, lawyers, or security experts who wield authority with integrity. Their loyalty is absolute, but so is their sense of right and wrong. In relationships, they are devoted but demanding; love must align with their values. Their ambition is to protect the innocent and punish the guilty. While they may seem harsh, their justice is fair. The Yang Metal Dog proves that true protection requires both compassion and the courage to draw the sword."
  },
  {
    "Year": 1971,
    "Start_Date": "1971-01-27",
    "End_Date": "1971-02-10",
    "Animal": "Pig",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Pig",
    "Tagline": "Refined, generous, luxury-sharing",
    "Description": "The Yin Metal Pig is a connoisseur of life’s finer things, sharing beauty with graceful abundance. Unlike the earthy Earth Pig, this one elevates pleasure into art. They are sommeliers, jewelers, or patrons who make luxury accessible through generosity. Their taste is impeccable, their giving elegant. In relationships, they are indulgent partners who create experiences of pure delight. Their ambition is to refine and share—wine, art, or moments of transcendence. While they may seem extravagant, their gifts often carry deep meaning. The Yin Metal Pig reminds us that true luxury is not possession, but the art of appreciation shared."
  },
  {
    "Year": 1972,
    "Start_Date": "1972-02-15",
    "End_Date": "1972-03-01",
    "Animal": "Rat",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Rat",
    "Tagline": "Adaptive, intuitive, opportunity-flowing",
    "Description": "The Yang Water Rat navigates life’s currents with liquid cunning, always finding the path of least resistance to success. Where Metal Rats calculate, Water Rats sense—reading markets, people, or trends like ripples on a pond. They are traders, journalists, or diplomats who thrive in flux. Their adaptability is their superpower, turning chaos into profit. In relationships, they are charming but slippery; commitment requires constant evolution. Their ambition is to ride every wave—financial, cultural, or technological. While they may seem opportunistic, their instincts often benefit the group. The Yang Water Rat proves that in a changing world, survival belongs to the most fluid."
  },
  {
    "Year": 1973,
    "Start_Date": "1973-02-03",
    "End_Date": "1973-02-17",
    "Animal": "Ox",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Ox",
    "Tagline": "Patient, absorbent, deeply resilient",
    "Description": "The Yin Water Ox is a deep well of strength—quiet, sustaining, and seemingly bottomless. Unlike the charging Earth Ox, this one absorbs pressure and transforms it into power. They are therapists, reservoirs, or long-term investors who grow stronger under stress. Their patience is oceanic; they outlast any drought. In relationships, they are steady partners who hold space for emotional floods. Their ambition is to be the unbreakable foundation others build upon. While they may seem passive, their depth runs fathoms deep. The Yin Water Ox teaches that true endurance is not resistance, but the capacity to contain and convert."
  },
  {
    "Year": 1974,
    "Start_Date": "1974-01-23",
    "End_Date": "1974-02-06",
    "Animal": "Tiger",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Tiger",
    "Tagline": "Courageous, expansive, territory-growing",
    "Description": "The Yang Wood Tiger is a jungle king in expansion mode—claiming new ground with bold vision. Where Metal Tigers conquer, Wood Tigers cultivate, turning wilderness into thriving domains. They are explorers, developers, or activists who push boundaries for growth. Their courage is rooted in purpose, not bravado. In relationships, they are passionate partners who encourage mutual evolution. Their ambition is to expand what’s possible—geographically, intellectually, or socially. While they may overextend, their trails become highways for others. The Yang Wood Tiger proves that true bravery is not in the fight, but in the willingness to grow beyond known territory."
  },
  {
    "Year": 1975,
    "Start_Date": "1975-02-11",
    "End_Date": "1975-02-25",
    "Animal": "Rabbit",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Rabbit",
    "Tagline": "Gentle, creative, harmony-growing",
    "Description": "The Yin Wood Rabbit is a quiet force of organic diplomacy, weaving peace through subtle influence. Unlike the social Fire Rabbit, this one builds alliances like ivy—slowly, steadily, and beautifully. They are mediators, gardeners, or community builders who foster cooperation through care. Their gentleness is strategic, disarming conflict with empathy. In relationships, they are nurturing partners who help love take root and flourish. Their ambition is to create environments where everyone can grow. While they may seem fragile, their networks are resilient. The Yin Wood Rabbit reminds us that the strongest bonds are grown, not imposed."
  },
  {
    "Year": 1976,
    "Start_Date": "1976-01-31",
    "End_Date": "1976-02-14",
    "Animal": "Dragon",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Dragon",
    "Tagline": "Charismatic, visionary, world-igniting",
    "Description": "The Yang Fire Dragon is a supernova of leadership—blazing trails and inspiring legions. Where Wood Dragons build, Fire Dragons transform through sheer force of will and vision. They are CEOs, revolutionaries, or cultural icons who change paradigms overnight. Their presence is magnetic, their ideas incendiary. In relationships, they are intense but demanding; love must match their grandeur. Their ambition is to redefine reality—technological, political, or artistic. While they may burn out followers, their light births new eras. The Yang Fire Dragon proves that sometimes the world needs to be set ablaze to be reborn."
  },
  {
    "Year": 1977,
    "Start_Date": "1977-02-18",
    "End_Date": "1977-03-04",
    "Animal": "Snake",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Snake",
    "Tagline": "Seductive, transformative, passion-guided",
    "Description": "The Yin Fire Snake is a slow-burning fuse of desire and insight, leading to explosive change. Unlike the analytical Water Snake, this one transforms through emotional intensity. They are lovers, mystics, or therapists who heal through passionate connection. Their allure is hypnotic, drawing secrets and truths to the surface. In relationships, they are all-consuming partners who merge on every level. Their ambition is to catalyze evolution—personal or collective through shared fire. While they may overwhelm, their transformations are permanent. The Yin Fire Snake teaches that true change often begins with a single, sustained spark of desire."
  },
  {
    "Year": 1978,
    "Start_Date": "1978-02-07",
    "End_Date": "1978-02-21",
    "Animal": "Horse",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Horse",
    "Tagline": "Reliable, powerful, distance-covering",
    "Description": "The Yang Earth Horse is a freight train of progress—steady, powerful, and covering vast distances. Where Fire Horses sprint, Earth Horses endure, building infrastructure for the long haul. They are logisticians, marathoners, or family providers who deliver consistently. Their strength is in sustained effort, not flashy speed. In relationships, they are dependable partners who go the distance. Their ambition is to connect—people, places, or possibilities through reliable systems. While they may seem plodding, their momentum is unstoppable. The Yang Earth Horse proves that true progress is measured in miles, not minutes."
  },
  {
    "Year": 1979,
    "Start_Date": "1979-01-28",
    "End_Date": "1979-02-11",
    "Animal": "Goat",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Goat",
    "Tagline": "Nurturing, stable, community-anchoring",
    "Description": "The Yin Earth Goat is the hearth and home of any group—warm, stable, and deeply comforting. Unlike the artistic Wood Goat, this one builds emotional and physical security. They are homemakers, social workers, or earth stewards who create sanctuaries. Their care is practical, meeting needs before they’re spoken. In relationships, they are grounding partners who make love feel like coming home. Their ambition is to provide—safety, sustenance, and belonging for their herd. While they may resist adventure, their stability enables others’ flights. The Yin Earth Goat reminds us that true care is not grand gestures, but the quiet reliability of being there."
  },
  {
    "Year": 1980,
    "Start_Date": "1980-02-16",
    "End_Date": "1980-03-02",
    "Animal": "Monkey",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Monkey",
    "Tagline": "Inventive, precise, tool-mastering",
    "Description": "The Yang Metal Monkey is a master mechanic of reality—building, fixing, and improving with brilliant efficiency. Where Wood Monkeys experiment, Metal Monkeys perfect. They are engineers, surgeons, or hackers who refine systems to peak performance. Their mind is a workshop of precision tools. In relationships, they are problem-solving partners who fix what’s broken. Their ambition is optimization—of machines, processes, or human potential. While they may seem cold, their improvements save lives and time. The Yang Metal Monkey proves that true creativity is not invention from nothing, but perfection from the existing."
  },
  {
    "Year": 1981,
    "Start_Date": "1981-02-05",
    "End_Date": "1981-02-19",
    "Animal": "Rooster",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Rooster",
    "Tagline": "Discerning, elegant, standard-setting",
    "Description": "The Yin Metal Rooster is a jeweler of excellence—polishing every detail to a mirror finish. Unlike the loud Fire Rooster, this one critiques with refined taste. They are critics, stylists, or quality controllers who elevate through discernment. Their standards are sky-high but fair, pushing for true mastery. In relationships, they are sophisticated partners who appreciate nuance. Their ambition is to define excellence—in art, behavior, or craft. While they may seem nitpicky, their eye for detail creates masterpieces. The Yin Metal Rooster teaches that true beauty is not natural, but carefully curated."
  },
  {
    "Year": 1982,
    "Start_Date": "1982-01-25",
    "End_Date": "1982-02-08",
    "Animal": "Dog",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Dog",
    "Tagline": "Intuitive, protective, truth-seeking",
    "Description": "The Yang Water Dog follows scent trails through emotional fog, guarding truth with fluid vigilance. Where Metal Dogs enforce rules, Water Dogs sense deception. They are investigators, therapists, or spiritual guardians who protect through understanding. Their loyalty is deep but discerning; they sniff out falsehoods. In relationships, they are devoted but require authenticity. Their ambition is to uncover and protect what’s real—facts, feelings, or souls. While they may seem suspicious, their instincts prevent betrayal. The Yang Water Dog proves that true protection begins with seeing clearly."
  },
  {
    "Year": 1983,
    "Start_Date": "1983-02-13",
    "End_Date": "1983-02-27",
    "Animal": "Pig",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Pig",
    "Tagline": "Compassionate, absorbent, emotionally rich",
    "Description": "The Yin Water Pig is an ocean of empathy, holding the world’s joys and sorrows with gentle depth. Unlike the refined Metal Pig, this one gives through pure emotional availability. They are listeners, caregivers, or artists who translate collective feeling into form. Their heart is boundless, absorbing pain to transform it. In relationships, they are all-encompassing partners who make love feel like floating. Their ambition is to heal through connection—holding space for the unexpressed. While they may drown in others’ emotions, their buoyancy returns. The Yin Water Pig reminds us that true generosity is the courage to feel everything."
  },
  {
    "Year": 1984,
    "Start_Date": "1984-02-02",
    "End_Date": "1984-02-16",
    "Animal": "Rat",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Rat",
    "Tagline": "Resourceful, expansive, opportunity-growing",
    "Description": "The Yang Wood Rat is a bamboo entrepreneur—flexible, fast-growing, and turning small shoots into forests of profit. Where Metal Rats refine, Wood Rats multiply. They are startup founders, networkers, or investors who scale ideas exponentially. Their resourcefulness is organic, finding nutrients in unlikely soil. In relationships, they are stimulating partners who help dreams take root. Their ambition is to build ecosystems—business, social, or knowledge-based. While they may spread thin, their networks self-sustain. The Yang Wood Rat proves that true wealth is not hoarded, but cultivated and shared."
  },
  {
    "Year": 1985,
    "Start_Date": "1985-02-20",
    "End_Date": "1985-03-06",
    "Animal": "Ox",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Ox",
    "Tagline": "Patient, nurturing, foundation-growing",
    "Description": "The Yin Wood Ox is a patient farmer of potential, planting seeds that become ancient forests. Unlike the charging Yang Wood, this one grows through quiet persistence. They are mentors, archivists, or long-term planners who build legacies one season at a time. Their strength is in sustained, gentle effort. In relationships, they are steady partners whose love deepens like root systems. Their ambition is to create enduring value—knowledge, family, or institutions. While they may seem slow, their growth is unstoppable. The Yin Wood Ox teaches that true power is in the patience to outlast every season."
  },
  {
    "Year": 1986,
    "Start_Date": "1986-02-09",
    "End_Date": "1986-02-23",
    "Animal": "Tiger",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Tiger",
    "Tagline": "Blazing, fearless, magnetic leadership",
    "Description": "The Yang Fire Tiger is a supernova of charisma and raw energy. Where Yin Fire flickers like a hearth, Yang Fire roars like a wildfire—untamed, brilliant, and impossible to ignore. This Tiger does not prowl; it charges into the spotlight with explosive confidence and infectious enthusiasm. Natural-born leaders, they inspire followers not through strategy but through sheer force of vision and passion. Their ambition burns hot and fast, often achieving breakthroughs others deem impossible. However, this intensity can lead to burnout or impulsiveness if not tempered. They thrive in high-stakes environments—startups, creative revolutions, or crisis leadership—where bold action is rewarded. In relationships, they are passionate but demand freedom; loyalty is given fiercely but never blindly. The Yang Fire Tiger teaches that true power lies not in control, but in igniting possibility in others."
  },
  {
    "Year": 1987,
    "Start_Date": "1987-01-29",
    "End_Date": "1987-02-12",
    "Animal": "Rabbit",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Rabbit",
    "Tagline": "Warm, intuitive, quietly transformative",
    "Description": "The Yin Fire Rabbit glows with inner light rather than outer blaze. This is not the leaping flame of Yang Fire but the steady ember—subtle, persistent, and deeply warming. Rabbits under this influence are masters of emotional intelligence, reading rooms and hearts with uncanny accuracy. Their creativity flows through gentle persuasion and artistic expression rather than confrontation. They excel in diplomacy, counseling, or any field requiring empathy and nuanced communication. While they avoid direct conflict, their influence reshapes environments over time, like candlelight softening shadows. Relationships with them feel safe yet inspiring; they nurture growth without overwhelming. Their ambition is to create beauty and harmony, often becoming quiet architects of cultural or emotional shifts. The Yin Fire Rabbit reminds us that true transformation often begins with a single, sustained spark of warmth."
  },
  {
    "Year": 1988,
    "Start_Date": "1988-02-17",
    "End_Date": "1988-03-03",
    "Animal": "Dragon",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Dragon",
    "Tagline": "Unstoppable, grounded, empire-building force",
    "Description": "The Yang Earth Dragon is a mountain that moves. Where other Dragons soar in ethereal realms, this one builds civilizations from the ground up with relentless, practical vision. Yang Earth combines expansive ambition with immovable stability—think tectonic plates shifting to form new continents. These Dragons are natural CEOs, urban planners, or institution builders who turn grand ideas into enduring structures. Their leadership is authoritative yet fair, commanding respect through competence rather than charisma alone. They possess an almost geological patience for long-term projects but can trigger seismic change when needed. In relationships, they are protective providers who value loyalty and legacy. While they may seem conservative, their innovations reshape societies for generations. The Yang Earth Dragon proves that true power is not in flight, but in creating foundations that outlast the builder."
  },
  {
    "Year": 1989,
    "Start_Date": "1989-02-06",
    "End_Date": "1989-02-20",
    "Animal": "Snake",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Snake",
    "Tagline": "Deep, strategic, subtly transformative wisdom",
    "Description": "The Yin Earth Snake moves beneath the surface, reshaping landscapes unseen. Unlike the flashy Metal Snake or fiery types, this one operates through quiet accumulation of knowledge and influence. Yin Earth lends a nurturing, almost maternal quality to the Snake’s natural mystique—think rich soil hiding ancient secrets. These individuals are profound thinkers, psychologists, or behind-the-scenes strategists who understand systems at their roots. Their wisdom is practical yet esoteric, often guiding others through crises with calm certainty. They excel in research, therapy, or any field requiring deep pattern recognition. Relationships evolve slowly but run deep; betrayal is rare but unforgiven. Their ambition is to understand and heal underlying structures—personal, social, or organizational. The Yin Earth Snake teaches that the most powerful changes begin in darkness, long before they break the surface."
  },
  {
    "Year": 1990,
    "Start_Date": "1990-01-27",
    "End_Date": "1990-02-10",
    "Animal": "Horse",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Horse",
    "Tagline": "Swift, precise, unstoppable momentum",
    "Description": "The Yang Metal Horse is a blade in motion—sharp, fast, and cutting through resistance with surgical precision. Where Wood Horses gallop freely, Metal Horses charge with purpose and discipline. This combination produces elite athletes, military strategists, or high-stakes performers who thrive under pressure. Their energy is focused rather than scattered; every movement serves a goal. They possess an almost mechanical efficiency paired with fierce independence. In relationships, they are passionate but require space to run; attempts to rein them in trigger rebellion. Their ambition is conquest—whether of markets, records, or personal limits. While they may seem cold, their loyalty, once earned, is forged in steel. The Yang Metal Horse embodies the truth that speed without direction is chaos, but precision at velocity changes history."
  },
  {
    "Year": 1991,
    "Start_Date": "1991-02-15",
    "End_Date": "1991-03-01",
    "Animal": "Goat",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Goat",
    "Tagline": "Refined, resilient, quietly revolutionary",
    "Description": "The Yin Metal Goat is forged steel wrapped in silk—delicate in appearance, unbreakable in essence. Unlike the soft Wood Goat, this one carries an inner core of tempered strength beneath artistic sensitivity. They are master craftspeople, designers, or performers who infuse beauty with durability. Their creativity is not whimsical but purposeful, creating works that stand the test of time. They navigate social landscapes with grace but defend their values with quiet ferocity. In relationships, they seek partners who appreciate both their refinement and resilience. Their ambition is to elevate the ordinary into art that endures. While they avoid conflict, when pushed, they reveal a spine of steel. The Yin Metal Goat proves that true strength often wears the gentlest face."
  },
  {
    "Year": 1992,
    "Start_Date": "1992-02-04",
    "End_Date": "1992-02-18",
    "Animal": "Monkey",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Monkey",
    "Tagline": "Brilliant, adaptable, socially masterful",
    "Description": "The Yang Water Monkey flows through any situation like a river around stones—never stuck, always advancing. Where Earth Monkeys build, Water Monkeys navigate, using fluid intelligence to solve complex social or technical puzzles. They are natural networkers, comedians, or entrepreneurs who turn connections into opportunities. Their mind operates like liquid circuitry, finding paths others miss. In relationships, they are charming but elusive; commitment requires intellectual stimulation. Their ambition is mastery of systems—social, digital, or economic—often becoming the indispensable link in any chain. While they may seem superficial, their adaptability masks deep strategic thinking. The Yang Water Monkey reminds us that in a changing world, the most powerful force is not strength but flow."
  },
  {
    "Year": 1993,
    "Start_Date": "1993-01-23",
    "End_Date": "1993-02-06",
    "Animal": "Rooster",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Rooster",
    "Tagline": "Perceptive, meticulous, emotionally intelligent",
    "Description": "The Yin Water Rooster observes everything, missing no detail, like morning dew catching every glint of light. Unlike the brash Fire Rooster, this one critiques with compassion and improves with care. They excel in editing, quality control, or any role requiring precision paired with emotional attunement. Their perfectionism serves others; they polish ideas and people until they shine. In relationships, they are devoted but require appreciation for their efforts. Their ambition is excellence—not for glory, but for the satisfaction of flawless execution. While they may seem nitpicky, their observations prevent disasters others overlook. The Yin Water Rooster teaches that true mastery lies in seeing what others miss and caring enough to fix it."
  },
  {
    "Year": 1994,
    "Start_Date": "1994-02-10",
    "End_Date": "1994-02-24",
    "Animal": "Dog",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Dog",
    "Tagline": "Loyal, principled, growth-oriented protector",
    "Description": "The Yang Wood Dog stands tall like an ancient oak—rooted in justice, reaching for progress. Where Metal Dogs guard with suspicion, Wood Dogs protect with proactive care, building communities that thrive. They are activists, coaches, or community leaders who combine fierce loyalty with forward-thinking vision. Their integrity is non-negotiable; they’d rather break than bend on principle. In relationships, they are steadfast partners who grow alongside their loved ones. Their ambition is to create lasting positive change—planting trees whose shade they’ll never sit under. While they may seem rigid, their growth mindset allows evolution without compromising core values. The Yang Wood Dog proves that true loyalty includes challenging those you love to become better."
  },
  {
    "Year": 1995,
    "Start_Date": "1995-01-31",
    "End_Date": "1995-02-14",
    "Animal": "Pig",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Pig",
    "Tagline": "Generous, nurturing, abundantly creative",
    "Description": "The Yin Wood Pig is a fertile garden of generosity, growing joy and sustenance for all. Unlike the flashy Fire Pig, this one shares quietly but abundantly, like roots spreading nutrients underground. They are artists, chefs, or caregivers whose creations nourish body and soul. Their empathy runs deep; they absorb others’ pain and transform it into beauty or comfort. In relationships, they are unconditional lovers who create homes filled with warmth and plenty. Their ambition is to make life richer for everyone they touch. While they may overgive, their boundaries, once set, are rooted deep. The Yin Wood Pig reminds us that true wealth is measured by what we give, not what we keep."
  },
  {
    "Year": 1996,
    "Start_Date": "1996-02-19",
    "End_Date": "1996-03-05",
    "Animal": "Rat",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Rat",
    "Tagline": "Dynamic, innovative, opportunity-igniting",
    "Description": "The Yang Fire Rat is a spark in a powder keg—small but capable of massive chain reactions. Where Water Rats calculate, Fire Rats intuit and act, turning hunches into empires overnight. They are startup founders, trendsetters, or crisis innovators who thrive in chaos. Their mind moves at light speed, connecting disparate ideas into brilliant solutions. In relationships, they are exciting but restless; stagnation is their kryptonite. Their ambition is to be first—first to market, first to insight, first to change the game. While they may burn bridges, they also light paths for others. The Yang Fire Rat proves that sometimes genius is 1% inspiration and 99% ignition."
  },
  {
    "Year": 1997,
    "Start_Date": "1997-02-07",
    "End_Date": "1997-02-21",
    "Animal": "Ox",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Ox",
    "Tagline": "Warm, determined, quietly revolutionary",
    "Description": "The Yin Fire Ox smolders with inner passion beneath a calm exterior. Unlike the explosive Yang Fire, this is controlled burn—sustained, purposeful, and transformative. They are reformers, labor leaders, or patient innovators who change systems from within. Their determination is legendary; obstacles are fuel, not barriers. In relationships, they are devoted partners whose love deepens slowly but burns forever. Their ambition is to improve the world through steady, practical progress. While they may seem traditional, their methods often upend the status quo. The Yin Fire Ox teaches that revolutions don’t always roar—they can simmer until the old order melts away."
  },
  {
    "Year": 1998,
    "Start_Date": "1998-01-28",
    "End_Date": "1998-02-11",
    "Animal": "Tiger",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Tiger",
    "Tagline": "Grounded, powerful, territory-expanding",
    "Description": "The Yang Earth Tiger is a lion on the savanna—majestic, territorial, and undeniably dominant. Where Fire Tigers blaze trails, Earth Tigers claim and cultivate them, building lasting domains. They are real estate moguls, tribal leaders, or family patriarchs who expand influence through strategic control. Their power is physical and practical; they shape landscapes and legacies. In relationships, they are protective but possessive; their love is a fortress. Their ambition is dominion—not just to win, but to own the board itself. While they may seem conservative, their expansions reshape maps. The Yang Earth Tiger proves that true conquest is not taking land, but making it yours forever."
  },
  {
    "Year": 1999,
    "Start_Date": "1999-02-16",
    "End_Date": "1999-03-02",
    "Animal": "Rabbit",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Rabbit",
    "Tagline": "Nurturing, intuitive, home-building harmony",
    "Description": "The Yin Earth Rabbit creates sanctuaries—emotional, physical, and social. Unlike the social Fire Rabbit, this one builds quiet nests of safety and abundance. They are therapists, interior designers, or community organizers who make spaces where people flourish. Their intuition reads the emotional climate like a farmer reads soil. In relationships, they are gentle partners who prioritize harmony and mutual growth. Their ambition is to cultivate environments where everyone thrives. While they avoid conflict, their influence reshapes group dynamics subtly but profoundly. The Yin Earth Rabbit reminds us that the most revolutionary act is often creating a place where people feel truly at home."
  },
  {
    "Year": 2000,
    "Start_Date": "2000-02-05",
    "End_Date": "2000-02-19",
    "Animal": "Dragon",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Dragon",
    "Tagline": "Forged, commanding, legacy-defining",
    "Description": "The Yang Metal Dragon is a sword of destiny—sharp, unbreakable, and etched with purpose. Where Wood Dragons dream, Metal Dragons execute with precision and authority. They are generals, surgeons, or tech titans who wield power with surgical accuracy. Their vision is grand but grounded in flawless execution. In relationships, they are intense partners who demand excellence but offer unwavering protection. Their ambition is to leave monuments—companies, inventions, or institutions that define eras. While they may seem cold, their passion is channeled into mastery. The Yang Metal Dragon proves that true greatness is not in scale, but in the perfection of the cut."
  },
  {
    "Year": 2001,
    "Start_Date": "2001-01-24",
    "End_Date": "2001-02-07",
    "Animal": "Snake",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Snake",
    "Tagline": "Precise, enigmatic, surgically insightful",
    "Description": "The Yin Metal Snake strikes with diamond precision—lethal in insight, elegant in execution. Unlike the transformative Earth Snake, this one dissects truth with cold brilliance. They are detectives, surgeons, or analysts who see through deception like X-rays. Their mind is a scalpel, cutting to the core of any problem. In relationships, they are intense but private; intimacy is rare but profound. Their ambition is mastery of hidden truths—whether in science, psychology, or strategy. While they may seem aloof, their observations save lives and fortunes. The Yin Metal Snake teaches that the sharpest blade is not the loudest, but the one that never misses."
  },
  {
    "Year": 2002,
    "Start_Date": "2002-02-12",
    "End_Date": "2002-02-26",
    "Animal": "Horse",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Horse",
    "Tagline": "Free-spirited, intuitive, boundary-breaking",
    "Description": "The Yang Water Horse gallops across oceans of possibility, unbound by convention. Where Metal Horses charge with discipline, Water Horses flow with inspired freedom. They are explorers, artists, or entrepreneurs who follow intuition over maps. Their energy is tidal—sometimes gentle, sometimes tsunami-level creative floods. In relationships, they are passionate but allergic to cages; true love means riding side by side. Their ambition is discovery—of new lands, ideas, or expressions. While they may seem unreliable, their breakthroughs redefine what’s possible. The Yang Water Horse proves that sometimes the greatest journeys begin with a leap into the unknown."
  },
  {
    "Year": 2003,
    "Start_Date": "2003-02-01",
    "End_Date": "2003-02-15",
    "Animal": "Goat",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Goat",
    "Tagline": "Empathic, fluid, emotionally nourishing",
    "Description": "The Yin Water Goat is a healing spring—gentle, restorative, and deeply attuned to emotional currents. Unlike the structured Earth Goat, this one flows with compassion, absorbing and soothing pain. They are counselors, nurses, or artists who translate feeling into form. Their empathy is oceanic; they feel the room’s mood like tides. In relationships, they are nurturing partners who create emotional safety. Their ambition is to heal—individuals, communities, or cultures through understanding. While they may drown in others’ emotions, their boundaries, once learned, are fluid but firm. The Yin Water Goat reminds us that sometimes the greatest strength is the capacity to hold space for another’s storm."
  },
  {
    "Year": 2004,
    "Start_Date": "2004-01-22",
    "End_Date": "2004-02-05",
    "Animal": "Monkey",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Monkey",
    "Tagline": "Inventive, expansive, system-growing genius",
    "Description": "The Yang Wood Monkey climbs every tree of knowledge, building networks in the canopy. Where Metal Monkeys refine, Wood Monkeys innovate and expand. They are inventors, networkers, or platform creators who connect ideas into ecosystems. Their mind branches in all directions, seeing opportunities where others see dead ends. In relationships, they are stimulating but restless; growth is their love language. Their ambition is to build frameworks—technical, social, or conceptual—that scale. While they may overextend, their creations often outlive them. The Yang Wood Monkey proves that genius is not a single idea, but the forest grown from many seeds."
  },
  {
    "Year": 2005,
    "Start_Date": "2005-02-09",
    "End_Date": "2005-02-23",
    "Animal": "Rooster",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Rooster",
    "Tagline": "Meticulous, artistic, perfection-growing",
    "Description": "The Yin Wood Rooster tends the garden of detail, pruning for beauty and function. Unlike the flashy Fire Rooster, this one crafts excellence through patient refinement. They are editors, designers, or horticulturists who elevate the ordinary into art. Their perfectionism serves growth; every critique nurtures potential. In relationships, they are devoted partners who help loved ones bloom. Their ambition is mastery through iteration—version 1.0 is just the seed. While they may obsess over flaws, their vision creates lasting beauty. The Yin Wood Rooster teaches that true excellence is cultivated, not declared."
  },
  {
    "Year": 2006,
    "Start_Date": "2006-01-29",
    "End_Date": "2006-02-12",
    "Animal": "Dog",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Dog",
    "Tagline": "Passionate, protective, justice-driven",
    "Description": "The Yang Fire Dog guards with blazing loyalty and fierce moral clarity. Where Earth Dogs build walls, Fire Dogs light beacons, rallying others to causes. They are activists, first responders, or whistleblowers who risk everything for what’s right. Their sense of justice burns hot; hypocrisy is their enemy. In relationships, they are intense partners whose love is both shield and sword. Their ambition is to defend the vulnerable and ignite change. While they may burn out, their passion inspires movements. The Yang Fire Dog proves that true protection sometimes requires setting the world on fire to save it."
  },
  {
    "Year": 2007,
    "Start_Date": "2007-02-18",
    "End_Date": "2007-03-04",
    "Animal": "Pig",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Pig",
    "Tagline": "Warm, generous, joy-spreading",
    "Description": "The Yin Fire Pig is a hearth of abundance—sharing warmth, food, and laughter with all. Unlike the reserved Water Pig, this one celebrates life with open-hearted enthusiasm. They are hosts, performers, or philanthropists who make everyone feel included. Their generosity is legendary; they give until it hurts, then give more. In relationships, they are affectionate partners who create traditions of joy. Their ambition is to spread happiness—through art, community, or simple acts of kindness. While they may overindulge, their light lifts spirits in dark times. The Yin Fire Pig reminds us that true wealth is measured in smiles shared around the table."
  },
  {
    "Year": 2008,
    "Start_Date": "2008-02-07",
    "End_Date": "2008-02-21",
    "Animal": "Rat",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Rat",
    "Tagline": "Resourceful, strategic, empire-building",
    "Description": "The Yang Earth Rat hoards opportunity like grain for winter, then builds granaries that feed nations. Where Fire Rats ignite, Earth Rats accumulate and organize. They are investors, logisticians, or family business heads who turn small advantages into lasting wealth. Their mind is a vault of practical wisdom. In relationships, they are providers who plan for generations. Their ambition is security—not just financial, but systemic and familial. While they may seem paranoid, their preparations save lives in crises. The Yang Earth Rat proves that survival is not luck, but strategy compounded over time."
  },
  {
    "Year": 2009,
    "Start_Date": "2009-01-26",
    "End_Date": "2009-02-09",
    "Animal": "Ox",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Ox",
    "Tagline": "Patient, fertile, foundation-laying",
    "Description": "The Yin Earth Ox is the quiet farmer of destiny—plowing deep furrows for future harvests. Unlike the charging Wood Ox, this one builds slowly but unbreakably. They are architects, historians, or elders who lay cornerstones for civilizations. Their patience is geological; they think in decades, not days. In relationships, they are steady partners who grow love like vintage wine. Their ambition is legacy—creating systems, families, or knowledge that endure. While they may seem stuck in the past, their work enables the future. The Yin Earth Ox teaches that the mightiest structures rise from the humblest, most deliberate beginnings."
  },
  {
    "Year": 2010,
    "Start_Date": "2010-02-14",
    "End_Date": "2010-02-28",
    "Animal": "Tiger",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Tiger",
    "Tagline": "Fierce, disciplined, conquest-driven",
    "Description": "The Yang Metal Tiger is a samurai of the jungle—honor-bound, lethal, and magnificent. Where Fire Tigers inspire, Metal Tigers conquer with precision and code. They are martial artists, executives, or athletes who blend raw power with iron discipline. Their roar is rare but earthquake-level when unleashed. In relationships, they are passionate but demand mutual respect; betrayal ends in swift severance. Their ambition is mastery—of self, opponent, or market. While they may seem ruthless, their actions follow a strict moral code. The Yang Metal Tiger proves that true strength is not wildness, but power perfectly controlled."
  },
  {
    "Year": 2011,
    "Start_Date": "2011-02-03",
    "End_Date": "2011-02-17",
    "Animal": "Rabbit",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Rabbit",
    "Tagline": "Elegant, precise, harmony-forging",
    "Description": "The Yin Metal Rabbit negotiates global tensions with refined diplomacy and surgical grace. Unlike the nurturing Earth Rabbit, this one resolves conflict through precision and poise, often in high-stakes international or corporate arenas. They are diplomats, UX designers, or mediators who craft peace with the finesse of a jeweler setting a gem. Their intuition reads subtext like code, defusing crises before they erupt. In relationships, they are sophisticated partners who elevate both parties through mutual refinement. Their ambition is perfect harmony—social, aesthetic, or algorithmic. While they may seem fragile, their resilience is tempered steel. The Yin Metal Rabbit teaches that true power prevents the fight through elegant, unyielding standards."
  },
  {
    "Year": 2012,
    "Start_Date": "2012-01-23",
    "End_Date": "2012-02-06",
    "Animal": "Dragon",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Dragon",
    "Tagline": "Visionary, fluid, world-shaping",
    "Description": "The Yang Water Dragon rides digital tsunamis, reshaping industries with adaptive genius. Where Metal Dragons command, Water Dragons flow—overwhelming barriers with intuitive strategy. They are app creators, climate innovators, or social media moguls who redefine connectivity. Their vision is oceanic, sensing trends before they crest. In relationships, they are exciting but elusive; love must evolve with their currents. Their ambition is to architect the future—VR worlds, sustainable oceans, or global networks. While they may seem directionless, their flow carves new realities. The Yang Water Dragon proves that in the information age, the most powerful force is fluid, relentless adaptation."
  },
  {
    "Year": 2013,
    "Start_Date": "2013-02-10",
    "End_Date": "2013-02-24",
    "Animal": "Snake",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Snake",
    "Tagline": "Mystical, intuitive, depth-plumbing",
    "Description": "The Yin Water Snake dives into data oceans and human psyches, emerging with transformative insights. Unlike the analytical Metal Snake, this one navigates by emotional and algorithmic instinct. They are data scientists, therapists, or blockchain mystics who uncover hidden patterns. Their knowing is pre-cognitive, sensing shifts like underwater currents. In relationships, they are intense partners who merge minds and souls. Their ambition is to reveal submerged truths—AI ethics, subconscious biases, or crypto secrets. While they may seem secretive, their revelations heal systemic wounds. The Yin Water Snake teaches that in an age of noise, wisdom flows from silent depths."
  },
  {
    "Year": 2014,
    "Start_Date": "2014-01-31",
    "End_Date": "2014-02-14",
    "Animal": "Horse",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Horse",
    "Tagline": "Adventurous, expansive, freedom-pursuing",
    "Description": "The Yang Wood Horse gallops through gig economies and remote frontiers, seeking growth without borders. Where Water Horses flow, Wood Horses expand—exploring to scale, not escape. They are digital nomads, e-commerce pioneers, or sustainability explorers who map new lifestyles. Their energy is renewable, fueled by challenge and connection. In relationships, they are passionate but need space; true love is a shared expedition. Their ambition is to live unbound—collecting experiences, skills, and global perspectives. While they may seem restless, their paths inspire mass migration to freedom. The Yang Wood Horse proves that in a connected world, freedom is growth beyond physical limits."
  },
  {
    "Year": 2015,
    "Start_Date": "2015-02-19",
    "End_Date": "2015-03-05",
    "Animal": "Goat",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Goat",
    "Tagline": "Artistic, empathetic, beauty-cultivating",
    "Description": "The Yin Wood Goat tends virtual gardens of creativity, growing beauty in digital soil. Unlike the structured Metal Goat, this one creates through emotional and ecological resonance. They are content creators, eco-designers, or mental health advocates who heal through art and nature. Their sensitivity translates climate anxiety into sustainable aesthetics. In relationships, they are gentle partners who nurture mutual flourishing. Their ambition is to make the world more beautiful—one post, one policy, one listener at a time. While they may wilt under toxicity, their roots run deep in community. The Yin Wood Goat reminds us that in a screen-filled world, art remains oxygen for the soul."
  },
  {
    "Year": 2016,
    "Start_Date": "2016-02-08",
    "End_Date": "2016-02-22",
    "Animal": "Monkey",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Monkey",
    "Tagline": "Charismatic, inventive, spotlight-stealing",
    "Description": "The Yang Fire Monkey dominates feeds and stages with viral genius and explosive innovation. Where Water Monkeys flow, Fire Monkeys ignite—turning ideas into cultural phenomena. They are TikTok stars, meme lords, or AI entertainers who command global attention. Their mind sparks connections at light speed. In relationships, they are exciting but high-maintenance; love must be a viral hit. Their ambition is cultural dominance—not for ego, but to shape narratives. While they may burn out audiences, their light redefines influence. The Yang Fire Monkey proves that in the attention economy, brilliance must dazzle to dominate."
  },
  {
    "Year": 2017,
    "Start_Date": "2017-01-28",
    "End_Date": "2017-02-11",
    "Animal": "Rooster",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Rooster",
    "Tagline": "Passionate, precise, performance-perfecting",
    "Description": "The Yin Fire Rooster curates perfection in live streams and boardrooms with controlled flamboyance. Unlike chaotic Yang Fire, this one channels passion into flawless execution. They are directors, esports coaches, or brand strategists who demand and deliver excellence. Their critique is constructive fire, refining talent to brilliance. In relationships, they are dramatic partners who script epic love stories. Their ambition is to be unforgettable—in content, craft, or reputation. While they may seem vain, their standards elevate industries. The Yin Fire Rooster teaches that in a recorded world, true brilliance is talent refined to viral perfection."
  },
  {
    "Year": 2018,
    "Start_Date": "2018-02-16",
    "End_Date": "2018-03-02",
    "Animal": "Dog",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Dog",
    "Tagline": "Loyal, practical, community-building",
    "Description": "The Yang Earth Dog anchors online tribes and local movements with reliable, grounded duty. Where Fire Dogs fight injustice, Earth Dogs build the platforms worth defending. They are moderators, DAO founders, or neighborhood organizers who create digital-physical stability. Their loyalty is geological—once given, it weathers any algorithm change. In relationships, they are providers whose love language is consistent presence. Their ambition is to leave safer, stronger communities behind. While they may resist trends, their foundations enable innovation. The Yang Earth Dog proves that in a volatile world, true heroism is the quiet work of holding space."
  },
  {
    "Year": 2019,
    "Start_Date": "2019-02-05",
    "End_Date": "2019-02-19",
    "Animal": "Pig",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Pig",
    "Tagline": "Generous, grounded, abundance-sharing",
    "Description": "The Yin Earth Pig shares sustainable harvests and digital bounty with warm, practical generosity. Unlike flashy Fire Pigs, this one gives substantially through community fridges and open-source abundance. They are urban farmers, mutual aid coordinators, or NFT philanthropists who feed bodies and souls. Their generosity is rooted in gratitude for shared resources. In relationships, they are nurturing partners who create homes of plenty and peace. Their ambition is to ensure no one goes hungry—physically, emotionally, or informationally. While they may overindulge, their hearts are fertile soil for kindness. The Yin Earth Pig reminds us that true wealth is grown locally and shared globally."
  },
  {
    "Year": 2020,
    "Start_Date": "2020-01-25",
    "End_Date": "2020-02-08",
    "Animal": "Rat",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Rat",
    "Tagline": "Strategic, precise, opportunity-seizing",
    "Description": "The Yang Metal Rat pivots through pandemics and market crashes with diamond-cut survival instinct. Where Earth Rats hoard, Metal Rats invest in resilience—masks, remote tools, or vaccine logistics. They are supply chain heroes, day traders, or crisis entrepreneurs who turn chaos into calculated gain. Their mind is a vault of contingency plans. In relationships, they are stimulating but guarded; trust is earned through competence under pressure. Their ambition is systemic security—not just profit, but survival infrastructure. While they may seem ruthless, their moves save lives. The Yang Metal Rat proves that in crisis, the sharpest mind forges the strongest future."
  },
  {
    "Year": 2021,
    "Start_Date": "2021-02-12",
    "End_Date": "2021-02-26",
    "Animal": "Ox",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Ox",
    "Tagline": "Disciplined, refined, legacy-crafting",
    "Description": "The Yin Metal Ox rebuilds post-pandemic worlds with meticulous, enduring craftsmanship. Unlike charging Wood Oxen, this one forges tools and traditions for the long haul—vaccines, remote work protocols, or mental health frameworks. They are engineers, policymakers, or artisans who create systems that outlast crises. Their work ethic is monastic; perfection is resilience. In relationships, they are devoted partners whose love is shown through acts of service. Their ambition is to leave a mark that time—and viruses—cannot erase. While they may seem rigid, their flexibility is in the tempering. The Yin Metal Ox teaches that true recovery is not speed, but the quality of the rebuild."
  },
  {
    "Year": 2022,
    "Start_Date": "2022-02-01",
    "End_Date": "2022-02-15",
    "Animal": "Tiger",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Tiger",
    "Tagline": "Intuitive, powerful, current-riding",
    "Description": "The Yang Water Tiger surfs geopolitical and crypto waves with primal, adaptive power. Where Metal Tigers strike, Water Tigers flow—overwhelming barriers with instinct and timing. They are macro traders, climate activists, or metaverse pioneers who ride uncertainty. Their power is tidal, sensing shifts before they break. In relationships, they are intense but elusive; love must match their rhythm. Their ambition is to master unseen forces—market tides, social currents, or AI flows. While they may seem wild, their navigation is flawless. The Yang Water Tiger proves that in turbulent times, dominance belongs to those who flow with the chaos."
  },
  {
    "Year": 2023,
    "Start_Date": "2023-01-22",
    "End_Date": "2023-02-05",
    "Animal": "Rabbit",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Rabbit",
    "Tagline": "Empathic, fluid, connection-weaving",
    "Description": "The Yin Water Rabbit links isolated souls in a fragmented world, weaving empathy through digital threads. Unlike social Fire Rabbits, this one connects through deep emotional resonance—Zoom therapy, VR support groups, or AI companions. They are community managers, mental health tech founders, or digital matchmakers who see hidden bonds. Their intuition flows into others’ feelings effortlessly. In relationships, they are nurturing partners who create emotional ecosystems. Their ambition is to heal divisions—post-pandemic, political, or algorithmic. While they may absorb too much, their boundaries are learned through immersion. The Yin Water Rabbit reminds us that true connection is the silent flow between screens and hearts."
  },
  {
    "Year": 2024,
    "Start_Date": "2024-02-10",
    "End_Date": "2024-02-24",
    "Animal": "Dragon",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Dragon",
    "Tagline": "Visionary, expansive, world-building",
    "Description": "The Yang Wood Dragon scales AI and space frontiers, building living empires in code and orbit. Where Metal Dragons command, Wood Dragons grow—SpaceX colonies, neural networks, or bio-engineered cities. They are Elon-like visionaries, DAO architects, or synthetic biology pioneers who scale dreams into ecosystems. Their creativity branches in unexpected but fruitful directions. In relationships, they are inspiring partners who help loved ones reach new heights. Their ambition is to leave forests—self-sustaining systems that outlive the builder. While they may overreach, their failures fertilize breakthroughs. The Yang Wood Dragon proves that true legacy is not monuments, but living, evolving growth."
  },
  {
    "Year": 2025,
    "Start_Date": "2025-01-29",
    "End_Date": "2025-02-12",
    "Animal": "Snake",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Snake",
    "Tagline": "Subtle, adaptive, wisdom-growing",
    "Description": "The Yin Wood Snake wraps around AI ethics and climate solutions with patient, organic insight. Unlike cutting Metal Snakes, this one grows through and around obstacles—carbon capture vines, decentralized governance roots. They are biohackers, policy strategists, or elder AI trainers who accumulate wisdom like tree rings. Their insight deepens with time, revealing patterns decades in the making. In relationships, they are slow to trust but lifelong in loyalty. Their ambition is to understand life’s cycles—biological, digital, or planetary. While they may seem passive, their influence reshapes ecosystems over generations. The Yin Wood Snake teaches that the most profound changes are organic, not engineered."
  },
  {
    "Year": 2026,
    "Start_Date": "2026-02-17",
    "End_Date": "2026-03-03",
    "Animal": "Horse",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Horse",
    "Tagline": "Passionate, free, trail-blazing",
    "Description": "The Yang Fire Horse ignites Web3 revolutions and Mars migrations with explosive, unbound energy. Where Wood Horses explore, Fire Horses transform—NFT art drops, orbital startups, or fusion breakthroughs. They are crypto punks, space influencers, or energy revolutionaries who live at full throttle. Their energy is contagious, inspiring mass adoption. In relationships, they are intense but fleeting; love must burn as bright as their vision. Their ambition is to be unforgettable—records broken, paradigms shattered, hearts set ablaze. While they may crash, their light guides humanity forward. The Yang Fire Horse proves that to escape Earth’s gravity, you must risk explosion."
  },
  {
    "Year": 2027,
    "Start_Date": "2027-02-06",
    "End_Date": "2027-02-20",
    "Animal": "Goat",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Goat",
    "Tagline": "Creative, warm, inspiration-spreading",
    "Description": "The Yin Fire Goat warms climate refugees and digital natives with passionate, communal art. Unlike structured Earth Goats, this one creates through shared feeling—VR concerts, solar-powered festivals, or empathy AI. They are metaverse musicians, eco-storytellers, or warmth engineers who ignite hope. Their art is emotional fuel, transforming despair into action. In relationships, they are affectionate partners who keep communal fires burning. Their ambition is to inspire—movements, children, or cultural shifts through collective passion. While they may burn low, their embers reignite easily. The Yin Fire Goat reminds us that in a cooling world, true art is the spark passed soul to soul."
  },
  {
    "Year": 2028,
    "Start_Date": "2028-01-26",
    "End_Date": "2028-02-09",
    "Animal": "Monkey",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Monkey",
    "Tagline": "Practical, resourceful, system-building",
    "Description": "The Yang Earth Monkey constructs lunar bases and circular economies with ingenious, grounded cleverness. Where Fire Monkeys dazzle, Earth Monkeys deliver—practical, scalable, and resilient. They are orbital engineers, waste-to-wealth entrepreneurs, or governance hackers who build infrastructure for off-world living. Their cleverness solves real problems with simple brilliance. In relationships, they are reliable partners who plan for extraterrestrial futures. Their ambition is to create systems that work anywhere—Earth, Moon, or Mars. While they lack glamour, their work enables humanity’s expansion. The Yang Earth Monkey proves that true innovation is functional, not flashy."
  },
  {
    "Year": 2029,
    "Start_Date": "2029-02-13",
    "End_Date": "2029-02-27",
    "Animal": "Rooster",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Rooster",
    "Tagline": "Meticulous, nurturing, quality-grounding",
    "Description": "The Yin Earth Rooster tends orbital farms and AI ethics with patient, precise care. Unlike performative Fire Roosters, this one perfects through quiet cultivation—lunar soil optimization, bias-free algorithms, or sustainable luxury. They are space agronomists, ethical auditors, or master regenerators who ensure excellence at the root. Their standards are high but fair, improving without ego. In relationships, they are devoted partners who build love brick by brick. Their ambition is to create work that endures—flawless, useful, and beautiful in its simplicity. While they obsess over minutiae, their attention prevents collapse. The Yin Earth Rooster teaches that perfection is love made visible in every detail."
  },
  {
    "Year": 2030,
    "Start_Date": "2030-02-03",
    "End_Date": "2030-02-17",
    "Animal": "Dog",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Dog",
    "Tagline": "Honorable, protective, justice-enforcing",
    "Description": "The Yang Metal Dog guards interplanetary colonies and digital rights with unyielding principle. Where Earth Dogs build communities, Metal Dogs enforce the codes that hold them together—space law, AI rights, or cyber sovereignty. They are orbital police, blockchain lawyers, or security architects who wield authority with integrity. Their loyalty is absolute, but so is their sense of cosmic justice. In relationships, they are devoted but demanding; love must align with universal values. Their ambition is to protect the innocent across worlds. While they may seem harsh, their justice is fair. The Yang Metal Dog proves that true protection requires both compassion and the courage to draw the laser sword."
  },
  {
    "Year": 2031,
    "Start_Date": "2031-01-23",
    "End_Date": "2031-02-06",
    "Animal": "Pig",
    "Element": "Metal",
    "Polarity": "Yin",
    "Full_Name": "Yin Metal Pig",
    "Tagline": "Refined, generous, luxury-sharing",
    "Description": "The Yin Metal Pig elevates off-world living with graceful, abundant elegance. Unlike earthy Earth Pigs, this one shares refined pleasures—asteroid-mined diamonds, lunar cuisine, or VR symphonies. They are space sommeliers, luxury habitat designers, or patrons of cosmic art who make transcendence accessible. Their taste is impeccable, their giving elegant. In relationships, they are indulgent partners who create experiences of pure delight. Their ambition is to refine and share—zero-gravity wine, neural art, or moments of interstellar joy. While they may seem extravagant, their gifts carry deep meaning. The Yin Metal Pig reminds us that true luxury is not possession, but the art of appreciation shared across the void."
  },
  {
    "Year": 2032,
    "Start_Date": "2032-02-11",
    "End_Date": "2032-02-25",
    "Animal": "Rat",
    "Element": "Water",
    "Polarity": "Yang",
    "Full_Name": "Yang Water Rat",
    "Tagline": "Adaptive, intuitive, opportunity-flowing",
    "Description": "The Yang Water Rat navigates quantum markets and asteroid economies with liquid cunning. Where Metal Rats calculate, Water Rats sense—reading cosmic trends, neural flows, or fusion potentials like ripples in spacetime. They are quantum traders, space miners, or intuition AI trainers who thrive in uncertainty. Their adaptability is their superpower, turning chaos into interstellar profit. In relationships, they are charming but slippery; commitment requires constant evolution. Their ambition is to ride every wave—financial, technological, or extraterrestrial. While they may seem opportunistic, their instincts benefit colonies. The Yang Water Rat proves that in a multiplanetary future, survival belongs to the most fluid."
  },
  {
    "Year": 2033,
    "Start_Date": "2033-01-31",
    "End_Date": "2033-02-14",
    "Animal": "Ox",
    "Element": "Water",
    "Polarity": "Yin",
    "Full_Name": "Yin Water Ox",
    "Tagline": "Patient, absorbent, deeply resilient",
    "Description": "The Yin Water Ox sustains Martian domes and ocean cities with quiet, oceanic endurance. Unlike charging Earth Oxen, this one absorbs cosmic radiation and transforms it into life—hydroponic oceans, radiation-hardened crops, or emotional reservoirs for isolated crews. They are terraforming engineers, deep-space psychologists, or long-haul captains who grow stronger under pressure. Their patience is tidal; they outlast any solar storm. In relationships, they are steady partners who hold space for interstellar loneliness. Their ambition is to be the unbreakable foundation for multiplanetary civilization. While they may seem passive, their depth runs fathoms deep. The Yin Water Ox teaches that true endurance is the capacity to contain and convert the void."
  },
  {
    "Year": 2034,
    "Start_Date": "2034-02-19",
    "End_Date": "2034-03-05",
    "Animal": "Tiger",
    "Element": "Wood",
    "Polarity": "Yang",
    "Full_Name": "Yang Wood Tiger",
    "Tagline": "Courageous, expansive, territory-growing",
    "Description": "The Yang Wood Tiger claims new planetary frontiers with bold, organic vision. Where Metal Tigers conquer, Wood Tigers cultivate—turning red dust into green forests, asteroid belts into habitats. They are exobiologists, frontier governors, or bio-dome architects who push boundaries for growth. Their courage is rooted in purpose, not bravado. In relationships, they are passionate partners who encourage mutual evolution. Their ambition is to expand life’s domain—geographically, biologically, or philosophically. While they may overextend, their trails become highways for humanity. The Yang Wood Tiger proves that true bravery is not in the fight, but in the willingness to grow beyond known worlds."
  },
  {
    "Year": 2035,
    "Start_Date": "2035-02-08",
    "End_Date": "2035-02-22",
    "Animal": "Rabbit",
    "Element": "Wood",
    "Polarity": "Yin",
    "Full_Name": "Yin Wood Rabbit",
    "Tagline": "Gentle, creative, harmony-growing",
    "Description": "The Yin Wood Rabbit weaves peace in multiplanetary societies through subtle, organic diplomacy. Unlike social Fire Rabbits, this one builds alliances like ivy—slowly, steadily, and beautifully across colonies. They are interstellar mediators, bio-artists, or community gardeners who foster cooperation through care. Their gentleness is strategic, disarming conflict with empathy. In relationships, they are nurturing partners who help love take root in alien soil. Their ambition is to create environments where all species can grow. While they may seem fragile, their networks are resilient across light-years. The Yin Wood Rabbit reminds us that the strongest bonds are grown, not imposed, even in space."
  },
  {
    "Year": 2036,
    "Start_Date": "2036-01-28",
    "End_Date": "2036-02-11",
    "Animal": "Dragon",
    "Element": "Fire",
    "Polarity": "Yang",
    "Full_Name": "Yang Fire Dragon",
    "Tagline": "Charismatic, visionary, world-igniting",
    "Description": "The Yang Fire Dragon ignites fusion economies and stellar migrations with supernova leadership. Where Wood Dragons build, Fire Dragons transform—starships, plasma economies, or consciousness uploads. They are fusion CEOs, interstellar revolutionaries, or cultural icons who change paradigms across solar systems. Their presence is magnetic, their ideas incendiary. In relationships, they are intense but demanding; love must match their grandeur. Their ambition is to redefine reality—technological, political, or existential. While they may burn out followers, their light births new civilizations. The Yang Fire Dragon proves that to reach the stars, the world must sometimes be set ablaze."
  },
  {
    "Year": 2037,
    "Start_Date": "2037-02-15",
    "End_Date": "2037-03-01",
    "Animal": "Snake",
    "Element": "Fire",
    "Polarity": "Yin",
    "Full_Name": "Yin Fire Snake",
    "Tagline": "Seductive, transformative, passion-guided",
    "Description": "The Yin Fire Snake catalyzes consciousness evolution with slow-burning, passionate insight. Unlike analytical Water Snakes, this one transforms through emotional and neural intensity—mind uploads, psychedelic therapy, or AI-human merging. They are neuro-lovers, mystics, or fusion therapists who heal through passionate connection. Their allure is hypnotic, drawing secrets and truths to the surface. In relationships, they are all-consuming partners who merge on every level. Their ambition is to catalyze evolution—personal, collective, or post-human through shared fire. While they may overwhelm, their transformations are permanent. The Yin Fire Snake teaches that true change begins with a single, sustained spark of desire across species."
  },
  {
    "Year": 2038,
    "Start_Date": "2038-02-04",
    "End_Date": "2038-02-18",
    "Animal": "Horse",
    "Element": "Earth",
    "Polarity": "Yang",
    "Full_Name": "Yang Earth Horse",
    "Tagline": "Reliable, powerful, distance-covering",
    "Description": "The Yang Earth Horse connects star systems with steady, powerful infrastructure. Where Fire Horses sprint, Earth Horses endure—building wormhole logistics, planetary supply chains, or interstellar freight. They are space truckers, colony planners, or long-haul captains who deliver consistently across light-years. Their strength is in sustained effort, not flashy speed. In relationships, they are dependable partners who go the cosmic distance. Their ambition is to connect—worlds, species, or possibilities through reliable systems. While they may seem plodding, their momentum is unstoppable. The Yang Earth Horse proves that true progress is measured in parsecs, not minutes."
  },
  {
    "Year": 2039,
    "Start_Date": "2039-01-24",
    "End_Date": "2039-02-07",
    "Animal": "Goat",
    "Element": "Earth",
    "Polarity": "Yin",
    "Full_Name": "Yin Earth Goat",
    "Tagline": "Nurturing, stable, community-anchoring",
    "Description": "The Yin Earth Goat is the hearth and home of any colony—warm, stable, and deeply comforting across worlds. Unlike artistic Wood Goats, this one builds emotional and physical security—lunar kindergartens, Martian co-ops, or zero-G therapy spaces. They are space homemakers, social workers, or earth stewards who create sanctuaries in the void. Their care is practical, meeting needs before they’re spoken. In relationships, they are grounding partners who make love feel like coming home, even on Europa. Their ambition is to provide—safety, sustenance, and belonging for their interstellar herd. While they may resist adventure, their stability enables others’ flights. The Yin Earth Goat reminds us that true care is the quiet reliability of being there, anywhere."
  },
  {
    "Year": 2040,
    "Start_Date": "2040-02-12",
    "End_Date": "2040-02-26",
    "Animal": "Monkey",
    "Element": "Metal",
    "Polarity": "Yang",
    "Full_Name": "Yang Metal Monkey",
    "Tagline": "Inventive, precise, tool-mastering",
    "Description": "The Yang Metal Monkey forges quantum tools and Dyson swarms with brilliant, surgical efficiency. Where Wood Monkeys experiment, Metal Monkeys perfect—nanobots, fusion reactors, or mind-machine interfaces refined to peak performance. They are quantum engineers, cyber-surgeons, or tool hackers who optimize existence itself. Their mind is a workshop of precision instruments. In relationships, they are problem-solving partners who fix what’s broken across realities. Their ambition is optimization—of biology, physics, or consciousness. While they may seem cold, their improvements save civilizations. The Yang Metal Monkey proves that true creativity is not invention from nothing, but perfection of the possible."
  }
]

// Find zodiac for a specific date
function findChineseZodiac(year, month, day) {
    const birthDate = new Date(year, month - 1, day);
    
    for (let zodiac of CHINESE_ZODIAC_DATA) {
        const startDate = new Date(zodiac.Start_Date);
        // End date is the day before next year's start
        const endParts = zodiac.End_Date.split('-');
        const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));
        
        if (birthDate >= startDate && birthDate <= endDate) {
            return zodiac;
        }
    }
    
    console.warn(`No zodiac data found for ${year}-${month}-${day}`);
    return null;
}

// Export for use in results.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHINESE_ZODIAC_DATA, findChineseZodiac };
}
