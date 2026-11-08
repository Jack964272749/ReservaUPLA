import { useSyncExternalStore, useCallback } from 'react';

const CLAVE_TEMA = 'upla_tema';

// Trazabilidad: Shneiderman 2 · Soporte tema claro/oscuro con sincronización reactiva global
// Store atómico con useSyncExternalStore para eliminar parpadeos y desincronizaciones
function leerTemaInicial() {
  try {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem(CLAVE_TEMA);
      if (guardado === 'dark' || guardado === 'light') return guardado;
    }
  } catch {
    // Fallback seguro
  }
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  return 'light';
}

function aplicarTemaAlDOM(nuevoTema) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (nuevoTema === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.removeAttribute('data-theme');
  }
}

let temaActual = leerTemaInicial();
if (typeof document !== 'undefined') {
  aplicarTemaAlDOM(temaActual);
}

const suscriptoresTema = new Set();

function notificarSuscriptoresTema() {
  suscriptoresTema.forEach((cb) => {
    try {
      cb();
    } catch {
      // Ignorar fallos individuales
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CLAVE_TEMA && (e.newValue === 'dark' || e.newValue === 'light')) {
      temaActual = e.newValue;
      aplicarTemaAlDOM(temaActual);
      notificarSuscriptoresTema();
    }
  });
}

function suscribirTema(callback) {
  suscriptoresTema.add(callback);
  return () => {
    suscriptoresTema.delete(callback);
  };
}

function obtenerSnapshotTema() {
  try {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem(CLAVE_TEMA);
      if (guardado === 'dark' || guardado === 'light') return guardado;
    }
  } catch {
    // Fallback
  }
  return temaActual;
}

export function useTema() {
  const tema = useSyncExternalStore(
    suscribirTema,
    obtenerSnapshotTema,
    () => 'light'
  );

  const alternarTema = useCallback(() => {
    const actual = obtenerSnapshotTema();
    const siguiente = actual === 'dark' ? 'light' : 'dark';
    temaActual = siguiente;
    aplicarTemaAlDOM(siguiente);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CLAVE_TEMA, siguiente);
      }
    } catch {
      // Ignorar fallos de localStorage
    }
    notificarSuscriptoresTema();
  }, []);

  return {
    tema,
    alternarTema,
    toggleTema: alternarTema,
  };
}
