import { peticion } from './clienteApi';
import { normalizarHora } from '../utils/fecha';
import { normalizarReserva, normalizarPagina } from '../utils/reservaMapper';

// Adapta los datos de una respuesta exitosa sin tocar las respuestas con error
const adaptar = (promesa, fn) =>
  promesa.then((res) => (res.exito && res.datos ? { ...res, datos: fn(res.datos) } : res));

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
    return adaptar(peticion(`/reservas${qs}`, { method: 'GET' }), normalizarPagina);
  },

  obtenerPorId: (id) =>
    adaptar(peticion(`/reservas/${id}`, { method: 'GET' }), normalizarReserva),

  crear: (datos) =>
    adaptar(
      peticion('/reservas', {
        method: 'POST',
        body: JSON.stringify({
          ...datos,
          horaInicio: normalizarHora(datos.horaInicio),
          horaFin: normalizarHora(datos.horaFin),
        }),
      }),
      normalizarReserva
    ),

  cambiarEstado: (id, nuevoEstado, motivoRechazo) =>
    adaptar(
      peticion(`/reservas/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ nuevoEstado, motivoRechazo }),
      }),
      normalizarReserva
    ),
};
