import { peticion } from './clienteApi';

// Trazabilidad: RF-03, RF-05, RF-06, RF-07 · RN-01 a RN-06 · Nielsen H1, H5, H9
export const reservaService = {
  listar: (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.fecha) params.append('fecha', filtros.fecha);
    if (filtros.ambienteId) params.append('ambienteId', filtros.ambienteId);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.pagina) params.append('pagina', filtros.pagina.toString());
    if (filtros.tamanoPagina) params.append('tamanoPagina', filtros.tamanoPagina.toString());

    const qs = params.toString() ? `?${params.toString()}` : '';
    return peticion(`/reservas${qs}`, { method: 'GET' });
  },

  obtenerPorId: (id) => peticion(`/reservas/${id}`, { method: 'GET' }),

  crear: (datos) =>
    peticion('/reservas', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  cambiarEstado: (id, nuevoEstado, motivoRechazo) =>
    peticion(`/reservas/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ nuevoEstado, motivoRechazo }),
    }),
};
