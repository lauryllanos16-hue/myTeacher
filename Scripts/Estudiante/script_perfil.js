//Avatar por defecto
const DEFAULT_AVATAR =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110">
    <rect width="110" height="110" fill="#dde4f5" rx="55"/>
    <circle cx="55" cy="42" r="22" fill="#a0aecb"/>
    <ellipse cx="55" cy="90" rx="34" ry="24" fill="#a0aecb"/>
  </svg>
`);

const avatarImg = document.getElementById('avatarImg');
avatarImg.src = DEFAULT_AVATAR;
avatarImg.onerror = function () {
  this.src = DEFAULT_AVATAR;
};

//Cambio de foto de perfil
function cambiarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    avatarImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

//Funcion del boton de editar perfil
let editando = false;

function toggleEditar() {
  editando = !editando;
  const form = document.getElementById('editForm');
  const btn = document.getElementById('btnEditar');

  if (editando) {
    //Mostrar la informacion que ya estaba para que vea cual va a cambiar
    document.getElementById('inputNombre').value =
      document.getElementById('nombreTexto').textContent;
    document.getElementById('inputCorreo').value =
      document.getElementById('correoTexto').textContent;
    const nivelActual = document.getElementById('nivelTexto').textContent;
    const sel = document.getElementById('inputNivel');
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text === nivelActual) {
        sel.selectedIndex = i;
        break;
      }
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

function guardarEditar() {
  const nombre = document.getElementById('inputNombre').value.trim();
  const correo = document.getElementById('inputCorreo').value.trim();
  const nivel = document.getElementById('inputNivel').value;

  if (!nombre || !correo) {
    alert('Por favor completa todos los campos.');
    return;
  }

  document.getElementById('nombreTexto').textContent = nombre;
  document.getElementById('correoTexto').textContent = correo;
  document.getElementById('nivelTexto').textContent = nivel;

  cancelarEditar();
}

//Informacion de las tutorias recientes
const tutorias = [
  {
    materia: 'Matematicas',
    tutor: 'Juan Perez',
    fecha: '12 Marzo',
    modalidad: 'Virtual',
    calificado: false,
  },
  {
    materia: 'Historia',
    tutor: 'Laura Diaz',
    fecha: '4 Marzo',
    modalidad: 'Presencial',
    calificado: false,
  },
];

//Cargar las demas tutorias recientes
function renderTutorias() {
  const container = document.getElementById('tutoriasContainer');
  container.innerHTML = tutorias.map((t, i) => `
    <div class="section-card" id="tutoria-${i}">
      <div class="info-grid">
        <div class="info-row">
          <div class="info-cell">Materia: <strong>${t.materia}</strong></div>
          <div class="info-cell">Tutor: <strong>${t.tutor}</strong></div>
        </div>
        <div class="info-row">
          <div class="info-cell">Fecha: <strong>${t.fecha}</strong></div>
          <div class="info-cell">Modalidad: <strong>${t.modalidad}</strong></div>
        </div>
      </div>
      <div class="calificar-wrap" style="margin-top:14px;">
        ${t.calificado
          ? `<span style="color:#f5a623;font-size:14px;font-weight:600;">&#11088; Ya calificado</span>`
          : `<button class="btn btn-primary" onclick="abrirModal(${i})">&#11088; Calificar tutor</button>`
        }
      </div>
    </div>
  `).join('');
}

renderTutorias();

//Ventana emergente de la calificacion
// Redirigir a reseñas al calificar
function abrirModal(index) {
  const t = tutorias[index];
  window.location.href = `/HTML/Estudiante/reseñas.html?tutor=${encodeURIComponent(t.tutor)}&materia=${encodeURIComponent(t.materia)}`;
}
