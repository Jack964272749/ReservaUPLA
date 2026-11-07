import { interpretarRespuesta } from '../utils/interpretarRespuesta';

// Trazabilidad: Nielsen H1 (Visibilidad), H9 (Manejo de errores) · Shneiderman S3, S5
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5159/api';

export async function peticion(endpoint, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 10000);

  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...opciones,
    credentials: 'include',
    signal: controlador.signal,
    headers: {
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
  };

  try {
    const respuesta = await fetch(url, config);
    clearTimeout(temporizador);

    const esJson = respuesta.headers.get('content-type')?.includes('json');
    const datos = esJson ? await respuesta.json() : null;

    if (!respuesta.ok) {
      const interpretacion = interpretarRespuesta(respuesta.status, datos);
      return {
        exito: false,
        estado: respuesta.status,
        datos,
        error: interpretacion.errorGeneral,
        errores: interpretacion.errores,
        accion: interpretacion.accion,
      };
    }

    return {
      exito: true,
      estado: respuesta.status,
      datos,
      error: null,
      errores: {},
    };
  } catch {
    clearTimeout(temporizador);
    const interpretacion = interpretarRespuesta(0, null);
    return {
      exito: false,
      estado: 0,
      datos: null,
      error: interpretacion.errorGeneral,
      errores: {},
      accion: interpretacion.accion,
    };
  }
}
