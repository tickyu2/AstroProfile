/**
 * Section Routes
 * CRUD operations for sections within modules
 */

const express = require('express')
const router = express.Router()
const { query, transaction } = require('../db/connection')
const { authenticate, authorize } = require('../middleware/auth')

// GET sections by module
router.get('/module/:moduleId', async (req, res, next) => {
  try {
    const { moduleId } = req.params
    const { status } = req.query

    let whereClause = 'WHERE s.module_id = $1'
    const params = [moduleId]

    if (status) {
      whereClause += ' AND s.status = $2'
      params.push(status)
    }

    const result = await query(`
      SELECT
        s.*,
        COUNT(sub.id) as subsection_count
      FROM sections s
      LEFT JOIN subsections sub ON sub.section_id = s.id
      ${whereClause}
      GROUP BY s.id
      ORDER BY s.sort_order ASC
    `, params)

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
})

// GET single section with subsections
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { lang } = req.query

    const sectionResult = await query(
      'SELECT * FROM sections WHERE id = $1',
      [id]
    )

    if (sectionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' })
    }

    const section = sectionResult.rows[0]

    // Get subsections
    const subsectionsResult = await query(`
      SELECT * FROM subsections
      WHERE section_id = $1
      ORDER BY sort_order ASC
    `, [id])

    section.subsections = subsectionsResult.rows

    // If language specified, include translations
    if (lang && lang !== 'en') {
      const translationResult = await query(
        'SELECT * FROM section_translations WHERE section_id = $1 AND language_code = $2',
        [id, lang]
      )
      if (translationResult.rows.length > 0) {
        section.translation = translationResult.rows[0]
      }
    }

    res.json(section)
  } catch (error) {
    next(error)
  }
})

// POST create section
router.post('/', authenticate, authorize(['admin', 'editor']), async (req, res, next) => {
  try {
    const { module_id, slug, title, description, icon, status } = req.body

    if (!module_id || !slug || !title) {
      return res.status(400).json({ error: 'module_id, slug, and title are required' })
    }

    // Get max sort_order for this module
    const maxOrder = await query(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM sections WHERE module_id = $1',
      [module_id]
    )

    const result = await query(`
      INSERT INTO sections (module_id, slug, title, description, icon, status, sort_order, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [module_id, slug, title, description, icon, status || 'draft', maxOrder.rows[0].next, req.user?.id])

    res.status(201).json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Section with this slug already exists in this module' })
    }
    next(error)
  }
})

// PUT update section
router.put('/:id', authenticate, authorize(['admin', 'editor']), async (req, res, next) => {
  try {
    const { id } = req.params
    const { slug, title, description, icon, status } = req.body

    const result = await query(`
      UPDATE sections
      SET slug = COALESCE($1, slug),
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          icon = COALESCE($4, icon),
          status = COALESCE($5, status),
          updated_by = $6
      WHERE id = $7
      RETURNING *
    `, [slug, title, description, icon, status, req.user?.id, id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

// PUT reorder sections within a module
router.put('/reorder/:moduleId', authenticate, authorize(['admin', 'editor']), async (req, res, next) => {
  try {
    const { moduleId } = req.params
    const { sectionIds } = req.body

    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({ error: 'sectionIds must be an array' })
    }

    await transaction(async (client) => {
      for (let i = 0; i < sectionIds.length; i++) {
        await client.query(
          'UPDATE sections SET sort_order = $1 WHERE id = $2 AND module_id = $3',
          [i, sectionIds[i], moduleId]
        )
      }
    })

    res.json({ success: true, message: 'Sections reordered successfully' })
  } catch (error) {
    next(error)
  }
})

// DELETE section
router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params
    const { permanent } = req.query

    if (permanent === 'true') {
      await query('DELETE FROM sections WHERE id = $1', [id])
    } else {
      await query("UPDATE sections SET status = 'archived' WHERE id = $1", [id])
    }

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

module.exports = router
