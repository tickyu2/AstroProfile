# 🌍 GENESIS MULTI-LANGUAGE ARCHITECTURE
## AI Translation System with User Preferences & Admin Management

**Date:** January 19, 2026  
**Challenge:** Support multiple languages for global reach  
**Solution:** AI translation (Claude API) + caching + user preferences + admin review  
**Vision:** "Anyone, anywhere" - Khan Academy global accessibility

---

## 🎯 CORE CONCEPT

```
╔═══════════════════════════════════════════════════════════════╗
║              MULTI-LANGUAGE STRATEGY                           ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  SOURCE OF TRUTH: English (Ticky writes in English)           ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  → All original .md content in English                         ║
║  → Ticky manages curriculum in English                         ║
║  → Admin CMS is English                                        ║
║                                                                ║
║  AI TRANSLATION: On-demand + cached                            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  → User selects language (toggle)                              ║
║  → First request: Claude API translates                        ║
║  → Translation cached in database                              ║
║  → Subsequent requests: Serve from cache (instant)             ║
║  → Admin can review/edit translations                          ║
║                                                                ║
║  USER EXPERIENCE:                                              ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  → Language toggle (🌐) in header                             ║
║  → Choice persists across sessions                             ║
║  → Content instantly appears in chosen language                ║
║  → Bookmarks/highlights saved with language context            ║
║  → Can switch language anytime                                 ║
║                                                                ║
║  ADMIN FEATURES:                                               ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  → View all translations                                       ║
║  → Edit AI-generated translations                              ║
║  → Mark translations as "reviewed"                             ║
║  → Export/import translation files                             ║
║  → Priority languages (Spanish, Chinese, French...)            ║
║                                                                ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🗄️ DATABASE SCHEMA ADDITIONS

### **TRANSLATION TABLES:**

```sql
-- ============================================================================
-- MULTI-LANGUAGE SUPPORT
-- ============================================================================

-- Supported languages
CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,           -- 'en', 'es', 'zh', 'fr'
    name VARCHAR(100) NOT NULL,                 -- 'English', 'Español'
    native_name VARCHAR(100) NOT NULL,          -- 'English', 'Español'
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 999,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial languages
INSERT INTO languages (code, name, native_name, is_default, display_order) VALUES
    ('en', 'English', 'English', true, 1),
    ('es', 'Spanish', 'Español', false, 2),
    ('zh', 'Chinese (Simplified)', '简体中文', false, 3),
    ('zh-TW', 'Chinese (Traditional)', '繁體中文', false, 4),
    ('fr', 'French', 'Français', false, 5),
    ('de', 'German', 'Deutsch', false, 6),
    ('ja', 'Japanese', '日本語', false, 7),
    ('ko', 'Korean', '한국어', false, 8),
    ('pt', 'Portuguese', 'Português', false, 9),
    ('ru', 'Russian', 'Русский', false, 10),
    ('ar', 'Arabic', 'العربية', false, 11),
    ('hi', 'Hindi', 'हिन्दी', false, 12);

CREATE INDEX idx_languages_code ON languages(code);
CREATE INDEX idx_languages_active ON languages(is_active);

-- ============================================================================
-- CONTENT TRANSLATIONS (AI-generated + human-reviewed)
-- ============================================================================

-- Module translations
CREATE TABLE module_translations (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
    language_code VARCHAR(10) REFERENCES languages(code) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    translation_method VARCHAR(20) DEFAULT 'ai',  -- 'ai' or 'human'
    translation_status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'generated', 'reviewed', 'approved'
    translated_by INTEGER REFERENCES admin_users(id),
    reviewed_by INTEGER REFERENCES admin_users(id),
    translation_quality_score DECIMAL(3,2),      -- 0.00 to 1.00 (AI confidence)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(module_id, language_code),
    CONSTRAINT translation_method_check CHECK (translation_method IN ('ai', 'human')),
    CONSTRAINT translation_status_check CHECK (translation_status IN ('pending', 'generated', 'reviewed', 'approved'))
);

CREATE INDEX idx_module_trans_module ON module_translations(module_id);
CREATE INDEX idx_module_trans_lang ON module_translations(language_code);
CREATE INDEX idx_module_trans_status ON module_translations(translation_status);

-- Section translations
CREATE TABLE section_translations (
    id SERIAL PRIMARY KEY,
    section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
    language_code VARCHAR(10) REFERENCES languages(code) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    translation_method VARCHAR(20) DEFAULT 'ai',
    translation_status VARCHAR(20) DEFAULT 'pending',
    translated_by INTEGER REFERENCES admin_users(id),
    reviewed_by INTEGER REFERENCES admin_users(id),
    translation_quality_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(section_id, language_code)
);

CREATE INDEX idx_section_trans_section ON section_translations(section_id);
CREATE INDEX idx_section_trans_lang ON section_translations(language_code);

-- Subsection translations (full content)
CREATE TABLE subsection_translations (
    id SERIAL PRIMARY KEY,
    subsection_id INTEGER REFERENCES subsections(id) ON DELETE CASCADE NOT NULL,
    language_code VARCHAR(10) REFERENCES languages(code) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    markdown_content TEXT NOT NULL,              -- Translated markdown
    translation_method VARCHAR(20) DEFAULT 'ai',
    translation_status VARCHAR(20) DEFAULT 'pending',
    translated_by INTEGER REFERENCES admin_users(id),
    reviewed_by INTEGER REFERENCES admin_users(id),
    translation_quality_score DECIMAL(3,2),
    translation_notes TEXT,                      -- Notes from reviewer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Future: Add embedding for translated content (pgvector)
    -- embedding vector(1536),
    
    UNIQUE(subsection_id, language_code)
);

CREATE INDEX idx_subsection_trans_subsection ON subsection_translations(subsection_id);
CREATE INDEX idx_subsection_trans_lang ON subsection_translations(language_code);
CREATE INDEX idx_subsection_trans_status ON subsection_translations(translation_status);

-- ============================================================================
-- USER LANGUAGE PREFERENCES (Phase 2)
-- ============================================================================

-- User preferred language (stored in user profile)
ALTER TABLE end_users ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en';
ALTER TABLE end_users ADD CONSTRAINT fk_user_language 
    FOREIGN KEY (preferred_language) REFERENCES languages(code);

CREATE INDEX idx_users_language ON end_users(preferred_language);

-- ============================================================================
-- USER BOOKMARKS WITH LANGUAGE CONTEXT
-- ============================================================================

-- Update bookmarks to include language
ALTER TABLE user_bookmarks ADD COLUMN language_code VARCHAR(10) DEFAULT 'en';
ALTER TABLE user_bookmarks ADD CONSTRAINT fk_bookmark_language 
    FOREIGN KEY (language_code) REFERENCES languages(code);

CREATE INDEX idx_bookmarks_language ON user_bookmarks(language_code);

-- Update highlights to include language
ALTER TABLE user_highlights ADD COLUMN language_code VARCHAR(10) DEFAULT 'en';
ALTER TABLE user_highlights ADD CONSTRAINT fk_highlight_language 
    FOREIGN KEY (language_code) REFERENCES languages(code);

CREATE INDEX idx_highlights_language ON user_highlights(language_code);

-- ============================================================================
-- TRANSLATION CACHE & ANALYTICS
-- ============================================================================

-- Track translation requests for analytics
CREATE TABLE translation_requests (
    id SERIAL PRIMARY KEY,
    subsection_id INTEGER REFERENCES subsections(id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(code),
    user_id INTEGER REFERENCES end_users(id),
    request_source VARCHAR(50),                  -- 'user_view', 'admin_preview', 'api'
    cache_hit BOOLEAN DEFAULT false,
    translation_time_ms INTEGER,                 -- How long translation took
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trans_requests_lang ON translation_requests(language_code);
CREATE INDEX idx_trans_requests_created ON translation_requests(created_at DESC);

-- ============================================================================
-- HELPER VIEW: Content with translations
-- ============================================================================

CREATE OR REPLACE VIEW content_with_translations AS
SELECT 
    sub.id as subsection_id,
    sub.title as original_title,
    sub.markdown_content as original_content,
    sub.status,
    
    l.code as language_code,
    l.name as language_name,
    
    st.title as translated_title,
    st.markdown_content as translated_content,
    st.translation_status,
    st.translation_quality_score,
    
    CASE 
        WHEN st.id IS NULL THEN 'not_translated'
        WHEN st.translation_status = 'approved' THEN 'ready'
        WHEN st.translation_status = 'reviewed' THEN 'ready'
        WHEN st.translation_status = 'generated' THEN 'needs_review'
        ELSE 'pending'
    END as availability_status
    
FROM subsections sub
CROSS JOIN languages l
LEFT JOIN subsection_translations st 
    ON sub.id = st.subsection_id 
    AND l.code = st.language_code
WHERE l.is_active = true
ORDER BY sub.id, l.display_order;
```

---

## 🤖 AI TRANSLATION LOGIC

### **TRANSLATION WORKFLOW:**

```
USER SELECTS SPANISH (es):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Check cache
→ Query: SELECT * FROM subsection_translations 
         WHERE subsection_id = X AND language_code = 'es'

STEP 2A: Cache HIT (translation exists)
→ Return translated content instantly
→ Log: cache_hit = true
→ Translation time: ~5ms

STEP 2B: Cache MISS (translation doesn't exist)
→ Fetch original English content
→ Call Claude API for translation
→ Store translation in cache
→ Return translated content
→ Log: cache_hit = false, translation_time_ms = 2500
→ Translation time: ~2-3 seconds (first time only)

STEP 3: Serve content
→ User sees content in Spanish
→ All subsequent views: instant (from cache)
```

### **CLAUDE API TRANSLATION SERVICE:**

```javascript
// backend/src/services/translationService.js

const Anthropic = require('@anthropic-ai/sdk');
const pool = require('../config/database');
const redis = require('../config/redis');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Translate markdown content using Claude API
 */
async function translateContent(originalContent, targetLanguage, contentType = 'subsection') {
  const startTime = Date.now();
  
  try {
    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `You are a professional translator for GENESIS Relationship Academy, 
                    an educational platform about authentic human connection and compatibility.
                    
                    Translate the following markdown content to ${getLanguageName(targetLanguage)}.
                    
                    CRITICAL REQUIREMENTS:
                    1. Preserve ALL markdown formatting (headers, bold, links, code blocks)
                    2. Preserve ALL custom syntax: {fire:35%}, :::info...::: 
                    3. Keep technical terms accurate (BaZi = 八字, Fire Element = 火元素)
                    4. Maintain tone: warm, educational, encouraging
                    5. Adapt cultural examples where appropriate
                    6. Keep URLs unchanged
                    
                    ORIGINAL CONTENT:
                    ${originalContent}
                    
                    Return ONLY the translated markdown, no preamble.`
        }
      ]
    });

    const translatedContent = message.content[0].text;
    const translationTime = Date.now() - startTime;

    // Calculate quality score (based on content length ratio)
    const qualityScore = calculateQualityScore(originalContent, translatedContent);

    return {
      translatedContent,
      translationTime,
      qualityScore,
      method: 'ai',
      status: 'generated'
    };

  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}

/**
 * Get or create translation for subsection
 */
async function getSubsectionTranslation(subsectionId, languageCode, userId = null) {
  // If English, return original
  if (languageCode === 'en') {
    const result = await pool.query(
      'SELECT id, title, description, markdown_content FROM subsections WHERE id = $1',
      [subsectionId]
    );
    return {
      ...result.rows[0],
      translation_status: 'original',
      cache_hit: true
    };
  }

  // Check cache (Redis first for speed)
  const cacheKey = `translation:${subsectionId}:${languageCode}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    await logTranslationRequest(subsectionId, languageCode, userId, true, 0);
    return {
      ...JSON.parse(cached),
      cache_hit: true
    };
  }

  // Check database
  const dbResult = await pool.query(
    `SELECT * FROM subsection_translations 
     WHERE subsection_id = $1 AND language_code = $2`,
    [subsectionId, languageCode]
  );

  if (dbResult.rows.length > 0) {
    const translation = dbResult.rows[0];
    
    // Cache in Redis (expire after 1 week)
    await redis.setex(cacheKey, 604800, JSON.stringify(translation));
    
    await logTranslationRequest(subsectionId, languageCode, userId, true, 0);
    return {
      ...translation,
      cache_hit: true
    };
  }

  // No cache - generate new translation
  const original = await pool.query(
    'SELECT title, description, markdown_content FROM subsections WHERE id = $1',
    [subsectionId]
  );

  if (original.rows.length === 0) {
    throw new Error('Subsection not found');
  }

  const { title, description, markdown_content } = original.rows[0];

  // Translate title
  const translatedTitle = await translateContent(title, languageCode, 'title');
  
  // Translate description
  const translatedDescription = description 
    ? await translateContent(description, languageCode, 'description')
    : null;
  
  // Translate main content
  const translatedMarkdown = await translateContent(markdown_content, languageCode, 'subsection');

  // Store in database
  const insertResult = await pool.query(
    `INSERT INTO subsection_translations 
     (subsection_id, language_code, title, description, markdown_content, 
      translation_method, translation_status, translation_quality_score)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      subsectionId,
      languageCode,
      translatedTitle.translatedContent,
      translatedDescription?.translatedContent,
      translatedMarkdown.translatedContent,
      'ai',
      'generated',
      translatedMarkdown.qualityScore
    ]
  );

  const newTranslation = insertResult.rows[0];

  // Cache in Redis
  await redis.setex(cacheKey, 604800, JSON.stringify(newTranslation));

  // Log request
  await logTranslationRequest(
    subsectionId, 
    languageCode, 
    userId, 
    false, 
    translatedMarkdown.translationTime
  );

  return {
    ...newTranslation,
    cache_hit: false,
    translation_time_ms: translatedMarkdown.translationTime
  };
}

/**
 * Batch translate entire module
 */
async function batchTranslateModule(moduleId, languageCode) {
  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  // Get all subsections in module
  const subsections = await pool.query(
    `SELECT sub.id, sub.title, sub.markdown_content
     FROM subsections sub
     JOIN sections sec ON sub.section_id = sec.id
     WHERE sec.module_id = $1
     ORDER BY sec.order_position, sub.order_position`,
    [moduleId]
  );

  for (const subsection of subsections.rows) {
    try {
      // Check if already translated
      const existing = await pool.query(
        `SELECT id FROM subsection_translations 
         WHERE subsection_id = $1 AND language_code = $2`,
        [subsection.id, languageCode]
      );

      if (existing.rows.length > 0) {
        results.skipped.push(subsection.id);
        continue;
      }

      // Translate
      await getSubsectionTranslation(subsection.id, languageCode);
      results.success.push(subsection.id);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Failed to translate subsection ${subsection.id}:`, error);
      results.failed.push({
        id: subsection.id,
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Calculate translation quality score
 */
function calculateQualityScore(original, translated) {
  const originalLength = original.length;
  const translatedLength = translated.length;
  const ratio = translatedLength / originalLength;

  // Good translation typically has similar length (0.8 - 1.5 ratio)
  if (ratio >= 0.8 && ratio <= 1.5) {
    return 0.95;
  } else if (ratio >= 0.6 && ratio <= 2.0) {
    return 0.80;
  } else {
    return 0.60;
  }
}

/**
 * Log translation request for analytics
 */
async function logTranslationRequest(subsectionId, languageCode, userId, cacheHit, translationTime) {
  await pool.query(
    `INSERT INTO translation_requests 
     (subsection_id, language_code, user_id, cache_hit, translation_time_ms)
     VALUES ($1, $2, $3, $4, $5)`,
    [subsectionId, languageCode, userId, cacheHit, translationTime]
  );
}

/**
 * Get language full name
 */
function getLanguageName(code) {
  const languages = {
    'es': 'Spanish',
    'zh': 'Simplified Chinese',
    'zh-TW': 'Traditional Chinese',
    'fr': 'French',
    'de': 'German',
    'ja': 'Japanese',
    'ko': 'Korean',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ar': 'Arabic',
    'hi': 'Hindi'
  };
  return languages[code] || code;
}

module.exports = {
  translateContent,
  getSubsectionTranslation,
  batchTranslateModule
};
```

---

## 🎨 FRONTEND IMPLEMENTATION

### **LANGUAGE TOGGLE COMPONENT:**

```typescript
// frontend/src/components/LanguageToggle.tsx

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
];

export const LanguageToggle: React.FC = () => {
  const { currentLanguage, setLanguage, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (code: string) => {
    await setLanguage(code);
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
        disabled={isLoading}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline">{currentLang.nativeName}</span>
        <span className="text-xl">{currentLang.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-2 py-1 mb-2">
              Choose your language
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-left
                  hover:bg-blue-50 transition-colors
                  ${lang.code === currentLanguage ? 'bg-blue-50 text-blue-700' : ''}
                `}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
                {lang.code === currentLanguage && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute right-0 mt-2 px-3 py-2 bg-white border rounded-lg shadow-lg text-sm text-gray-600">
          Translating content...
        </div>
      )}
    </div>
  );
};
```

### **LANGUAGE CONTEXT & HOOK:**

```typescript
// frontend/src/hooks/useLanguage.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { contentService } from '../services/contentService';

interface LanguageStore {
  currentLanguage: string;
  isLoading: boolean;
  setLanguage: (code: string) => Promise<void>;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      isLoading: false,

      setLanguage: async (code: string) => {
        set({ isLoading: true });
        
        try {
          // Update user preference in backend (if logged in)
          await contentService.updateUserLanguage(code);
          
          // Update local state
          set({ currentLanguage: code });
          
          // Trigger content reload (via React Query invalidation)
          // This will fetch content in new language
          
        } catch (error) {
          console.error('Failed to change language:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'genesis-language',
      // Persist to localStorage
    }
  )
);
```

### **CONTENT LOADING WITH TRANSLATION:**

```typescript
// frontend/src/hooks/useContent.ts

import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { useLanguage } from './useLanguage';

export function useSubsectionContent(subsectionId: number) {
  const { currentLanguage } = useLanguage();

  return useQuery({
    queryKey: ['subsection', subsectionId, currentLanguage],
    queryFn: async () => {
      // Fetch content in current language
      const response = await contentService.getSubsection(subsectionId, currentLanguage);
      
      // If first load (no cache), might take 2-3 seconds
      // Subsequent loads: instant
      
      return response;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    // Show loading indicator if translation takes time
  });
}
```

---

## 🔧 ADMIN TRANSLATION MANAGEMENT

### **ADMIN TRANSLATION DASHBOARD:**

```typescript
// frontend/src/pages/TranslationManager.tsx

import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

export const TranslationManager: React.FC = () => {
  const { translations, languages, batchTranslate } = useTranslations();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Translation Management</h1>

      {/* Translation Coverage */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {languages.map((lang) => (
          <div key={lang.code} className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-medium">{lang.nativeName}</span>
            </div>
            <div className="text-sm text-gray-600">
              {translations[lang.code]?.completed || 0} / {translations.total} pages
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2"
                style={{
                  width: `${((translations[lang.code]?.completed || 0) / translations.total) * 100}%`
                }}
              />
            </div>
            <button
              onClick={() => batchTranslate(lang.code)}
              className="mt-3 w-full px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Translate All
            </button>
          </div>
        ))}
      </div>

      {/* Translation List */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Page</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Language</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Quality</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Translation rows */}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## 📊 USER BOOKMARKS WITH LANGUAGE

### **BOOKMARK WITH LANGUAGE CONTEXT:**

```javascript
// When user bookmarks in Spanish:
await pool.query(
  `INSERT INTO user_bookmarks 
   (user_id, subsection_id, title, language_code)
   VALUES ($1, $2, $3, $4)`,
  [userId, subsectionId, 'Prácticas de Fuego Semanales', 'es']
);

// When user retrieves bookmarks:
const bookmarks = await pool.query(
  `SELECT 
    b.id,
    b.title as bookmark_title,
    b.language_code,
    CASE 
      WHEN b.language_code = 'en' THEN sub.title
      ELSE COALESCE(st.title, sub.title)
    END as content_title
   FROM user_bookmarks b
   JOIN subsections sub ON b.subsection_id = sub.id
   LEFT JOIN subsection_translations st 
     ON sub.id = st.subsection_id 
     AND b.language_code = st.language_code
   WHERE b.user_id = $1
   ORDER BY b.created_at DESC`,
  [userId]
);

// User can view bookmark in original language OR switch languages
```

---

## 🎯 IMPLEMENTATION PRIORITIES

### **PHASE 1: Basic Translation (Weeks 9-10)**

```
✓ Database schema additions
✓ Languages table setup
✓ Translation tables
✓ Claude API integration
✓ Basic translation service
✓ Cache system (Redis + Database)
✓ Language toggle UI
✓ User preference storage
```

### **PHASE 2: Admin Tools (Weeks 11-12)**

```
✓ Translation dashboard
✓ Batch translation
✓ Review interface
✓ Edit translations
✓ Quality scoring
✓ Translation analytics
```

### **PHASE 3: Advanced Features (Phase 2)**

```
✓ Bookmarks with language
✓ Highlights with language
✓ Multi-language search
✓ Translation versioning
✓ Community contributions
✓ Professional review workflow
```

---

## 💰 COST MANAGEMENT

### **TRANSLATION COSTS:**

```
CLAUDE API PRICING (Sonnet 4):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input: $3 per million tokens
Output: $15 per million tokens

AVERAGE SUBSECTION:
→ ~1000 words = ~1500 tokens
→ Translation request: ~2000 tokens
→ Translation response: ~2000 tokens
→ Cost per translation: ~$0.04

ENTIRE CURRICULUM:
→ Assume 500 subsections
→ 11 languages (excluding English)
→ Total translations needed: 500 × 11 = 5,500
→ Total cost: 5,500 × $0.04 = $220

ONE-TIME COST: ~$220 for all languages
ONGOING: Only new content needs translation

WITH CACHING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
First request: ~2-3 seconds, $0.04
Subsequent requests: ~5ms, $0.00

99%+ of requests served from cache = Near-zero ongoing cost
```

### **COST OPTIMIZATION:**

```
STRATEGIES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PRIORITY LANGUAGES FIRST:
   → Spanish, Chinese, French (highest demand)
   → Translate these immediately
   → Other languages on-demand

2. PROGRESSIVE TRANSLATION:
   → Translate Level 1 content first
   → Levels 2-5 as users progress
   → Only 20% of users reach Level 5

3. BATCH AT LOW USAGE:
   → Pre-translate during off-peak hours
   → Spread cost over time
   → $50/month budget = ~1,250 translations/month

4. COMMUNITY CONTRIBUTIONS:
   → Allow native speakers to improve translations
   → Human review for critical content
   → AI for bulk content
```

---

## 🌍 GLOBAL REACH STRATEGY

### **LAUNCH PLAN:**

```
MONTH 1: English + Spanish + Chinese
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ 3 languages cover ~40% of world
→ Cost: ~$80
→ Test translation quality
→ Gather user feedback

MONTH 2: Add French, German, Portuguese
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Cover Europe + Brazil
→ Cost: ~$60
→ Expand reach

MONTH 3: Add Japanese, Korean, Russian, Arabic
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Cover Asia + Middle East
→ Cost: ~$80
→ Global coverage

TOTAL INVESTMENT: ~$220
REACH: 11 languages, 4+ billion people
```

---

## 📈 ANALYTICS & INSIGHTS

### **TRACK LANGUAGE USAGE:**

```sql
-- Most requested languages
SELECT 
    language_code,
    COUNT(*) as requests,
    AVG(CASE WHEN cache_hit THEN 0 ELSE translation_time_ms END) as avg_translation_time
FROM translation_requests
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY language_code
ORDER BY requests DESC;

-- Translation coverage by language
SELECT 
    l.code,
    l.native_name,
    COUNT(st.id) as translated_pages,
    (SELECT COUNT(*) FROM subsections WHERE status = 'published') as total_pages,
    ROUND(COUNT(st.id)::NUMERIC / (SELECT COUNT(*) FROM subsections WHERE status = 'published') * 100, 2) as coverage_percent
FROM languages l
LEFT JOIN subsection_translations st ON l.code = st.language_code
WHERE l.is_active = true
GROUP BY l.code, l.native_name
ORDER BY coverage_percent DESC;

-- Cache hit rate
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_requests,
    SUM(CASE WHEN cache_hit THEN 1 ELSE 0 END) as cache_hits,
    ROUND(SUM(CASE WHEN cache_hit THEN 1 ELSE 0 END)::NUMERIC / COUNT(*) * 100, 2) as hit_rate_percent
FROM translation_requests
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

*Multi-Language Architecture Complete: January 19, 2026*  
*"Anyone, anywhere" - AI translation + caching + user preferences + admin management*  
*Global reach with minimal cost. Khan Academy for relationships, in every language!* 🌍💙🔥✨
