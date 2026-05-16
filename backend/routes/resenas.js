const express = require('express');
const router  = express.Router();
const pool    = require('../db');

/* ══════════════════════════════
   GET /api/resenas/:tutorId
   Obtener reseñas de un tutor
   ══════════════════════════════ */
router.get('/:tutorId', async (req, res) => {
  const { tutorId } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT
        r.id,
        r.calificacion,
        r.comentario,
        r.created_at,
        u.nombre AS estudiante,
        m.nombre AS materia
      FROM resenas r
      JOIN estudiantes e ON e.id = r.estudiante_id
      JOIN usuarios u    ON u.id = e.usuario_id
      JOIN reservas res  ON res.id = r.reserva_id
      JOIN materias m    ON m.id = res.materia_id
      WHERE r.tutor_id = ?
      ORDER BY r.created_at DESC
    `, [tutorId]);

    // Promedio
    const [promedio] = await pool.query(
      'SELECT AVG(calificacion) AS promedio, COUNT(*) AS total FROM resenas WHERE tutor_id = ?',
      [tutorId]
    );

    res.json({
      promedio: parseFloat(promedio[0].promedio || 0).toFixed(1),
      total:    promedio[0].total,
      resenas:  rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/* ══════════════════════════════
   POST /api/resenas
   Crear una reseña
   Body: { reserva_id, estudiante_id, tutor_id, calificacion, comentario }
   ══════════════════════════════ */
router.post('/', async (req, res) => {
  const { reserva_id, estudiante_id, tutor_id, calificacion, comentario } = req.body;

  if (!reserva_id || !estudiante_id || !tutor_id || !calificacion) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  if (calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ error: 'La calificación debe ser entre 1 y 5.' });
  }

  try {
    // Verificar que no haya reseña ya
    const [existe] = await pool.query(
      'SELECT id FROM resenas WHERE reserva_id = ?',
      [reserva_id]
    );

    if (existe.length > 0) {
      return res.status(409).json({ error: 'Esta reserva ya fue calificada.' });
    }

    await pool.query(
      'INSERT INTO resenas (reserva_id, estudiante_id, tutor_id, calificacion, comentario) VALUES (?, ?, ?, ?, ?)',
      [reserva_id, estudiante_id, tutor_id, calificacion, comentario || null]
    );

    res.status(201).json({ mensaje: 'Reseña enviada correctamente.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
