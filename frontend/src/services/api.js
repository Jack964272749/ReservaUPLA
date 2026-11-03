const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage = data?.message || `Error en la solicitud: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`[API ERROR] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Usuarios
  getUsuarios: () => request('/usuarios'),
  getUsuarioById: (id) => request(`/usuarios/${id}`),
  createUsuario: (data) => request('/usuarios', { method: 'POST', body: JSON.stringify(data) }),

  // Ambientes
  getAmbientes: () => request('/ambientes'),
  getAmbienteById: (id) => request(`/ambientes/${id}`),
  createAmbiente: (data) => request('/ambientes', { method: 'POST', body: JSON.stringify(data) }),

  // Reservas
  getReservas: (params = {}) => {
    const query = new URLSearchParams();
    if (params.fecha) query.append('fecha', params.fecha);
    if (params.ambienteId) query.append('ambienteId', params.ambienteId);
    if (params.estado) query.append('estado', params.estado);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/reservas${qs}`);
  },
  getReservaById: (id) => request(`/reservas/${id}`),
  createReserva: (data) => request('/reservas', { method: 'POST', body: JSON.stringify(data) }),
  validarDisponibilidad: (data) => request('/reservas/validar-disponibilidad', { method: 'POST', body: JSON.stringify(data) }),
  cambiarEstadoReserva: (id, data) => request(`/reservas/${id}/estado`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Dashboard
  getIndicadoresDashboard: () => request('/dashboard/indicadores'),
};
