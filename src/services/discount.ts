export function aplicarDescuento(descuentoPorcentaje: number, precio: number, fechaDescuento: Date): number {
  const hoy = new Date();
  if (descuentoPorcentaje > 0 && hoy <= fechaDescuento) {
    const descuento = (descuentoPorcentaje / 100) * precio;
    return precio - descuento;
  }
  return precio;
}
