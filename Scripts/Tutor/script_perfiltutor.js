//Avatar por defecto
const DEFAULT_AVATAR =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110">
    <rect width="110" height="110" fill="#dde4f5" rx="55"/>
    <circle cx="55" cy="42" r="22" fill="#a0aecb"/>
    <ellipse cx="55" cy="90" rx="34" ry="24" fill="#a0aecb"/>
  </svg>
`);

const avatarImg = document.getElementById("avatarImg");
avatarImg.src = DEFAULT_AVATAR;
avatarImg.onerror = function () {
  this.src = DEFAULT_AVATAR;
};

function cambiarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    avatarImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

//Funcion del boton editar perfil
let editando = false;

function toggleEditar() {
  editando = !editando;
  const form = document.getElementById("editForm");
  const btn = document.getElementById("btnEditar");

  if (editando) {
    document.getElementById("inputNombre").value =
      document.getElementById("nombreTexto").textContent;
    document.getElementById("inputCorreo").value =
      document.getElementById("correoTexto").textContent;
    document.getElementById("inputMaterias").value =
      document.getElementById("materiasTexto").textContent;
    document.getElementById("inputUbicacion").value =
      document.getElementById("ubicacionTexto").textContent;
    document.getElementById("inputPrecio").value =
      document.getElementById("precioTexto").textContent;
    document.getElementById("inputDesc").value =
      document.getElementById("descTexto").textContent;

    const modalidadActual =
      document.getElementById("modalidadTexto").textContent;
    const selMod = document.getElementById("inputModalidad");
    for (let i = 0; i < selMod.options.length; i++) {
      if (selMod.options[i].text === modalidadActual) {
        selMod.selectedIndex = i;
        break;
      }
    }

    form.style.display = "block";
    btn.textContent = "Cancelar edición";
  } else {
    form.style.display = "none";
    btn.textContent = "Editar perfil";
  }
}

function cancelarEditar() {
  editando = false;
  document.getElementById("editForm").style.display = "none";
  document.getElementById("btnEditar").textContent = "Editar perfil";
}

function guardarEditar() {
  const nombre = document.getElementById("inputNombre").value.trim();
  const correo = document.getElementById("inputCorreo").value.trim();
  const materias = document.getElementById("inputMaterias").value.trim();
  const ubicacion = document.getElementById("inputUbicacion").value.trim();
  const precio = document.getElementById("inputPrecio").value.trim();
  const modalidad = document.getElementById("inputModalidad").value;
  const desc = document.getElementById("inputDesc").value.trim();

  if (!nombre || !correo) {
    alert("Por favor completa nombre y correo.");
    return;
  }

  document.getElementById("nombreTexto").textContent = nombre;
  document.getElementById("correoTexto").textContent = correo;
  document.getElementById("materiasTexto").textContent = materias;
  document.getElementById("ubicacionTexto").textContent = ubicacion;
  document.getElementById("precioTexto").textContent = precio;
  document.getElementById("modalidadTexto").textContent = modalidad;
  document.getElementById("descTexto").textContent = desc;

  cancelarEditar();
}
