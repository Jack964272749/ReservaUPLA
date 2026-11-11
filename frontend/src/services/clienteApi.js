import { interpretarRespuesta } from '../utils/interpretarRespuesta';

// Trazabilidad: Nielsen H1 (Visibilidad), H9 (Manejo de errores) · Shneiderman S3, S5
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5159/api';

// Trazabilidad: Nielsen H1 (Visibilidad) · H9 (Recuperación) · ISO 9241-11
// El plan gratuito de Render suspende la API tras ~15 min sin tráfico y el
// primer arranque en frío puede tardar hasta ~60 s. Un corte a los 10 s
// mostraba el E-23 aunque la conexión del usuario fuese correcta.
export const TIEMPO_ESPERA_MS = 90000;

export async function peticion(endpoint, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIEMPO_ESPERA_MS);

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
