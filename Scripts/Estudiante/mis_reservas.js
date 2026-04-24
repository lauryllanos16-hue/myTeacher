/* ══════════════════════════════════════
   DATOS DE RESERVAS
   ══════════════════════════════════════ */
const reservas = [
  {
    tutor:     'Lionel Messi',
    materia:   'Matematicas',
    fecha:     '12 Marzo - 4:00 PM',
    nivel:     'Universitario',
    modalidad: 'Presencial',
    estado:    'proxima',
    enlace:    '#'
  },
  {
    tutor:     'Maria Fernandez',
    materia:   'Coreano',
    fecha:     '15 Marzo - 6:00 PM',
    nivel:     'Universitario',
    modalidad: 'Virtual',
    estado:    'proxima',
    enlace:    '#'
  }
];

const RESERVAS_POR_PAGINA = 2;
let reservasMostradas = RESERVAS_POR_PAGINA;

/* ══════════════════════════════════════
   ESTADO → TEXTO Y COLOR
   ══════════════════════════════════════ */
function estadoInfo(estado) {
  const map = {
    proxima:   { label: 'Próxima',   clase: 'proxima'   },
    activa:    { label: 'Activa',    clase: 'activa'    },
    cancelada: { label: 'Cancelada', clase: 'cancelada' }
  };
  return map[estado] || map['proxima'];
}

/* ══════════════════════════════════════
   RENDERIZAR TARJETAS
   ══════════════════════════════════════ */
function renderReservas() {
  const container = document.getElementById('reservasContainer');
  const visibles  = reservas.slice(0, reservasMostradas);

  if (reservas.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">&#128197;</div>
        <p>No tienes reservas activas por el momento.</p>
      </div>`;
    document.getElementById('btnVerMas').style.display = 'none';
    return;
  }

  container.innerHTML = visibles.map((r, i) => {
    const est = estadoInfo(r.estado);
    const cancelada = r.estado === 'cancelada';
    return `<div class="section-card" id="card-${i}">

  <div class="info-grid">
    <div class="info-row">
      <div class="info-cell">Tutor: <strong>${r.tutor}</strong></div>
      <div class="info-cell">Materia: <strong>${r.materia}</strong></div>
    </div>
    <div class="info-row">
      <div class="info-cell">Fecha: <strong>${r.fecha}</strong></div>
      <div class="info-cell">Nivel: <strong>${r.nivel}</strong></div>
    </div>
    <div class="info-row">
      <div class="info-cell">Modalidad: <strong>${r.modalidad}</strong></div>
      <div class="info-cell">
        Estado:&nbsp;
        <span style="display:inline-flex;align-items:center;gap:6px;">
          <span class="estado-dot ${est.clase}"></span>
          <strong>${est.label}</strong>
        </span>
      </div>
    </div>
  </div>

  <div class="btn-row" style="justify-content: center;">
    <button
      class="btn btn-primary"
      onclick="abrirModalUnirse(${i})"
      ${cancelada ? 'disabled style="background:#e8e8e8;color:#999;cursor:not-allowed;"' : ''}>
      Unirse a la clase
    </button>
    <button
      class="btn ${cancelada ? 'btn-disabled' : 'btn-primary'}"
      onclick="${cancelada ? '' : `abrirModalCancelar(${i})`}"
      ${cancelada ? 'disabled' : ''}>
      ${cancelada ? 'Cancelada' : 'Cancelar'}
    </button>
  </div>

</div>`;
  }).join('');

  // Mostrar/ocultar botón Ver más
  document.getElementById('btnVerMas').style.display =
    reservasMostradas >= reservas.length ? 'none' : 'inline-block';
}

renderReservas();

/* ══════════════════════════════════════
   VER MÁS
   ══════════════════════════════════════ */
function verMas() {
  reservasMostradas += RESERVAS_POR_PAGINA;
  renderReservas();
}

/* ══════════════════════════════════════
   MODAL CANCELAR
   ══════════════════════════════════════ */
let indiceACancelar = null;

function abrirModalCancelar(i) {
  indiceACancelar = i;
  const r = reservas[i];
  document.getElementById('modalCancelarDetalle').innerHTML =
    `<strong>Tutor:</strong> ${r.tutor}<br>
     <strong>Materia:</strong> ${r.materia}<br>
     <strong>Fecha:</strong> ${r.fecha}`;
  document.getElementById('modalCancelar').classList.add('active');
}

function cerrarModalCancelar() {
  document.getElementById('modalCancelar').classList.remove('active');
  indiceACancelar = null;
}

function confirmarCancelar() {
  if (indiceACancelar !== null) {
    reservas[indiceACancelar].estado = 'cancelada';
    cerrarModalCancelar();
    renderReservas();
  }
}

document.getElementById('modalCancelar').addEventListener('click', function(e) {
  if (e.target === this) cerrarModalCancelar();
});

/* ══════════════════════════════════════
   MODAL UNIRSE
   ══════════════════════════════════════ */
let indiceUnirse = null;

function abrirModalUnirse(i) {
  indiceUnirse = i;
  const r = reservas[i];
  document.getElementById('modalUnirseDetalle').innerHTML =
    `<strong>Tutor:</strong> ${r.tutor}<br>
     <strong>Materia:</strong> ${r.materia}<br>
     <strong>Fecha:</strong> ${r.fecha}<br>
     <strong>Modalidad:</strong> ${r.modalidad}`;
  document.getElementById('modalUnirse').classList.add('active');
}

function cerrarModalUnirse() {
  document.getElementById('modalUnirse').classList.remove('active');
  indiceUnirse = null;
}

function abrirEnlace() {
  if (indiceUnirse !== null) {
    const enlace = reservas[indiceUnirse].enlace;
    if (enlace && enlace !== '#') {
      window.open(enlace, '_blank');
    } else {
      alert('El enlace de la clase no está disponible aún.');
    }
  }
  cerrarModalUnirse();
}

document.getElementById('modalUnirse').addEventListener('click', function(e) {
  if (e.target === this) cerrarModalUnirse();
});