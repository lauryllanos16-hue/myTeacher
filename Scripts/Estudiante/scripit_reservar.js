const API = 'https://myteacher-production-e87b.up.railway.app/api';

// ── Sesión y parámetros URL ────────────────────────────────────────────────────
const user    = JSON.parse(sessionStorage.getItem('usuario'));
const params  = new URLSearchParams(window.location.search);
const tutorId = params.get('tutorId');

if (!tutorId) window.location.href = 'inicio_estudiante.html';

// ── Cargar datos del tutor desde el backend ────────────────────────────────────
let tutorData = null;

async function cargarTutor() {
  try {
    const res  = await fetch(`${API}/tutores/${tutorId}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);
    tutorData = data;

    // Llenar datos fijos
    document.getElementById('tutorNombre').textContent  = data.nombre   || '—';
    document.getElementById('tutorMateria').textContent = data.materias || '—';
    document.getElementById('tutorNivel').textContent   = user?.nivel_educativo || 'No definido';

    // Llenar select de fechas con disponibilidad real
    llenarFechas(data.disponibilidad || []);

    // Ajustar radios de modalidad según lo que ofrece el tutor
    ajustarModalidad(data.modalidad);

  } catch (err) {
    console.error('[myTeacher] Error cargando tutor:', err);
    alert('No se pudo cargar la información del tutor.');
    window.location.href = 'inicio_estudiante.html';
  }
}

// ── Llenar select de fechas con días disponibles ───────────────────────────────
function llenarFechas(disponibilidad) {
  const selectFecha = document.getElementById('selectFecha');
  const selectHora  = document.getElementById('selectHora');
  selectFecha.innerHTML = '';
  selectHora.innerHTML  = '';

  if (disponibilidad.length === 0) {
    selectFecha.innerHTML = '<option value="">Sin disponibilidad</option>';
    selectHora.innerHTML  = '<option value="">—</option>';
    return;
  }

  // Generar próximas fechas (30 días) que coincidan con los días disponibles
  const diasSemana = {
    'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4,
    'Viernes': 5, 'Sábado': 6, 'Domingo': 0
  };

  const diasDisponibles = disponibilidad.map(d => diasSemana[d.dia]);
  const fechas = [];
  const hoy = new Date();

  for (let i = 1; i <= 30 && fechas.length < 10; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    if (diasDisponibles.includes(fecha.getDay())) {
      fechas.push({ fecha, disp: disponibilidad.find(d => diasSemana[d.dia] === fecha.getDay()) });
    }
  }

  fechas.forEach(({ fecha, disp }) => {
    const label = fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', weekday: 'long' });
    const value = fecha.toISOString().split('T')[0]; // YYYY-MM-DD para el backend
    const opt   = document.createElement('option');
    opt.value       = value;
    opt.textContent = label;
    opt.dataset.dispId = disp ? JSON.stringify(disp) : '';
    selectFecha.appendChild(opt);
  });

  // Cargar horas al seleccionar fecha
  selectFecha.addEventListener('change', () => llenarHoras(disponibilidad, selectFecha.value));
  llenarHoras(disponibilidad, selectFecha.value);
}

function llenarHoras(disponibilidad, fechaValue) {
  const selectHora  = document.getElementById('selectHora');
  const selectFecha = document.getElementById('selectFecha');
  selectHora.innerHTML = '';

  const fechaDate   = new Date(fechaValue + 'T12:00:00');
  const diaSemana   = fechaDate.getDay();
  const diasSemana  = { 'Lunes':1,'Martes':2,'Miércoles':3,'Jueves':4,'Viernes':5,'Sábado':6,'Domingo':0 };
  const disp        = disponibilidad.find(d => diasSemana[d.dia] === diaSemana);

  if (!disp) {
    selectHora.innerHTML = '<option value="">Sin horario</option>';
    return;
  }

  // Generar horas entre hora_inicio y hora_fin cada 1 hora
  const [hIni] = disp.hora_inicio.split(':').map(Number);
  const [hFin] = disp.hora_fin.split(':').map(Number);

  for (let h = hIni; h < hFin; h++) {
    const opt   = document.createElement('option');
    const ampm  = h < 12 ? 'AM' : 'PM';
    const h12   = h % 12 === 0 ? 12 : h % 12;
    opt.value       = `${String(h).padStart(2,'0')}:00:00`;
    opt.textContent = `${h12}:00 ${ampm}`;
    selectHora.appendChild(opt);
  }
}

// ── Ajustar radios de modalidad ────────────────────────────────────────────────
function ajustarModalidad(modalidad) {
  const radioPres = document.getElementById('radioPres');
  const radioVirt = document.getElementById('radioVirt');
  if (!modalidad) return;

  const mod = modalidad.toLowerCase();
  if (mod === 'presencial') {
    radioPres.checked  = true;
    radioVirt.disabled = true;
  } else if (mod === 'virtual') {
    radioVirt.checked  = true;
    radioPres.disabled = true;
  }
  // Si es Virtual/Presencial ambos quedan habilitados
}

// ── Confirmar reserva → POST /api/reservas ────────────────────────────────────
async function confirmarReserva() {
  const fecha     = document.getElementById('selectFecha').value;
  const hora      = document.getElementById('selectHora').value;
  const modalidad = document.querySelector('input[name="modalidad"]:checked')?.value;

  if (!fecha || !hora) { alert('Selecciona fecha y hora.'); return; }
  if (!modalidad)      { alert('Selecciona una modalidad.'); return; }
  if (!user)           { alert('Sesión expirada.'); return; }

  // Obtener materia_id — usamos la primera materia del tutor
  // Si quieres que el estudiante elija la materia, hay que agregar un select
  const materiaNombre = tutorData?.materias?.split(',')[0]?.trim();
  const materiaId     = await obtenerMateriaId(materiaNombre);

  const body = {
    estudiante_id: user.perfilId,
    tutor_id:      parseInt(tutorId),
    materia_id:    materiaId,
    fecha,
    hora,
    modalidad,
  };

  try {
    document.getElementById('btnConfirmar').disabled = true;
    const res  = await fetch(`${API}/reservas`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const data = await res.json();

    if (data.error) { alert(data.error); return; }

    // Mostrar modal de éxito
    const fechaLabel = document.getElementById('selectFecha')
      .options[document.getElementById('selectFecha').selectedIndex].text;
    const horaLabel  = document.getElementById('selectHora')
      .options[document.getElementById('selectHora').selectedIndex].text;

    document.getElementById('modalDetalle').innerHTML =
      `<strong>Tutor:</strong> ${tutorData.nombre}<br>
       <strong>Materia:</strong> ${materiaNombre}<br>
       <strong>Fecha:</strong> ${fechaLabel} a las ${horaLabel}<br>
       <strong>Modalidad:</strong> ${modalidad}`;

    abrirModal();

  } catch (err) {
    console.error('[myTeacher] Error al reservar:', err);
    alert('No se pudo crear la reserva. Intenta de nuevo.');
  } finally {
    document.getElementById('btnConfirmar').disabled = false;
  }
}

async function obtenerMateriaId(nombre) {
  try {
    const res  = await fetch(`${API}/materias`);
    const data = await res.json();
    const mat  = data.find(m => m.nombre === nombre);
    return mat?.id ?? 1;
  } catch {
    return 1;
  }
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function abrirModal() {
  document.getElementById('modalOverlay').classList.add('active');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  window.location.href = 'mis_reservas.html';
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});

// ── Init ───────────────────────────────────────────────────────────────────────
cargarTutor();