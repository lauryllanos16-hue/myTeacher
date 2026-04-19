/* ══════════════════════════════════════
   AVATAR POR DEFECTO
   ══════════════════════════════════════ */
const DEFAULT_AVATAR = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110">
    <rect width="110" height="110" fill="#dde4f5" rx="55"/>
    <circle cx="55" cy="42" r="22" fill="#a0aecb"/>
    <ellipse cx="55" cy="90" rx="34" ry="24" fill="#a0aecb"/>
  </svg>
`);

const avatarImg = document.getElementById('avatarImg');
avatarImg.src = DEFAULT_AVATAR;
avatarImg.onerror = function() { this.src = DEFAULT_AVATAR; };

/* ══════════════════════════════════════
   CAMBIAR FOTO DE PERFIL
   ══════════════════════════════════════ */
function cambiarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    avatarImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

/* ══════════════════════════════════════
   EDITAR PERFIL
   ══════════════════════════════════════ */
let editando = false;

function toggleEditar() {
  editando = !editando;
  const form = document.getElementById('editForm');
  const btn  = document.getElementById('btnEditar');

  if (editando) {
    // Cargar valores actuales en el formulario
    document.getElementById('inputNombre').value = document.getElementById('nombreTexto').textContent;
    document.getElementById('inputCorreo').value  = document.getElementById('correoTexto').textContent;
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

function guardarEditar() {
  const nombre = document.getElementById('inputNombre').value.trim();
  const correo = document.getElementById('inputCorreo').value.trim();
  const nivel  = document.getElementById('inputNivel').value;

  if (!nombre || !correo) {
    alert('Por favor completa todos los campos.');
    return;
  }

  document.getElementById('nombreTexto').textContent = nombre;
  document.getElementById('correoTexto').textContent  = correo;
  document.getElementById('nivelTexto').textContent   = nivel;

  cancelarEditar();
}

/* ══════════════════════════════════════
   DATOS DE TUTORÍAS RECIENTES
   ══════════════════════════════════════ */
const tutorias = [
  {
    materia:   'Matematicas',
    tutor:     'Juan Perez',
    fecha:     '12 Marzo',
    modalidad: 'Virtual',
    calificado: false
  },
  {
    materia:   'Historia',
    tutor:     'Laura Diaz',
    fecha:     '4 Marzo',
    modalidad: 'Presencial',
    calificado: false
  }
];

/* ── Renderizar tarjetas ── */
function renderTutorias() {
  const container = document.getElementById('tutoriasContainer');
  container.innerHTML = tutorias.map((t, i) => `
    <div class="tutoria-card" id="tutoria-${i}">
      <div class="tutoria-grid">
        <div class="tutoria-cell">Materia: <strong>${t.materia}</strong></div>
        <div class="tutoria-divider"></div>
        <div class="tutoria-cell">Tutor: <strong>${t.tutor}</strong></div>
      </div>
      <div class="tutoria-row-2">
        <div class="tutoria-cell">Fecha: <strong>${t.fecha}</strong></div>
        <div class="tutoria-divider"></div>
        <div class="tutoria-cell">Modalidad: <strong>${t.modalidad}</strong></div>
      </div>
      <div class="calificar-wrap">
        ${t.calificado
          ? `<span style="color:#f5a623;font-size:14px;font-weight:600;">&#11088; Ya calificado</span>`
          : `<button class="btn-calificar" onclick="abrirModal(${i})">&#11088; Calificar tutor</button>`
        }
      </div>
    </div>
  `).join('');
}

renderTutorias();

/* ══════════════════════════════════════
   MODAL DE CALIFICACIÓN
   ══════════════════════════════════════ */
let tutoriaActual = null;
let estrellaSeleccionada = 0;

// Crear modal dinámicamente
const modalHTML = `
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal">
      <h3 id="modalTitulo">Calificar tutor</h3>
      <div class="stars-row" id="starsRow">
        ${[1,2,3,4,5].map(n =>
          `<button class="star-btn" data-val="${n}" onclick="seleccionarEstrella(${n})">&#11088;</button>`
        ).join('')}
      </div>
      <textarea id="modalComentario" placeholder="Escribe un comentario (opcional)..."></textarea>
      <div class="modal-btns">
        <button class="btn-modal-cancelar" onclick="cerrarModal()">Cancelar</button>
        <button class="btn-modal-enviar" onclick="enviarCalificacion()">Enviar</button>
      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

function abrirModal(index) {
  tutoriaActual = index;
  estrellaSeleccionada = 0;
  actualizarEstrellas(0);
  document.getElementById('modalComentario').value = '';
  document.getElementById('modalTitulo').textContent =
    'Calificar a ' + tutorias[index].tutor;
  document.getElementById('modalOverlay').classList.add('active');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  tutoriaActual = null;
}

function seleccionarEstrella(n) {
  estrellaSeleccionada = n;
  actualizarEstrellas(n);
}

function actualizarEstrellas(n) {
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.val) <= n);
  });
}

function enviarCalificacion() {
  if (estrellaSeleccionada === 0) {
    alert('Por favor selecciona una calificación.');
    return;
  }
  tutorias[tutoriaActual].calificado = true;
  cerrarModal();
  renderTutorias();
}

// Cerrar modal al hacer clic fuera
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});