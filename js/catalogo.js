/**
 * catalogo.js — filtra, ordena y pinta el catálogo de vehículos.
 * Toda lectura/escritura de datos pasa por DubonsDB (no toca
 * localStorage directamente), manteniendo una sola capa de acceso.
 */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gridCatalogo");
  const conteo = document.getElementById("conteoResultados");
  const selMarca = document.getElementById("fMarca");
  const selTipo = document.getElementById("fTipo");
  const selCondicion = document.getElementById("fCondicion");
  const selPrecio = document.getElementById("fPrecio");
  const selOrden = document.getElementById("fOrden");
  const btnLimpiar = document.getElementById("btnLimpiar");

  // Poblar selects dinámicamente desde la "base de datos"
  DubonsDB.getMarcasUnicas().forEach(m => {
    const opt = document.createElement("option");
    opt.value = m; opt.textContent = m;
    selMarca.appendChild(opt);
  });
  DubonsDB.getTiposUnicos().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t; opt.textContent = t;
    selTipo.appendChild(opt);
  });

  function aplicarFiltros() {
    let lista = DubonsDB.getVehiculos();

    if (selMarca.value) lista = lista.filter(v => v.marca === selMarca.value);
    if (selTipo.value) lista = lista.filter(v => v.tipo === selTipo.value);
    if (selCondicion.value) lista = lista.filter(v => v.condicion === selCondicion.value);
    if (selPrecio.value) lista = lista.filter(v => v.precio <= Number(selPrecio.value));

    switch (selOrden.value) {
      case "precio-asc": lista.sort((a, b) => a.precio - b.precio); break;
      case "precio-desc": lista.sort((a, b) => b.precio - a.precio); break;
      case "anio-desc": lista.sort((a, b) => b.anio - a.anio); break;
      default: lista.sort((a, b) => (b.destacado === true) - (a.destacado === true));
    }

    pintar(lista);
  }

  function pintar(lista) {
    conteo.textContent = `${lista.length} vehículo${lista.length === 1 ? "" : "s"} encontrado${lista.length === 1 ? "" : "s"}`;

    if (lista.length === 0) {
      grid.innerHTML = `<div class="vacio" style="grid-column:1/-1;">
        <h3>No hay autos con esos filtros</h3>
        <p>Probá quitando alguno de los filtros seleccionados.</p>
      </div>`;
      return;
    }

    const comparando = DubonsDB.getComparador();

    grid.innerHTML = lista.map(v => {
      const esFav = DubonsDB.esFavorito(v.id);
      const enComparador = comparando.includes(v.id);
      return `
      <div class="tarjeta-auto" data-id="${v.id}">
        <div class="tarjeta-imagen">
          <span class="etiqueta-condicion ${v.condicion === 'Nuevo' ? 'nuevo' : ''}">${v.condicion}</span>
          <button class="btn-favorito" data-fav-btn="${v.id}" aria-pressed="${esFav}" aria-label="Marcar como favorito">${esFav ? "♥" : "♡"}</button>
          ${siluetaAutoSVG(v)}
        </div>
        <div class="tarjeta-cuerpo">
          <h3>${v.marca} ${v.modelo}</h3>
          <div class="anio-tipo">${v.anio} · ${v.tipo} · ${v.transmision}</div>
          <div class="tarjeta-precio">${formatoPrecio(v.precio)}</div>
          <div class="tarjeta-specs">
            <span>${formatoKm(v.km)}</span>
            <span>${v.combustible}</span>
            <span>${v.traccion}</span>
          </div>
          <div class="tarjeta-acciones">
            <a class="btn btn-outline-ink" href="vehiculo.html?id=${v.id}">Ver ficha</a>
            <button class="btn ${enComparador ? 'btn-taillight' : 'btn-amber'}" data-cmp-btn="${v.id}">
              ${enComparador ? "Quitar" : "Comparar"}
            </button>
          </div>
        </div>
      </div>`;
    }).join("");

    // Listeners de favoritos
    grid.querySelectorAll("[data-fav-btn]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-fav-btn");
        const activo = DubonsDB.toggleFavorito(id);
        btn.setAttribute("aria-pressed", activo);
        btn.textContent = activo ? "♥" : "♡";
        actualizarContadoresHeader();
      });
    });

    // Listeners de comparador
    grid.querySelectorAll("[data-cmp-btn]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-cmp-btn");
        const res = DubonsDB.toggleComparador(id);
        if (!res.ok) {
          alert(res.error);
          return;
        }
        actualizarContadoresHeader();
        aplicarFiltros();
      });
    });
  }

  [selMarca, selTipo, selCondicion, selPrecio, selOrden].forEach(el => {
    el.addEventListener("change", aplicarFiltros);
  });

  btnLimpiar.addEventListener("click", () => {
    selMarca.value = ""; selTipo.value = ""; selCondicion.value = "";
    selPrecio.value = ""; selOrden.value = "relevancia";
    aplicarFiltros();
  });

  aplicarFiltros();
});
