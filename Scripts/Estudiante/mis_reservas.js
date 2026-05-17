// v2
const usuario = JSON.parse(sessionStorage.getItem('usuario'));
if (!usuario) window.location.href = '/HTML/Autenticacion/inicio_sesion.html';
const RESERVAS_POR_PAGINA = 2;
let reservasMostradas = RESERVAS_POR_PAGINA;
let reservasData = [];

// ---- Cargar reservas desde backend ----
async function cargarReservas() {
  const container = document.getElementById('reservasContainer');
  try {
    const data = await window.myTeacherAPI.getReservas(usuario.perfilId);
    if (!data || data.error || !data.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <p>No tienes reservas activas por el momento.</p>
        </div>`;
      document.getElementById('btnVerMas').style.display = 'none';
      return;
    }
    reservasData = data;
    renderReservas();
  } catch (err) {
    container.innerHTML = '<p style="text-align:center;color:#888;">Error al cargar reservas.</p>';
  }
}
if (!fechaStr) return '—';
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

  function estadoInfo(estado) {
  const map = {
    proxima:   { label: 'Próxima',   clase: 'proxima'   },
    activa:    { label: 'Activa',    clase: 'activa'    },
    cancelada: { label: 'Cancelada', clase: 'cancelada' },
    Cancelada: { label: 'Cancelada', clase: 'cancelada' },
  };
  return map[estado] || map['proxima'];
}

function renderReservas() {
  const container = document.getElementById('reservasContainer');
  const visibles = reservasData.slice(0, reservasMostradas);

  container.innerHTML = visibles.map((r, i) => {
    const est = estadoInfo(r.estado);
    const cancelada = r.estado === 'cancelada' || r.estado === 'Cancelada';
    return `
      <div class="section-card" id="card-${i}">
        <div class="info-grid">
          <div class="info-row">
            <div class="info-cell">Tutor: <strong>${r.tutor}</strong></div>
            <div class="info-cell">Materia: <strong>${r.materia}</strong></div>
          </div>
          <div class="info-row">
           <div class="info-cell">Fecha: <strong>${formatearFecha(r.fecha)}</strong></div>
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
        <div class="btn-row" style="justify-content:center;">
          <button class="btn btn-primary" onclick="abrirModalUnirse(${i})"
            ${cancelada ? 'disabled style="background:#e8e8e8;color:#999;cursor:not-allowed;"' : ''}>
            Unirse a la clase
          </button>
          <button class="btn ${cancelada ? 'btn-disabled' : 'btn-primary'}"
            onclick="${cancelada ? '' : `abrirModalCancelar(${i})`}"
            ${cancelada ? 'disabled' : ''}>
            ${cancelada ? 'Cancelada' : 'Cancelar'}
          </button>
        </div>
      </div>`;
  }).join('');

  document.getElementById('btnVerMas').style.display =
    reservasMostradas >= reservasData.length ? 'none' : 'inline-block';
}

function verMas() {
  reservasMostradas += RESERVAS_POR_PAGINA;
  renderReservas();
}

// ---- Cancelar ----
let indiceACancelar = null;

function abrirModalCancelar(i) {
  indiceACancelar = i;
  const r = reservasData[i];
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

async function confirmarCancelar() {
  if (indiceACancelar !== null) {
    const r = reservasData[indiceACancelar];
    try {
      const datos = await window.myTeacherAPI.cancelarReserva(r.id);
      if (datos.error) { alert(datos.error); return; }
      cerrarModalCancelar();
      await cargarReservas();
    } catch (err) {
      alert('No se pudo cancelar. Intenta de nuevo.');
    }
  }
}

document.getElementById('modalCancelar').addEventListener('click', function(e) {
  if (e.target === this) cerrarModalCancelar();
});

// ---- Unirse ----
let indiceUnirse = null;

function abrirModalUnirse(i) {
  indiceUnirse = i;
  const r = reservasData[i];
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
    const enlace = reservasData[indiceUnirse].enlace_clase;
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

// ---- Iniciar ----
cargarReservas();