const express = require('express');
const router  = express.Router();
const pool    = require('../db');

/* ══════════════════════════════
   GET /api/tutores
   Obtener todos los tutores con sus materias
   Query params: materia, modalidad, nivel
   ══════════════════════════════ */
router.get('/', async (req, res) => {
  const { materia, modalidad } = req.query;

  try {
    let query = `
      SELECT
        u.id,
        u.nombre,
        u.correo,
        u.foto_perfil,
        t.id         AS tutor_id,
        t.descripcion,
        t.precio_hora,
        t.modalidad,
        t.ubicacion,
        t.calificacion,
        t.total_resenas,
        GROUP_CONCAT(m.nombre SEPARATOR ', ') AS materias
      FROM usuarios u
      JOIN tutores t ON t.usuario_id = u.id
      LEFT JOIN tutor_materias tm ON tm.tutor_id = t.id
      LEFT JOIN materias m ON m.id = tm.materia_id
      WHERE u.rol = 'tutor'
    `;

    const params = [];

    if (modalidad) {
      query += ' AND t.modalidad = ?';
      params.push(modalidad);
    }

    if (materia) {
      query += ' AND t.id IN (SELECT tm2.tutor_id FROM tutor_materias tm2 JOIN materias m2 ON m2.id = tm2.materia_id WHERE m2.nombre = ?)';
      params.push(materia);
    }

    query += ' GROUP BY t.id ORDER BY t.calificacion DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/* ══════════════════════════════
   GET /api/tutores/:id
   Obtener un tutor por ID con disponibilidad y reseñas
   ══════════════════════════════ */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Info del tutor
    const [tutor] = await pool.query(`
      SELECT
        u.id, u.nombre, u.correo, u.foto_perfil,
        t.id AS tutor_id, t.descripcion, t.precio_hora,
        t.modalidad, t.ubicacion, t.calificacion, t.total_resenas,
        GROUP_CONCAT(m.nombre SEPARATOR ', ') AS materias
      FROM usuarios u
      JOIN tutores t ON t.usuario_id = u.id
      LEFT JOIN tutor_materias tm ON tm.tutor_id = t.id
      LEFT JOIN materias m ON m.id = tm.materia_id
      WHERE u.id = ?
      GROUP BY t.id
    `, [id]);

    if (tutor.length === 0) {
      return res.status(404).json({ error: 'Tutor no encontrado.' });
    }

    // Disponibilidad
    const [disponibilidad] = await pool.query(
      'SELECT dia, hora_inicio, hora_fin FROM disponibilidad WHERE tutor_id = ? ORDER BY FIELD(dia, "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo")',
      [tutor[0].tutor_id]
    );

    // Reseñas
    const [resenas] = await pool.query(`
      SELECT r.calificacion, r.comentario, r.created_at, u.nombre AS estudiante
      FROM resenas r
      JOIN estudiantes e ON e.id = r.estudiante_id
      JOIN usuarios u ON u.id = e.usuario_id
      WHERE r.tutor_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [tutor[0].tutor_id]);

    res.json({
      ...tutor[0],
      disponibilidad,
      resenas,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/* ══════════════════════════════
   PUT /api/tutores/:id
   Actualizar perfil del tutor
   Body: { descripcion, precio_hora, modalidad, ubicacion, materias[] }
   ══════════════════════════════ */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio_hora, modalidad, ubicacion, materias } = req.body;

  try {
    // Actualizar usuario
    if (nombre) {
      await pool.query(
        'UPDATE usuarios SET nombre = ? WHERE id = ?',
        [nombre, id]
      );
    }

    // Obtener tutor_id
    const [t] = await pool.query(
      'SELECT id FROM tutores WHERE usuario_id = ?',
      [id]
    );

    if (t.length === 0) return res.status(404).json({ error: 'Tutor no encontrado.' });

    const tutorId = t[0].id;

    await pool.query(
      'UPDATE tutores SET descripcion = ?, precio_hora = ?, modalidad = ?, ubicacion = ? WHERE id = ?',
      [descripcion, precio_hora, modalidad, ubicacion, tutorId]
    );

    // Actualizar materias si se enviaron
    if (materias && Array.isArray(materias)) {
      await pool.query('DELETE FROM tutor_materias WHERE tutor_id = ?', [tutorId]);
      for (const materia of materias) {
        const [m] = await pool.query('SELECT id FROM materias WHERE nombre = ?', [materia]);
        if (m.length > 0) {
          await pool.query(
            'INSERT INTO tutor_materias (tutor_id, materia_id) VALUES (?, ?)',
            [tutorId, m[0].id]
          );
        }
      }
    }

    res.json({ mensaje: 'Perfil actualizado correctamente.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
