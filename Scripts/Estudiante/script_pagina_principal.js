const DEFAULT_AVATAR = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
    <rect width="96" height="96" fill="#dde4f5" rx="8"/>
    <circle cx="48" cy="36" r="18" fill="#a0aecb"/>
    <ellipse cx="48" cy="78" rx="30" ry="20" fill="#a0aecb"/>
  </svg>
`);

const tutores = [
  { nombre: "Lionel Andres Messi Cuccittini", rating: 5.0, precio: "$40/Hora", materia: "Matematicas", modalidad: "Virtual / Presencial", foto: "" },
  { nombre: "Maria Jose Fernandez Galvan", rating: 5.0, precio: "$45/Hora", materia: "Coreano", modalidad: "Virtual", foto: "" }
];

function renderTutores(lista) {
  const container = document.getElementById('tutorsContainer');

  container.innerHTML = lista.map((t, i) => `
    <div class="tutor-card">
      <img class="tutor-img" src="${t.foto || DEFAULT_AVATAR}" 
           onerror="this.src='${DEFAULT_AVATAR}'">

      <div class="tutor-info">
        <div class="tutor-name">${t.nombre}</div>

        <div class="tutor-meta">
          <span class="star">&#11088;</span> ${t.rating}
          <span class="sep">|</span> ${t.precio}
          <span class="sep">|</span> ${t.materia}
        </div>

        <div class="tutor-modality">
          Modalidad : <strong>${t.modalidad}</strong>
        </div>

        <div class="tutor-btns">
          <button class="btn btn-secondary">Ver perfil</button>
          <button class="btn btn-primary">Reservar</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── EVENTOS (FORMA CORRECTA: delegación) ── */
document.getElementById('tutorsContainer').addEventListener('click', function(e) {
  
  const btnVer = e.target.closest('.btn-ver');
  const btnReservar = e.target.closest('.btn-reservar');

  if (btnVer) {
    const index = btnVer.dataset.index;
    alert("Ver perfil de: " + tutores[index].nombre);
  }

  if (btnReservar) {
    const index = btnReservar.dataset.index;
    const tutor = tutores[index];

    localStorage.setItem("tutorSeleccionado", JSON.stringify(tutor));
    window.location.href = "reservar.html";
  }
});

/* ── BUSCADOR ── */
document.querySelector('.btn-buscar').addEventListener('click', function() {
  const selects = document.querySelectorAll('.field-row select');
  const materia = selects[0].value;
  const modalidad = selects[1].value;
  const nivel = selects[2].value;

  alert(`Buscando tutores de ${materia} (${modalidad}, ${nivel})`);
});

/* ── VER MÁS ── */
document.querySelector('.btn-ver-mas').addEventListener('click', function() {
  alert('Cargando más tutores...');
});

/* INIT */
renderTutores(tutores);