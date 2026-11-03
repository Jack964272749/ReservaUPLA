import { peticion } from './clienteApi';

// Trazabilidad: RF-02, RF-04 · Nielsen H1, H9 · ISO 9241-11
export const ambienteService = {
  listar: () => peticion('/ambientes', { method: 'GET' }),

  obtenerPorId: (id) => peticion(`/ambientes/${id}`, { method: 'GET' }),

  crear: (datos) =>
    peticion('/ambientes', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  consultarDisponibilidad: (ambienteId, fecha) => {
    const qs = fecha ? `?fecha=${encodeURIComponent(fecha)}` : '';
    return peticion(`/ambientes/disponibilidad/${ambienteId}${qs}`, {
      method: 'GET',
    });
  },
};
