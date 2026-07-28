document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  const estado = document.getElementById("mensajeEstado");
  const autoInteres = document.getElementById("autoInteres");

  // Precarga el campo "auto de interés" si venimos de una ficha de vehículo
  const params = new URLSearchParams(location.search);
  if (params.get("auto")) autoInteres.value = params.get("auto");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const telefono = document.getElementById("telefono").value.trim();
    const telefonoValido = /^[0-9\-\s]{7,}$/.test(telefono);

    if (!telefonoValido) {
      estado.innerHTML = `<div class="mensaje-error">Revisá el número de teléfono, parece incompleto.</div>`;
      return;
    }

    const consulta = {
      nombre: document.getElementById("nombre").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      telefono,
      auto: autoInteres.value.trim(),
      mensaje: document.getElementById("mensaje").value.trim()
    };

    DubonsDB.guardarConsulta(consulta);

    estado.innerHTML = `<div class="mensaje-exito">¡Gracias, ${consulta.nombre.split(" ")[0]}! Recibimos tu consulta y te contactaremos a la brevedad.</div>`;
    form.reset();
  });
});
