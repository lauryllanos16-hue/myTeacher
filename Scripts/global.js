const bell = document.getElementById("bell");
const panel = document.getElementById("notifPanel");

bell.addEventListener("click", () => {
  panel.classList.toggle("active");
});
document.addEventListener("click", (e) => {
  if (!bell.contains(e.target) && !panel.contains(e.target)) {
    panel.classList.remove("active");
  }
});
function cerrarSesion() {

  // redirigir al login
  window.location.href = "../Autenticacion/inicio_sesion.html";
}
function toggleMenu() {
  const nav    = document.getElementById('navLinks');
  const burger = document.getElementById('hamburger');
  nav.classList.toggle('open');
  burger.classList.toggle('open');
}

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});
