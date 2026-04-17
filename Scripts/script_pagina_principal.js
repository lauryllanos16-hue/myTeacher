const defaultImage = "https://via.placeholder.com/120";

/* DATOS DE EJEMPLO */
const tutors = [
    {
        name: "Lionel Andres Messi Cuccittini",
        rating: 5.0,
        price: 40,
        subject: "Matemáticas",
        mode: "Virtual / Presencial",
        image: "" // aquí puedes poner link
    },
    {
        name: "Maria Jose Fernandez Galvan",
        rating: 5.0,
        price: 45,
        subject: "Coreano",
        mode: "Virtual",
        image: "" // aquí puedes poner link
    }
];

const container = document.getElementById("tutor-list");

/* GENERAR TARJETAS */
tutors.forEach(tutor => {
    const card = document.createElement("div");
    card.className = "tutor-card";

    const img = document.createElement("img");
    img.src = tutor.image || defaultImage;

    const info = document.createElement("div");
    info.className = "tutor-info";

    info.innerHTML = `
        <h4>${tutor.name}</h4>
        <p>⭐ ${tutor.rating} | $${tutor.price}/Hora | ${tutor.subject}</p>
        <p>Modalidad: ${tutor.mode}</p>
        <div class="actions">
            <button>Ver perfil</button>
            <button>Reservar</button>
        </div>
    `;

    card.appendChild(img);
    card.appendChild(info);

    container.appendChild(card);
});