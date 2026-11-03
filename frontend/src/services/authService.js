import { peticion } from './clienteApi';

// Trazabilidad: Nielsen H1 (Visibilidad), H9 (Recuperación) · Shneiderman S3 · ISO 9241-11
export const authService = {
  login: (correo, contrasena) =>
    peticion('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, contrasena }),
    }),

  logout: () =>
    peticion('/auth/logout', {
      method: 'POST',
    }),

  obtenerUsuarioActual: () =>
    peticion('/auth/yo', {
      method: 'GET',
    }),

  registrarSolicitante: (nombreCompleto, correo, contrasena) =>
    peticion('/usuarios', {
      method: 'POST',
      body: JSON.stringify({ nombreCompleto, correo, contrasena }),
    }),
};
