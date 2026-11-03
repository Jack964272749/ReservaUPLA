import { useState, useEffect } from 'react';

// Trazabilidad: Shneiderman 2 · Soporte tema claro/oscuro con almacenamiento seguro
export function useTema() {
  const [tema, setTema] = useState(() => {
    try {
      const guardado = localStorage.getItem('upla_tema');
      if (guardado) return guardado;
    } catch {
      // Ignorar fallo de acceso a storage
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (tema === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    try {
      localStorage.setItem('upla_tema', tema);
    } catch {
      // Manejo seguro
    }
  }, [tema]);

  const toggleTema = () => {
    setTema((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { tema, toggleTema };
}
