document.addEventListener("DOMContentLoaded", () => {
  const precioAuto = document.getElementById("precioAuto");
  const enganche = document.getElementById("enganche");
  const plazo = document.getElementById("plazo");
  const tasa = document.getElementById("tasa");

  const valEnganche = document.getElementById("valEnganche");
  const valPlazo = document.getElementById("valPlazo");
  const valTasa = document.getElementById("valTasa");

  const cuotaMensual = document.getElementById("cuotaMensual");
  const montoFinanciar = document.getElementById("montoFinanciar");
  const montoEnganche = document.getElementById("montoEnganche");
  const totalIntereses = document.getElementById("totalIntereses");
  const totalPagar = document.getElementById("totalPagar");

  // Si venimos de una ficha de vehículo con ?precio=, precargamos el precio
  const params = new URLSearchParams(location.search);
  if (params.get("precio")) precioAuto.value = params.get("precio");

  /**
   * Fórmula de amortización francesa (cuota fija):
   * cuota = P * i / (1 - (1 + i)^-n)
   * P = monto financiado, i = tasa mensual, n = número de cuotas
   */
  function calcular() {
    const precio = Math.max(0, Number(precioAuto.value) || 0);
    const pctEnganche = Number(enganche.value);
    const meses = Number(plazo.value);
    const tasaAnual = Number(tasa.value);

    valEnganche.textContent = pctEnganche + "%";
    valPlazo.textContent = meses + " meses";
    valTasa.textContent = tasaAnual + "%";

    const montoEng = precio * (pctEnganche / 100);
    const financiado = precio - montoEng;
    const tasaMensual = (tasaAnual / 100) / 12;

    let cuota;
    if (tasaMensual === 0) {
      cuota = financiado / meses;
    } else {
      cuota = financiado * tasaMensual / (1 - Math.pow(1 + tasaMensual, -meses));
    }
    if (!isFinite(cuota) || isNaN(cuota)) cuota = 0;

    const totalPagado = cuota * meses;
    const intereses = totalPagado - financiado;

    cuotaMensual.textContent = formatoPrecio(Math.round(cuota));
    montoFinanciar.textContent = formatoPrecio(Math.round(financiado));
    montoEnganche.textContent = formatoPrecio(Math.round(montoEng));
    totalIntereses.textContent = formatoPrecio(Math.round(intereses));
    totalPagar.textContent = formatoPrecio(Math.round(totalPagado + montoEng));
  }

  [precioAuto, enganche, plazo, tasa].forEach(el => el.addEventListener("input", calcular));
  calcular();
});
