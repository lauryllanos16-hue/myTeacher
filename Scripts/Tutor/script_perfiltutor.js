// ── EDITAR PERFIL ──
const btnEditar = document.querySelector('.btn-primary');

const campos = {
  nombre: document.querySelector('.profile-name'),
  correo: document.querySelector('.profile-email'),
  descripcion: document.querySelector('.desc-text'),
};

btnEditar.addEventListener('click', () => {
  const modoEdicion = btnEditar.textContent === 'Guardar cambios';

  if (modoEdicion) {
    // GUARDAR
    campos.nombre.textContent = 'Nombre: ' + document.getElementById('input-nombre').value;
    campos.correo.textContent = 'Correo: ' + document.getElementById('input-correo').value;
    campos.descripcion.textContent = document.getElementById('input-desc').value;

    // Restaurar texto plano
    document.getElementById('input-nombre').replaceWith(campos.nombre);
    document.getElementById('input-correo').replaceWith(campos.correo);
    document.getElementById('input-desc').replaceWith(campos.descripcion);

    btnEditar.textContent = 'Editar perfil';

  } else {
    // EDITAR — reemplaza texto por inputs
    const valorNombre = campos.nombre.textContent.replace('Nombre: ', '');
    const valorCorreo = campos.correo.textContent.replace('Correo: ', '');
    const valorDesc = campos.descripcion.textContent;

    const inputNombre = crearInput('input-nombre', valorNombre);
    const inputCorreo = crearInput('input-correo', valorCorreo);
    const inputDesc = crearTextarea('input-desc', valorDesc);

    campos.nombre.replaceWith(inputNombre);
    campos.correo.replaceWith(inputCorreo);
    campos.descripcion.replaceWith(inputDesc);

    btnEditar.textContent = 'Guardar cambios';
  }
});

function crearInput(id, valor) {
  const input = document.createElement('input');
  input.type = 'text';
  input.id = id;
  input.value = valor;
  input.style.cssText = `
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border: 1.5px solid #85B1F8;
    border-radius: 7px;
    padding: 6px 10px;
    width: 220px;
    outline: none;
    color: #1a2a3a;
  `;
  return input;
}

function crearTextarea(id, valor) {
  const ta = document.createElement('textarea');
  ta.id = id;
  ta.value = valor;
  ta.rows = 3;
  ta.style.cssText = `
    font-family: 'Nunito', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    border: 1.5px solid #85B1F8;
    border-radius: 7px;
    padding: 6px 10px;
    width: 100%;
    outline: none;
    color: #1a2a3a;
    resize: none;
  `;
  return ta;
}