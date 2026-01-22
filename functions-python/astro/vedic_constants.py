"""
Vedic Astrology Constants and Interpretation Library
Complete Jyotish interpretation tables for Lagna, Nakshatra, Graha, Bhava, and Dasha
"""

# ============================================================================
# LAGNA (ASCENDANT) INTERPRETATIONS
# ============================================================================

LAGNA_INTERPRETATIONS = {
    "Mesha": "An Aries (Mesha) Lagna brings a direct, pioneering, and action-oriented approach to life. You tend to initiate quickly and learn through experience. Mars rules your chart, giving courage and competitive spirit.",
    "Vrishabha": "A Taurus (Vrishabha) Lagna values stability, comfort, and tangible results. You move steadily and prefer to build lasting foundations. Venus rules your chart, emphasizing beauty and material security.",
    "Mithuna": "A Gemini (Mithuna) Lagna is curious, communicative, and mentally agile. You learn through interaction and variety. Mercury rules your chart, giving intellectual adaptability.",
    "Karka": "A Cancer (Karka) Lagna is sensitive, protective, and nurturing. Emotional security and home are central themes. The Moon rules your chart, emphasizing emotional intelligence.",
    "Simha": "A Leo (Simha) Lagna is expressive, proud, and creative. You naturally seek to shine and lead from the heart. The Sun rules your chart, giving authority and vitality.",
    "Kanya": "A Virgo (Kanya) Lagna is analytical, precise, and service-oriented. You refine, improve, and pay attention to details. Mercury rules your chart with a practical focus.",
    "Tula": "A Libra (Tula) Lagna is relational, diplomatic, and balance-seeking. Partnerships and harmony are key life themes. Venus rules your chart, emphasizing relationships.",
    "Vrishchika": "A Scorpio (Vrishchika) Lagna is intense, private, and transformative. You move through deep emotional cycles and regeneration. Mars rules your chart with depth and power.",
    "Dhanu": "A Sagittarius (Dhanu) Lagna is philosophical, adventurous, and future-oriented. You seek meaning, learning, and expansion. Jupiter rules your chart, giving wisdom and optimism.",
    "Makara": "A Capricorn (Makara) Lagna is disciplined, pragmatic, and status-aware. You build slowly toward long-term goals. Saturn rules your chart, emphasizing responsibility.",
    "Kumbha": "An Aquarius (Kumbha) Lagna is unconventional, idealistic, and community-minded. You think ahead of your time. Saturn rules your chart with a humanitarian focus.",
    "Meena": "A Pisces (Meena) Lagna is imaginative, sensitive, and spiritual. You navigate life through intuition and compassion. Jupiter rules your chart, giving spiritual depth.",
}

# ============================================================================
# NAKSHATRA INTERPRETATIONS
# ============================================================================

NAKSHATRA_INTERPRETATIONS = {
    "Ashwini": "Ashwini brings speed, initiative, and healing energy. Emotionally, there is a drive to start things and move quickly. The Ashwini Kumaras bestow the power to heal and renew.",
    "Bharani": "Bharani carries themes of responsibility, intensity, and transformation. Emotional life can feel deep and consequential. Yama, the lord of dharma, governs this star.",
    "Krittika": "Krittika is sharp, discerning, and protective. There is a strong will to cut through confusion and refine. Agni's fire purifies and illuminates.",
    "Rohini": "Rohini is fertile, attractive, and growth-oriented. Emotional nature seeks beauty, comfort, and creative expression. Brahma's creativity flows through this nakshatra.",
    "Mrigashira": "Mrigashira is searching, curious, and restless. The mind explores, questions, and seeks new experiences. Soma brings a gentle, questing nature.",
    "Ardra": "Ardra is intense, stormy, and transformative. Emotional life may pass through catharsis and deep change. Rudra's power brings destruction that clears the path for renewal.",
    "Punarvasu": "Punarvasu is renewing, hopeful, and resilient. There is a capacity to recover and begin again. Aditi, the cosmic mother, offers restoration.",
    "Pushya": "Pushya is nurturing, supportive, and devotional. Emotional fulfillment comes through caring and guidance. This is considered the most auspicious nakshatra.",
    "Ashlesha": "Ashlesha is penetrating, binding, and psychologically deep. Emotions can be complex and intense. The serpent energy gives insight into hidden realms.",
    "Magha": "Magha is regal, ancestral, and status-conscious. Emotional life is tied to legacy and recognition. The Pitris (ancestors) bestow authority and dignity.",
    "Purva Phalguni": "Purva Phalguni is pleasure-seeking, creative, and relational. There is a love of enjoyment and connection. Bhaga brings good fortune in relationships.",
    "Uttara Phalguni": "Uttara Phalguni is generous, responsible, and stabilizing. Relationships and agreements are central. Aryaman governs contracts and friendship.",
    "Hasta": "Hasta is skillful, clever, and hands-on. Emotional nature expresses through doing, crafting, and managing. Savitar brings skill and dexterity.",
    "Chitra": "Chitra is artistic, striking, and individualistic. There is a drive to create and stand out. Vishvakarman, the celestial architect, gives creative vision.",
    "Swati": "Swati is independent, flexible, and wind-like. Emotional life values freedom and self-direction. Vayu brings adaptability and movement.",
    "Vishakha": "Vishakha is goal-driven, determined, and focused. There is intensity in pursuing chosen aims. Indra and Agni together give conquering power.",
    "Anuradha": "Anuradha is loyal, devotional, and friendship-oriented. Emotional fulfillment comes through bonds and shared purpose. Mitra, the god of friendship, governs here.",
    "Jyeshtha": "Jyeshtha is protective, senior, and responsible. Emotions may carry themes of duty and authority. Indra bestows leadership and protective power.",
    "Mula": "Mula is root-seeking, radical, and transformative. Emotional life may involve deep uprooting and truth-seeking. Nirriti brings the power to destroy and regenerate.",
    "Purva Ashadha": "Purva Ashadha is victorious, idealistic, and persuasive. There is a drive to champion beliefs. Apas, the water deity, brings purification and invincibility.",
    "Uttara Ashadha": "Uttara Ashadha is enduring, principled, and leadership-oriented. Emotional nature seeks lasting achievement. The Vishvadevas bestow universal qualities.",
    "Shravana": "Shravana is listening, learning, and reputation-focused. Emotional fulfillment comes through knowledge and recognition. Vishnu brings the power of connection.",
    "Dhanishta": "Dhanishta is rhythmic, communal, and achievement-oriented. There is a drive to perform and contribute. The Vasus bring abundance and fame.",
    "Shatabhisha": "Shatabhisha is solitary, healing, and boundary-focused. Emotional life may involve withdrawal and deep repair. Varuna governs the cosmic waters.",
    "Purva Bhadrapada": "Purva Bhadrapada is intense, idealistic, and transformative. There can be extremes in belief and emotion. Aja Ekapada brings fierce one-pointed energy.",
    "Uttara Bhadrapada": "Uttara Bhadrapada is stabilizing, deep, and contemplative. Emotional nature leans toward inner work. Ahir Budhnya brings wisdom from the depths.",
    "Revati": "Revati is gentle, protective, and guiding. Emotional fulfillment comes through support, travel, and completion. Pushan guides safe journeys and nurtures growth.",
}

# ============================================================================
# GRAHA (PLANET) BASE THEMES
# ============================================================================

GRAHA_BASE_THEMES = {
    "surya": "The Sun represents identity, vitality, authority, father, and soul purpose. It shows your core sense of self and how you seek recognition.",
    "chandra": "The Moon represents mind, emotions, mother, habits, and inner security. It shows your emotional nature and how you nurture yourself and others.",
    "mangala": "Mars represents drive, courage, conflict, siblings, and technical skill. It shows how you assert yourself and pursue goals with energy.",
    "budha": "Mercury represents intellect, communication, trade, and adaptability. It shows how you think, learn, and express ideas.",
    "guru": "Jupiter represents wisdom, growth, faith, teachers, and blessings. It shows where expansion, optimism, and good fortune flow in your life.",
    "shukra": "Venus represents love, beauty, pleasure, art, and harmony. It shows your capacity for relationships, creativity, and material enjoyment.",
    "shani": "Saturn represents discipline, structure, karma, delays, and endurance. It shows where you face tests and build lasting foundations.",
    "rahu": "Rahu represents obsession, innovation, foreignness, and worldly desires. It shows where you break conventions and pursue ambitious goals.",
    "ketu": "Ketu represents detachment, spirituality, past-life residue, and sudden breaks. It shows where you release attachments and seek liberation.",
}

# ============================================================================
# BHAVA (HOUSE) MEANINGS
# ============================================================================

BHAVA_MEANINGS = {
    1: "1st Bhava (Tanu): Self, body, identity, health, and overall life direction. The foundation of your entire chart.",
    2: "2nd Bhava (Dhana): Wealth, speech, family values, food, and accumulated resources. Your capacity to sustain yourself.",
    3: "3rd Bhava (Sahaja): Courage, siblings, communication, effort, and short journeys. Your will and initiative.",
    4: "4th Bhava (Sukha): Home, mother, emotional foundation, property, and inner peace. Your roots and comfort.",
    5: "5th Bhava (Putra): Creativity, children, intelligence, romance, and past-life merit. Your creative expression.",
    6: "6th Bhava (Ari): Work, service, health issues, obstacles, enemies, and daily routines. Where you overcome challenges.",
    7: "7th Bhava (Yuvati): Partnerships, marriage, contracts, business, and public dealings. Your one-to-one relationships.",
    8: "8th Bhava (Randhra): Transformation, secrets, longevity, inheritance, and shared resources. Deep change and hidden matters.",
    9: "9th Bhava (Dharma): Higher learning, teachers, father, fortune, philosophy, and long journeys. Your path of wisdom.",
    10: "10th Bhava (Karma): Career, status, reputation, authority, and public role. Your visible achievements and purpose.",
    11: "11th Bhava (Labha): Gains, networks, aspirations, elder siblings, and friendships. Where you receive and connect.",
    12: "12th Bhava (Vyaya): Loss, liberation, foreign lands, expenses, and spiritual retreat. Where you release and transcend.",
}

# ============================================================================
# DASHA PLANET THEMES
# ============================================================================

DASHA_PLANET_THEMES = {
    "surya": "Sun Mahadasha (6 years) emphasizes identity, leadership, visibility, father, government, and questions of purpose and authority. A time to shine and claim your place.",
    "chandra": "Moon Mahadasha (10 years) emphasizes emotional life, home, mother, family, public image, and inner security. A time of fluctuation and emotional growth.",
    "mangala": "Mars Mahadasha (7 years) emphasizes action, conflict, courage, property, siblings, and technical or physical pursuits. A time of energy and assertion.",
    "budha": "Mercury Mahadasha (17 years) emphasizes learning, communication, trade, intellect, and adaptability. A long period of mental development and commerce.",
    "guru": "Jupiter Mahadasha (16 years) emphasizes growth, wisdom, children, teaching, and expansion of fortune. A blessed period of opportunity and dharma.",
    "shukra": "Venus Mahadasha (20 years) emphasizes relationships, pleasure, art, wealth, and material comforts. The longest dasha, focused on enjoyment and connection.",
    "shani": "Saturn Mahadasha (19 years) emphasizes responsibility, discipline, delays, karma, and long-term consolidation. A period of testing and maturation.",
    "rahu": "Rahu Mahadasha (18 years) emphasizes worldly ambition, unconventional paths, foreign connections, and intense desires. A time of rapid, often unexpected change.",
    "ketu": "Ketu Mahadasha (7 years) emphasizes detachment, spiritualization, sudden events, and completion of old karmas. A period of release and inner focus.",
}

# ============================================================================
# GUNA (MENTAL QUALITY) CONSTANTS
# ============================================================================

GUNA_BY_SIGN = {
    "Mesha": "Sattva", "Simha": "Sattva", "Dhanu": "Sattva",
    "Vrishabha": "Rajas", "Kanya": "Rajas", "Makara": "Rajas",
    "Mithuna": "Rajas", "Tula": "Rajas", "Kumbha": "Rajas",
    "Karka": "Tamas", "Vrishchika": "Tamas", "Meena": "Tamas",
}

GUNA_INTERPRETATIONS = {
    "Sattva": "Sattvic temperament brings clarity, harmony, idealism, and a naturally balanced mind. You tend toward purity, truth-seeking, and spiritual orientation.",
    "Rajas": "Rajasic temperament brings activity, ambition, desire, and a dynamic, restless mind. You are driven, creative, and oriented toward achievement and action.",
    "Tamas": "Tamasic temperament brings depth, intensity, introspection, and emotional complexity. You process life deeply and may need more time for rest and reflection.",
}

# ============================================================================
# DOSHA (AYURVEDIC CONSTITUTION) CONSTANTS
# ============================================================================

DOSHA_BY_SIGN = {
    "Mesha": "Pitta", "Simha": "Pitta", "Dhanu": "Pitta", "Vrishchika": "Pitta",
    "Mithuna": "Vata", "Tula": "Vata", "Kumbha": "Vata",
    "Vrishabha": "Kapha", "Kanya": "Kapha", "Makara": "Kapha",
    "Karka": "Kapha", "Meena": "Kapha",
}

DOSHA_INTERPRETATIONS = {
    "Vata": "Vata constitution brings creativity, quick thinking, intuition, and movement. You may be prone to anxiety, irregularity, or scattered energy when imbalanced.",
    "Pitta": "Pitta constitution brings focus, intensity, sharp intellect, and strong willpower. You may be prone to anger, criticism, or burnout when imbalanced.",
    "Kapha": "Kapha constitution brings steadiness, nurturing energy, calm, and emotional resilience. You may be prone to lethargy, attachment, or resistance to change when imbalanced.",
}

# ============================================================================
# GRAHA DIGNITY (OWN SIGN, EXALTATION, DEBILITATION)
# ============================================================================

GRAHA_OWN_SIGNS = {
    "surya": ["Simha"],
    "chandra": ["Karka"],
    "mangala": ["Mesha", "Vrishchika"],
    "budha": ["Mithuna", "Kanya"],
    "guru": ["Dhanu", "Meena"],
    "shukra": ["Vrishabha", "Tula"],
    "shani": ["Makara", "Kumbha"],
    "rahu": [],
    "ketu": [],
}

GRAHA_EXALTATION = {
    "surya": "Mesha",
    "chandra": "Vrishabha",
    "mangala": "Makara",
    "budha": "Kanya",
    "guru": "Karka",
    "shukra": "Meena",
    "shani": "Tula",
    "rahu": "Vrishabha",
    "ketu": "Vrishchika",
}

GRAHA_DEBILITATION = {
    "surya": "Tula",
    "chandra": "Vrishchika",
    "mangala": "Karka",
    "budha": "Meena",
    "guru": "Makara",
    "shukra": "Kanya",
    "shani": "Mesha",
    "rahu": "Vrishchika",
    "ketu": "Vrishabha",
}
