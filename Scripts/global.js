/* ══════════════════════════════════════
   CAMPANA DE NOTIFICACIONES
   ══════════════════════════════════════ */
const bell = document.getElementById('bell');
const notifPanel = document.getElementById('notifPanel');

if (bell && notifPanel) {
  bell.addEventListener('click', function(e) {
    e.stopPropagation();
    notifPanel.classList.toggle('visible');
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!bell.contains(e.target) && !notifPanel.contains(e.target)) {
      notifPanel.classList.remove('visible');
    }
  });
}

/* ══════════════════════════════════════
   MENÚ HAMBURGUESA
   ══════════════════════════════════════ */
function toggleMenu() {
  const nav    = document.getElementById('navLinks');
  const burger = document.getElementById('hamburger');
  if (nav) nav.classList.toggle('open');
  if (burger) burger.classList.toggle('open');
}

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const nav    = document.getElementById('navLinks');
    const burger = document.getElementById('hamburger');
    if (nav) nav.classList.remove('open');
    if (burger) burger.classList.remove('open');
  });
});

/* ══════════════════════════════════════
   CERRAR SESIÓN
   ══════════════════════════════════════ */
function cerrarSesion() {
  if (confirm('¿Deseas cerrar sesión?')) {
    window.location.href = "../Autenticacion/inicio_sesion.html"; // cambia por tu ruta de login
  }
}