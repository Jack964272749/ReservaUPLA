import { peticion } from './clienteApi';

// Trazabilidad: RF-01 · Nielsen H1, H9
export const usuarioService = {
  listar: () => peticion('/usuarios', { method: 'GET' }),
};
