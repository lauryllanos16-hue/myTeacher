/* ══════════════════════════════════════
   DATOS INICIALES
   ══════════════════════════════════════ */
const comentariosData = [
  {
    nombre: 'María López',
    estrellas: 5,
    materia: 'Matemáticas',
    fecha: '12 Marzo 2026',
    texto: '"El tutor explica muy bien y tiene mucha paciencia."'
  },
  {
    nombre: 'Carlos Pérez',
    estrellas: 4,
    materia: 'Álgebra',
    fecha: '5 Marzo 2026',
    texto: '"La clase fue clara y resolvió todas mis dudas."'
  },
  {
    nombre: 'Laura Gómez',
    estrellas: 5,
    materia: 'Cálculo',
    fecha: '2 Marzo 2026',
    texto: '"Muy recomendado, explica paso a paso."'
  },
  {
    nombre: 'Andrés Torres',
    estrellas: 4,
    materia: 'Física',
    fecha: '28 Feb 2026',
    texto: '"Muy buen tutor, puntual y claro en sus explicaciones."'
  },
  {
    nombre: 'Sofía Martínez',
    estrellas: 5,
    materia: 'Química',
    fecha: '20 Feb 2026',
    texto: '"Excelente metodología, aprendí mucho en poco tiempo."'
  },
  {
    nombre: 'Diego Ramírez',
    estrellas: 3,
    materia: 'Trigonometría',
    fecha: '15 Feb 2026',
    texto: '"Buena clase, aunque a veces va un poco rápido."'
  }
];

const ITEMS_POR_PAGINA = 3;
let mostrandoHasta = ITEMS_POR_PAGINA;

/* ══════════════════════════════════════
   RENDERIZAR COMENTARIOS
   ══════════════════════════════════════ */
function renderComentarios() {
  const lista = document.getElementById('listaComentarios');
  const btnVerMas = document.getElementById('btnVerMas');
  const slice = comentariosData.slice(0, mostrandoHasta);

  lista.innerHTML = slice.map(c => `
    <div class="comentario-item">
      <div class="comentario-header">
        <span class="comentario-nombre">${c.nombre}</span>
        <span class="comentario-estrellas">${'★'.repeat(c.estrellas)}${'☆'.repeat(5 - c.estrellas)}</span>
      </div>
      <p class="comentario-meta">${c.materia} – ${c.fecha}</p>
      <p class="comentario-texto">${c.texto}</p>
    </div>
  `).join('');

  btnVerMas.style.display = mostrandoHasta >= comentariosData.length ? 'none' : 'inline-block';
}

function verMas() {
  mostrandoHasta += ITEMS_POR_PAGINA;
  renderComentarios();
}

/* ══════════════════════════════════════
   ESTRELLAS INTERACTIVAS
   ══════════════════════════════════════ */
let calificacionSeleccionada = 0;

const estrellas = document.querySelectorAll('#starSelector .star');

estrellas.forEach(star => {
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.val);
    estrellas.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= val));
  });

  star.addEventListener('mouseleave', () => {
    estrellas.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= calificacionSeleccionada));
  });

  star.addEventListener('click', () => {
    calificacionSeleccionada = parseInt(star.dataset.val);
    estrellas.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= calificacionSeleccionada));
  });
});

/* ══════════════════════════════════════
   ENVIAR COMENTARIO
   ══════════════════════════════════════ */
function enviarComentario() {
  const texto = document.getElementById('inputComentario').value.trim();

  if (calificacionSeleccionada === 0) {
    alert('Por favor selecciona una calificación.');
    return;
  }
  if (!texto) {
    alert('Por favor escribe un comentario.');
    return;
  }

  const nuevo = {
    nombre: 'Tú',
    estrellas: calificacionSeleccionada,
    materia: 'Tu materia',
    fecha: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
    texto: `"${texto}"`
  };

  comentariosData.unshift(nuevo);
  mostrandoHasta = ITEMS_POR_PAGINA;

  // Actualizar promedio
  const promedio = (comentariosData.reduce((acc, c) => acc + c.estrellas, 0) / comentariosData.length).toFixed(1);
  document.getElementById('promedioGlobal').textContent = promedio;
  document.getElementById('totalResenas').textContent = comentariosData.length;

  // Limpiar formulario
  document.getElementById('inputComentario').value = '';
  calificacionSeleccionada = 0;
  estrellas.forEach(s => s.classList.remove('active'));

  renderComentarios();
}

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
renderComentarios();