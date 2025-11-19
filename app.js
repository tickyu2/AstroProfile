// AstroProfile Application Logic - Updated for separate name and location fields
// No localStorage configuration needed - works automatically in all modern browsers

// Load saved data on page load
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
                document.getElementById('birthForm').dispatchEvent(new Event('submit'));
            }
        }
    });
});

// Auto-advance for time inputs when 2 digits entered
document.getElementById('birthHour').addEventListener('input', (e) => {
    if (e.target.value.length === 2 && parseInt(e.target.value) <= 23) {
        document.getElementById('birthMinute').focus();
    }
});

document.getElementById('birthMinute').addEventListener('input', (e) => {
    if (e.target.value.length === 2 && parseInt(e.target.value) <= 59) {
        document.getElementById('birthCity').focus();
    }
});

// Form validation and submission
document.getElementById('birthForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(err => {
        err.classList.remove('show');
    });

    // Validate names
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    if (!firstName || !lastName) {
        document.getElementById('nameError').classList.add('show');
        isValid = false;
    }

    // Validate date
    const date = document.getElementById('birthDate').value;
    if (!date) {
        document.getElementById('dateError').classList.add('show');
        isValid = false;
    }

    // Validate time
    const hour = document.getElementById('birthHour').value;
    const minute = document.getElementById('birthMinute').value;
    if (!hour || !minute || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        document.getElementById('timeError').classList.add('show');
        isValid = false;
    }

    // Validate location
    const city = document.getElementById('birthCity').value.trim();
    const country = document.getElementById('birthCountry').value.trim();
    if (!city || !country) {
        document.getElementById('locationError').classList.add('show');
        isValid = false;
    }

    if (isValid) {
        // Save form data to localStorage
        const formData = {
            firstName: firstName,
            lastName: lastName,
            birthDate: date,
            birthHour: hour,
            birthMinute: minute,
            birthCity: city,
            birthCountry: country
        };
        
        localStorage.setItem('astroFormData', JSON.stringify(formData));
        
        // Generate and navigate to results
        generateResults(formData);
    }
});

function generateResults(data) {
    // Parse the date CORRECTLY
    const [year, month, day] = data.birthDate.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day); // month is 0-indexed in JavaScript!
    
    // Calculate day of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[birthDate.getDay()];
    
    // Calculate age accurately
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
        monthDiff = 12 + monthDiff;
    }
    
    if (monthDiff < 0) monthDiff = 0;
    
    // Calculate days in current age year
    const lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (lastBirthday > today) {
        lastBirthday.setFullYear(today.getFullYear() - 1);
    }
    const ageDays = Math.floor((today - lastBirthday) / (1000 * 60 * 60 * 24));
    
    // Calculate Chinese Zodiac
    const chineseZodiac = getChineseZodiac(year);
    const element = getChineseElement(year);
    
    // Calculate Western Zodiac
    const westernZodiac = getWesternZodiac(month, day);
    
    // Calculate Yin/Yang
    const yinYangBalance = calculateYinYang(birthDate, parseInt(data.birthHour));
    
    // Calculate Numerology
    const lifePathNumber = calculateLifePath(birthDate);
    
    // Combine first and last name for display
    const fullName = `${data.firstName} ${data.lastName}`;
    
    // Store results and navigate
    const results = {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: fullName,
        birthDateFormatted: birthDate.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        dayOfWeek: dayOfWeek,
        age: age,
        ageMonths: monthDiff,
        ageDays: ageDays,
        birthTime: `${data.birthHour.padStart(2, '0')}:${data.birthMinute.padStart(2, '0')}`,
        birthCity: data.birthCity,
        birthCountry: data.birthCountry,
        birthLocation: `${data.birthCity}, ${data.birthCountry}`,
        chineseZodiac: chineseZodiac,
        element: element,
        westernZodiac: westernZodiac,
        yinYangBalance: yinYangBalance,
        lifePathNumber: lifePathNumber
    };
    
    localStorage.setItem('astroResults', JSON.stringify(results));
    window.location.href = 'results.html';
}

// Helper Functions

function getChineseZodiac(year) {
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 
                     'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    return animals[(year - 4) % 12];
}

function getChineseElement(year) {
    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    return elements[Math.floor(((year - 4) % 10) / 2)];
}

function getWesternZodiac(month, day) {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
    return 'Capricorn';
}

function calculateYinYang(birthDate, hour) {
    let yinScore = 0;
    let yangScore = 0;
    
    // Year (odd = yang, even = yin)
    if (birthDate.getFullYear() % 2 === 0) yinScore++; else yangScore++;
    
    // Month (odd = yang, even = yin)
    if ((birthDate.getMonth() + 1) % 2 === 0) yinScore++; else yangScore++;
    
    // Day (odd = yang, even = yin)
    if (birthDate.getDate() % 2 === 0) yinScore++; else yangScore++;
    
    // Hour (night = yin, day = yang)
    if (hour >= 6 && hour < 18) yangScore++; else yinScore++;
    
    const total = yinScore + yangScore;
    const yinPercent = Math.round((yinScore / total) * 100);
    const yangPercent = 100 - yinPercent;
    
    return { yin: yinPercent, yang: yangPercent };
}

function calculateLifePath(birthDate) {
    const dateString = birthDate.getFullYear().toString() + 
                     (birthDate.getMonth() + 1).toString().padStart(2, '0') + 
                     birthDate.getDate().toString().padStart(2, '0');
    
    let sum = dateString.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    
    // Reduce to single digit (except master numbers 11, 22, 33)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    
    return sum;
}
