// Cargar datos del tutor desde la URL
(function cargarDatosURL() {
  const params = new URLSearchParams(window.location.search);

  const tutor = params.get('tutor');
  const materia = params.get('materia');
  const nivel = params.get('nivel');

  if (tutor) document.getElementById('tutorNombre').textContent = tutor;
  if (materia) document.getElementById('tutorMateria').textContent = materia;
  if (nivel) document.getElementById('tutorNivel').textContent = nivel;
})();

//Guarda la informacion cuando se le de confirmar reserva
function confirmarReserva() {
  const tutor = document.getElementById('tutorNombre').textContent;
  const materia = document.getElementById('tutorMateria').textContent;
  const nivel = document.getElementById('tutorNivel').textContent;
  const fecha = document.getElementById('selectFecha').value;
  const hora = document.getElementById('selectHora').value;
  const modalidad = document.querySelector(
    'input[name="modalidad"]:checked',
  ).value;

  // Validar que haya modalidad seleccionada
  if (!modalidad) {
    alert('Por favor selecciona una modalidad.');
  } else {
    alert('Reserva confirmada');
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

//Abre la ventana emergente
function abrirModal() {
  document.getElementById('modalOverlay').classList.add('active');
}
confirmarReserva;
function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  // Redirigir a mis reservas o inicio después de confirmar
}

// Cierra la ventana emergente si se la da click afuera del cuadro
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});
(function cargarDesdeStorage() {
  const tutorGuardado = JSON.parse(localStorage.getItem('tutorSeleccionado'));

  if (tutorGuardado) {
    document.getElementById('tutorNombre').textContent = tutorGuardado.nombre;
    document.getElementById('tutorMateria').textContent = tutorGuardado.materia;
    document.getElementById('tutorNivel').textContent =
      tutorGuardado.nivel || 'No definido';
  }
})();
