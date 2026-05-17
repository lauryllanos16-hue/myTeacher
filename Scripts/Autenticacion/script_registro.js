// ---- Mostrar/ocultar contraseña ----
function togglePass(inputId, spanId) {
  const input = document.getElementById(inputId);
  const icono = document.querySelector(`#${spanId} i`);
  if (input.type === 'password') {
    input.type = 'text';
    icono.classList.replace('fa-eye-slash', 'fa-eye');
  } else {
    input.type = 'password';
    icono.classList.replace('fa-eye', 'fa-eye-slash');
  }
}

document.getElementById('toggle1').addEventListener('click', () => togglePass('pass1', 'toggle1'));
document.getElementById('toggle2').addEventListener('click', () => togglePass('pass2', 'toggle2'));

// ---- Solo una opción ----
document.getElementById('estudiante').addEventListener('change', function () {
  if (this.checked) document.getElementById('tutor').checked = false;
});
document.getElementById('tutor').addEventListener('change', function () {
  if (this.checked) document.getElementById('estudiante').checked = false;
});

// ---- Registro ----
document.querySelector('.btn-registrar').addEventListener('click', async function () {
  const nombre   = document.querySelector('input[placeholder="Nombre y apellido"]').value.trim();
  const correo   = document.querySelector('input[type="email"]').value.trim();
  const pass1    = document.getElementById('pass1').value;
  const pass2    = document.getElementById('pass2').value;
  const esEstudiante = document.getElementById('estudiante').checked;
  const esTutor      = document.getElementById('tutor').checked;

  if (!nombre)               return alert('Por favor ingresa tu nombre completo.');
  if (!correo)               return alert('Por favor ingresa tu correo.');
  if (!pass1)                return alert('Por favor ingresa una contraseña.');
  if (pass1 !== pass2)       return alert('Las contraseñas no coinciden.');
  if (!esEstudiante && !esTutor) return alert('Por favor selecciona un tipo de cuenta.');

  const rol = esTutor ? 'tutor' : 'estudiante';

  try {
    const datos = await window.myTeacherAPI.registro({ nombre, correo, password: pass1, rol });
  console.log('Respuesta del backend:', datos);
    if (datos.error) {
      alert(datos.error);
      return;
    }

    // Guardamos el usuario en sessionStorage
    sessionStorage.setItem('usuario', JSON.stringify(datos));

    if (esTutor) {
      window.location.href = '/HTML/Autenticacion/registro_tutor.html';
    } else {
      window.location.href = '/HTML/Estudiante/inicio_estudiante.html';
    }
  } catch (err) {
    alert('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
  }
});
  