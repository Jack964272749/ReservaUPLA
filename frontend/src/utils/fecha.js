// Trazabilidad: Zona Horaria · Cálculo de fecha en zona horaria local (YYYY-MM-DD)
// Trazabilidad: RF-03 · El backend espera TimeSpan (HH:mm:ss); los inputs de hora entregan HH:mm
export function normalizarHora(hora) {
  return typeof hora === 'string' && /^\d{2}:\d{2}$/.test(hora) ? `${hora}:00` : hora;
}

export function obtenerFechaLocalISO(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}
