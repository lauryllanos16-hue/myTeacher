document.getElementById('btnGuardar').addEventListener('click', function () {
  const materia    = document.getElementById('materia').value;
  const precio     = document.getElementById('precio').value.trim();
  const presencial = document.getElementById('presencial').checked;
  const virtual    = document.getElementById('virtual').checked;
  const ubicacion  = document.getElementById('ubicacion').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  if (!materia || materia === '') {
    alert('Por favor selecciona una materia.'); return;
  }
  if (!precio) {
    alert('Por favor ingresa el precio por hora.'); return;
  }
  if (!presencial && !virtual) {
    alert('Por favor selecciona al menos una modalidad.'); return;
  }
  if (!ubicacion) {
    alert('Por favor ingresa tu ubicación.'); return;
  }
  if (!descripcion) {
    alert('Por favor ingresa tu descripción profesional.'); return;
  }

  // Aquí puedes enviar los datos al backend
  console.log({ materia, precio, presencial, virtual, ubicacion, descripcion });
  alert('¡Perfil guardado correctamente!');
});