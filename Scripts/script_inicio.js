const abrirModal = document.getElementById("abrirModal");
const modal = document.getElementById("modalRecuperar");
const cerrarModal = document.getElementById("cerrarModal");

const enviarCorreo = document.getElementById("enviarCorreo");
const correoInput = document.getElementById("correoRecuperar");

const pasoCorreo = document.getElementById("pasoCorreo");
const pasoMensaje = document.getElementById("pasoMensaje");

// Abrir modal
abrirModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";

    // resetear estado
    pasoCorreo.style.display = "block";
    pasoMensaje.style.display = "none";
    correoInput.value = "";
});

// Enviar correo (simulación)
enviarCorreo.addEventListener("click", () => {
    const correo = correoInput.value.trim();

    if (correo === "") {
        alert("Ingresa un correo");
        return;
    }

    if (!correo.includes("@") || !correo.includes(".")) {
        alert("Correo inválido");
        return;
    }

    // Cambiar a mensaje
    pasoCorreo.style.display = "none";
    pasoMensaje.style.display = "block";
});

// Cerrar modal
document.addEventListener("click", (e) => {
    if (e.target.id === "cerrarModal") {
        modal.style.display = "none";
    }
});

// Cerrar al hacer clic afuera
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});