/**
 * Module Routes
 * CRUD operations for top-level content modules
 */

const express = require('express')
const router = express.Router()
const { query, transaction } = require('../db/connection')
const { authenticate, authorize } = require('../middleware/auth')

// GET all modules with sections count
router.get('/', async (req, res, next) => {
  try {
    const { status, includeArchived } = req.query

    let whereClause = includeArchived ? '' : "WHERE m.status != 'archived'"
    if (status && !includeArchived) {
      whereClause = `WHERE m.status = $1`
    }

    const sql = `
      SELECT
        m.*,
        COUNT(s.id) as section_count,
        COALESCE(json_agg(
          json_build_object('code', mt.language_code, 'title', mt.title)
        ) FILTER (WHERE mt.id IS NOT NULL), '[]') as translations
      FROM modules m
      LEFT JOIN sections s ON s.module_id = m.id
      LEFT JOIN module_translations mt ON mt.module_id = m.id
      ${whereClause}
      GROUP BY m.id
      ORDER BY m.sort_order ASC, m.created_at DESC
    `

    const result = status && !includeArchived
      ? await query(sql, [status])
      : await query(sql)

    res.json(result.rows)
  } catch (error) {
    next(error)
  }
})

// GET single module with full hierarchy
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { lang } = req.query

    // Get module
    const moduleResult = await query(
      'SELECT * FROM modules WHERE id = $1',
      [id]
    )

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Module not found' })
    }

    const module = moduleResult.rows[0]

    // Get sections with subsection counts
    const sectionsResult = await query(`
      SELECT
        s.*,
        COUNT(sub.id) as subsection_count
      FROM sections s
      LEFT JOIN subsections sub ON sub.section_id = s.id
      WHERE s.module_id = $1
      GROUP BY s.id
      ORDER BY s.sort_order ASC
    `, [id])

    module.sections = sectionsResult.rows

    // If language specified, include translations
    if (lang && lang !== 'en') {
      const translationResult = await query(
        'SELECT * FROM module_translations WHERE module_id = $1 AND language_code = $2',
        [id, lang]
      )
      if (translationResult.rows.length > 0) {
        module.translation = translationResult.rows[0]
      }
    }

    res.json(module)
  } catch (error) {
    next(error)
  }
})

// POST create module
router.post('/', authenticate, authorize(['admin', 'editor']), async (req, res, next) => {
  try {
    const { slug, title, description, icon, color, status } = req.body

    if (!slug || !title) {
      return res.status(400).json({ error: 'Slug and title are required' })
    }

    // Get max sort_order
    const maxOrder = await query('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM modules')

    const result = await query(`
      INSERT INTO modules (slug, title, description, icon, color, status, sort_order, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [slug, title, description, icon, color, status || 'draft', maxOrder.rows[0].next, req.user?.id])

    res.status(201).json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Module with this slug already exists' })
    }
    next(error)
  }
})

// PUT update module
router.put('/:id', authenticate, authorize(['admin', 'editor']), async (req, res, next) => {
  try {
    const { id } = req.params
    const { slug, title, description, icon, color, status } = req.body

    const result = await query(`
      UPDATE modules
      SET slug = COALESCE($1, slug),
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          icon = COALESCE($4, icon),
          color = COALESCE($5, color),
          status = COALESCE($6, status),
          updated_by = $7
      WHERE id = $8
      RETURNING *
    `, [slug, title, description, icon, color, status, req.user?.id, id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Module not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})

// PUT reorder modules
router.put('/reorder', authenticate, authorize(['admin', 'editor']), async (req, res, next) => {
  try {
    const { moduleIds } = req.body

    if (!Array.isArray(moduleIds)) {
      return res.status(400).json({ error: 'moduleIds must be an array' })
    }

    await transaction(async (client) => {
      for (let i = 0; i < moduleIds.length; i++) {
        await client.query(
          'UPDATE modules SET sort_order = $1 WHERE id = $2',
          [i, moduleIds[i]]
        )
      }
    })

    res.json({ success: true, message: 'Modules reordered successfully' })
  } catch (error) {
    next(error)
  }
})

// DELETE module
router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params
    const { permanent } = req.query

    if (permanent === 'true') {
      await query('DELETE FROM modules WHERE id = $1', [id])
    } else {
      // Soft delete - archive
      await query("UPDATE modules SET status = 'archived' WHERE id = $1", [id])
    }

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

module.exports = router
