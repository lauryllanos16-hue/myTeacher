const express = require('express');
const router  = express.Router();
const pool    = require('../db');

/* ══════════════════════════════
   GET /api/reservas/:estudianteId
   Obtener reservas de un estudiante
   ══════════════════════════════ */
router.get('/:estudianteId', async (req, res) => {
  const { estudianteId } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT
        r.id,
        r.fecha,
        r.hora,
        r.modalidad,
        r.estado,
        r.enlace_clase,
        u.nombre  AS tutor,
        m.nombre  AS materia,
        e_info.nivel_educativo AS nivel
      FROM reservas r
      JOIN tutores t   ON t.id = r.tutor_id
      JOIN usuarios u  ON u.id = t.usuario_id
      JOIN materias m  ON m.id = r.materia_id
      JOIN estudiantes e_info ON e_info.id = r.estudiante_id
      WHERE r.estudiante_id = ?
      ORDER BY r.fecha DESC, r.hora DESC
    `, [estudianteId]);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/* ══════════════════════════════
   POST /api/reservas
   Crear una nueva reserva
   Body: { estudiante_id, tutor_id, materia_id, fecha, hora, modalidad }
   ══════════════════════════════ */
router.post('/', async (req, res) => {
  const { estudiante_id, tutor_id, materia_id, fecha, hora, modalidad } = req.body;

  if (!estudiante_id || !tutor_id || !materia_id || !fecha || !hora || !modalidad) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO reservas (estudiante_id, tutor_id, materia_id, fecha, hora, modalidad) VALUES (?, ?, ?, ?, ?, ?)',
      [estudiante_id, tutor_id, materia_id, fecha, hora, modalidad]
    );

    res.status(201).json({
      id: result.insertId,
      mensaje: 'Reserva creada correctamente.',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/* ══════════════════════════════
   PUT /api/reservas/:id/cancelar
   Cancelar una reserva
   ══════════════════════════════ */
router.put('/:id/cancelar', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE reservas SET estado = 'Cancelada' WHERE id = ?",
      [id]
    );
    res.json({ mensaje: 'Reserva cancelada.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/* ══════════════════════════════
   GET /api/reservas/tutor/:tutorId
   Obtener reservas de un tutor (para vista del tutor)
   ══════════════════════════════ */
router.get('/tutor/:tutorId', async (req, res) => {
  const { tutorId } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT
        r.id,
        r.fecha,
        r.hora,
        r.modalidad,
        r.estado,
        r.enlace_clase,
        u.nombre AS estudiante,
        m.nombre AS materia,
        e.nivel_educativo AS nivel
      FROM reservas r
      JOIN estudiantes e ON e.id = r.estudiante_id
      JOIN usuarios u    ON u.id = e.usuario_id
      JOIN materias m    ON m.id = r.materia_id
      WHERE r.tutor_id = ?
      ORDER BY r.fecha ASC, r.hora ASC
    `, [tutorId]);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
