const express = require('express');
const router  = express.Router();
const pool    = require('../db');

/* ══════════════════════════════
   GET /api/materias
   Obtener todas las materias
   ══════════════════════════════ */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM materias ORDER BY nombre');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
