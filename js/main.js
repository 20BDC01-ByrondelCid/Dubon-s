/**
 * main.js — funciones compartidas entre todas las páginas del sitio.
 */

// Resalta el link activo del nav según el archivo actual
function marcarNavActivo() {
  const actual = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === actual) link.classList.add("activo");
  });
}

// Menú móvil (hamburguesa)
function initMenuMovil() {
  const btn = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-links");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    btn.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
}

// Actualiza los contadores de favoritos / comparador en el header
function actualizarContadoresHeader() {
  const favCount = document.querySelector("[data-fav-count]");
  const cmpCount = document.querySelector("[data-cmp-count]");
  if (favCount) favCount.textContent = DubonsDB.getFavoritos().length;
  if (cmpCount) cmpCount.textContent = DubonsDB.getComparador().length;
}

// Formatea números como moneda en quetzales (GTQ) simplificado con $ para agencia
function formatoPrecio(num) {
  return "Q " + num.toLocaleString("es-GT");
}

function formatoKm(num) {
  if (num === 0) return "0 km (nuevo)";
  return num.toLocaleString("es-GT") + " km";
}

/**
 * Genera un ícono SVG plano y liviano de un auto, sin depender de
 * internet ni de fotografías externas. El color varía según el
 * vehículo, y se agrega el sello "REVISADO" si es seminuevo,
 * reforzando la identidad visual de Dubon's en todo el catálogo.
 */
function siluetaAutoSVG(v) {
  const color = v.color || "#14181f";
  const esSuvOPickup = v.tipo === "SUV" || v.tipo === "Pick Up" || v.tipo === "Microbús";
  const alturaCarroceria = esSuvOPickup ? 46 : 34;
  const sello = v.condicion === "Seminuevo" ? `
    <g class="sello-revisado" transform="translate(228,18) rotate(-10)">
      <circle cx="0" cy="0" r="26" fill="none" stroke="#2f6f4e" stroke-width="2.5"/>
      <circle cx="0" cy="0" r="21" fill="none" stroke="#2f6f4e" stroke-width="1"/>
      <path id="curvaTexto${v.id}" d="M -18 8 A 20 20 0 1 1 18 8" fill="none"/>
      <text font-family="Oswald, sans-serif" font-size="6.2" fill="#2f6f4e" letter-spacing="1">
        <textPath href="#curvaTexto${v.id}" startOffset="50%" text-anchor="middle">REVISADO • DUBON'S</textPath>
      </text>
      <text x="0" y="4" font-family="Oswald, sans-serif" font-size="9" fill="#2f6f4e" text-anchor="middle" font-weight="700">✓</text>
    </g>` : "";

  return `
  <svg viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${v.marca} ${v.modelo}">
    <rect x="0" y="100" width="260" height="3" fill="#c9cdd6"/>
    <g transform="translate(20,${96 - alturaCarroceria})">
      <path d="M0,${alturaCarroceria} Q0,${alturaCarroceria - 22} 30,${alturaCarroceria - 24}
               L55,${alturaCarroceria - 24} Q70,${alturaCarroceria - 42} 100,${alturaCarroceria - 42}
               L140,${alturaCarroceria - 42} Q168,${alturaCarroceria - 42} 180,${alturaCarroceria - 24}
               L195,${alturaCarroceria - 24} Q220,${alturaCarroceria - 22} 220,${alturaCarroceria}
               Z" fill="${color}"/>
      <path d="M65,${alturaCarroceria - 24} Q76,${alturaCarroceria - 36} 100,${alturaCarroceria - 36}
               L140,${alturaCarroceria - 36} Q160,${alturaCarroceria - 36} 172,${alturaCarroceria - 24} Z"
            fill="#eef0ea" opacity="0.85"/>
      <circle cx="45" cy="${alturaCarroceria + 4}" r="14" fill="#14181f"/>
      <circle cx="45" cy="${alturaCarroceria + 4}" r="6" fill="#c9cdd6"/>
      <circle cx="180" cy="${alturaCarroceria + 4}" r="14" fill="#14181f"/>
      <circle cx="180" cy="${alturaCarroceria + 4}" r="6" fill="#c9cdd6"/>
    </g>
    ${sello}
  </svg>`;
}

document.addEventListener("DOMContentLoaded", () => {
  marcarNavActivo();
  initMenuMovil();
  // pequeño retraso para asegurar que DubonsDB.init ya corrió
  setTimeout(actualizarContadoresHeader, 0);
  const anioFooter = document.querySelector("[data-anio]");
  if (anioFooter) anioFooter.textContent = new Date().getFullYear();
});
