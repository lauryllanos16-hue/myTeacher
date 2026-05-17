const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

/* ══════════════════════════════
   MIDDLEWARES
   ══════════════════════════════ */
app.use(cors({
  origin: function(origin, callback) {
    // Permitir cualquier subdominio de vercel.app y localhost
    if (!origin || 
        origin.includes('vercel.app') || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
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
app.use('/api/usuarios', require('./routes/usuarios'));


/* ══════════════════════════════
   RUTA BASE
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