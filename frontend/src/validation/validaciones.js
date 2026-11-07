import { REGLAS } from '../constants/reglas';
import { MENSAJES } from '../constants/mensajes';
import { obtenerFechaLocalISO } from '../utils/fecha';

// Trazabilidad: ISO 9241-11 Eficacia · Validación cliente de primer nivel
export function validarCorreo(correo) {
  if (!correo || !correo.trim()) return MENSAJES.CORREO_REQUERIDO;
  if (!REGLAS.USUARIO.REGEX_CORREO.test(correo.trim())) return MENSAJES.CORREO_INVALIDO;
  return null;
}

export function validarNombre(nombre) {
  if (!nombre || !nombre.trim()) return MENSAJES.NOMBRE_REQUERIDO;
  const n = nombre.trim();
  if (n.length < REGLAS.USUARIO.MIN_NOMBRE || n.length > REGLAS.USUARIO.MAX_NOMBRE)
    return MENSAJES.NOMBRE_LONGITUD;
  if (!REGLAS.USUARIO.REGEX_NOMBRE.test(n)) return MENSAJES.NOMBRE_INVALIDO;
  return null;
}

export function validarClave(clave) {
  if (!clave) return MENSAJES.CLAVE_REQUERIDA;
  if (clave.length < REGLAS.USUARIO.MIN_CLAVE || clave.length > REGLAS.USUARIO.MAX_CLAVE)
    return MENSAJES.CLAVE_LONGITUD;
  return null;
}

export function validarFormularioReserva({ fecha, horaInicio, horaFin, motivo, ambienteId }) {
  const errores = {};
  const hoy = obtenerFechaLocalISO();

  if (!ambienteId) errores.ambienteId = 'Seleccione el ambiente a reservar.';
  if (!fecha) errores.fecha = MENSAJES.FECHA_REQUERIDA;
  else if (fecha < hoy) errores.fecha = MENSAJES.FECHA_PASADA;

  if (!horaInicio) errores.horaInicio = MENSAJES.HORA_INICIO_REQUERIDA;
  if (!horaFin) errores.horaFin = MENSAJES.HORA_FIN_REQUERIDA;

  if (horaInicio && horaFin) {
    if (horaFin <= horaInicio) {
      errores.horaFin = MENSAJES.HORA_FIN_MENOR;
    }
    if (horaInicio < REGLAS.RESERVA.HORA_APERTURA) {
      errores.horaInicio = MENSAJES.HORA_FUERA_RANGO;
    }
    if (horaFin > REGLAS.RESERVA.HORA_CIERRE) {
      errores.horaFin = MENSAJES.HORA_FUERA_RANGO;
    }
  }

  if (!motivo || motivo.trim().length < REGLAS.RESERVA.MIN_MOTIVO) {
    errores.motivo = MENSAJES.MOTIVO_REQUERIDO;
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
}

// Trazabilidad: RF-02 · Validación de creación de ambientes
export function validarAmbiente({ nombre, tipo, capacidad, ubicacion }) {
  const errores = {};
  const nom = nombre ? nombre.trim() : '';
  const ubi = ubicacion ? ubicacion.trim() : '';
  const cap = Number(capacidad);

  if (!nom) {
    errores.nombre = MENSAJES.AMBIENTE_NOMBRE_REQUERIDO;
  } else if (nom.length < REGLAS.AMBIENTE.MIN_NOMBRE || nom.length > REGLAS.AMBIENTE.MAX_NOMBRE) {
    errores.nombre = MENSAJES.AMBIENTE_NOMBRE_LONGITUD;
  }

  if (!tipo) {
    errores.tipo = MENSAJES.AMBIENTE_TIPO_REQUERIDO;
  }

  if (isNaN(cap) || cap < REGLAS.AMBIENTE.MIN_CAPACIDAD || cap > REGLAS.AMBIENTE.MAX_CAPACIDAD) {
    errores.capacidad = MENSAJES.AMBIENTE_CAPACIDAD_INVALIDA;
  }

  if (!ubi) {
    errores.ubicacion = MENSAJES.AMBIENTE_UBICACION_REQUERIDA;
  } else if (ubi.length > REGLAS.AMBIENTE.MAX_UBICACION) {
    errores.ubicacion = MENSAJES.AMBIENTE_UBICACION_LONGITUD;
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
    errores,
  };
}
