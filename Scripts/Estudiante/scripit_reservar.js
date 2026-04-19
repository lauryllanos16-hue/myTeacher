/* ══════════════════════════════════════
   CARGAR DATOS DEL TUTOR DESDE URL
   Si vienes desde la página de inicio con ?tutor=... se precarga
   Ejemplo: reservar_tutoria.html?tutor=Lionel%20Messi&materia=Matematicas&nivel=Universitario
   ══════════════════════════════════════ */
(function cargarDatosURL() {
  const params = new URLSearchParams(window.location.search);

  const tutor   = params.get('tutor');
  const materia = params.get('materia');
  const nivel   = params.get('nivel');

  if (tutor)   document.getElementById('tutorNombre').textContent  = tutor;
  if (materia) document.getElementById('tutorMateria').textContent = materia;
  if (nivel)   document.getElementById('tutorNivel').textContent   = nivel;
})();

/* ══════════════════════════════════════
   CONFIRMAR RESERVA
   ══════════════════════════════════════ */
function confirmarReserva() {
  const tutor     = document.getElementById('tutorNombre').textContent;
  const materia   = document.getElementById('tutorMateria').textContent;
  const nivel     = document.getElementById('tutorNivel').textContent;
  const fecha     = document.getElementById('selectFecha').value;
  const hora      = document.getElementById('selectHora').value;
  const modalidad = document.querySelector('input[name="modalidad"]:checked').value;

  // Validar que haya modalidad seleccionada
  if (!modalidad) {
    alert('Por favor selecciona una modalidad.');
    return;
  }

  // Mostrar detalle en el modal
  document.getElementById('modalDetalle').innerHTML =
    `<strong>Tutor:</strong> ${tutor}<br>
     <strong>Materia:</strong> ${materia}<br>
     <strong>Nivel:</strong> ${nivel}<br>
     <strong>Fecha:</strong> ${fecha} a las ${hora}<br>
     <strong>Modalidad:</strong> ${modalidad}`;

  abrirModal();
}

/* ══════════════════════════════════════
   MODAL
   ══════════════════════════════════════ */
function abrirModal() {
  document.getElementById('modalOverlay').classList.add('active');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  // Redirigir a mis reservas o inicio después de confirmar
  // window.location.href = '/HTML/Estudiante/inicio_estudiante.html';
}

// Cerrar modal al hacer clic fuera
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});