// DIAGNOSTIC VERSION - Shows exactly what's happening
console.log('╔════════════════════════════════════════╗');
console.log('║   RESULTS.JS LOADED - DIAGNOSTIC MODE ║');
console.log('╚════════════════════════════════════════╝');

// Check if Chinese zodiac data is loaded
console.log('🐉 Checking Chinese zodiac data availability...');
if (typeof CHINESE_ZODIAC_DATA !== 'undefined') {
    console.log(`✅ CHINESE_ZODIAC_DATA loaded: ${CHINESE_ZODIAC_DATA.length} entries`);
} else {
    console.error('❌ CHINESE_ZODIAC_DATA not found! Using compact fallback');
}

if (typeof findChineseZodiac !== 'undefined') {
    console.log('✅ findChineseZodiac() function available');
} else {
    console.warn('⚠️ findChineseZodiac() not found! Using compact fallback');
    
    // Inline compact fallback lookup
    const ZODIAC_COMPACT = {"1925":{"animal":"Ox","element":"Wood","polarity":"Yin","full_name":"Yin Wood Ox","tagline":"Steady, nurturing, deeply rooted growth","start":"1925-02-13","end":"1926-02-01"},"1926":{"animal":"Tiger","element":"Fire","polarity":"Yang","full_name":"Yang Fire Tiger","tagline":"Blazing, fearless, magnetic leadership","start":"1926-02-02","end":"1927-02-17"},"1927":{"animal":"Rabbit","element":"Fire","polarity":"Yin","full_name":"Yin Fire Rabbit","tagline":"Warm, intuitive, quietly transformative","start":"1927-02-18","end":"1928-02-04"},"1928":{"animal":"Dragon","element":"Earth","polarity":"Yang","full_name":"Yang Earth Dragon","tagline":"Unstoppable, grounded, empire-building force","start":"1928-02-05","end":"1929-02-09"},"1929":{"animal":"Snake","element":"Earth","polarity":"Yin","full_name":"Yin Earth Snake","tagline":"Deep, strategic, subtly transformative wisdom","start":"1929-02-10","end":"1930-01-29"},"1930":{"animal":"Horse","element":"Metal","polarity":"Yang","full_name":"Yang Metal Horse","tagline":"Swift, precise, unstoppable momentum","start":"1930-01-30","end":"1931-02-16"},"1931":{"animal":"Goat","element":"Metal","polarity":"Yin","full_name":"Yin Metal Goat","tagline":"Refined, resilient, quietly revolutionary","start":"1931-02-17","end":"1932-02-05"},"1932":{"animal":"Monkey","element":"Water","polarity":"Yang","full_name":"Yang Water Monkey","tagline":"Fluid, adaptive, ingeniously clever","start":"1932-02-06","end":"1933-01-25"},"1933":{"animal":"Rooster","element":"Water","polarity":"Yin","full_name":"Yin Water Rooster","tagline":"Perceptive, cleansing, truth-revealing","start":"1933-01-26","end":"1934-02-13"},"1934":{"animal":"Dog","element":"Wood","polarity":"Yang","full_name":"Yang Wood Dog","tagline":"Loyal, growing, protective leadership","start":"1934-02-14","end":"1935-02-03"},"1935":{"animal":"Pig","element":"Wood","polarity":"Yin","full_name":"Yin Wood Pig","tagline":"Nurturing, abundant, quietly generous","start":"1935-02-04","end":"1936-01-23"},"1936":{"animal":"Rat","element":"Fire","polarity":"Yang","full_name":"Yang Fire Rat","tagline":"Daring, quick, pioneering innovator","start":"1936-01-24","end":"1937-02-10"},"1937":{"animal":"Ox","element":"Fire","polarity":"Yin","full_name":"Yin Fire Ox","tagline":"Enduring, passionate, transformative worker","start":"1937-02-11","end":"1938-01-30"},"1938":{"animal":"Tiger","element":"Earth","polarity":"Yang","full_name":"Yang Earth Tiger","tagline":"Grounded, powerful, territorial leader","start":"1938-01-31","end":"1939-02-18"},"1939":{"animal":"Rabbit","element":"Earth","polarity":"Yin","full_name":"Yin Earth Rabbit","tagline":"Stable, gentle, home-building nurturer","start":"1939-02-19","end":"1940-02-07"},"1940":{"animal":"Dragon","element":"Metal","polarity":"Yang","full_name":"Yang Metal Dragon","tagline":"Invincible, sharp, destiny-forging","start":"1940-02-08","end":"1941-01-26"},"1941":{"animal":"Snake","element":"Metal","polarity":"Yin","full_name":"Yin Metal Snake","tagline":"Elegant, refined, strategically brilliant","start":"1941-01-27","end":"1942-02-14"},"1942":{"animal":"Horse","element":"Water","polarity":"Yang","full_name":"Yang Water Horse","tagline":"Free-flowing, unstoppable, boundary-breaking","start":"1942-02-15","end":"1943-02-04"},"1943":{"animal":"Goat","element":"Water","polarity":"Yin","full_name":"Yin Water Goat","tagline":"Flowing, compassionate, adaptively gentle","start":"1943-02-05","end":"1944-01-24"},"1944":{"animal":"Monkey","element":"Wood","polarity":"Yang","full_name":"Yang Wood Monkey","tagline":"Climbing, curious, playfully inventive","start":"1944-01-25","end":"1945-02-12"},"1945":{"animal":"Rooster","element":"Wood","polarity":"Yin","full_name":"Yin Wood Rooster","tagline":"Detail-focused, organic, patiently perfecting","start":"1945-02-13","end":"1946-02-01"},"1946":{"animal":"Dog","element":"Fire","polarity":"Yang","full_name":"Yang Fire Dog","tagline":"Passionate, protective, justice-seeking","start":"1946-02-02","end":"1947-01-21"},"1947":{"animal":"Pig","element":"Fire","polarity":"Yin","full_name":"Yin Fire Pig","tagline":"Warm-hearted, glowing, generously welcoming","start":"1947-01-22","end":"1948-02-09"},"1948":{"animal":"Rat","element":"Earth","polarity":"Yang","full_name":"Yang Earth Rat","tagline":"Resourceful, grounding, community-building","start":"1948-02-10","end":"1949-01-28"},"1949":{"animal":"Ox","element":"Earth","polarity":"Yin","full_name":"Yin Earth Ox","tagline":"Patient, fertile, deeply nurturing","start":"1949-01-29","end":"1950-02-16"},"1950":{"animal":"Tiger","element":"Metal","polarity":"Yang","full_name":"Yang Metal Tiger","tagline":"Fierce, disciplined, conquest-driven","start":"1950-02-17","end":"1951-02-05"},"1951":{"animal":"Rabbit","element":"Metal","polarity":"Yin","full_name":"Yin Metal Rabbit","tagline":"Graceful, strong, elegantly resilient","start":"1951-02-06","end":"1952-01-26"},"1952":{"animal":"Dragon","element":"Water","polarity":"Yang","full_name":"Yang Water Dragon","tagline":"Flowing power, oceanic ambition","start":"1952-01-27","end":"1953-02-13"},"1953":{"animal":"Snake","element":"Water","polarity":"Yin","full_name":"Yin Water Snake","tagline":"Deep, intuitive, mysteriously wise","start":"1953-02-14","end":"1954-02-02"},"1954":{"animal":"Horse","element":"Wood","polarity":"Yang","full_name":"Yang Wood Horse","tagline":"Expansive, free-spirited, boundary-pushing","start":"1954-02-03","end":"1955-01-23"},"1955":{"animal":"Goat","element":"Wood","polarity":"Yin","full_name":"Yin Wood Goat","tagline":"Artistically nurturing, creatively gentle","start":"1955-01-24","end":"1956-02-11"},"1956":{"animal":"Monkey","element":"Fire","polarity":"Yang","full_name":"Yang Fire Monkey","tagline":"Blazing wit, explosive creativity","start":"1956-02-12","end":"1957-01-30"},"1957":{"animal":"Rooster","element":"Fire","polarity":"Yin","full_name":"Yin Fire Rooster","tagline":"Precise, passionate, dawn-announcing","start":"1957-01-31","end":"1958-02-17"},"1958":{"animal":"Dog","element":"Earth","polarity":"Yang","full_name":"Yang Earth Dog","tagline":"Loyal, grounding, community-protecting","start":"1958-02-18","end":"1959-02-07"},"1959":{"animal":"Pig","element":"Earth","polarity":"Yin","full_name":"Yin Earth Pig","tagline":"Nurturing, abundant, home-creating","start":"1959-02-08","end":"1960-01-27"},"1960":{"animal":"Rat","element":"Metal","polarity":"Yang","full_name":"Yang Metal Rat","tagline":"Sharp, resourceful, strategically clever","start":"1960-01-28","end":"1961-02-14"},"1961":{"animal":"Ox","element":"Metal","polarity":"Yin","full_name":"Yin Metal Ox","tagline":"Refined strength, elegant endurance","start":"1961-02-15","end":"1962-02-04"},"1962":{"animal":"Tiger","element":"Water","polarity":"Yang","full_name":"Yang Water Tiger","tagline":"Flowing power, adaptive ferocity","start":"1962-02-05","end":"1963-01-24"},"1963":{"animal":"Rabbit","element":"Water","polarity":"Yin","full_name":"Yin Water Rabbit","tagline":"Gentle depth, intuitive flow","start":"1963-01-25","end":"1964-02-12"},"1964":{"animal":"Dragon","element":"Wood","polarity":"Yang","full_name":"Yang Wood Dragon","tagline":"Growing empire, expanding vision","start":"1964-02-13","end":"1965-02-01"},"1965":{"animal":"Snake","element":"Wood","polarity":"Yin","full_name":"Yin Wood Snake","tagline":"Subtle growth, organic wisdom","start":"1965-02-02","end":"1966-01-20"},"1966":{"animal":"Horse","element":"Fire","polarity":"Yang","full_name":"Yang Fire Horse","tagline":"Blazing speed, unstoppable passion","start":"1966-01-21","end":"1967-02-08"},"1967":{"animal":"Goat","element":"Fire","polarity":"Yin","full_name":"Yin Fire Goat","tagline":"Creative warmth, artistic passion","start":"1967-02-09","end":"1968-01-29"},"1968":{"animal":"Monkey","element":"Earth","polarity":"Yang","full_name":"Yang Earth Monkey","tagline":"Grounded cleverness, practical innovation","start":"1968-01-30","end":"1969-02-16"},"1969":{"animal":"Rooster","element":"Earth","polarity":"Yin","full_name":"Yin Earth Rooster","tagline":"Nurturing precision, detailed care","start":"1969-02-17","end":"1970-02-05"},"1970":{"animal":"Dog","element":"Metal","polarity":"Yang","full_name":"Yang Metal Dog","tagline":"Sharp loyalty, protective strength","start":"1970-02-06","end":"1971-01-26"},"1971":{"animal":"Pig","element":"Metal","polarity":"Yin","full_name":"Yin Metal Pig","tagline":"Refined generosity, elegant abundance","start":"1971-01-27","end":"1972-02-14"},"1972":{"animal":"Rat","element":"Water","polarity":"Yang","full_name":"Yang Water Rat","tagline":"Flowing intelligence, adaptive survival","start":"1972-02-15","end":"1973-02-02"},"1973":{"animal":"Ox","element":"Water","polarity":"Yin","full_name":"Yin Water Ox","tagline":"Deep endurance, fluid strength","start":"1973-02-03","end":"1974-01-22"},"1974":{"animal":"Tiger","element":"Wood","polarity":"Yang","full_name":"Yang Wood Tiger","tagline":"Growing power, expanding territory","start":"1974-01-23","end":"1975-02-10"},"1975":{"animal":"Rabbit","element":"Wood","polarity":"Yin","full_name":"Yin Wood Rabbit","tagline":"Gentle growth, nurturing expansion","start":"1975-02-11","end":"1976-01-30"},"1976":{"animal":"Dragon","element":"Fire","polarity":"Yang","full_name":"Yang Fire Dragon","tagline":"Blazing vision, transformative power","start":"1976-01-31","end":"1977-02-17"},"1977":{"animal":"Snake","element":"Fire","polarity":"Yin","full_name":"Yin Fire Snake","tagline":"Smoldering intensity, passionate wisdom","start":"1977-02-18","end":"1978-02-06"},"1978":{"animal":"Horse","element":"Earth","polarity":"Yang","full_name":"Yang Earth Horse","tagline":"Grounded freedom, stable movement","start":"1978-02-07","end":"1979-01-27"},"1979":{"animal":"Goat","element":"Earth","polarity":"Yin","full_name":"Yin Earth Goat","tagline":"Nurturing home, stable creativity","start":"1979-01-28","end":"1980-02-15"},"1980":{"animal":"Monkey","element":"Metal","polarity":"Yang","full_name":"Yang Metal Monkey","tagline":"Sharp wit, precise innovation","start":"1980-02-16","end":"1981-02-04"},"1981":{"animal":"Rooster","element":"Metal","polarity":"Yin","full_name":"Yin Metal Rooster","tagline":"Elegant precision, refined vigilance","start":"1981-02-05","end":"1982-01-24"},"1982":{"animal":"Dog","element":"Water","polarity":"Yang","full_name":"Yang Water Dog","tagline":"Flowing loyalty, adaptive protection","start":"1982-01-25","end":"1983-02-12"},"1983":{"animal":"Pig","element":"Water","polarity":"Yin","full_name":"Yin Water Pig","tagline":"Deep compassion, nurturing abundance","start":"1983-02-13","end":"1984-02-01"},"1984":{"animal":"Rat","element":"Wood","polarity":"Yang","full_name":"Yang Wood Rat","tagline":"Growing ambition, expanding cleverness","start":"1984-02-02","end":"1985-02-19"},"1985":{"animal":"Ox","element":"Wood","polarity":"Yin","full_name":"Yin Wood Ox","tagline":"Patient growth, organic strength","start":"1985-02-20","end":"1986-02-08"},"1986":{"animal":"Tiger","element":"Fire","polarity":"Yang","full_name":"Yang Fire Tiger","tagline":"Blazing, fearless, magnetic leadership","start":"1986-02-09","end":"1987-01-28"},"1987":{"animal":"Rabbit","element":"Fire","polarity":"Yin","full_name":"Yin Fire Rabbit","tagline":"Warm, intuitive, quietly transformative","start":"1987-01-29","end":"1988-02-16"},"1988":{"animal":"Dragon","element":"Earth","polarity":"Yang","full_name":"Yang Earth Dragon","tagline":"Unstoppable, grounded, empire-building force","start":"1988-02-17","end":"1989-02-05"},"1989":{"animal":"Snake","element":"Earth","polarity":"Yin","full_name":"Yin Earth Snake","tagline":"Deep, strategic, subtly transformative wisdom","start":"1989-02-06","end":"1990-01-26"},"1990":{"animal":"Horse","element":"Metal","polarity":"Yang","full_name":"Yang Metal Horse","tagline":"Swift, precise, unstoppable momentum","start":"1990-01-27","end":"1991-02-14"},"1991":{"animal":"Goat","element":"Metal","polarity":"Yin","full_name":"Yin Metal Goat","tagline":"Refined, resilient, quietly revolutionary","start":"1991-02-15","end":"1992-02-03"},"1992":{"animal":"Monkey","element":"Water","polarity":"Yang","full_name":"Yang Water Monkey","tagline":"Fluid, adaptive, ingeniously clever","start":"1992-02-04","end":"1993-01-22"},"1993":{"animal":"Rooster","element":"Water","polarity":"Yin","full_name":"Yin Water Rooster","tagline":"Perceptive, cleansing, truth-revealing","start":"1993-01-23","end":"1994-02-09"},"1994":{"animal":"Dog","element":"Wood","polarity":"Yang","full_name":"Yang Wood Dog","tagline":"Loyal, growing, protective leadership","start":"1994-02-10","end":"1995-01-30"},"1995":{"animal":"Pig","element":"Wood","polarity":"Yin","full_name":"Yin Wood Pig","tagline":"Nurturing, abundant, quietly generous","start":"1995-01-31","end":"1996-02-18"},"1996":{"animal":"Rat","element":"Fire","polarity":"Yang","full_name":"Yang Fire Rat","tagline":"Daring, quick, pioneering innovator","start":"1996-02-19","end":"1997-02-06"},"1997":{"animal":"Ox","element":"Fire","polarity":"Yin","full_name":"Yin Fire Ox","tagline":"Enduring, passionate, transformative worker","start":"1997-02-07","end":"1998-01-27"},"1998":{"animal":"Tiger","element":"Earth","polarity":"Yang","full_name":"Yang Earth Tiger","tagline":"Grounded, powerful, territorial leader","start":"1998-01-28","end":"1999-02-15"},"1999":{"animal":"Rabbit","element":"Earth","polarity":"Yin","full_name":"Yin Earth Rabbit","tagline":"Stable, gentle, home-building nurturer","start":"1999-02-16","end":"2000-02-04"},"2000":{"animal":"Dragon","element":"Metal","polarity":"Yang","full_name":"Yang Metal Dragon","tagline":"Invincible, sharp, destiny-forging","start":"2000-02-05","end":"2001-01-23"},"2001":{"animal":"Snake","element":"Metal","polarity":"Yin","full_name":"Yin Metal Snake","tagline":"Elegant, refined, strategically brilliant","start":"2001-01-24","end":"2002-02-11"},"2002":{"animal":"Horse","element":"Water","polarity":"Yang","full_name":"Yang Water Horse","tagline":"Free-flowing, unstoppable, boundary-breaking","start":"2002-02-12","end":"2003-01-31"},"2003":{"animal":"Goat","element":"Water","polarity":"Yin","full_name":"Yin Water Goat","tagline":"Flowing, compassionate, adaptively gentle","start":"2003-02-01","end":"2004-01-21"},"2004":{"animal":"Monkey","element":"Wood","polarity":"Yang","full_name":"Yang Wood Monkey","tagline":"Climbing, curious, playfully inventive","start":"2004-01-22","end":"2005-02-08"},"2005":{"animal":"Rooster","element":"Wood","polarity":"Yin","full_name":"Yin Wood Rooster","tagline":"Detail-focused, organic, patiently perfecting","start":"2005-02-09","end":"2006-01-28"},"2006":{"animal":"Dog","element":"Fire","polarity":"Yang","full_name":"Yang Fire Dog","tagline":"Passionate, protective, justice-seeking","start":"2006-01-29","end":"2007-02-17"},"2007":{"animal":"Pig","element":"Fire","polarity":"Yin","full_name":"Yin Fire Pig","tagline":"Warm-hearted, glowing, generously welcoming","start":"2007-02-18","end":"2008-02-06"},"2008":{"animal":"Rat","element":"Earth","polarity":"Yang","full_name":"Yang Earth Rat","tagline":"Resourceful, grounding, community-building","start":"2008-02-07","end":"2009-01-25"},"2009":{"animal":"Ox","element":"Earth","polarity":"Yin","full_name":"Yin Earth Ox","tagline":"Patient, fertile, deeply nurturing","start":"2009-01-26","end":"2010-02-13"},"2010":{"animal":"Tiger","element":"Metal","polarity":"Yang","full_name":"Yang Metal Tiger","tagline":"Fierce, disciplined, conquest-driven","start":"2010-02-14","end":"2011-02-02"},"2011":{"animal":"Rabbit","element":"Metal","polarity":"Yin","full_name":"Yin Metal Rabbit","tagline":"Graceful, strong, elegantly resilient","start":"2011-02-03","end":"2012-01-22"},"2012":{"animal":"Dragon","element":"Water","polarity":"Yang","full_name":"Yang Water Dragon","tagline":"Flowing power, oceanic ambition","start":"2012-01-23","end":"2013-02-09"},"2013":{"animal":"Snake","element":"Water","polarity":"Yin","full_name":"Yin Water Snake","tagline":"Deep, intuitive, mysteriously wise","start":"2013-02-10","end":"2014-01-30"},"2014":{"animal":"Horse","element":"Wood","polarity":"Yang","full_name":"Yang Wood Horse","tagline":"Expansive, free-spirited, boundary-pushing","start":"2014-01-31","end":"2015-02-18"},"2015":{"animal":"Goat","element":"Wood","polarity":"Yin","full_name":"Yin Wood Goat","tagline":"Artistically nurturing, creatively gentle","start":"2015-02-19","end":"2016-02-07"},"2016":{"animal":"Monkey","element":"Fire","polarity":"Yang","full_name":"Yang Fire Monkey","tagline":"Blazing wit, explosive creativity","start":"2016-02-08","end":"2017-01-27"},"2017":{"animal":"Rooster","element":"Fire","polarity":"Yin","full_name":"Yin Fire Rooster","tagline":"Precise, passionate, dawn-announcing","start":"2017-01-28","end":"2018-02-15"},"2018":{"animal":"Dog","element":"Earth","polarity":"Yang","full_name":"Yang Earth Dog","tagline":"Loyal, grounding, community-protecting","start":"2018-02-16","end":"2019-02-04"},"2019":{"animal":"Pig","element":"Earth","polarity":"Yin","full_name":"Yin Earth Pig","tagline":"Nurturing, abundant, home-creating","start":"2019-02-05","end":"2020-01-24"},"2020":{"animal":"Rat","element":"Metal","polarity":"Yang","full_name":"Yang Metal Rat","tagline":"Sharp, resourceful, strategically clever","start":"2020-01-25","end":"2021-02-11"},"2021":{"animal":"Ox","element":"Metal","polarity":"Yin","full_name":"Yin Metal Ox","tagline":"Refined strength, elegant endurance","start":"2021-02-12","end":"2022-01-31"},"2022":{"animal":"Tiger","element":"Water","polarity":"Yang","full_name":"Yang Water Tiger","tagline":"Flowing power, adaptive ferocity","start":"2022-02-01","end":"2023-01-21"},"2023":{"animal":"Rabbit","element":"Water","polarity":"Yin","full_name":"Yin Water Rabbit","tagline":"Gentle depth, intuitive flow","start":"2023-01-22","end":"2024-02-09"},"2024":{"animal":"Dragon","element":"Wood","polarity":"Yang","full_name":"Yang Wood Dragon","tagline":"Growing empire, expanding vision","start":"2024-02-10","end":"2025-01-28"},"2025":{"animal":"Snake","element":"Wood","polarity":"Yin","full_name":"Yin Wood Snake","tagline":"Subtle growth, organic wisdom","start":"2025-01-29","end":"2026-02-16"},"2026":{"animal":"Horse","element":"Fire","polarity":"Yang","full_name":"Yang Fire Horse","tagline":"Blazing speed, unstoppable passion","start":"2026-02-17","end":"2027-02-05"},"2027":{"animal":"Goat","element":"Fire","polarity":"Yin","full_name":"Yin Fire Goat","tagline":"Creative warmth, artistic passion","start":"2027-02-06","end":"2028-01-25"},"2028":{"animal":"Monkey","element":"Earth","polarity":"Yang","full_name":"Yang Earth Monkey","tagline":"Grounded cleverness, practical innovation","start":"2028-01-26","end":"2029-02-12"},"2029":{"animal":"Rooster","element":"Earth","polarity":"Yin","full_name":"Yin Earth Rooster","tagline":"Nurturing precision, detailed care","start":"2029-02-13","end":"2030-02-02"},"2030":{"animal":"Dog","element":"Metal","polarity":"Yang","full_name":"Yang Metal Dog","tagline":"Sharp loyalty, protective strength","start":"2030-02-03","end":"2031-01-22"},"2031":{"animal":"Pig","element":"Metal","polarity":"Yin","full_name":"Yin Metal Pig","tagline":"Refined generosity, elegant abundance","start":"2031-01-23","end":"2032-02-10"},"2032":{"animal":"Rat","element":"Water","polarity":"Yang","full_name":"Yang Water Rat","tagline":"Flowing intelligence, adaptive survival","start":"2032-02-11","end":"2033-01-30"},"2033":{"animal":"Ox","element":"Water","polarity":"Yin","full_name":"Yin Water Ox","tagline":"Deep endurance, fluid strength","start":"2033-01-31","end":"2034-02-18"},"2034":{"animal":"Tiger","element":"Wood","polarity":"Yang","full_name":"Yang Wood Tiger","tagline":"Courageous, expansive, territory-growing","start":"2034-02-19","end":"2035-02-07"},"2035":{"animal":"Rabbit","element":"Wood","polarity":"Yin","full_name":"Yin Wood Rabbit","tagline":"Gentle, creative, harmony-growing","start":"2035-02-08","end":"2036-01-27"},"2036":{"animal":"Dragon","element":"Fire","polarity":"Yang","full_name":"Yang Fire Dragon","tagline":"Charismatic, visionary, world-igniting","start":"2036-01-28","end":"2037-02-14"},"2037":{"animal":"Snake","element":"Fire","polarity":"Yin","full_name":"Yin Fire Snake","tagline":"Seductive, transformative, passion-guided","start":"2037-02-15","end":"2038-02-03"},"2038":{"animal":"Horse","element":"Earth","polarity":"Yang","full_name":"Yang Earth Horse","tagline":"Reliable, powerful, distance-covering","start":"2038-02-04","end":"2039-01-23"},"2039":{"animal":"Goat","element":"Earth","polarity":"Yin","full_name":"Yin Earth Goat","tagline":"Nurturing, stable, community-anchoring","start":"2039-01-24","end":"2040-02-11"},"2040":{"animal":"Monkey","element":"Metal","polarity":"Yang","full_name":"Yang Metal Monkey","tagline":"Inventive, precise, tool-mastering","start":"2040-02-12","end":"2041-01-31"}};
    
    // Define fallback function
    window.findChineseZodiac = function(year, month, day) {
        const birthDate = new Date(year, month - 1, day);
        
        for (const [yr, zodiac] of Object.entries(ZODIAC_COMPACT)) {
            const startParts = zodiac.start.split('-');
            const endParts = zodiac.end.split('-');
            
            const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
            const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));
            
            if (birthDate >= startDate && birthDate <= endDate) {
                return {
                    Year: parseInt(yr),
                    Animal: zodiac.animal,
                    Element: zodiac.element,
                    Polarity: zodiac.polarity,
                    Full_Name: zodiac.full_name,
                    Tagline: zodiac.tagline,
                    Description: `The ${zodiac.full_name} embodies ${zodiac.tagline.toLowerCase()} characteristics.`
                };
            }
        }
        
        return null;
    };
    
    console.log('✅ Compact fallback zodiac lookup loaded (116 years, 1925-2040)');
}

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
    
    // Parse date in local time to avoid timezone issues
    const [yearStr, monthStr, dayStr] = profile.birthDate.split('-');
    const birthDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
    
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
            // Format coordinates if available
            let coordinatesHTML = '';
            if (profile.latitude && profile.longitude) {
                const latDir = profile.latitude >= 0 ? 'N' : 'S';
                const lonDir = profile.longitude >= 0 ? 'E' : 'W';
                const latStr = `${Math.abs(profile.latitude).toFixed(4)}° ${latDir}`;
                const lonStr = `${Math.abs(profile.longitude).toFixed(4)}° ${lonDir}`;
                
                coordinatesHTML = `
                <div class="info-row">
                    <span class="info-label">Coordinates:</span>
                    <span class="info-value">${latStr}, ${lonStr}</span>
                </div>`;
            }
            
            // Format timezone if available
            let timezoneHTML = '';
            if (profile.timezone) {
                timezoneHTML = `
                <div class="info-row">
                    <span class="info-label">Timezone:</span>
                    <span class="info-value">${profile.timezone}</span>
                </div>`;
            }
            
            // Format gender if available
            let genderHTML = '';
            if (profile.gender) {
                genderHTML = `
                <div class="info-row">
                    <span class="info-label">Sex:</span>
                    <span class="info-value">${profile.gender}</span>
                </div>`;
            }
            
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
                ${genderHTML}
                ${coordinatesHTML}
                ${timezoneHTML}
                <div class="info-row">
                    <span class="info-label">Age:</span>
                    <span class="info-value" id="ageDisplay">Calculating...</span>
                </div>
            `;
            console.log('✅ Birth info panel updated (with coordinates & timezone)');
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

function calculateAndDisplay(profile) {
    // Create a proper local date to avoid timezone issues
    const [yearStr, monthStr, dayStr] = profile.birthDate.split('-');
    const localBirthDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
    
    // Extract values from LOCAL date (not UTC)
    const year = localBirthDate.getFullYear();
    const month = localBirthDate.getMonth() + 1;
    const day = localBirthDate.getDate();
    
    console.log('🔮 Calculating with:');
    console.log('  Year:', year);
    console.log('  Month:', month);
    console.log('  Day:', day);
    console.log('  Hour (24h):', profile.birthHour24);
    console.log('  Local birth date:', localBirthDate.toString());
    console.log('  Day of week check:', localBirthDate.getDay(), ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][localBirthDate.getDay()]);
    
    // Calculate Chinese Zodiac (pass month and day for accurate CNY calculation)
    calculateChineseZodiac(year, month, day);
    
    // Calculate Western Zodiac
    calculateWesternZodiac(month, day);
    
    // Calculate Numerology
    calculateNumerology(profile.firstName, profile.lastName, localBirthDate);
    
    // Calculate Yin/Yang Energy
    calculateYinYang(localBirthDate, profile.birthHour24);
    
    // Calculate Day of Week - use local date
    calculateDayOfWeek(localBirthDate);
    
    console.log('✨ All calculations complete!');
}

function calculateChineseZodiac(year, month, day) {
    console.log(`🐉 Calculating Chinese Zodiac for ${year}-${month}-${day}`);
    
    // Check if data is available
    if (typeof findChineseZodiac === 'undefined') {
        console.error('❌ findChineseZodiac function not available!');
        console.error('   chinese-zodiac-data.js may not have loaded');
        
        // Show error in UI
        const panel = document.querySelector('.chinese-panel');
        if (panel) {
            const zodiacDisplay = panel.querySelector('.zodiac-display');
            if (zodiacDisplay) {
                zodiacDisplay.innerHTML = `
                    <p style="color: #ef4444; text-align: center;">
                        ⚠️ Error loading zodiac data<br>
                        <small>Please refresh the page</small>
                    </p>
                `;
            }
        }
        return;
    }
    
    // Use the comprehensive 60-year cycle data
    const zodiac = findChineseZodiac(year, month, day);
    
    if (!zodiac) {
        console.error('❌ No zodiac data found for this date');
        return;
    }
    
    console.log(`  Full Name: ${zodiac.Full_Name}`);
    console.log(`  Polarity: ${zodiac.Polarity}`);
    console.log(`  Element: ${zodiac.Element}`);
    console.log(`  Animal: ${zodiac.Animal}`);
    
    // Update the Chinese Zodiac panel with rich data
    const panel = document.querySelector('.chinese-panel');
    if (panel) {
        const zodiacDisplay = panel.querySelector('.zodiac-display');
        
        // Create new HTML structure with polarity + element + animal
        if (zodiacDisplay) {
            zodiacDisplay.innerHTML = `
                <div class="zodiac-badges">
                    <span class="polarity-badge ${zodiac.Polarity.toLowerCase()}">${zodiac.Polarity.toUpperCase()}</span>
                    <span class="element-badge ${zodiac.Element.toLowerCase()}">${zodiac.Element.toUpperCase()}</span>
                </div>
                <div class="zodiac-animal">
                    <span class="animal-icon">${getAnimalEmoji(zodiac.Animal)}</span>
                    <span class="animal-name">${zodiac.Animal.toUpperCase()}</span>
                </div>
                <p class="zodiac-tagline">${zodiac.Tagline}</p>
            `;
        }
        
        // Update description
        const desc = panel.querySelector('.panel-description');
        if (desc) {
            // Use first 300 characters for panel, full text in "Learn More"
            const shortDesc = zodiac.Description.substring(0, 300) + '...';
            desc.textContent = shortDesc;
        }
        
        // Store full data for "Learn More" modal
        panel.dataset.fullDescription = zodiac.Description;
        panel.dataset.tagline = zodiac.Tagline;
    }
}

// Helper function to get animal emoji
function getAnimalEmoji(animal) {
    const emojiMap = {
        'Rat': '🐀',
        'Ox': '🐂',
        'Tiger': '🐅',
        'Rabbit': '🐇',
        'Dragon': '🐉',
        'Snake': '🐍',
        'Horse': '🐴',
        'Goat': '🐐',
        'Monkey': '🐵',
        'Rooster': '🐓',
        'Dog': '🐕',
        'Pig': '🐖'
    };
    return emojiMap[animal] || '✨';
}

function calculateWesternZodiac(month, day) {
    const signs = [
        { name: 'Capricorn', dates: [[12, 22], [1, 19]], element: 'Earth', symbol: '♑' },
        { name: 'Aquarius', dates: [[1, 20], [2, 18]], element: 'Air', symbol: '♒' },
        { name: 'Pisces', dates: [[2, 19], [3, 20]], element: 'Water', symbol: '♓' },
        { name: 'Aries', dates: [[3, 21], [4, 19]], element: 'Fire', symbol: '♈' },
        { name: 'Taurus', dates: [[4, 20], [5, 20]], element: 'Earth', symbol: '♉' },
        { name: 'Gemini', dates: [[5, 21], [6, 20]], element: 'Air', symbol: '♊' },
        { name: 'Cancer', dates: [[6, 21], [7, 22]], element: 'Water', symbol: '♋' },
        { name: 'Leo', dates: [[7, 23], [8, 22]], element: 'Fire', symbol: '♌' },
        { name: 'Virgo', dates: [[8, 23], [9, 22]], element: 'Earth', symbol: '♍' },
        { name: 'Libra', dates: [[9, 23], [10, 22]], element: 'Air', symbol: '♎' },
        { name: 'Scorpio', dates: [[10, 23], [11, 21]], element: 'Water', symbol: '♏' },
        { name: 'Sagittarius', dates: [[11, 22], [12, 21]], element: 'Fire', symbol: '♐' }
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
        const icon = panel.querySelector('.western-zodiac-icon');
        const h3 = panel.querySelector('h3');
        const badge = panel.querySelector('.element-badge');
        const desc = panel.querySelector('.panel-description');
        
        if (icon) icon.textContent = currentSign.symbol;
        if (h3) h3.textContent = currentSign.name.toUpperCase();
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
        const circles = panel.querySelectorAll('.circle');
        const desc = panel.querySelector('.panel-description');
        
        if (circles[0]) circles[0].textContent = lifePathSum;
        if (circles[1]) circles[1].textContent = expressionNumber;
        if (circles[2]) circles[2].textContent = soulUrge;
        if (circles[3]) circles[3].textContent = personality;
        
        if (desc) desc.textContent = `Life Path ${lifePathSum} ${descriptions[lifePathSum]}. Expression ${expressionNumber} ${descriptions[expressionNumber]}, while Soul Urge ${soulUrge} ${descriptions[soulUrge]}.`;
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
    
    console.log(`  Yin/Yang: ${yinPercentage}% Yin / ${yangPercentage}% Yang`);
    
    const panel = document.querySelector('.yinyang-panel');
    if (panel) {
        const yinBar = panel.querySelector('.yin-bar');
        const yangBar = panel.querySelector('.yang-bar');
        const yinText = panel.querySelector('.yin-text');
        const yangText = panel.querySelector('.yang-text');
        
        // Use flex instead of width for proper sizing
        if (yinBar) {
            yinBar.style.flex = `0 0 ${yinPercentage}%`;
            yinBar.style.width = `${yinPercentage}%`;
        }
        if (yangBar) {
            yangBar.style.flex = `0 0 ${yangPercentage}%`;
            yangBar.style.width = `${yangPercentage}%`;
        }
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
