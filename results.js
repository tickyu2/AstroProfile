// Load profile data from sessionStorage
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Results page loaded');
    
    const profileData = sessionStorage.getItem('currentProfile');
    
    if (!profileData) {
        console.error('❌ No profile data found in sessionStorage');
        alert('No profile data found. Please enter your birth information.');
        window.location.href = 'index.html';
        return;
    }
    
    const profile = JSON.parse(profileData);
    console.log('✅ Profile loaded:', profile);
    
    // Populate the page with profile data
    populateProfileData(profile);
    
    // Calculate and display all astrological data
    calculateAndDisplay(profile);
});

function populateProfileData(profile) {
    const fullName = `${profile.firstName} ${profile.lastName}`;
    const birthDate = new Date(profile.birthDate);
    const formattedDate = birthDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Convert 24-hour to 12-hour for display
    let displayHour = profile.birthHour24;
    let period = 'AM';
    if (displayHour >= 12) {
        period = 'PM';
        if (displayHour > 12) displayHour -= 12;
    }
    if (displayHour === 0) displayHour = 12;
    
    const birthTime = `${String(displayHour).padStart(2, '0')}:${String(profile.birthMinute).padStart(2, '0')} ${period}`;
    
    // Build location string
    let location = profile.birthCity;
    if (profile.birthState) location += `, ${profile.birthState}`;
    location += `, ${profile.birthCountry}`;
    
    console.log('📍 Birth info:', { date: formattedDate, time: birthTime, location });
    
    // Update birth information panel
    const birthInfoPanel = document.querySelector('.info-panel');
    if (birthInfoPanel) {
        birthInfoPanel.querySelector('.info-content').innerHTML = `
            <div class="info-row">
                <span class="info-label">Birth Date:</span>
                <span class="info-value">${formattedDate}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Birth Time:</span>
                <span class="info-value">${birthTime}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Birth Place:</span>
                <span class="info-value">${location}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Age:</span>
                <span class="info-value" id="ageDisplay">Calculating...</span>
            </div>
        `;
    }
    
    // Calculate and display age
    calculateAge(birthDate);
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const ageDisplay = document.getElementById('ageDisplay');
    if (ageDisplay) {
        ageDisplay.textContent = `${years} years, ${months} months, ${days} days`;
    }
}

function calculateAndDisplay(profile) {
    const birthDate = new Date(profile.birthDate);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    console.log('🔮 Calculating astrological data...');
    
    // Calculate Chinese Zodiac
    calculateChineseZodiac(year);
    
    // Calculate Western Zodiac
    calculateWesternZodiac(month, day);
    
    // Calculate Numerology
    calculateNumerology(profile.firstName, profile.lastName, birthDate);
    
    // Calculate Yin/Yang Energy
    calculateYinYang(birthDate, profile.birthHour24);
    
    // Calculate Day of Week
    calculateDayOfWeek(birthDate);
    
    console.log('✨ All calculations complete!');
}

function calculateChineseZodiac(year) {
    const animals = [
        { name: 'Rat', element: 'Water', traits: 'Quick-witted, resourceful, versatile, kind' },
        { name: 'Ox', element: 'Earth', traits: 'Diligent, dependable, strong, determined' },
        { name: 'Tiger', element: 'Wood', traits: 'Brave, confident, competitive, unpredictable' },
        { name: 'Rabbit', element: 'Wood', traits: 'Quiet, elegant, kind, responsible' },
        { name: 'Dragon', element: 'Earth', traits: 'Confident, intelligent, enthusiastic' },
        { name: 'Snake', element: 'Fire', traits: 'Enigmatic, intelligent, wise' },
        { name: 'Horse', element: 'Fire', traits: 'Animated, active, energetic' },
        { name: 'Goat', element: 'Earth', traits: 'Calm, gentle, sympathetic' },
        { name: 'Monkey', element: 'Metal', traits: 'Sharp, smart, curiosity' },
        { name: 'Rooster', element: 'Metal', traits: 'Observant, hardworking, courageous' },
        { name: 'Dog', element: 'Earth', traits: 'Lovely, honest, prudent' },
        { name: 'Pig', element: 'Water', traits: 'Compassionate, generous, diligent' }
    ];
    
    const index = (year - 4) % 12;
    const animal = animals[index];
    
    const panel = document.querySelector('.chinese-panel');
    if (panel) {
        panel.querySelector('h3').innerHTML = `🐷 ${animal.name.toUpperCase()}`;
        panel.querySelector('.element-badge').textContent = `${animal.element.toUpperCase()} ELEMENT`;
        panel.querySelector('.panel-description').textContent = 
            `The ${animal.name} embodies ${animal.traits.toLowerCase()}. Those born under this sign possess exceptional ${animal.traits.split(',')[0].toLowerCase()} abilities and demonstrate ${animal.traits.split(',')[1].toLowerCase()}.`;
    }
}

function calculateWesternZodiac(month, day) {
    const signs = [
        { name: 'Capricorn', dates: [[12, 22], [1, 19]], element: 'Earth', icon: '♑' },
        { name: 'Aquarius', dates: [[1, 20], [2, 18]], element: 'Air', icon: '♒' },
        { name: 'Pisces', dates: [[2, 19], [3, 20]], element: 'Water', icon: '♓' },
        { name: 'Aries', dates: [[3, 21], [4, 19]], element: 'Fire', icon: '♈' },
        { name: 'Taurus', dates: [[4, 20], [5, 20]], element: 'Earth', icon: '♉' },
        { name: 'Gemini', dates: [[5, 21], [6, 20]], element: 'Air', icon: '♊' },
        { name: 'Cancer', dates: [[6, 21], [7, 22]], element: 'Water', icon: '♋' },
        { name: 'Leo', dates: [[7, 23], [8, 22]], element: 'Fire', icon: '♌' },
        { name: 'Virgo', dates: [[8, 23], [9, 22]], element: 'Earth', icon: '♍' },
        { name: 'Libra', dates: [[9, 23], [10, 22]], element: 'Air', icon: '♎' },
        { name: 'Scorpio', dates: [[10, 23], [11, 21]], element: 'Water', icon: '♏' },
        { name: 'Sagittarius', dates: [[11, 22], [12, 21]], element: 'Fire', icon: '♐' }
    ];
    
    let currentSign = signs[0];
    for (const sign of signs) {
        const [[startMonth, startDay], [endMonth, endDay]] = sign.dates;
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
            currentSign = sign;
            break;
        }
    }
    
    const descriptions = {
        'Capricorn': 'Capricorn represents the disciplined achiever, governed by Saturn\'s structural wisdom. This cardinal earth sign demonstrates exceptional ambition and organizational prowess.',
        'Aquarius': 'Aquarius embodies the innovative visionary, ruled by Uranus\'s revolutionary energy. This fixed air sign demonstrates exceptional intellectual independence.',
        'Pisces': 'Pisces represents the compassionate dreamer, guided by Neptune\'s mystical currents. This mutable water sign possesses profound emotional intelligence.',
        'Aries': 'Aries embodies the courageous pioneer, driven by Mars\'s dynamic force. This cardinal fire sign demonstrates natural leadership abilities.',
        'Taurus': 'Taurus represents the steadfast builder, governed by Venus\'s aesthetic harmony. This fixed earth sign demonstrates exceptional determination.',
        'Gemini': 'Gemini embodies the curious communicator, ruled by Mercury\'s mental agility. This mutable air sign possesses exceptional adaptability.',
        'Cancer': 'Cancer represents the archetypal nurturer, governed by the Moon\'s intuitive wisdom and emotional depth. This cardinal water sign demonstrates exceptional emotional intelligence and profound protective instincts.',
        'Leo': 'Leo embodies the charismatic leader, ruled by the Sun\'s radiant energy. This fixed fire sign demonstrates natural magnetism and creative expression.',
        'Virgo': 'Virgo represents the meticulous perfectionist, governed by Mercury\'s analytical precision. This mutable earth sign demonstrates exceptional attention to detail.',
        'Libra': 'Libra embodies the diplomatic harmonizer, ruled by Venus\'s aesthetic grace. This cardinal air sign demonstrates exceptional social intelligence.',
        'Scorpio': 'Scorpio represents the intense transformer, governed by Pluto\'s regenerative power. This fixed water sign demonstrates exceptional emotional depth.',
        'Sagittarius': 'Sagittarius embodies the adventurous philosopher, ruled by Jupiter\'s expansive vision. This mutable fire sign demonstrates exceptional optimism.'
    };
    
    const panel = document.querySelector('.western-panel');
    if (panel) {
        panel.querySelector('h3').innerHTML = `⭐ ${currentSign.name.toUpperCase()}`;
        panel.querySelector('.element-badge').textContent = `${currentSign.element.toUpperCase()} ELEMENT`;
        panel.querySelector('.panel-description').textContent = descriptions[currentSign.name];
    }
}

function calculateNumerology(firstName, lastName, birthDate) {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    const lifePathSum = reduceToSingleDigit(year + month + day);
    
    const fullName = (firstName + lastName).toUpperCase();
    let expressionSum = 0;
    for (let char of fullName) {
        if (char >= 'A' && char <= 'Z') {
            expressionSum += ((char.charCodeAt(0) - 64) % 9) || 9;
        }
    }
    const expressionNumber = reduceToSingleDigit(expressionSum);
    
    let soulUrgeSum = 0;
    const vowels = 'AEIOU';
    for (let char of fullName) {
        if (vowels.includes(char)) {
            soulUrgeSum += ((char.charCodeAt(0) - 64) % 9) || 9;
        }
    }
    const soulUrge = reduceToSingleDigit(soulUrgeSum);
    
    let personalitySum = 0;
    for (let char of fullName) {
        if (char >= 'A' && char <= 'Z' && !vowels.includes(char)) {
            personalitySum += ((char.charCodeAt(0) - 64) % 9) || 9;
        }
    }
    const personality = reduceToSingleDigit(personalitySum);
    
    const descriptions = {
        1: 'reveals a natural born leader with pioneering spirit',
        2: 'indicates natural diplomacy and cooperative abilities',
        3: 'expresses creative communication and joyful expression',
        4: 'demonstrates practical foundation-building abilities',
        5: 'reveals adventurous adaptability and freedom-seeking',
        6: 'indicates nurturing responsibility and harmony-seeking',
        7: 'reveals a profound spiritual seeker pursuing deep truth and wisdom',
        8: 'demonstrates material mastery and ambitious achievement',
        9: 'expresses humanitarian compassion and universal understanding'
    };
    
    const panel = document.querySelector('.numerology-panel');
    if (panel) {
        const circles = panel.querySelectorAll('.number-circle');
        const labels = panel.querySelectorAll('.number-label');
        
        circles[0].textContent = lifePathSum;
        circles[1].textContent = expressionNumber;
        circles[2].textContent = soulUrge;
        circles[3].textContent = personality;
        
        labels[0].textContent = 'Life Path';
        labels[1].textContent = 'Expression';
        labels[2].textContent = 'Soul Urge';
        labels[3].textContent = 'Personality';
        
        panel.querySelector('.panel-description').textContent = 
            `Life Path ${lifePathSum} ${descriptions[lifePathSum]}. Expression ${expressionNumber} ${descriptions[expressionNumber]}, while Soul Urge ${soulUrge} ${descriptions[soulUrge]}.`;
    }
}

function reduceToSingleDigit(num) {
    while (num > 9) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
}

function calculateYinYang(birthDate, birthHour24) {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    let yangScore = 0;
    let yinScore = 0;
    
    if (year % 2 === 1) yangScore++; else yinScore++;
    if (month % 2 === 1) yangScore++; else yinScore++;
    if (day % 2 === 1) yangScore++; else yinScore++;
    if (birthHour24 >= 6 && birthHour24 < 18) yangScore++; else yinScore++;
    
    const totalPoints = yangScore + yinScore;
    const yangPercentage = Math.round((yangScore / totalPoints) * 100);
    const yinPercentage = 100 - yangPercentage;
    
    const panel = document.querySelector('.yinyang-panel');
    if (panel) {
        const yinBar = panel.querySelector('.yin-bar');
        const yangBar = panel.querySelector('.yang-bar');
        const yinText = panel.querySelector('.yin-text');
        const yangText = panel.querySelector('.yang-text');
        
        if (yinBar && yangBar) {
            yinBar.style.width = `${yinPercentage}%`;
            yangBar.style.width = `${yangPercentage}%`;
        }
        
        if (yinText) yinText.textContent = `${yinPercentage}%`;
        if (yangText) yangText.textContent = `${yangPercentage}%`;
        
        const yinDesc = panel.querySelector('.yin-energy-desc');
        const yangDesc = panel.querySelector('.yang-energy-desc');
        
        if (yinDesc) {
            yinDesc.querySelector('h4').textContent = `🌙 YIN ENERGY (${yinPercentage}%)`;
            yinDesc.querySelector('p:nth-child(2)').textContent = 'Feminine Energy: Receptive, Intuitive, Nurturing';
            yinDesc.querySelector('p:nth-child(3)').textContent = 
                `Your ${yinPercentage}% Yin energy represents your receptive, introspective nature. This is the quiet strength of water—flowing, adapting, and nurturing the inner world. It's about emotional depth, intuition, and the wisdom of listening.`;
        }
        
        if (yangDesc) {
            yangDesc.querySelector('h4').textContent = `☀️ YANG ENERGY (${yangPercentage}%)`;
            yangDesc.querySelector('p:nth-child(2)').textContent = 'Masculine Energy: Active, Logical, Assertive';
            yangDesc.querySelector('p:nth-child(3)').textContent = 
                `Your ${yangPercentage}% Yang energy fuels your active, outward-directed nature. This is the driving force of fire—initiating, creating, and shaping the external world. It's about action, logic, and the power of doing.`;
        }
    }
}

function calculateDayOfWeek(birthDate) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const rulers = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    
    const dayOfWeek = birthDate.getDay();
    const dayName = days[dayOfWeek];
    const ruler = rulers[dayOfWeek];
    
    const descriptions = {
        'Sunday': 'Sunday births fall under the Sun\'s dominion, bestowing exceptional communicative prowess and intellectual agility. Those born on this day naturally excel in analytical thinking and verbal expression.',
        'Monday': 'Monday births fall under the Moon\'s dominion, bestowing exceptional emotional intelligence and nurturing abilities. Those born on this day naturally excel in understanding others.',
        'Tuesday': 'Tuesday births fall under Mars\'s dominion, bestowing exceptional courage and dynamic energy. Those born on this day naturally excel in leadership.',
        'Wednesday': 'Wednesday births fall under Mercury\'s dominion, bestowing exceptional communicative prowess and intellectual agility. Those born on this day naturally excel in analytical thinking and verbal expression.',
        'Thursday': 'Thursday births fall under Jupiter\'s dominion, bestowing exceptional wisdom and expansive vision. Those born on this day naturally excel in teaching.',
        'Friday': 'Friday births fall under Venus\'s dominion, bestowing exceptional aesthetic appreciation and harmonious relationships. Those born on this day naturally excel in diplomacy.',
        'Saturday': 'Saturday births fall under Saturn\'s dominion, bestowing exceptional discipline and structural thinking. Those born on this day naturally excel in organization.'
    };
    
    const panel = document.querySelector('.day-panel');
    if (panel) {
        panel.querySelector('h3').textContent = dayName.toUpperCase();
        panel.querySelector('.element-badge').textContent = `RULED BY ${ruler.toUpperCase()}`;
        panel.querySelector('.panel-description').textContent = descriptions[dayName];
    }
}
