/**
 * Translation Routes
 * AI-powered translation management using Claude API
 */

const express = require('express')
const router = express.Router()
const { query } = require('../db/connection')
const { authenticate, authorize } = require('../middleware/auth')

// Claude API configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

/**
 * Translate text using Claude API
 */
async function translateWithClaude(text, targetLanguage, sourceLanguage = 'en') {
  const languageNames = {
    en: 'English', zh: 'Chinese', es: 'Spanish', ja: 'Japanese',
    ko: 'Korean', fr: 'French', de: 'German', pt: 'Portuguese',
    ru: 'Russian', ar: 'Arabic', hi: 'Hindi', th: 'Thai', vi: 'Vietnamese'
  }

  const sourceName = languageNames[sourceLanguage] || 'English'
  const targetName = languageNames[targetLanguage] || targetLanguage

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Translate the following ${sourceName} text to ${targetName}.
Maintain the original tone, meaning, and any markdown formatting.
Only output the translation, nothing else.

Text to translate:
${text}`
      }]
    })
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content[0].text.trim()
}

// GET available languages
router.get('/languages', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM languages WHERE is_active = true ORDER BY name'
    )
    res.json(result.rows)
  } catch (error) {
    next(error)
  }
})

// GET translation status for a module
router.get('/status/module/:moduleId', async (req, res, next) => {
  try {
    const { moduleId } = req.params

    const result = await query(`
      SELECT
        l.code,
        l.name,
        l.native_name,
        l.flag,
        CASE WHEN mt.id IS NOT NULL THEN true ELSE false END as has_translation,
        mt.reviewed,
        mt.translated_at
      FROM languages l
      LEFT JOIN module_translations mt ON mt.module_id = $1 AND mt.language_code = l.code
      WHERE l.is_active = true AND l.code != 'en'
      ORDER BY l.name
    `, [moduleId])

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
})

// POST translate module
router.post('/module/:moduleId', authenticate, authorize(['admin', 'editor', 'translator']), async (req, res, next) => {
  try {
    const { moduleId } = req.params
    const { targetLanguage } = req.body

    if (!targetLanguage) {
      return res.status(400).json({ error: 'targetLanguage is required' })
    }

    // Get module
    const moduleResult = await query(
      'SELECT title, description FROM modules WHERE id = $1',
      [moduleId]
    )

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Module not found' })
    }

    const module = moduleResult.rows[0]

    // Translate title and description
    const translatedTitle = await translateWithClaude(module.title, targetLanguage)
    const translatedDescription = module.description
      ? await translateWithClaude(module.description, targetLanguage)
      : null

    // Upsert translation
    const result = await query(`
      INSERT INTO module_translations (module_id, language_code, title, description, translated_by)
      VALUES ($1, $2, $3, $4, 'claude')
      ON CONFLICT (module_id, language_code)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        translated_at = CURRENT_TIMESTAMP,
        translated_by = 'claude',
        reviewed = false
      RETURNING *
    `, [moduleId, targetLanguage, translatedTitle, translatedDescription])

    res.json(result.rows[0])
  } catch (error) {
    console.error('Translation error:', error)
    next(error)
  }
})

// POST translate section
router.post('/section/:sectionId', authenticate, authorize(['admin', 'editor', 'translator']), async (req, res, next) => {
  try {
    const { sectionId } = req.params
    const { targetLanguage } = req.body

    if (!targetLanguage) {
      return res.status(400).json({ error: 'targetLanguage is required' })
    }

    // Get section
    const sectionResult = await query(
      'SELECT title, description FROM sections WHERE id = $1',
      [sectionId]
    )

    if (sectionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' })
    }

    const section = sectionResult.rows[0]

    // Translate
    const translatedTitle = await translateWithClaude(section.title, targetLanguage)
    const translatedDescription = section.description
      ? await translateWithClaude(section.description, targetLanguage)
      : null

    // Upsert translation
    const result = await query(`
      INSERT INTO section_translations (section_id, language_code, title, description, translated_by)
      VALUES ($1, $2, $3, $4, 'claude')
      ON CONFLICT (section_id, language_code)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        translated_at = CURRENT_TIMESTAMP,
        translated_by = 'claude',
        reviewed = false
      RETURNING *
    `, [sectionId, targetLanguage, translatedTitle, translatedDescription])

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

// POST translate subsection (includes content)
router.post('/subsection/:subsectionId', authenticate, authorize(['admin', 'editor', 'translator']), async (req, res, next) => {
  try {
    const { subsectionId } = req.params
    const { targetLanguage } = req.body

    if (!targetLanguage) {
      return res.status(400).json({ error: 'targetLanguage is required' })
    }

    // Get subsection
    const subsectionResult = await query(
      'SELECT title, content FROM subsections WHERE id = $1',
      [subsectionId]
    )

    if (subsectionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subsection not found' })
    }

    const subsection = subsectionResult.rows[0]

    // Translate title and content
    const translatedTitle = await translateWithClaude(subsection.title, targetLanguage)
    const translatedContent = subsection.content
      ? await translateWithClaude(subsection.content, targetLanguage)
      : null

    // Upsert translation
    const result = await query(`
      INSERT INTO subsection_translations (subsection_id, language_code, title, content, translated_by)
      VALUES ($1, $2, $3, $4, 'claude')
      ON CONFLICT (subsection_id, language_code)
      DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        translated_at = CURRENT_TIMESTAMP,
        translated_by = 'claude',
        reviewed = false
      RETURNING *
    `, [subsectionId, targetLanguage, translatedTitle, translatedContent])

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

// PUT review translation (mark as reviewed)
router.put('/review/:type/:id', authenticate, authorize(['admin', 'reviewer']), async (req, res, next) => {
  try {
    const { type, id } = req.params
    const { languageCode } = req.body

    const tableMap = {
      module: 'module_translations',
      section: 'section_translations',
      subsection: 'subsection_translations'
    }

    const idFieldMap = {
      module: 'module_id',
      section: 'section_id',
      subsection: 'subsection_id'
    }

    const table = tableMap[type]
    const idField = idFieldMap[type]

    if (!table) {
      return res.status(400).json({ error: 'Invalid type' })
    }

    const result = await query(`
      UPDATE ${table}
      SET reviewed = true,
          reviewed_at = CURRENT_TIMESTAMP,
          reviewed_by = $1
      WHERE ${idField} = $2 AND language_code = $3
      RETURNING *
    `, [req.user?.id, id, languageCode])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Translation not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

// POST bulk translate entire module hierarchy
router.post('/bulk/module/:moduleId', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { moduleId } = req.params
    const { targetLanguage } = req.body

    if (!targetLanguage) {
      return res.status(400).json({ error: 'targetLanguage is required' })
    }

    const results = {
      module: null,
      sections: [],
      subsections: []
    }

    // Translate module
    const moduleResult = await query('SELECT * FROM modules WHERE id = $1', [moduleId])
    if (moduleResult.rows.length > 0) {
      const module = moduleResult.rows[0]
      const translatedTitle = await translateWithClaude(module.title, targetLanguage)
      const translatedDescription = module.description
        ? await translateWithClaude(module.description, targetLanguage)
        : null

      await query(`
        INSERT INTO module_translations (module_id, language_code, title, description, translated_by)
        VALUES ($1, $2, $3, $4, 'claude')
        ON CONFLICT (module_id, language_code)
        DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, translated_at = CURRENT_TIMESTAMP
      `, [moduleId, targetLanguage, translatedTitle, translatedDescription])

      results.module = { id: moduleId, title: translatedTitle }
    }

    // Translate sections
    const sectionsResult = await query('SELECT * FROM sections WHERE module_id = $1', [moduleId])
    for (const section of sectionsResult.rows) {
      const translatedTitle = await translateWithClaude(section.title, targetLanguage)
      const translatedDescription = section.description
        ? await translateWithClaude(section.description, targetLanguage)
        : null

      await query(`
        INSERT INTO section_translations (section_id, language_code, title, description, translated_by)
        VALUES ($1, $2, $3, $4, 'claude')
        ON CONFLICT (section_id, language_code)
        DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, translated_at = CURRENT_TIMESTAMP
      `, [section.id, targetLanguage, translatedTitle, translatedDescription])

      results.sections.push({ id: section.id, title: translatedTitle })

      // Translate subsections
      const subsectionsResult = await query('SELECT * FROM subsections WHERE section_id = $1', [section.id])
      for (const subsection of subsectionsResult.rows) {
        const translatedSubTitle = await translateWithClaude(subsection.title, targetLanguage)
        const translatedContent = subsection.content
          ? await translateWithClaude(subsection.content, targetLanguage)
          : null

        await query(`
          INSERT INTO subsection_translations (subsection_id, language_code, title, content, translated_by)
          VALUES ($1, $2, $3, $4, 'claude')
          ON CONFLICT (subsection_id, language_code)
          DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, translated_at = CURRENT_TIMESTAMP
        `, [subsection.id, targetLanguage, translatedSubTitle, translatedContent])

        results.subsections.push({ id: subsection.id, title: translatedSubTitle })
      }
    }

    res.json({
      success: true,
      targetLanguage,
      translated: {
        modules: 1,
        sections: results.sections.length,
        subsections: results.subsections.length
      },
      results
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
