// v2
// Scripts/Tutor/script_perfiltutor.js
const DEFAULT_AVATAR = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110">
    <rect width="110" height="110" fill="#dde4f5" rx="55"/>
    <circle cx="55" cy="42" r="22" fill="#a0aecb"/>
    <ellipse cx="55" cy="90" rx="34" ry="24" fill="#a0aecb"/>
  </svg>
`);

const avatarImg = document.getElementById('avatarImg');
avatarImg.onerror = () => { avatarImg.src = DEFAULT_AVATAR; };

const usuario = JSON.parse(sessionStorage.getItem('usuario'));
if (!usuario) window.location.href = '/HTML/Autenticacion/inicio_sesion.html';

// ---- Cargar perfil desde backend ----
async function cargarPerfil() {
  try {
    const datos = await window.myTeacherAPI.getTutor(usuario.id);
    if (datos.error) { alert(datos.error); return; }

    avatarImg.src = datos.foto_perfil || DEFAULT_AVATAR;
    document.getElementById('nombreTexto').textContent    = datos.nombre       || '';
    document.getElementById('correoTexto').textContent    = datos.correo       || '';
    document.getElementById('ratingTexto').textContent    = datos.calificacion || '0.0';
    document.getElementById('materiasTexto').textContent  = datos.materias     || '';
    document.getElementById('ubicacionTexto').textContent = datos.ubicacion    || '';
    document.getElementById('precioTexto').textContent    = datos.precio_hora  ? `$${datos.precio_hora}` : '';
    document.getElementById('modalidadTexto').textContent = datos.modalidad    || '';
    document.getElementById('descTexto').textContent      = datos.descripcion  || '';

    // Reseñas
    document.querySelector('.reviews').textContent = `(${datos.total_resenas || 0} reseñas)`;

    // Estadísticas
    const statsGrid = document.querySelector('.section-card:nth-child(2) .info-grid');
    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="info-row">
          <div class="info-cell">Clases impartidas: ${datos.total_resenas || 0}</div>
          <div class="info-cell">Estudiantes atendidos: ${datos.total_resenas || 0}</div>
        </div>
        <div class="info-row" style="display:flex;justify-content:center;">
          <div class="info-cell" style="border-right:none;text-align:center;justify-content:center;flex:none;">
            Calificacion promedio: ⭐ ${datos.calificacion || '0.0'}
          </div>
        </div>
      `;
    }

    // Disponibilidad
    if (datos.disponibilidad && datos.disponibilidad.length) {
      const disp = document.querySelector('#disponibilidad .info-grid');
      const filas = [];
      for (let i = 0; i < datos.disponibilidad.length; i += 2) {
        const a = datos.disponibilidad[i];
        const b = datos.disponibilidad[i + 1];
        filas.push(`
          <div class="info-row">
            <div class="info-cell">${a.dia}: ${a.hora_inicio} – ${a.hora_fin}</div>
            <div class="info-cell">${b ? `${b.dia}: ${b.hora_inicio} – ${b.hora_fin}` : ''}</div>
          </div>
        `);
      }
      disp.innerHTML = filas.join('');
    }

  } catch (err) {
    alert('Error al cargar el perfil.');
  }
}
cargarPerfil();

function cambiarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { avatarImg.src = e.target.result; };
  reader.readAsDataURL(file);
}

let editando = false;

function toggleEditar() {
  editando = !editando;
  const form = document.getElementById('editForm');
  const btn  = document.getElementById('btnEditar');
  if (editando) {
    document.getElementById('inputNombre').value    = document.getElementById('nombreTexto').textContent;
    document.getElementById('inputCorreo').value    = document.getElementById('correoTexto').textContent;
    document.getElementById('inputMaterias').value  = document.getElementById('materiasTexto').textContent;
    document.getElementById('inputUbicacion').value = document.getElementById('ubicacionTexto').textContent;
    document.getElementById('inputPrecio').value    = document.getElementById('precioTexto').textContent.replace('$','');
    document.getElementById('inputDesc').value      = document.getElementById('descTexto').textContent;
    const modalidadActual = document.getElementById('modalidadTexto').textContent;
    const sel = document.getElementById('inputModalidad');
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text === modalidadActual) { sel.selectedIndex = i; break; }
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
  const nombre    = document.getElementById('inputNombre').value.trim();
  const correo    = document.getElementById('inputCorreo').value.trim();
  const materias  = document.getElementById('inputMaterias').value.trim();
  const ubicacion = document.getElementById('inputUbicacion').value.trim();
  const precio    = document.getElementById('inputPrecio').value.trim();
  const modalidad = document.getElementById('inputModalidad').value;
  const desc      = document.getElementById('inputDesc').value.trim();

  if (!nombre || !correo) {
    alert('Por favor completa nombre y correo.');
    return;
  }

  // Disponibilidad
  const diasIds = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
  const diasNombres = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  try {
    const datos = await window.myTeacherAPI.actualizarPerfilTutor(usuario.id, {
      nombre,
      descripcion: desc,
      precio_hora: precio,
      modalidad,
      ubicacion,
      materias: materias.split(',').map(m => m.trim()).filter(Boolean),
    });

    if (datos.error) { alert(datos.error); return; }

    document.getElementById('nombreTexto').textContent    = nombre;
    document.getElementById('correoTexto').textContent    = correo;
    document.getElementById('materiasTexto').textContent  = materias;
    document.getElementById('ubicacionTexto').textContent = ubicacion;
    document.getElementById('precioTexto').textContent    = `$${precio}`;
    document.getElementById('modalidadTexto').textContent = modalidad;
    document.getElementById('descTexto').textContent      = desc;

    usuario.nombre = nombre;
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    cancelarEditar();
    alert('Perfil actualizado correctamente.');
  } catch (err) {
    alert('No se pudo guardar. Intenta de nuevo.');
  }
}