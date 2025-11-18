// results.js - Populates the cosmic blueprint page with profile data
// Matches DOM IDs in results.html perfectly

console.log('🚀 results.js loaded');

// Get profile data from URL parameters
function getProfileFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    const profile = {
        firstName: params.get('firstName') || '',
        lastName: params.get('lastName') || '',
        gender: params.get('gender') || '',
        birthDate: params.get('birthDate') || '',
        birthHour: params.get('birthHour') || '',
        birthMinute: params.get('birthMinute') || '',
        birthAMPM: params.get('birthAMPM') || '',
        city: params.get('city') || '',
        state: params.get('state') || '',
        country: params.get('country') || ''
    };
    
    console.log('📋 Profile data from URL:', profile);
    return profile;
}

// Parse birth date - FIX FOR DATE PARSING BUG
function parseBirthDate(dateString) {
    console.log('📅 Parsing date string:', dateString);
    
    // Handle YYYY-MM-DD format (from date input)
    if (dateString.includes('-')) {
        const parts = dateString.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]); // 1-12
        const day = parseInt(parts[2]); // 1-31
        
        console.log(`✅ Parsed: Year=${year}, Month=${month}, Day=${day}`);
        return { year, month, day };
    }
    
    // Handle MM/DD/YYYY format (from URL params)
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        const month = parseInt(parts[0]); // 1-12
        const day = parseInt(parts[1]); // 1-31
        const year = parseInt(parts[2]);
        
        console.log(`✅ Parsed: Year=${year}, Month=${month}, Day=${day}`);
        return { year, month, day };
    }
    
    console.error('❌ Could not parse date:', dateString);
    return { year: 2000, month: 1, day: 1 };
}

// Format date for display
function formatDateForDisplay(year, month, day) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[month - 1]} ${day}, ${year}`;
}

// Calculate age
function calculateAge(year, month, day) {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Get coordinates for known cities
function getCoordinates(city, state, country) {
    const location = `${city}, ${state}, ${country}`;
    const cityCoords = {
        'Pasadena, CA, USA': '34.1478°N, 118.1445°W',
        'Los Angeles, CA, USA': '34.0522°N, 118.2437°W',
        'Alhambra, CA, USA': '34.0953°N, 118.1270°W',
        'Rawalpindi, , Pakistan': '33.5651°N, 73.0169°E',
        'Rawalpindi, Punjab, Pakistan': '33.5651°N, 73.0169°E'
    };
    
    return cityCoords[location] || null;
}

// Western Zodiac Calculator
function calculateWesternZodiac(month, day) {
    const zodiacSigns = [
        { name: 'Aries', emoji: '♈', element: 'Fire', dates: [[3, 21], [4, 19]], 
          description: 'Bold, pioneering, and confident. Natural leaders who embrace challenges with enthusiasm and courage.' },
        { name: 'Taurus', emoji: '♉', element: 'Earth', dates: [[4, 20], [5, 20]], 
          description: 'Grounded, reliable, and sensual. Values stability, comfort, and the finer things in life.' },
        { name: 'Gemini', emoji: '♊', element: 'Air', dates: [[5, 21], [6, 20]], 
          description: 'Curious, adaptable, and communicative. Quick-witted with a love for variety and social connection.' },
        { name: 'Cancer', emoji: '♋', element: 'Water', dates: [[6, 21], [7, 22]], 
          description: 'Nurturing, intuitive, and protective. Deeply emotional with strong family bonds and home values.' },
        { name: 'Leo', emoji: '♌', element: 'Fire', dates: [[7, 23], [8, 22]], 
          description: 'Confident, charismatic, and generous. Natural performers who radiate warmth and creative energy.' },
        { name: 'Virgo', emoji: '♍', element: 'Earth', dates: [[8, 23], [9, 22]], 
          description: 'Analytical, helpful, and detail-oriented. Perfectionists who excel at organization and service.' },
        { name: 'Libra', emoji: '♎', element: 'Air', dates: [[9, 23], [10, 22]], 
          description: 'Diplomatic, fair, and harmonious. Values balance, beauty, and meaningful partnerships.' },
        { name: 'Scorpio', emoji: '♏', element: 'Water', dates: [[10, 23], [11, 21]], 
          description: 'Intense, passionate, and transformative. Deeply perceptive with powerful emotional depth.' },
        { name: 'Sagittarius', emoji: '♐', element: 'Fire', dates: [[11, 22], [12, 21]], 
          description: 'Adventurous, optimistic, and philosophical. Free-spirited seekers of truth and meaning.' },
        { name: 'Capricorn', emoji: '♑', element: 'Earth', dates: [[12, 22], [1, 19]], 
          description: 'Ambitious, disciplined, and practical. Natural achievers who value tradition and hard work.' },
        { name: 'Aquarius', emoji: '♒', element: 'Air', dates: [[1, 20], [2, 18]], 
          description: 'Innovative, humanitarian, and independent. Forward-thinking visionaries who value community.' },
        { name: 'Pisces', emoji: '♓', element: 'Water', dates: [[2, 19], [3, 20]], 
          description: 'Compassionate, artistic, and intuitive. Dreamers with deep empathy and creative imagination.' }
    ];
    
    for (const sign of zodiacSigns) {
        const [[startMonth, startDay], [endMonth, endDay]] = sign.dates;
        
        if ((month === startMonth && day >= startDay) || 
            (month === endMonth && day <= endDay)) {
            return sign;
        }
    }
    
    return zodiacSigns[0]; // Default to Aries
}

// Numerology Calculator
function calculateNumerology(firstName, lastName, year, month, day) {
    function reduceToSingleDigit(num) {
        while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
            num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }
    
    function getLetterValue(letter) {
        const values = {
            'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
            'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
            'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
        };
        return values[letter.toUpperCase()] || 0;
    }
    
    // Life Path Number (from birth date)
    const dateSum = reduceToSingleDigit(
        reduceToSingleDigit(year) + 
        reduceToSingleDigit(month) + 
        reduceToSingleDigit(day)
    );
    
    // Expression Number (from full name)
    const fullName = (firstName + lastName).replace(/[^A-Za-z]/g, '');
    const expressionSum = fullName.split('').reduce((sum, letter) => sum + getLetterValue(letter), 0);
    const expressionNumber = reduceToSingleDigit(expressionSum);
    
    // Soul Urge Number (from vowels in name)
    const vowels = fullName.split('').filter(letter => 'AEIOU'.includes(letter.toUpperCase()));
    const soulUrgeSum = vowels.reduce((sum, letter) => sum + getLetterValue(letter), 0);
    const soulUrgeNumber = reduceToSingleDigit(soulUrgeSum);
    
    // Personal Year Number
    const currentYear = new Date().getFullYear();
    const personalYearSum = reduceToSingleDigit(
        reduceToSingleDigit(month) + 
        reduceToSingleDigit(day) + 
        reduceToSingleDigit(currentYear)
    );
    
    return {
        lifePath: dateSum,
        expression: expressionNumber,
        soulUrge: soulUrgeNumber,
        personalYear: personalYearSum
    };
}

// Get number energy type for styling
function getNumberEnergyClass(number) {
    if (number >= 1 && number <= 3) return 'fire-energy';
    if (number >= 4 && number <= 6) return 'water-energy';
    if (number >= 7 && number <= 9) return 'spirit-energy';
    return 'spirit-energy'; // For master numbers 11, 22, 33
}

// Day of week planetary influence
function getDayOfWeekInfluence(year, month, day) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    const influences = [
        { day: 'Sunday', planet: 'Sun', ruler: '☉ Sun', 
          description: 'Ruled by the Sun - radiates vitality, confidence, and leadership. Natural ability to shine and inspire others.' },
        { day: 'Monday', planet: 'Moon', ruler: '☽ Moon', 
          description: 'Ruled by the Moon - deeply intuitive, emotional, and nurturing. Strong connection to feelings and cycles.' },
        { day: 'Tuesday', planet: 'Mars', ruler: '♂ Mars', 
          description: 'Ruled by Mars - dynamic, courageous, and action-oriented. Natural warrior energy and competitive drive.' },
        { day: 'Wednesday', planet: 'Mercury', ruler: '☿ Mercury', 
          description: 'Ruled by Mercury - quick-minded, communicative, and versatile. Gifted with words and adaptability.' },
        { day: 'Thursday', planet: 'Jupiter', ruler: '♃ Jupiter', 
          description: 'Ruled by Jupiter - optimistic, expansive, and philosophical. Natural luck and wisdom-seeking nature.' },
        { day: 'Friday', planet: 'Venus', ruler: '♀ Venus', 
          description: 'Ruled by Venus - artistic, harmonious, and loving. Appreciates beauty, relationships, and pleasure.' },
        { day: 'Saturday', planet: 'Saturn', ruler: '♄ Saturn', 
          description: 'Ruled by Saturn - disciplined, responsible, and wise. Strong work ethic and respect for structure.' }
    ];
    
    return influences[dayOfWeek];
}

// Populate the page with data
function populateProfileData() {
    console.log('🌟 Populating page with profile data...');
    
    const profile = getProfileFromURL();
    const { year, month, day } = parseBirthDate(profile.birthDate);
    
    // Display basic info
    const fullName = `${profile.firstName} ${profile.lastName}`;
    document.getElementById('displayName').textContent = fullName;
    
    console.log('Display values:');
    console.log(`  Name: ${fullName}`);
    console.log(`  Date: ${formatDateForDisplay(year, month, day)}`);
    console.log(`  Time: ${profile.birthHour}:${profile.birthMinute} ${profile.birthAMPM}`);
    console.log(`  Location: ${profile.city}, ${profile.state}, ${profile.country}`);
    
    // Gender badge
    if (profile.gender) {
        const genderBadge = document.getElementById('genderBadge');
        const genderIcon = document.getElementById('genderIcon');
        const genderText = document.getElementById('genderText');
        
        if (profile.gender.toLowerCase() === 'male') {
            genderBadge.classList.add('male');
            genderIcon.textContent = '♂';
            genderText.textContent = 'Male';
        } else {
            genderBadge.classList.add('female');
            genderIcon.textContent = '♀';
            genderText.textContent = 'Female';
        }
        genderBadge.style.display = 'inline-flex';
    }
    
    // Birth details
    document.getElementById('birthDate').textContent = formatDateForDisplay(year, month, day);
    document.getElementById('birthTime').textContent = `${profile.birthHour}:${profile.birthMinute} ${profile.birthAMPM}`;
    document.getElementById('birthLocation').textContent = `${profile.city}, ${profile.state}, ${profile.country}`;
    
    // Coordinates
    const coords = getCoordinates(profile.city, profile.state, profile.country);
    if (coords) {
        document.getElementById('coordinates').style.display = 'block';
        document.getElementById('coordinatesValue').textContent = coords;
    }
    
    // Age
    const age = calculateAge(year, month, day);
    document.getElementById('currentAge').textContent = `${age} years old`;
    
    console.log('✅ ALL DONE! Page should now show correct data.');
}

// Calculate astrological data
function calculateAstrologicalData() {
    console.log('🔮 Calculating astrological data...');
    
    const profile = getProfileFromURL();
    const { year, month, day } = parseBirthDate(profile.birthDate);
    
    console.log('Calculating with:');
    console.log(`  Year: ${year}`);
    console.log(`  Month: ${month}`);
    console.log(`  Day: ${day}`);
    
    // Chinese Zodiac (using external calculator)
    console.log('🐉 Calculating Chinese Zodiac for', `${year}-${month}-${day}`);
    
    if (typeof calculateChineseZodiac === 'function') {
        const chineseData = calculateChineseZodiac(year, month, day);
        console.log('Chinese Zodiac result:', chineseData);
        
        // Update Chinese zodiac display
        document.getElementById('chineseName').textContent = chineseData.fullName;
        document.getElementById('chineseIcon').textContent = chineseData.animal;
        document.getElementById('chineseDescription').textContent = chineseData.description;
        
        // Element badge
        const elementBadge = document.getElementById('elementBadge');
        elementBadge.textContent = chineseData.element;
        elementBadge.className = 'badge element-' + chineseData.element.toLowerCase();
        
        // Polarity badge
        const polarityBadge = document.getElementById('polarityBadge');
        polarityBadge.textContent = chineseData.polarity;
        polarityBadge.className = 'badge polarity-' + chineseData.polarity.toLowerCase();
    } else {
        console.error('❌ calculateChineseZodiac function not found!');
    }
    
    // Western Zodiac
    const westernData = calculateWesternZodiac(month, day);
    console.log('Western Zodiac:', westernData.name, westernData.emoji);
    
    document.getElementById('westernName').textContent = westernData.name;
    document.getElementById('westernIcon').textContent = westernData.emoji;
    document.getElementById('westernDescription').textContent = westernData.description;
    
    const westernElement = document.getElementById('westernElement');
    westernElement.textContent = westernData.element;
    westernElement.className = 'badge element-' + westernData.element.toLowerCase();
    
    // Numerology
    const numerology = calculateNumerology(profile.firstName, profile.lastName, year, month, day);
    console.log('Numerology:', numerology);
    
    // Life Path
    const lifePathEl = document.getElementById('lifePath');
    lifePathEl.textContent = numerology.lifePath;
    lifePathEl.className = 'number-circle ' + getNumberEnergyClass(numerology.lifePath);
    
    // Expression
    const expressionEl = document.getElementById('expression');
    expressionEl.textContent = numerology.expression;
    expressionEl.className = 'number-circle ' + getNumberEnergyClass(numerology.expression);
    
    // Soul Urge
    const soulUrgeEl = document.getElementById('soulUrge');
    soulUrgeEl.textContent = numerology.soulUrge;
    soulUrgeEl.className = 'number-circle ' + getNumberEnergyClass(numerology.soulUrge);
    
    // Personal Year
    const personalYearEl = document.getElementById('personalYear');
    personalYearEl.textContent = numerology.personalYear;
    personalYearEl.className = 'number-circle ' + getNumberEnergyClass(numerology.personalYear);
    
    // Yin/Yang Balance (from Chinese zodiac if available)
    if (typeof calculateChineseZodiac === 'function') {
        const chineseData = calculateChineseZodiac(year, month, day);
        if (chineseData.yinYangBalance) {
            document.getElementById('yangPercent').textContent = chineseData.yinYangBalance.yang + '%';
            document.getElementById('yinPercent').textContent = chineseData.yinYangBalance.yin + '%';
            document.getElementById('yinyangDescription').textContent = chineseData.yinYangBalance.description;
        }
    }
    
    // Day of Week Influence
    const dayInfluence = getDayOfWeekInfluence(year, month, day);
    console.log('Day of Week:', dayInfluence.day, 'ruled by', dayInfluence.planet);
    
    document.getElementById('dayPlanet').textContent = `${dayInfluence.day} (Ruled by ${dayInfluence.ruler})`;
    document.getElementById('dayDescription').textContent = dayInfluence.description;
    
    console.log('✅ All calculations complete!');
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Page loaded, initializing...');
    populateProfileData();
    calculateAstrologicalData();
});
