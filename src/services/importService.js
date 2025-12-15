/**
 * importService.js - Handle bulk import of people data
 * Supports JSON and CSV formats
 * Batch writes to Firestore for efficiency
 *
 * Part of GENESIS Dashboard 1 - Import Feature
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import { collection, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import historicalGeniusesData from '../data/historicalGeniuses.json';

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Derive Western zodiac element from sign
// ═══════════════════════════════════════════════════════════════════════════
const WESTERN_SIGN_ELEMENTS = {
  'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
  'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
  'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
  'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
};

const WESTERN_SIGN_YINYANG = {
  'Aries': 'Yang', 'Gemini': 'Yang', 'Leo': 'Yang', 'Libra': 'Yang', 'Sagittarius': 'Yang', 'Aquarius': 'Yang',
  'Taurus': 'Yin', 'Cancer': 'Yin', 'Virgo': 'Yin', 'Scorpio': 'Yin', 'Capricorn': 'Yin', 'Pisces': 'Yin'
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Derive Chinese animal Yin/Yang
// ═══════════════════════════════════════════════════════════════════════════
const ANIMAL_YINYANG = {
  'Rat': 'Yang', 'Tiger': 'Yang', 'Dragon': 'Yang', 'Horse': 'Yang', 'Monkey': 'Yang', 'Dog': 'Yang',
  'Ox': 'Yin', 'Rabbit': 'Yin', 'Snake': 'Yin', 'Goat': 'Yin', 'Rooster': 'Yin', 'Pig': 'Yin'
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Parse lifespan to calculate age at death
// ═══════════════════════════════════════════════════════════════════════════
function parseLifeSpan(lifeSpan) {
  if (!lifeSpan) return null;
  const match = lifeSpan.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (match) {
    const birthYear = parseInt(match[1]);
    const deathYear = parseInt(match[2]);
    return {
      years: deathYear - birthYear,
      display: `Lived ${deathYear - birthYear} years (${lifeSpan})`,
      birthYear,
      deathYear,
      isHistorical: true
    };
  }
  return { years: null, display: lifeSpan, isHistorical: true };
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Build complete calculations object for imported profiles
// ═══════════════════════════════════════════════════════════════════════════
function buildCalculationsObject(person) {
  const sunSign = person.sunSign || '';
  const sunElement = person.sunElement || WESTERN_SIGN_ELEMENTS[sunSign] || '';
  const chineseAnimal = person.chineseAnimal || '';
  const chineseElement = person.dominantElement || '';
  const ageData = parseLifeSpan(person.lifeSpan);

  return {
    // Chinese Zodiac - Full structure matching getChineseZodiac() output
    chinese: {
      animal: chineseAnimal,
      element: chineseElement,
      fullSign: chineseElement && chineseAnimal ? `${chineseElement} ${chineseAnimal}` : chineseAnimal,
      animalYinYang: ANIMAL_YINYANG[chineseAnimal] || '',
      // Historical figures don't have Li Chun calculations
      bornBeforeLiChun: false,
      isHistorical: true
    },

    // Western Zodiac - Full structure
    western: {
      sign: sunSign,
      element: sunElement,
      yinYang: WESTERN_SIGN_YINYANG[sunSign] || ''
    },

    // Age data - Special handling for historical figures
    age: ageData || {
      years: null,
      display: 'Historical Figure',
      isHistorical: true
    },

    // Day of week (not calculable for ancient dates)
    dayOfWeek: {
      name: '',
      ruler: '',
      isHistorical: true
    },

    // Numerology (requires valid date, skip for historical)
    numerology: {
      lifePath: person.lifePathNumber || null,
      isHistorical: true
    },

    // Yin/Yang balance (pre-calculated if we have enough data)
    yinYang: {
      balance: 'Unknown',
      isHistorical: true
    },

    // Mark as historical - panels can check this to skip calculations
    isHistorical: true
  };
}

/**
 * Import historical geniuses dataset
 * @param {Function} onProgress - Callback for progress updates (current, total, name)
 * @returns {Promise<Object>} - Import results {imported, skipped, errors}
 */
export async function importHistoricalGeniuses(onProgress) {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error('User must be logged in to import data');
  }

  const people = historicalGeniusesData.people;
  const results = {
    imported: 0,
    skipped: 0,
    errors: 0,
    errorDetails: []
  };

  // Get existing people to check for duplicates
  const existingNames = await getExistingNames(userId);

  // Process in batches of 10 (Firestore limit is 500 but we'll be conservative)
  const batchSize = 10;
  let totalProcessed = 0;

  for (let i = 0; i < people.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchPeople = people.slice(i, i + batchSize);
    let batchImportCount = 0;

    for (const person of batchPeople) {
      totalProcessed++;

      // Update progress
      if (onProgress) {
        onProgress(totalProcessed, people.length, person.fullName);
      }

      // Check for duplicate
      if (existingNames.has(person.fullName.toLowerCase())) {
        results.skipped++;
        continue;
      }

      try {
        // Create document reference
        const docRef = doc(collection(db, 'profiles'));

        // Build complete calculations object (prevents crash in Results.jsx)
        const calculations = buildCalculationsObject(person);

        // Prepare profile data matching existing schema
        const profileData = {
          // User info
          userId: userId,

          // Basic info - match existing profile schema
          displayName: person.fullName,
          firstName: person.fullName.split(' ')[0],
          lastName: person.fullName.split(' ').slice(1).join(' '),
          nickname: person.nickname || '',
          gender: person.gender || '',

          // Birth data
          birthDate: person.birthDate,
          birthTime: person.birthTime || '',
          location: {
            fullAddress: person.birthPlace || '',
            coordinates: person.birthCoordinates || ''
          },

          // Chinese Zodiac data (for usePeople mapping)
          chineseZodiac: {
            animal: person.chineseAnimal || '',
            element: person.dominantElement || '',
            fullSign: calculations.chinese.fullSign
          },

          // ⭐ COMPLETE CALCULATIONS OBJECT - Results.jsx expects this!
          calculations: calculations,

          // Psychology
          mbti: person.mbtiType || '',

          // Relationship
          relationshipType: person.relationshipType || 'Historical Figure',

          // Priority & Tags
          priority: person.priority ?? 2,
          tags: person.tags || [],

          // Notes
          notes: person.notes || '',

          // Extra metadata for historical figures
          lifeSpan: person.lifeSpan || '',
          nationality: person.nationality || '',

          // Timestamps
          createdAt: new Date(),
          updatedAt: new Date(),
          lastViewedAt: new Date(),

          // Required flags for ProfileContext query
          isArchived: false,
          isFavorite: false,

          // Mark as imported
          imported: true,
          importSource: 'Historical Geniuses v1.0',
          isHistorical: true
        };

        // Add to batch
        batch.set(docRef, profileData);
        batchImportCount++;

      } catch (error) {
        console.error(`Error preparing ${person.fullName}:`, error);
        results.errors++;
        results.errorDetails.push({
          name: person.fullName,
          error: error.message
        });
      }
    }

    // Commit batch if there are items to import
    if (batchImportCount > 0) {
      try {
        await batch.commit();
        results.imported += batchImportCount;
      } catch (error) {
        console.error('Batch commit error:', error);
        results.errors += batchImportCount;
        results.errorDetails.push({
          batch: `Batch ${Math.floor(i / batchSize) + 1}`,
          error: error.message
        });
      }
    }

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < people.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Get existing people names for duplicate checking
 * @param {string} userId - Current user ID
 * @returns {Promise<Set>} - Set of lowercase names
 */
async function getExistingNames(userId) {
  const existingNames = new Set();

  try {
    const profilesRef = collection(db, 'profiles');
    const q = query(profilesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      const name = data.displayName || data.name || data.fullName;
      if (name) {
        existingNames.add(name.toLowerCase());
      }
    });
  } catch (error) {
    console.error('Error fetching existing names:', error);
  }

  return existingNames;
}

/**
 * Import from uploaded JSON file
 * @param {File} file - Uploaded JSON file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Import results
 */
export async function importFromJSON(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate structure
        if (!data.people || !Array.isArray(data.people)) {
          throw new Error('Invalid JSON format: missing "people" array');
        }

        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error('User must be logged in');
        }

        const results = await importPeopleArray(data.people, userId, onProgress);
        resolve(results);

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Import from uploaded CSV file
 * @param {File} file - Uploaded CSV file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Import results
 */
export async function importFromCSV(file, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const people = parseCSV(text);

        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error('User must be logged in');
        }

        const results = await importPeopleArray(people, userId, onProgress);
        resolve(results);

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Parse CSV text to people array
 * @param {string} text - CSV text
 * @returns {Array} - Array of people objects
 */
function parseCSV(text) {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV must have header and at least one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const people = [];

  for (let i = 1; i < lines.length; i++) {
    // Handle quoted values with commas inside
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const person = {};
    headers.forEach((header, index) => {
      person[header] = values[index] || '';
    });

    if (person.fullName || person.name) {
      people.push(person);
    }
  }

  return people;
}

/**
 * Generic import function for any people array
 * @param {Array} people - Array of people objects
 * @param {string} userId - User ID
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Import results
 */
async function importPeopleArray(people, userId, onProgress) {
  const results = {
    imported: 0,
    skipped: 0,
    errors: 0,
    errorDetails: []
  };

  const existingNames = await getExistingNames(userId);

  const batchSize = 10;
  let totalProcessed = 0;

  for (let i = 0; i < people.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchPeople = people.slice(i, i + batchSize);
    let batchImportCount = 0;

    for (const person of batchPeople) {
      totalProcessed++;
      const fullName = person.fullName || person.name;

      if (onProgress) {
        onProgress(totalProcessed, people.length, fullName);
      }

      if (!fullName) {
        results.errors++;
        continue;
      }

      if (existingNames.has(fullName.toLowerCase())) {
        results.skipped++;
        continue;
      }

      try {
        const docRef = doc(collection(db, 'profiles'));

        // Build complete calculations object for custom imports too
        const calculations = buildCalculationsObject({
          sunSign: person.sunSign || person.westernSign || '',
          sunElement: person.sunElement || '',
          chineseAnimal: person.chineseAnimal || '',
          dominantElement: person.dominantElement || person.element || '',
          lifeSpan: person.lifeSpan || '',
          lifePathNumber: person.lifePathNumber || null
        });

        const profileData = {
          userId: userId,
          displayName: fullName,
          firstName: fullName.split(' ')[0],
          lastName: fullName.split(' ').slice(1).join(' '),
          nickname: person.nickname || '',
          gender: person.gender || '',
          birthDate: person.birthDate || '',
          birthTime: person.birthTime || '',
          location: {
            fullAddress: person.birthPlace || person.birthLocation || '',
            coordinates: person.birthCoordinates || ''
          },
          chineseZodiac: {
            animal: person.chineseAnimal || '',
            element: person.dominantElement || person.element || '',
            fullSign: calculations.chinese.fullSign
          },
          // ⭐ COMPLETE CALCULATIONS OBJECT
          calculations: calculations,
          mbti: person.mbtiType || person.mbti || '',
          relationshipType: person.relationshipType || person.relationship || 'family',
          priority: person.priority ?? 0,
          tags: Array.isArray(person.tags) ? person.tags :
            (person.tags ? person.tags.split(',').map(t => t.trim()) : []),
          notes: person.notes || '',
          lifeSpan: person.lifeSpan || '',
          nationality: person.nationality || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastViewedAt: new Date(),
          isArchived: false,
          isFavorite: false,
          imported: true,
          isHistorical: !!person.lifeSpan // Mark as historical if lifeSpan provided
        };

        batch.set(docRef, profileData);
        batchImportCount++;

      } catch (error) {
        results.errors++;
        results.errorDetails.push({
          name: fullName,
          error: error.message
        });
      }
    }

    if (batchImportCount > 0) {
      try {
        await batch.commit();
        results.imported += batchImportCount;
      } catch (error) {
        console.error('Batch commit error:', error);
        results.errors += batchImportCount;
      }
    }

    if (i + batchSize < people.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Fix existing imported profiles - adds complete calculations object AND restores tags
 * Run this to update existing imports with full data needed for Results.jsx
 */
export async function fixImportedProfiles() {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error('User must be logged in');
  }

  // Build a lookup map from the original dataset for restoring tags/notes
  const originalDataMap = new Map();
  historicalGeniusesData.people.forEach(person => {
    originalDataMap.set(person.fullName.toLowerCase(), person);
  });

  const profilesRef = collection(db, 'profiles');
  const q = query(profilesRef, where('userId', '==', userId), where('imported', '==', true));
  const querySnapshot = await getDocs(q);

  let fixed = 0;
  const batch = writeBatch(db);

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const displayName = data.displayName || '';

    // Try to find original data from the dataset
    const originalPerson = originalDataMap.get(displayName.toLowerCase());

    // ALWAYS fix if we have original data - force restore all missing fields
    if (originalPerson) {
      // Reconstruct person object from stored data + original
      const person = {
        sunSign: data.calculations?.western?.sign || originalPerson?.sunSign || '',
        sunElement: data.calculations?.western?.element || originalPerson?.sunElement || '',
        chineseAnimal: data.chineseZodiac?.animal || originalPerson?.chineseAnimal || '',
        dominantElement: data.chineseZodiac?.element || originalPerson?.dominantElement || '',
        lifeSpan: data.lifeSpan || originalPerson?.lifeSpan || '',
        lifePathNumber: data.calculations?.numerology?.lifePath || null
      };

      // Build complete calculations object
      const calculations = buildCalculationsObject(person);

      // Prepare update object
      const updateData = {
        isArchived: false,
        isFavorite: data.isFavorite ?? false,
        isHistorical: true,
        calculations: calculations,
        chineseZodiac: {
          animal: person.chineseAnimal,
          element: person.dominantElement,
          fullSign: calculations.chinese.fullSign
        }
      };

      // FORCE restore tags from original dataset
      if (originalPerson.tags && originalPerson.tags.length > 0) {
        updateData.tags = originalPerson.tags;
      }

      // FORCE restore notes from original dataset
      if (originalPerson.notes) {
        updateData.notes = originalPerson.notes;
      }

      // FORCE restore nickname from original dataset
      if (originalPerson.nickname) {
        updateData.nickname = originalPerson.nickname;
      }

      // FORCE restore birthTime from original dataset (for BaZi calculations)
      if (originalPerson.birthTime) {
        updateData.birthTime = originalPerson.birthTime;
      }

      // FORCE restore birthDate from original dataset
      if (originalPerson.birthDate) {
        updateData.birthDate = originalPerson.birthDate;
      }

      // FORCE restore firstName/lastName from original dataset
      if (originalPerson.fullName) {
        const nameParts = originalPerson.fullName.split(' ');
        updateData.firstName = nameParts[0];
        updateData.lastName = nameParts.slice(1).join(' ');
      }

      // FORCE restore gender from original dataset
      if (originalPerson.gender) {
        updateData.gender = originalPerson.gender;
      }

      batch.update(docSnap.ref, updateData);
      fixed++;
    }
  });

  if (fixed > 0) {
    await batch.commit();
  }

  return { fixed, total: querySnapshot.size };
}

export default {
  importHistoricalGeniuses,
  importFromJSON,
  importFromCSV,
  fixImportedProfiles
};
