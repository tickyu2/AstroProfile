/**
 * Subsection Routes
 * CRUD operations for subsections (actual content) within sections
 */

const express = require('express')
const router = express.Router()
const { query, transaction } = require('../db/connection')
const { authenticate, authorize } = require('../middleware/auth')
const { marked } = require('marked')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

// Configure marked for safe rendering
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true
})

// GET subsections by section
router.get('/section/:sectionId', async (req, res, next) => {
  try {
    const { sectionId } = req.params
    const { status } = req.query

    let whereClause = 'WHERE section_id = $1'
    const params = [sectionId]

    if (status) {
      whereClause += ' AND status = $2'
      params.push(status)
    }

    const result = await query(`
      SELECT * FROM subsections
      ${whereClause}
      ORDER BY sort_order ASC
    `, params)

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
})

// GET single subsection with rendered content
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { lang, render } = req.query

    const result = await query(
      'SELECT * FROM subsections WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subsection not found' })
    }

    const subsection = result.rows[0]

    // Render markdown to HTML if requested
    if (render === 'true' && subsection.content) {
      const rawHtml = marked(subsection.content)
      subsection.rendered_content = DOMPurify.sanitize(rawHtml)
    }

    // If language specified, include translations
    if (lang && lang !== 'en') {
      const translationResult = await query(
        'SELECT * FROM subsection_translations WHERE subsection_id = $1 AND language_code = $2',
        [id, lang]
      )
      if (translationResult.rows.length > 0) {
        subsection.translation = translationResult.rows[0]
        // Render translated content if requested
        if (render === 'true' && subsection.translation.content) {
          const rawHtml = marked(subsection.translation.content)
          subsection.translation.rendered_content = DOMPurify.sanitize(rawHtml)
        }
      }
    }

    res.json(subsection)
  } catch (error) {
    next(error)
  }
})

// POST create subsection
router.post('/', authenticate, authorize(['admin', 'editor']), async (req, res, next) => {
  try {
    const {
      section_id, slug, title, content, content_type,
      video_url, duration_minutes, difficulty, status
    } = req.body

    if (!section_id || !slug || !title) {
      return res.status(400).json({ error: 'section_id, slug, and title are required' })
    }

    // Get max sort_order for this section
    const maxOrder = await query(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM subsections WHERE section_id = $1',
      [section_id]
    )

    const result = await query(`
      INSERT INTO subsections (
        section_id, slug, title, content, content_type,
        video_url, duration_minutes, difficulty, status, sort_order, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      section_id, slug, title, content, content_type || 'markdown',
      video_url, duration_minutes, difficulty, status || 'draft',
      maxOrder.rows[0].next, req.user?.id
    ])

    res.status(201).json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Subsection with this slug already exists in this section' })
    }
    next(error)
  }
})

// PUT update subsection
router.put('/:id', authenticate, authorize(['admin', 'editor']), async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      slug, title, content, content_type,
      video_url, duration_minutes, difficulty, status
    } = req.body

    const result = await query(`
      UPDATE subsections
      SET slug = COALESCE($1, slug),
          title = COALESCE($2, title),
          content = COALESCE($3, content),
          content_type = COALESCE($4, content_type),
          video_url = COALESCE($5, video_url),
          duration_minutes = COALESCE($6, duration_minutes),
          difficulty = COALESCE($7, difficulty),
          status = COALESCE($8, status),
          updated_by = $9
      WHERE id = $10
      RETURNING *
    `, [slug, title, content, content_type, video_url, duration_minutes, difficulty, status, req.user?.id, id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subsection not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

// PUT reorder subsections within a section
router.put('/reorder/:sectionId', authenticate, authorize(['admin', 'editor']), async (req, res, next) => {
  try {
    const { sectionId } = req.params
    const { subsectionIds } = req.body

    if (!Array.isArray(subsectionIds)) {
      return res.status(400).json({ error: 'subsectionIds must be an array' })
    }

    await transaction(async (client) => {
      for (let i = 0; i < subsectionIds.length; i++) {
        await client.query(
          'UPDATE subsections SET sort_order = $1 WHERE id = $2 AND section_id = $3',
          [i, subsectionIds[i], sectionId]
        )
      }
    })

    res.json({ success: true, message: 'Subsections reordered successfully' })
  } catch (error) {
    next(error)
  }
})

// DELETE subsection
router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params
    const { permanent } = req.query

    if (permanent === 'true') {
      await query('DELETE FROM subsections WHERE id = $1', [id])
    } else {
      await query("UPDATE subsections SET status = 'archived' WHERE id = $1", [id])
    }

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// POST render markdown preview
router.post('/preview', authenticate, async (req, res, next) => {
  try {
    const { markdown } = req.body

    if (!markdown) {
      return res.json({ html: '' })
    }

    const rawHtml = marked(markdown)
    const html = DOMPurify.sanitize(rawHtml)

    res.json({ html })
  } catch (error) {
    next(error)
  }
})

module.exports = router
