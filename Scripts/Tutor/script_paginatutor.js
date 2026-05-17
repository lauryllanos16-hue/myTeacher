// ── Obtener tutor_id de la sesión ──────────────────────────────────────────────
const user     = JSON.parse(sessionStorage.getItem('usuario'));
const TUTOR_ID = user.perfilId;

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatearFecha(fechaStr) {
  if (!fechaStr) return '—';
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
}

function formatearHora(horaStr) {
  if (!horaStr) return '—';
  const [h, m] = horaStr.split(':');
  const date = new Date();
  date.setHours(h, m);
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

function estadoBadge(estado) {
  const map = {
    'Pendiente':  '🟡 Pendiente',
    'Confirmada': '🟢 Confirmada',
    'Cancelada':  '🔴 Cancelada',
    'Completada': '✅ Completada',
  };
  return map[estado] || estado;
}

// ── Cancelar reserva ───────────────────────────────────────────────────────────
async function cancelarReserva(reservaId) {
  const confirmar = confirm('¿Seguro que deseas cancelar esta tutoría?');
  if (!confirmar) return;

  try {
    const res  = await fetch(
      `https://myteacher-production-e87b.up.railway.app/api/reservas/${reservaId}/cancelar`,
      { method: 'PUT' }
    );
    const data = await res.json();
    if (data.error) { alert(data.error); return; }
    alert('Tutoría cancelada.');
    cargarDatos();
  } catch {
    alert('No se pudo cancelar. Intenta de nuevo.');
  }
}

// ── Iniciar clase ──────────────────────────────────────────────────────────────
function iniciarClase(enlace) {
  if (enlace) {
    window.open(enlace, '_blank');
  } else {
    alert('No hay enlace de clase registrado para esta tutoría.');
  }
}

// ── Render próximas tutorías ───────────────────────────────────────────────────
function renderReservas(reservas) {
  const grid   = document.querySelector('.section-card:first-of-type .info-grid');
  const btnRow = document.querySelector('.btn-row');

  const proximas = reservas.filter(r =>
    r.estado !== 'Cancelada' && r.estado !== 'Completada'
  );

  if (proximas.length === 0) {
    grid.innerHTML = `
      <div class="info-row">
        <div class="info-cell full-width">No tienes tutorías próximas.</div>
      </div>`;
    btnRow.style.display = 'none';
    return;
  }

  const r = proximas[0];
  grid.innerHTML = `
    <div class="info-row">
      <div class="info-cell">Estudiante: ${r.estudiante}</div>
      <div class="info-cell">Materia: ${r.materia}</div>
    </div>
    <div class="info-row">
      <div class="info-cell">Fecha: ${formatearFecha(r.fecha)} - ${formatearHora(r.hora)}</div>
      <div class="info-cell">Nivel: ${r.nivel || '—'}</div>
    </div>
    <div class="info-row">
      <div class="info-cell">Modalidad: ${r.modalidad}</div>
      <div class="info-cell">Estado: ${estadoBadge(r.estado)}</div>
    </div>
  `;

  btnRow.innerHTML = `
    <button class="btn btn-primary"   onclick="iniciarClase('${r.enlace_clase}')">Iniciar clase</button>
    <button class="btn btn-secondary" onclick="cancelarReserva(${r.id})">Cancelar</button>
  `;

  const btnVerMas = document.querySelector('.ver-mas-wrap button');
  if (btnVerMas) {
    if (proximas.length <= 1) {
      btnVerMas.style.display = 'none';
    } else {
      btnVerMas.style.display = '';
      btnVerMas.onclick = () => mostrarTodasReservas(proximas);
    }
  }
}

function mostrarTodasReservas(proximas) {
  const grid = document.querySelector('.section-card:first-of-type .info-grid');
  grid.innerHTML = proximas.map(r => `
    <div class="info-row">
      <div class="info-cell"><strong>${r.estudiante}</strong> — ${r.materia}</div>
      <div class="info-cell">${formatearFecha(r.fecha)} ${formatearHora(r.hora)} | ${estadoBadge(r.estado)}</div>
    </div>
  `).join('');
  document.querySelector('.ver-mas-wrap button').style.display = 'none';
}

// ── Render resumen ─────────────────────────────────────────────────────────────
function renderResumen(reservas) {
  const ahora      = new Date();
  const mesActual  = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  const esteMes = reservas.filter(r => {
    const f = new Date(r.fecha);
    return f.getMonth() === mesActual &&
           f.getFullYear() === anioActual &&
           r.estado !== 'Cancelada';
  });

  const completadas       = esteMes.filter(r => r.estado === 'Completada');
  const estudiantesUnicos = new Set(esteMes.map(r => r.estudiante)).size;

  const celdas = document.querySelectorAll('.section-card:last-of-type .info-cell');
  if (celdas.length >= 5) {
    celdas[0].textContent = `Clases este mes: ${esteMes.length}`;
    celdas[1].textContent = `Estudiantes atendidos: ${estudiantesUnicos}`;
    celdas[2].textContent = `Clases completadas: ${completadas.length}`;
    celdas[3].textContent = `Horas de tutoría: ${completadas.length}`;
    celdas[4].textContent = `Calificación promedio este mes: ⭐ ${user.calificacion ?? '—'}`;
  }
}

// ── Carga principal ────────────────────────────────────────────────────────────
async function cargarDatos() {
  try {
    const res     = await fetch(
      `https://myteacher-production-e87b.up.railway.app/api/reservas/tutor/${TUTOR_ID}`
    );
    const reservas = await res.json();
    if (!Array.isArray(reservas)) throw new Error('Respuesta inesperada');
    renderReservas(reservas);
    renderResumen(reservas);
  } catch (err) {
    console.error('[myTeacher] Error:', err);
    const grid = document.querySelector('.section-card:first-of-type .info-grid');
    if (grid) grid.innerHTML = `
      <div class="info-row">
        <div class="info-cell full-width">
          Error al cargar tutorías.
          <button class="btn btn-primary" onclick="cargarDatos()">Reintentar</button>
        </div>
      </div>`;
  }
}

cargarDatos();