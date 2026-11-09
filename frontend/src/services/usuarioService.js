import { peticion } from './clienteApi';

// Trazabilidad: RF-01 · Nielsen H1, H9 · Shneiderman S1, S2
export const usuarioService = {
  listar: () => peticion('/usuarios', { method: 'GET' }),
  crearPorAdmin: ({ nombreCompleto, correo, rol, contrasena, codigo, activo = true }) =>
    peticion('/usuarios/crear', {
      method: 'POST',
      body: JSON.stringify({ nombreCompleto, correo, rol, contrasena, codigo, activo }),
    }),
  actualizar: (id, { nombreCompleto, rol, activo, codigo }) =>
    peticion(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nombreCompleto, rol, activo, codigo }),
    }),
  cambiarEstado: (id, activo) =>
    peticion(`/usuarios/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ activo }),
    }),
};
