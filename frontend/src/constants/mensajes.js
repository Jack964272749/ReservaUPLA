// Trazabilidad: Nielsen H9 · Shneiderman 5 · Mensajes claros en lenguaje cotidiano
export const MENSAJES = {
  CORREO_REQUERIDO: 'El correo electrónico es obligatorio (RV-01).',
  CORREO_INVALIDO: 'Ingrese un formato de correo válido, ej: usuario@upla.edu.pe (RV-01).',
  NOMBRE_REQUERIDO: 'El nombre completo es obligatorio (RV-02).',
  NOMBRE_LONGITUD: 'El nombre debe tener entre 3 y 150 caracteres (RV-02).',
  NOMBRE_INVALIDO: 'El nombre solo puede contener letras y espacios (RV-02).',
  CLAVE_REQUERIDA: 'La contraseña es obligatoria (RV-03).',
  CLAVE_LONGITUD: 'La contraseña debe tener entre 8 y 64 caracteres (RV-03).',
  LOGIN_FALLIDO: 'Credenciales incorrectas. Verifique correo y contraseña (E-08).',

  AMBIENTE_NOMBRE_REQUERIDO: 'El nombre del ambiente es obligatorio (RV-04).',
  AMBIENTE_NOMBRE_LONGITUD: 'El nombre del ambiente debe tener entre 3 y 100 caracteres (RV-04).',
  AMBIENTE_TIPO_REQUERIDO: 'Seleccione un tipo de ambiente institucional (RV-05).',
  AMBIENTE_CAPACIDAD_INVALIDA: 'La capacidad debe ser un número entero entre 1 y 1000 (RV-06).',
  AMBIENTE_UBICACION_REQUERIDA: 'La ubicación del ambiente es obligatoria (RV-07).',
  AMBIENTE_UBICACION_LONGITUD: 'La ubicación del ambiente no puede exceder 100 caracteres (RV-07).',

  FECHA_REQUERIDA: 'La fecha de la reserva es obligatoria (RV-08).',
  FECHA_PASADA: 'No puede seleccionar una fecha que ya pasó (RV-08, E-16).',
  HORA_INICIO_REQUERIDA: 'La hora de inicio es obligatoria (RV-09).',
  HORA_FIN_REQUERIDA: 'La hora de fin es obligatoria (RV-09).',
  HORA_FIN_MENOR: 'La hora de fin debe ser mayor que la hora de inicio (RN-03, RV-10, E-14).',
  HORA_FUERA_RANGO: 'Las reservas solo pueden realizarse entre 07:00 y 22:00 horas (RN-04, RV-11, E-15).',
  MOTIVO_REQUERIDO: 'El motivo es obligatorio y debe tener al menos 10 caracteres (RV-12).',

  ERROR_RED: 'No fue posible conectar con el servidor. Verifique su conexión a internet (E-23).',
  ERROR_500: 'Ha ocurrido un error inesperado en el servidor. Por favor intente más tarde (E-24).',
};
