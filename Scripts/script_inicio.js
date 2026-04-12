// ===== MOSTRAR / OCULTAR CONTRASEÑA =====
const passwordInput = document.querySelector("input[type='password']");
const toggleIcon = document.getElementById("togglePassword");

toggleIcon.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        toggleIcon.textContent = "👁️";
    }
});


// ===== VALIDACIÓN Y LOGIN =====
const formButton = document.querySelector(".btn");
const emailInput = document.querySelector("input[type='email']");

formButton.addEventListener("click", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validación campos vacíos
    if (email === "" || password === "") {
        alert("Por favor completa todos los campos");
        return;
    }

    // Validación simple de correo
    if (!email.includes("@") || !email.includes(".")) {
        alert("Correo inválido");
        return;
    }

    // Simulación de login
    alert("Inicio de sesión exitoso");

    // Redirección (opcional)
    // window.location.href = "inicio.html";
});
const abrirModal = document.getElementById("abrirModal");
const modal = document.getElementById("modalRecuperar");
const cerrarModal = document.getElementById("cerrarModal");

// Abrir modal
abrirModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
});

// Cerrar modal
cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Cerrar al hacer clic afuera
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});