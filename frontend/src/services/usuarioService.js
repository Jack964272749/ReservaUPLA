import { peticion } from './clienteApi';

// Trazabilidad: RF-01 · Nielsen H1, H9 · Shneiderman S1, S2
export const usuarioService = {
  listar: () => peticion('/usuarios', { method: 'GET' }),
  actualizar: (id, { nombreCompleto, rol, activo }) =>
    peticion(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nombreCompleto, rol, activo }),
    }),
  cambiarEstado: (id, activo) =>
    peticion(`/usuarios/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ activo }),
    }),
};
