const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

/* ══════════════════════════════
   MIDDLEWARES
   ══════════════════════════════ */
app.use(cors({
  origin: '*', // En producción cambia por tu dominio de Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ══════════════════════════════
   RUTAS
   ══════════════════════════════ */
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/tutores',  require('./routes/tutores'));
app.use('/api/reservas', require('./routes/reservas'));
app.use('/api/resenas',  require('./routes/resenas'));
app.use('/api/materias', require('./routes/materias'));

/* ══════════════════════════════
   RUTA BASE — verificar que corre
   ══════════════════════════════ */
app.get('/', (req, res) => {
  res.json({ mensaje: 'myTeacher API corriendo ✅', version: '1.0.0' });
});

/* ══════════════════════════════
   MANEJO DE ERRORES
   ══════════════════════════════ */
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

/* ══════════════════════════════
   INICIAR SERVIDOR
   ══════════════════════════════ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
