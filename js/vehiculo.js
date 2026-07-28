document.addEventListener("DOMContentLoaded", () => {
  const cont = document.getElementById("contenidoFicha");
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const v = id ? DubonsDB.getVehiculoPorId(id) : null;

  if (!v) {
    cont.innerHTML = `<div class="vacio">
      <h3>No encontramos ese vehículo</h3>
      <p>Puede que el enlace esté incompleto o el auto ya no esté disponible.</p>
      <a class="btn btn-amber" href="catalogo.html">Ir al catálogo</a>
    </div>`;
    return;
  }

  document.title = `${v.marca} ${v.modelo} ${v.anio} | Dubon's`;

  const esFav = DubonsDB.esFavorito(v.id);
  const enComparador = DubonsDB.getComparador().includes(v.id);

  cont.innerHTML = `
    <p style="color:var(--steel); font-family:var(--mono); font-size:0.8rem; margin-bottom:18px;">
      <a href="catalogo.html" style="color:var(--steel);">Catálogo</a> / ${v.marca} ${v.modelo}
    </p>
    <div class="ficha-grid">
      <div class="ficha-imagen">
        <span class="etiqueta-condicion ${v.condicion === 'Nuevo' ? 'nuevo' : ''}" style="position:absolute;">${v.condicion}</span>
        ${siluetaAutoSVG(v)}
      </div>
      <div>
        <h1 style="font-size:2rem;">${v.marca} ${v.modelo}</h1>
        <p style="color:var(--steel);">${v.anio} · ${v.tipo} · Código ${v.id}</p>
        <div class="tarjeta-precio" style="font-size:2rem; margin:10px 0 6px;">${formatoPrecio(v.precio)}</div>
        <p>${v.descripcion}</p>

        <div style="display:flex; gap:10px; margin:20px 0;">
          <button class="btn btn-amber" id="btnFavFicha" aria-pressed="${esFav}">${esFav ? "♥ En favoritos" : "♡ Guardar en favoritos"}</button>
          <button class="btn ${enComparador ? 'btn-taillight' : 'btn-outline-ink'}" id="btnCmpFicha">
            ${enComparador ? "Quitar del comparador" : "Añadir al comparador"}
          </button>
        </div>

        <table class="ficha-tabla">
          <tr><td>Kilometraje</td><td>${formatoKm(v.km)}</td></tr>
          <tr><td>Transmisión</td><td>${v.transmision}</td></tr>
          <tr><td>Combustible</td><td>${v.combustible}</td></tr>
          <tr><td>Tracción</td><td>${v.traccion}</td></tr>
          <tr><td>Potencia</td><td>${v.potenciaHP} HP</td></tr>
        </table>

        <h3 style="font-size:1rem; margin-top:20px;">Equipamiento</h3>
        <div>
          ${v.caracteristicas.map(c => `<span class="chip-caracteristica">${c}</span>`).join("")}
        </div>

        <div style="margin-top:26px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn btn-taillight" href="contacto.html?auto=${encodeURIComponent(v.marca + ' ' + v.modelo)}">Consultar por este auto</a>
          <a class="btn btn-outline-ink" href="financiamiento.html?precio=${v.precio}">Simular financiamiento</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("btnFavFicha").addEventListener("click", (e) => {
    const activo = DubonsDB.toggleFavorito(v.id);
    e.target.setAttribute("aria-pressed", activo);
    e.target.textContent = activo ? "♥ En favoritos" : "♡ Guardar en favoritos";
    actualizarContadoresHeader();
  });

  document.getElementById("btnCmpFicha").addEventListener("click", (e) => {
    const res = DubonsDB.toggleComparador(v.id);
    if (!res.ok) { alert(res.error); return; }
    const ahora = DubonsDB.getComparador().includes(v.id);
    e.target.textContent = ahora ? "Quitar del comparador" : "Añadir al comparador";
    e.target.classList.toggle("btn-taillight", ahora);
    e.target.classList.toggle("btn-outline-ink", !ahora);
    actualizarContadoresHeader();
  });
});
