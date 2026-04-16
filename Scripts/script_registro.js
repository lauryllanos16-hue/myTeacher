function togglePass(inputId, spanId) {
    const input = document.getElementById(inputId);
    const icono = document.querySelector(`#${spanId} i`);

    if (input.type === "password") {
        input.type = "text";
        icono.classList.replace("fa-eye-slash", "fa-eye");
    } else {
        input.type = "password";
        icono.classList.replace("fa-eye", "fa-eye-slash");
    }
}

document.getElementById("toggle1").addEventListener("click", () => togglePass("pass1", "toggle1"));
document.getElementById("toggle2").addEventListener("click", () => togglePass("pass2", "toggle2"));
document.querySelector('.btn-registrar').addEventListener('click', function () {
  const nombre    = document.querySelector('input[placeholder="Nombre y apellido"]').value.trim();
  const correo    = document.querySelector('input[type="email"]').value.trim();
  const pass1     = document.getElementById('pass1').value;
  const pass2     = document.getElementById('pass2').value;
  const estudiante = document.getElementById('estudiante').checked;
  const tutor      = document.getElementById('tutor').checked;

  // Validaciones
  if (!nombre) {
    alert('Por favor ingresa tu nombre completo.'); return;
  }
  if (!correo) {
    alert('Por favor ingresa tu correo.'); return;
  }
  if (!pass1) {
    alert('Por favor ingresa una contraseña.'); return;
  }
  if (pass1 !== pass2) {
    alert('Las contraseñas no coinciden.'); return;
  }
  if (!estudiante && !tutor) {
    alert('Por favor selecciona un tipo de cuenta.'); return;
  }

  // Redirección según tipo de cuenta
  if (tutor) {
    window.location.href = 'registro_tutor.html'; // <-- página del tutor
  } else {
    window.location.href = 'perfil-estudiante.html'; // <-- página del estudiante
  }
});
// Agregar esto para que solo se pueda elegir una opción
document.getElementById('estudiante').addEventListener('change', function () {
  if (this.checked) document.getElementById('tutor').checked = false;
});

document.getElementById('tutor').addEventListener('change', function () {
  if (this.checked) document.getElementById('estudiante').checked = false;
});