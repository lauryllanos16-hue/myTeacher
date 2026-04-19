document.querySelector('.btn-primary').addEventListener('click', () => {
  alert('Iniciando clase con Ana Gomez...');
});


document.querySelector('.btn-secondary').addEventListener('click', () => {
  const confirmar = confirm('¿Seguro que deseas cancelar esta tutoría?');
  if (confirmar) alert('Tutoría cancelada.');
});


document.querySelectorAll('.btn-primary')[1].addEventListener('click', () => {
  alert('Cargando más tutorías...');
});