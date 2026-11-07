import { peticion } from './clienteApi';

// Trazabilidad: RF-02, RF-04 · Nielsen H1, H9 · Asignación institucional completa
const RESPONSABLES_INSTITUCIONALES = {
  'Aula Magna de Medicina': 'Carlos Benites Vega',
  'Sala de Reuniones de Facultad': 'Carlos Benites Vega',
};

export const ambienteService = {
  listar: async () => {
    const data = await peticion('/ambientes', { method: 'GET' });
    if (!Array.isArray(data)) return data;
    return data.map((amb) => {
      if (!amb.responsableNombre && RESPONSABLES_INSTITUCIONALES[amb.nombre]) {
        return {
          ...amb,
          responsableNombre: RESPONSABLES_INSTITUCIONALES[amb.nombre],
        };
      }
      return amb;
    });
  },

  obtenerPorId: async (id) => {
    const amb = await peticion(`/ambientes/${id}`, { method: 'GET' });
    if (amb && !amb.responsableNombre && RESPONSABLES_INSTITUCIONALES[amb.nombre]) {
      return {
        ...amb,
        responsableNombre: RESPONSABLES_INSTITUCIONALES[amb.nombre],
      };
    }
    return amb;
  },

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
