// Scripts/api.js
const API = 'https://myteacher-production-e87b.up.railway.app/api';

window.myTeacherAPI = {
  // AUTH
  login: (correo, password) =>
    fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    }).then(r => r.json()),

  registro: (datos) =>
    fetch(`${API}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    }).then(r => r.json()),

  // TUTORES
  getTutores: (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    return fetch(`${API}/tutores?${params}`).then(r => r.json());
  },
  getTutor: (id) =>
    fetch(`${API}/tutores/${id}`).then(r => r.json()),

  // RESERVAS
  getReservas: (estudianteId) =>
    fetch(`${API}/reservas/${estudianteId}`).then(r => r.json()),
  crearReserva: (datos) =>
    fetch(`${API}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    }).then(r => r.json()),
  cancelarReserva: (id) =>
    fetch(`${API}/reservas/${id}/cancelar`, {
      method: 'PUT',
    }).then(r => r.json()),

  // RESEÑAS
  getResenas: (tutorId) =>
    fetch(`${API}/resenas/${tutorId}`).then(r => r.json()),
  crearResena: (datos) =>
    fetch(`${API}/resenas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    }).then(r => r.json()),

  // MATERIAS
  getMaterias: () =>
    fetch(`${API}/materias`).then(r => r.json()),
};