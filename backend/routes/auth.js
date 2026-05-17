const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');

/* ══════════════════════════════
   POST /api/auth/login
   Body: { correo, password }
   ══════════════════════════════ */
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res
      .status(400)
      .json({ error: 'Correo y contraseña son requeridos.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [
      correo,
    ]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: 'Correo o contraseña incorrectos.' });
    }

    const usuario = rows[0];

    // Comparar password
    const valido = await bcrypt.compare(password, usuario.password_hash);
    if (!valido) {
      return res
        .status(401)
        .json({ error: 'Correo o contraseña incorrectos.' });
    }

    // Devolver datos sin el hash
    // Buscar perfilId según rol
    let perfilId = null;
    if (usuario.rol === 'estudiante') {
      const [est] = await pool.query(
        'SELECT id FROM estudiantes WHERE usuario_id = ?',
        [usuario.id],
      );
      if (est.length > 0) perfilId = est[0].id;
    } else if (usuario.rol === 'tutor') {
      const [tut] = await pool.query(
        'SELECT id FROM tutores WHERE usuario_id = ?',
        [usuario.id],
      );
      if (tut.length > 0) perfilId = tut[0].id;
    }

    // Devolver datos sin el hash
    res.json({
      id: usuario.id,
      perfilId,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      foto: usuario.foto_perfil,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/* ══════════════════════════════
   POST /api/auth/registro
   Body: { nombre, correo, password, rol, nivel_educativo? }
   ══════════════════════════════ */
router.post('/registro', async (req, res) => {
  const { nombre, correo, password, rol, nivel_educativo } = req.body;

  if (!nombre || !correo || !password || !rol) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    // Verificar si ya existe
    const [existe] = await pool.query(
      'SELECT id FROM usuarios WHERE correo = ?',
      [correo],
    );

    if (existe.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado.' });
    }

    // Hashear password
    const hash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, rol],
    );

    const usuarioId = result.insertId;

    // Crear perfil según rol
    if (rol === 'estudiante') {
      await pool.query(
        'INSERT INTO estudiantes (usuario_id, nivel_educativo) VALUES (?, ?)',
        [usuarioId, nivel_educativo || 'Universitario'],
      );
    } else if (rol === 'tutor') {
      await pool.query('INSERT INTO tutores (usuario_id) VALUES (?)', [
        usuarioId,
      ]);
    }

    res.status(201).json({
      id: usuarioId,
      nombre,
      correo,
      rol,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
