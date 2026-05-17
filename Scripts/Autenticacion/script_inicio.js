// ---- Si le da al ojo que pueda mostrar o ocultar la contraseña ----
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const iconoOjo = togglePassword.querySelector('i');

togglePassword.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    iconoOjo.classList.replace('fa-eye-slash', 'fa-eye');
  } else {
    passwordInput.type = 'password';
    iconoOjo.classList.replace('fa-eye', 'fa-eye-slash');
  }
});

// ---- Ventana emergente ----
const abrirModal = document.getElementById('abrirModal');
const modal = document.getElementById('modalRecuperar');
const enviarCorreo = document.getElementById('enviarCorreo');
const correoInput = document.getElementById('correoRecuperar');
const pasoCorreo = document.getElementById('pasoCorreo');
const pasoMensaje = document.getElementById('pasoMensaje');

abrirModal.addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = 'flex';
  pasoCorreo.style.display = 'block';
  pasoMensaje.style.display = 'none';
  correoInput.value = '';
});

enviarCorreo.addEventListener('click', () => {
  const correo = correoInput.value.trim();
  if (!correo) {
    alert('Ingresa un correo');
    return;
  }
  if (!correo.includes('@') || !correo.includes('.')) {
    alert('Correo inválido');
    return;
  }
  pasoCorreo.style.display = 'none';
  pasoMensaje.style.display = 'block';
});

document.addEventListener('click', (e) => {
  if (e.target.id === 'cerrarModal') modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});
//Metodo para que mande a inicios distintos segun el correo

async function iniciarSesion() {
  const correo   = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!correo || !password) {
    alert('Por favor completa todos los campos.');
    return;
  }

  try {
    const datos = await myTeacherAPI.login(correo, password);

    if (datos.error) {
      alert(datos.error);
      return;
    }

    sessionStorage.setItem('usuario', JSON.stringify(datos));

    if (datos.rol === 'tutor') {
      window.location.href = '/HTML/Tutor/inicio_tutor.html';
    } else {
      window.location.href = '/HTML/Estudiante/inicio_estudiante.html';
    }

  } catch (err) {
    alert('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
  }
}