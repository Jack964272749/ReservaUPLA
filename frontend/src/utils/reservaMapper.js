// Trazabilidad: RF-05, RF-06 · Adapta la respuesta del backend (ReservaDto) a lo que usa la interfaz
export function recortarHora(hora) {
  return typeof hora === 'string' && /^\d{2}:\d{2}:\d{2}/.test(hora) ? hora.slice(0, 5) : hora;
}

export function normalizarReserva(r) {
  if (!r || typeof r !== 'object') return r;
  return {
    ...r,
    solicitanteNombre: r.solicitanteNombre ?? r.usuarioNombre,
    solicitanteCorreo: r.solicitanteCorreo ?? r.usuarioCorreo,
    horaInicio: recortarHora(r.horaInicio),
    horaFin: recortarHora(r.horaFin),
  };
}

export function normalizarPagina(p) {
  if (!p || typeof p !== 'object') return p;
  const items = Array.isArray(p.items) ? p.items.map(normalizarReserva) : [];
  const total = p.totalItems ?? p.totalRegistros ?? items.length;
  const tamano = p.tamanoPagina || 10;
  return {
    ...p,
    items,
    totalItems: total,
    totalRegistros: total,
    totalPaginas: Math.max(1, Math.ceil(total / tamano)),
  };
}
