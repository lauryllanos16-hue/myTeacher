document.getElementById('btnGuardar').addEventListener('click', async function () {
  const materia     = document.getElementById('materia').value;
  const precio      = document.getElementById('precio').value.trim();
  const presencial  = document.getElementById('presencial').checked;
  const virtual     = document.getElementById('virtual').checked;
  const ubicacion   = document.getElementById('ubicacion').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  if (!materia)                return alert('Por favor selecciona una materia.');
  if (!precio)                 return alert('Por favor ingresa el precio por hora.');
  if (!presencial && !virtual) return alert('Por favor selecciona al menos una modalidad.');
  if (!ubicacion)              return alert('Por favor ingresa tu ubicación.');
  if (!descripcion)            return alert('Por favor ingresa tu descripción profesional.');

  const usuario = JSON.parse(sessionStorage.getItem('usuario'));
  if (!usuario) {
    alert('Sesión expirada. Por favor regístrate de nuevo.');
    window.location.href = '/HTML/Autenticacion/registro.html';
    return;
  }

  const modalidad = [presencial && 'presencial', virtual && 'virtual']
    .filter(Boolean).join(',');

  try {
    const datos = await window.myTeacherAPI.actualizarPerfilTutor(usuario.id, {
      descripcion,
      precio_hora: precio,
      modalidad,
      ubicacion,
      materias: [materia],
    });

    if (datos.error) {
      alert(datos.error);
      return;
    }

    window.location.href = '/HTML/Tutor/inicio_tutor.html';
  } catch (err) {
    alert('No se pudo guardar el perfil. Intenta de nuevo.');
  }
});