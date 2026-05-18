// ── Avatar por defecto (igual que antes) ──────────────────────────────────────
const DEFAULT_AVATAR =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
    <rect width="96" height="96" fill="#dde4f5" rx="8"/>
    <circle cx="48" cy="36" r="18" fill="#a0aecb"/>
    <ellipse cx="48" cy="78" rx="30" ry="20" fill="#a0aecb"/>
  </svg>
`);

// ── Sesión ─────────────────────────────────────────────────────────────────────
const SESSION_KEY = 'usuario';

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

const user = getSession();
if (!user || user.rol !== 'estudiante') {
  window.location.href = '../Autenticacion/inicio_sesion.html';
}

function renderTutores(lista) {
  const container = document.getElementById('tutorsContainer');

  if (!lista || lista.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No encontramos tutores con esos filtros.</p>
      </div>`;
    return;
  }

  container.innerHTML = lista.map((t) => {
    const foto = t.foto_perfil || DEFAULT_AVATAR;
    const rating = Number(t.calificacion ?? 0).toFixed(1);
    const precio = `$${Number(t.precio_hora ?? 0).toLocaleString('es-CO')}/Hora`;
    const materia = t.materias || '—';
    const modalidad = t.modalidad || '—';
    const nombre = t.nombre || 'Sin nombre';
    const resenas = t.total_resenas ?? 0;

    return `
      <div class="tutor-card">
        <img class="tutor-img"
             src="${foto}"
             onerror="this.src='${DEFAULT_AVATAR}'"
             alt="Foto de ${nombre}">
        <div class="tutor-info">
          <div class="tutor-name">${nombre}</div>
          <div class="tutor-meta">
            <span class="star">⭐</span> ${rating}
            <span class="sep">|</span> ${precio}
            <span class="sep">|</span> ${materia}
            <span class="sep">|</span> <small>${resenas} reseñas</small>
          </div>
          <div class="tutor-modality">
            Modalidad: <strong>${modalidad}</strong>
          </div>
          <div class="tutor-btns">
            <button class="btn btn-secondary btn-ver"
                    data-id="${t.id}">Ver perfil</button>
            <button class="btn btn-primary btn-reservar"
                    data-id="${t.tutor_id}"
                    data-userid="${t.id}">Reservar</button>
          </div>
        </div>
      </div>`;
  }).join('');
}
// ── Carga desde el backend ─────────────────────────────────────────────────────
async function cargarTutores(filtros = {}) {
  const container = document.getElementById('tutorsContainer');
  container.innerHTML = '<p class="loading-msg">Cargando tutores...</p>';

  try {
    const filtrosLimpios = Object.fromEntries(
      Object.entries(filtros).filter(([, v]) => v && v.trim() !== ''),
    );

    const data = await window.myTeacherAPI.getTutores(filtrosLimpios);
    const lista = Array.isArray(data) ? data : (data.data ?? []);
    renderTutores(lista);
  } catch (err) {
    console.error('[myTeacher] Error al cargar tutores:', err);
    container.innerHTML = `
      <div class="error-state">
        <p>No pudimos cargar los tutores. Verifica tu conexión.</p>
        <button class="btn btn-primary" onclick="cargarTutores()">Reintentar</button>
      </div>`;
  }
}

// ── Clicks en las tarjetas (delegación igual que antes) ───────────────────────
document
  .getElementById('tutorsContainer')
  .addEventListener('click', function (e) {
    const btnVer = e.target.closest('.btn-ver');
    const btnReservar = e.target.closest('.btn-reservar');

    if (btnVer) {
      const id = btnVer.dataset.id;
      window.location.href = `ver_tutor.html?tutorId=${id}`;
    }

    if (btnReservar) {
      const tutorId = btnReservar.dataset.id;
      const userId = btnReservar.dataset.userid;
      window.location.href = `reservar.html?tutorId=${tutorId}&userId=${userId}`;
    }
  });

// ── Buscador con filtros ───────────────────────────────────────────────────────
document.querySelector('.btn-buscar').addEventListener('click', function () {
  const materia = document.getElementById('materiaSelect').value;
  const modalidad = document.getElementById('modalidadSelect').value;
  cargarTutores({ materia, modalidad });
});

// ── Carga inicial ──────────────────────────────────────────────────────────────
cargarTutores();
