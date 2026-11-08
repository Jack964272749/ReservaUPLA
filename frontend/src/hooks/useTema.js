import { useState, useEffect, useCallback } from 'react';

const CLAVE_TEMA = 'upla_tema';

// Trazabilidad: Shneiderman 2 · Soporte tema claro/oscuro con sincronización reactiva global
export function useTema() {
  const [tema, setTema] = useState(() => {
    try {
      const guardado = typeof window !== 'undefined' ? localStorage.getItem(CLAVE_TEMA) : null;
      if (guardado === 'dark' || guardado === 'light') return guardado;
    } catch {
      // Manejo seguro
    }
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  const aplicarTema = useCallback((nuevoTema) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (nuevoTema === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(CLAVE_TEMA, nuevoTema);
    } catch {
      // Manejo seguro
    }
  }, []);

  const toggleTema = useCallback(() => {
    setTema((prev) => {
      const siguiente = prev === 'dark' ? 'light' : 'dark';
      aplicarTema(siguiente);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('upla_tema_cambio', { detail: siguiente }));
      }
      return siguiente;
    });
  }, [aplicarTema]);

  useEffect(() => {
    aplicarTema(tema);

    if (typeof window === 'undefined') return;

    const onTemaCambio = (e) => {
      if (e.detail === 'dark' || e.detail === 'light') {
        setTema(e.detail);
        aplicarTema(e.detail);
      }
    };

    const onStorage = (e) => {
      if (e.key === CLAVE_TEMA && (e.newValue === 'dark' || e.newValue === 'light')) {
        setTema(e.newValue);
        aplicarTema(e.newValue);
      }
    };

    window.addEventListener('upla_tema_cambio', onTemaCambio);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('upla_tema_cambio', onTemaCambio);
      window.removeEventListener('storage', onStorage);
    };
  }, [tema, aplicarTema]);

  return {
    tema,
    alternarTema: toggleTema,
    toggleTema,
  };
}
