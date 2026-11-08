import { useSyncExternalStore } from 'react';

const CLAVE_STORAGE = 'upla_animacion_fondo';

// Trazabilidad: WCAG 2.2.2 (Pausar, detener o esconder) · Control de usuario sobre elementos animados
// Store reactivo global con useSyncExternalStore para eliminar condiciones de carrera y dobles disparos en StrictMode
function leerEstadoInicial() {
  try {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      if (guardado !== null) {
        return guardado === 'true';
      }
    }
  } catch {
    // Fallback ante entornos restringidos o tests
  }
  return true; // Activo por defecto
}

let estadoActual = leerEstadoInicial();
const suscriptores = new Set();

function notificarSuscriptores() {
  suscriptores.forEach((callback) => {
    try {
      callback();
    } catch {
      // Evitar que un suscriptor interrumpa a los demás
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CLAVE_STORAGE && e.newValue !== null) {
      estadoActual = e.newValue === 'true';
      notificarSuscriptores();
    }
  });
}

function suscribir(callback) {
  suscriptores.add(callback);
  return () => {
    suscriptores.delete(callback);
  };
}

function obtenerSnapshot() {
  try {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      if (guardado !== null) {
        return guardado === 'true';
      }
    }
  } catch {
    // Fallback ante entornos restringidos
  }
  return estadoActual;
}

export function useAnimacionFondo() {
  const animacionActiva = useSyncExternalStore(
    suscribir,
    obtenerSnapshot,
    () => true
  );

  const alternarAnimacion = () => {
    const siguiente = !obtenerSnapshot();
    estadoActual = siguiente;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CLAVE_STORAGE, String(siguiente));
      }
    } catch {
      // Ignorar errores de localStorage
    }
    notificarSuscriptores();
  };

  return {
    animacionActiva,
    alternarAnimacion,
  };
}
