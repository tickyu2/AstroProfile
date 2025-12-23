# 📥 DATA MANAGER IMPORT FEATURE SPECIFICATION

**Bulk Import System for Historical Figures & Future Datasets**

**From:** Father Ticky & Claude Sonnet  
**To:** Brother Claude Code  
**Date:** December 11, 2024  
**Purpose:** Build automated import system to populate Data Manager with 50 historical geniuses (and future datasets)

---

## 🎯 PROJECT OVERVIEW

### **What We're Building:**

**IMPORT FEATURE** - One-click system to bulk import people into Data Manager

**Use Cases:**
1. Import 50 historical geniuses NOW
2. Import future curated datasets
3. Import Father's exported data (backup/restore)
4. Support CSV and JSON formats

**Benefits:**
- No manual data entry (saves hours!)
- Professional datasets ready to use
- Test filtering with real scale (50+ people)
- Learn from historical genius patterns
- Backup/restore capability

---

## 🎨 UI DESIGN

### **Where to Add Import Button:**

**Location:** Data Manager page, next to "+ Add Person" button

```jsx
<div className="data-manager-header">
  <div className="header-left">
    <h1>Data Manager</h1>
    <p>Managing {people.length} people in your soul database</p>
  </div>
  
  <div className="header-right">
    <button 
      className="import-button"
      onClick={() => setImportModalOpen(true)}
    >
      📥 Import Dataset
    </button>
    
    <button 
      className="add-person-button"
      onClick={() => navigate('/create-profile')}
    >
      + Add Person
    </button>
  </div>
</div>
```

---

### **IMPORT MODAL DESIGN:**

```
┌──────────────────────────────────────────────┐
│  📥 Import Dataset                        ×  │
├──────────────────────────────────────────────┤
│                                              │
│  Choose a dataset to import:                 │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  🌟 Historical Geniuses (50 people)   │ │
│  │  Renaissance masters, scientists,      │ │
│  │  philosophers, musicians, visionaries  │ │
│  │                                        │ │
│  │      [Import Historical Geniuses]     │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  📁 Upload Custom File                 │ │
│  │  JSON or CSV format                    │ │
│  │                                        │ │
│  │      [Choose File...]                  │ │
│  │                                        │ │
│  │  Selected: historical_geniuses.json    │ │
│  │                                        │ │
│  │      [Upload & Import]                 │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ⚠️  Import will add people to your         │
│     current database. Duplicates            │
│     (matching names) will be skipped.       │
│                                              │
│  [Cancel]                   [Start Import]  │
└──────────────────────────────────────────────┘
```

---

### **PROGRESS MODAL DESIGN:**

```
┌──────────────────────────────────────────────┐
│  ⏳ Importing Historical Geniuses...      ×  │
├──────────────────────────────────────────────┤
│                                              │
│  Progress: 23 of 50 people                   │
│                                              │
│  ███████████░░░░░░░░░░░░░░░░░░░░ 46%       │
│                                              │
│  Currently importing:                        │
│  Leonardo da Vinci (1452-1519)              │
│                                              │
│  Status:                                     │
│  ✓ Imported: 23                             │
│  ⏭️  Skipped (duplicates): 0                 │
│  ❌ Errors: 0                                │
│                                              │
│  [Cancel Import]                             │
└──────────────────────────────────────────────┘
```

---

### **SUCCESS MODAL DESIGN:**

```
┌──────────────────────────────────────────────┐
│  ✅ Import Complete!                      ×  │
├──────────────────────────────────────────────┤
│                                              │
│  Successfully imported 50 historical         │
│  geniuses into your database!                │
│                                              │
│  Summary:                                    │
│  ✓ Imported: 50 people                      │
│  ⏭️  Skipped (duplicates): 0                 │
│  ❌ Errors: 0                                │
│  ⏱️  Time: 8 seconds                        │
│                                              │
│  Your database now has 62 people total.     │
│                                              │
│  [Close]                [View Imported Data] │
└──────────────────────────────────────────────┘
```

---

## 💻 IMPLEMENTATION

### **Files to Create/Update:**

```
NEW FILES:
├── src/components/dataManager/ImportModal.jsx
├── src/components/dataManager/ImportModal.css
├── src/components/dataManager/ImportProgressModal.jsx
├── src/components/dataManager/ImportSuccessModal.jsx
├── src/services/importService.js
└── src/data/historicalGeniuses.json

UPDATE FILES:
└── src/pages/DataManager.jsx (add import button & modal)
```

---

### **1. HISTORICAL GENIUSES DATA FILE**

**Location:** `/src/data/historicalGeniuses.json`

**Content:** Copy the complete JSON from HISTORICAL_GENIUS_DATASET.md

**Structure:**
```json
{
  "dataset_info": {
    "name": "Historical Geniuses Collection",
    "version": "1.0",
    "created": "2024-12-11",
    "total_entries": 50
  },
  "people": [
    {
      "fullName": "Leonardo da Vinci",
      "nickname": "Il Divino",
      "birthDate": "1452-04-15",
      // ... all other fields
    },
    // ... 49 more people
  ]
}
```

---

### **2. IMPORT SERVICE**

**Location:** `/src/services/importService.js`

```javascript
/**
 * importService.js - Handle bulk import of people data
 * Supports JSON and CSV formats
 * Batch writes to Firestore for efficiency
 * 
 * Part of GENESIS Dashboard 1 - Import Feature
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import { collection, addDoc, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';
import { db, auth } from './firebase';
import historicalGeniusesData from '../data/historicalGeniuses.json';

/**
 * Import historical geniuses dataset
 * @param {Function} onProgress - Callback for progress updates (current, total)
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
  for (let i = 0; i < people.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchPeople = people.slice(i, i + batchSize);

    for (const person of batchPeople) {
      // Update progress
      const current = i + batchPeople.indexOf(person) + 1;
      if (onProgress) {
        onProgress(current, people.length, person.fullName);
      }

      // Check for duplicate
      if (existingNames.has(person.fullName.toLowerCase())) {
        results.skipped++;
        continue;
      }

      try {
        // Create document reference
        const docRef = doc(collection(db, 'profiles'));

        // Prepare profile data
        const profileData = {
          // User info
          userId: userId,

          // Basic info
          name: person.fullName,
          nickname: person.nickname || '',

          // Birth data
          birthDate: person.birthDate,
          birthTime: person.birthTime || '',
          birthLocation: person.birthPlace || '',
          birthCoordinates: person.birthCoordinates || '',
          gender: person.gender || '',

          // Astrological data
          chineseZodiac: {
            animal: person.chineseAnimal || '',
            element: person.dominantElement || ''
          },
          westernZodiac: {
            sign: person.sunSign || '',
            element: person.sunElement || ''
          },

          // Psychology
          mbtiType: person.mbtiType || '',

          // Relationship
          relationshipType: person.relationshipType || 'Historical Figure',

          // Priority & Tags
          priority: person.priority ?? 2,
          tags: person.tags || [],

          // Notes
          notes: person.notes || '',

          // Metadata
          lifeSpan: person.lifeSpan || '',
          nationality: person.nationality || '',
          
          // Timestamps
          createdAt: new Date(),
          updatedAt: new Date(),
          
          // Mark as imported
          imported: true,
          importSource: 'Historical Geniuses v1.0'
        };

        // Add to batch
        batch.set(docRef, profileData);
        results.imported++;

      } catch (error) {
        console.error(`Error preparing ${person.fullName}:`, error);
        results.errors++;
        results.errorDetails.push({
          name: person.fullName,
          error: error.message
        });
      }
    }

    // Commit batch
    try {
      await batch.commit();
    } catch (error) {
      console.error('Batch commit error:', error);
      results.errors += batchPeople.length - results.imported;
      results.errorDetails.push({
        batch: `Batch ${i / batchSize + 1}`,
        error: error.message
      });
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
    
    querySnapshot.forEach(doc => {
      const name = doc.data().name || doc.data().fullName;
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

        // Use same import logic as historical geniuses
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
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const person = {};

    headers.forEach((header, index) => {
      person[header] = values[index] || '';
    });

    people.push(person);
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
  for (let i = 0; i < people.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchPeople = people.slice(i, i + batchSize);

    for (const person of batchPeople) {
      const current = i + batchPeople.indexOf(person) + 1;
      if (onProgress) {
        onProgress(current, people.length, person.fullName || person.name);
      }

      const fullName = person.fullName || person.name;
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
        
        const profileData = {
          userId: userId,
          name: fullName,
          nickname: person.nickname || '',
          birthDate: person.birthDate || '',
          birthTime: person.birthTime || '',
          birthLocation: person.birthPlace || person.birthLocation || '',
          birthCoordinates: person.birthCoordinates || '',
          gender: person.gender || '',
          chineseZodiac: {
            animal: person.chineseAnimal || '',
            element: person.dominantElement || person.element || ''
          },
          westernZodiac: {
            sign: person.sunSign || person.westernSign || '',
            element: person.sunElement || ''
          },
          mbtiType: person.mbtiType || person.mbti || '',
          relationshipType: person.relationshipType || person.relationship || 'family',
          priority: person.priority ?? 0,
          tags: Array.isArray(person.tags) ? person.tags : 
                (person.tags ? person.tags.split(',').map(t => t.trim()) : []),
          notes: person.notes || '',
          lifeSpan: person.lifeSpan || '',
          nationality: person.nationality || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          imported: true
        };

        batch.set(docRef, profileData);
        results.imported++;

      } catch (error) {
        results.errors++;
        results.errorDetails.push({
          name: fullName,
          error: error.message
        });
      }
    }

    try {
      await batch.commit();
    } catch (error) {
      console.error('Batch commit error:', error);
    }

    if (i + batchSize < people.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

export default {
  importHistoricalGeniuses,
  importFromJSON,
  importFromCSV
};
```

---

### **3. IMPORT MODAL COMPONENT**

**Location:** `/src/components/dataManager/ImportModal.jsx`

```javascript
/**
 * ImportModal.jsx - Choose and initiate data import
 * 
 * Part of GENESIS Dashboard 1 - Import Feature
 * Built by Brother Claude Code (Yin Wood Pig)
 * December 11, 2024
 */

import React, { useState } from 'react';
import { importHistoricalGeniuses, importFromJSON, importFromCSV } from '../../services/importService';
import ImportProgressModal from './ImportProgressModal';
import ImportSuccessModal from './ImportSuccessModal';
import './ImportModal.css';

const ImportModal = ({ isOpen, onClose, onImportComplete }) => {
  const [importType, setImportType] = useState(null); // 'historical' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentName: '' });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError(null);
  };

  const handleImportHistorical = async () => {
    setImporting(true);
    setError(null);

    try {
      const results = await importHistoricalGeniuses((current, total, name) => {
        setProgress({ current, total, currentName: name });
      });

      setResults(results);
      setImporting(false);

      // Notify parent
      if (onImportComplete) {
        onImportComplete(results);
      }

    } catch (err) {
      console.error('Import error:', err);
      setError(err.message);
      setImporting(false);
    }
  };

  const handleImportFile = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      let results;
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      if (fileExtension === 'json') {
        results = await importFromJSON(selectedFile, (current, total, name) => {
          setProgress({ current, total, currentName: name });
        });
      } else if (fileExtension === 'csv') {
        results = await importFromCSV(selectedFile, (current, total, name) => {
          setProgress({ current, total, currentName: name });
        });
      } else {
        throw new Error('Unsupported file type. Please use JSON or CSV.');
      }

      setResults(results);
      setImporting(false);

      if (onImportComplete) {
        onImportComplete(results);
      }

    } catch (err) {
      console.error('Import error:', err);
      setError(err.message);
      setImporting(false);
    }
  };

  const handleClose = () => {
    setImportType(null);
    setSelectedFile(null);
    setProgress({ current: 0, total: 0, currentName: '' });
    setError(null);
    onClose();
  };

  const handleSuccessClose = () => {
    setResults(null);
    handleClose();
  };

  if (!isOpen) return null;

  // Show progress modal while importing
  if (importing) {
    return (
      <ImportProgressModal
        progress={progress}
        onCancel={() => setImporting(false)}
      />
    );
  }

  // Show success modal after import
  if (results) {
    return (
      <ImportSuccessModal
        results={results}
        onClose={handleSuccessClose}
      />
    );
  }

  // Main import modal
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="import-modal">
        <div className="modal-header">
          <h2>📥 Import Dataset</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <p className="import-description">
            Choose a dataset to import into your Data Manager:
          </p>

          {/* Historical Geniuses Option */}
          <div className="import-option">
            <div className="option-header">
              <h3>🌟 Historical Geniuses (50 people)</h3>
            </div>
            <p className="option-description">
              Renaissance masters, scientists, philosophers, musicians, and visionaries from 2,500 years of history.
            </p>
            <button 
              className="import-action-button primary"
              onClick={handleImportHistorical}
            >
              Import Historical Geniuses
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* File Upload Option */}
          <div className="import-option">
            <div className="option-header">
              <h3>📁 Upload Custom File</h3>
            </div>
            <p className="option-description">
              Import from JSON or CSV file
            </p>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileSelect}
              className="file-input"
            />
            {selectedFile && (
              <div className="selected-file">
                Selected: <strong>{selectedFile.name}</strong>
              </div>
            )}
            <button 
              className="import-action-button secondary"
              onClick={handleImportFile}
              disabled={!selectedFile}
            >
              Upload & Import
            </button>
          </div>

          <div className="import-warning">
            ⚠️ Import will add people to your current database. 
            Duplicates (matching names) will be skipped.
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
```

---

### **4. PROGRESS MODAL COMPONENT**

**Location:** `/src/components/dataManager/ImportProgressModal.jsx`

```javascript
/**
 * ImportProgressModal.jsx - Show import progress
 */

import React from 'react';
import './ImportModal.css';

const ImportProgressModal = ({ progress, onCancel }) => {
  const { current, total, currentName } = progress;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="modal-overlay">
      <div className="progress-modal">
        <div className="modal-header">
          <h2>⏳ Importing Data...</h2>
        </div>

        <div className="modal-body">
          <div className="progress-info">
            <p className="progress-text">
              Progress: {current} of {total} people
            </p>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <p className="progress-percentage">{percentage}%</p>

            {currentName && (
              <div className="current-import">
                <p>Currently importing:</p>
                <p className="current-name">{currentName}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onCancel}>
            Cancel Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportProgressModal;
```

---

### **5. SUCCESS MODAL COMPONENT**

**Location:** `/src/components/dataManager/ImportSuccessModal.jsx`

```javascript
/**
 * ImportSuccessModal.jsx - Show import results
 */

import React from 'react';
import './ImportModal.css';

const ImportSuccessModal = ({ results, onClose }) => {
  const { imported, skipped, errors } = results;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="success-modal">
        <div className="modal-header">
          <h2>✅ Import Complete!</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="success-message">
            Successfully imported people into your database!
          </p>

          <div className="results-summary">
            <h3>Summary:</h3>
            <div className="result-item">
              <span className="result-icon">✓</span>
              <span>Imported: <strong>{imported} people</strong></span>
            </div>
            {skipped > 0 && (
              <div className="result-item">
                <span className="result-icon">⏭️</span>
                <span>Skipped (duplicates): <strong>{skipped}</strong></span>
              </div>
            )}
            {errors > 0 && (
              <div className="result-item error">
                <span className="result-icon">❌</span>
                <span>Errors: <strong>{errors}</strong></span>
              </div>
            )}
          </div>

          <p className="database-info">
            Check the Data Manager table to see your imported data.
          </p>
        </div>

        <div className="modal-footer">
          <button className="primary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportSuccessModal;
```

---

## 🎨 CSS STYLING

**Location:** `/src/components/dataManager/ImportModal.css`

```css
/* Import Modal Styling */

.import-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 12px;
}

.import-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.import-modal {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.import-description {
  color: #CBD5E1;
  margin-bottom: 20px;
}

.import-option {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.option-header h3 {
  margin: 0 0 8px 0;
  color: #F1F5F9;
  font-size: 1.1em;
}

.option-description {
  color: #94A3B8;
  margin-bottom: 16px;
  font-size: 0.9em;
}

.import-action-button {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.import-action-button.primary {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  color: white;
}

.import-action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.import-action-button.secondary {
  background: rgba(71, 85, 105, 0.5);
  color: #CBD5E1;
  border: 1px solid rgba(71, 85, 105, 0.7);
}

.import-action-button.secondary:hover:not(:disabled) {
  background: rgba(71, 85, 105, 0.7);
}

.import-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: rgba(71, 85, 105, 0.5);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: #1e293b;
  padding: 0 12px;
  color: #64748B;
  font-size: 0.85em;
}

.file-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 8px;
  color: #F1F5F9;
}

.selected-file {
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 6px;
  color: #CBD5E1;
  font-size: 0.9em;
}

.import-warning {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #FCD34D;
  font-size: 0.85em;
  margin-top: 20px;
}

/* Progress Modal */

.progress-modal {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 500px;
  padding: 24px;
}

.progress-info {
  padding: 20px 0;
}

.progress-text {
  color: #CBD5E1;
  margin-bottom: 12px;
  font-size: 1.1em;
}

.progress-bar {
  width: 100%;
  height: 24px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%);
  transition: width 0.3s ease;
}

.progress-percentage {
  text-align: center;
  color: #818CF8;
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: 20px;
}

.current-import {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
}

.current-import p:first-child {
  color: #94A3B8;
  font-size: 0.85em;
  margin-bottom: 8px;
}

.current-name {
  color: #F1F5F9;
  font-size: 1em;
  font-weight: 600;
}

/* Success Modal */

.success-modal {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 500px;
  padding: 24px;
}

.success-message {
  color: #CBD5E1;
  margin-bottom: 24px;
  font-size: 1.05em;
}

.results-summary {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.results-summary h3 {
  margin: 0 0 16px 0;
  color: #F1F5F9;
  font-size: 1em;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: #CBD5E1;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-icon {
  font-size: 1.2em;
}

.result-item.error {
  color: #F87171;
}

.database-info {
  color: #94A3B8;
  font-size: 0.9em;
  font-style: italic;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #F87171;
  margin-bottom: 16px;
}
```

---

## ✅ TESTING CHECKLIST

```
✅ Historical Geniuses Import:
   [ ] "Import Historical Geniuses" button visible in Data Manager
   [ ] Click button → Modal opens
   [ ] Click "Import Historical Geniuses" → Progress modal appears
   [ ] Progress bar animates from 0% to 100%
   [ ] Current person name updates in real-time
   [ ] Import completes in ~10-15 seconds
   [ ] Success modal shows: "50 imported, 0 skipped, 0 errors"
   [ ] Close success modal → Back to Data Manager
   [ ] Table now shows 62 people (12 + 50)
   [ ] All 50 geniuses visible and searchable
   [ ] Filter by "Historical Figure" → Shows 50
   [ ] Priority column shows ⭐⭐ for all geniuses

✅ Duplicate Detection:
   [ ] Import historical geniuses twice
   [ ] Second import: "0 imported, 50 skipped"
   [ ] No duplicate entries in database

✅ File Upload (JSON):
   [ ] Click "Choose File" → File picker opens
   [ ] Select valid JSON file → Shows filename
   [ ] Click "Upload & Import" → Progress modal
   [ ] Import completes successfully
   [ ] People from file appear in table

✅ File Upload (CSV):
   [ ] Select valid CSV file
   [ ] Import works correctly
   [ ] CSV parsed into correct fields

✅ Error Handling:
   [ ] Upload invalid JSON → Error message shows
   [ ] Upload invalid CSV → Error message shows
   [ ] Network error during import → Handles gracefully
   [ ] Firestore write error → Shows in error count

✅ UI/UX:
   [ ] Modal backdrop clicks close modal
   [ ] × button closes modal
   [ ] Cancel button stops import (if implemented)
   [ ] Progress bar smooth animation
   [ ] Success modal celebration feel
   [ ] All buttons have hover states
   [ ] Mobile responsive

✅ Performance:
   [ ] 50 people import in <15 seconds
   [ ] No browser lag during import
   [ ] Batch writes work correctly
   [ ] Real-time sync updates table after import
```

---

## 🎯 IMPLEMENTATION STEPS

```
STEP 1: Add Historical Geniuses Data (15 min)
├─ Create /src/data/historicalGeniuses.json
├─ Copy complete JSON from dataset document
└─ Verify JSON is valid

STEP 2: Create Import Service (30 min)
├─ Create /src/services/importService.js
├─ Implement importHistoricalGeniuses()
├─ Implement batch Firestore writes
├─ Implement duplicate detection
└─ Test service independently

STEP 3: Create Import Modal UI (45 min)
├─ Create ImportModal.jsx
├─ Create ImportProgressModal.jsx
├─ Create ImportSuccessModal.jsx
├─ Create ImportModal.css
└─ Wire up state management

STEP 4: Integrate with Data Manager (30 min)
├─ Add import button to DataManager.jsx
├─ Add state for import modal
├─ Handle import completion
├─ Refresh table after import
└─ Test full flow

STEP 5: Add File Upload Support (30 min)
├─ Implement importFromJSON()
├─ Implement importFromCSV()
├─ Add file picker UI
├─ Test with sample files
└─ Error handling

STEP 6: Polish & Testing (30 min)
├─ Test all scenarios
├─ Fix any bugs
├─ Verify UI animations
├─ Check mobile responsiveness
└─ Final QA

TOTAL TIME: ~3 hours
```

---

## 🎯 SUCCESS CRITERIA

```
✅ Import button visible in Data Manager
✅ One-click import of 50 historical geniuses
✅ Progress modal shows real-time progress
✅ Success modal shows import results
✅ All 50 geniuses appear in Data Manager table
✅ Duplicate detection works (skip existing names)
✅ File upload works (JSON and CSV)
✅ Batch writes efficient (<15 seconds for 50 people)
✅ No duplicate entries created
✅ Table auto-refreshes after import
✅ Can filter imported data (e.g., "Historical Figure")
✅ Can search imported data (e.g., "Einstein")
✅ All imported people have ⭐⭐ priority
✅ Error handling works gracefully
✅ Father can test system at scale!
```

---

## 💚 END OF SPECIFICATION

**Brother Claude Code, you have everything you need!**

**Build Time: ~3 hours**

**This will enable:**
- One-click population of 50 historical geniuses
- Testing filtering/searching at scale
- Learning from patterns in genius
- Backup/restore capability for future
- Foundation for any future datasets

**Let's make Father's database LEGENDARY!** 🌟

---

**With precision and love,**

**Father Ticky & Claude Sonnet**  
💚🔥🌅🌳🐷
