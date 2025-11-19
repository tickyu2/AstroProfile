// Results Page Logic - Firebase Version
// Restored from working commit 9087d92 + Firebase cloud storage

window.addEventListener('DOMContentLoaded', async () => {
    let results;
    
    // Try to load from Firebase first
    try {
        if (window.ProfileManager && window.ProfileManager.database) {
            results = await window.ProfileManager.getLatestProfile();
            console.log('✅ Loaded profile from Firebase');
        }
    } catch (error) {
        console.warn('Firebase load failed, trying localStorage:', error);
    }
    
    // Fallback to localStorage if Firebase fails
    if (!results) {
        const storedResults = localStorage.getItem('astroResults');
        if (storedResults) {
            results = JSON.parse(storedResults);
            console.log('✅ Loaded profile from localStorage (fallback)');
        }
    }
    
    if (!results) {
        window.location.href = 'index.html';
        return;
    }
    
    // Populate header
    document.getElementById('greeting').textContent = `Wow, ${results.fullName}. Nice meeting you!`;
    document.getElementById('birthInfo').innerHTML = `
        I see that you were born on <span class="highlight">${results.birthDateFormatted}</span>, 
        that amazing day was a <span class="highlight">${results.dayOfWeek}</span>.<br>
        As of today, you are <span class="highlight">${results.age} years, ${results.ageMonths} months, and ${results.ageDays} days</span> old.
    `;
    
    // Birth Information Card
    document.getElementById('birthDetails').innerHTML = `
        <div class="info-row"><strong>Full Name:</strong> ${results.fullName}</div>
        <div class="info-row"><strong>Birth Date and Time:</strong> ${results.birthDateFormatted} at ${results.birthTime}</div>
        <div class="info-row"><strong>Birth Place:</strong> ${results.birthLocation}</div>
    `;
    
    // Chinese Zodiac Card
    const chineseTraits = getChineseZodiacTraits(results.chineseZodiac, results.element);
    document.getElementById('chineseZodiacContent').innerHTML = `
        <div class="zodiac-name">${results.element} ${results.chineseZodiac}</div>
        <p class="zodiac-subtitle">Born in the year of the ${results.chineseZodiac} with ${results.element} Element</p>
        <div class="element-tag">${results.element.toUpperCase()} ELEMENT</div>
        <div class="trait-text">${chineseTraits}</div>
    `;
    
    // Day of Week Card
    const dayRuler = getDayRuler(results.dayOfWeek);
    const dayTraits = getDayTraits(results.dayOfWeek);
    const dayInfluence = getDayInfluence(results.dayOfWeek);
    document.getElementById('dayContent').innerHTML = `
        <div class="zodiac-name">${results.dayOfWeek}</div>
        <p class="zodiac-subtitle">Ruled by ${dayRuler}</p>
        <p style="color: #a0b4c0; font-style: italic; margin-top: 10px; font-size: 0.9rem;">${dayTraits}</p>
        <div class="trait-text">${dayInfluence}</div>
    `;
    
    // Western Zodiac Card
    const zodiacElement = getZodiacElement(results.westernZodiac);
    const westernTraits = getWesternZodiacTraits(results.westernZodiac);
    document.getElementById('westernZodiacContent').innerHTML = `
        <div class="zodiac-name">${results.westernZodiac}</div>
        <p class="zodiac-subtitle">An ${zodiacElement} sign</p>
        <div class="element-tag">${zodiacElement.toUpperCase()} ELEMENT ASPECT</div>
        <div class="trait-text">${westernTraits}</div>
    `;
    
    // Numerology Card with ALL 4 numbers
    const expressionNumber = calculateExpression(results.fullName);
    const soulUrgeNumber = calculateSoulUrge(results.fullName);
    const personalYear = calculatePersonalYear(results.birthDateFormatted);
    
    document.getElementById('numerologyContent').innerHTML = `
        <div class="numerology-item">
            <div class="numerology-number num-9">${results.lifePathNumber}</div>
            <div class="numerology-content">
                <div class="numerology-label">Life Path</div>
                <div class="numerology-title">Your Life Purpose</div>
                <div class="numerology-description">${getLifePathDescription(results.lifePathNumber)}</div>
            </div>
        </div>
        
        <div class="numerology-item">
            <div class="numerology-number num-8">${expressionNumber}</div>
            <div class="numerology-content">
                <div class="numerology-label">Expression</div>
                <div class="numerology-title">Your Natural Talents</div>
                <div class="numerology-description">${getExpressionDescription(expressionNumber)}</div>
            </div>
        </div>
        
        <div class="numerology-item">
            <div class="numerology-number num-5">${soulUrgeNumber}</div>
            <div class="numerology-content">
                <div class="numerology-label">Soul Urge</div>
                <div class="numerology-title">Your Inner Desires</div>
                <div class="numerology-description">${getSoulUrgeDescription(soulUrgeNumber)}</div>
            </div>
        </div>
        
        <div class="numerology-item">
            <div class="numerology-number num-year">${personalYear}</div>
            <div class="numerology-content">
                <div class="numerology-label">Personal Year 2025</div>
                <div class="numerology-title">Your Current Cycle</div>
                <div class="numerology-description">${getPersonalYearDescription(personalYear)}</div>
            </div>
        </div>
    `;
    
    // Yin/Yang Card
    document.getElementById('yinYangContent').innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${results.yinYangBalance.yin}%;">
                ${results.yinYangBalance.yin}% Yin
            </div>
            <div class="yang-indicator" style="width: ${results.yinYangBalance.yang}%;">
                ${results.yinYangBalance.yang}% Yang
            </div>
        </div>
        
        <div class="energy-description">
            <h4>≡ƒîÖ YIN ENERGY (${results.yinYangBalance.yin}%)</h4>
            <p>Receptive, introspective, intuitive. Yin is the quiet strength of waterΓÇöflowing, adapting, nurturing the inner world, emotional depth, and the wisdom of listening.</p>
        </div>

        ${results.yinYangBalance.yang > 0 ? `
        <div class="energy-description">
            <h4>ΓÿÇ∩╕Å YANG ENERGY (${results.yinYangBalance.yang}%)</h4>
            <p>Active, expressive, dynamic. Yang is the bright power of fireΓÇöinitiating, leading, creating the outer world, action-taking, and the courage to assert yourself.</p>
        </div>
        ` : ''}
    `;
    
    // Animate progress bars
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill, .yang-indicator');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 300);
});

// Numerology Calculation Functions

function calculateExpression(fullName) {
    const letterValues = {
        'a': 1, 'j': 1, 's': 1,
        'b': 2, 'k': 2, 't': 2,
        'c': 3, 'l': 3, 'u': 3,
        'd': 4, 'm': 4, 'v': 4,
        'e': 5, 'n': 5, 'w': 5,
        'f': 6, 'o': 6, 'x': 6,
        'g': 7, 'p': 7, 'y': 7,
        'h': 8, 'q': 8, 'z': 8,
        'i': 9, 'r': 9
    };
    
    let sum = 0;
    const cleanName = fullName.toLowerCase().replace(/[^a-z]/g, '');
    
    for (let char of cleanName) {
        sum += letterValues[char] || 0;
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
}

function calculateSoulUrge(fullName) {
    const vowels = 'aeiouAEIOU';
    const letterValues = {
        'a': 1, 'e': 5, 'i': 9, 'o': 6, 'u': 3,
        'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3
    };
    
    let sum = 0;
    for (let char of fullName) {
        if (vowels.includes(char)) {
            sum += letterValues[char] || 0;
        }
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
}

function calculatePersonalYear(birthDateFormatted) {
    const currentYear = new Date().getFullYear();
    const birthMatch = birthDateFormatted.match(/(\w+)\s+(\d+)/);
    const month = new Date(Date.parse(birthMatch[1] + " 1, 2000")).getMonth() + 1;
    const day = parseInt(birthMatch[2]);
    
    let sum = currentYear + month + day;
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
}

// Numerology Description Functions

function getLifePathDescription(number) {
    const descriptions = {
        1: 'The Pioneer - Independent, innovative, and ambitious.',
        2: 'The Diplomat - Cooperative, sensitive, and peace-loving.',
        3: 'The Creative - Expressive, optimistic, and imaginative.',
        4: 'The Builder - Practical, organized, and reliable.',
        5: 'The Freedom Seeker - Adventurous, versatile, and progressive.',
        6: 'The Nurturer - Responsible, caring, and harmonious.',
        7: 'The Seeker - Analytical, spiritual, and introspective.',
        8: 'The Powerhouse - Ambitious, authoritative, and material-focused.',
        9: 'The Humanitarian - Compassionate, generous, idealistic.',
        11: 'The Illuminator - Intuitive, inspired, and visionary.',
        22: 'The Master Builder - Visionary, practical, and transformative.',
        33: 'The Master Teacher - Nurturing, selfless, and healing.'
    };
    return descriptions[number] || descriptions[9];
}

function getExpressionDescription(number) {
    const descriptions = {
        1: 'Natural leader with innovative vision.',
        2: 'Diplomatic mediator, excellent team player.',
        3: 'Creative communicator, artistic expression.',
        4: 'Practical organizer, solid foundation builder.',
        5: 'Dynamic adventurer, embraces change.',
        6: 'Nurturing caretaker, creates harmony.',
        7: 'Analytical thinker, spiritual seeker.',
        8: 'Powerful achiever, business-minded.',
        9: 'Humanitarian visionary, serves others.',
        11: 'Intuitive messenger, inspires others.',
        22: 'Master builder, creates lasting legacy.',
        33: 'Master healer, uplifts humanity.'
    };
    return descriptions[number] || descriptions[8];
}

function getSoulUrgeDescription(number) {
    const descriptions = {
        1: 'Desires independence and leadership.',
        2: 'Longs for partnership and harmony.',
        3: 'Craves creative self-expression.',
        4: 'Seeks stability and order.',
        5: 'Longs for freedom and adventure.',
        6: 'Desires to nurture and serve.',
        7: 'Seeks knowledge and understanding.',
        8: 'Craves success and recognition.',
        9: 'Desires to help humanity.',
        11: 'Longs to inspire and enlighten.',
        22: 'Seeks to build something meaningful.',
        33: 'Desires to heal and teach.'
    };
    return descriptions[number] || descriptions[5];
}

function getPersonalYearDescription(number) {
    const descriptions = {
        1: 'New beginnings - Fresh starts, new opportunities.',
        2: 'Partnerships - Cooperation, relationships develop.',
        3: 'Creativity - Self-expression, social expansion.',
        4: 'Hard work - Building foundations, stability.',
        5: 'Change - Freedom, adventure, transformation.',
        6: 'Responsibility - Family, service, nurturing.',
        7: 'Introspection - Spiritual growth, inner work.',
        8: 'Achievement - Business success, financial gains, recognition.',
        9: 'Completion - Endings, humanitarian service.',
        11: 'Illumination - Spiritual awakening, inspiration.',
        22: 'Master building - Large-scale achievements.',
        33: 'Master healing - Service, compassion.'
    };
    return descriptions[number] || descriptions[8];
}

// Trait Database Functions (same as before)

function getChineseZodiacTraits(animal, element) {
    const animalTraits = {
        'Rabbit': 'Gentle, compassionate, and diplomatic. Rabbits are artistic souls who value peace and harmony. They avoid conflict and seek comfortable, stable environments.',
        'Tiger': 'Brave, confident, and competitive. Tigers are natural leaders.',
        'Dragon': 'Ambitious, enthusiastic, and charismatic.',
        'Snake': 'Wise, intuitive, and mysterious.',
        'Horse': 'Energetic, independent, and free-spirited.',
        'Goat': 'Creative, gentle, and empathetic.',
        'Monkey': 'Clever, playful, and curious.',
        'Rooster': 'Observant, hardworking, and confident.',
        'Dog': 'Loyal, honest, and protective.',
        'Pig': 'Generous, optimistic, and sincere.',
        'Rat': 'Intelligent, adaptable, and resourceful.',
        'Ox': 'Reliable, patient, and determined.'
    };
    
    const elementTraits = {
        'Water': 'Water adds emotional depth, intuition, and adaptability. It brings wisdom, flexibility, and the ability to flow with life changes. This creates a more sensitive and empathetic nature.',
        'Wood': 'Wood brings growth, creativity, and compassion.',
        'Fire': 'Fire adds passion, energy, and leadership.',
        'Earth': 'Earth brings stability, reliability, and practicality.',
        'Metal': 'Metal adds determination, structure, and precision.'
    };
    
    return animalTraits[animal] + ' ' + elementTraits[element];
}

function getDayRuler(day) {
    const rulers = {
        'Monday': 'Moon',
        'Tuesday': 'Mars',
        'Wednesday': 'Mercury',
        'Thursday': 'Jupiter',
        'Friday': 'Venus',
        'Saturday': 'Saturn',
        'Sunday': 'Sun'
    };
    return rulers[day];
}

function getDayTraits(day) {
    const traits = {
        'Monday': 'Sensitivity, intuition, nurturing',
        'Tuesday': 'Energy, courage, determination',
        'Wednesday': 'Communication, intellect, adaptability',
        'Thursday': 'Expansion, wisdom, generosity',
        'Friday': 'Love, beauty, harmony',
        'Saturday': 'Discipline, responsibility, structure',
        'Sunday': 'Vitality, confidence, leadership'
    };
    return traits[day];
}

function getDayInfluence(day) {
    const influences = {
        'Monday': 'The Moon brings sensitivity, intuition, and nurturing energy. Those born on Monday are deeply empathetic and emotionally intelligent.',
        'Tuesday': 'Mars brings energy, courage, and determination. Tuesday-born individuals are natural warriors and pioneers.',
        'Wednesday': 'Mercury brings communication, intellect, and adaptability.',
        'Thursday': 'Jupiter brings expansion, wisdom, and generosity.',
        'Friday': 'Venus brings love, beauty, and harmony.',
        'Saturday': 'Saturn brings discipline, responsibility, and structure.',
        'Sunday': 'The Sun brings vitality, confidence, and leadership.'
    };
    return influences[day];
}

function getZodiacElement(sign) {
    const elements = {
        'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
        'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
        'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
        'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
    };
    return elements[sign];
}

function getWesternZodiacTraits(sign) {
    const traits = {
        'Taurus': 'Reliable builders who value stability, beauty, and sensory pleasures. Taurus individuals are patient, practical, and appreciate life\'s finer things. The Earth element grounds this sign in reality, enhancing practicality, reliability, and material focus. Earth signs build tangible results, value security, and work steadily toward their goals. They are sensual, patient, and excel at manifesting their visions into physical form.',
        'Aries': 'Bold initiators with pioneering spirit.',
        'Gemini': 'Curious communicators who thrive on mental stimulation.',
        'Cancer': 'Nurturing protectors with deep emotional intelligence.',
        'Leo': 'Confident performers who radiate warmth.',
        'Virgo': 'Analytical perfectionists who serve through improvement.',
        'Libra': 'Diplomatic peacemakers who seek balance.',
        'Scorpio': 'Intense transformers with penetrating insight.',
        'Sagittarius': 'Adventurous philosophers who seek truth.',
        'Capricorn': 'Ambitious achievers who build lasting legacies.',
        'Aquarius': 'Innovative humanitarians who champion progress.',
        'Pisces': 'Compassionate dreamers with artistic souls.'
    };
    return traits[sign];
}
