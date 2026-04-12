document.getElementById("formRegistro").addEventListener("submit", function(e) {
    e.preventDefault();

    let inputs = document.querySelectorAll("input");
    let password = inputs[2].value;
    let confirm = inputs[3].value;

    if (password !== confirm) {
        alert("Las contraseñas no coinciden");
        return;
    }

    alert("Registro exitoso 🎉");
});