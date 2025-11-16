// Results Page Logic - Loads data from localStorage
// No configuration needed - localStorage works automatically

window.addEventListener('DOMContentLoaded', () => {
    const results = JSON.parse(localStorage.getItem('astroResults'));
    
    if (!results) {
        // If no results found, redirect to input page
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
        <p style="color: #a0b4c0; font-style: italic; margin-top: 10px;">${dayTraits}</p>
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
    
    // Numerology Card
    const numerologyTraits = getNumerologyTraits(results.lifePathNumber);
    document.getElementById('numerologyContent').innerHTML = `
        <div class="numerology-number">${results.lifePathNumber}</div>
        <p style="text-align: center; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px;">
            Life Path: Your Life Purpose
        </p>
        <div class="numerology-description">${numerologyTraits}</div>
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
            <h4>🌙 YIN ENERGY (${results.yinYangBalance.yin}%)</h4>
            <p style="color: #d0dae0; font-size: 0.95rem;">
                Receptive, introspective, intuitive. Yin is the quiet strength of water—flowing, adapting, nurturing the inner world, emotional depth, and the wisdom of listening.
            </p>
        </div>

        ${results.yinYangBalance.yang > 0 ? `
        <div class="energy-description">
            <h4>☀️ YANG ENERGY (${results.yinYangBalance.yang}%)</h4>
            <p style="color: #d0dae0; font-size: 0.95rem;">
                Active, expressive, dynamic. Yang is the bright power of fire—initiating, leading, creating the outer world, action-taking, and the courage to assert yourself.
            </p>
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
    }, 500);
});

// Trait Database Functions

function getChineseZodiacTraits(animal, element) {
    const animalTraits = {
        'Rabbit': 'Gentle, compassionate, and diplomatic. Rabbits are artistic souls who value peace and harmony. They avoid conflict and seek comfortable, stable environments.',
        'Tiger': 'Brave, confident, and competitive. Tigers are natural leaders with magnetic personalities who embrace challenges fearlessly.',
        'Dragon': 'Ambitious, enthusiastic, and charismatic. Dragons are destined for greatness with their powerful presence and innovative spirit.',
        'Snake': 'Wise, intuitive, and mysterious. Snakes are deep thinkers with strong instincts and sophisticated charm.',
        'Horse': 'Energetic, independent, and free-spirited. Horses love adventure and movement, embracing life with passion.',
        'Goat': 'Creative, gentle, and empathetic. Goats are artistic with refined tastes and compassionate hearts.',
        'Monkey': 'Clever, playful, and curious. Monkeys are quick-witted problem solvers who thrive on mental challenges.',
        'Rooster': 'Observant, hardworking, and confident. Roosters are perfectionists who take pride in their work and appearance.',
        'Dog': 'Loyal, honest, and protective. Dogs are faithful friends with strong moral compass and unwavering devotion.',
        'Pig': 'Generous, optimistic, and sincere. Pigs enjoy life\'s pleasures and value relationships above material wealth.',
        'Rat': 'Intelligent, adaptable, and resourceful. Rats are quick-thinking opportunists with excellent survival instincts.',
        'Ox': 'Reliable, patient, and determined. Oxen are steady workers who value tradition and methodical progress.'
    };
    
    const elementTraits = {
        'Water': 'Water adds emotional depth, intuition, and adaptability. It brings wisdom, flexibility, and the ability to flow with life changes. This creates a more sensitive and empathetic nature.',
        'Wood': 'Wood brings growth, creativity, and compassion. It adds flexibility, the drive to expand, and a collaborative spirit.',
        'Fire': 'Fire adds passion, energy, and leadership. It brings enthusiasm, dynamic expression, and transformative power.',
        'Earth': 'Earth brings stability, reliability, and practicality. It adds grounding, nurturing qualities, and patience.',
        'Metal': 'Metal adds determination, structure, and precision. It brings clarity, strong principles, and refined strength.'
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
    return rulers[day] || 'Unknown';
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
    return traits[day] || '';
}

function getDayInfluence(day) {
    const influences = {
        'Monday': 'The Moon brings sensitivity, intuition, and nurturing energy. Those born on Monday are deeply empathetic and emotionally intelligent.',
        'Tuesday': 'Mars brings energy, courage, and determination. Tuesday-born individuals are natural warriors and pioneers.',
        'Wednesday': 'Mercury brings communication, intellect, and adaptability. Wednesday-born are quick thinkers and excellent communicators.',
        'Thursday': 'Jupiter brings expansion, wisdom, and generosity. Thursday-born have philosophical minds and optimistic spirits.',
        'Friday': 'Venus brings love, beauty, and harmony. Friday-born appreciate aesthetics and value relationships.',
        'Saturday': 'Saturn brings discipline, responsibility, and structure. Saturday-born are patient builders with lasting achievements.',
        'Sunday': 'The Sun brings vitality, confidence, and leadership. Sunday-born radiate warmth and natural authority.'
    };
    return influences[day] || '';
}

function getZodiacElement(sign) {
    const elements = {
        'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
        'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
        'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
        'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
    };
    return elements[sign] || 'Unknown';
}

function getWesternZodiacTraits(sign) {
    const traits = {
        'Taurus': 'Reliable builders who value stability, beauty, and sensory pleasures. Taurus individuals are patient, practical, and appreciate life\'s finer things. The Earth element grounds this sign in reality, enhancing practicality, reliability, and material focus. Earth signs build tangible results, value security, and work steadily toward their goals. They are sensual, patient, and excel at manifesting their visions into physical form.',
        'Aries': 'Bold initiators with pioneering spirit. Aries are confident leaders who embrace challenges with courage and enthusiasm.',
        'Gemini': 'Curious communicators who thrive on mental stimulation. Geminis are adaptable, social, and intellectually versatile.',
        'Cancer': 'Nurturing protectors with deep emotional intelligence. Cancers create safe havens and value family connections.',
        'Leo': 'Confident performers who radiate warmth. Leos are generous leaders with creative flair and magnetic presence.',
        'Virgo': 'Analytical perfectionists who serve through improvement. Virgos are detail-oriented healers with practical wisdom.',
        'Libra': 'Diplomatic peacemakers who seek balance. Libras are charming, relationship-oriented, and aesthetically refined.',
        'Scorpio': 'Intense transformers with penetrating insight. Scorpios are powerful, magnetic, and deeply passionate.',
        'Sagittarius': 'Adventurous philosophers who seek truth. Sagittarians are optimistic explorers with boundless enthusiasm.',
        'Capricorn': 'Ambitious achievers who build lasting legacies. Capricorns are disciplined, responsible, and patient.',
        'Aquarius': 'Innovative humanitarians who champion progress. Aquarians are independent visionaries with unconventional minds.',
        'Pisces': 'Compassionate dreamers with artistic souls. Pisces are intuitive, empathetic, and spiritually connected.'
    };
    return traits[sign] || 'A unique cosmic signature.';
}

function getNumerologyTraits(number) {
    const traits = {
        1: 'The Pioneer - Independent, innovative, and ambitious. You are a natural leader with the courage to forge new paths.',
        2: 'The Diplomat - Cooperative, sensitive, and peace-loving. You excel at partnerships and harmonizing relationships.',
        3: 'The Creative - Expressive, optimistic, and imaginative. You inspire through communication and artistic vision.',
        4: 'The Builder - Practical, organized, and reliable. You create lasting foundations with methodical dedication.',
        5: 'The Freedom Seeker - Adventurous, versatile, and progressive. You embrace change and thrive on variety.',
        6: 'The Nurturer - Responsible, caring, and harmonious. You serve through love and create beauty in the world.',
        7: 'The Seeker - Analytical, spiritual, and introspective. You search for truth with philosophical depth.',
        8: 'The Powerhouse - Ambitious, authoritative, and material-focused. You manifest abundance through determination.',
        9: 'The Humanitarian - Compassionate, generous, and idealistic. You serve humanity with selfless dedication.',
        11: 'The Illuminator - Intuitive, inspired, and visionary. You are a spiritual messenger bringing light to others.',
        22: 'The Master Builder - Visionary, practical, and transformative. You build empires for the greater good.',
        33: 'The Master Teacher - Nurturing, selfless, and healing. You uplift humanity through unconditional love.'
    };
    return traits[number] || 'The Humanitarian - Compassionate, generous, and idealistic.';
}
