const DEFAULT_AVATAR =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110">
    <rect width="110" height="110" fill="#dde4f5" rx="55"/>
    <circle cx="55" cy="42" r="22" fill="#a0aecb"/>
    <ellipse cx="55" cy="90" rx="34" ry="24" fill="#a0aecb"/>
  </svg>
`);

// ── Parámetros URL ─────────────────────────────────────────────────────────────
const params  = new URLSearchParams(window.location.search);
const tutorId = params.get('tutorId');

if (!tutorId) window.location.href = 'inicio_estudiante.html';

// ── Avatar fallback ────────────────────────────────────────────────────────────
const avatarImg = document.getElementById('avatarImg');
avatarImg.onerror = () => { avatarImg.src = DEFAULT_AVATAR; };

// ── Cargar perfil del tutor ────────────────────────────────────────────────────
async function cargarTutor() {
  try {
    const datos = await window.myTeacherAPI.getTutor(tutorId);
    if (datos.error) throw new Error(datos.error);

    avatarImg.src = datos.foto_perfil || DEFAULT_AVATAR;
    document.getElementById('nombreTexto').textContent   = datos.nombre       || '—';
    document.getElementById('correoTexto').textContent   = datos.correo       || '—';
    document.getElementById('ratingTexto').textContent   = Number(datos.calificacion || 0).toFixed(1);
    document.getElementById('resenasTexto').textContent  = `(${datos.total_resenas || 0} reseñas)`;
    document.getElementById('materiasTexto').textContent = datos.materias     || '—';
    document.getElementById('ubicacionTexto').textContent= datos.ubicacion    || '—';
    document.getElementById('precioTexto').textContent   = datos.precio_hora  ? `$${datos.precio_hora}/hora` : '—';
    document.getElementById('modalidadTexto').textContent= datos.modalidad    || '—';
    document.getElementById('descTexto').textContent     = datos.descripcion  || 'Sin descripción.';

    // Botón reservar
    document.getElementById('btnReservar').onclick = () => {
      window.location.href = `reservar.html?tutorId=${tutorId}`;
    };

    // Disponibilidad
    renderDisponibilidad(datos.disponibilidad || []);

    // Reseñas
    renderResenas(datos.resenas || []);

  } catch (err) {
    console.error('[myTeacher] Error cargando tutor:', err);
    alert('No se pudo cargar el perfil del tutor.');
    window.location.href = 'inicio_estudiante.html';
  }
}

// ── Disponibilidad ─────────────────────────────────────────────────────────────
function renderDisponibilidad(disponibilidad) {
  const grid = document.getElementById('disponibilidadGrid');

  if (!disponibilidad.length) {
    grid.innerHTML = `<div class="info-row"><div class="info-cell">Sin disponibilidad registrada.</div></div>`;
    return;
  }

  const filas = [];
  for (let i = 0; i < disponibilidad.length; i += 2) {
    const a = disponibilidad[i];
    const b = disponibilidad[i + 1];
    filas.push(`
      <div class="info-row">
        <div class="info-cell">${a.dia}: ${a.hora_inicio.slice(0,5)} – ${a.hora_fin.slice(0,5)}</div>
        <div class="info-cell">${b ? `${b.dia}: ${b.hora_inicio.slice(0,5)} – ${b.hora_fin.slice(0,5)}` : ''}</div>
      </div>
    `);
  }
  grid.innerHTML = filas.join('');
}

// ── Reseñas ────────────────────────────────────────────────────────────────────
function renderResenas(resenas) {
  const container = document.getElementById('resenasContainer');

  if (!resenas.length) {
    container.innerHTML = `<p style="text-align:center;color:#888;">Este tutor aún no tiene reseñas.</p>`;
    return;
  }

  container.innerHTML = resenas.map(r => `
    <div class="resena-card">
      <div class="resena-header">
        <strong>${r.estudiante}</strong>
        <span class="resena-rating">${'⭐'.repeat(Math.round(r.calificacion))}</span>
      </div>
      <p class="resena-comentario">${r.comentario || ''}</p>
      <small class="resena-fecha">${new Date(r.created_at).toLocaleDateString('es-CO', { day:'numeric', month:'long', year:'numeric' })}</small>
    </div>
  `).join('');
}

// ── Init ───────────────────────────────────────────────────────────────────────
cargarTutor();