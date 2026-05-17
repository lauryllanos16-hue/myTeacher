const express = require('express');
const router  = express.Router();
const pool    = require('../db');

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, nivel_educativo } = req.body;
  try {
    if (nombre) {
      await pool.query('UPDATE usuarios SET nombre = ? WHERE id = ?', [nombre, id]);
    }
    if (nivel_educativo) {
      await pool.query('UPDATE estudiantes SET nivel_educativo = ? WHERE usuario_id = ?', [nivel_educativo, id]);
    }
    res.json({ mensaje: 'Perfil actualizado.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});
router.get('/ping', (req, res) => {
  res.json({ ok: true });
});
module.exports = router;
