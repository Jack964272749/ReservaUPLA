import { useState, useEffect } from 'react';

const CLAVE_STORAGE = 'upla_animacion_fondo';

// Trazabilidad: WCAG 2.2.2 (Pausar, detener o esconder) · Control de usuario sobre elementos animados
export function useAnimacionFondo() {
  const [animacionActiva, setAnimacionActiva] = useState(() => {
    try {
      const guardado = typeof window !== 'undefined' ? localStorage.getItem(CLAVE_STORAGE) : null;
      if (guardado !== null) {
        return guardado === 'true';
      }
    } catch {
      // Fallback ante entornos restringidos o tests
    }
    return true; // Activo por defecto
  });

  const alternarAnimacion = () => {
    setAnimacionActiva((prev) => {
      const nuevoEstado = !prev;
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(CLAVE_STORAGE, String(nuevoEstado));
          // Disparar evento personalizado para sincronizar múltiples lienzos en la misma ventana
          window.dispatchEvent(new CustomEvent('upla_animacion_cambio', { detail: nuevoEstado }));
        }
      } catch {
        // Ignorar errores de localStorage
      }
      return nuevoEstado;
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sincronizarEvento = (e) => {
      if (typeof e.detail === 'boolean') {
        setAnimacionActiva(e.detail);
      }
    };

    const sincronizarStorage = (e) => {
      if (e.key === CLAVE_STORAGE && e.newValue !== null) {
        setAnimacionActiva(e.newValue === 'true');
      }
    };

    window.addEventListener('upla_animacion_cambio', sincronizarEvento);
    window.addEventListener('storage', sincronizarStorage);

    return () => {
      window.removeEventListener('upla_animacion_cambio', sincronizarEvento);
      window.removeEventListener('storage', sincronizarStorage);
    };
  }, []);

  return { animacionActiva, alternarAnimacion };
}
