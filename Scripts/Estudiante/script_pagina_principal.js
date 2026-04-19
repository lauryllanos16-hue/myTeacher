const DEFAULT_AVATAR = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
    <rect width="96" height="96" fill="#dde4f5" rx="8"/>
    <circle cx="48" cy="36" r="18" fill="#a0aecb"/>
    <ellipse cx="48" cy="78" rx="30" ry="20" fill="#a0aecb"/>
  </svg>
`);

const tutores = [
  { nombre: "Lionel Andres Messi Cuccittini", rating: 5.0, precio: "$40/Hora", materia: "Matematicas", modalidad: "Virtual / Presencial", foto: "" },
  { nombre: "Maria Jose Fernandez Galvan",    rating: 5.0, precio: "$45/Hora", materia: "Coreano",      modalidad: "Virtual",             foto: "" }
];

function renderTutores(lista) {
  const container = document.getElementById('tutorsContainer');
  container.innerHTML = lista.map((t, i) => `
    <div class="tutor-card">
      <img class="tutor-img" src="${t.foto || DEFAULT_AVATAR}" alt="${t.nombre}"
           onerror="this.src='${DEFAULT_AVATAR}'">
      <div class="tutor-info">
        <div class="tutor-name">${t.nombre}</div>
        <div class="tutor-meta">
          <span class="star">&#11088;</span> ${t.rating}
          <span class="sep">|</span> ${t.precio}
          <span class="sep">|</span> ${t.materia}
        </div>
        <div class="tutor-modality">Modalidad : <strong>${t.modalidad}</strong></div>
        <div class="tutor-btns">
          <button class="btn-ver" onclick="verPerfil(${i})">Ver perfil</button>
          <button class="btn-reservar" onclick="reservarTutor(${i})">Reservar</button>
        </div>
      </div>
    </div>
  `).join('');
}
function verPerfil(index) {
  alert("Ver perfil del tutor #" + index);
}

function reservarTutor(index) {
  window.location.href = "reservar.html";
}
  // Re-asignar eventos después de renderizar
  document.querySelectorAll('.btn-ver').forEach(btn => {
    btn.addEventListener('click', function() {
      alert('Ver perfil de: ' + this.closest('.tutor-card').querySelector('.tutor-name').textContent);
    });
  });
  document.querySelectorAll('.btn-reservar').forEach(btn => {
    btn.addEventListener('click', function() {
      alert('Reservar con: ' + this.closest('.tutor-card').querySelector('.tutor-name').textContent);
    });
  });


renderTutores(tutores);
 
  /* Aplicar avatar por defecto a todas las imágenes de tutor */
  document.querySelectorAll('.tutor-img').forEach(img => {
    img.src = DEFAULT_AVATAR;
    img.style.visibility = 'visible';
    img.onerror = function() { this.src = DEFAULT_AVATAR; };
  });
 
  /* ── Botones (placeholder para integración) ── */
  document.querySelectorAll('.btn-ver').forEach(btn => {
    btn.addEventListener('click', function() {
      const name = this.closest('.tutor-card').querySelector('.tutor-name').textContent;
      alert('Ver perfil de: ' + name);
    });
  });
 
  document.querySelector('.btn-buscar').addEventListener('click', function() {
    const materia = document.querySelectorAll('.field-row select')[0].value;
    const modalidad = document.querySelectorAll('.field-row select')[1].value;
    const nivel = document.querySelectorAll('.field-row select')[2].value;
    alert('Buscando tutores de ' + materia + ' (' + modalidad + ', ' + nivel + ')...');
  });
 
  document.querySelector('.btn-ver-mas').addEventListener('click', function() {
    alert('Cargando más tutores...');
  });
  