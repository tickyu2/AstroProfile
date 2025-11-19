// AstroProfile Application Logic - Firebase Version
// Restored from working commit 9087d92 + Firebase cloud storage

// Load saved form data on page load (still uses localStorage for convenience)
window.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('astroFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('firstName').value = formData.firstName || '';
        document.getElementById('lastName').value = formData.lastName || '';
        document.getElementById('birthDate').value = formData.birthDate || '';
        document.getElementById('birthHour').value = formData.birthHour || '';
        document.getElementById('birthMinute').value = formData.birthMinute || '';
        document.getElementById('birthCity').value = formData.birthCity || '';
        document.getElementById('birthCountry').value = formData.birthCountry || '';
    }
});

// Enhanced single-TAB navigation
const inputs = [
    document.getElementById('firstName'),
    document.getElementById('lastName'),
    document.getElementById('birthDate'),
    document.getElementById('birthHour'),
    document.getElementById('birthMinute'),
    document.getElementById('birthCity'),
    document.getElementById('birthCountry')
];

inputs.forEach((input, index) => {
    if (!input) return;
    
    input.addEventListener('keydown', (e) => {
        // Single TAB moves forward
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            const nextIndex = (index + 1) % inputs.length;
            inputs[nextIndex].focus();
        } 
        // Shift+TAB moves backward
        else if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            const prevIndex = (index - 1 + inputs.length) % inputs.length;
            inputs[prevIndex].focus();
        } 
        // ENTER advances to next field or submits
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (index < inputs.length - 1) {
                inputs[index + 1].focus();
            } else {
                document.querySelector('form').dispatchEvent(new Event('submit'));
            }
        }
    });
});

// Auto-advance for hour and minute inputs after 2 digits
const birthHour = document.getElementById('birthHour');
const birthMinute = document.getElementById('birthMinute');

if (birthHour) {
    birthHour.addEventListener('input', (e) => {
        if (e.target.value.length === 2) {
            birthMinute.focus();
        }
    });
}

// Form submission
document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const data = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        birthDate: document.getElementById('birthDate').value,
        birthHour: document.getElementById('birthHour').value,
        birthMinute: document.getElementById('birthMinute').value,
        birthCity: document.getElementById('birthCity').value.trim(),
        birthCountry: document.getElementById('birthCountry').value.trim()
    };
    
    // Validate inputs
    if (!data.firstName || !data.lastName || !data.birthDate || !data.birthHour || !data.birthMinute || !data.birthCity || !data.birthCountry) {
        alert('Please fill in all fields before submitting.');
        return;
    }
    
    // Validate hour (0-23) and minute (0-59)
    const hour = parseInt(data.birthHour);
    const minute = parseInt(data.birthMinute);
    
    if (isNaN(hour) || hour < 0 || hour > 23) {
        alert('Hour must be between 0 and 23');
        return;
    }
    
    if (isNaN(minute) || minute < 0 || minute > 59) {
        alert('Minute must be between 0 and 59');
        return;
    }
    
    // Save form data for convenience (still localStorage)
    localStorage.setItem('astroFormData', JSON.stringify(data));
    
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Calculating your cosmic blueprint...';
    submitButton.disabled = true;
    
    try {
        // Process the data
        await processFormData(data);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

async function processFormData(data) {
    // Parse birth date
    const birthDate = new Date(data.birthDate + 'T00:00:00');
    const today = new Date();
    
    // Calculate age
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();
    
    if (ageDays < 0) {
        ageMonths--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        ageDays += lastMonth.getDate();
    }
    
    if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
    }
    
    // Format birth date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const birthDateFormatted = birthDate.toLocaleDateString('en-US', options);
    
    // Get day of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[birthDate.getDay()];
    
    // Calculate astrological data
    const chineseZodiac = getChineseZodiac(birthDate.getFullYear());
    const element = getElement(birthDate.getFullYear());
    const westernZodiac = getWesternZodiac(birthDate.getMonth() + 1, birthDate.getDate());
    const yinYangBalance = calculateYinYang(birthDate);
    const lifePathNumber = calculateLifePath(birthDate);
    
    // Create results object
    const results = {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        birthDate: data.birthDate,
        birthDateFormatted: birthDateFormatted,
        dayOfWeek: dayOfWeek,
        age: ageYears,
        ageMonths: ageMonths,
        ageDays: ageDays,
        birthTime: `${data.birthHour.padStart(2, '0')}:${data.birthMinute.padStart(2, '0')}`,
        birthCity: data.birthCity,
        birthCountry: data.birthCountry,
        birthLocation: `${data.birthCity}, ${data.birthCountry}`,
        chineseZodiac: chineseZodiac,
        element: element,
        westernZodiac: westernZodiac,
        yinYangBalance: yinYangBalance,
        lifePathNumber: lifePathNumber,
        createdAt: new Date().toISOString()
    };
    
    // Save to Firebase instead of localStorage
    if (!window.ProfileManager || !window.ProfileManager.database) {
        console.error('Firebase not ready, falling back to localStorage');
        localStorage.setItem('astroResults', JSON.stringify(results));
        window.location.href = 'results.html';
        return;
    }
    
    try {
        await window.ProfileManager.saveProfile(results);
        console.log('✅ Profile saved to Firebase');
        window.location.href = 'results.html';
    } catch (error) {
        console.error('Firebase save error, falling back to localStorage:', error);
        localStorage.setItem('astroResults', JSON.stringify(results));
        window.location.href = 'results.html';
    }
}

// Helper Functions

function getChineseZodiac(year) {
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 
                     'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    return animals[(year - 4) % 12];
}

function getElement(year) {
    const elements = ['Metal', 'Water', 'Wood', 'Fire', 'Earth'];
    return elements[Math.floor(((year - 4) % 10) / 2)];
}

function getWesternZodiac(month, day) {
    const zodiacSigns = [
        { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
        { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
        { sign: 'Pisces', start: [2, 19], end: [3, 20] },
        { sign: 'Aries', start: [3, 21], end: [4, 19] },
        { sign: 'Taurus', start: [4, 20], end: [5, 20] },
        { sign: 'Gemini', start: [5, 21], end: [6, 20] },
        { sign: 'Cancer', start: [6, 21], end: [7, 22] },
        { sign: 'Leo', start: [7, 23], end: [8, 22] },
        { sign: 'Virgo', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', start: [9, 23], end: [10, 22] },
        { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
        { sign: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];
    
    for (const zodiac of zodiacSigns) {
        const [startMonth, startDay] = zodiac.start;
        const [endMonth, endDay] = zodiac.end;
        
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
            return zodiac.sign;
        }
    }
    
    return 'Capricorn';
}

function calculateYinYang(birthDate) {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    let yinScore = 0;
    let yangScore = 0;
    
    // Year influences
    if (year % 2 === 0) yinScore += 30; else yangScore += 30;
    
    // Month influences
    if (month % 2 === 0) yinScore += 20; else yangScore += 20;
    
    // Day influences
    if (day % 2 === 0) yinScore += 25; else yangScore += 25;
    
    // Chinese zodiac influences
    const zodiac = getChineseZodiac(year);
    const yinAnimals = ['Rabbit', 'Snake', 'Goat', 'Rooster', 'Pig', 'Ox'];
    if (yinAnimals.includes(zodiac)) {
        yinScore += 25;
    } else {
        yangScore += 25;
    }
    
    const total = yinScore + yangScore;
    return {
        yin: Math.round((yinScore / total) * 100),
        yang: Math.round((yangScore / total) * 100)
    };
}

function calculateLifePath(birthDate) {
    const dateString = birthDate.toISOString().split('T')[0].replace(/-/g, '');
    
    function reduceToSingleDigit(num) {
        while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
            num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        }
        return num;
    }
    
    const sum = dateString.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    return reduceToSingleDigit(sum);
}
