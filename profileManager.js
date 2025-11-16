// profileManager.js - Local Storage Profile Management System

const ProfileManager = {
    // Storage key
    STORAGE_KEY: 'astroProfiles',
    
    // Initialize storage structure if it doesn't exist
    init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const initialData = {
                profiles: {},
                currentProfile: null,
                lastProfileId: 0
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
        }
    },
    
    // Get all data from storage
    getData() {
        this.init();
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    },
    
    // Save data to storage
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },
    
    // Generate unique profile ID
    generateProfileId() {
        const data = this.getData();
        data.lastProfileId++;
        this.saveData(data);
        return `profile_${String(data.lastProfileId).padStart(4, '0')}`;
    },
    
    // Create new profile
    createProfile(profileData) {
        const data = this.getData();
        const profileId = this.generateProfileId();
        
        const profile = {
            id: profileId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...profileData
        };
        
        data.profiles[profileId] = profile;
        data.currentProfile = profileId;
        this.saveData(data);
        
        return profileId;
    },
    
    // Get profile by ID
    getProfile(profileId) {
        const data = this.getData();
        return data.profiles[profileId] || null;
    },
    
    // Get all profiles
    getAllProfiles() {
        const data = this.getData();
        return Object.values(data.profiles);
    },
    
    // Update profile
    updateProfile(profileId, updates) {
        const data = this.getData();
        if (data.profiles[profileId]) {
            data.profiles[profileId] = {
                ...data.profiles[profileId],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveData(data);
            return true;
        }
        return false;
    },
    
    // Delete profile
    deleteProfile(profileId) {
        const data = this.getData();
        if (data.profiles[profileId]) {
            delete data.profiles[profileId];
            if (data.currentProfile === profileId) {
                data.currentProfile = null;
            }
            this.saveData(data);
            return true;
        }
        return false;
    },
    
    // Set current profile (for viewing/editing)
    setCurrentProfile(profileId) {
        const data = this.getData();
        if (data.profiles[profileId]) {
            data.currentProfile = profileId;
            this.saveData(data);
            return true;
        }
        return false;
    },
    
    // Get current profile
    getCurrentProfile() {
        const data = this.getData();
        return data.currentProfile ? this.getProfile(data.currentProfile) : null;
    },
    
    // Calculate profile data (zodiac, numerology, etc.)
    calculateProfileData(birthDate, birthTime, birthLocation, firstName, lastName) {
        const date = new Date(birthDate);
        
        // Calculate age
        const today = new Date();
        let years = today.getFullYear() - date.getFullYear();
        let months = today.getMonth() - date.getMonth();
        let days = today.getDate() - date.getDate();
        
        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate Chinese Zodiac
        const chineseYear = date.getFullYear();
        const animals = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Sheep'];
        const elements = ['Metal', 'Water', 'Wood', 'Fire', 'Earth'];
        const animalIndex = chineseYear % 12;
        const elementIndex = Math.floor((chineseYear % 10) / 2);
        
        // Calculate Western Zodiac
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let westernSign = '';
        
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) westernSign = 'Aries';
        else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) westernSign = 'Taurus';
        else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) westernSign = 'Gemini';
        else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) westernSign = 'Cancer';
        else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) westernSign = 'Leo';
        else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) westernSign = 'Virgo';
        else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) westernSign = 'Libra';
        else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) westernSign = 'Scorpio';
        else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) westernSign = 'Sagittarius';
        else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) westernSign = 'Capricorn';
        else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) westernSign = 'Aquarius';
        else westernSign = 'Pisces';
        
        // Day of week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        
        // Numerology (simple calculation)
        const reduceToSingleDigit = (num) => {
            while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
                num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
            }
            return num;
        };
        
        const birthDaySum = String(birthDate).replace(/\D/g, '').split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        const lifePath = reduceToSingleDigit(birthDaySum);
        
        const nameSum = (firstName + lastName).toUpperCase().split('').reduce((sum, char) => {
            const code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                return sum + ((code - 64) % 9 || 9);
            }
            return sum;
        }, 0);
        const expression = reduceToSingleDigit(nameSum);
        
        // Yin/Yang calculation (based on birth year)
        const yinYangBalance = chineseYear % 2 === 0 ? { yin: 60, yang: 40 } : { yin: 40, yang: 60 };
        
        return {
            age: { years, months, days },
            chineseZodiac: {
                animal: animals[animalIndex],
                element: elements[elementIndex]
            },
            westernZodiac: {
                sign: westernSign,
                element: this.getWesternElement(westernSign)
            },
            dayOfWeek: {
                day: dayOfWeek,
                planet: this.getRulingPlanet(dayOfWeek)
            },
            numerology: {
                lifePath: lifePath,
                expression: expression,
                soulUrge: 3, // Placeholder
                personality: 2 // Placeholder
            },
            yinYang: yinYangBalance
        };
    },
    
    // Helper: Get Western zodiac element
    getWesternElement(sign) {
        const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
        const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
        const airSigns = ['Gemini', 'Libra', 'Aquarius'];
        const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
        
        if (fireSigns.includes(sign)) return 'Fire';
        if (earthSigns.includes(sign)) return 'Earth';
        if (airSigns.includes(sign)) return 'Air';
        if (waterSigns.includes(sign)) return 'Water';
        return 'Unknown';
    },
    
    // Helper: Get ruling planet for day
    getRulingPlanet(day) {
        const planets = {
            'Sunday': 'Sun',
            'Monday': 'Moon',
            'Tuesday': 'Mars',
            'Wednesday': 'Mercury',
            'Thursday': 'Jupiter',
            'Friday': 'Venus',
            'Saturday': 'Saturn'
        };
        return planets[day] || 'Unknown';
    },
    
    // Export all data (for backup)
    exportData() {
        return JSON.stringify(this.getData(), null, 2);
    },
    
    // Import data (for restore)
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.saveData(data);
            return true;
        } catch (e) {
            console.error('Invalid import data:', e);
            return false;
        }
    },
    
    // Clear all data (with confirmation)
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.init();
    }
};

// Initialize on load
ProfileManager.init();

// Make available globally
window.ProfileManager = ProfileManager;
