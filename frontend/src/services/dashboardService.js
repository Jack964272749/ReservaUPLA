import { peticion } from './clienteApi';

// Trazabilidad: RF-08 · Nielsen H1 · Shneiderman S3
export const dashboardService = {
  obtener: () => peticion('/dashboard', { method: 'GET' }),
};
