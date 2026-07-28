/**
 * db.js
 * -------------------------------------------------------------
 * Simula el motor de base de datos del sitio. Todas las páginas
 * consultan los datos SOLO a través de las funciones de este
 * archivo (nunca leen localStorage directamente en otras partes),
 * exactamente como una app real hablaría con una API en vez de
 * tocar la base de datos directo. Esto facilita explicar la
 * arquitectura del proyecto en la feria.
 *
 * Colecciones (equivalentes a "tablas"):
 *   dubons_vehiculos     -> catálogo de autos (sembrado desde data.js)
 *   dubons_favoritos     -> ids de autos marcados como favoritos
 *   dubons_comparador    -> ids de autos seleccionados para comparar (máx 3)
 *   dubons_consultas     -> mensajes enviados desde el formulario de contacto
 * -------------------------------------------------------------
 */

const DubonsDB = (() => {
  const KEYS = {
    vehiculos: "dubons_vehiculos",
    favoritos: "dubons_favoritos",
    comparador: "dubons_comparador",
    consultas: "dubons_consultas"
  };

  function _read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("DubonsDB: error leyendo", key, e);
      return fallback;
    }
  }

  function _write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("DubonsDB: error escribiendo", key, e);
      return false;
    }
  }

  /** Siembra el catálogo la primera vez que se visita el sitio. */
  function init() {
    if (!localStorage.getItem(KEYS.vehiculos)) {
      _write(KEYS.vehiculos, DUBONS_SEED_VEHICULOS);
    }
    if (!localStorage.getItem(KEYS.favoritos)) _write(KEYS.favoritos, []);
    if (!localStorage.getItem(KEYS.comparador)) _write(KEYS.comparador, []);
    if (!localStorage.getItem(KEYS.consultas)) _write(KEYS.consultas, []);
  }

  // ---------- Vehículos ----------
  function getVehiculos() {
    return _read(KEYS.vehiculos, []);
  }

  function getVehiculoPorId(id) {
    return getVehiculos().find(v => v.id === id) || null;
  }

  function getMarcasUnicas() {
    return [...new Set(getVehiculos().map(v => v.marca))].sort();
  }

  function getTiposUnicos() {
    return [...new Set(getVehiculos().map(v => v.tipo))].sort();
  }

  // ---------- Favoritos ----------
  function getFavoritos() {
    return _read(KEYS.favoritos, []);
  }

  function esFavorito(id) {
    return getFavoritos().includes(id);
  }

  function toggleFavorito(id) {
    const favs = getFavoritos();
    const idx = favs.indexOf(id);
    if (idx === -1) favs.push(id); else favs.splice(idx, 1);
    _write(KEYS.favoritos, favs);
    return favs.includes(id);
  }

  // ---------- Comparador ----------
  const MAX_COMPARAR = 3;

  function getComparador() {
    return _read(KEYS.comparador, []);
  }

  function toggleComparador(id) {
    const lista = getComparador();
    const idx = lista.indexOf(id);
    if (idx !== -1) {
      lista.splice(idx, 1);
      _write(KEYS.comparador, lista);
      return { ok: true, lista };
    }
    if (lista.length >= MAX_COMPARAR) {
      return { ok: false, lista, error: `Solo puedes comparar hasta ${MAX_COMPARAR} autos a la vez.` };
    }
    lista.push(id);
    _write(KEYS.comparador, lista);
    return { ok: true, lista };
  }

  function limpiarComparador() {
    _write(KEYS.comparador, []);
  }

  // ---------- Consultas (contacto) ----------
  function guardarConsulta(consulta) {
    const consultas = _read(KEYS.consultas, []);
    consultas.push({ ...consulta, fecha: new Date().toISOString() });
    return _write(KEYS.consultas, consultas);
  }

  return {
    init,
    getVehiculos,
    getVehiculoPorId,
    getMarcasUnicas,
    getTiposUnicos,
    getFavoritos,
    esFavorito,
    toggleFavorito,
    MAX_COMPARAR,
    getComparador,
    toggleComparador,
    limpiarComparador,
    guardarConsulta
  };
})();

document.addEventListener("DOMContentLoaded", DubonsDB.init);
