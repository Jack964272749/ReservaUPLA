// Trazabilidad: Nielsen H4 - Consistencia · Espejo de reglas de negocio del backend
export const REGLAS = {
  USUARIO: {
    MIN_NOMBRE: 3,
    MAX_NOMBRE: 150,
    MAX_CORREO: 150,
    MIN_CLAVE: 8,
    MAX_CLAVE: 64,
    REGEX_NOMBRE: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
    REGEX_CORREO: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  },
  AMBIENTE: {
    MIN_NOMBRE: 3,
    MAX_NOMBRE: 100,
    MAX_UBICACION: 100,
    MIN_CAPACIDAD: 1,
    MAX_CAPACIDAD: 1000,
  },
  RESERVA: {
    HORA_APERTURA: '07:00',
    HORA_CIERRE: '22:00',
    MIN_MOTIVO: 10,
    MAX_MOTIVO: 500,
  },
};
