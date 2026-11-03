// Trazabilidad: Nielsen H5 - Prevención de errores · Normalización preventiva de datos
export const normalizarTexto = (texto) => (texto ? texto.trim().replace(/\s+/g, ' ') : '');

export const normalizarCorreo = (correo) => (correo ? correo.trim().toLowerCase() : '');
