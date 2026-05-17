const DEFAULT_AVATAR = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110">
    <rect width="110" height="110" fill="#dde4f5" rx="55"/>
    <circle cx="55" cy="42" r="22" fill="#a0aecb"/>
    <ellipse cx="55" cy="90" rx="34" ry="24" fill="#a0aecb"/>
  </svg>
`);

const avatarImg = document.getElementById('avatarImg');
avatarImg.onerror = () => { avatarImg.src = DEFAULT_AVATAR; };

// ---- Cargar datos del usuario desde sessionStorage ----
const usuario = JSON.parse(sessionStorage.getItem('usuario'));
if (!usuario) {
  window.location.href = '/HTML/Autenticacion/inicio_sesion.html';
}

function cargarPerfil() {
  avatarImg.src = usuario.foto || DEFAULT_AVATAR;
  document.getElementById('nombreTexto').textContent = usuario.nombre || '';
  document.getElementById('correoTexto').textContent = usuario.correo || '';
  document.getElementById('nivelTexto').textContent  = usuario.nivel_educativo || 'Universitario';
}
cargarPerfil();

// ---- Cambiar foto (solo local por ahora) ----
function cambiarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { avatarImg.src = e.target.result; };
  reader.readAsDataURL(file);
}

// ---- Editar perfil ----
let editando = false;

function toggleEditar() {
  editando = !editando;
  const form = document.getElementById('editForm');
  const btn  = document.getElementById('btnEditar');
  if (editando) {
    document.getElementById('inputNombre').value = document.getElementById('nombreTexto').textContent;
    document.getElementById('inputCorreo').value = document.getElementById('correoTexto').textContent;
    const nivelActual = document.getElementById('nivelTexto').textContent;
    const sel = document.getElementById('inputNivel');
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text === nivelActual) { sel.selectedIndex = i; break; }
    }
    form.style.display = 'block';
    btn.textContent = 'Cancelar edición';
  } else {
    form.style.display = 'none';
    btn.textContent = 'Editar perfil';
  }
}

function cancelarEditar() {
  editando = false;
  document.getElementById('editForm').style.display = 'none';
  document.getElementById('btnEditar').textContent = 'Editar perfil';
}

async function guardarEditar() {
  const nombre = document.getElementById('inputNombre').value.trim();
  const correo = document.getElementById('inputCorreo').value.trim();
  const nivel  = document.getElementById('inputNivel').value;

  if (!nombre || !correo) {
    alert('Por favor completa todos los campos.');
    return;
  }

  try {
    const datos = await window.myTeacherAPI.actualizarPerfilTutor(usuario.id, { nombre });
    if (datos.error) { alert(datos.error); return; }

    usuario.nombre = nombre;
    usuario.correo = correo;
    usuario.nivel_educativo = nivel;
    sessionStorage.setItem('usuario', JSON.stringify(usuario));

    document.getElementById('nombreTexto').textContent = nombre;
    document.getElementById('correoTexto').textContent = correo;
    document.getElementById('nivelTexto').textContent  = nivel;
    cancelarEditar();
  } catch (err) {
    alert('No se pudo guardar. Intenta de nuevo.');
  }
}

// ---- Cargar tutorías recientes desde el backend ----
async function cargarTutorias() {
  const container = document.getElementById('tutoriasContainer');
  try {
    const reservas = await window.myTeacherAPI.getReservas(usuario.perfilId);
    if (!reservas.length) {
      container.innerHTML = '<p style="text-align:center;color:#888;">No tienes tutorías recientes.</p>';
      return;
    }
    container.innerHTML = reservas.map(r => `
      <div class="section-card">
        <div class="info-grid">
          <div class="info-row">
            <div class="info-cell">Materia: <strong>${r.materia}</strong></div>
            <div class="info-cell">Tutor: <strong>${r.tutor}</strong></div>
          </div>
          <div class="info-row">
            <div class="info-cell">Fecha: <strong>${r.fecha}</strong></div>
            <div class="info-cell">Modalidad: <strong>${r.modalidad}</strong></div>
          </div>
        </div>
        <div class="calificar-wrap" style="margin-top:14px;">
          <button class="btn btn-primary" onclick="irACalificar(${r.id}, '${r.tutor}', '${r.materia}')">
            ⭐ Calificar tutor
          </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p style="color:red;">Error al cargar tutorías.</p>';
  }
}

function irACalificar(reservaId, tutor, materia) {
  window.location.href = `/HTML/Estudiante/reseñas.html?reservaId=${reservaId}&tutor=${encodeURIComponent(tutor)}&materia=${encodeURIComponent(materia)}`;
}

cargarTutorias();