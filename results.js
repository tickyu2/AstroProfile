// DIAGNOSTIC VERSION - Shows exactly what's happening
console.log('╔════════════════════════════════════════╗');
console.log('║   RESULTS.JS LOADED - DIAGNOSTIC MODE ║');
console.log('╚════════════════════════════════════════╝');

// Load profile data from sessionStorage
document.addEventListener('DOMContentLoaded', function() {
    console.log('\n📄 Results page DOMContentLoaded event fired');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    // Check ALL storage
    console.log('\n🔍 CHECKING ALL STORAGE:');
    console.log('sessionStorage keys:', Object.keys(sessionStorage));
    console.log('localStorage keys:', Object.keys(localStorage));
    
    // Check currentProfile
    const profileDataString = sessionStorage.getItem('currentProfile');
    console.log('\n📦 sessionStorage.currentProfile:', profileDataString);
    
    if (!profileDataString) {
        console.error('❌ NO PROFILE DATA IN SESSION STORAGE!');
        console.log('This means app.js did not save the data properly.');
        
        // Check if there's anything in localStorage
        const localProfiles = localStorage.getItem('astroProfiles');
        if (localProfiles) {
            console.log('📋 Found profiles in localStorage:', localProfiles);
            const profiles = JSON.parse(localProfiles);
            if (profiles.length > 0) {
                console.log('Using most recent profile from localStorage as fallback');
                const profile = profiles[0];
                populateProfileData(profile);
                calculateAndDisplay(profile);
                return;
            }
        }
        
        alert('No profile data found. Please enter your birth information.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return;
    }
    
    const profile = JSON.parse(profileDataString);
    console.log('\n✅ PROFILE DATA LOADED:');
    console.log(JSON.stringify(profile, null, 2));
    console.log('\nKey fields:');
    console.log('  Name:', profile.firstName, profile.lastName);
    console.log('  Gender:', profile.gender);
    console.log('  Birth Date:', profile.birthDate);
    console.log('  Birth Hour (24h):', profile.birthHour24);
    console.log('  Birth Minute:', profile.birthMinute);
    console.log('  Location:', profile.birthCity, profile.birthState, profile.birthCountry);
    
    // Populate the page with profile data
    console.log('\n🎨 Populating page with profile data...');
    populateProfileData(profile);
    
    // Calculate and display all astrological data
    console.log('\n🔮 Calculating astrological data...');
    calculateAndDisplay(profile);
    
    console.log('\n✨ ALL DONE! Page should now show correct data.');
});

function populateProfileData(profile) {
    console.log('📝 populateProfileData() called');
    
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
    
    console.log('  Display values:');
    console.log('    Name:', fullName);
    console.log('    Date:', formattedDate);
    console.log('    Time:', birthTime);
    console.log('    Location:', location);
    
    // Update birth information panel
    const birthInfoPanel = document.querySelector('.info-panel');
    if (birthInfoPanel) {
        const infoContent = birthInfoPanel.querySelector('.info-content');
        if (infoContent) {
            infoContent.innerHTML = `
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
            console.log('✅ Birth info panel updated');
        } else {
            console.error('❌ .info-content not found inside .info-panel');
        }
    } else {
        console.error('❌ .info-panel not found on page');
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
        console.log('✅ Age calculated:', ageDisplay.textContent);
    }
}



// Generate coordinates for location (placeholder until hospital feature)
function generateCoordinates(location) {
    // This will be replaced with real hospital coordinates later
    // For now, generate approximate city center coordinates
    const cityCoords = {
        'Pasadena, CA, USA': '34.1478°N, 118.1445°W',
        'Alhambra, CA, USA': '34.0953°N, 118.1270°W',
        'Rawalpindi, Pakistan': '33.5651°N, 73.0169°E',
        'Los Angeles, CA, USA': '34.0522°N, 118.2437°W'
    };
    
    // Try to find exact match
    for (const [city, coords] of Object.entries(cityCoords)) {
        if (location.includes(city.split(',')[0])) {
            return coords;
        }
    }
    
    // Default approximate coordinates
    return '(Approximate city center)';
}

function calculateAndDisplay(profile) {
    const birthDate = new Date(profile.birthDate);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    console.log('🔮 Calculating with:');
    console.log('  Year:', year);
    console.log('  Month:', month);
    console.log('  Day:', day);
    console.log('  Hour (24h):', profile.birthHour24);
    
    // Calculate Chinese Zodiac
    calculateChineseZodiac(year, month, day);
    
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

function calculateChineseZodiac(year, month, day) {
    console.log(`🐉 Calculating Chinese Zodiac for ${year}-${month}-${day}`);
    
    // Use the new accurate calculator with Yin/Yang
    const zodiac = chineseZodiacCalculator.calculate(year, month, day);
    
    console.log(`  Chinese Year: ${zodiac.chineseYear}`);
    console.log(`  Full Name: ${zodiac.fullName}`);
    console.log(`  Polarity: ${zodiac.polarity}`);
    console.log(`  Element: ${zodiac.element}`);
    console.log(`  Animal: ${zodiac.animal} ${zodiac.emoji}`);
    
    // Update the Chinese Zodiac panel
    const panel = document.querySelector('.chinese-panel');
    if (panel) {
        const h3 = panel.querySelector('h3');
        const badge = panel.querySelector('.element-badge');
        const desc = panel.querySelector('.panel-description');
        
        // Update with Yin/Yang + Element + Animal
        if (h3) h3.innerHTML = `${zodiac.emoji} ${zodiac.polarity.toUpperCase()} ${zodiac.element.toUpperCase()} ${zodiac.animal.toUpperCase()}`;
        if (badge) badge.textContent = `${zodiac.element.toUpperCase()} ELEMENT`;
        
        // Keep existing description logic
        if (desc) {
            const traits = getChineseZodiacTraits(zodiac.animal);
            desc.textContent = `The ${zodiac.polarity} ${zodiac.element} ${zodiac.animal} combines ${zodiac.polarity.toLowerCase()} energy with ${zodiac.element.toLowerCase()} characteristics. Those born under this sign possess exceptional ${traits.split(',')[0].toLowerCase()} abilities.`;
        }
    }
}

// Helper function for traits (keeping original logic)
function getChineseZodiacTraits(animal) {
    const traitsMap = {
        'Rat': 'Quick-witted, resourceful, versatile, kind',
        'Ox': 'Diligent, dependable, strong, determined',
        'Tiger': 'Brave, confident, competitive, unpredictable',
        'Rabbit': 'Quiet, elegant, kind, responsible',
        'Dragon': 'Confident, intelligent, enthusiastic',
        'Snake': 'Enigmatic, intelligent, wise',
        'Horse': 'Animated, active, energetic',
        'Goat': 'Calm, gentle, sympathetic',
        'Monkey': 'Sharp, smart, curiosity',
        'Rooster': 'Observant, hardworking, courageous',
        'Dog': 'Lovely, honest, prudent',
        'Pig': 'Compassionate, generous, diligent'
    };
    return traitsMap[animal] || 'Unique and special';
}


function calculateWesternZodiac(month, day) {
    const signs = [
        { name: 'Capricorn', dates: [[12, 22], [1, 19]], element: 'Earth' },
        { name: 'Aquarius', dates: [[1, 20], [2, 18]], element: 'Air' },
        { name: 'Pisces', dates: [[2, 19], [3, 20]], element: 'Water' },
        { name: 'Aries', dates: [[3, 21], [4, 19]], element: 'Fire' },
        { name: 'Taurus', dates: [[4, 20], [5, 20]], element: 'Earth' },
        { name: 'Gemini', dates: [[5, 21], [6, 20]], element: 'Air' },
        { name: 'Cancer', dates: [[6, 21], [7, 22]], element: 'Water' },
        { name: 'Leo', dates: [[7, 23], [8, 22]], element: 'Fire' },
        { name: 'Virgo', dates: [[8, 23], [9, 22]], element: 'Earth' },
        { name: 'Libra', dates: [[9, 23], [10, 22]], element: 'Air' },
        { name: 'Scorpio', dates: [[10, 23], [11, 21]], element: 'Water' },
        { name: 'Sagittarius', dates: [[11, 22], [12, 21]], element: 'Fire' }
    ];
    
    let currentSign = signs[0];
    for (const sign of signs) {
        const [[startMonth, startDay], [endMonth, endDay]] = sign.dates;
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
            currentSign = sign;
            break;
        }
    }
    
    console.log(`  Western Zodiac: ${currentSign.name} (${currentSign.element})`);
    
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
        const h3 = panel.querySelector('h3');
        const badge = panel.querySelector('.element-badge');
        const desc = panel.querySelector('.panel-description');
        
        if (h3) h3.innerHTML = `⭐ ${currentSign.name.toUpperCase()}`;
        if (badge) badge.textContent = `${currentSign.element.toUpperCase()} ELEMENT`;
        if (desc) desc.textContent = descriptions[currentSign.name];
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
    
    console.log(`  Numerology: Life Path=${lifePathSum}, Expression=${expressionNumber}, Soul=${soulUrge}, Personality=${personality}`);
    
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
        const desc = panel.querySelector('.panel-description');
        
        if (circles[0]) circles[0].textContent = lifePathSum;
        if (circles[1]) circles[1].textContent = expressionNumber;
        if (circles[2]) circles[2].textContent = soulUrge;
        if (circles[3]) circles[3].textContent = personality;
        
        if (labels[0]) labels[0].textContent = 'Life Path';
        if (labels[1]) labels[1].textContent = 'Expression';
        if (labels[2]) labels[2].textContent = 'Soul Urge';
        if (labels[3]) labels[3].textContent = 'Personality';
        
        if (desc) desc.textContent = `Life Path ${lifePathSum} ${descriptions[lifePathSum]}. Expression ${expressionNumber} ${descriptions[expressionNumber]}, while Soul Urge ${soulUrge} ${descriptions[soulUrge]}.`;
    }
}



// Get elemental color class for numerology numbers
function getNumberColorClass(num) {
    if (num >= 1 && num <= 3) return 'fire-energy';    // Red - Action, Passion
    if (num >= 4 && num <= 6) return 'water-energy';   // Blue - Emotion, Flow
    if (num >= 7 && num <= 9) return 'spirit-energy';  // Purple - Wisdom, Spirit
    return 'neutral-energy';
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
    
    console.log(`  Yin/Yang: ${yinPercentage}% Yin / ${yangPercentage}% Yang`);
    
    const panel = document.querySelector('.yinyang-panel');
    if (panel) {
        const yinBar = panel.querySelector('.yin-bar');
        const yangBar = panel.querySelector('.yang-bar');
        const yinText = panel.querySelector('.yin-text');
        const yangText = panel.querySelector('.yang-text');
        
        if (yinBar) yinBar.style.width = `${yinPercentage}%`;
        if (yangBar) yangBar.style.width = `${yangPercentage}%`;
        if (yinText) yinText.textContent = `${yinPercentage}%`;
        if (yangText) yangText.textContent = `${yangPercentage}%`;
        
        const yinDesc = panel.querySelector('.yin-energy-desc');
        const yangDesc = panel.querySelector('.yang-energy-desc');
        
        if (yinDesc) {
            const h4 = yinDesc.querySelector('h4');
            const p2 = yinDesc.querySelector('p:nth-child(2)');
            const p3 = yinDesc.querySelector('p:nth-child(3)');
            
            if (h4) h4.textContent = `🌙 YIN ENERGY (${yinPercentage}%)`;
            if (p2) p2.textContent = 'Feminine Energy: Receptive, Intuitive, Nurturing';
            if (p3) p3.textContent = `Your ${yinPercentage}% Yin energy represents your receptive, introspective nature. This is the quiet strength of water—flowing, adapting, and nurturing the inner world. It's about emotional depth, intuition, and the wisdom of listening.`;
        }
        
        if (yangDesc) {
            const h4 = yangDesc.querySelector('h4');
            const p2 = yangDesc.querySelector('p:nth-child(2)');
            const p3 = yangDesc.querySelector('p:nth-child(3)');
            
            if (h4) h4.textContent = `☀️ YANG ENERGY (${yangPercentage}%)`;
            if (p2) p2.textContent = 'Masculine Energy: Active, Logical, Assertive';
            if (p3) p3.textContent = `Your ${yangPercentage}% Yang energy fuels your active, outward-directed nature. This is the driving force of fire—initiating, creating, and shaping the external world. It's about action, logic, and the power of doing.`;
        }
    }
}

function calculateDayOfWeek(birthDate) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const rulers = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    
    const dayOfWeek = birthDate.getDay();
    const dayName = days[dayOfWeek];
    const ruler = rulers[dayOfWeek];
    
    console.log(`  Day of Week: ${dayName} (Ruled by ${ruler})`);
    
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
        const h3 = panel.querySelector('h3');
        const badge = panel.querySelector('.element-badge');
        const desc = panel.querySelector('.panel-description');
        
        if (h3) h3.textContent = dayName.toUpperCase();
        if (badge) badge.textContent = `RULED BY ${ruler.toUpperCase()}`;
        if (desc) desc.textContent = descriptions[dayName];
    }
}

console.log('\n✅ All functions loaded and ready');
