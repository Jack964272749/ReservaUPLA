import { MENSAJES } from '../constants/mensajes';

// Trazabilidad: Shneiderman 5 · Conversor unificado de respuestas HTTP para la interfaz
export function interpretarRespuesta(estado, datos) {
  if (estado === 0) {
    return {
      errores: {},
      errorGeneral: MENSAJES.ERROR_RED,
      accion: 'reintentar_conexion',
    };
  }

  if (estado === 401) {
    return {
      errores: {},
      errorGeneral: datos?.mensaje || MENSAJES.LOGIN_FALLIDO,
      accion: 'enfocar_clave',
    };
  }

  if (estado === 403) {
    return {
      errores: {},
      errorGeneral: datos?.mensaje || 'No cuenta con los permisos necesarios para realizar esta acción.',
      accion: 'denegar_acceso',
    };
  }

  if (estado === 409) {
    return {
      errores: {},
      errorGeneral: datos?.mensaje || 'Existe un conflicto con el estado o disponibilidad de la reserva.',
      accion: 'resolver_conflicto',
    };
  }

  if (estado === 429) {
    return {
      errores: {},
      errorGeneral: 'Ha superado el límite de intentos permitidos. Por favor espere un minuto (E-09).',
      accion: 'bloqueo_temporal',
    };
  }

  if (estado >= 500) {
    return {
      errores: {},
      errorGeneral: MENSAJES.ERROR_500,
      accion: 'enfocar_alerta_global',
    };
  }

  // Errores de validación del framework (ProblemDetails: { title, errors })
  const detalle = datos?.errors ? Object.values(datos.errors).flat().join(' ') : null;
  return {
    errores: datos?.errores || {},
    errorGeneral: datos?.mensaje || detalle || datos?.title || null,
    accion: 'procesado',
  };
}
