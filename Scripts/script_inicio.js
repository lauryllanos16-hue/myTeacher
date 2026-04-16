// ---- OJO CONTRASEÑA ----
const passwordInput    = document.getElementById("password");
const togglePassword   = document.getElementById("togglePassword");
const iconoOjo         = togglePassword.querySelector("i");

togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        iconoOjo.classList.replace("fa-eye-slash", "fa-eye");
    } else {
        passwordInput.type = "password";
        iconoOjo.classList.replace("fa-eye", "fa-eye-slash");
    }
});

// ---- MODAL ----
const abrirModal  = document.getElementById("abrirModal");
const modal       = document.getElementById("modalRecuperar");
const enviarCorreo = document.getElementById("enviarCorreo");
const correoInput  = document.getElementById("correoRecuperar");
const pasoCorreo   = document.getElementById("pasoCorreo");
const pasoMensaje  = document.getElementById("pasoMensaje");

abrirModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    pasoCorreo.style.display = "block";
    pasoMensaje.style.display = "none";
    correoInput.value = "";
});

enviarCorreo.addEventListener("click", () => {
    const correo = correoInput.value.trim();
    if (!correo) { alert("Ingresa un correo"); return; }
    if (!correo.includes("@") || !correo.includes(".")) { alert("Correo inválido"); return; }
    pasoCorreo.style.display = "none";
    pasoMensaje.style.display = "block";
});

document.addEventListener("click", (e) => {
    if (e.target.id === "cerrarModal") modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});