// ---- Obtener parámetros de la URL ----
const params = new URLSearchParams(window.location.search);
const reservaId = params.get('reservaId');
const tutorNombre = params.get('tutor');
const materia = params.get('materia');
const params = new URLSearchParams(window.location.search);
const reservaId = params.get('reservaId');
const tutorId = params.get('tutorId'); // ← viene de la URL
const usuario = JSON.parse(sessionStorage.getItem('usuario'));
if (!usuario) window.location.href = '/HTML/Autenticacion/inicio_sesion.html';

const ITEMS_POR_PAGINA = 3;
let mostrandoHasta = ITEMS_POR_PAGINA;
let resenasData = [];

// ---- Cargar reseñas del tutor ----
async function cargarResenas() {
  if (!tutorId) return;
  try {
    const datos = await window.myTeacherAPI.getResenas(tutorId);
    resenasData = datos.resenas || [];
    document.getElementById('promedioGlobal').textContent =
      datos.promedio || '0.0';
    document.getElementById('totalResenas').textContent = datos.total || 0;
    renderComentarios();
  } catch (err) {
    console.error('Error cargando reseñas:', err);
  }
}

function renderComentarios() {
  const lista = document.getElementById('listaComentarios');
  const btnVerMas = document.getElementById('btnVerMas');
  const slice = resenasData.slice(0, mostrandoHasta);

  if (slice.length === 0) {
    lista.innerHTML =
      '<p style="text-align:center;color:#888;">No hay reseñas todavía.</p>';
    btnVerMas.style.display = 'none';
    return;
  }

  lista.innerHTML = slice
    .map(
      (c) => `
    <div class="comentario-item">
      <div class="comentario-header">
        <span class="comentario-nombre">${c.estudiante}</span>
        <span class="comentario-estrellas">${'★'.repeat(c.calificacion)}${'☆'.repeat(5 - c.calificacion)}</span>
      </div>
      <p class="comentario-meta">${c.materia} – ${new Date(c.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p class="comentario-texto">"${c.comentario || ''}"</p>
    </div>
  `,
    )
    .join('');

  btnVerMas.style.display =
    mostrandoHasta >= resenasData.length ? 'none' : 'inline-block';
}

function verMas() {
  mostrandoHasta += ITEMS_POR_PAGINA;
  renderComentarios();
}

// ---- Estrellas ----
let calificacionSeleccionada = 0;
const estrellas = document.querySelectorAll('#starSelector .star');

estrellas.forEach((star) => {
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.val);
    estrellas.forEach((s) =>
      s.classList.toggle('active', parseInt(s.dataset.val) <= val),
    );
  });
  star.addEventListener('mouseleave', () => {
    estrellas.forEach((s) =>
      s.classList.toggle(
        'active',
        parseInt(s.dataset.val) <= calificacionSeleccionada,
      ),
    );
  });
  star.addEventListener('click', () => {
    calificacionSeleccionada = parseInt(star.dataset.val);
    estrellas.forEach((s) =>
      s.classList.toggle(
        'active',
        parseInt(s.dataset.val) <= calificacionSeleccionada,
      ),
    );
  });
});

// ---- Enviar reseña ----
async function enviarComentario() {
  const texto = document.getElementById('inputComentario').value.trim();
  const datos = await window.myTeacherAPI.crearResena({
    reserva_id: parseInt(reservaId),
    estudiante_id: usuario.perfilId,
    tutor_id: parseInt(tutorId),
    calificacion: calificacionSeleccionada,
    comentario: texto,
  });
  if (calificacionSeleccionada === 0) {
    alert('Por favor selecciona una calificación.');
    return;
  }
  if (!texto) {
    alert('Por favor escribe un comentario.');
    return;
  }
  if (!reservaId) {
    alert('No se encontró la reserva.');
    return;
  }

  try {
    const datos = await window.myTeacherAPI.crearResena({
      reserva_id: parseInt(reservaId),
      estudiante_id: usuario.perfilId,
      tutor_id: window._tutorId,
      calificacion: calificacionSeleccionada,
      comentario: texto,
    });

    if (datos.error) {
      alert(datos.error);
      return;
    }

    alert('¡Reseña enviada correctamente!');
    document.getElementById('inputComentario').value = '';
    calificacionSeleccionada = 0;
    estrellas.forEach((s) => s.classList.remove('active'));
    await cargarResenas();
  } catch (err) {
    alert('No se pudo enviar la reseña. Intenta de nuevo.');
  }
}

// ---- Iniciar ----
// Agregar api.js al HTML antes de este script
cargarResenas();
