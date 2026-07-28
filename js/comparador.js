document.addEventListener("DOMContentLoaded", () => {
  const zona = document.getElementById("zonaComparador");
  const btnLimpiar = document.getElementById("btnLimpiarCmp");

  function filaMejor(valores, tipo) {
    // tipo: "menor" resalta el valor más bajo como mejor, "mayor" resalta el más alto
    if (tipo === "menor") return Math.min(...valores);
    return Math.max(...valores);
  }

  function render() {
    const ids = DubonsDB.getComparador();
    const autos = ids.map(id => DubonsDB.getVehiculoPorId(id)).filter(Boolean);

    if (autos.length === 0) {
      zona.innerHTML = `<div class="vacio">
        <h3>Aún no seleccionaste autos para comparar</h3>
        <p>Andá al catálogo y presioná "Comparar" en hasta 3 vehículos.</p>
        <a class="btn btn-amber" href="catalogo.html">Ir al catálogo</a>
      </div>`;
      return;
    }

    const precioMejor = filaMejor(autos.map(a => a.precio), "menor");
    const kmMejor = filaMejor(autos.map(a => a.km), "menor");
    const hpMejor = filaMejor(autos.map(a => a.potenciaHP), "mayor");

    const filas = [
      { etiqueta: "Precio", val: a => formatoPrecio(a.precio), resaltar: a => a.precio === precioMejor },
      { etiqueta: "Año", val: a => a.anio },
      { etiqueta: "Condición", val: a => a.condicion },
      { etiqueta: "Kilometraje", val: a => formatoKm(a.km), resaltar: a => a.km === kmMejor },
      { etiqueta: "Transmisión", val: a => a.transmision },
      { etiqueta: "Combustible", val: a => a.combustible },
      { etiqueta: "Tracción", val: a => a.traccion },
      { etiqueta: "Potencia", val: a => a.potenciaHP + " HP", resaltar: a => a.potenciaHP === hpMejor },
      { etiqueta: "Tipo", val: a => a.tipo },
    ];

    zona.innerHTML = `
      <div style="overflow-x:auto;">
      <table class="tabla-comparar">
        <thead>
          <tr>
            <th></th>
            ${autos.map(a => `
              <th>
                <div style="margin-bottom:8px;">${siluetaAutoSVG(a)}</div>
                ${a.marca} ${a.modelo}
                <div style="margin-top:8px;">
                  <a href="vehiculo.html?id=${a.id}" class="btn btn-outline-ink" style="font-size:0.7rem; padding:6px 10px;">Ver ficha</a>
                  <button class="btn btn-taillight" data-quitar="${a.id}" style="font-size:0.7rem; padding:6px 10px;">Quitar</button>
                </div>
              </th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${filas.map(f => `
            <tr>
              <th>${f.etiqueta}</th>
              ${autos.map(a => `<td style="${f.resaltar && f.resaltar(a) ? 'color:var(--verified); font-weight:600;' : ''}">${f.val(a)}</td>`).join("")}
            </tr>`).join("")}
        </tbody>
      </table>
      </div>
    `;

    zona.querySelectorAll("[data-quitar]").forEach(btn => {
      btn.addEventListener("click", () => {
        DubonsDB.toggleComparador(btn.getAttribute("data-quitar"));
        actualizarContadoresHeader();
        render();
      });
    });
  }

  btnLimpiar.addEventListener("click", () => {
    DubonsDB.limpiarComparador();
    actualizarContadoresHeader();
    render();
  });

  render();
});
